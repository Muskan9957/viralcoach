import { useState, useRef, useEffect, useCallback } from 'react'
import { api } from '../api'
import { useToast } from '../components/Toast'
import { getSavedRegion } from '../utils/detectRegion'

/* ─── helpers ──────────────────────────────────────────────────── */
const readImageAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const extractVideoFrames = (file, numFrames = 4) =>
  new Promise((resolve, reject) => {
    const video  = document.createElement('video')
    const url    = URL.createObjectURL(file)
    video.src    = url
    video.muted  = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      const duration = video.duration
      if (!isFinite(duration) || duration === 0) {
        URL.revokeObjectURL(url)
        return reject(new Error('Could not read video duration'))
      }
      const canvas = document.createElement('canvas')
      canvas.width  = 720
      canvas.height = Math.round(720 * (video.videoHeight / video.videoWidth)) || 405
      const ctx     = canvas.getContext('2d')
      const times   = Array.from({ length: numFrames }, (_, i) =>
        Math.min(((i + 0.5) / numFrames) * duration, duration - 0.1)
      )
      const frames  = []
      let idx = 0

      const next = () => { video.currentTime = times[idx] }

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        frames.push(canvas.toDataURL('image/jpeg', 0.78).split(',')[1])
        idx++
        if (idx >= times.length) { URL.revokeObjectURL(url); resolve(frames) }
        else next()
      }
      video.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not load video')) }
      next()
    }
    video.onerror = () => reject(new Error('Could not load file'))
    video.load()
  })

const AUDIENCES = ['India','US','UK','Middle East','Southeast Asia','Global']
const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'pt', label: 'Portuguese' },
]

const LOADING_STAGES = [
  'Reading your content…',
  'Writing your script & captions…',
  'Picking the perfect songs…',
]

/* ─── component ─────────────────────────────────────────────────── */
export default function ReelReady() {
  const toast = useToast()

  // file state
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [fileType, setFileType] = useState(null) // 'image' | 'video'
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  // form
  const [audience, setAudience] = useState(getSavedRegion() || 'India')
  const [language, setLanguage] = useState('en')

  // loading
  const [loading, setLoading]           = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const stageTimerRef = useRef(null)

  // result
  const [result, setResult]           = useState(null)
  const [activeCaption, setActiveCaption] = useState(0)
  const [copied, setCopied]           = useState(null)

  // song player (same as Generate.jsx)
  const [playingKey, setPlayingKey]       = useState(null)
  const [audioProgress, setAudioProgress] = useState(0)
  const audioRef    = useRef(null)
  const progressRef = useRef(null)

  const stopAudio = () => {
    if (audioRef.current)   { audioRef.current.pause(); audioRef.current = null }
    if (progressRef.current){ clearInterval(progressRef.current); progressRef.current = null }
    setPlayingKey(null); setAudioProgress(0)
  }
  useEffect(() => () => { stopAudio(); if (stageTimerRef.current) clearInterval(stageTimerRef.current) }, []) // eslint-disable-line

  const togglePlay = (song) => {
    const key = song.title + song.artist
    if (playingKey === key) { stopAudio(); return }
    stopAudio()
    if (!song.previewUrl) return
    const audio = new Audio(song.previewUrl)
    audio.play().catch(() => {})
    audioRef.current = audio
    setPlayingKey(key)
    setAudioProgress(0)
    audio.onended = () => { setPlayingKey(null); setAudioProgress(0); if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null } }
    progressRef.current = setInterval(() => {
      if (!audioRef.current) return
      const pct = (audioRef.current.currentTime / (audioRef.current.duration || 30)) * 100
      setAudioProgress(isNaN(pct) ? 0 : pct)
    }, 150)
  }

  /* ── file handling ─────────────────────────────────────────────── */
  const handleFile = useCallback((f) => {
    if (!f) return
    const isVideo = f.type.startsWith('video/')
    const isImage = f.type.startsWith('image/')
    if (!isVideo && !isImage) { toast('Please upload an image or video file', 'error'); return }
    if (f.size > 80 * 1024 * 1024) { toast('File too large — max 80 MB', 'error'); return }
    setFile(f)
    setFileType(isVideo ? 'video' : 'image')
    setPreview(URL.createObjectURL(f))
    setResult(null)
    stopAudio()
  }, [toast]) // eslint-disable-line

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  /* ── analyse ───────────────────────────────────────────────────── */
  const analyse = async () => {
    if (!file) return
    setLoading(true)
    setLoadingStage(0)
    setResult(null)
    stopAudio()

    // cycle loading stage labels
    let stage = 0
    stageTimerRef.current = setInterval(() => {
      stage = Math.min(stage + 1, LOADING_STAGES.length - 1)
      setLoadingStage(stage)
    }, 3500)

    try {
      let frames, mediaTypes
      if (fileType === 'video') {
        frames     = await extractVideoFrames(file, 4)
        mediaTypes = frames.map(() => 'image/jpeg')
      } else {
        frames     = [await readImageAsBase64(file)]
        mediaTypes = [file.type]
      }

      const data = await api.reelReady({ frames, mediaTypes, audience, language })

      // Enrich songs with iTunes 30s previews
      const country  = audience === 'India' ? 'in' : 'us'
      const enriched = await Promise.all(
        (data.songs || []).map(async (song) => {
          try {
            const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(song.title + ' ' + song.artist)}&entity=song&limit=1&country=${country}`)
            const d = await r.json()
            const hit = d.results?.[0]
            return { ...song, previewUrl: hit?.previewUrl || null, artworkUrl: hit?.artworkUrl60?.replace('60x60','100x100') || null }
          } catch { return song }
        })
      )

      setResult({ ...data, songs: enriched })
    } catch (err) {
      toast(err.message || 'Something went wrong', 'error')
    } finally {
      clearInterval(stageTimerRef.current)
      setLoading(false)
    }
  }

  /* ── copy helper ───────────────────────────────────────────────── */
  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
    toast('Copied!', 'success')
  }

  const copyAllHashtags = () => {
    if (!result?.analysis?.hashtags) return
    const { niche, broad, trending } = result.analysis.hashtags
    copy([...niche, ...broad, ...trending].join(' '), 'hashtags-all')
  }

  /* ── download ──────────────────────────────────────────────────── */
  const download = () => {
    const { analysis, songs } = result
    const lines = [
      '═══════════════════════════════════════',
      '         REEL READY — POST PACKAGE',
      '═══════════════════════════════════════',
      '',
      `Topic : ${analysis.topic}`,
      `Niche : ${analysis.niche}`,
      `Best time: ${analysis.bestTime} · ${analysis.bestDay}`,
      '',
      '─── VOICEOVER SCRIPT ───────────────────',
      analysis.script,
      '',
      '─── CAPTIONS ───────────────────────────',
      ...(analysis.captions || []).map(c => `[${c.label}]\n${c.text}\n`),
      '─── HASHTAGS ───────────────────────────',
      'Niche:    ' + (analysis.hashtags?.niche    || []).join(' '),
      'Broad:    ' + (analysis.hashtags?.broad    || []).join(' '),
      'Trending: ' + (analysis.hashtags?.trending || []).join(' '),
      '',
      '─── MUSIC PICKS ────────────────────────',
      ...(songs || []).map(s => `${s.title} — ${s.artist}${s.royaltyFree ? ` [${s.library}]` : ''}`),
      '',
      '═══════════════════════════════════════',
      '  Generated by ViralCoach.ai',
      '═══════════════════════════════════════',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `reel-ready-${Date.now()}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  /* ── styles ────────────────────────────────────────────────────── */
  const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '20px 22px',
    marginBottom: 14,
  }
  const labelStyle = {
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8,
  }
  const copyBtnStyle = (key) => ({
    padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)',
    background: copied === key ? 'rgba(29,185,84,0.12)' : 'var(--surface2)',
    color: copied === key ? '#1DB954' : 'var(--text-muted)',
    fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
  })

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div className="page-enter" style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 60 }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Reel Ready</h1>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 99,
            background: 'linear-gradient(135deg,rgba(252,175,69,0.15),rgba(225,48,108,0.12),rgba(131,58,180,0.10))',
            border: '1px solid rgba(225,48,108,0.25)', color: '#E1306C',
          }}>New</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 540, margin: 0 }}>
          Upload your photo or video. Get a complete Instagram-ready package — script, captions, hashtags &amp; music — in seconds.
        </p>
      </div>

      {/* ── Upload zone ──────────────────────────────────────────── */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#E1306C' : 'rgba(225,48,108,0.35)'}`,
            borderRadius: 20,
            padding: '52px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging
              ? 'linear-gradient(135deg,rgba(252,175,69,0.06),rgba(225,48,108,0.06),rgba(131,58,180,0.04))'
              : 'var(--surface)',
            transition: 'all 0.2s',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: '2.8rem', marginBottom: 14, lineHeight: 1 }}>📲</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: 8 }}>
            Drop your photo or video here
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 18 }}>
            or click to browse · JPG, PNG, WebP, MP4, MOV · up to 80 MB
          </div>
          <span style={{
            display: 'inline-block', padding: '10px 28px', borderRadius: 25,
            background: 'linear-gradient(135deg,#FCAF45,#E1306C 55%,#833AB4)',
            color: '#fff', fontWeight: 700, fontSize: '0.88rem',
            boxShadow: '0 4px 18px rgba(225,48,108,0.3)',
          }}>
            Choose File
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        /* ── Preview + settings ───────────────────────────────── */
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Thumbnail */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {fileType === 'image'
                ? <img src={preview} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, display: 'block' }} />
                : (
                  <video src={preview} muted style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, display: 'block' }} />
                )
              }
              <button
                onClick={() => { setFile(null); setPreview(null); setFileType(null); setResult(null); stopAudio() }}
                style={{
                  position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%',
                  background: '#E1306C', color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>

            {/* File info + settings */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 3 }}>
                {file.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginBottom: 14 }}>
                {fileType === 'video' ? '🎥 Video' : '🖼 Image'} · {(file.size / 1024 / 1024).toFixed(1)} MB
              </div>

              {/* Settings row */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ ...labelStyle, marginBottom: 4 }}>Audience</div>
                  <select
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                    className="select"
                    style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                  >
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ ...labelStyle, marginBottom: 4 }}>Language</div>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="select"
                    style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                  >
                    {LANG_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Analyse button */}
          <button
            onClick={analyse}
            disabled={loading}
            style={{
              marginTop: 18, width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              background: loading
                ? 'var(--surface2)'
                : 'linear-gradient(135deg,#FCAF45 0%,#F56040 35%,#E1306C 65%,#833AB4 100%)',
              color: loading ? 'var(--text-muted)' : '#fff',
              fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'default' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(225,48,108,0.35)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 14, height: 14, borderTopColor: 'var(--text-muted)' }} />{LOADING_STAGES[loadingStage]}</>
            ) : (
              <>✦ Analyse &amp; Build Package</>
            )}
          </button>
        </div>
      )}

      {/* ══ RESULTS ══════════════════════════════════════════════════ */}
      {result && (() => {
        const { analysis, songs } = result
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* ── What AI sees ────────────────────────────────────── */}
            <div style={{ ...cardStyle, borderLeft: '3px solid rgba(252,175,69,0.6)' }}>
              <div style={labelStyle}>👁 What the AI sees</div>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
                {analysis.contentUnderstanding}
              </p>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {analysis.niche && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(252,175,69,0.12)', color: '#FCAF45', border: '1px solid rgba(252,175,69,0.25)' }}>{analysis.niche}</span>}
                {analysis.tone  && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(225,48,108,0.10)', color: '#E1306C',  border: '1px solid rgba(225,48,108,0.22)' }}>{analysis.tone}</span>}
                {analysis.mood  && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(131,58,180,0.10)', color: '#C13584', border: '1px solid rgba(131,58,180,0.22)' }}>{analysis.mood}</span>}
              </div>
            </div>

            {/* ── Script ──────────────────────────────────────────── */}
            <div style={{ ...cardStyle, borderLeft: '3px solid rgba(0,200,255,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={labelStyle}>📝 Voiceover Script</div>
                <button style={copyBtnStyle('script')} onClick={() => copy(analysis.script, 'script')}>
                  {copied === 'script' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p style={{
                margin: 0, fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.75,
                background: 'var(--surface2)', padding: '14px 16px', borderRadius: 10,
                whiteSpace: 'pre-wrap',
              }}>
                {analysis.script}
              </p>
            </div>

            {/* ── Captions ────────────────────────────────────────── */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={labelStyle}>📱 Captions</div>
                <button style={copyBtnStyle(`caption-${activeCaption}`)} onClick={() => copy(analysis.captions[activeCaption]?.text, `caption-${activeCaption}`)}>
                  {copied === `caption-${activeCaption}` ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              {/* Tab buttons */}
              <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
                {(analysis.captions || []).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCaption(i)}
                    style={{
                      padding: '6px 16px', borderRadius: 20, border: '1px solid',
                      borderColor: activeCaption === i ? '#E1306C' : 'var(--border)',
                      background: activeCaption === i ? 'rgba(225,48,108,0.1)' : 'transparent',
                      color: activeCaption === i ? '#E1306C' : 'var(--text-muted)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >{c.label}</button>
                ))}
              </div>
              <p style={{
                margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7,
                background: 'var(--surface2)', padding: '13px 15px', borderRadius: 10,
                whiteSpace: 'pre-wrap', minHeight: 60,
              }}>
                {analysis.captions?.[activeCaption]?.text || ''}
              </p>
            </div>

            {/* ── Hashtags ─────────────────────────────────────────── */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={labelStyle}>#️⃣ Hashtags · 30 tags</div>
                <button style={copyBtnStyle('hashtags-all')} onClick={copyAllHashtags}>
                  {copied === 'hashtags-all' ? '✓ Copied All' : 'Copy All'}
                </button>
              </div>
              {[
                { key: 'niche',    label: 'Niche',    color: '#FCAF45' },
                { key: 'broad',    label: 'Broad',    color: '#E1306C' },
                { key: 'trending', label: 'Trending', color: '#833AB4' },
              ].map(({ key, label, color }) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
                    <button style={{ ...copyBtnStyle(`ht-${key}`), fontSize: '0.66rem', padding: '2px 8px' }} onClick={() => copy((analysis.hashtags?.[key] || []).join(' '), `ht-${key}`)}>
                      {copied === `ht-${key}` ? '✓' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(analysis.hashtags?.[key] || []).map((tag, i) => (
                      <span key={i} style={{
                        fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                        background: `${color}12`, color, border: `1px solid ${color}28`,
                        cursor: 'pointer',
                      }} onClick={() => copy(tag, `tag-${tag}`)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Best Time ─────────────────────────────────────────── */}
            {(analysis.bestTime || analysis.bestDay) && (
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg,rgba(252,175,69,0.2),rgba(225,48,108,0.15))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                }}>⏰</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                    {analysis.bestTime}
                    {analysis.bestDay && ` · ${analysis.bestDay}`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Best time to post for maximum reach</div>
                </div>
              </div>
            )}

            {/* ── Songs ─────────────────────────────────────────────── */}
            {songs && songs.length > 0 && (
              <div style={{ ...cardStyle, borderLeft: '3px solid #34D399' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.1rem' }}>🎵</span>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Music Picks</div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>tap to preview 30s</span>
                </div>
                {[
                  { label: '🔥 Popular', items: songs.filter(s => !s.royaltyFree) },
                  { label: '🆓 Royalty-Free', items: songs.filter(s => s.royaltyFree) },
                ].map(sec => sec.items.length > 0 && (
                  <div key={sec.label} style={{ marginBottom: 14 }}>
                    <div style={{ ...labelStyle, marginBottom: 8 }}>{sec.label}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {sec.items.map((song, i) => {
                        const skey = song.title + song.artist
                        const isPlaying = playingKey === skey
                        const canPlay   = !!song.previewUrl
                        return (
                          <div key={i} style={{
                            background: isPlaying ? (song.royaltyFree ? 'rgba(29,185,84,0.10)' : 'rgba(252,175,69,0.08)') : (song.royaltyFree ? 'rgba(29,185,84,0.04)' : 'rgba(255,255,255,0.02)'),
                            border: `1px solid ${isPlaying ? (song.royaltyFree ? 'rgba(29,185,84,0.45)' : 'rgba(252,175,69,0.45)') : (song.royaltyFree ? 'rgba(29,185,84,0.18)' : 'var(--border)')}`,
                            borderRadius: 12, padding: '11px 13px', transition: 'border-color 0.2s, background 0.2s',
                          }}>
                            <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                              <div onClick={() => canPlay && togglePlay(song)} style={{ width: 42, height: 42, borderRadius: 9, flexShrink: 0, position: 'relative', overflow: 'hidden', cursor: canPlay ? 'pointer' : 'default', background: song.artworkUrl ? 'transparent' : (song.royaltyFree ? 'linear-gradient(135deg,rgba(29,185,84,0.3),rgba(29,185,84,0.1))' : 'linear-gradient(135deg,rgba(252,175,69,0.25),rgba(225,48,108,0.15))') }}>
                                {song.artworkUrl && <img src={song.artworkUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />}
                                {canPlay && <div style={{ position: 'absolute', inset: 0, borderRadius: 9, background: isPlaying ? 'rgba(0,0,0,0.5)' : (song.artworkUrl ? 'rgba(0,0,0,0.25)' : 'transparent'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isPlaying ? '0.9rem' : '1rem' }}>{isPlaying ? '⏸' : '▶'}</div>}
                                {!canPlay && !song.artworkUrl && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎵</div>}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: isPlaying ? 5 : 4, flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.87rem', color: 'var(--text)' }}>{song.title}</span>
                                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>· {song.artist}</span>
                                  {isPlaying && <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: song.royaltyFree ? '#1DB954' : '#FCAF45', color: '#000' }}>♪ PLAYING</span>}
                                </div>
                                {isPlaying && <div style={{ marginBottom: 6, height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, background: song.royaltyFree ? 'linear-gradient(90deg,#1DB954,#17A44A)' : 'linear-gradient(90deg,#FCAF45,#E1306C)', width: `${audioProgress}%`, transition: 'width 0.15s linear' }} /></div>}
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  {song.royaltyFree && song.library && <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: 'rgba(29,185,84,0.12)', color: '#1DB954', border: '1px solid rgba(29,185,84,0.22)' }}>🆓 {song.library}</span>}
                                  {canPlay && <span style={{ fontSize: '0.66rem', color: 'var(--text-faint)' }}>30s preview</span>}
                                  {song.searchUrl && <a href={song.searchUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: 99, background: song.royaltyFree ? 'rgba(29,185,84,0.10)' : 'rgba(252,175,69,0.10)', color: song.royaltyFree ? '#1DB954' : '#FCAF45', border: `1px solid ${song.royaltyFree ? 'rgba(29,185,84,0.28)' : 'rgba(252,175,69,0.28)'}`, textDecoration: 'none' }}>Full ↗</a>}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Download ──────────────────────────────────────────── */}
            <button
              onClick={download}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: '1px solid rgba(252,175,69,0.35)',
                background: 'linear-gradient(135deg,rgba(252,175,69,0.08),rgba(225,48,108,0.06),rgba(131,58,180,0.04))',
                color: 'var(--text)', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
              }}
            >
              ⬇︎ Download Complete Package (.txt)
            </button>
          </div>
        )
      })()}
    </div>
  )
}

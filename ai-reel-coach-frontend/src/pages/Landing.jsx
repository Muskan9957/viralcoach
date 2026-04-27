import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLang } from '../i18n.jsx'

/* ─── Language flip button ───────────────────────────────────────── */
function LangFlip() {
  const { lang, setLanguage } = useLang()
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 99, padding: 3,
    }}>
      {[
        { code: 'en', label: 'EN'  },
        { code: 'hi', label: 'हिं' },
      ].map(o => {
        const active = lang === o.code
        return (
          <button
            key={o.code}
            type="button"
            onClick={() => !active && setLanguage(o.code)}
            aria-pressed={active}
            style={{
              border: 'none', cursor: active ? 'default' : 'pointer',
              padding: '4px 11px', borderRadius: 99,
              background: active ? 'linear-gradient(135deg, #00D4FF, #FF2D8B)' : 'transparent',
              color: active ? '#fff' : 'var(--text-muted)',
              fontFamily: o.code === 'hi' ? 'var(--font-body)' : 'var(--font-mono)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
              transition: 'background 0.18s, color 0.18s',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Social Feed Showcase ───────────────────────────────────────── */
function SocialFeedShowcase() {
  return (
    <div className="sfs-wrap">
      {/* Ambient glows */}
      <div className="sfs-glow sfs-glow-pink"  aria-hidden />
      <div className="sfs-glow sfs-glow-cyan"  aria-hidden />
      <div className="sfs-glow sfs-glow-amber" aria-hidden />

      {/* ── Main phone (Reels-style) ─────────────────────────────── */}
      <div className="sfs-phone">
        <div className="sfs-screen">

          {/* Status bar */}
          <div className="sfs-status-bar">
            <span>9:41</span>
            <div style={{ display:'flex', gap:4, alignItems:'center' }}>
              <span style={{ fontSize:'0.45rem' }}>●●●●</span>
              <span style={{ fontSize:'0.55rem' }}>🔋</span>
            </div>
          </div>

          {/* Full-screen reel gradient "video" */}
          <div className="sfs-reel">
            <div className="sfs-reel-bg" />

            {/* Top row: views + live badge */}
            <div className="sfs-reel-top">
              <div className="sfs-live-badge">
                <span className="sfs-live-dot" />
                LIVE
              </div>
              <div className="sfs-view-count">
                <span className="sfs-eye">👁</span> 2.4M
              </div>
            </div>

            {/* Center "video content" feel */}
            <div className="sfs-reel-mid">
              <div className="sfs-big-emoji">💪</div>
              <div className="sfs-text-sticker">5 AM Club</div>
              <div className="sfs-sub-sticker">#FitnessIndia #Viral</div>
            </div>

            {/* Right: action buttons */}
            <div className="sfs-reel-actions">
              <div className="sfs-action">
                <div className="sfs-action-btn sfs-heart-btn">❤️</div>
                <div className="sfs-action-num">847K</div>
              </div>
              <div className="sfs-action">
                <div className="sfs-action-btn">💬</div>
                <div className="sfs-action-num">12.1K</div>
              </div>
              <div className="sfs-action">
                <div className="sfs-action-btn">↗</div>
                <div className="sfs-action-num">Share</div>
              </div>
              <div className="sfs-action">
                <div className="sfs-action-btn sfs-spin-disc">🎵</div>
              </div>
            </div>

            {/* Bottom: creator info */}
            <div className="sfs-reel-bottom">
              <div className="sfs-creator-row">
                <div className="sfs-avatar-ring">
                  <div className="sfs-avatar-letter" style={{ background: 'linear-gradient(135deg,#FF6B35,#FF2D8B)' }}>P</div>
                </div>
                <div>
                  <div className="sfs-handle">@priya_creates</div>
                  <div className="sfs-follow-btn">+ Follow</div>
                </div>
              </div>
              <div className="sfs-caption">This 5 AM routine changed everything for me 🔥</div>
              <div className="sfs-audio-pill">🎵 Original audio · priya_creates</div>
            </div>

            {/* Progress bar */}
            <div className="sfs-progress">
              <div className="sfs-progress-fill" />
            </div>

            {/* Emoji reactions floating up */}
            <div className="sfs-floaty-emojis" aria-hidden>
              <span className="sfs-fe sfs-fe1">❤️</span>
              <span className="sfs-fe sfs-fe2">🔥</span>
              <span className="sfs-fe sfs-fe3">❤️</span>
              <span className="sfs-fe sfs-fe4">😍</span>
              <span className="sfs-fe sfs-fe5">💯</span>
              <span className="sfs-fe sfs-fe6">❤️</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Second card peeking behind (depth effect) ─────────────── */}
      <div className="sfs-back-card" aria-hidden>
        <div className="sfs-back-thumb" />
        <div className="sfs-back-meta">
          <div className="sfs-avatar-letter sfs-avatar-sm" style={{ background: 'linear-gradient(135deg,#0072FF,#00D4FF)' }}>R</div>
          <div>
            <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.85)', fontWeight:700 }}>@rahul.tech</div>
            <div style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.5)' }}>❤️ 234K · 💬 4.2K</div>
          </div>
        </div>
      </div>

      {/* ── Floating card: Hook Score ─────────────────────────────── */}
      <div className="sfs-chip sfs-chip-score">
        <div className="sfs-chip-icon">🎯</div>
        <div>
          <div className="sfs-chip-label">Hook Score</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span className="sfs-chip-big">94</span>
            <span className="sfs-chip-unit">/ 100</span>
          </div>
          <div className="sfs-score-track">
            <div className="sfs-score-bar" />
          </div>
        </div>
      </div>

      {/* ── Floating card: Trending ───────────────────────────────── */}
      <div className="sfs-chip sfs-chip-trend">
        🔥 &nbsp;Trending #1 India
      </div>

      {/* ── Floating card: Live likes ─────────────────────────────── */}
      <div className="sfs-chip sfs-chip-likes">
        <div style={{ fontSize:'1rem' }}>❤️</div>
        <div>
          <div className="sfs-chip-big" style={{ fontSize:'1rem' }}>847,291</div>
          <div className="sfs-chip-label sfs-live-label">
            <span className="sfs-live-dot sfs-live-dot-sm" />
            live count
          </div>
        </div>
      </div>

      {/* ── Floating hearts (outside phone) ──────────────────────── */}
      <div className="sfs-ext-hearts" aria-hidden>
        <span className="sfs-eh sfs-eh1">❤️</span>
        <span className="sfs-eh sfs-eh2">🧡</span>
        <span className="sfs-eh sfs-eh3">❤️</span>
        <span className="sfs-eh sfs-eh4">🔥</span>
        <span className="sfs-eh sfs-eh5">😍</span>
      </div>

      {/* ── Story rings row ───────────────────────────────────────── */}
      <div className="sfs-stories" aria-hidden>
        {[
          { letter:'A', grad:'linear-gradient(135deg,#A8FF3C,#00D4FF)', label:'ananya' },
          { letter:'V', grad:'linear-gradient(135deg,#A855F7,#FF2D8B)', label:'viral' },
          { letter:'K', grad:'linear-gradient(135deg,#FFB800,#FF5F4C)', label:'karan' },
        ].map(s => (
          <div key={s.letter} className="sfs-story">
            <div className="sfs-story-ring" style={{ '--sg': s.grad }}>
              <div className="sfs-story-av" style={{ background: s.grad }}>{s.letter}</div>
            </div>
            <div className="sfs-story-name">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Landing Page ───────────────────────────────────────────────── */
export default function Landing() {
  const { t } = useLang()
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', overflowX:'hidden', display:'flex', flexDirection:'column' }}>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 5%',
        background:'rgba(7,9,28,0.92)',
        backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        position:'sticky', top:0, zIndex:100,
      }}>
        <Logo size={42} showWordmark />
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <LangFlip />
          <Link
            to="/auth"
            style={{
              fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.875rem',
              color:'var(--text-muted)', textDecoration:'none',
              padding:'8px 16px', borderRadius:10,
              border:'1px solid var(--border)', background:'transparent',
              transition:'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.background = 'var(--surface2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {t('landing_signin')}
          </Link>
          <Link to="/auth" className="btn btn-primary btn-sm" style={{ textDecoration:'none' }}>
            {t('landing_get_started')}
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero-split">
        <div className="hero-bg" aria-hidden>
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        {/* Left: headline */}
        <div className="hero-text">
          <h1 className="hero-h1">
            {t('landing_h1_a')}{' '}
            <span className="hero-h1-grad">{t('landing_h1_b')}</span>
          </h1>
          <p className="hero-sub">{t('landing_sub')}</p>
          <div className="hero-ctas">
            <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration:'none', minWidth:180 }}>
              {t('landing_cta_primary')}
            </Link>
          </div>
        </div>

        {/* Right: social feed showcase */}
        <div className="hero-visual">
          <SocialFeedShowcase />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop:'1px solid var(--border)',
        padding:'20px 5%',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:14, background:'var(--surface)',
        marginTop:'auto',
      }}>
        <div style={{ fontSize:'0.74rem', color:'var(--text-faint)', fontFamily:'var(--font-mono)', letterSpacing:'0.02em' }}>
          {t('landing_footer_legal')}
        </div>
        <div style={{ display:'flex', gap:18 }}>
          <Link to="/privacy" style={{ fontSize:'0.74rem', color:'var(--text-faint)', textDecoration:'none' }}>{t('landing_privacy')}</Link>
          <Link to="/terms"   style={{ fontSize:'0.74rem', color:'var(--text-faint)', textDecoration:'none' }}>{t('landing_terms')}</Link>
        </div>
      </footer>

      {/* ── All styles ───────────────────────────────────────────── */}
      <style>{`
        /* ══════════════════════════════════════════════════
           HERO LAYOUT
        ══════════════════════════════════════════════════ */
        .hero-split {
          position: relative;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 40px 5% 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          min-height: calc(100vh - 130px);
        }
        .hero-bg { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0; }
        .hero-orb { position:absolute; border-radius:50%; filter:blur(70px); }
        .hero-orb-1 { top:-5%; left:-8%; width:500px; height:400px;
          background:radial-gradient(ellipse, rgba(0,212,255,0.11) 0%, transparent 65%); }
        .hero-orb-2 { bottom:0; right:-8%; width:500px; height:400px;
          background:radial-gradient(ellipse, rgba(255,45,139,0.13) 0%, transparent 65%); }
        .hero-orb-3 { top:35%; left:42%; width:400px; height:300px;
          background:radial-gradient(ellipse, rgba(255,184,0,0.07) 0%, transparent 65%); }

        .hero-text {
          position:relative; z-index:1;
          animation: fadeUp 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hero-h1 {
          font-family: var(--font-head);
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 4rem);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text);
          margin: 0 0 20px;
        }
        .hero-h1-grad {
          background: linear-gradient(135deg, #00D4FF 0%, #FF2D8B 55%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          filter: drop-shadow(0 0 36px rgba(255,45,139,0.30));
        }
        .hero-sub {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 460px;
          margin: 0 0 30px;
        }
        .hero-ctas { display:flex; gap:12px; flex-wrap:wrap; }
        .hero-visual {
          position:relative; z-index:1;
          display:flex; align-items:center; justify-content:center;
          animation: fadeUp 0.6s 0.18s cubic-bezier(0.22,1,0.36,1) both;
          min-height: 600px;
        }

        @media (max-width: 860px) {
          .hero-split { grid-template-columns:1fr; gap:28px; text-align:center; padding-top:28px; min-height:auto; }
          .hero-text { order:1; }
          .hero-visual { order:2; min-height:520px; }
          .hero-sub { margin-left:auto; margin-right:auto; }
          .hero-ctas { justify-content:center; }
        }

        /* ══════════════════════════════════════════════════
           SFS — SOCIAL FEED SHOWCASE
        ══════════════════════════════════════════════════ */
        .sfs-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 580px;
        }

        /* Ambient glows */
        .sfs-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .sfs-glow-pink  { width:380px; height:380px; top:-8%; right:0;
          background: radial-gradient(ellipse, rgba(255,45,139,0.22) 0%, transparent 65%); }
        .sfs-glow-cyan  { width:280px; height:280px; bottom:0; left:8%;
          background: radial-gradient(ellipse, rgba(0,212,255,0.18) 0%, transparent 65%); }
        .sfs-glow-amber { width:220px; height:220px; bottom:20%; right:10%;
          background: radial-gradient(ellipse, rgba(255,184,0,0.14) 0%, transparent 65%); }

        /* ── Phone frame ─────────────────────────── */
        .sfs-phone {
          position: relative;
          z-index: 2;
          width: 250px;
          height: 530px;
          background: #06070F;
          border-radius: 38px;
          box-shadow:
            0 60px 120px rgba(0,0,0,0.65),
            0 0 0 1.5px rgba(255,255,255,0.07),
            0 0 80px rgba(255,45,139,0.20),
            0 0 40px rgba(0,212,255,0.12);
          padding: 10px;
          transform: rotateY(-6deg) rotateX(2deg);
          animation: sfsFloat 6s ease-in-out infinite;
          margin-right: 30px;
        }
        @keyframes sfsFloat {
          0%,100% { transform:rotateY(-6deg) rotateX(2deg) translateY(0px); }
          50%      { transform:rotateY(-6deg) rotateX(2deg) translateY(-10px); }
        }

        .sfs-screen {
          width: 100%; height: 100%;
          border-radius: 30px;
          overflow: hidden;
          background: #000;
          position: relative;
        }

        /* Status bar */
        .sfs-status-bar {
          position: absolute; top:8px; left:0; right:0;
          display: flex; justify-content:space-between;
          padding: 0 14px;
          z-index: 20;
          font-size: 0.58rem;
          color: rgba(255,255,255,0.9);
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        /* ── Reel full-screen "video" ───────────── */
        .sfs-reel { position:absolute; inset:0; z-index:1; }

        .sfs-reel-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.72) 100%),
            linear-gradient(160deg,
              #1A0030 0%,
              #7B0556 15%,
              #FF2D8B 35%,
              #FF6B35 52%,
              #FFB800 68%,
              #A8FF3C 82%,
              #00D4FF 100%
            );
        }

        /* Top bar: live + views */
        .sfs-reel-top {
          position: absolute; top:18px; left:0; right:0;
          display: flex; justify-content:space-between; align-items:center;
          padding: 0 12px;
          z-index: 5;
        }
        .sfs-live-badge {
          display: inline-flex; align-items:center; gap:5px;
          background: rgba(255,45,139,0.85);
          backdrop-filter: blur(6px);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.55rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.1em;
          box-shadow: 0 0 12px rgba(255,45,139,0.5);
        }
        .sfs-live-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fff;
          animation: livePulse 1.2s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.65); }
        }
        .sfs-view-count {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          border-radius: 20px;
          padding: 3px 9px;
        }
        .sfs-eye { font-size:0.7rem; }

        /* Center: big emoji + text sticker */
        .sfs-reel-mid {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -58%);
          text-align: center;
          z-index: 5;
        }
        .sfs-big-emoji {
          font-size: 3.2rem;
          filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));
          animation: emojiPop 3s ease-in-out infinite;
        }
        @keyframes emojiPop {
          0%,100% { transform:scale(1) rotate(-3deg); }
          50%      { transform:scale(1.08) rotate(3deg); }
        }
        .sfs-text-sticker {
          margin-top: 8px;
          background: rgba(255,255,255,0.92);
          color: #1A0030;
          font-weight: 900;
          font-family: var(--font-head);
          font-size: 0.85rem;
          letter-spacing: -0.01em;
          border-radius: 6px;
          padding: 3px 10px;
          display: inline-block;
          transform: rotate(-1.5deg);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .sfs-sub-sticker {
          margin-top: 6px;
          font-size: 0.55rem;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        /* Right: action buttons */
        .sfs-reel-actions {
          position: absolute;
          right: 8px; bottom: 90px;
          display: flex; flex-direction:column; align-items:center; gap:14px;
          z-index: 5;
        }
        .sfs-action {
          display: flex; flex-direction:column; align-items:center; gap:3px;
        }
        .sfs-action-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          display: flex; align-items:center; justify-content:center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.15s;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .sfs-heart-btn { animation: heartbeat 2.4s ease-in-out infinite; }
        @keyframes heartbeat {
          0%,100% { transform:scale(1); }
          15%      { transform:scale(1.25); }
          30%      { transform:scale(1); }
        }
        .sfs-spin-disc {
          animation: spinDisc 4s linear infinite;
        }
        @keyframes spinDisc { to { transform:rotate(360deg); } }
        .sfs-action-num {
          font-size: 0.52rem;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        /* Bottom: creator row */
        .sfs-reel-bottom {
          position: absolute;
          bottom: 14px; left: 10px; right: 58px;
          z-index: 5;
        }
        .sfs-creator-row {
          display: flex; align-items:center; gap:8px;
          margin-bottom: 6px;
        }
        .sfs-avatar-ring {
          width: 34px; height: 34px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, #FFB800, #FF2D8B, #A855F7);
          flex-shrink: 0;
        }
        .sfs-avatar-letter {
          width: 100%; height: 100%;
          border-radius: 50%;
          display: flex; align-items:center; justify-content:center;
          font-weight: 800;
          font-size: 0.85rem;
          color: #fff;
          border: 2px solid #000;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .sfs-avatar-sm { width:26px; height:26px; font-size:0.7rem; border-width:1.5px; flex-shrink:0; }
        .sfs-handle {
          font-size: 0.68rem; font-weight: 700;
          color: rgba(255,255,255,0.95);
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .sfs-follow-btn {
          font-size: 0.55rem; font-weight: 700;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 4px;
          padding: 1px 5px;
          display: inline-block;
        }
        .sfs-caption {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.9);
          line-height: 1.4;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
          margin-bottom: 5px;
        }
        .sfs-audio-pill {
          display: inline-flex; align-items:center; gap:4px;
          font-size: 0.54rem;
          color: rgba(255,255,255,0.75);
          background: rgba(0,0,0,0.35);
          border-radius: 20px;
          padding: 2px 8px;
          backdrop-filter: blur(4px);
        }

        /* Progress bar */
        .sfs-progress {
          position: absolute; bottom:0; left:0; right:0;
          height: 2px;
          background: rgba(255,255,255,0.15);
          z-index: 10;
        }
        .sfs-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF2D8B, #FFB800);
          animation: progressPlay 8s linear infinite;
          border-radius: 2px;
        }
        @keyframes progressPlay {
          0%  { width:0%; }
          100%{ width:100%; }
        }

        /* Floating emojis inside reel */
        .sfs-floaty-emojis {
          position: absolute; bottom:80px; right:55px;
          z-index: 6; pointer-events:none;
        }
        .sfs-fe {
          position: absolute;
          font-size: 1.2rem;
          opacity: 0;
          animation: feFloat 3s ease-in-out infinite;
        }
        .sfs-fe1 { right:0;   animation-delay:0.0s; }
        .sfs-fe2 { right:18px; animation-delay:0.5s; }
        .sfs-fe3 { right:5px;  animation-delay:1.0s; }
        .sfs-fe4 { right:22px; animation-delay:1.5s; }
        .sfs-fe5 { right:10px; animation-delay:2.0s; }
        .sfs-fe6 { right:20px; animation-delay:2.5s; }
        @keyframes feFloat {
          0%   { opacity:0; transform:translateY(0) scale(0.6); }
          20%  { opacity:1; transform:translateY(-15px) scale(1.1); }
          80%  { opacity:0.7; }
          100% { opacity:0; transform:translateY(-70px) scale(0.8); }
        }

        /* ── Second card peeking behind phone ───── */
        .sfs-back-card {
          position: absolute;
          right: -10px; bottom: 50px;
          width: 160px;
          background: rgba(14,16,40,0.92);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          overflow: hidden;
          z-index: 1;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          transform: rotate(4deg) translateX(20px);
          animation: cardPeek 6s ease-in-out infinite;
        }
        @keyframes cardPeek {
          0%,100% { transform:rotate(4deg) translateX(20px) translateY(0); }
          50%      { transform:rotate(4deg) translateX(20px) translateY(-6px); }
        }
        .sfs-back-thumb {
          width:100%; height:90px;
          background: linear-gradient(135deg, #0072FF 0%, #00D4FF 50%, #A8FF3C 100%);
        }
        .sfs-back-meta {
          display:flex; align-items:center; gap:7px;
          padding: 8px 10px;
        }

        /* ── Floating chips ──────────────────────── */
        .sfs-chip {
          position: absolute;
          z-index: 10;
          background: rgba(10,12,30,0.88);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 10px 14px;
          display: flex; align-items:center; gap:10px;
          animation: chipFloat 5s ease-in-out infinite;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          white-space: nowrap;
        }

        .sfs-chip-score {
          top: 8%; left: -20px;
          animation-delay: 0s;
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.12);
        }
        .sfs-chip-trend {
          bottom: 32%; left: -30px;
          animation-delay: 1.2s;
          font-size: 0.72rem;
          font-weight: 700;
          color: #FFB800;
          border-color: rgba(255,184,0,0.25);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,184,0,0.10);
        }
        .sfs-chip-likes {
          top: 30%; right: -20px;
          animation-delay: 0.7s;
          border-color: rgba(255,45,139,0.25);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,45,139,0.12);
        }
        @keyframes chipFloat {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-6px); }
        }

        .sfs-chip-icon { font-size:1.2rem; }
        .sfs-chip-label {
          font-size: 0.58rem;
          color: var(--text-faint);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .sfs-chip-big {
          font-size: 1.3rem;
          font-weight: 900;
          font-family: var(--font-head);
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .sfs-chip-unit {
          font-size: 0.65rem;
          color: var(--text-faint);
          font-weight: 600;
        }
        .sfs-score-track {
          margin-top: 5px;
          width: 80px; height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          overflow: hidden;
        }
        .sfs-score-bar {
          height: 100%;
          width: 94%;
          background: linear-gradient(90deg, #00D4FF, #A8FF3C);
          border-radius: 4px;
          animation: scoreBarIn 1.5s cubic-bezier(0.22,1,0.36,1) 0.4s both;
          transform-origin: left;
        }
        @keyframes scoreBarIn {
          from { width:0%; }
          to   { width:94%; }
        }
        .sfs-live-label {
          display: flex; align-items:center; gap:4px;
          margin-top: 2px;
        }
        .sfs-live-dot-sm {
          width:5px; height:5px; border-radius:50%;
          background: #FF2D8B;
          box-shadow: 0 0 6px #FF2D8B;
          animation: livePulse 1.2s ease-in-out infinite;
        }

        /* ── Floating hearts (outside phone) ────── */
        .sfs-ext-hearts {
          position: absolute;
          bottom: 18%; right: 6%;
          z-index: 8;
          pointer-events: none;
          width: 40px;
        }
        .sfs-eh {
          position: absolute;
          right: 0;
          font-size: 1.4rem;
          opacity: 0;
          animation: ehFloat 3.5s ease-in-out infinite;
        }
        .sfs-eh1 { animation-delay:0.0s; }
        .sfs-eh2 { animation-delay:0.6s; right:14px; font-size:1.1rem; }
        .sfs-eh3 { animation-delay:1.2s; }
        .sfs-eh4 { animation-delay:1.8s; right:10px; font-size:1.2rem; }
        .sfs-eh5 { animation-delay:2.4s; font-size:1.0rem; }
        @keyframes ehFloat {
          0%   { opacity:0; transform:translateY(0) scale(0.4); }
          15%  { opacity:1; transform:translateY(-20px) scale(1.15); }
          75%  { opacity:0.7; }
          100% { opacity:0; transform:translateY(-100px) scale(0.7); }
        }

        /* ── Stories row ──────────────────────────── */
        .sfs-stories {
          position: absolute;
          bottom: 6%; left: 50%;
          transform: translateX(-50%);
          display: flex; align-items:center; gap:16px;
          z-index: 8;
          background: rgba(8,10,28,0.72);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 10px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: storiesFloat 7s ease-in-out infinite;
        }
        @keyframes storiesFloat {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(-5px); }
        }
        .sfs-story { display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; }
        .sfs-story-ring {
          width: 38px; height: 38px;
          border-radius: 50%;
          padding: 2.5px;
          background: var(--sg);
        }
        .sfs-story-av {
          width:100%; height:100%;
          border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:0.8rem; color:#fff;
          border:2px solid #06070F;
        }
        .sfs-story-name {
          font-size:0.5rem; font-weight:700;
          color:rgba(255,255,255,0.6);
          font-family:var(--font-mono);
          letter-spacing:0.04em;
          text-transform:uppercase;
        }

        @media (max-width:860px) {
          .sfs-phone { transform:none; animation:none; margin-right:0; width:220px; height:460px; }
          .sfs-chip-score  { display:none; }
          .sfs-chip-trend  { display:none; }
          .sfs-chip-likes  { display:none; }
          .sfs-back-card   { display:none; }
          .sfs-ext-hearts  { display:none; }
          .sfs-stories     { display:none; }
        }
      `}</style>
    </div>
  )
}

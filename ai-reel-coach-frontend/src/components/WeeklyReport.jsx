import { useState, useEffect } from 'react'
import { api } from '../api'
import { useLang } from '../i18n.jsx'
import { SpeakButton } from './VoiceAssistant'

function StatChip({ label, value, color }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 20px',
      background: 'var(--surface2)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      minWidth: 90,
      flex: 1,
    }}>
      <div style={{
        fontFamily: 'var(--font-head)',
        fontWeight: 800,
        fontSize: '1.6rem',
        color: color || 'var(--accent)',
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value ?? '—'}
      </div>
      <div style={{
        fontSize: '0.7rem',
        color: 'var(--text-faint)',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textAlign: 'center',
      }}>
        {label}
      </div>
    </div>
  )
}

function SkeletonChip() {
  return (
    <div style={{
      flex: 1,
      minWidth: 90,
      height: 78,
      background: 'var(--surface2)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      animation: 'pulse 1.5s ease infinite',
    }} />
  )
}

export default function WeeklyReport() {
  const { t }   = useLang()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getWeeklyReport()
      .then(data => setReport(data.report || data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [])

  const ttsText = report
    ? [
        t('weekly_report') + '.',
        report.scriptsCount != null ? `You created ${report.scriptsCount} scripts this week.` : '',
        report.avgHookScore != null ? `Your average hook score was ${report.avgHookScore}.` : '',
        report.analysesCount != null ? `You analyzed ${report.analysesCount} videos.` : '',
        report.summary || '',
      ].filter(Boolean).join(' ')
    : null

  return (
    <div className="card" style={{ marginTop: 40 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}>
            📊
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: '1rem',
            margin: 0,
          }}>
            {t('weekly_report')}
          </h2>
        </div>
        {!loading && ttsText && <SpeakButton text={ttsText} />}
      </div>

      {/* Stat chips */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {loading ? (
          <>
            <SkeletonChip />
            <SkeletonChip />
            <SkeletonChip />
          </>
        ) : report ? (
          <>
            <StatChip label="Scripts" value={report.scriptsCount ?? 0} color="var(--accent)" />
            <StatChip label="Avg Hook Score" value={report.avgHookScore != null ? `${report.avgHookScore}` : '—'} color="var(--teal)" />
            <StatChip label="Analyses" value={report.analysesCount ?? 0} color="#FFD60A" />
          </>
        ) : (
          <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', padding: '20px 0' }}>
            Weekly report unavailable right now.
          </div>
        )}
      </div>

      {/* AI summary text */}
      {!loading && report?.summary && (
        <div style={{
          padding: '16px 18px',
          background: 'var(--surface2)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent)',
        }}>
          <div style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-faint)',
            marginBottom: 8,
          }}>
            AI Insights
          </div>
          <p style={{
            fontSize: '0.875rem',
            lineHeight: 1.65,
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {report.summary}
          </p>
        </div>
      )}

      {/* Loading skeleton for summary */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 12, width: '90%', background: 'var(--surface3)', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
          <div style={{ height: 12, width: '75%', background: 'var(--surface3)', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
          <div style={{ height: 12, width: '60%', background: 'var(--surface3)', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
        </div>
      )}
    </div>
  )
}

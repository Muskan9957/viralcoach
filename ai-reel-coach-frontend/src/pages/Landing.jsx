import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLang } from '../i18n.jsx'

/* ─── Language flip ──────────────────────────────────────────────── */
function LangFlip() {
  const { lang, setLanguage } = useLang()
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 99, padding: 3,
    }}>
      {[{ code: 'en', label: 'EN' }, { code: 'hi', label: 'हिं' }].map(o => {
        const active = lang === o.code
        return (
          <button key={o.code} type="button"
            onClick={() => !active && setLanguage(o.code)} aria-pressed={active}
            style={{
              border: 'none', cursor: active ? 'default' : 'pointer',
              padding: '4px 11px', borderRadius: 99,
              background: active ? 'linear-gradient(135deg,#00D4FF,#FF2D8B)' : 'transparent',
              color: active ? '#fff' : 'var(--text-muted)',
              fontFamily: o.code === 'hi' ? 'var(--font-body)' : 'var(--font-mono)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
              transition: 'background 0.18s,color 0.18s',
            }}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   APP PHONE
   A single phone mockup with 5 feature screens cycling inside.
   Scales with transform:scale for mobile — no layout rewrite needed.
   Screens: Script Studio → Hook Score → Crosspost → Trending → Coach
══════════════════════════════════════════════════════════════════ */
function AppPhone() {
  /* 25 s total, 5 s per screen
     Each screen: fade-in 0.4s → hold 3.8s → fade-out 0.4s → invisible 20s
     As % of 25s:  0→1.6, 1.6→16.8, 16.8→18.4, 18.4→100 */
  return (
    <div className="ap-outer">
      {/* soft ambient glows */}
      <div className="ap-glow ap-glow-c" aria-hidden />
      <div className="ap-glow ap-glow-p" aria-hidden />

      {/* ── Phone shell ────────────────────────────────────────── */}
      <div className="ap-phone">
        {/* dynamic island / notch */}
        <div className="ap-island" />

        {/* screen */}
        <div className="ap-screen">

          {/* ── Screen 1: Script Studio ── */}
          <div className="ap-scene ap-s1">
            <div className="ap-hdr" style={{ '--hc': '#00D4FF' }}>
              <span className="ap-hdr-icon">✍</span>
              <span className="ap-hdr-title">Script Studio</span>
              <span className="ap-live-pill"><span className="ap-live-dot" />LIVE</span>
            </div>

            <div className="ap-field-lbl">Topic</div>
            <div className="ap-input-row">
              <span className="ap-typed-text">Morning fitness routine</span>
              <span className="ap-cursor" />
            </div>

            <div className="ap-field-lbl" style={{ marginTop: 10 }}>Hook</div>
            <div className="ap-script-line ap-sl-hook" style={{ animationDelay: '1.2s' }}>
              <span className="ap-tag" style={{ '--tc': '#00D4FF' }}>hook</span>
              Most beginners quit the gym in week 2.
            </div>

            <div className="ap-field-lbl" style={{ marginTop: 8 }}>Body</div>
            <div className="ap-script-line" style={{ animationDelay: '1.8s' }}>
              <span className="ap-tag" style={{ '--tc': '#A855F7' }}>body</span>
              Here's the one habit that kept me consistent for 2 years straight.
            </div>

            <div className="ap-field-lbl" style={{ marginTop: 8 }}>CTA</div>
            <div className="ap-script-line ap-sl-cta" style={{ animationDelay: '2.4s' }}>
              <span className="ap-tag" style={{ '--tc': '#FF2D8B' }}>cta</span>
              Follow for part 2 🔥
            </div>
          </div>

          {/* ── Screen 2: Hook Score ── */}
          <div className="ap-scene ap-s2">
            <div className="ap-hdr" style={{ '--hc': '#A8FF3C' }}>
              <span className="ap-hdr-icon">🎯</span>
              <span className="ap-hdr-title">Hook Score</span>
              <span className="ap-badge" style={{ '--bc': '#A8FF3C' }}>AI Rating</span>
            </div>

            <div className="ap-score-center">
              <svg className="ap-gauge-svg" viewBox="0 0 120 66">
                <defs>
                  <linearGradient id="gaugeG" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="#A8FF3C" />
                    <stop offset="50%"  stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#FF2D8B" />
                  </linearGradient>
                </defs>
                <path d="M 10 60 A 50 50 0 0 1 110 60" stroke="rgba(255,255,255,0.07)" strokeWidth="7" fill="none" strokeLinecap="round"/>
                <path className="ap-gauge-fill" d="M 10 60 A 50 50 0 0 1 110 60" stroke="url(#gaugeG)" strokeWidth="7" fill="none" strokeLinecap="round"/>
              </svg>
              <div className="ap-score-num">94</div>
              <div className="ap-score-sub">Viral Potential</div>
            </div>

            <div className="ap-bars">
              {[
                { l: 'Curiosity', v: 96, c: '#00D4FF' },
                { l: 'Emotion',   v: 88, c: '#FF2D8B' },
                { l: 'Clarity',   v: 97, c: '#A8FF3C' },
                { l: 'CTA Power', v: 92, c: '#FFB800' },
              ].map((b, i) => (
                <div key={b.l} className="ap-bar-row" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
                  <span className="ap-bar-lbl">{b.l}</span>
                  <div className="ap-bar-track">
                    <div className="ap-bar-fill" style={{ '--bw': b.v + '%', '--bc': b.c, animationDelay: `${0.6 + i * 0.15}s` }} />
                  </div>
                  <span className="ap-bar-val" style={{ color: b.c }}>{b.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Screen 3: Crosspost ── */}
          <div className="ap-scene ap-s3">
            <div className="ap-hdr" style={{ '--hc': '#FF2D8B' }}>
              <span className="ap-hdr-icon">⇄</span>
              <span className="ap-hdr-title">Crosspost</span>
              <span className="ap-badge" style={{ '--bc': '#FF2D8B' }}>4 platforms</span>
            </div>

            <div className="ap-cp-desc">Script adapted &amp; posted everywhere ✓</div>

            <div className="ap-cp-platforms">
              {[
                { icon: '𝕏',  label: 'Twitter / X',   color: '#1DA1F2', delay: '0.4s' },
                { icon: 'in', label: 'LinkedIn',        color: '#0077B5', delay: '0.9s' },
                { icon: '▶',  label: 'YouTube Shorts',  color: '#FF5F4C', delay: '1.4s' },
                { icon: '◈',  label: 'Instagram',       color: '#E1306C', delay: '1.9s' },
              ].map(p => (
                <div key={p.icon} className="ap-cp-row" style={{ animationDelay: p.delay }}>
                  <span className="ap-cp-icon" style={{ color: p.color }}>{p.icon}</span>
                  <span className="ap-cp-label">{p.label}</span>
                  <span className="ap-cp-check">✓</span>
                </div>
              ))}
            </div>

            <div className="ap-cp-note">One click. Every platform.</div>
          </div>

          {/* ── Screen 4: Trending ── */}
          <div className="ap-scene ap-s4">
            <div className="ap-hdr" style={{ '--hc': '#FFB800' }}>
              <span className="ap-hdr-icon">📈</span>
              <span className="ap-hdr-title">Trending Now</span>
              <span className="ap-live-pill ap-live-amber"><span className="ap-live-dot ap-live-dot-a" />LIVE</span>
            </div>

            <div className="ap-trends">
              {[
                { tag: '#MorningRoutine', views: '2.4M views',  delta: '+38%', i: 1, c: '#FF2D8B', delay: '0.3s' },
                { tag: '#FitnessIndia',   views: '1.8M views',  delta: '+21%', i: 2, c: '#00D4FF', delay: '0.7s' },
                { tag: '#AILifestyle',    views: '987K views',   delta: '+57%', i: 3, c: '#A8FF3C', delay: '1.1s' },
                { tag: '#5AMClub',        views: '741K views',   delta: '+14%', i: 4, c: '#FFB800', delay: '1.5s' },
              ].map(t => (
                <div key={t.tag} className="ap-trend-row" style={{ animationDelay: t.delay }}>
                  <span className="ap-trend-rank" style={{ color: t.c }}>{t.i}</span>
                  <div className="ap-trend-info">
                    <div className="ap-trend-tag">{t.tag}</div>
                    <div className="ap-trend-views">{t.views}</div>
                  </div>
                  <span className="ap-trend-delta" style={{ color: t.c }}>{t.delta} ↑</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Screen 5: Creator Advisor ── */}
          <div className="ap-scene ap-s5">
            <div className="ap-hdr" style={{ '--hc': '#A855F7' }}>
              <span className="ap-hdr-icon">🤖</span>
              <span className="ap-hdr-title">Creator Advisor</span>
              <span className="ap-badge" style={{ '--bc': '#A855F7' }}>24/7</span>
            </div>

            <div className="ap-chat">
              <div className="ap-msg ap-msg-u" style={{ animationDelay: '0.2s' }}>
                How do I grow faster on Reels?
              </div>
              <div className="ap-msg ap-msg-ai" style={{ animationDelay: '0.9s' }}>
                Post between 7–9 AM daily. Use trending audio. Your hooks need more pattern interrupts — start with a bold claim or question. 💡
              </div>
              <div className="ap-msg ap-msg-u" style={{ animationDelay: '2.0s' }}>
                Which hashtags?
              </div>
              <div className="ap-typing" style={{ animationDelay: '2.6s' }}>
                <span /><span /><span />
              </div>
            </div>
          </div>

        </div>{/* /ap-screen */}
      </div>{/* /ap-phone */}

      {/* ── Feature indicator dots ────────────────────────────── */}
      <div className="ap-dots">
        {[1,2,3,4,5].map(n => (
          <div key={n} className={`ap-dot ap-dot-${n}`} title={['Script','Score','Crosspost','Trending','Coach'][n-1]} />
        ))}
      </div>

      {/* ── Feature labels cycling ────────────────────────────── */}
      <div className="ap-label-wrap">
        {[
          { n:1, text:'Script Studio',  c:'#00D4FF' },
          { n:2, text:'Hook Score',     c:'#A8FF3C' },
          { n:3, text:'Crosspost',      c:'#FF2D8B' },
          { n:4, text:'Trending',       c:'#FFB800' },
          { n:5, text:'Creator Advisor', c:'#A855F7' },
        ].map(f => (
          <div key={f.n} className={`ap-label ap-label-${f.n}`} style={{ '--lc': f.c }}>
            {f.text}
          </div>
        ))}
      </div>

      {/* ══ Virality decorations — around the phone ══════════════
          Purely decorative. Hidden on mobile (<781px).
          Positioned relative to ap-outer (position:relative).
      ════════════════════════════════════════════════════════ */}

      {/* LEFT SIDE */}
      <div className="vb vb-thumb"   aria-hidden>👍</div>
      <div className="vb vb-eyes"    aria-hidden>👀</div>
      <div className="vb vb-comment" aria-hidden>💬</div>
      {/* RIGHT SIDE */}
      <div className="vb vb-heart"   aria-hidden>❤️</div>
      <div className="vb vb-fire"    aria-hidden>🔥</div>
<div className="vb vb-share"   aria-hidden>
        <span className="vb-share-icon">↗</span>
        <span className="vb-share-txt">Share</span>
        <span className="vb-share-cnt">2.4K</span>
      </div>

      {/* Rising hearts — right edge of phone */}
      <div className="vb vb-rise vb-rise-1" aria-hidden>❤️</div>
      <div className="vb vb-rise vb-rise-2" aria-hidden>🧡</div>
      <div className="vb vb-rise vb-rise-3" aria-hidden>❤️</div>
      <div className="vb vb-rise vb-rise-4" aria-hidden>😍</div>

      {/* Accent sparks */}
      <div className="vb vb-spark vb-spark-1" aria-hidden>✦</div>
      <div className="vb vb-spark vb-spark-2" aria-hidden>✦</div>
      <div className="vb vb-spark vb-spark-3" aria-hidden>✸</div>
    </div>
  )
}

/* ─── Landing Page ───────────────────────────────────────────────── */
export default function Landing() {
  const { t } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <Logo size={36} showWordmark />
        <div className="lp-nav-actions">
          <LangFlip />
          <Link to="/auth" className="lp-nav-signin"
            onMouseEnter={e => { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border-bright)'; e.currentTarget.style.background='var(--surface2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='transparent'; }}
          >{t('landing_signin')}</Link>
          <Link to="/auth" className="btn btn-primary btn-sm lp-nav-cta" style={{ textDecoration: 'none' }}>
            {t('landing_get_started')}
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-bg" aria-hidden>
          <div className="lp-orb lp-orb-1" />
          <div className="lp-orb lp-orb-2" />
        </div>

        {/* Left */}
        <div className="lp-text">
          <h1 className="lp-h1">
            {t('landing_h1_a')}{' '}
            <span className="lp-grad">{t('landing_h1_b')}</span>
          </h1>
          <p className="lp-sub">{t('landing_sub')}</p>
          <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', display: 'inline-block' }}>
            {t('landing_cta_primary')}
          </Link>
        </div>

        {/* Right */}
        <div className="lp-visual">
          <AppPhone />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 5%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
        background: 'var(--surface)', marginTop: 'auto',
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
          {t('landing_footer_legal')}
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <Link to="/privacy" style={{ fontSize: '0.74rem', color: 'var(--text-faint)', textDecoration: 'none' }}>{t('landing_privacy')}</Link>
          <Link to="/terms"   style={{ fontSize: '0.74rem', color: 'var(--text-faint)', textDecoration: 'none' }}>{t('landing_terms')}</Link>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════ */}
      <style>{`

        /* ── Navbar ──────────────────────────────────────────────── */
        .lp-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 5%;
          background: rgba(7,9,28,0.92);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky; top: 0; z-index: 100;
          gap: 10px;
        }
        .lp-nav-actions {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }
        .lp-nav-signin {
          font-family: var(--font-body); font-weight: 600; font-size: 0.875rem;
          color: var(--text-muted); text-decoration: none;
          padding: 7px 14px; border-radius: 10;
          border: 1px solid var(--border); background: transparent;
          border-radius: 10px;
          transition: all 0.18s; white-space: nowrap;
        }
        /* on small phones hide the ghost "Sign in" link — CTA is enough */
        @media (max-width: 480px) {
          .lp-nav { padding: 10px 4%; }
          .lp-nav-signin { display: none; }
          .lp-nav-cta { font-size: 0.78rem !important; padding: 7px 13px !important; }
        }
        /* on very small screens also shrink the lang toggle */
        @media (max-width: 360px) {
          .lp-nav { padding: 8px 3%; }
        }

        /* ── Hero layout ─────────────────────────────────────────── */
        .lp-hero {
          position: relative; flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 48px 6%;
          max-width: 1160px; margin: 0 auto; width: 100%;
          min-height: calc(100vh - 130px);
        }
        .lp-bg { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0; }
        .lp-orb { position:absolute; border-radius:50%; filter:blur(80px); }
        .lp-orb-1 { top:-10%; left:-6%; width:480px; height:380px;
          background:radial-gradient(ellipse,rgba(0,212,255,0.09) 0%,transparent 65%); }
        .lp-orb-2 { bottom:-5%; right:-4%; width:460px; height:400px;
          background:radial-gradient(ellipse,rgba(255,45,139,0.10) 0%,transparent 65%); }

        .lp-text {
          position:relative; z-index:1;
          display:flex; flex-direction:column;
          animation: fadeUp 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-h1 {
          font-family:var(--font-head); font-weight:900;
          font-size:clamp(2.2rem,4.5vw,3.8rem);
          letter-spacing:-0.035em; line-height:1.06;
          color:var(--text); margin:0 0 18px;
        }
        .lp-grad {
          background:linear-gradient(135deg,#00D4FF 0%,#FF2D8B 55%,#FFB800 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; display:inline-block;
          filter:drop-shadow(0 0 32px rgba(255,45,139,0.26));
        }
        .lp-sub {
          font-size:clamp(0.9rem,1.5vw,1.05rem); color:var(--text-muted);
          line-height:1.65; max-width:400px; margin:0 0 32px;
        }

        .lp-visual {
          position:relative; z-index:1;
          display:flex; justify-content:center; align-items:center;
          animation: fadeUp 0.6s 0.14s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Mobile layout ─────────────────────────────────────────── */
        @media (max-width: 780px) {
          .lp-hero {
            grid-template-columns: 1fr;
            gap: 36px;
            text-align: center;
            padding: 36px 5% 48px;
            min-height: auto;
          }
          .lp-text  { order: 1; align-items: center; }
          .lp-visual{ order: 2; }
          .lp-sub   { margin-left:auto; margin-right:auto; }
        }

        /* ══════════════════════════════════════════════════════════
           PHONE — outer wrapper
        ══════════════════════════════════════════════════════════ */
        .ap-outer {
          position:relative;
          display:flex; flex-direction:column; align-items:center;
          gap: 18px;
        }

        /* ambient glow */
        .ap-glow {
          position:absolute; border-radius:50%;
          filter:blur(70px); pointer-events:none; z-index:0;
        }
        .ap-glow-c {
          width:300px; height:300px; top:5%; left:-15%;
          background:radial-gradient(ellipse,rgba(0,212,255,0.13) 0%,transparent 70%);
        }
        .ap-glow-p {
          width:280px; height:280px; bottom:5%; right:-10%;
          background:radial-gradient(ellipse,rgba(255,45,139,0.12) 0%,transparent 70%);
        }

        /* ── Phone shell ─────────────────────────────────────────── */
        .ap-phone {
          position:relative; z-index:2;
          width:248px; height:504px;
          background:#050710;
          border-radius:42px;
          box-shadow:
            0 60px 100px rgba(0,0,0,0.6),
            0 0 0 1.5px rgba(255,255,255,0.08),
            0 0 60px rgba(0,212,255,0.10),
            0 0 40px rgba(255,45,139,0.08),
            inset 0 0 0 1px rgba(255,255,255,0.04);
          padding: 12px;
          animation: phoneBob 6s ease-in-out infinite;
        }
        @keyframes phoneBob {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-10px); }
        }

        /* Dynamic island */
        .ap-island {
          position:absolute; top:12px; left:50%;
          transform:translateX(-50%);
          width:84px; height:20px;
          background:#000;
          border-radius:14px;
          z-index:10;
          box-shadow:0 0 0 1px rgba(255,255,255,0.05);
        }

        /* screen bezel */
        .ap-screen {
          width:100%; height:100%;
          background:linear-gradient(160deg,#07091E 0%,#0B0E2C 100%);
          border-radius:32px;
          overflow:hidden;
          position:relative;
        }
        .ap-screen::after {
          content:'';
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse at 20% 10%,rgba(0,212,255,0.06) 0%,transparent 50%),
            radial-gradient(ellipse at 80% 90%,rgba(255,45,139,0.06) 0%,transparent 50%);
          border-radius:inherit;
        }

        /* ── Scene base ──────────────────────────────────────────── */
        .ap-scene {
          position:absolute; inset:0;
          padding:46px 16px 18px;
          opacity:0;
          display:flex; flex-direction:column;
          animation:sceneCycle 25s ease-in-out infinite;
          overflow:hidden;
        }
        .ap-s1 { animation-delay: 0s; }
        .ap-s2 { animation-delay: 5s; }
        .ap-s3 { animation-delay:10s; }
        .ap-s4 { animation-delay:15s; }
        .ap-s5 { animation-delay:20s; }

        @keyframes sceneCycle {
          0%,1%    { opacity:0; transform:translateY(14px); }
          5%       { opacity:1; transform:translateY(0); }
          17%      { opacity:1; transform:translateY(0); }
          20%,100% { opacity:0; transform:translateY(-12px); }
        }

        /* ── Shared scene components ───────────────────────────────── */
        .ap-hdr {
          display:flex; align-items:center; gap:7px;
          padding-bottom:10px;
          border-bottom:1px solid rgba(255,255,255,0.06);
          margin-bottom:12px;
        }
        .ap-hdr-icon { font-size:0.9rem; }
        .ap-hdr-title {
          flex:1;
          font-family:var(--font-head); font-weight:800;
          font-size:0.78rem; color:#fff; letter-spacing:-0.015em;
        }
        .ap-live-pill {
          display:inline-flex; align-items:center; gap:4px;
          padding:2px 7px; border-radius:99px;
          background:rgba(0,212,255,0.12); border:1px solid rgba(0,212,255,0.25);
          color:#00D4FF; font-family:var(--font-mono);
          font-size:0.5rem; font-weight:800; letter-spacing:0.1em;
        }
        .ap-live-amber {
          background:rgba(255,184,0,0.12); border-color:rgba(255,184,0,0.25); color:#FFB800;
        }
        .ap-live-dot {
          width:4px; height:4px; border-radius:50%;
          background:#00D4FF; box-shadow:0 0 6px #00D4FF;
          animation:livePulse 1.2s ease-in-out infinite;
        }
        .ap-live-dot-a { background:#FFB800; box-shadow:0 0 6px #FFB800; }
        @keyframes livePulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%    { opacity:0.3; transform:scale(0.6); }
        }
        .ap-badge {
          font-size:0.48rem; font-weight:800; letter-spacing:0.06em;
          text-transform:uppercase;
          padding:2px 6px; border-radius:4px;
          color:var(--bc);
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.08);
        }
        .ap-field-lbl {
          font-family:var(--font-mono); font-size:0.5rem;
          font-weight:700; letter-spacing:0.16em; text-transform:uppercase;
          color:rgba(255,255,255,0.3); margin-bottom:4px;
        }

        /* ── Screen 1: Studio ──────────────────────────────────────── */
        .ap-input-row {
          display:flex; align-items:center;
          background:rgba(0,212,255,0.07);
          border:1px solid rgba(0,212,255,0.22);
          border-radius:8px; padding:6px 9px; margin-bottom:2px;
        }
        .ap-typed-text {
          font-family:var(--font-mono); font-size:0.62rem;
          color:#00D4FF; overflow:hidden; white-space:nowrap;
          width:0; animation:typeText 1.2s steps(24,end) 0.3s forwards;
        }
        @keyframes typeText { to { width:100%; } }
        .ap-cursor {
          width:1.5px; height:11px; background:#00D4FF; margin-left:2px; flex-shrink:0;
          animation:blink 0.7s steps(1) infinite;
        }
        @keyframes blink { 50%{ opacity:0; } }

        .ap-script-line {
          background:rgba(255,255,255,0.04);
          border-radius:7px; padding:6px 8px;
          font-size:0.62rem; line-height:1.4;
          color:rgba(255,255,255,0.85);
          display:flex; gap:5px; align-items:flex-start;
          opacity:0; transform:translateY(6px);
          animation:lineSlideIn 0.35s ease forwards;
          border-left:2px solid rgba(255,255,255,0.12);
        }
        .ap-sl-hook { border-left-color:#00D4FF; }
        .ap-sl-cta  { border-left-color:#FF2D8B; }
        @keyframes lineSlideIn {
          to { opacity:1; transform:translateY(0); }
        }
        .ap-tag {
          font-family:var(--font-mono); font-size:0.48rem; font-weight:800;
          text-transform:uppercase; letter-spacing:0.06em;
          padding:1px 4px; border-radius:3px; flex-shrink:0; margin-top:1px;
          color:var(--tc); background:rgba(255,255,255,0.07);
        }

        /* ── Screen 2: Score ───────────────────────────────────────── */
        .ap-score-center {
          display:flex; flex-direction:column; align-items:center;
          margin-bottom:12px;
        }
        .ap-gauge-svg { width:120px; height:66px; }
        .ap-gauge-fill {
          stroke-dasharray:157; stroke-dashoffset:157;
          animation:gaugeAnim 1.4s cubic-bezier(0.22,1,0.36,1) 0.4s forwards;
          filter:drop-shadow(0 0 5px rgba(0,212,255,0.5));
        }
        @keyframes gaugeAnim { to { stroke-dashoffset:10; } }
        .ap-score-num {
          font-family:var(--font-head); font-weight:900; font-size:2.2rem;
          line-height:1; margin-top:-16px;
          background:linear-gradient(135deg,#A8FF3C,#00D4FF,#FF2D8B);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          opacity:0; animation:fadeIn 0.4s ease 1.5s forwards;
        }
        .ap-score-sub {
          font-size:0.54rem; color:rgba(255,255,255,0.4);
          font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.12em;
          margin-top:3px;
          opacity:0; animation:fadeIn 0.4s ease 1.7s forwards;
        }
        @keyframes fadeIn { to { opacity:1; } }

        .ap-bars { display:flex; flex-direction:column; gap:7px; }
        .ap-bar-row {
          display:flex; align-items:center; gap:7px;
          opacity:0; animation:fadeIn 0.3s ease forwards;
        }
        .ap-bar-lbl {
          font-size:0.54rem; color:rgba(255,255,255,0.5);
          width:54px; flex-shrink:0; font-family:var(--font-mono);
        }
        .ap-bar-track {
          flex:1; height:4px;
          background:rgba(255,255,255,0.07); border-radius:4px; overflow:hidden;
        }
        .ap-bar-fill {
          height:100%; border-radius:4px;
          background:var(--bc);
          width:0; animation:barGrow 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes barGrow { to { width:var(--bw); } }
        .ap-bar-val {
          font-size:0.55rem; font-weight:800; font-family:var(--font-mono);
          width:22px; text-align:right; flex-shrink:0;
        }

        /* ── Screen 3: Crosspost ───────────────────────────────────── */
        .ap-cp-desc {
          font-size:0.6rem; color:rgba(255,255,255,0.5);
          margin-bottom:12px; font-style:italic;
        }
        .ap-cp-platforms { display:flex; flex-direction:column; gap:7px; }
        .ap-cp-row {
          display:flex; align-items:center; gap:9px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:9px; padding:7px 10px;
          opacity:0; transform:translateX(-10px);
          animation:cpSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes cpSlideIn { to { opacity:1; transform:translateX(0); } }
        .ap-cp-icon {
          font-weight:800; font-size:0.8rem;
          width:18px; text-align:center; flex-shrink:0;
        }
        .ap-cp-label {
          flex:1; font-size:0.62rem; color:rgba(255,255,255,0.8); font-weight:600;
        }
        .ap-cp-check {
          font-size:0.7rem; font-weight:900; color:#A8FF3C;
          background:rgba(168,255,60,0.12);
          width:18px; height:18px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 8px rgba(168,255,60,0.3);
          flex-shrink:0;
        }
        .ap-cp-note {
          margin-top:14px;
          font-size:0.58rem; color:rgba(255,255,255,0.35);
          font-family:var(--font-mono); text-align:center;
          letter-spacing:0.06em;
        }

        /* ── Screen 4: Trending ────────────────────────────────────── */
        .ap-trends { display:flex; flex-direction:column; gap:7px; }
        .ap-trend-row {
          display:flex; align-items:center; gap:9px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:9px; padding:7px 10px;
          opacity:0; transform:translateY(8px);
          animation:trendIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes trendIn { to { opacity:1; transform:translateY(0); } }
        .ap-trend-rank {
          font-family:var(--font-head); font-weight:900; font-size:0.9rem;
          width:14px; text-align:center; flex-shrink:0;
        }
        .ap-trend-info { flex:1; }
        .ap-trend-tag {
          font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.9);
          letter-spacing:-0.01em;
        }
        .ap-trend-views {
          font-size:0.54rem; color:rgba(255,255,255,0.38);
          font-family:var(--font-mono);
        }
        .ap-trend-delta {
          font-size:0.56rem; font-weight:800;
          font-family:var(--font-mono); flex-shrink:0;
        }

        /* ── Screen 5: Coach ───────────────────────────────────────── */
        .ap-chat { display:flex; flex-direction:column; gap:8px; }
        .ap-msg {
          font-size:0.62rem; line-height:1.45;
          padding:7px 10px; border-radius:12px;
          max-width:85%;
          opacity:0; animation:fadeIn 0.3s ease forwards;
        }
        .ap-msg-u {
          align-self:flex-end;
          background:linear-gradient(135deg,#00D4FF,#A855F7);
          color:#fff; border-radius:12px 12px 3px 12px;
        }
        .ap-msg-ai {
          align-self:flex-start;
          background:rgba(255,255,255,0.07);
          color:rgba(255,255,255,0.88);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:3px 12px 12px 12px;
        }
        .ap-typing {
          align-self:flex-start;
          display:flex; gap:4px; padding:8px 12px;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:3px 12px 12px 12px;
          opacity:0; animation:fadeIn 0.3s ease forwards;
        }
        .ap-typing span {
          width:5px; height:5px; border-radius:50%;
          background:rgba(255,255,255,0.45);
          animation:typingDot 1s ease-in-out infinite;
        }
        .ap-typing span:nth-child(2){ animation-delay:0.2s; }
        .ap-typing span:nth-child(3){ animation-delay:0.4s; }
        @keyframes typingDot {
          0%,60%,100%{ transform:translateY(0); }
          30%         { transform:translateY(-4px); }
        }

        /* ── Indicator dots ─────────────────────────────────────────── */
        .ap-dots {
          display:flex; gap:8px; align-items:center; z-index:2;
        }
        .ap-dot {
          height:4px; border-radius:2px;
          background:rgba(255,255,255,0.2);
          animation:dotCycle 25s ease-in-out infinite;
        }
        .ap-dot-1{ background:#00D4FF; animation-delay: 0s; }
        .ap-dot-2{ background:#A8FF3C; animation-delay: 5s; }
        .ap-dot-3{ background:#FF2D8B; animation-delay:10s; }
        .ap-dot-4{ background:#FFB800; animation-delay:15s; }
        .ap-dot-5{ background:#A855F7; animation-delay:20s; }
        @keyframes dotCycle {
          0%,3%    { width:22px; opacity:1; }
          18%,100% { width:5px;  opacity:0.25; }
        }

        /* ── Feature label ──────────────────────────────────────────── */
        .ap-label-wrap {
          position:relative; height:28px; width:180px; z-index:2;
        }
        .ap-label {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-mono); font-size:0.68rem;
          font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--lc);
          opacity:0;
          animation:labelCycle 25s ease-in-out infinite;
        }
        .ap-label-1{ animation-delay: 0s; }
        .ap-label-2{ animation-delay: 5s; }
        .ap-label-3{ animation-delay:10s; }
        .ap-label-4{ animation-delay:15s; }
        .ap-label-5{ animation-delay:20s; }
        @keyframes labelCycle {
          0%,3%    { opacity:0; transform:translateY(4px); }
          6%       { opacity:1; transform:translateY(0); }
          16%      { opacity:1; transform:translateY(0); }
          20%,100% { opacity:0; transform:translateY(-4px); }
        }

        /* ── Mobile scaling ─────────────────────────────────────────── */
        @media (max-width: 480px) {
          .ap-phone { transform:scale(0.82); transform-origin:top center; }
          .ap-outer { gap:10px; }
          .ap-dots    { margin-top:-22px; }
          .ap-label-wrap {
            margin-top:-18px;
            height:32px; width:200px;
          }
          .ap-label {
            font-size:0.75rem;
            letter-spacing:0.1em;
            /* subtle pill so text pops on any bg */
            background: rgba(7,9,28,0.72);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border:1px solid rgba(255,255,255,0.08);
            border-radius:99px;
            padding:0 14px;
          }
        }
        @media (max-width: 360px) {
          .ap-phone { transform:scale(0.72); transform-origin:top center; }
          .ap-dots    { margin-top:-42px; }
          .ap-label-wrap { margin-top:-38px; width:190px; }
          .ap-label { font-size:0.72rem; }
        }

        /* ══════════════════════════════════════════════════════
           VIBE / VIRALITY DECORATIONS
           All .vb elements are absolutely positioned inside
           .ap-outer and hidden on mobile to stay clean.
        ══════════════════════════════════════════════════════ */
        @media (min-width: 781px) {
          .ap-outer { padding: 0 72px; }
        }

        .vb {
          position: absolute;
          pointer-events: none;
          z-index: 4;
          user-select: none;
          line-height: 1;
        }
        @media (max-width: 780px) { .vb { display: none; } }

        /* ── 👍 Thumb — BIG, chunky, tilted left like a sticker ── */
        .vb-thumb {
          left: 2px; top: 138px;
          font-size: 2.6rem;
          transform: rotate(-22deg);
          filter: drop-shadow(0 6px 18px rgba(0,212,255,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.6));
          animation: vbThumb 3.8s ease-in-out infinite;
        }

        /* ── 👀 Eyes — small, peeking from top corner ── */
        .vb-eyes {
          left: 14px; top: 52px;
          font-size: 1.05rem;
          transform: rotate(8deg);
          opacity: 0.82;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
          animation: vbBobSlow 6.2s ease-in-out 1.1s infinite;
        }

        /* ── 💬 Comment — medium, slight tilt right ── */
        .vb-comment {
          left: 0px; top: 318px;
          font-size: 1.55rem;
          transform: rotate(12deg);
          opacity: 0.75;
          filter: drop-shadow(0 3px 10px rgba(255,45,139,0.35));
          animation: vbBobL 5s ease-in-out 0.6s infinite;
        }

        /* ── ❤️ Heart — smaller than thumb, punchy pulse ── */
        .vb-heart {
          right: 10px; top: 88px;
          font-size: 1.8rem;
          transform: rotate(10deg);
          filter: drop-shadow(0 4px 14px rgba(255,45,139,0.6)) drop-shadow(0 1px 3px rgba(0,0,0,0.5));
          animation: vbHeartbeat 2s ease-in-out 0.3s infinite;
        }

        /* ── 🔥 Fire — tall, dramatic, leans right ── */
        .vb-fire {
          right: 4px; top: 20px;
          font-size: 2.1rem;
          transform: rotate(6deg);
          filter: drop-shadow(0 6px 20px rgba(255,100,0,0.55));
          animation: vbFireSway 2.4s ease-in-out infinite;
        }

/* ── Share chip ─────────────────────────────────────── */
        .vb-share {
          right: 4px; top: 370px;
          display: flex; align-items: center; gap: 5px;
          background: rgba(8,10,30,0.84);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(0,212,255,0.28);
          border-radius: 99px; padding: 6px 13px;
          font-size: 0.68rem;
          box-shadow: 0 5px 22px rgba(0,0,0,0.45), 0 0 16px rgba(0,212,255,0.14);
          animation: vbDrift 5.5s ease-in-out 1.2s infinite;
        }
        .vb-share-icon { color: #00D4FF; font-size: 0.85rem; font-style: normal; font-weight: 900; }
        .vb-share-txt  { color: rgba(255,255,255,0.88); font-weight: 800; letter-spacing: 0.01em; }
        .vb-share-cnt  { color: rgba(255,255,255,0.38); font-family: var(--font-mono,monospace); font-size: 0.58rem; }

        /* ── Rising hearts ──────────────────────────────────── */
        /* staggered sizes + slight x-jitter so they don't stack */
        .vb-rise { animation: vbRise 3.4s ease-out infinite; filter: drop-shadow(0 2px 6px rgba(255,45,139,0.4)); }
        .vb-rise-1 { right: 24px; top: 400px; font-size: 1.35rem; animation-delay: 0.0s; }
        .vb-rise-2 { right: 44px; top: 418px; font-size: 0.9rem;  animation-delay: 0.9s; opacity: 0.7; }
        .vb-rise-3 { right: 16px; top: 408px; font-size: 1.1rem;  animation-delay: 1.8s; }
        .vb-rise-4 { right: 38px; top: 396px; font-size: 0.78rem; animation-delay: 2.6s; opacity: 0.6; }

        /* ── Accent sparks ──────────────────────────────────── */
        .vb-spark { animation: vbSparkle 2.5s ease-in-out infinite; }
        /* varied sizes, rotations, colors */
        .vb-spark-1 { left: 58px;  top: 10px;  font-size: 1.1rem;  color: #00D4FF; transform: rotate(20deg); animation-delay: 0s;   filter: drop-shadow(0 0 6px #00D4FF); }
        .vb-spark-2 { right: 55px; top: 22px;  font-size: 0.65rem; color: #FF2D8B; transform: rotate(-12deg); animation-delay: 0.9s; filter: drop-shadow(0 0 5px #FF2D8B); }
        .vb-spark-3 { left: 52px;  top: 484px; font-size: 0.85rem; color: #FFB800; transform: rotate(45deg); animation-delay: 1.7s; filter: drop-shadow(0 0 6px #FFB800); }

        /* ══ Keyframes ══════════════════════════════════════════ */

        /* thumb: big bob with tilt wobble */
        @keyframes vbThumb {
          0%   { transform: rotate(-22deg) translateY(0) scale(1); }
          30%  { transform: rotate(-14deg) translateY(-10px) scale(1.08); }
          60%  { transform: rotate(-26deg) translateY(-5px) scale(0.96); }
          100% { transform: rotate(-22deg) translateY(0) scale(1); }
        }
        /* fire: sway side to side */
        @keyframes vbFireSway {
          0%,100% { transform: rotate(6deg) scaleX(1); }
          33%     { transform: rotate(-4deg) scaleX(0.9); }
          66%     { transform: rotate(10deg) scaleX(1.05); }
        }
        @keyframes vbBobL {
          0%,100% { transform: rotate(12deg) translateY(0); }
          50%     { transform: rotate(9deg) translateY(-8px); }
        }
        @keyframes vbBobSlow {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }
        /* drift: clean float, no tilt */
        @keyframes vbDrift {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes vbHeartbeat {
          0%,60%,100% { transform: rotate(10deg) scale(1); }
          15%          { transform: rotate(10deg) scale(1.45); }
          30%          { transform: rotate(10deg) scale(1.12); }
          45%          { transform: rotate(10deg) scale(1.3); }
        }
        @keyframes vbRise {
          0%   { opacity: 0; transform: translateY(0) scale(0.4) rotate(-10deg); }
          10%  { opacity: 1; transform: translateY(-18px) scale(1.25) rotate(5deg); }
          70%  { opacity: 0.55; }
          100% { opacity: 0; transform: translateY(-120px) scale(0.6) rotate(15deg); }
        }
        @keyframes vbPopIn {
          from { opacity: 0; transform: scale(0.4) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1) rotate(var(--r,0deg)); }
        }
        @keyframes vbSparkle {
          0%,100% { opacity: 0.25; transform: var(--sr,rotate(20deg)) scale(0.7); }
          50%     { opacity: 1;    transform: var(--sr,rotate(20deg)) scale(1.5) rotate(180deg); }
        }

      `}</style>
    </div>
  )
}

import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLang } from '../i18n.jsx'

/* ─── Language flip ──────────────────────────────────────────────── */
function LangFlip() {
  const { lang, setLanguage } = useLang()
  return (
    <div style={{
      display:'inline-flex', alignItems:'center',
      background:'var(--surface2)', border:'1px solid var(--border)',
      borderRadius:99, padding:3,
    }}>
      {[{ code:'en', label:'EN' }, { code:'hi', label:'हिं' }].map(o => {
        const active = lang === o.code
        return (
          <button key={o.code} type="button"
            onClick={() => !active && setLanguage(o.code)} aria-pressed={active}
            style={{
              border:'none', cursor:active?'default':'pointer',
              padding:'4px 11px', borderRadius:99,
              background:active?'linear-gradient(135deg,#00D4FF,#FF2D8B)':'transparent',
              color:active?'#fff':'var(--text-muted)',
              fontFamily:o.code==='hi'?'var(--font-body)':'var(--font-mono)',
              fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.04em',
              transition:'background 0.18s,color 0.18s',
            }}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   CREATOR WALL
   Large person-emoji as the face of each creator (72 px), floating
   hearts, story rings, bento grid — all features of the app are
   visible across the four posts.
══════════════════════════════════════════════════════════════════ */

// Story rings row (5 creators including "You")
const STORIES = [
  { face:'👩🏻',  name:'Priya',  ring:'linear-gradient(135deg,#FF6B35,#FF2D8B,#C71585)' },
  { face:'👨🏽‍💻', name:'Rahul',  ring:'linear-gradient(135deg,#A855F7,#00D4FF)' },
  { face:'👩🏾‍🍳', name:'Ananya', ring:'linear-gradient(135deg,#FF9A3C,#FF5F4C,#FF2D8B)' },
  { face:'🧑🏻‍💼', name:'Karan',  ring:'linear-gradient(135deg,#FFB800,#A8FF3C)' },
  { face:'🧑🏽‍🎤', name:'Meera',  ring:'linear-gradient(135deg,#00D4FF,#A855F7)' },
]

// Post data — each one spotlights a different ViralScript feature
const POSTS = [
  {
    id: 'a',
    face:    '👩🏻',
    name:    'Priya Kapoor',
    handle:  '@priyalifts',
    bg:      'linear-gradient(160deg,#1C0010 0%,#8B0050 30%,#FF2D8B 60%,#FF8C42 82%,#FFD93D 100%)',
    caption: '5 AM routine that changed everything 🔥',
    tag:     '🎯 Hook Score  94',
    tagColor:'#FF2D8B',
    likes:   '847K',
    comments:'12.1K',
    hearts:  true,   // floating heart animation
    viral:   true,   // glow border
  },
  {
    id: 'b',
    face:    '👨🏽‍💻',
    name:    'Rahul Mehta',
    handle:  '@rahulbuilds',
    bg:      'linear-gradient(160deg,#04001A 0%,#1A007A 28%,#0072FF 60%,#00D4FF 82%,#A8FF3C 100%)',
    caption: '100K followers in 60 days with AI 🤖',
    tag:     '⇄ Crossposted × 4',
    tagColor:'#00D4FF',
    likes:   '392K',
    comments:'4.2K',
    hearts:  false,
    viral:   false,
  },
  {
    id: 'c',
    face:    '👩🏾‍🍳',
    name:    'Ananya Singh',
    handle:  '@ananyacooks',
    bg:      'linear-gradient(160deg,#1A0500 0%,#8B2500 25%,#FF6B35 55%,#FFB347 78%,#FFD700 100%)',
    caption: 'Dal tadka recipe — 3M views! ✨',
    tag:     '✦ AI Script',
    tagColor:'#FFB800',
    likes:   '1.2M',
    comments:'24K',
    hearts:  false,
    viral:   false,
  },
  {
    id: 'd',
    face:    '🧑🏻‍💼',
    name:    'Karan Verma',
    handle:  '@karanmoney',
    bg:      'linear-gradient(160deg,#001206 0%,#004D20 28%,#00A651 58%,#A8FF3C 80%,#FFD700 100%)',
    caption: 'Money habit costing you ₹50K/yr 💸',
    tag:     '🔥 Trending #1',
    tagColor:'#A8FF3C',
    likes:   '234K',
    comments:'3.1K',
    hearts:  false,
    viral:   false,
  },
]

function Post({ p }) {
  return (
    <div className={`cw-post cw-post-${p.id}${p.viral?' cw-post--viral':''}`}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="cw-ph">
        <span className="cw-ph-face">{p.face}</span>
        <div className="cw-ph-info">
          <div className="cw-ph-name">{p.name}</div>
          <div className="cw-ph-handle">{p.handle}</div>
        </div>
        <span className="cw-more">···</span>
      </div>

      {/* ── Photo ── large face is the hero ─────────────── */}
      <div className="cw-photo" style={{ background:p.bg }}>
        <div className="cw-photo-overlay" />

        {/* The person */}
        <div className="cw-face-wrap">
          <div className="cw-face-glow" style={{ '--fc':p.tagColor }} />
          <span className="cw-face">{p.face}</span>
        </div>

        {/* Feature badge — top-right */}
        <div className="cw-badge" style={{ '--bc':p.tagColor }}>{p.tag}</div>

        {/* Caption overlaid bottom */}
        <div className="cw-caption">{p.caption}</div>

        {/* Floating hearts (only on viral post) */}
        {p.hearts && (
          <div className="cw-hearts" aria-hidden>
            <span className="cw-h cw-h1">❤️</span>
            <span className="cw-h cw-h2">❤️</span>
            <span className="cw-h cw-h3">❤️</span>
            <span className="cw-h cw-h4">🧡</span>
            <span className="cw-h cw-h5">❤️</span>
            <span className="cw-h cw-h6">💕</span>
          </div>
        )}

        {/* Double-tap heart flash (viral post only) */}
        {p.viral && <div className="cw-doubletap" aria-hidden>❤️</div>}
      </div>

      {/* ── Actions ─────────────────────────────────────── */}
      <div className="cw-actions">
        <div className="cw-action-left">
          <button className={`cw-btn-like${p.viral?' cw-btn-like--on':''}`} aria-label="Like">
            {p.viral ? '❤️' : '🤍'}
          </button>
          <button className="cw-btn-icon" aria-label="Comment">💬</button>
          <button className="cw-btn-icon" aria-label="Share">✈️</button>
        </div>
        <button className="cw-btn-icon cw-btn-save" aria-label="Save">🔖</button>
      </div>
      <div className="cw-likes">
        <strong>{p.likes} likes</strong>
      </div>
      <div className="cw-comment-preview">
        <span className="cw-comment-name">{p.handle.slice(1).split('.')[0]}</span>
        &nbsp;<span className="cw-comment-text">{p.caption}</span>
      </div>
      <div className="cw-view-count">👁 {p.comments} comments</div>
    </div>
  )
}

function CreatorWall() {
  return (
    <div className="cw-wrap">

      {/* ── Stories bar ────────────────────────────────── */}
      <div className="cw-stories">
        {/* Your story */}
        <div className="cw-story">
          <div className="cw-story-ring cw-story-ring--add">
            <div className="cw-story-inner cw-story-inner--add">＋</div>
          </div>
          <span className="cw-story-label">Your story</span>
        </div>
        {STORIES.map((s,i) => (
          <div key={i} className="cw-story" style={{ animationDelay:`${i*0.1}s` }}>
            <div className="cw-story-ring" style={{ '--sr':s.ring }}>
              <div className="cw-story-inner">{s.face}</div>
            </div>
            <span className="cw-story-label">{s.name}</span>
          </div>
        ))}
      </div>

      {/* ── Post grid ──────────────────────────────────── */}
      <div className="cw-grid">
        <Post p={POSTS[0]} />
        <Post p={POSTS[1]} />
        <Post p={POSTS[2]} />
        <Post p={POSTS[3]} />
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
          <Link to="/auth"
            style={{
              fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.875rem',
              color:'var(--text-muted)', textDecoration:'none',
              padding:'8px 16px', borderRadius:10,
              border:'1px solid var(--border)', background:'transparent',
              transition:'all 0.18s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border-bright)'; e.currentTarget.style.background='var(--surface2)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='transparent'; }}
          >{t('landing_signin')}</Link>
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
        </div>
        <div className="hero-text">
          <h1 className="hero-h1">
            {t('landing_h1_a')}{' '}
            <span className="hero-h1-grad">{t('landing_h1_b')}</span>
          </h1>
          <p className="hero-sub">{t('landing_sub')}</p>
          <div className="hero-ctas">
            <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration:'none', minWidth:190 }}>
              {t('landing_cta_primary')}
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <CreatorWall />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop:'1px solid var(--border)',
        padding:'20px 5%', display:'flex', alignItems:'center',
        justifyContent:'space-between', flexWrap:'wrap', gap:14,
        background:'var(--surface)', marginTop:'auto',
      }}>
        <div style={{ fontSize:'0.74rem', color:'var(--text-faint)', fontFamily:'var(--font-mono)', letterSpacing:'0.02em' }}>
          {t('landing_footer_legal')}
        </div>
        <div style={{ display:'flex', gap:18 }}>
          <Link to="/privacy" style={{ fontSize:'0.74rem', color:'var(--text-faint)', textDecoration:'none' }}>{t('landing_privacy')}</Link>
          <Link to="/terms"   style={{ fontSize:'0.74rem', color:'var(--text-faint)', textDecoration:'none' }}>{t('landing_terms')}</Link>
        </div>
      </footer>

      <style>{`

        /* ── Hero layout ───────────────────────────────────────────── */
        .hero-split {
          position:relative; flex:1;
          display:grid; grid-template-columns:1fr 1.1fr;
          gap:52px; align-items:center;
          padding:48px 5%; max-width:1200px; margin:0 auto;
          width:100%; min-height:calc(100vh - 130px);
        }
        .hero-bg { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0; }
        .hero-orb { position:absolute; border-radius:50%; filter:blur(80px); }
        .hero-orb-1 { top:-8%; left:-6%; width:480px; height:380px;
          background:radial-gradient(ellipse,rgba(0,212,255,0.09) 0%,transparent 65%); }
        .hero-orb-2 { bottom:-5%; right:-4%; width:460px; height:400px;
          background:radial-gradient(ellipse,rgba(255,45,139,0.10) 0%,transparent 65%); }
        .hero-text {
          position:relative; z-index:1; display:flex; flex-direction:column;
          justify-content:center;
          animation:fadeUp 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hero-h1 {
          font-family:var(--font-head); font-weight:900;
          font-size:clamp(2.4rem,4.5vw,3.9rem);
          letter-spacing:-0.035em; line-height:1.05;
          color:var(--text); margin:0 0 20px;
        }
        .hero-h1-grad {
          background:linear-gradient(135deg,#00D4FF 0%,#FF2D8B 55%,#FFB800 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; display:inline-block;
          filter:drop-shadow(0 0 36px rgba(255,45,139,0.28));
        }
        .hero-sub {
          font-size:clamp(0.9rem,1.5vw,1.05rem); color:var(--text-muted);
          line-height:1.65; max-width:420px; margin:0 0 32px;
        }
        .hero-ctas { display:flex; gap:12px; }
        .hero-visual {
          position:relative; z-index:1; display:flex; align-items:center;
          animation:fadeUp 0.6s 0.14s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @media (max-width:860px) {
          .hero-split { grid-template-columns:1fr; gap:28px; text-align:center;
            padding-top:28px; min-height:auto; }
          .hero-text  { order:1; align-items:center; }
          .hero-visual{ order:2; }
          .hero-sub   { margin-left:auto; margin-right:auto; }
          .hero-ctas  { justify-content:center; }
        }

        /* ══════════════════════════════════════════════════════════
           CREATOR WALL
        ══════════════════════════════════════════════════════════ */

        .cw-wrap {
          width:100%;
          background:#09091F;
          border:1px solid rgba(255,255,255,0.09);
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 30px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ── Stories ───────────────────────────────────────────── */
        .cw-stories {
          display:flex; gap:14px; padding:10px 12px 8px;
          border-bottom:1px solid rgba(255,255,255,0.06);
          overflow-x:auto; scrollbar-width:none;
          background:rgba(0,0,0,0.2);
        }
        .cw-stories::-webkit-scrollbar { display:none; }
        .cw-story {
          display:flex; flex-direction:column; align-items:center; gap:4px;
          flex-shrink:0; cursor:pointer;
          animation:storyPop 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes storyPop {
          from { opacity:0; transform:scale(0.6); }
          to   { opacity:1; transform:scale(1); }
        }
        .cw-story-ring {
          width:44px; height:44px; border-radius:50%;
          padding:2.5px;
          background:var(--sr,rgba(255,255,255,0.15));
          flex-shrink:0;
        }
        .cw-story-ring--add {
          background:rgba(255,255,255,0.10);
          border:1.5px dashed rgba(255,255,255,0.25);
        }
        .cw-story-inner {
          width:100%; height:100%; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:1.3rem;
          background:#09091F;
          border:2px solid #09091F;
        }
        .cw-story-inner--add {
          font-size:1.1rem; color:rgba(255,255,255,0.45);
          background:rgba(255,255,255,0.05);
        }
        .cw-story-label {
          font-size:0.5rem; font-weight:700; letter-spacing:0.02em;
          color:rgba(255,255,255,0.45); font-family:var(--font-mono);
          max-width:44px; text-align:center;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }

        /* ── Post grid ─────────────────────────────────────────── */
        .cw-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          grid-template-rows:auto auto;
          gap:1px;
          background:rgba(255,255,255,0.06);
        }

        /* ── Individual post ───────────────────────────────────── */
        .cw-post {
          background:#09091F;
          display:flex; flex-direction:column;
          position:relative;
          transition:background 0.2s;
        }
        .cw-post:hover { background:#0C0C25; }
        .cw-post--viral {
          background:#0C0916;
        }

        /* Post header */
        .cw-ph {
          display:flex; align-items:center; gap:7px;
          padding:7px 10px 5px;
        }
        .cw-ph-face { font-size:1.5rem; line-height:1; flex-shrink:0; }
        .cw-ph-info { flex:1; min-width:0; }
        .cw-ph-name {
          font-size:0.65rem; font-weight:700;
          color:rgba(255,255,255,0.9);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .cw-ph-handle {
          font-size:0.54rem; color:rgba(255,255,255,0.35);
          font-family:var(--font-mono);
        }
        .cw-more {
          font-size:0.75rem; color:rgba(255,255,255,0.35);
          letter-spacing:0.12em; flex-shrink:0;
        }

        /* Photo area — face is the hero */
        .cw-photo {
          position:relative; overflow:hidden;
          height:170px;
          display:flex; align-items:center; justify-content:center;
        }
        .cw-photo-overlay {
          position:absolute; inset:0; pointer-events:none; z-index:1;
          background:
            radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.06) 0%, transparent 55%),
            linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 35%, rgba(0,0,0,0.6) 100%);
        }

        /* The person */
        .cw-face-wrap {
          position:relative; z-index:2;
          display:flex; align-items:center; justify-content:center;
          transform:translateY(-10px);
        }
        .cw-face-glow {
          position:absolute; inset:-16px; border-radius:50%;
          background:radial-gradient(circle, var(--fc,#fff) 0%, transparent 70%);
          opacity:0.22; filter:blur(10px);
          animation:faceGlow 3s ease-in-out infinite;
        }
        @keyframes faceGlow {
          0%,100%{ opacity:0.22; transform:scale(1); }
          50%    { opacity:0.36; transform:scale(1.1); }
        }
        .cw-face {
          font-size:72px; line-height:1; position:relative; z-index:1;
          filter:drop-shadow(0 6px 20px rgba(0,0,0,0.5));
          animation:faceBob 4s ease-in-out infinite;
        }
        @keyframes faceBob {
          0%,100%{ transform:translateY(0) scale(1); }
          50%    { transform:translateY(-4px) scale(1.03); }
        }

        /* Feature badge */
        .cw-badge {
          position:absolute; top:8px; right:8px; z-index:3;
          font-size:0.52rem; font-weight:800; letter-spacing:0.03em;
          color:var(--bc,#fff);
          background:rgba(0,0,0,0.62);
          backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:6px; padding:3px 8px;
          text-shadow:0 0 10px var(--bc,#fff);
          white-space:nowrap;
        }

        /* Caption */
        .cw-caption {
          position:absolute; bottom:0; left:0; right:0; z-index:3;
          padding:4px 9px 6px;
          font-size:0.58rem; font-weight:600; line-height:1.35;
          color:rgba(255,255,255,0.92);
          text-shadow:0 1px 6px rgba(0,0,0,0.8);
          background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 100%);
        }

        /* ── Floating hearts on viral post ─────────────────────── */
        .cw-hearts {
          position:absolute; bottom:40px; right:12px; z-index:4;
          pointer-events:none; width:30px;
        }
        .cw-h {
          position:absolute; right:0; font-size:1.2rem; opacity:0;
          animation:heartRise 2.8s ease-out infinite;
        }
        .cw-h1 { animation-delay:0.0s; }
        .cw-h2 { animation-delay:0.5s; right:14px; font-size:1.0rem; }
        .cw-h3 { animation-delay:1.0s; font-size:1.3rem; }
        .cw-h4 { animation-delay:1.5s; right:10px; font-size:0.9rem; }
        .cw-h5 { animation-delay:2.0s; font-size:1.1rem; }
        .cw-h6 { animation-delay:2.5s; right:16px; font-size:1.0rem; }
        @keyframes heartRise {
          0%   { opacity:0; transform:translateY(0) scale(0.5); }
          12%  { opacity:1; transform:translateY(-12px) scale(1.25); }
          75%  { opacity:0.8; }
          100% { opacity:0; transform:translateY(-90px) scale(0.8); }
        }

        /* Double-tap heart flash */
        .cw-doubletap {
          position:absolute; inset:0; z-index:5;
          display:flex; align-items:center; justify-content:center;
          font-size:3.5rem; pointer-events:none;
          animation:dtFlash 4s ease-in-out infinite 1s;
          opacity:0;
        }
        @keyframes dtFlash {
          0%,100%{ opacity:0; transform:scale(0.4); }
          8%     { opacity:1; transform:scale(1.2); }
          18%    { opacity:0; transform:scale(1.5); }
        }

        /* ── Actions row ───────────────────────────────────────── */
        .cw-actions {
          display:flex; align-items:center; justify-content:space-between;
          padding:7px 10px 2px;
        }
        .cw-action-left { display:flex; gap:12px; }
        .cw-btn-like, .cw-btn-icon {
          background:none; border:none; cursor:pointer;
          font-size:1.2rem; padding:0; line-height:1;
          transition:transform 0.15s;
        }
        .cw-btn-like:hover,.cw-btn-icon:hover { transform:scale(1.2); }
        .cw-btn-like--on { animation:likeHeartbeat 1.8s ease-in-out infinite; }
        @keyframes likeHeartbeat {
          0%,100%{ transform:scale(1); }
          15%    { transform:scale(1.3); }
          30%    { transform:scale(1); }
        }
        .cw-btn-save { font-size:1rem; }

        .cw-likes {
          padding:2px 10px;
          font-size:0.65rem; font-weight:700;
          color:rgba(255,255,255,0.88);
        }
        .cw-comment-preview {
          padding:1px 10px 2px;
          font-size:0.6rem;
          color:rgba(255,255,255,0.65);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .cw-comment-name { font-weight:800; color:rgba(255,255,255,0.9); }
        .cw-view-count {
          padding:1px 10px 8px;
          font-size:0.55rem; font-family:var(--font-mono);
          color:rgba(255,255,255,0.28); letter-spacing:0.02em;
        }

        /* Viral post — pink glow border */
        .cw-post--viral .cw-photo {
          animation:viralGlow 2.5s ease-in-out infinite;
        }
        @keyframes viralGlow {
          0%,100%{ box-shadow:inset 0 0 0 1.5px rgba(255,45,139,0.25); }
          50%    { box-shadow:inset 0 0 0 2px rgba(255,45,139,0.55),inset 0 0 30px rgba(255,45,139,0.12); }
        }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width:860px) {
          .cw-photo { height:140px; }
          .cw-face  { font-size:56px; }
        }

      `}</style>
    </div>
  )
}

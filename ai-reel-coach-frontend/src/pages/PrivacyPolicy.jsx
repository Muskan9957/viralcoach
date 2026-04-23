import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const LAST_UPDATED = 'April 22, 2025'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{
      fontFamily: 'var(--font-head)', fontWeight: 700,
      fontSize: '1.2rem', color: 'var(--text)',
      letterSpacing: '-0.02em', marginBottom: 14,
      paddingBottom: 10,
      borderBottom: '1px solid var(--border)',
    }}>{title}</h2>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.93rem', lineHeight: 1.85 }}>
      {children}
    </div>
  </div>
)

const P = ({ children }) => <p style={{ marginBottom: 12 }}>{children}</p>

const Ul = ({ items }) => (
  <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
    {items.map((item, i) => <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.93rem', lineHeight: 1.7 }}>{item}</li>)}
  </ul>
)

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 5%',
        background: 'var(--surface-nav)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-nav)',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={36} showWordmark />
        </Link>
        <Link to="/auth" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
          Get Started →
        </Link>
      </nav>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,200,255,0.06), rgba(123,92,240,0.06))',
        borderBottom: '1px solid var(--border)',
        padding: '56px 5% 48px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 12,
        }}>Legal</div>
        <h1 style={{
          fontFamily: 'var(--font-head)', fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          letterSpacing: '-0.03em', color: 'var(--text)',
          marginBottom: 12,
        }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Last updated: {LAST_UPDATED} · Anahat Aura LLP
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 5% 80px' }}>

        <div style={{
          background: 'rgba(0,200,255,0.05)',
          border: '1px solid rgba(0,200,255,0.15)',
          borderRadius: 12, padding: '18px 22px',
          marginBottom: 40,
          fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7,
        }}>
          This Privacy Policy explains how <strong style={{ color: 'var(--text)' }}>Anahat Aura LLP</strong> ("we", "our", "us") collects, uses, and protects your personal information when you use <strong style={{ color: 'var(--text)' }}>ViralCoach</strong> at <strong style={{ color: 'var(--text)' }}>anahatone.com</strong>. By using our service, you agree to the practices described in this policy.
        </div>

        <Section title="1. Information We Collect">
          <P>We collect the following types of information when you use ViralCoach:</P>
          <P><strong style={{ color: 'var(--text)' }}>Account Information</strong></P>
          <Ul items={[
            'Name and email address when you register',
            'Password (stored as a secure hash — we never store plain text passwords)',
            'Profile avatar if you upload or generate one',
          ]} />
          <P><strong style={{ color: 'var(--text)' }}>Usage Data</strong></P>
          <Ul items={[
            'Scripts and hooks you generate using our AI tools',
            'Hook scores and performance data you submit',
            'Content calendar entries and templates you create',
            'Chat messages with the AI Coach',
            'Language preferences and platform settings',
          ]} />
          <P><strong style={{ color: 'var(--text)' }}>Technical Data</strong></P>
          <Ul items={[
            'IP address and browser type',
            'Device information',
            'Pages visited and features used within the app',
            'Date and time of access',
          ]} />
          <P><strong style={{ color: 'var(--text)' }}>Payment Data</strong></P>
          <P>Payments are processed by Razorpay. We do not store your card number, bank account, or UPI details. We only retain a subscription status and Razorpay customer ID to manage your plan.</P>
        </Section>

        <Section title="2. How We Use Your Information">
          <P>We use the information we collect to:</P>
          <Ul items={[
            'Create and manage your ViralCoach account',
            'Provide AI-generated scripts, hook scores, and content recommendations',
            'Process payments and manage your subscription plan',
            'Send transactional emails (account verification, password reset, billing)',
            'Improve our AI models and product features',
            'Monitor and prevent abuse, fraud, or misuse of our services',
            'Respond to your support requests',
            'Comply with legal obligations',
          ]} />
          <P>We do not sell your personal data to third parties. We do not use your content to train external AI models without your consent.</P>
        </Section>

        <Section title="3. Data Storage and Security">
          <P>Your data is stored on secure servers hosted by Railway (PostgreSQL database) and Vercel (frontend). We implement industry-standard security measures including:</P>
          <Ul items={[
            'Encrypted HTTPS connections for all data in transit',
            'Bcrypt hashing for all passwords',
            'JWT-based authentication with expiry',
            'Rate limiting to prevent brute force attacks',
            'Environment-separated secrets and API keys',
          ]} />
          <P>While we take security seriously, no system is completely immune. In the event of a data breach that affects your personal information, we will notify you within 72 hours as required under applicable law.</P>
        </Section>

        <Section title="4. Cookies and Tracking">
          <P>ViralCoach uses minimal cookies and local storage for:</P>
          <Ul items={[
            'Keeping you logged in (JWT token stored in localStorage)',
            'Remembering your onboarding status and language preference',
          ]} />
          <P>We do not use advertising cookies or cross-site tracking cookies. We may use anonymised analytics (such as page views) to understand how our product is used.</P>
        </Section>

        <Section title="5. Third-Party Services">
          <P>We use the following third-party services to operate ViralCoach:</P>
          <Ul items={[
            'Anthropic (Claude API) — powers AI script generation, hook scoring, and AI Coach',
            'Razorpay — payment processing and subscription management',
            'Resend — transactional email delivery',
            'Vercel — frontend hosting and CDN',
            'Railway — backend hosting and database',
            'Google OAuth — optional sign-in with Google',
            'DiceBear / Avataaars — avatar generation (no personal data sent)',
          ]} />
          <P>Each of these services has its own privacy policy. We only share the minimum data necessary for each service to function.</P>
        </Section>

        <Section title="6. Data Retention">
          <P>We retain your personal data for as long as your account is active. If you delete your account:</P>
          <Ul items={[
            'Your profile, scripts, and generated content are permanently deleted within 30 days',
            'Payment records may be retained for up to 7 years as required by Indian financial regulations',
            'Anonymised usage statistics may be retained indefinitely',
          ]} />
        </Section>

        <Section title="7. Your Rights">
          <P>You have the right to:</P>
          <Ul items={[
            'Access the personal data we hold about you',
            'Request correction of inaccurate data',
            'Request deletion of your account and associated data',
            'Export your data in a portable format',
            'Withdraw consent for non-essential data processing',
            'Lodge a complaint with the relevant data protection authority',
          ]} />
          <P>To exercise any of these rights, email us at <strong style={{ color: 'var(--text)' }}>privacy@anahatone.com</strong></P>
        </Section>

        <Section title="8. Children's Privacy">
          <P>ViralCoach is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it immediately.</P>
        </Section>

        <Section title="9. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. For significant changes, we will notify you by email. Continued use of ViralCoach after changes are posted constitutes acceptance of the updated policy.</P>
        </Section>

        <Section title="10. Contact Us">
          <P>If you have any questions about this Privacy Policy or how we handle your data, please contact:</P>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px 24px',
            fontSize: '0.9rem', lineHeight: 2,
          }}>
            <strong style={{ color: 'var(--text)' }}>Anahat Aura LLP</strong><br />
            Email: <span style={{ color: 'var(--accent)' }}>privacy@anahatone.com</span><br />
            Website: <span style={{ color: 'var(--accent)' }}>anahatone.com</span>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, background: 'var(--surface)',
        fontSize: '0.8rem', color: 'var(--text-faint)',
      }}>
        <span>© Anahat Aura LLP · ViralCoach</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

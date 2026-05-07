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

export default function Terms() {
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
        }}>Terms of Service</h1>
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
          These Terms of Service ("Terms") govern your use of <strong style={{ color: 'var(--text)' }}>Nuovve</strong>, operated by <strong style={{ color: 'var(--text)' }}>Anahat Aura LLP</strong> ("Company", "we", "us"). By creating an account or using our service at <strong style={{ color: 'var(--text)' }}>anahatone.com</strong>, you agree to be bound by these Terms. If you do not agree, please do not use the service.
        </div>

        <Section title="1. Acceptance of Terms">
          <P>By accessing or using Nuovve, you confirm that you are at least 13 years of age, have read and understood these Terms, and agree to be legally bound by them. If you are using Nuovve on behalf of a business, you represent that you have authority to bind that business to these Terms.</P>
        </Section>

        <Section title="2. Description of Service">
          <P>Nuovve is an AI-powered content creation platform that provides:</P>
          <Ul items={[
            'AI-generated scripts for short-form video content',
            'Hook scoring and analysis',
            'Trending topic intelligence',
            'AI coaching and strategy advice',
            'Caption and hashtag generation',
            'Content calendar planning',
            'Performance tracking tools',
          ]} />
          <P>The service is provided "as is" and may be updated, modified, or discontinued at any time. We reserve the right to add, remove, or change features without prior notice.</P>
        </Section>

        <Section title="3. Account Registration">
          <P>To use Nuovve, you must create an account. You agree to:</P>
          <Ul items={[
            'Provide accurate, current, and complete information during registration',
            'Maintain the security of your password and not share it with others',
            'Notify us immediately of any unauthorised access to your account',
            'Be responsible for all activity that occurs under your account',
          ]} />
          <P>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</P>
        </Section>

        <Section title="4. Acceptable Use">
          <P>You agree to use Nuovve only for lawful purposes. You must not:</P>
          <Ul items={[
            'Use the service to generate content that is illegal, defamatory, harassing, or hateful',
            'Attempt to reverse engineer, scrape, or copy our AI models or platform',
            'Use automated tools to access the service in a way that exceeds normal usage',
            'Resell or redistribute Nuovve\'s AI-generated outputs as your own product or service',
            'Share account credentials or allow multiple people to use a single account',
            'Use the service to generate spam, misinformation, or deceptive content',
            'Attempt to bypass rate limits, payment systems, or security measures',
          ]} />
          <P>Violation of these rules may result in immediate account termination without refund.</P>
        </Section>

        <Section title="5. Intellectual Property">
          <P><strong style={{ color: 'var(--text)' }}>Your content:</strong> You retain ownership of all content you input into Nuovve (your topics, ideas, and uploaded materials). By using the service, you grant us a limited licence to process your input solely for the purpose of providing the service to you.</P>
          <P><strong style={{ color: 'var(--text)' }}>AI-generated content:</strong> Scripts, hooks, captions, and other content generated by Nuovve's AI are provided for your personal and commercial use. You may use, publish, and monetise AI-generated content from Nuovve.</P>
          <P><strong style={{ color: 'var(--text)' }}>Our platform:</strong> The Nuovve platform, branding, logo, design, and underlying technology are the intellectual property of Anahat Aura LLP. You may not copy, reproduce, or use these without our written permission.</P>
        </Section>

        <Section title="6. Subscription and Payments">
          <P>Nuovve offers a free plan and paid subscription plans. Paid plans are billed monthly or annually as selected at checkout.</P>
          <Ul items={[
            'All payments are processed by Razorpay in Indian Rupees (INR)',
            'Subscriptions automatically renew unless cancelled before the renewal date',
            'You can cancel your subscription at any time from your account settings',
            'Upon cancellation, you retain access until the end of your current billing period',
            'We do not offer refunds for partial months or unused features',
          ]} />
          <P>We reserve the right to change our pricing with 30 days\' notice. Continued use after a price change constitutes acceptance of the new pricing.</P>
        </Section>

        <Section title="7. Refund Policy">
          <P>We offer refunds in the following circumstances:</P>
          <Ul items={[
            'Technical issues on our end that prevented you from accessing the service for more than 48 consecutive hours',
            'Accidental duplicate charges',
            'Refund requests made within 7 days of your first subscription payment',
          ]} />
          <P>To request a refund, email us at <strong style={{ color: 'var(--text)' }}>support@anahatone.com</strong> with your account details and reason for the refund request.</P>
        </Section>

        <Section title="8. AI-Generated Content Disclaimer">
          <P>Nuovve uses artificial intelligence to generate content suggestions. You acknowledge that:</P>
          <Ul items={[
            'AI-generated content may occasionally be inaccurate, incomplete, or unsuitable',
            'You are responsible for reviewing and editing all content before publishing',
            'Nuovve does not guarantee any specific results, views, followers, or revenue from using our service',
            'AI outputs should not be used as professional legal, financial, or medical advice',
          ]} />
        </Section>

        <Section title="9. Limitation of Liability">
          <P>To the maximum extent permitted by applicable law, Anahat Aura LLP shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of revenue, loss of data, or loss of business opportunities, arising from your use of Nuovve.</P>
          <P>Our total liability to you for any claim arising from these Terms or your use of the service shall not exceed the amount you paid us in the 3 months preceding the claim.</P>
        </Section>

        <Section title="10. Termination">
          <P>We may suspend or terminate your account at any time if you violate these Terms, engage in fraudulent activity, or if we decide to discontinue the service.</P>
          <P>You may delete your account at any time from your profile settings. Upon termination, your data will be deleted as described in our Privacy Policy.</P>
        </Section>

        <Section title="11. Governing Law">
          <P>These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in India. If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force.</P>
        </Section>

        <Section title="12. Changes to Terms">
          <P>We may update these Terms from time to time. When we do, we will update the "Last updated" date at the top of this page and notify you by email for significant changes. Continued use of Nuovve after changes are posted constitutes your acceptance of the updated Terms.</P>
        </Section>

        <Section title="13. Contact Us">
          <P>For questions about these Terms, please contact:</P>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px 24px',
            fontSize: '0.9rem', lineHeight: 2,
          }}>
            <strong style={{ color: 'var(--text)' }}>Anahat Aura LLP</strong><br />
            Email: <span style={{ color: 'var(--accent)' }}>support@anahatone.com</span><br />
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
        <span>© Anahat Aura LLP · Nuovve</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

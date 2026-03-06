import React from 'react';
import {
    FileText,
    ArrowUpRight,
    Building2,
    Check,
    DollarSign,
    ArrowRight,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────────────── */
interface PlanFeature {
    text: string;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
    priceNote?: string;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'accent';
    popular?: boolean;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    accentColor: string;
    featuresTitle: string;
    features: PlanFeature[];
}

/* ─── Plan Data ───────────────────────────────────────────────────────── */
const plans: Plan[] = [
    {
        id: 'standard',
        name: 'Standard',
        description: 'Perfect for individuals and small early-stage teams.',
        price: 'Free',
        priceNote: 'Forever free for core features',
        buttonText: 'Get started',
        buttonVariant: 'primary',
        icon: FileText,
        iconBg: 'rgba(59,130,246,0.08)',
        iconColor: '#3b82f6',
        accentColor: '#2563eb',
        featuresTitle: 'CORE FUNCTIONALITY',
        features: [
            { text: 'Kanban & List views' },
            { text: 'Up to 3 projects' },
            { text: 'Real-time syncing across devices' },
            { text: 'Basic task search & filtering' },
            { text: '7-day activity history' },
            { text: 'Community support' },
        ],
    },
    {
        id: 'growth',
        name: 'Growth',
        description: 'Built for scaling startups & professional teams.',
        price: '$12',
        priceNote: 'Per user, per month',
        buttonText: 'Start free trial',
        buttonVariant: 'accent',
        popular: true,
        icon: ArrowUpRight,
        iconBg: 'rgba(16,185,129,0.08)',
        iconColor: '#10b981',
        accentColor: '#059669',
        featuresTitle: 'EVERYTHING IN STANDARD, PLUS:',
        features: [
            { text: 'Unlimited projects & boards' },
            { text: 'Advanced permissions & roles' },
            { text: 'Unlimited activity history' },
            { text: 'File uploads up to 100MB' },
            { text: 'Custom automations (500/mo)' },
            { text: 'Priority email support' },
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large orgs needing security & control.',
        price: 'Custom',
        priceNote: 'Tailored to your workspace',
        buttonText: 'Contact sales',
        buttonVariant: 'secondary',
        icon: Building2,
        iconBg: 'rgba(168,85,247,0.08)',
        iconColor: '#a855f7',
        accentColor: '#9333ea',
        featuresTitle: 'EVERYTHING IN GROWTH, PLUS:',
        features: [
            { text: 'SAML SSO & Advanced Security' },
            { text: 'Dedicated Account Manager' },
            { text: '99.9% Uptime SLA' },
            { text: 'Unlimited custom automations' },
            { text: 'Custom data residency' },
            { text: '24/7 dedicated phone support' },
        ],
    },
];

/* ─── Inline Styles ───────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

  .pricing-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .pricing-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  }
  .pricing-btn {
    transition: all 0.2s ease;
  }
  .pricing-btn:hover {
    transform: translateY(-1px);
  }
  @media (max-width: 900px) {
    .pricing-grid {
      grid-template-columns: 1fr !important;
      max-width: 420px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }
`;

const st: Record<string, React.CSSProperties> = {
    section: {
        width: '100%',
        background: '#fafaf8',
        padding: '120px 24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        borderTop: '1px solid rgba(0,0,0,0.04)',
    },
    wrapper: {
        maxWidth: 1200,
        margin: '0 auto',
    },

    /* Header */
    headerWrap: {
        textAlign: 'center',
        marginBottom: 80,
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#059669',
        background: 'rgba(16,185,129,0.1)',
        padding: '8px 18px',
        borderRadius: 999,
        marginBottom: 28,
    },
    headline: {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(36px, 5.5vw, 64px)',
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: '-1px',
        color: '#111',
        maxWidth: 700,
        margin: '0 auto 20px',
    },
    headlineAccent: {
        color: '#a855f7',
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
        fontWeight: 400,
        maxWidth: 540,
        margin: '0 auto',
        lineHeight: 1.7,
    },

    /* Grid */
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28,
        alignItems: 'stretch',
    },

    /* Card */
    card: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 24,
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    },
    cardPopular: {
        border: '2px solid #10b981',
        boxShadow: '0 8px 40px rgba(16,185,129,0.12)',
    },
    cardInner: {
        position: 'relative',
        padding: '44px 36px 40px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textAlign: 'left',
    },

    /* Popular badge */
    popularBadge: {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#10b981',
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '7px 20px',
        borderRadius: '0 0 14px 14px',
        zIndex: 5,
    },

    /* Icon */
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    /* Plan name */
    planName: {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 28,
        fontWeight: 600,
        color: '#111',
        marginBottom: 8,
    },
    planDesc: {
        fontSize: 14,
        color: '#888',
        lineHeight: 1.6,
        marginBottom: 28,
        minHeight: 45,
    },

    /* Price */
    priceWrap: {
        marginBottom: 32,
    },
    priceValue: {
        fontSize: 48,
        fontWeight: 800,
        letterSpacing: '-2px',
        color: '#111',
        lineHeight: 1,
    },
    priceNote: {
        display: 'block',
        fontSize: 13,
        color: '#999',
        fontWeight: 500,
        marginTop: 8,
    },

    /* Buttons */
    btnPrimary: {
        width: '100%',
        padding: '15px 24px',
        borderRadius: 16,
        fontSize: 15,
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 36,
        background: '#1a1a1a',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    },
    btnAccent: {
        width: '100%',
        padding: '15px 24px',
        borderRadius: 16,
        fontSize: 15,
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 36,
        background: '#10b981',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(16,185,129,0.25)',
    },
    btnSecondary: {
        width: '100%',
        padding: '15px 24px',
        borderRadius: 16,
        fontSize: 15,
        fontWeight: 700,
        border: '1.5px solid rgba(0,0,0,0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 36,
        background: '#fff',
        color: '#1a1a1a',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },

    /* Features */
    featuresSection: {
        marginTop: 'auto',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        paddingTop: 28,
    },
    featuresTitle: {
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: 20,
    },
    featureRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 14,
    },
    featureCheck: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1,
    },
    featureText: {
        fontSize: 14,
        fontWeight: 500,
        color: '#555',
        lineHeight: 1.5,
    },
};

/* ─── Component ───────────────────────────────────────────────────────── */
export function PricingSection() {
    return (
        <section id="pricing" style={st.section}>
            <style>{css}</style>
            <div style={st.wrapper}>
                {/* Header */}
                <div style={st.headerWrap}>
                    <div style={st.badge}>
                        <DollarSign size={14} strokeWidth={2.5} />
                        Flexible pricing
                    </div>
                    <h2 style={st.headline}>
                        Choose the plan that{' '}
                        <span style={st.headlineAccent}>best fits</span>{' '}
                        your team
                    </h2>
                    <p style={st.subtitle}>
                        Pricing that scales with your ambition. Start for free, upgrade when you need more power.
                    </p>
                </div>

                {/* Cards */}
                <div className="pricing-grid" style={st.grid}>
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const btnStyle =
                            plan.buttonVariant === 'accent' ? st.btnAccent
                                : plan.buttonVariant === 'secondary' ? st.btnSecondary
                                    : st.btnPrimary;

                        return (
                            <div
                                key={plan.id}
                                className="pricing-card"
                                style={{
                                    ...st.card,
                                    ...(plan.popular ? st.cardPopular : {}),
                                }}
                            >
                                {plan.popular && (
                                    <div style={st.popularBadge}>Most Popular</div>
                                )}

                                <div style={st.cardInner}>
                                    {/* Icon */}
                                    <div style={{ ...st.iconBox, background: plan.iconBg }}>
                                        <Icon size={24} color={plan.iconColor} strokeWidth={2} />
                                    </div>

                                    {/* Name & Desc */}
                                    <h3 style={st.planName}>{plan.name}</h3>
                                    <p style={st.planDesc}>{plan.description}</p>

                                    {/* Price */}
                                    <div style={st.priceWrap}>
                                        <span style={st.priceValue}>{plan.price}</span>
                                        {plan.priceNote && (
                                            <span style={st.priceNote}>{plan.priceNote}</span>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <button className="pricing-btn" style={btnStyle}>
                                        {plan.buttonText}
                                        {plan.buttonVariant === 'secondary' && (
                                            <ArrowRight size={16} />
                                        )}
                                    </button>

                                    {/* Features */}
                                    <div style={st.featuresSection}>
                                        <p style={{ ...st.featuresTitle, color: plan.accentColor }}>
                                            {plan.featuresTitle}
                                        </p>
                                        {plan.features.map((f, i) => (
                                            <div key={i} style={st.featureRow}>
                                                <div
                                                    style={{
                                                        ...st.featureCheck,
                                                        background: plan.iconBg,
                                                        color: plan.iconColor,
                                                    }}
                                                >
                                                    <Check size={13} strokeWidth={3} />
                                                </div>
                                                <span style={st.featureText}>{f.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default PricingSection;

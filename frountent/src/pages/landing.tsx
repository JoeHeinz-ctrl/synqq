import { useState, useEffect } from "react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { PricingSection } from "@/components/PricingSection";
import { useNavigate } from "react-router-dom";
import { Bot, LayoutGrid, Users, Zap } from "lucide-react";

const features = [
    { Icon: Bot, title: "Chat → Task AI", desc: "Automatically detect tasks from conversations and convert them into project tasks with one click." },
    { Icon: LayoutGrid, title: "Kanban Project Boards", desc: "Organize work with simple boards: Todo, Doing, Done. Drag and drop tasks with smooth animations." },
    { Icon: Users, title: "Team Collaboration", desc: "Work together with integrated team chat and shared projects. Real-time updates across all devices." },
    { Icon: Zap, title: "Instant Team Setup", desc: "Create a workspace and invite teammates in seconds. Share team codes and start collaborating immediately." },
];

const navLinks = ["Features", "About", "Pricing", "Blog"];
const footerLinks = ["Features", "Pricing", "About", "Blog", "Privacy", "Terms"];

export default function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Debug: log when landing page mounts
    useEffect(() => {
        console.log("Landing page mounted - current path:", window.location.pathname);
    }, []);

    const onGetStarted = () => navigate('/login');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={s.root}>
            <style>{css}</style>

            {/* Navbar */}
            <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
                <div style={s.logo}>
                    <div style={s.logoIcon}>✦</div>
                    <span style={s.logoText}>Synq</span>
                </div>
                <nav className="nav-links">
                    {navLinks.map((l) => (
                        <button key={l} className="nav-link" onClick={() => {
                            if (l === 'Pricing') {
                                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                            } else if (l === 'Features') {
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}>{l}</button>
                    ))}
                </nav>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button className="pill-btn pill-btn-ghost" onClick={onGetStarted}>Sign in</button>
                    <button className="pill-btn pill-btn-dark" onClick={onGetStarted}>Join us →</button>
                </div>
            </header>

            {/* (previous manual wrapper removed; using the component’s fullScreen prop instead) */}

            {/* Hero */}
            <section style={s.hero}>

                {/* Background animation confined to hero area */}
                <div style={s.heroBg}>
                    <NeuralBackground color="#818cf8" trailOpacity={0.08} speed={0.85} particleCount={800} />
                </div>

                {/* Hero content — centred over the lower portion */}
                <div style={s.heroContent}>
                    <div className="animate-up" style={{ animationDelay: "0s" }}>
                        <div style={s.heroBadge}>
                            <span style={s.heroBadgeDot} />
                            Chat → Task AI · Automatically convert conversations to tasks
                        </div>
                    </div>

                    <h1 className="hero-headline animate-up" style={{ animationDelay: "0.12s" }}>
                        Turn Team Conversations<br />Into Tasks Instantly
                    </h1>

                    <p className="hero-sub animate-up" style={{ animationDelay: "0.26s" }}>
                        SYNQ combines team chat and project management so discussions become 
                        actionable tasks automatically. Stop losing important work in chat threads.
                    </p>

                    <div className="hero-btns animate-up" style={{ animationDelay: "0.4s" }}>
                        <button className="pill-btn pill-btn-dark pill-btn-lg" onClick={onGetStarted}>
                            Get Started Free
                        </button>
                        <button className="pill-btn pill-btn-ghost pill-btn-lg" onClick={onGetStarted}>
                            Watch Demo ↗
                        </button>
                    </div>

                    <p className="animate-up" style={{ ...s.heroNote, animationDelay: "0.52s" }}>
                        🚧 Early Access · Free during beta · Help shape the future
                    </p>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={s.features}>
                <p style={s.eyebrow}>CORE FEATURES</p>
                <h2 style={s.featuresHeadline}>
                    Teams Talk. Tasks Get Done.
                </h2>
                <p style={s.featuresSubheadline}>
                    Important work often gets buried in chat threads. SYNQ solves this by detecting 
                    tasks directly from conversations and turning them into actionable project items.
                </p>
                <div className="feature-grid">
                    {features.map((f) => {
                        const FeatureIcon = f.Icon;
                        return (
                            <div key={f.title} className="feature-card">
                                <div style={s.featureIcon}>
                                    <FeatureIcon size={32} />
                                </div>
                                <h3 style={s.featureTitle}>{f.title}</h3>
                                <p style={s.featureDesc}>{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
            {/* Pricing Section */}
            <PricingSection />

            {/* CTA Banner */}
            <section style={s.ctaBanner}>
                <h2 style={s.ctaHeadline}>Ready to turn conversations into tasks?</h2>
                <p style={s.ctaSub}>Join early adopters using SYNQ to keep work organized and nothing lost in chat.</p>
                <button
                    className="pill-btn"
                    style={{ background: "#fff", color: "#1a1a1a", padding: "16px 44px", fontSize: 16, fontWeight: 700, marginTop: 24 }}
                    onClick={onGetStarted}
                >
                    Start Using SYNQ →
                </button>
            </section>

            {/* Footer */}
            <footer style={s.footer}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                    <div style={{ ...s.logoIcon, width: 28, height: 28, fontSize: 14 }}>✦</div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Synq</span>
                </div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
                    {footerLinks.map((l) => (
                        <button key={l} className="footer-link">{l}</button>
                    ))}
                </div>
                <p style={{ fontSize: 13, color: "#aaa" }}>© 2026 Synq. All rights reserved.</p>
            </footer>
        </div>
    );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 48px;
    transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
    background: rgba(0,0,0,0.2); /* dark translucent over hero */
  }
  .navbar--scrolled {
    /* remain dark, just add slight blur/opacity change if desired */
    background: rgba(0,0,0,0.25);
    color: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 12px rgba(0,0,0,0.15);
    /* no border needed on dark navbar */
  }

  /* Nav links */
  .nav-links { display: flex; gap: 8px; align-items: center; }
  .nav-link {
    font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,0.85);
    text-shadow: 0 1px 3px rgba(0,0,0,0.6);
    padding: 6px 4px; border-radius: 6px;
    background: none; border: none; cursor: pointer;
    transition: color 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .nav-link:hover { color: #fff; }

  /* scrolled state links remain bright */
  .navbar--scrolled .nav-link { color: rgba(255,255,255,0.85); }
  .navbar--scrolled .nav-link:hover { color: #fff; }

  /* Pill buttons */
  .pill-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 10px 22px; border-radius: 999px;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.22s ease;
    border: none; font-family: 'Inter', sans-serif;
    text-decoration: none;
  }
  .pill-btn-lg { padding: 14px 32px !important; font-size: 15px !important; }
  .pill-btn-dark {
    background: #1a1a1a; color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  .pill-btn-dark:hover {
    background: #333;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  .pill-btn-ghost {
    background: rgba(255,255,255,0.75); color: #1a1a1a;
    border: 1.5px solid rgba(0,0,0,0.12);
    backdrop-filter: blur(8px);
  }
  .pill-btn-ghost:hover {
    background: rgba(255,255,255,0.95);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }

  /* Hero headline + sub */
  .hero-headline {
    font-size: clamp(44px, 7vw, 68px);
    font-weight: 700;
    line-height: 1.06;
    letter-spacing: -2px;
    color: #fff; /* white for contrast against dark bg */
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    margin-bottom: 22px;
  }
  .hero-sub {
    font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.85);
    max-width: 500px; margin-bottom: 36px; font-weight: 400;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

  /* Feature grid */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    text-align: left;
  }
  .feature-card {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.1);
    background: rgba(255,255,255,0.88);
  }

  /* Footer links */
  .footer-link {
    font-size: 13px; color: #888; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: color 0.2s;
  }
  .footer-link:hover { color: #333; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-up { animation: fadeUp 0.8s both ease; }

  /* Responsive */
  @media (max-width: 900px) {
    .feature-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .feature-grid { grid-template-columns: 1fr; }
    .nav-links { display: none; }
    .navbar { padding: 14px 20px; }
  }
`;

const s: Record<string, React.CSSProperties> = {
    root: {
        position: "relative",
        minHeight: "100vh",
        background: "#fafaf8",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: "hidden",
    },

    logo: { display: "flex", alignItems: "center", gap: 8 },
    logoIcon: {
        width: 32, height: 32, borderRadius: 9,
        background: "#1a1a1a", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 700,
    },
    logoText: { fontSize: 18, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.3px" },

    /* Hero — full viewport, image as cover background */
    hero: {
        position: "relative",
        height: "100vh",
        minHeight: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    heroBg: {
        position: "absolute",
        inset: 0,
    },

    heroImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center center",
        display: "block",
    },

    /* Subtle vignette at top for navbar readability */
    heroFadeTop: {
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "25%",
        background: "linear-gradient(to bottom, rgba(250,250,248,0.45) 0%, transparent 100%)",
        pointerEvents: "none",
    },

    /* Fade at the bottom — blends into page */
    heroFadeBottom: {
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "40%",
        background: "linear-gradient(to bottom, rgba(250,250,248,0) 0%, rgba(250,250,248,0.6) 60%, rgba(250,250,248,1) 100%)",
        pointerEvents: "none",
    },

    /* Content is centered in the viewport, slightly shifted down from true center */
    heroContent: {
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: 700,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 24px",
        marginTop: "8vh", // shift slightly below true center, toward lower sky
    },

    heroBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 999,
        padding: "6px 16px",
        fontSize: 11,
        fontWeight: 600,
        color: "#555",
        letterSpacing: "0.5px",
        backdropFilter: "blur(8px)",
        marginBottom: 22,
        textTransform: "uppercase",
    },
    heroBadgeDot: {
        width: 6, height: 6, borderRadius: "50%",
        background: "#10b981",
        display: "inline-block",
        boxShadow: "0 0 0 3px rgba(16,185,129,0.25)",
    },

    heroNote: { marginTop: 14, fontSize: 12, color: "#aaa", fontWeight: 400 },

    /* Features section */
    features: {
        padding: "96px 48px",
        maxWidth: 1100,
        margin: "0 auto",
        textAlign: "center",
    },
    eyebrow: {
        fontSize: 11, fontWeight: 700, letterSpacing: "2px",
        color: "#aaa", textTransform: "uppercase", marginBottom: 14,
    },
    featuresHeadline: {
        fontSize: 40, fontWeight: 700, letterSpacing: "-1px",
        color: "#111", lineHeight: 1.2, marginBottom: 16,
    },
    featuresSubheadline: {
        fontSize: 16, color: "#666", lineHeight: 1.7, 
        maxWidth: 700, margin: "0 auto 56px", fontWeight: 400,
    },
    featureIcon: { fontSize: 32, marginBottom: 16 },
    featureTitle: { fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 10, letterSpacing: "-0.2px" },
    featureDesc: { fontSize: 14, color: "#666", lineHeight: 1.65, fontWeight: 400 },

    /* CTA Banner */
    ctaBanner: {
        background: "#1a1a1a",
        backgroundImage: "radial-gradient(ellipse at 50% 120%, rgba(11,125,224,0.25) 0%, transparent 70%)",
        borderRadius: 28,
        margin: "0 40px 80px",
        padding: "80px 40px",
        textAlign: "center",
    },
    ctaHeadline: { fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: "-1px", marginBottom: 14 },
    ctaSub: { fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 },

    /* Footer */
    footer: {
        padding: "48px 40px",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        textAlign: "center",
        background: "#fafaf8",
    },
};
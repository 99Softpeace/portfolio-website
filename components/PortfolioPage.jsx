"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Principles" },
  { id: "projects", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const TARGET_COMPANIES = [
  "Amazon Standards",
  "Meta Product Speed",
  "Stripe Precision",
  "Airbnb Craft",
  "Figma Clarity",
  "Shopify Execution",
];

const HIGHLIGHTS = [
  {
    title: "Interface Quality",
    value: "A+",
    detail:
      "Balanced typography, spacing rhythm, and motion that supports readability.",
  },
  {
    title: "Engineering Discipline",
    value: "99%",
    detail:
      "Clean architecture with reusable UI and practical state patterns for scale.",
  },
  {
    title: "Product Thinking",
    value: "3x",
    detail:
      "Designed to improve conversion clarity and narrative confidence across sections.",
  },
];

const PRINCIPLES = [
  {
    id: "01",
    title: "Narrative-Driven Layouts",
    description:
      "Every section must answer a hiring manager question in under five seconds.",
  },
  {
    id: "02",
    title: "Systematic Styling",
    description:
      "Tokenized color, spacing, and typography to keep quality consistent as projects grow.",
  },
  {
    id: "03",
    title: "Motion With Intent",
    description:
      "Subtle transitions and reveal timing that guide attention without visual clutter.",
  },
  {
    id: "04",
    title: "Performance-First Delivery",
    description:
      "Fast-loading pages, efficient asset handling, and responsive behavior by default.",
  },
];

const TECH_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "JavaScript",
  "CSS",
  "Figma",
  "Vercel",
  "GitHub",
];

const PROJECTS = [
  {
    title: "Acctwave",
    summary:
      "A growth-focused digital services platform with bold hero messaging, conversion-first CTAs, and clear product positioning.",
    impact: "Landing page strategy, conversion UX, and visual hierarchy",
    image: "/image/acctwave-cover-v2.png",
    tags: ["Next.js", "Landing Page", "Conversion UX"],
    liveUrl: "https://acctwave.com",
    repoUrl: "https://github.com/acctwave/acctwave",
  },
  {
    title: "Idan Bay",
    summary:
      "A premium social growth platform with a clean conversion flow, fast order journey, and trust-focused UX for repeat usage.",
    impact: "Next.js product experience, onboarding clarity, and conversion-first interface design",
    image: "/image/idan-bay-cover.png",
    tags: ["Next.js", "Growth Platform", "Conversion UX"],
    liveUrl: "https://idan-bay.vercel.app",
    repoUrl: "https://github.com/99Softpeace/Idan",
  },
  {
    title: "Senator Watches",
    summary:
      "A premium ecommerce experience for luxury watches with immersive presentation, product discovery, and modern storefront architecture.",
    impact: "Next.js commerce UX, product visualization, and luxury brand styling",
    image: "/image/senatorwatches-hero-capture.png",
    tags: ["Next.js", "Ecommerce", "Luxury UI"],
    liveUrl: "https://timeless-dimension-portal.vercel.app",
    repoUrl: "https://github.com/99Softpeace/timeless-dimension-portal",
  },
  {
    title: "Smart Treasures",
    summary:
      "Investment platform experience built to communicate trust, structure, and conversion confidence.",
    impact: "Design System + Next.js + TypeScript",
    image: "/image/cbex.png",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    liveUrl: "https://smart-treasures.vercel.app/",
    repoUrl: "https://github.com/99Softpeace/smart-treasures",
  },
  {
    title: "Funmek Stores",
    summary:
      "A robust e-commerce frontend focused on product discovery flow and clean interactions.",
    impact: "Category filtering and front-end architecture",
    image: "/image/ecommerce.png",
    tags: ["JavaScript", "Responsive UI", "Commerce"],
    liveUrl: "https://online-store-six-henna.vercel.app",
    repoUrl: "https://github.com/99Softpeace/online-store",
  },
  {
    title: "Crochetbydml",
    summary:
      "Creative brand website with masonry gallery behavior and immersive visual storytelling.",
    impact: "Visual direction, interactions, and gallery UX",
    image: "/image/crochetbydml.png",
    tags: ["Creative UI", "Three.js", "Brand Web"],
    liveUrl: "https://crochetbydml.vercel.app/",
    repoUrl: "https://github.com/99Softpeace/crochetbydml",
  },
  {
    title: "Respawn",
    summary:
      "Collaborative gaming analytics product with dashboard-style data presentation.",
    impact: "Team delivery across frontend and backend workflows",
    image: "/image/respawn.png",
    tags: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://respawn-fe.vercel.app/",
    repoUrl: "https://github.com/Na8aN-web/respawn-fe",
  },
];

const JOURNEY_ITEMS = [
  {
    period: "2024 - Present",
    title: "Freelance Fullstack Developer",
    detail:
      "Shipping portfolio and business products with stronger UX hierarchy, cleaner systems, and production-ready code.",
  },
  {
    period: "2022 - 2024",
    title: "Frontend Product Projects",
    detail:
      "Built responsive experiences with reusable components and deliberate animation strategy.",
  },
  {
    period: "2020 - 2022",
    title: "Core Engineering Foundation",
    detail:
      "Focused on JavaScript depth, architecture fundamentals, and practical product implementation.",
  },
];

const THEME_STORAGE_KEY = "portfolio-theme";

function getContactEndpoint() {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return (
      process.env.NEXT_PUBLIC_LOCAL_CONTACT_ENDPOINT ||
      "http://localhost:3001/send-email"
    );
  }

  return (
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
    "https://peace-portfolio-backend.onrender.com/send-email"
  );
}

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState("light");
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featuredProject = PROJECTS[0];
  const restProjects = PROJECTS.slice(1);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: 0.01,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!revealElements.length) {
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleThemeToggle = () => {
    setTheme((previousTheme) => (previousTheme === "dark" ? "light" : "dark"));
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      mobile: formData.get("mobile"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(getContactEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Message could not be sent at the moment."
        );
      }

      event.currentTarget.reset();
      setToast({ type: "success", message: result.message || "Message sent." });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.message || "Could not connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="mesh-layer" aria-hidden="true" />
      <div className="grid-layer" aria-hidden="true" />

      <header className="site-header">
        <a className="logo" href="#home">
          Peace.
        </a>

        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "is-active" : ""}
              onClick={handleNavClick}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label="Toggle color theme"
            aria-pressed={theme === "dark"}
          >
            <span className="theme-pill">
              <span className="theme-side">L</span>
              <span className="theme-side">D</span>
              <span className="theme-glider" />
            </span>
          </button>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="section hero-shell">
          <div className="hero-main" data-reveal style={{ "--delay": "0ms" }}>
            <p className="kicker">Portfolio Engineer For High-Bar Teams</p>
            <h1>
              Product-grade design language.
              <br />
              Engineering-ready execution.
            </h1>
            <p className="hero-summary">
              I design and build portfolio and product websites that communicate
              senior-level thinking: clear hierarchy, intentional motion, and
              performance-aware implementation across light and dark themes.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View Case Studies
              </a>
              <a className="btn btn-secondary" href="#contact">
                Start A Project
              </a>
            </div>

            <div className="hero-tags">
              <span>Next.js Architecture</span>
              <span>Product UI Systems</span>
              <span>Frontend + Backend Integration</span>
            </div>
          </div>

          <aside className="hero-command" data-reveal style={{ "--delay": "70ms" }}>
            <div className="command-top">
              <div className="avatar-wrap">
                <Image
                  src="/peace4.jpg"
                  alt="Peace Olowosagba portrait"
                  fill
                  sizes="96px"
                />
              </div>
              <div>
                <p className="small-label">Open to Opportunities</p>
                <h3>Peace Olowosagba</h3>
                <p className="muted-compact">Fullstack Developer</p>
              </div>
            </div>

            <div className="command-metrics">
              <article>
                <p>Delivery Mode</p>
                <h4>Ship Fast</h4>
              </article>
              <article>
                <p>Design Style</p>
                <h4>Intentional</h4>
              </article>
              <article>
                <p>Code Quality</p>
                <h4>Production-Ready</h4>
              </article>
              <article>
                <p>Team Fit</p>
                <h4>High Ownership</h4>
              </article>
            </div>

            <div className="availability-row">
              <span className="dot" />
              Available for impactful web and product roles
            </div>
          </aside>
        </section>

        <section className="section rail-section" data-reveal style={{ "--delay": "90ms" }}>
          <p className="rail-title">Design and engineering standards aligned with:</p>
          <div className="target-rail">
            {TARGET_COMPANIES.map((company) => (
              <span key={company}>{company}</span>
            ))}
          </div>
        </section>

        <section id="about" className="section" data-reveal>
          <div className="section-head">
            <p className="eyebrow">About</p>
            <h2>Built to stand out without visual noise.</h2>
          </div>

          <div className="about-layout">
            <article className="about-panel">
              <h3>How I work</h3>
              <p>
                I combine strategic storytelling from modern agency sites with the
                rigorous UI structure expected in top product companies. Every
                block earns its place, from hero message to interaction details.
              </p>
              <p>
                The goal is simple: make your work look undeniable while keeping
                the codebase maintainable for future growth.
              </p>
            </article>

            <div className="highlight-grid">
              {HIGHLIGHTS.map((item) => (
                <article key={item.title} className="highlight-card">
                  <p className="highlight-value">{item.value}</p>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Principles</p>
            <h2>The operating system behind every build.</h2>
          </div>

          <div className="principles-grid">
            {PRINCIPLES.map((item) => (
              <article key={item.id} className="principle-card">
                <p className="principle-id">{item.id}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="tech-band">
            {TECH_STACK.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </section>

        <section id="projects" className="section" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Case Studies</p>
            <h2>Work that balances design sophistication and delivery speed.</h2>
          </div>

          <article className="featured-project">
            <div className="featured-media">
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                fill
                sizes="(max-width: 960px) 100vw, 60vw"
                unoptimized={featuredProject.image.endsWith(".svg")}
              />
            </div>
            <div className="featured-content">
              <p className="eyebrow">Featured Project</p>
              <h3>{featuredProject.title}</h3>
              <p>{featuredProject.summary}</p>
              <p className="impact-line">{featuredProject.impact}</p>
              <div className="tag-row">
                {featuredProject.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={featuredProject.liveUrl} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
                <a href={featuredProject.repoUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
            </div>
          </article>

          <div className="project-grid">
            {restProjects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-image-wrap">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 860px) 100vw, 33vw"
                    unoptimized={project.image.endsWith(".svg")}
                  />
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <p className="impact-line">{project.impact}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      Live
                    </a>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="journey" className="section" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Journey</p>
            <h2>Consistent growth toward high-impact product teams.</h2>
          </div>

          <div className="timeline">
            {JOURNEY_ITEMS.map((item) => (
              <article key={item.title} className="timeline-item">
                <p className="period">{item.period}</p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s build the portfolio that opens bigger doors.</h2>
          </div>

          <div className="contact-shell">
            <article className="contact-panel">
              <h3>Collaboration focus</h3>
              <p>
                Portfolio redesigns, startup websites, and fullstack product pages
                where visual clarity and engineering quality need to coexist.
              </p>
              <a href="mailto:softgeekpeace@gmail.com">softgeekpeace@gmail.com</a>
              <div className="contact-links">
                <a href="https://github.com/99Softpeace" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/peace-olowosagba-87b173253"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </article>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="field-grid">
                <label>
                  Full Name
                  <input name="fullName" type="text" required />
                </label>
                <label>
                  Email Address
                  <input name="email" type="email" required />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  Mobile Number
                  <input name="mobile" type="text" required />
                </label>
                <label>
                  Subject
                  <input name="subject" type="text" required />
                </label>
              </div>

              <label>
                Message
                <textarea name="message" rows={6} required />
              </label>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Copyright {currentYear} Peace Olowosagba. All rights reserved.</p>
      </footer>

      <div
        className={`toast ${toast ? "is-visible" : ""} ${toast?.type || ""}`}
        role="status"
        aria-live="polite"
      >
        {toast?.message}
      </div>
    </div>
  );
}

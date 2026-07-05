import { Link } from "react-router-dom";
import { TEMPLATES } from "../constants/templates";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-white overflow-x-hidden">
      {/* Navbar */}
      <header className="animate-fade-up flex items-center justify-between px-8 py-5 border-b border-white/5">
        <p className="font-[var(--font-display)] text-xl">ResumeOS</p>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-white/50">
          <a href="#how-it-works" className="hover:text-white transition">
            How it works
          </a>
          <a href="#templates" className="hover:text-white transition">
            Templates
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/60 hover:text-white transition">
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[var(--color-teal)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-teal-light)] transition"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-8 pt-24 pb-16 text-center">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-teal)]/20 blur-[120px]" />

        <div className="animate-fade-up relative">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50 mb-6">
            Built for the modern job hunt
          </span>

          <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl leading-tight mx-auto max-w-3xl">
            Resumes that get you past the bots and into the room.
          </h1>

          <p className="mt-6 text-white/50 max-w-xl mx-auto text-lg">
            Structured, ATS safe resumes with premium design, built in minutes.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-[var(--color-teal)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-teal-light)] transition"
            >
              Start building for free
            </Link>

            <a
              href="#how-it-works"
              className="rounded-lg border border-white/15 px-6 py-3 text-sm text-white/80 hover:border-white/30 transition"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-8 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h2 className="font-[var(--font-display)] text-3xl mb-3">Three steps. That's it.</h2>
          <p className="text-white/50">No design skills, no guesswork.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {[
            { step: "01", title: "Fill your details", desc: "Add experience, education, and skills in a guided, structured form." },
            { step: "02", title: "Preview instantly", desc: "Watch your resume update live as you type — no surprises later." },
            { step: "03", title: "Export, ATS-ready", desc: "Download a clean PDF built to pass applicant tracking systems." },
          ].map((s, i) => (
            <div key={i} className="relative">
              <span className="font-[var(--font-display)] text-5xl text-white/10">{s.step}</span>
              <p className="mt-3 font-medium text-white/90">{s.title}</p>
              <p className="mt-1 text-sm text-white/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="px-8 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h2 className="font-[var(--font-display)] text-3xl mb-3">
            The difference structure makes.
          </h2>
          <p className="text-white/50">Same experience, very different chances of being read.</p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Generic resume mockup */}
          <div>
            <p className="text-center text-xs uppercase tracking-wide text-white/30 mb-3">
              Generic resume
            </p>
            <div className="rounded-xl bg-white p-5" style={{ opacity: 0.55 }}>
              <div className="h-3 w-1/2 bg-gray-300 rounded mb-2" />
              <div className="h-2 w-1/3 bg-gray-200 rounded mb-5" />
              <div className="h-2 w-full bg-gray-200 rounded mb-1.5" />
              <div className="h-2 w-full bg-gray-200 rounded mb-1.5" />
              <div className="h-2 w-2/3 bg-gray-200 rounded mb-5" />
              <div className="h-2 w-full bg-gray-200 rounded mb-1.5" />
              <div className="h-2 w-5/6 bg-gray-200 rounded mb-1.5" />
              <div className="h-2 w-full bg-gray-200 rounded" />
            </div>
            <p className="text-center text-xs text-white/30 mt-3">
              Dense text, no hierarchy, easy for ATS to misread.
            </p>
          </div>

          {/* ResumeOS mockup */}
          <div>
            <p className="text-center text-xs uppercase tracking-wide text-[var(--color-teal-light)] mb-3">
              ResumeOS resume
            </p>
            <div className="rounded-xl bg-white p-5 shadow-2xl shadow-[var(--color-teal)]/10 ring-1 ring-[var(--color-teal)]/30">
              <div className="h-3 w-1/2 rounded mb-1" style={{ background: "#0f766e" }} />
              <div className="h-2 w-1/3 bg-gray-300 rounded mb-4" />
              <div className="h-1.5 w-16 rounded mb-2" style={{ background: "#0f766e33" }} />
              <div className="h-2 w-full bg-gray-200 rounded mb-1.5" />
              <div className="h-2 w-5/6 bg-gray-200 rounded mb-4" />
              <div className="h-1.5 w-16 rounded mb-2" style={{ background: "#0f766e33" }} />
              <div className="h-2 w-full bg-gray-200 rounded mb-1.5" />
              <div className="h-2 w-2/3 bg-gray-200 rounded" />
            </div>
            <p className="text-center text-xs text-white/40 mt-3">
              Clear sections, consistent structure, built to be parsed.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[var(--color-panel)]/50 p-6">
            <p className="font-medium mb-2">ATS safe by design</p>
            <p className="text-sm text-white/50 leading-relaxed">
              Every template maps to a clean, structured layout that parses correctly.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[var(--color-panel)]/50 p-6">
            <p className="font-medium mb-2">Live preview, always in sync</p>
            <p className="text-sm text-white/50 leading-relaxed">
              What you type is exactly what gets exported. No surprises.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[var(--color-panel)]/50 p-6">
            <p className="font-medium mb-2">8 premium templates</p>
            <p className="text-sm text-white/50 leading-relaxed">
              From minimal single column to sidebar layouts for every industry.
            </p>
          </div>
        </div>
      </section>

      {/* Compact template strip */}
      <section id="templates" className="px-8 py-16 border-t border-white/5">
        <p className="text-center text-xs uppercase tracking-wide text-white/30 mb-6">
          Choose a look
        </p>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {TEMPLATES.map((t) => (
            <span
              key={t.id}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: t.accent }}
              />
              {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 text-center border-t border-white/5">
        <h2 className="font-[var(--font-display)] text-4xl mb-4">
          Ready to build yours?
        </h2>
        <p className="text-white/50 mb-8">Free to start. No credit card required.</p>
        <Link
          to="/register"
          className="inline-block rounded-lg bg-[var(--color-teal)] px-8 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-teal-light)] transition"
        >
          Create your resume
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/5 text-center text-xs text-white/30">
        2026 ResumeOS. Built by Shaik Manjoor Ahmed.
      </footer>
    </div>
  );
};

export default Landing;
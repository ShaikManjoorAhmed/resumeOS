import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setShake(true);
      setTimeout(() => setShake(false), 300);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-ink)] flex items-center justify-center px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-teal)]/20 blur-[120px]" />

      <div className="animate-fade-up relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm tracking-wide text-white/40 mb-2">ResumeOS</p>
          <h1 className="font-[var(--font-display)] text-3xl text-white">
            Build your resume.
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Create an account to get started, free.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl border border-white/10 bg-[var(--color-panel)]/80 backdrop-blur-xl p-6 shadow-2xl ${shake ? "animate-shake" : ""}`}
        >
          {error && (
            <div className="animate-fade-up mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <label className="mb-1 block text-xs font-medium text-white/60">
            Full name
          </label>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-teal)]/60 focus:ring-1 focus:ring-[var(--color-teal)]/40"
          />

          <label className="mb-1 block text-xs font-medium text-white/60">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-teal)]/60 focus:ring-1 focus:ring-[var(--color-teal)]/40"
          />

          <label className="mb-1 block text-xs font-medium text-white/60">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-teal)]/60 focus:ring-1 focus:ring-[var(--color-teal)]/40"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-teal)] py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-teal-light)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-ink)]/30 border-t-[var(--color-ink)]" />
            )}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-teal-light)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
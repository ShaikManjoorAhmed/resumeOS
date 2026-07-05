import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getTemplateConfig } from "../constants/templates";

const API_URL = `${import.meta.env.VITE_API_URL}/resumes`;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
};

const MiniThumb = ({ config }) => (
  <div className="h-16 w-14 shrink-0 rounded-md bg-white p-1.5 overflow-hidden">
    {config.layout === "sidebar" ? (
      <div className="flex h-full gap-0.5">
        <div className="w-1/3 rounded-sm" style={{ background: `${config.accent}22` }} />
        <div className="flex-1 space-y-0.5 pt-0.5">
          <div className="h-0.5 w-3/4 rounded" style={{ background: config.accent }} />
          <div className="h-0.5 w-full rounded bg-gray-200" />
          <div className="h-0.5 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
    ) : config.layout === "banner" ? (
      <div className="flex h-full flex-col gap-0.5">
        <div className="h-1.5 w-full rounded-sm" style={{ background: config.accent }} />
        <div className="h-0.5 w-full rounded bg-gray-200 mt-0.5" />
        <div className="h-0.5 w-5/6 rounded bg-gray-200" />
      </div>
    ) : (
      <div className="h-full space-y-0.5">
        <div className="h-0.5 w-1/2 rounded" style={{ background: config.accent }} />
        <div className="h-0.5 w-1/3 rounded bg-gray-300" />
        <div className="h-0.5 w-full rounded bg-gray-200 mt-1" />
        <div className="h-0.5 w-5/6 rounded bg-gray-200" />
      </div>
    )}
  </div>
);

const StatCard = ({ icon, label, value, loading, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-panel)]/60 backdrop-blur-sm p-5">
    <div
      className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-sm"
      style={{ background: `${accent}1a`, color: accent }}
    >
      {icon}
    </div>
    <p className="text-xs text-white/40 mb-1">{label}</p>
    <p className="text-2xl font-semibold">
      {loading ? <span className="skeleton inline-block h-6 w-10 rounded" /> : value}
    </p>
  </div>
);

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const fetchResumes = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(res.data.resumes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchResumes();
  }, [token]);

  const handleCreateResume = async () => {
    setCreating(true);
    try {
      const res = await axios.post(
        API_URL,
        { title: "Untitled Resume" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes((prev) => [res.data.resume, ...prev]);
      navigate(`/resume/${res.data.resume._id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteResume = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenameResume = async (e, id, currentTitle) => {
    e.stopPropagation();
    const newTitle = window.prompt("Rename resume:", currentTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === currentTitle) return;
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        { title: newTitle.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes((prev) => prev.map((r) => (r._id === id ? res.data.resume : r)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredResumes = useMemo(() => {
    return resumes
      .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [resumes, search]);

  const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
  const templatesUsed = new Set(resumes.map((r) => r.template)).size;

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-white relative overflow-x-hidden">
      {/* Ambient glow layers */}
      <div className="pointer-events-none fixed -top-24 right-[-100px] h-[450px] w-[450px] rounded-full bg-[var(--color-teal)]/20 blur-[130px]" />
      <div className="pointer-events-none fixed top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[var(--color-teal-light)]/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-150px] right-1/4 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/10 blur-[110px]" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm">
        <p className="font-[var(--font-display)] text-lg">ResumeOS</p>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-white/80 leading-tight">{user?.name}</p>
            <p className="text-[11px] text-white/30 leading-tight">{user?.email}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-teal)]/20 text-sm font-medium text-[var(--color-teal-light)]">
            {getInitials(user?.name)}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/60 transition hover:border-[var(--color-teal)]/40 hover:text-white"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-8 py-10">
        {/* Hero / greeting card */}
        <div className="animate-fade-up mb-8 rounded-2xl border border-white/10 bg-[var(--color-panel)]/50 backdrop-blur-xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl shadow-black/20">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-teal-light)] mb-2">
              {getGreeting()}
            </p>
            <h1 className="font-[var(--font-display)] text-3xl mb-1">
              {user?.name?.split(" ")[0]}, let's get you hired.
            </h1>
            <p className="text-white/50 text-sm">
              {resumes.length === 0
                ? "Create your first resume to get started."
                : `You have ${resumes.length} resume${resumes.length > 1 ? "s" : ""} in progress.`}
            </p>
          </div>
          <button
            onClick={handleCreateResume}
            disabled={creating}
            className="shrink-0 rounded-lg bg-[var(--color-teal)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-teal-light)] disabled:opacity-50"
          >
            {creating ? "Creating..." : "+ New resume"}
          </button>
        </div>

        {/* Stat cards */}
        <div className="animate-fade-up grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon="📄" label="Total resumes" value={resumes.length} loading={loading} accent="#4fb0a5" />
          <StatCard icon="✨" label="Templates used" value={templatesUsed} loading={loading} accent="#7dcac1" />
          <StatCard icon="⬇" label="Downloads" value={totalDownloads} loading={loading} accent="#f4a86a" />
        </div>

        {/* Search */}
        {!loading && resumes.length > 0 && (
          <div className="animate-fade-up mb-6 flex items-center gap-3">
            <div className="relative w-full max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">⌕</span>
              <input
                type="text"
                placeholder="Search resumes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-teal)]/60 focus:ring-1 focus:ring-[var(--color-teal)]/40"
              />
            </div>
            <p className="text-xs text-white/30">
              {filteredResumes.length} of {resumes.length}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton rounded-2xl border border-white/10 h-28" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="animate-fade-up rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-teal)]/10 text-2xl">
              📄
            </div>
            <p className="text-white/70 mb-1">No resumes yet</p>
            <p className="text-sm text-white/40 mb-6">Create your first resume to get started.</p>
            <button
              onClick={handleCreateResume}
              disabled={creating}
              className="rounded-lg bg-[var(--color-teal)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-teal-light)] disabled:opacity-50"
            >
              {creating ? "Creating..." : "+ Create new resume"}
            </button>
          </div>
        ) : filteredResumes.length === 0 ? (
          <p className="text-white/40 text-sm">No resumes match "{search}".</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredResumes.map((resume, index) => {
              const config = getTemplateConfig(resume.template);
              return (
                <div
                  key={resume._id}
                  onClick={() => navigate(`/resume/${resume._id}`)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="animate-fade-up group relative flex gap-4 rounded-2xl border border-white/10 bg-[var(--color-panel)]/60 backdrop-blur-sm p-4 transition-all duration-200 hover:border-[var(--color-teal)]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 cursor-pointer"
                >
                  <MiniThumb config={config} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium mb-1 truncate group-hover:text-[var(--color-teal-light)] transition-colors">
                        {resume.title}
                      </p>
                      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => handleRenameResume(e, resume._id, resume.title)}
                          className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white"
                          title="Rename"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => handleDeleteResume(e, resume._id)}
                          className="rounded-md p-1 text-white/40 hover:bg-red-500/20 hover:text-red-400"
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 mb-2">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-white/30">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: config.accent }} />
                        {config.name}
                      </span>
                      {resume.downloadCount > 0 && (
                        <span>· {resume.downloadCount} download{resume.downloadCount > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

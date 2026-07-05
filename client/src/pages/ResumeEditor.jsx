import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import ResumePreview from "../components/ResumePreview";
import { TEMPLATES, getTemplateConfig } from "../constants/templates";

const API_URL = `${import.meta.env.VITE_API_URL}/resumes`;

const ResumeEditor = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [skillInput, setSkillInput] = useState("");
  const previewRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(res.data.resume);
      } catch (error) {
        console.error(error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchResume();
  }, [id, token]);

  // Debounced auto-save whenever resume changes
  useEffect(() => {
    if (!resume) return;
    setSaving(true);
    const timer = setTimeout(async () => {
      try {
        await axios.put(`${API_URL}/${id}`, resume, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [resume]);

  const handlePersonalInfoChange = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", grade: "" },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill) => {
    if (!skill.trim()) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
  };

  const removeSkill = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }

    
));


  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", description: "", link: "", techStack: [] },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };
const handleTemplateChange = (templateId) => {
    setResume((prev) => ({ ...prev, template: templateId }));
  };
  const handleDownloadPDF = async () => {
    const element = previewRef.current;
    const opt = {
      margin: 0,
      filename: `${resume?.title || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    await html2pdf().set(opt).from(element).save();
    try {
      await axios.patch(`${API_URL}/${id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
    }
  };

 const sections = [
    { key: "personalInfo", label: "Personal Info" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "template", label: "Template" },
  ];
  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-teal)]/60 focus:ring-1 focus:ring-[var(--color-teal)]/40";
  const labelClass = "mb-1 block text-xs font-medium text-white/60";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] text-white/50 text-sm">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-ink)] text-white overflow-hidden">
      {/* Section Nav */}
      <aside className="w-56 shrink-0 border-r border-white/10 p-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm text-white/40 hover:text-white/70"
        >
          ← Back
        </button>
        <p className="text-xs text-white/30 mb-1 px-1">{resume?.title}</p>
        <p className="mb-3 flex items-center gap-1.5 px-1 text-[11px] text-white/30">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              saving ? "bg-amber-400 pulse-dot" : "bg-[var(--color-teal)]"
            }`}
          />
          {saving ? "Saving..." : "All changes saved"}
        </p>
        <nav className="flex flex-col gap-1">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`text-left rounded-lg px-3 py-2 text-sm transition ${
                activeSection === s.key
                  ? "bg-[var(--color-teal)]/15 text-[var(--color-teal-light)]"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Form Panel */}
      <section className="flex-1 overflow-y-auto p-8 border-r border-white/10">
        <h2
          key={activeSection}
          className="fade-in-section font-[var(--font-display)] text-2xl mb-6"
        >
          {sections.find((s) => s.key === activeSection)?.label}
        </h2>

        {activeSection === "personalInfo" && (
          <div className="fade-in-section max-w-md space-y-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                className={inputClass}
                value={resume?.personalInfo?.fullName || ""}
                onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                value={resume?.personalInfo?.email || ""}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                className={inputClass}
                value={resume?.personalInfo?.phone || ""}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                className={inputClass}
                placeholder="City, Country"
                value={resume?.personalInfo?.location || ""}
                onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input
                type="text"
                className={inputClass}
                value={resume?.personalInfo?.linkedin || ""}
                onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Summary</label>
              <textarea
                rows={4}
                className={inputClass}
                placeholder="A short professional summary..."
                value={resume?.personalInfo?.summary || ""}
                onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
              />
            </div>
          </div>
        )}

        {activeSection === "experience" && (
          <div className="max-w-md space-y-6">
            {resume?.experience?.map((exp, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">Entry {index + 1}</p>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-xs text-red-400/70 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Start date</label>
                    <input
                      type="text"
                      placeholder="Jan 2023"
                      className={inputClass}
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End date</label>
                    <input
                      type="text"
                      placeholder="Present"
                      className={inputClass}
                      value={exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-white/50">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(index, "current", e.target.checked)}
                  />
                  I currently work here
                </label>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    className={inputClass}
                    placeholder="What did you do in this role?"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
            {resume?.experience?.length === 0 && (
              <p className="text-sm text-white/30 text-center py-6">
                No experience added yet.
              </p>
            )}
            <button
              onClick={addExperience}
              className="w-full rounded-lg border border-dashed border-white/15 py-2.5 text-sm text-white/50 hover:border-[var(--color-teal)]/40 hover:text-white/80 transition"
            >
              + Add experience
            </button>
          </div>
        )}

        {activeSection === "education" && (
          <div className="max-w-md space-y-6">
            {resume?.education?.map((edu, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">Entry {index + 1}</p>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-xs text-red-400/70 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className={labelClass}>Institution</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Degree</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Field of study</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Start date</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End date</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Grade (optional)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.grade}
                    onChange={(e) => updateEducation(index, "grade", e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addEducation}
              className="w-full rounded-lg border border-dashed border-white/15 py-2.5 text-sm text-white/50 hover:border-[var(--color-teal)]/40 hover:text-white/80 transition"
            >
              + Add education
            </button>
          </div>
        )}

        {activeSection === "skills" && (
          <div className="max-w-md">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. JavaScript"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                    setSkillInput("");
                  }
                }}
              />
              <button
                onClick={() => {
                  addSkill(skillInput);
                  setSkillInput("");
                }}
                className="rounded-lg bg-[var(--color-teal)] px-4 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-teal-light)] transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {resume?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-white/30 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {activeSection === "projects" && (
          <div className="max-w-md space-y-6">
            {resume?.projects?.map((proj, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">Entry {index + 1}</p>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-xs text-red-400/70 hover:text-red-400"
                  >
                    Remove
                  </button>

                </div>

                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={proj.title}
                    onChange={(e) => updateProject(index, "title", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Link (optional)</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="https://..."
                    value={proj.link}
                    onChange={(e) => updateProject(index, "link", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tech stack (comma separated)</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="React, Node.js, MongoDB"
                    value={proj.techStack.join(", ")}
                    onChange={(e) =>
                      updateProject(
                        index,
                        "techStack",
                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={proj.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addProject}
              className="w-full rounded-lg border border-dashed border-white/15 py-2.5 text-sm text-white/50 hover:border-[var(--color-teal)]/40 hover:text-white/80 transition"
            >
              + Add project
            </button>
          </div>
        )}

        {activeSection === "template" && (
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  resume.template === t.id
                    ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <div
                  className="mb-2 h-10 w-full rounded-md"
                  style={{ background: t.accent }}
                />
                <p className="text-sm text-white/80">{t.name}</p>
                <p className="text-[11px] text-white/30 capitalize">{t.layout} layout</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Live Preview Panel */}
      <section className="w-[420px] shrink-0 overflow-y-auto bg-[#0e0f12] p-8">
        <button
          onClick={handleDownloadPDF}
          className="mb-4 w-full rounded-lg bg-[var(--color-teal)] py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-teal-light)]"
        >
          Download PDF
        </button>

       <ResumePreview
          resume={resume}
          config={getTemplateConfig(resume.template)}
          previewRef={previewRef}
        />     </section>
    </div>
  );
};

export default ResumeEditor;
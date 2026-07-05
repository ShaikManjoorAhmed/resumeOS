import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
    techStack: [{ type: String }],
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },
    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [{ type: String }],
    projects: [projectSchema],
    certifications: [{ type: String }],
    template: {
      type: String,
      default: "minimal",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    sectionOrder: {
      type: [String],
      default: ["summary", "experience", "education", "skills", "projects", "certifications"],
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
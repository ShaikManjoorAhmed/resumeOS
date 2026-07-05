import Resume from "../models/Resume.model.js";

// Create new resume
export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || "Untitled Resume",
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email,
      },
    });
    res.status(201).json({ message: "Resume created", resume });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all resumes of logged-in user
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({ resumes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a resume
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ message: "Resume updated", resume });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ message: "Resume deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const incrementDownload = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ downloadCount: resume.downloadCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
import express from "express";
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  incrementDownload,
} from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createResume);
router.get("/", getMyResumes);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.patch("/:id/download", incrementDownload);

export default router;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use(notFound);
app.use(errorHandler);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "ResumeOS API is running" });
});
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
export default app;
import { Router } from "express";
import { scheduleEmail } from "../controllers/emailController";

const router = Router();

router.post("/schedule", scheduleEmail);

export default router;

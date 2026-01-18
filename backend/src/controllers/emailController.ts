import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { emailQueue } from "../queue/emailQueue";

export const scheduleEmail = async (req: Request, res: Response) => {
  try {
    const { toEmail, subject, body, scheduledAt } = req.body;

    // 🔒 basic validation
    if (!toEmail || !subject || !body || !scheduledAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const scheduleTime = new Date(scheduledAt);

    if (isNaN(scheduleTime.getTime())) {
      return res.status(400).json({ message: "Invalid scheduledAt datetime" });
    }

    // 1️⃣ save email to DB
    const email = await prisma.email.create({
      data: {
        toEmail,
        subject,
        body,
        scheduledAt: scheduleTime,
        status: "SCHEDULED",
      },
    });

    // 2️⃣ calculate delay
    const delay = scheduleTime.getTime() - Date.now();

    if (delay < 0) {
      return res.status(400).json({ message: "scheduledAt must be in the future" });
    }

    // 3️⃣ add job to queue
    const job = await emailQueue.add(
      "send-email",
      { emailId: email.id },
      { delay }
    );

    // 4️⃣ save jobId
    await prisma.email.update({
      where: { id: email.id },
      data: { jobId: job.id },
    });

    return res.json({
      message: "Email scheduled successfully",
      emailId: email.id,
      jobId: job.id,
    });
  } catch (error) {
    console.error("❌ Schedule email error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

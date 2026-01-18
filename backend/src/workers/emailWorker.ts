import { Worker } from "bullmq";
import { prisma } from "../config/prisma";
import { createTestTransporter } from "../utils/mailer";
import { redisConnection } from "../config/redis";
import nodemailer from "nodemailer";


const worker = new Worker(
  "email-queue",
  async (job) => {
    const { emailId } = job.data;
    console.log("📨 Processing email job:", emailId);

    const email = await prisma.email.findUnique({
      where: { id: emailId },
    });

    if (!email) {
      throw new Error("Email not found");
    }

    const transporter = await createTestTransporter();

    const info = await transporter.sendMail({
      from: '"ReachInbox" <no-reply@reachinbox.com>',
      to: email.toEmail,
      subject: email.subject,
      text: email.body,
    });

    console.log("✅ Email sent:", nodemailer.getTestMessageUrl(info));

    await prisma.email.update({
      where: { id: emailId },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });
  },
  {
    connection: redisConnection,
  }
);

console.log("📥 Email worker started");

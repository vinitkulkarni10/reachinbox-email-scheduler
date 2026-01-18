import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes";
import { emailQueue } from "./queue/emailQueue";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ VERY IMPORTANT (THIS FIXES req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/emails", emailRoutes);

// health check
app.get("/", (_req, res) => {
  res.send("ReachInbox Email Scheduler API is running 🚀");
});

// test queue route
app.get("/schedule-test", async (_req, res) => {
  await emailQueue.add(
    "test-email",
    { message: "Hello from BullMQ delayed job" },
    { delay: 5000 }
  );

  res.send("⏳ Test email job scheduled (5s delay)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

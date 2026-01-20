import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    toEmail: "",
    subject: "",
    body: "",
    scheduledAt: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Scheduling...");

    try {
      const res = await fetch(
        "https://reachinbox-email-scheduler-uvd8.onrender.com/api/emails/schedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error");
      }

      setMessage("✅ Email scheduled successfully");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>ReachInbox Email Scheduler</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="toEmail"
          placeholder="To Email"
          value={form.toEmail}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="body"
          placeholder="Email Body"
          value={form.body}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="datetime-local"
          name="scheduledAt"
          value={form.scheduledAt}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Schedule Email</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default App;

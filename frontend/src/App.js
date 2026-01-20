import { useState } from "react";
import "./App.css";

function App() {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/emails/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toEmail,
            subject,
            body,
            scheduledAt,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Email scheduled successfully");
      } else {
        setMessage(data.message || "❌ Error scheduling email");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Backend not reachable");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>ReachInbox Email Scheduler</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="To Email"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Email Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
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

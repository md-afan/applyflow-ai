"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function TestReminderPage() {
  const [applicationId, setApplicationId] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function createReminder() {
    try {
      setError("");
      setResult(null);

      const data = await apiFetch("/api/reminders", {
        method: "POST",
        body: JSON.stringify({
          application_id: applicationId,
          reminder_date: "2026-09-26T09:00:00+05:30",
          reminder_type: "follow_up",
          message: message || "Follow up with recruiter",
        }),
      });

      setResult(data);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Reminder Test</h1>

      <input
        type="text"
        placeholder="Application ID"
        value={applicationId}
        onChange={(e) => setApplicationId(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
        }}
      />

      <input
        type="text"
        placeholder="Reminder message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
        }}
      />

      <button
        onClick={createReminder}
        style={{
          padding: "12px 18px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Create Reminder
      </button>

      {error && (
        <pre style={{ color: "red", marginTop: "20px" }}>
          {error}
        </pre>
      )}

      {result && (
        <pre style={{ marginTop: "20px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
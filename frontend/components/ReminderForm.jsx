"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function ReminderForm({ applicationId, onCreated }) {
  const [form, setForm] = useState({
    reminder_date: "",
    reminder_type: "follow_up",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/reminders", {
        method: "POST",
        body: JSON.stringify({ ...form, application_id: applicationId }),
      });
      setForm({ reminder_date: "", reminder_type: "follow_up", message: "" });
      onCreated(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-grid form-grid-spaced">
        <div className="form-field">
          <label className="form-label" htmlFor="reminder-date">Reminder Date &amp; Time</label>
          <input className="form-control" id="reminder-date" type="datetime-local" name="reminder_date" value={form.reminder_date} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="reminder-type">Reminder Type</label>
          <select className="form-control" id="reminder-type" name="reminder_type" value={form.reminder_type} onChange={handleChange}>
            <option value="follow_up">Follow Up</option>
            <option value="application_deadline">Application Deadline</option>
            <option value="interview">Interview</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field form-field-full">
          <label className="form-label" htmlFor="reminder-message">Message</label>
          <textarea className="form-control" id="reminder-message" name="message" placeholder="Reminder message" rows={3} value={form.message} onChange={handleChange} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Reminder"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function InterviewForm({ applicationId, onCreated }) {
  const [form, setForm] = useState({
    interview_date: "",
    interview_type: "technical",
    notes: "",
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
      const data = await apiFetch(`/api/applications/${applicationId}/interviews`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ interview_date: "", interview_type: "technical", notes: "" });
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
          <label className="form-label" htmlFor="interview-date">Interview Date &amp; Time</label>
          <input className="form-control" id="interview-date" type="datetime-local" name="interview_date" value={form.interview_date} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="interview-type">Interview Type</label>
          <select className="form-control" id="interview-type" name="interview_type" value={form.interview_type} onChange={handleChange}>
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
            <option value="behavioral">Behavioral</option>
            <option value="screening">Screening</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field form-field-full">
          <label className="form-label" htmlFor="interview-notes">Notes</label>
          <textarea className="form-control" id="interview-notes" name="notes" placeholder="Interview preparation notes" rows={4} value={form.notes} onChange={handleChange} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </div>
    </form>
  );
}

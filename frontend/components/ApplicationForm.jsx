"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

const initialForm = {
  company: "",
  role: "",
  job_url: "",
  job_description: "",
  status: "applied",
  deadline: "",
  notes: "",
};

export default function ApplicationForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
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
      const application = await apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      onCreated(application);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2 className="section-title">Add Application</h2>
        <p className="section-subtitle">Capture the key details so every opportunity stays organized.</p>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-grid form-grid-spaced">
        <div className="form-field">
          <label className="form-label" htmlFor="company">Company Name</label>
          <input className="form-control" id="company" name="company" placeholder="e.g. Apple" value={form.company} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="role">Job Role</label>
          <input className="form-control" id="role" name="role" placeholder="e.g. Backend Developer Intern" value={form.role} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="job_url">Job URL</label>
          <input className="form-control" id="job_url" name="job_url" type="url" placeholder="https://..." value={form.job_url} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="deadline">Deadline</label>
          <input className="form-control" id="deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="status">Status</label>
          <select className="form-control" id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="notes">Notes</label>
          <input className="form-control" id="notes" name="notes" placeholder="Optional notes" value={form.notes} onChange={handleChange} />
        </div>
        <div className="form-field form-field-full">
          <label className="form-label" htmlFor="job_description">Job Description</label>
          <textarea className="form-control" id="job_description" name="job_description" placeholder="Paste the job description for AI analysis..." value={form.job_description} onChange={handleChange} rows={7} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Application"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function ApplicationEditForm({ application, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    company: application.company || "",
    role: application.role || "",
    job_url: application.job_url || "",
    job_description: application.job_description || "",
    status: application.status || "applied",
    deadline: application.deadline || "",
    notes: application.notes || "",
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
      const updated = await apiFetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      onUpdated(updated);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="section-heading">
        <h3 className="section-title">Edit Application</h3>
        <p className="section-subtitle">Update the opportunity details without changing its history.</p>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-grid form-grid-spaced">
        <div className="form-field">
          <label className="form-label" htmlFor="edit-company">Company Name</label>
          <input className="form-control" id="edit-company" name="company" value={form.company} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-role">Job Role</label>
          <input className="form-control" id="edit-role" name="role" value={form.role} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-job-url">Job URL</label>
          <input className="form-control" id="edit-job-url" name="job_url" type="url" value={form.job_url} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-deadline">Deadline</label>
          <input className="form-control" id="edit-deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-status">Status</label>
          <select className="form-control" id="edit-status" name="status" value={form.status} onChange={handleChange}>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-notes">Notes</label>
          <input className="form-control" id="edit-notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" />
        </div>
        <div className="form-field form-field-full">
          <label className="form-label" htmlFor="edit-description">Job Description</label>
          <textarea className="form-control" id="edit-description" name="job_description" value={form.job_description} onChange={handleChange} rows={7} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

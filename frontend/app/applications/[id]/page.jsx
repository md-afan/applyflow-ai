"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import InterviewForm from "../../../components/InterviewForm";
import ReminderForm from "../../../components/ReminderForm";
import ApplicationEditForm from "../../../components/ApplicationEditForm";
import AuthGuard from "../../../components/AuthGuard";
import StatusBadge from "../../../components/StatusBadge";

export default function ApplicationDetailPage() {
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  async function loadApplication() {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/applications/${params.id}`);
      setApplication(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadInterviews() {
    try {
      const data = await apiFetch(`/api/applications/${params.id}/interviews`);
      setInterviews(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function loadReminders() {
    try {
      const data = await apiFetch("/api/reminders");
      setReminders(data.filter((reminder) => reminder.application_id === params.id));
    } catch (error) {
      setError(error.message);
    }
  }

  async function analyzeApplication() {
    try {
      setAnalyzing(true);
      setError("");
      const data = await apiFetch(`/api/applications/${params.id}/analyze`, { method: "POST" });
      setAnalysis(data.analysis);
    } catch (error) {
      setError(error.message);
    } finally {
      setAnalyzing(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      loadApplication();
      loadInterviews();
      loadReminders();
    }
  }, [params.id]);

  return (
    <AuthGuard>
      {loading ? (
        <main className="page-container application-detail-page">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="detail-grid" style={{ marginTop: 28 }}>
            <div className="card detail-card" style={{ minHeight: 300 }} />
            <div className="card detail-card" style={{ minHeight: 300 }} />
          </div>
        </main>
      ) : error && !application ? (
        <main className="page-container application-detail-page">
          <div className="page-error" role="alert">
            <strong>Unable to load this application.</strong>
            <div>{error}</div>
            <button className="btn btn-secondary error-retry" type="button" onClick={() => {
              loadApplication();
              loadInterviews();
              loadReminders();
            }}>Try Again</button>
          </div>
        </main>
      ) : (
        <main className="page-container application-detail-page">
          {error && <div className="page-error" role="alert">{error}</div>}

          <Link className="detail-back-link" href="/applications">← All applications</Link>
          <section className="card detail-header">
            <p className="detail-company">{application.company}</p>
            <h1 className="detail-role">{application.role}</h1>

            <div className="detail-header-meta">
              <StatusBadge status={application.status} />
              {application.deadline && <span>Deadline: <strong>{application.deadline}</strong></span>}
              {application.application_date && <span>Applied: <strong>{application.application_date}</strong></span>}
            </div>

            <div className="detail-header-actions">
              <Link className="btn btn-secondary" href={`/applications/${application.id}/job`}>
                View Job
              </Link>
              {application.job_url && (
                <a className="btn btn-secondary" href={application.job_url} target="_blank" rel="noreferrer">
                  Original Posting ↗
                </a>
              )}
              <button className="btn btn-primary" type="button" onClick={() => setEditing((value) => !value)}>
                {editing ? "Cancel Edit" : "Edit Application"}
              </button>
            </div>
          </section>

          {editing && (
            <section className="card detail-card detail-form-section">
              <ApplicationEditForm
                application={application}
                onUpdated={(updated) => {
                  setApplication(updated);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            </section>
          )}

          <div className="detail-grid detail-workspace">
            <div className="detail-stack">
              <section className="card detail-card">
                <h2 className="section-title">Job Description</h2>
                <p className="section-subtitle">The original description saved with this application.</p>
                <div className="content-text" style={{ marginTop: 18 }}>
                  {application.job_description || "No job description added."}
                </div>
              </section>

              <section className="card detail-card">
                <h2 className="section-title">AI Job Analysis</h2>
                <p className="section-subtitle">Compare this job description with your saved skills.</p>
                <div className="form-actions">
                  <button className="btn btn-primary" type="button" onClick={analyzeApplication} disabled={analyzing}>
                    {analyzing ? "Analyzing..." : "Analyze with AI"}
                  </button>
                </div>

                {analysis && (
                  <>
                    <div className="analysis-grid">
                      <div className="analysis-card analysis-matched">
                        <h3>Matched Skills</h3>
                        {analysis.matched_skills?.length ? (
                          <ul className="analysis-list">
                            {analysis.matched_skills.map((skill, index) => <li key={index}>{skill}</li>)}
                          </ul>
                        ) : <p className="section-subtitle">No matched skills found.</p>}
                      </div>
                      <div className="analysis-card analysis-missing">
                        <h3>Missing Skills</h3>
                        {analysis.missing_skills?.length ? (
                          <ul className="analysis-list">
                            {analysis.missing_skills.map((skill, index) => <li key={index}>{skill}</li>)}
                          </ul>
                        ) : <p className="section-subtitle">No major missing skills found.</p>}
                      </div>
                    </div>
                    <div className="analysis-summary">
                      <h3 className="section-title" style={{ fontSize: 15 }}>AI Summary</h3>
                      <p className="content-text" style={{ marginTop: 8 }}>{analysis.summary}</p>
                    </div>
                  </>
                )}
              </section>
            </div>

            <div className="detail-stack">
              <section className="card detail-side-card detail-side-card--info">
                <h2 className="section-title" style={{ fontSize: 18 }}>Interviews</h2>
                <p className="section-subtitle">Schedule and review interview events.</p>
                <div className="detail-form-section">
                  <InterviewForm applicationId={params.id} onCreated={loadInterviews} />
                </div>
                {interviews.length === 0 ? (
                  <div className="empty-state" style={{ marginTop: 16, padding: "22px 14px" }}>
                    <p className="empty-state-title">No interviews scheduled</p>
                  </div>
                ) : (
                  <div className="timeline-list">
                    {interviews.map((interview) => (
                      <div className="timeline-item" key={interview.id}>
                        <p><strong>{interview.interview_type || "Interview"}</strong></p>
                        {interview.scheduled_at && <p>Scheduled: {interview.scheduled_at}</p>}
                        {interview.interview_date && <p>Scheduled: {interview.interview_date}</p>}
                        {interview.notes && <p>Notes: {interview.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="card detail-side-card detail-side-card--warning">
                <h2 className="section-title" style={{ fontSize: 18 }}>Reminders</h2>
                <p className="section-subtitle">Create follow-ups and deadline reminders.</p>
                <div className="detail-form-section">
                  <ReminderForm applicationId={params.id} onCreated={loadReminders} />
                </div>
                {reminders.length === 0 ? (
                  <div className="empty-state" style={{ marginTop: 16, padding: "22px 14px" }}>
                    <p className="empty-state-title">No reminders created</p>
                  </div>
                ) : (
                  <div className="timeline-list">
                    {reminders.map((reminder) => (
                      <div className="timeline-item" key={reminder.id}>
                        <p><strong>{reminder.reminder_type}</strong></p>
                        {reminder.message && <p>{reminder.message}</p>}
                        <p>Reminder: {reminder.reminder_date}</p>
                        <p>Status: {reminder.status}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      )}
    </AuthGuard>
  );
}

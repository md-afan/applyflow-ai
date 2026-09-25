"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../../lib/api";
import AuthGuard from "../../../../components/AuthGuard";
import StatusBadge from "../../../../components/StatusBadge";

export default function ViewJobPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;

    async function load() {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/applications/${params.id}`);
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  return (
    <AuthGuard>
      {loading ? (
        <main className="page-container">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="card job-view-card" style={{ minHeight: 420, marginTop: 24 }} />
        </main>
      ) : error || !application ? (
        <main className="page-container">
          <div className="page-error" role="alert">
            <strong>Unable to load this job.</strong>
            <div>{error || "Application not found."}</div>
          </div>
          <button className="btn btn-secondary" onClick={() => router.back()}>Go Back</button>
        </main>
      ) : (
        <main className="page-container">
          <div className="page-header">
            <div className="page-header-copy">
              <Link className="back-link" href={`/applications/${application.id}`}>← Back to Application</Link>
              <p className="detail-company" style={{ marginTop: 14 }}>{application.company}</p>
              <h1 className="page-title" style={{ marginTop: 4 }}>{application.role}</h1>
              <p className="page-subtitle">Review the job information saved for this application.</p>
            </div>
            <div className="page-header-actions">
              <StatusBadge status={application.status} />
              {application.job_url && (
                <a className="btn btn-primary" href={application.job_url} target="_blank" rel="noreferrer">
                  Open Original Job ↗
                </a>
              )}
            </div>
          </div>

          <div className="job-view-layout">
            <section className="card detail-card">
              <div className="job-view-section">
                <h2 className="section-title">Job Description</h2>
                <div className="content-text job-description-content">
                  {application.job_description || "No job description was saved for this application."}
                </div>
              </div>

              {application.notes && (
                <div className="job-view-section job-view-notes">
                  <h2 className="section-title">Your Notes</h2>
                  <div className="content-text">{application.notes}</div>
                </div>
              )}
            </section>

            <aside className="detail-stack">
              <section className="card detail-side-card">
                <h2 className="section-title" style={{ fontSize: 18 }}>Application Information</h2>
                <div className="job-info-list">
                  <div><span>Status</span><StatusBadge status={application.status} /></div>
                  <div><span>Application Date</span><strong>{application.application_date || "—"}</strong></div>
                  <div><span>Deadline</span><strong>{application.deadline || "No deadline"}</strong></div>
                </div>
              </section>

              <section className="card detail-side-card detail-side-card--info">
                <h2 className="section-title" style={{ fontSize: 18 }}>Next Step</h2>
                <p className="section-subtitle" style={{ marginTop: 8 }}>Use the application workspace to analyze this role, schedule interviews, and manage reminders.</p>
                <Link className="btn btn-secondary" style={{ marginTop: 16 }} href={`/applications/${application.id}`}>
                  Open Application Workspace
                </Link>
              </section>
            </aside>
          </div>
        </main>
      )}
    </AuthGuard>
  );
}

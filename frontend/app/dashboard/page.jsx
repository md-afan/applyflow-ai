"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import StatusBadge from "../../components/StatusBadge";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setError("");
      const data = await apiFetch("/api/dashboard");
      setDashboard(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AuthGuard>
      {!dashboard && !error ? (
        <main className="page-container">
          <div className="page-header">
            <div className="page-header-copy">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
            </div>
          </div>
          <div className="stats-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="card stat-card" key={index}>
                <div className="skeleton" style={{ width: "110px" }} />
                <div className="skeleton" style={{ width: "48px", height: "32px", marginTop: "14px" }} />
              </div>
            ))}
          </div>
        </main>
      ) : error ? (
        <main className="page-container">
          <div className="page-header">
            <div className="page-header-copy">
              <h1 className="page-title">Application Dashboard</h1>
              <p className="page-subtitle">Track and manage your job and internship applications from one place.</p>
            </div>
          </div>
          <div className="page-error" role="alert">
            <strong>Something went wrong.</strong>
            <div>{error}</div>
            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={loadDashboard}>Try Again</button>
          </div>
        </main>
      ) : (
        <DashboardContent dashboard={dashboard} />
      )}
    </AuthGuard>
  );
}

function DashboardContent({ dashboard }) {
  const { summary, upcomingDeadlines = [] } = dashboard;

  const cards = [
    ["Total Applications", summary.total],
    ["Applied", summary.applied],
    ["Shortlisted", summary.shortlisted],
    ["Interviews", summary.interview],
    ["Selected", summary.selected],
    ["Rejected", summary.rejected],
  ];

  return (
    <main className="page-container">
      <div className="page-header">
        <div className="page-header-copy">
          <h1 className="page-title">Application Dashboard</h1>
          <p className="page-subtitle">Track and manage your job and internship applications from one place.</p>
        </div>
        <Link href="/applications" className="btn btn-primary">Add Application</Link>
      </div>

      <section className="stats-grid" aria-label="Application statistics">
        {cards.map(([title, value]) => (
          <div className="card stat-card" key={title}>
            <div>
              <div className="stat-label">{title}</div>
              <div className="stat-value">{value}</div>
            </div>
            <div className="stat-accent" aria-hidden="true" />
          </div>
        ))}
      </section>

      <section className="deadline-section">
        <div>
          <h2 className="section-title">Upcoming Deadlines</h2>
          <p className="section-subtitle">Keep the next application deadlines visible and actionable.</p>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 16 }}>
            <p className="empty-state-title">No upcoming deadlines</p>
            <p className="empty-state-text">You&apos;re all caught up.</p>
          </div>
        ) : (
          <div className="deadline-list">
            {upcomingDeadlines.map((application) => (
              <Link key={application.id} href={`/applications/${application.id}`} className="card deadline-card" style={{ textDecoration: "none" }}>
                <div className="deadline-main">
                  <p className="deadline-role">{application.role}</p>
                  <p className="deadline-company">{application.company}</p>
                </div>
                <div className="deadline-meta">
                  <span className="deadline-date">Deadline: <strong>{application.deadline}</strong></span>
                  <StatusBadge status={application.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

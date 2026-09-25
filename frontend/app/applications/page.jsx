"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import ApplicationForm from "../../components/ApplicationForm";
import ApplicationCard from "../../components/ApplicationCard";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/applications");
      setApplications(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function handleCreated(application) {
    setApplications((current) => [application, ...current]);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this application?");
    if (!confirmed) return;

    try {
      await apiFetch(`/api/applications/${id}`, { method: "DELETE" });
      setApplications((current) => current.filter((application) => application.id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <AuthGuard>
      <main className="page-container">
        <div className="page-header">
          <div className="page-header-copy">
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">Track your job and internship applications in one organized workspace.</p>
          </div>
          <Link href="#add-application" className="btn btn-primary">+ Add Application</Link>
        </div>

        <div id="add-application">
          <ApplicationForm onCreated={handleCreated} />
        </div>

        <section style={{ marginTop: 38 }}>
          <div className="section-heading">
            <h2 className="section-title">Applications <span style={{ color: "#94a3b8", fontWeight: 500 }}>({applications.length})</span></h2>
            <p className="section-subtitle">Review status, deadlines, job details, and next actions.</p>
          </div>

          {error && <div className="page-error" style={{ marginTop: 16 }}>{error}</div>}

          {loading ? (
            <div className="application-list">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="card application-card" key={index}>
                  <div className="skeleton" style={{ width: "250px", height: "22px" }} />
                  <div className="skeleton" style={{ width: "110px", marginTop: "9px" }} />
                  <div className="skeleton" style={{ width: "80%", marginTop: "18px" }} />
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 16 }}>
              <p className="empty-state-title">No applications yet</p>
              <p className="empty-state-text">Start tracking your job and internship applications above.</p>
            </div>
          ) : (
            <div className="application-list">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}

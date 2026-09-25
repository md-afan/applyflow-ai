"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import AuthGuard from "../../components/AuthGuard";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  async function generateReport() {
    try {
      setLoading(true);
      setError("");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please login first");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Report generation failed");
      setReport(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadReport() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please login first");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${report.downloadUrl}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "applyflow-application-report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <AuthGuard>
      <main className="page-container">
        <div className="page-header">
          <div className="page-header-copy">
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Generate and review a PDF summary of your application progress.</p>
          </div>
        </div>

        <div className="report-layout">
          <section className="card report-card">
            <p className="report-eyebrow">APPLICATION REPORT</p>
            <h2 className="section-title report-title">Application Progress Report</h2>
            <p className="section-subtitle" style={{ maxWidth: 620, fontSize: 15, marginTop: 10 }}>
              Create a current snapshot of your application activity and download it as a PDF.
            </p>
            <div className="form-actions">
              <button className="btn btn-primary" type="button" onClick={generateReport} disabled={loading}>
                {loading ? "Generating Report..." : "Generate PDF Report"}
              </button>
            </div>
            {error && <p className="form-error" role="alert" style={{ marginTop: 18 }}>{error}</p>}

            {report && (
              <div className="alert-success report-ready" role="status">
                <strong>Report ready.</strong>
                <div className="report-ready-copy">Your application progress report is ready to download.</div>
                <button className="btn btn-secondary" type="button" onClick={downloadReport}>Download PDF</button>
              </div>
            )}
          </section>

          <aside className="card report-contents">
            <h2 className="section-title">Included in the PDF</h2>
            <p className="section-subtitle">The report is generated from your saved applications.</p>
            <ul className="report-contents-list">
              <li>Totals by application status</li>
              <li>Company and role details</li>
              <li>Application dates and deadlines</li>
            </ul>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}

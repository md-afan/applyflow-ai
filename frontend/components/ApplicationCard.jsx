"use client";

import StatusBadge from "./StatusBadge";
import Link from "next/link";

export default function ApplicationCard({ application, onDelete }) {
  return (
    <article className="card application-card">
      <div className="application-card-header">
        <div className="application-card-copy">
          <h3 className="application-role">{application.role}</h3>
          <p className="application-company">{application.company}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {application.job_description && (
        <p className="application-description">
          {application.job_description.length > 180
            ? `${application.job_description.substring(0, 180)}...`
            : application.job_description}
        </p>
      )}

      <div className="application-meta">
        {application.deadline && (
          <span>
            Deadline: <strong>{application.deadline}</strong>
          </span>
        )}
        {application.application_date && (
          <span>
            Applied: <strong>{application.application_date}</strong>
          </span>
        )}
      </div>

      <div className="application-actions">
        {application.job_url ? (
          <Link className="btn btn-secondary" href={`/applications/${application.id}/job`}>
            View Job
          </Link>
        ) : (
          <Link className="btn btn-secondary" href={`/applications/${application.id}/job`}>
            View Job Details
          </Link>
        )}
        <Link className="btn btn-primary" href={`/applications/${application.id}`}>
          View Details
        </Link>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(application.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

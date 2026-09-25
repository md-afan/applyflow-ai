export default function StatusBadge({ status }) {
  const normalized = String(status || "unknown").toLowerCase();
  const className = {
    applied: "status-applied",
    shortlisted: "status-shortlisted",
    interview: "status-interview",
    selected: "status-selected",
    rejected: "status-rejected",
  }[normalized] || "status-default";

  return <span className={`status-badge ${className}`}>{normalized}</span>;
}

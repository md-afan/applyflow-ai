"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { apiFetch } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";

export default function ProfilePage() {
  const [session, setSession] = useState(null);
  const [fullName, setFullName] = useState("");
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) return;

      setSession(currentSession);
      setFullName(currentSession.user.user_metadata?.full_name || "");

      const data = await apiFetch("/api/skills");
      setSkills(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { data, error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (updateError) throw updateError;
      setSession((current) => current ? { ...current, user: data.user } : current);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function addSkill(e) {
    e.preventDefault();
    if (!skill.trim()) return;

    try {
      setSkillLoading(true);
      setError("");
      const created = await apiFetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({ skill: skill.trim() }),
      });
      setSkills((current) => [created, ...current]);
      setSkill("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSkillLoading(false);
    }
  }

  async function deleteSkill(id) {
    try {
      setError("");
      await apiFetch(`/api/skills/${id}`, { method: "DELETE" });
      setSkills((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthGuard>
      <main className="page-container">
        <div className="page-header">
          <div className="page-header-copy">
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your account information and the skills used by AI job analysis.</p>
          </div>
        </div>

        {loading ? (
          <div className="profile-grid">
            <div className="card profile-card" style={{ minHeight: 260 }} />
            <div className="card profile-card" style={{ minHeight: 260 }} />
          </div>
        ) : (
          <div className="profile-grid">
            <section className="card profile-card">
              <div className="profile-avatar">{(fullName || session?.user?.email || "U").charAt(0).toUpperCase()}</div>
              <h2 className="section-title" style={{ marginTop: 18 }}>Account Details</h2>
              <p className="section-subtitle">Your email is managed by Supabase Authentication.</p>

              <form className="profile-form" onSubmit={saveProfile}>
                <div className="form-field">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input id="fullName" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input id="email" className="form-control" value={session?.user?.email || ""} disabled />
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
                </div>
              </form>
            </section>

            <section className="card profile-card">
              <h2 className="section-title">Your Skills</h2>
              <p className="section-subtitle">These skills are sent to the AI analyzer when you analyze a job.</p>

              <form className="skill-add-form" onSubmit={addSkill}>
                <input className="form-control" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. Python" aria-label="Add skill" />
                <button className="btn btn-primary" type="submit" disabled={skillLoading}>{skillLoading ? "Adding..." : "Add Skill"}</button>
              </form>

              {skills.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 18 }}>
                  <p className="empty-state-title">No skills added yet</p>
                  <p className="empty-state-text">Add skills to improve your AI job analysis.</p>
                </div>
              ) : (
                <div className="skill-list">
                  {skills.map((item) => (
                    <div className="skill-chip" key={item.id}>
                      <span>{item.skill}</span>
                      <button type="button" onClick={() => deleteSkill(item.id)} aria-label={`Delete ${item.skill}`}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {message && <div className="alert-success profile-alert">{message}</div>}
        {error && <div className="page-error profile-alert" role="alert">{error}</div>}
      </main>
    </AuthGuard>
  );
}

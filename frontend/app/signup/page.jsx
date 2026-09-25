"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });

    if (error) {
      setMessageIsError(true);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setMessageIsError(false);
      setMessage("Signup successful. Check your email if confirmation is enabled.");
    }
    setLoading(false);
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <p className="auth-brand">APPLYFLOW AI</p>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start organizing your job and internship search.</p>

        {message && (
          <div className={messageIsError ? "form-error" : "alert-success"} role={messageIsError ? "alert" : "status"} style={{ marginBottom: 18 }}>
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <input className="form-control" id="signup-name" type="text" autoComplete="name" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input className="form-control" id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input className="form-control" id="signup-password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link href="/login" style={{ color: "#166534", fontWeight: 650 }}>Login</Link></p>
      </section>
    </main>
  );
}

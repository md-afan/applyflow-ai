"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <p className="auth-brand">APPLYFLOW AI</p>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue managing your applications.</p>

        {message && <p className="form-error" role="alert">{message}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input className="form-control" id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input className="form-control" id="login-password" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">Don&apos;t have an account? <Link href="/signup" style={{ color: "#166534", fontWeight: 650 }}>Create one</Link></p>
      </section>
    </main>
  );
}

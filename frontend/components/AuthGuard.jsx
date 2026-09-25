"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      if (active) setChecking(false);
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <main className="page-container">
        <div className="page-header">
          <div className="page-header-copy">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
        <div className="card" style={{ minHeight: 220 }} />
      </main>
    );
  }

  return children;
}

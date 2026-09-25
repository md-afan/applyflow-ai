"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/reports", label: "Reports" },
  { href: "/profile", label: "Profile" },
  { href: "/", label: "page" },

];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLandingSection, setActiveLandingSection] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (active) setSession(data.session);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function isActive(href) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const isLandingPage = pathname === "/";

  return (
    <header className={`site-header ${isLandingPage ? "landing-site-header" : ""}`}>
      <nav className={`site-nav ${isLandingPage ? "landing-site-nav" : ""}`} aria-label="Primary navigation">
        <Link href={session ? "/dashboard" : "/"} className="brand-link">
          <span className="brand-mark">A</span>
          <span>ApplyFlow AI</span>
        </Link>

        {isLandingPage ? (
          <>
            <div className={`landing-nav-links ${mobileOpen ? "landing-nav-links-open" : ""}`} id="landing-section-links">
              {[
                ["features", "Features"],
                ["how-it-works", "How It Works"],
                ["technology", "Technology"],
                ["about-project", "About Project"],
              ].map(([section, label]) => (
                <a
                  className={activeLandingSection === section ? "landing-nav-link-active" : ""}
                  href={`#${section}`}
                  key={section}
                  aria-current={activeLandingSection === section ? "location" : undefined}
                  onClick={() => {
                    setActiveLandingSection(section);
                    setMobileOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="landing-nav-actions">
              <Link href="/login" className="nav-public-link">Login</Link>
              <Link href={session ? "/dashboard" : "/signup"} className="btn btn-primary">Get Started</Link>
              <button
                type="button"
                className="mobile-menu-button landing-menu-button"
                aria-label={mobileOpen ? "Close section navigation" : "Open section navigation"}
                aria-expanded={mobileOpen}
                aria-controls="landing-section-links"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </>
        ) : session ? (
          <>
            <div className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? "nav-link-active" : ""}`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="nav-actions">
              <button type="button" className="btn btn-secondary nav-logout" onClick={handleLogout}>
                Logout
              </button>
              <button
                type="button"
                className="mobile-menu-button"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </>
        ) : (
          <div className="public-nav-actions">
            <Link href="/login" className="nav-public-link">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Create account
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

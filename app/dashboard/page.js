"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/me", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Please log in again.");
        return data;
      })
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) window.location.href = "/login";
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setMessage("");

    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed.");
      window.location.href = "/login?loggedOut=1";
    } catch {
      setMessage("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <main>
      <div className="auth-box">
      <h1>Dashboard</h1>
      <p>This page is for registered members only.</p>

      {user ? (
        <section>
          <h2>Member information</h2>
          <p>Full name: {user.fullname}</p>
          <p>Email: {user.email}</p>
          <p>Member ID: {user.id}</p>
        </section>
      ) : (
        <p>Loading member information...</p>
      )}

      {message && <p role="alert">{message}</p>}

      <p>
        <button type="button" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </p>
      <p><Link href="/">Home</Link></p>
      </div>
    </main>
  );
}

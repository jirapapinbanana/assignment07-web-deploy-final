"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") {
      setSuccessMessage("Registration successful. Please log in.");
    }
    if (params.get("loggedOut") === "1") {
      setSuccessMessage("You have been logged out.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccessMessage("");
    setBusy(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <div className="auth-box">
      <h1>Login</h1>

      {successMessage && <p role="status">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </p>

        <p>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </p>

        {message && <p role="alert">{message}</p>}

        <button type="submit" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        No account yet? <Link href="/register">Register</Link>
      </p>
      <p><Link href="/">Home</Link></p>
      </div>
    </main>
  );
}

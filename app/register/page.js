"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/login?registered=1");
      } else {
        setMessage(data.message || "Registration failed.");
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
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="fullname">Full name</label>
          <br />
          <input
            id="fullname"
            name="fullname"
            type="text"
            autoComplete="name"
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
            maxLength={255}
            required
          />
        </p>

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
            maxLength={255}
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            maxLength={72}
            required
          />
          <br />
          <small>Password must be at least 8 characters.</small>
        </p>

        {message && <p role="alert">{message}</p>}

        <button type="submit" disabled={busy}>
          {busy ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
      <p><Link href="/">Home</Link></p>
      </div>
    </main>
  );
}

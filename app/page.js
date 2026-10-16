import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="auth-box">
        <h1>Auth Demo</h1>
        <p>Assignment 07: Web Deploy on Cloud</p>
        <p>
          Name: นางสาวจิรประพิณ เมืองปัญญา
          <br />
          Student ID: 6803726
        </p>
        <ul>
          <li><Link href="/register">Register</Link></li>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/dashboard">Dashboard (members only)</Link></li>
        </ul>
      </div>
    </main>
  );
}

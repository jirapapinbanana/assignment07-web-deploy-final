import "./globals.css";

export const metadata = {
  title: "Auth Demo on Vercel",
  description: "Login and registration demo using Next.js and TiDB Cloud.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

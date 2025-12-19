export default function PricingPage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Pricing</h1>
      <p>Frontend v1 (payments coming next via Paddle).</p>

      <ul>
        <li><b>Free</b> — 1 printer, basic dashboard</li>
        <li><b>Pro</b> — up to X printers, daily summaries</li>
        <li><b>Farm</b> — multi-printer, priority features</li>
      </ul>

      <p style={{ marginTop: 18 }}>
        <a href="/login">Login</a> to get started.
      </p>
    </main>
  );
}

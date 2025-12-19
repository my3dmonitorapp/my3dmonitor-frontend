export default function AppHome() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>
      <p>Frontend v1: read-only dashboard + onboarding.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <a href="/app/onboarding">Onboarding</a>
        <a href="/install-agent">Install Agent</a>
      </div>
    </main>
  );
}

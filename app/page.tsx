export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>My3DMonitor</h1>
      <p>Monitor Klipper + Moonraker printers with a lightweight agent and daily stats.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <a href="/pricing">Pricing</a>
        <a href="/login">Login</a>
        <a href="/app">Dashboard</a>
        <a href="/install-agent">Install Agent</a>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>How it works</h2>
      <ol>
        <li>Create an account</li>
        <li>Add printers and get tokens</li>
        <li>Install the agent via Docker</li>
        <li>View dashboard and daily summaries</li>
      </ol>
    </main>
  );
}

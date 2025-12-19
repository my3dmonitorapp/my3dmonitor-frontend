export default function InstallAgentPage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Install Printer Agent</h1>
      <p>The agent runs on your Klipper host using Docker.</p>

      <h2>GitHub</h2>
      <ul>
        <li>
          Org: <a href="https://github.com/my3dmonitorapp" target="_blank" rel="noreferrer">
            https://github.com/my3dmonitorapp
          </a>
        </li>
        <li>
          Agent repo: <a href="https://github.com/my3dmonitorapp/printer-agent" target="_blank" rel="noreferrer">
            https://github.com/my3dmonitorapp/printer-agent
          </a>
        </li>
      </ul>

      <p>After onboarding you will receive a PRINTER_ID + TOKEN for each printer.</p>
    </main>
  );
}

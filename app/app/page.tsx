import { auth } from "@/auth";

export default async function AppHome() {
  const session = await auth();

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>
      <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, overflowX: "auto" }}>
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function AppHome() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>
      <p>Logged in as: {session.user.email}</p>

      <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, overflowX: "auto" }}>
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}

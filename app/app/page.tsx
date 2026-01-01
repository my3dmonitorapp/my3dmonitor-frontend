import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function AppHome() {
  // 1) Check login via NextAuth v4 session
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  // 2) Resolve customer via n8n (server-side)
  const base = process.env.N8N_BASE_URL;
  const adminKey = process.env.N8N_ADMIN_KEY;

  if (!base) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Server misconfigured</h1>
        <p>Missing N8N_BASE_URL</p>
      </main>
    );
  }
  if (!adminKey) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Server misconfigured</h1>
        <p>Missing N8N_ADMIN_KEY</p>
      </main>
    );
  }

  const url = `${base.replace(/\/$/, "")}/webhook/v1/user/resolve`;

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  const data: any = await r.json().catch(() => ({}));

  // 3) Route user
  if (!data?.found) {
    redirect("/app/onboarding");
  }

  // 4) Minimal dashboard placeholder for now
  return (
    <main style={{ padding: 24 }}>
      <h1>My3DMonitor Dashboard</h1>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Customer ID:</strong> {data.customer_id}</p>
      <p style={{ marginTop: 16 }}>Next: load printers + AggDaily…</p>
    </main>
  );
}

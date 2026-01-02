import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function AppHome() {
  // 1) Require login
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) redirect("/login");

  const base = process.env.N8N_BASE_URL!;
  const adminKey = process.env.N8N_ADMIN_KEY!;
  if (!base || !adminKey) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Server misconfigured</h1>
        <p>Missing N8N_BASE_URL or N8N_ADMIN_KEY</p>
      </main>
    );
  }

  // 2) Resolve customer_id from email
  const resolveUrl = `${base.replace(/\/$/, "")}/webhook/v1/user/resolve`;
  const resolveRes = await fetch(resolveUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  const me = await resolveRes.json().catch(() => ({}));

  if (!me?.found) redirect("/app/onboarding");

  // 3) Fetch printers list for this customer_id
  const printersUrl = `${base.replace(/\/$/, "")}/webhook/v1/dashboard/printers`;
  const printersRes = await fetch(printersUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify({ customer_id: me.customer_id }),
    cache: "no-store",
  });

  const printersData = await printersRes.json().catch(() => ({ ok: false, printers: [] }));
  const printers = Array.isArray(printersData?.printers) ? printersData.printers : [];

  // 4) Render
  return (
    <main style={{ padding: 24 }}>
      <h1>My3DMonitor Dashboard</h1>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Customer ID:</strong> {me.customer_id}</p>

      <h2 style={{ marginTop: 24 }}>Printers</h2>

      {printers.length === 0 ? (
        <p>No printers found for this customer.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ marginTop: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Printer ID</th>
              <th>Status</th>
              <th>Timezone</th>
              <th>Last Seen</th>
              <th>Agent Version</th>
            </tr>
          </thead>
          <tbody>
            {printers.map((p: any) => (
              <tr key={p.printer_id}>
                <td>{p.printer_id}</td>
                <td>{p.status || "-"}</td>
                <td>{p.tz || "-"}</td>
                <td>{p.last_seen || "-"}</td>
                <td>{p.agent_version || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}


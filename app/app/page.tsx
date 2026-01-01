import { redirect } from "next/navigation";

export default async function AppHome() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/me`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    redirect("/login");
  }

  const data = await res.json();

  if (!data.found) {
    redirect("/app/onboarding");
  }

  // For now, simple placeholder dashboard
  return (
    <main style={{ padding: 24 }}>
      <h1>My3DMonitor Dashboard</h1>
      <p><strong>Customer ID:</strong> {data.customer_id}</p>
      <p><strong>Email:</strong> {data.email}</p>

      <p style={{ marginTop: 16 }}>
        Dashboard data coming next…
      </p>
    </main>
  );
}

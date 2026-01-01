import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AppHome() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Temporary placeholder until dashboard fetch is implemented
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {session.user.email}</p>
    </main>
  );
}

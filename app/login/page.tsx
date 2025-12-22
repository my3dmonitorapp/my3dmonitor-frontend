"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main style={{ maxWidth: 560, margin: "60px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Login</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/app" })}
        style={{ padding: 12, width: "100%", marginTop: 16 }}
      >
        Continue with Google
      </button>
    </main>
  );
}

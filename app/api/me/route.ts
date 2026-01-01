import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const base = process.env.N8N_BASE_URL;
  const adminKey = process.env.N8N_ADMIN_KEY;

  if (!base) return NextResponse.json({ ok: false, error: "Missing N8N_BASE_URL" }, { status: 500 });
  if (!adminKey) return NextResponse.json({ ok: false, error: "Missing N8N_ADMIN_KEY" }, { status: 500 });

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

  const data = await r.json().catch(() => ({}));
  return NextResponse.json({ ok: true, email, ...data });
}

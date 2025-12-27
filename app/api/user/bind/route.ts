import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { customer_id } = await req.json();
  if (!customer_id) {
    return NextResponse.json({ error: "missing_customer_id" }, { status: 400 });
  }

  const base = process.env.N8N_BASE_URL;
  const adminKey = process.env.N8N_ADMIN_KEY;

  if (!base || !adminKey) {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }

  const resp = await fetch(
    `${base.replace(/\/$/, "")}/webhook/v1/user/bind`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({
        email: session.user.email,
        customer_id,
      }),
    }
  );

  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  return NextResponse.json(data, { status: resp.status });
}

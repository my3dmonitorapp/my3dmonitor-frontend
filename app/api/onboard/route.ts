import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = process.env.N8N_ONBOARD_URL;
    const adminKey = process.env.N8N_ADMIN_KEY;

    if (!url) return NextResponse.json({ error: "Missing N8N_ONBOARD_URL" }, { status: 500 });
    if (!adminKey) return NextResponse.json({ error: "Missing N8N_ADMIN_KEY" }, { status: 500 });

    const body = await req.json();

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}

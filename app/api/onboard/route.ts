import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Full webhook URL (recommended)
    const onboardUrl = process.env.N8N_ONBOARD_URL;

    // Fallback if you prefer base URL + fixed path
    const baseUrl = process.env.N8N_BASE_URL;

    const url =
      onboardUrl ||
      (baseUrl ? `${baseUrl.replace(/\/$/, "")}/webhook/admin/onboard` : null);

    if (!url) {
      return NextResponse.json(
        { error: "Missing N8N_ONBOARD_URL (or N8N_BASE_URL)" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

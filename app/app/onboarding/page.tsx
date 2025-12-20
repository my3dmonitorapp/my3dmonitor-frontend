"use client";
import { useState } from "react";

export default function Onboarding() {
  const [customerId, setCustomerId] = useState("cust_demo");
  const [tz, setTz] = useState("Asia/Jakarta");
  const [printers, setPrinters] = useState([{ printer_id: "voron01" }]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: customerId,
        tz_default: tz,
        printers,
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Onboarding</h1>

      <input value={customerId} onChange={e => setCustomerId(e.target.value)} />
      <input value={tz} onChange={e => setTz(e.target.value)} />

      <button onClick={run} disabled={loading}>
        {loading ? "Running..." : "Run onboarding"}
      </button>

      {result && (
        <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}

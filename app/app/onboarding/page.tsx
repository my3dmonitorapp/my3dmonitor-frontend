"use client";

import { useMemo, useState } from "react";

type PrinterInput = {
  printer_id: string;
  name: string;
  tz?: string;
};

const PLANS = {
  free: { label: "Free", maxPrinters: 1 },
  pro: { label: "Pro", maxPrinters: 3 },
  farm: { label: "Farm", maxPrinters: 10 },
} as const;

type PlanKey = keyof typeof PLANS;

function slugifyPrinterId(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}

export default function OnboardingPage() {
  const [customerId, setCustomerId] = useState("demo1");
  const [tzDefault, setTzDefault] = useState("Asia/Jakarta");

  // Temporary until Paddle: plan selector controls allowed printers
  const [plan, setPlan] = useState<PlanKey>("free");

  const maxPrinters = PLANS[plan].maxPrinters;

  const [printers, setPrinters] = useState<PrinterInput[]>([
    { printer_id: "voron01", name: "Voron 0.1", tz: "Asia/Jakarta" },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = printers.length < maxPrinters;

  const validation = useMemo(() => {
    const ids = printers.map((p) => p.printer_id.trim());
    const emptyId = ids.some((id) => !id);
    const dupId = new Set(ids).size !== ids.length;

    return {
      emptyId,
      dupId,
      overLimit: printers.length > maxPrinters,
    };
  }, [printers, maxPrinters]);

  function updatePrinter(i: number, patch: Partial<PrinterInput>) {
    setPrinters((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  function addPrinter() {
    if (!canAddMore) return;
    setPrinters((prev) => [
      ...prev,
      { printer_id: "", name: "", tz: tzDefault },
    ]);
  }

  function removePrinter(i: number) {
    setPrinters((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (validation.emptyId) throw new Error("Each printer must have a Printer ID.");
      if (validation.dupId) throw new Error("Printer IDs must be unique.");
      if (validation.overLimit)
        throw new Error(`Your plan allows max ${maxPrinters} printers.`);

      // Keep payload compatible with your existing n8n flow.
      // We send "name" too — if n8n ignores unknown fields, fine.
      // If you want name stored, later we’ll map it in the Google Sheets node.
      const payload = {
        customer_id: customerId.trim(),
        tz_default: tzDefault.trim(),
        plan, // optional; useful for later debugging
        printers: printers.map((p) => ({
          printer_id: slugifyPrinterId(p.printer_id),
          name: p.name.trim(),
          tz: (p.tz || tzDefault).trim(),
        })),
      };

      const resp = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || `Onboarding failed (${resp.status})`);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 950, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Onboarding</h1>

      <p>
        Choose your plan (temporary). After Paddle is integrated, this will be automatic.
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <label>
          Customer ID
          <input
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Default Timezone
          <input
            value={tzDefault}
            onChange={(e) => setTzDefault(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Plan
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as PlanKey)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            {Object.entries(PLANS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label} (max {v.maxPrinters} printers)
              </option>
            ))}
          </select>
        </label>

        <h2>
          Printers ({printers.length}/{maxPrinters})
        </h2>

        {!canAddMore && (
          <p style={{ color: "crimson" }}>
            You reached the limit for your plan. Upgrade to add more printers.
          </p>
        )}

        {validation.dupId && (
          <p style={{ color: "crimson" }}>Printer IDs must be unique.</p>
        )}

        {printers.map((p, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              placeholder="Printer ID (for agent) e.g. voron01"
              value={p.printer_id}
              onChange={(e) => updatePrinter(i, { printer_id: e.target.value })}
              style={{ padding: 10 }}
            />
            <input
              placeholder="Printer name (friendly) e.g. Voron Living Room"
              value={p.name}
              onChange={(e) => updatePrinter(i, { name: e.target.value })}
              style={{ padding: 10 }}
            />
            <input
              placeholder="Timezone (optional)"
              value={p.tz || ""}
              onChange={(e) => updatePrinter(i, { tz: e.target.value })}
              style={{ padding: 10 }}
            />
            <button onClick={() => removePrinter(i)}>Remove</button>
          </div>
        ))}

        <button onClick={addPrinter} disabled={!canAddMore} style={{ padding: 12 }}>
          + Add printer
        </button>

        <button onClick={submit} disabled={loading} style={{ padding: 12 }}>
          {loading ? "Running onboarding..." : "Run onboarding"}
        </button>

        {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

        {result && (
          <>
            <h2>Result</h2>
            <p>
              Install the agent from{" "}
              <a href="https://github.com/my3dmonitorapp/printer-agent" target="_blank" rel="noreferrer">
                https://github.com/my3dmonitorapp/printer-agent
              </a>
            </p>
            <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, overflowX: "auto" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </>
        )}
      </div>
    </main>
  );
}

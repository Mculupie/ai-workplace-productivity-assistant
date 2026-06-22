import { useState } from "react";
import { toast } from "sonner";

type Mode = "email" | "notes" | "planner" | "research";

export function useGenerate(mode: Mode) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  async function run(payload: Record<string, string>) {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, payload }),
      });
      if (!res.ok) {
        const text = await res.text();
        if (res.status === 429) toast.error("Rate limit reached. Please try again shortly.");
        else if (res.status === 402)
          toast.error("AI credits exhausted. Add credits in your workspace billing.");
        else toast.error(text || "Generation failed");
        return null;
      }
      const data = (await res.json()) as { text: string };
      setOutput(data.text);
      return data.text;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Network error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, output, setOutput, run };
}

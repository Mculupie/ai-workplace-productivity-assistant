import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway.server";

type Body = {
  mode?: "email" | "notes" | "planner" | "research";
  payload?: Record<string, unknown>;
};

const PROMPTS: Record<NonNullable<Body["mode"]>, (p: Record<string, unknown>) => { system: string; prompt: string }> = {
  email: (p) => ({
    system:
      "You write polished, professional workplace emails. Output ONLY the email body (with subject line on the first line as 'Subject: ...'). Keep it appropriate to the requested tone. No commentary.",
    prompt: `Recipient: ${p.recipient}\nTone: ${p.tone}\nPurpose / key points:\n${p.purpose}\n\nWrite the email now.`,
  }),
  notes: (p) => ({
    system:
      "You are a meeting notes summarizer. Output clean markdown with exactly these sections in this order:\n\n## Summary\n## Key Decisions\n## Action Items\n## Deadlines\n\nUse bullet points under each. If a section has nothing, write '- None'. Do not add other sections.",
    prompt: `Meeting notes:\n\n${p.notes}`,
  }),
  planner: (p) => ({
    system:
      "You are an AI productivity planner. Given tasks and available hours, produce a prioritized daily schedule as markdown. Include:\n\n## Prioritized Schedule\nA table with columns: Time | Task | Duration | Priority.\n\n## Rationale\nA few bullets explaining the prioritization.\n\n## Tips\n2-3 productivity tips relevant to the workload.",
    prompt: `Available hours: ${p.hours}\nStart time: ${p.startTime || "9:00 AM"}\n\nTasks:\n${p.tasks}`,
  }),
  research: (p) => ({
    system:
      "You are a sharp research assistant. Output markdown with exactly these sections in this order:\n\n## Summary\n## Key Insights\n## Challenges\n## Recommendations\n\nUse bullet points. Be concrete and concise.",
    prompt: `Topic / article:\n\n${p.topic}`,
  }),
};

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        if (!body.mode || !PROMPTS[body.mode]) {
          return new Response("Invalid mode", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { system, prompt } = PROMPTS[body.mode](body.payload ?? {});
        const gateway = createLovableAiGatewayProvider(key);
        try {
          const { text } = await generateText({
            model: gateway(DEFAULT_MODEL),
            system,
            prompt,
          });
          return Response.json({ text });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Generation failed";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return new Response(msg, { status });
        }
      },
    },
  },
});

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarClock,
  Microscope,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "WorkPilot — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan your day, and research faster with WorkPilot, your AI productivity assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const modules = [
  {
    title: "Smart Email Generator",
    desc: "Draft professional emails by tone, recipient, and purpose.",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into summary, decisions, actions, and deadlines.",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "AI Task Planner",
    desc: "Prioritize your day from a task list and available hours.",
    href: "/planner",
    icon: CalendarClock,
  },
  {
    title: "AI Research Assistant",
    desc: "Summarize topics with insights, challenges, and recommendations.",
    href: "/research",
    icon: Microscope,
  },
  {
    title: "AI Workplace Chatbot",
    desc: "Ask anything about productivity, planning, or workplace writing.",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Responsible AI",
    desc: "Disclaimers, data handling, and how to use these tools well.",
    href: "/responsible-ai",
    icon: ShieldCheck,
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-10 rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/40 to-background p-6 md:p-10">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Welcome to WorkPilot
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Your AI assistant for getting work done.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Five focused tools to write, plan, summarize, and research — so you can spend more time on
          what matters.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.href} to={m.href} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <m.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{m.title}</CardTitle>
                <CardDescription>{m.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

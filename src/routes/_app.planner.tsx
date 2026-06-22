import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { PageHeader, ModuleGrid, FormCard } from "@/components/module-shell";
import { OutputCard, HistoryList } from "@/components/output-card";
import { useGenerate } from "@/lib/use-generate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — WorkPilot" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [startTime, setStartTime] = useState("9:00 AM");
  const [refresh, setRefresh] = useState(0);
  const { loading, output, setOutput, run } = useGenerate("planner");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!tasks.trim()) return;
    await run({ tasks, hours, startTime });
    setRefresh((x) => x + 1);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<CalendarClock className="h-5 w-5" />}
        title="AI Task Planner"
        description="List your tasks and available hours. Get a prioritized daily schedule."
      />
      <ModuleGrid>
        <div className="space-y-6">
          <FormCard title="Plan inputs">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="hours">Available hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min={1}
                    max={16}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start">Start time</Label>
                  <Input
                    id="start"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tasks">Tasks (one per line, add notes/priority if useful)</Label>
                <Textarea
                  id="tasks"
                  required
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder={
                    "Review Q3 report (high priority)\nReply to client emails\nPrep slides for Friday demo\n1:1 with Sarah at 2pm"
                  }
                  className="min-h-[220px]"
                />
              </div>
              <Button type="submit" disabled={loading || !tasks.trim()} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Planning...
                  </>
                ) : (
                  "Build Schedule"
                )}
              </Button>
            </form>
          </FormCard>
          <HistoryList
            moduleKey="planner"
            refreshKey={refresh}
            onLoad={(it) => {
              setTasks(it.inputs.tasks ?? "");
              setHours(it.inputs.hours ?? "8");
              setStartTime(it.inputs.startTime ?? "9:00 AM");
              setOutput(it.output);
            }}
          />
        </div>
        <OutputCard
          value={output}
          setValue={setOutput}
          loading={loading}
          moduleKey="planner"
          inputs={{ tasks, hours, startTime, title: `Day plan (${hours}h)` }}
          onRegenerate={() => run({ tasks, hours, startTime })}
          title="Your Day"
        />
      </ModuleGrid>
    </div>
  );
}

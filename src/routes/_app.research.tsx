import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Microscope, Loader2 } from "lucide-react";
import { PageHeader, ModuleGrid, FormCard } from "@/components/module-shell";
import { OutputCard, HistoryList } from "@/components/output-card";
import { useGenerate } from "@/lib/use-generate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkPilot" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { loading, output, setOutput, run } = useGenerate("research");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    await run({ topic });
    setRefresh((x) => x + 1);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<Microscope className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Paste a topic or article. Get a summary, insights, challenges, and recommendations."
      />
      <ModuleGrid>
        <div className="space-y-6">
          <FormCard title="Topic or article">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Input</Label>
                <Textarea
                  id="topic"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 'Impact of remote work on team performance' or paste an article..."
                  className="min-h-[280px]"
                />
              </div>
              <Button type="submit" disabled={loading || !topic.trim()} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Researching...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </form>
          </FormCard>
          <HistoryList
            moduleKey="research"
            refreshKey={refresh}
            onLoad={(it) => {
              setTopic(it.inputs.topic ?? "");
              setOutput(it.output);
            }}
          />
        </div>
        <OutputCard
          value={output}
          setValue={setOutput}
          loading={loading}
          moduleKey="research"
          inputs={{ topic, title: topic.slice(0, 60) }}
          onRegenerate={() => run({ topic })}
          title="Research Brief"
        />
      </ModuleGrid>
    </div>
  );
}

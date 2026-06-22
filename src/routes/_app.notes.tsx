import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { PageHeader, ModuleGrid, FormCard } from "@/components/module-shell";
import { OutputCard, HistoryList } from "@/components/output-card";
import { useGenerate } from "@/lib/use-generate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkPilot" }] }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { loading, output, setOutput, run } = useGenerate("notes");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) return;
    await run({ notes });
    setRefresh((x) => x + 1);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste raw notes — get summary, decisions, action items, and deadlines."
      />
      <ModuleGrid>
        <div className="space-y-6">
          <FormCard title="Meeting notes">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Raw notes</Label>
                <Textarea
                  id="notes"
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste meeting notes or transcript here..."
                  className="min-h-[280px]"
                />
              </div>
              <Button type="submit" disabled={loading || !notes.trim()} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Summarizing...
                  </>
                ) : (
                  "Summarize"
                )}
              </Button>
            </form>
          </FormCard>
          <HistoryList
            moduleKey="notes"
            refreshKey={refresh}
            onLoad={(it) => {
              setNotes(it.inputs.notes ?? "");
              setOutput(it.output);
            }}
          />
        </div>
        <OutputCard
          value={output}
          setValue={setOutput}
          loading={loading}
          moduleKey="notes"
          inputs={{ notes, title: notes.slice(0, 50) }}
          onRegenerate={() => run({ notes })}
          title="Structured Summary"
        />
      </ModuleGrid>
    </div>
  );
}

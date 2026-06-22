import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { PageHeader, ModuleGrid, FormCard } from "@/components/module-shell";
import { OutputCard, HistoryList } from "@/components/output-card";
import { useGenerate } from "@/lib/use-generate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkPilot" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { loading, output, setOutput, run } = useGenerate("email");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!purpose.trim()) return;
    await run({ recipient, tone, purpose });
    setRefresh((x) => x + 1);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Describe the purpose. We'll draft a polished, on-tone email."
      />
      <ModuleGrid>
        <div className="space-y-6">
          <FormCard title="Email details">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="e.g. My manager, Sarah from Marketing"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Professional",
                      "Friendly",
                      "Concise",
                      "Persuasive",
                      "Apologetic",
                      "Formal",
                      "Casual",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose / key points</Label>
                <Textarea
                  id="purpose"
                  required
                  placeholder="Request a 30-min meeting next week to review Q3 roadmap..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="min-h-[160px]"
                />
              </div>
              <Button type="submit" disabled={loading || !purpose.trim()} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  "Generate Email"
                )}
              </Button>
            </form>
          </FormCard>
          <HistoryList
            moduleKey="email"
            refreshKey={refresh}
            onLoad={(it) => {
              setRecipient(it.inputs.recipient ?? "");
              setTone(it.inputs.tone ?? "Professional");
              setPurpose(it.inputs.purpose ?? "");
              setOutput(it.output);
            }}
          />
        </div>
        <OutputCard
          value={output}
          setValue={setOutput}
          loading={loading}
          moduleKey="email"
          inputs={{ recipient, tone, purpose, title: purpose.slice(0, 50) }}
          onRegenerate={() => run({ recipient, tone, purpose })}
          title="Drafted Email"
        />
      </ModuleGrid>
    </div>
  );
}

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Save, RotateCcw, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";
import { pushSavedOutput, type SavedOutput, getSavedOutputs, deleteSavedOutput } from "@/lib/storage";
import { useEffect } from "react";

export function OutputCard({
  value,
  setValue,
  loading,
  onRegenerate,
  moduleKey,
  inputs,
  title = "Output",
}: {
  value: string;
  setValue: (v: string) => void;
  loading: boolean;
  onRegenerate?: () => void;
  moduleKey: string;
  inputs: Record<string, string>;
  title?: string;
}) {
  const [editing, setEditing] = useState(false);

  function save() {
    if (!value.trim()) return;
    const item: SavedOutput = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      title: (inputs.title || Object.values(inputs)[0] || "Untitled").slice(0, 60),
      output: value,
      inputs,
    };
    pushSavedOutput(moduleKey, item);
    toast.success("Saved to history");
  }

  function copy() {
    navigator.clipboard.writeText(value);
    toast.success("Copied");
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Review, edit, and save.</CardDescription>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditing((e) => !e)}
            disabled={!value}
            title={editing ? "Preview" : "Edit"}
          >
            {editing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={copy} disabled={!value} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={save} disabled={!value} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          {onRegenerate ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRegenerate}
              disabled={loading}
              title="Regenerate"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <OutputSkeleton />
        ) : !value ? (
          <div className="grid h-full min-h-[260px] place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Output will appear here.
          </div>
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[320px] font-mono text-sm"
          />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OutputSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-muted"
          style={{ width: `${60 + ((i * 37) % 40)}%` }}
        />
      ))}
    </div>
  );
}

export function HistoryList({
  moduleKey,
  onLoad,
  refreshKey,
}: {
  moduleKey: string;
  onLoad: (item: SavedOutput) => void;
  refreshKey: number;
}) {
  const [items, setItems] = useState<SavedOutput[]>([]);
  useEffect(() => {
    setItems(getSavedOutputs(moduleKey));
  }, [moduleKey, refreshKey]);
  if (items.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent</CardTitle>
        <CardDescription>Saved in this browser</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between gap-2 rounded-md border bg-card/50 px-3 py-2 text-sm"
          >
            <button
              onClick={() => onLoad(it)}
              className="min-w-0 flex-1 truncate text-left hover:text-primary"
            >
              {it.title}
            </button>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(it.createdAt).toLocaleDateString()}
            </span>
            <button
              onClick={() => {
                deleteSavedOutput(moduleKey, it.id);
                setItems(getSavedOutputs(moduleKey));
              }}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Delete
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

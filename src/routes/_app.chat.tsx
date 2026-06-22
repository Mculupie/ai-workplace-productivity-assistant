import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createThread, deleteThread, useThreads } from "@/lib/chat-threads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Workplace Chatbot — WorkPilot" }] }),
  component: ChatLayout,
});

function ChatLayout() {
  const threads = useThreads();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  function onNew() {
    const t = createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }

  function onDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    deleteThread(id);
    if (id === activeId) navigate({ to: "/chat" });
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-6xl gap-4">
      <aside className="hidden w-64 shrink-0 flex-col rounded-xl border bg-card md:flex">
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="h-4 w-4" /> Conversations
          </div>
          <Button size="icon-sm" variant="ghost" onClick={onNew} title="New chat">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {threads.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">No chats yet</p>
          ) : (
            threads.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors",
                  t.id === activeId
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50",
                )}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="min-w-0 flex-1 truncate"
                >
                  {t.title}
                </Link>
                <button
                  onClick={(e) => onDelete(e, t.id)}
                  className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col rounded-xl border bg-card">
        <Outlet />
      </div>
    </div>
  );
}

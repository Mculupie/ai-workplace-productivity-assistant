import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createThread, useThreads } from "@/lib/chat-threads";

export const Route = createFileRoute("/_app/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const threads = useThreads();

  useEffect(() => {
    if (threads.length > 0) {
      navigate({
        to: "/chat/$threadId",
        params: { threadId: threads[0].id },
        replace: true,
      });
    }
  }, [threads, navigate]);

  function start() {
    const t = createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
  }

  return (
    <div className="grid flex-1 place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold">AI Workplace Chatbot</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Ask anything about productivity, writing, planning, or workplace communication.
        </p>
        <Button onClick={start}>Start a new chat</Button>
      </div>
    </div>
  );
}

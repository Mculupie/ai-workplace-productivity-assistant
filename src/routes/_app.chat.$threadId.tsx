import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useThread, usePersistMessages } from "@/lib/chat-threads";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  return <ChatWindow key={threadId} threadId={threadId} />;
}

function ChatWindow({ threadId }: { threadId: string }) {
  const thread = useThread(threadId);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const initialRef = useRef(thread?.messages ?? []);

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialRef.current,
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  usePersistMessages(threadId, messages, status);

  const isLoading = status === "submitted" || status === "streaming";


  function handleSubmit(message: { text?: string; files?: unknown }) {
    const text = (message.text ?? "").trim();
    if (!text) return;
    void sendMessage({ text });
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <div className="grid h-full min-h-[200px] place-items-center text-center text-sm text-muted-foreground">
              Ask me anything about your workday.
            </div>
          ) : (
            messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              return (
                <Message from={m.role} key={m.id}>
                  {m.role === "user" ? (
                    <MessageContent>{text}</MessageContent>
                  ) : (
                    <div className="prose prose-sm max-w-[80%] dark:prose-invert">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  )}
                </Message>
              );
            })
          )}
          {status === "submitted" ? (
            <div className="px-4 py-2">
              <Shimmer>Thinking...</Shimmer>
            </div>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="border-t p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            ref={textareaRef}
            placeholder="Message WorkPilot..."
            disabled={isLoading}
          />
          <div className="flex items-center justify-end p-2">
            <PromptInputSubmit status={status} disabled={isLoading} />
          </div>
        </PromptInput>
      </div>
    </div>
  );
}

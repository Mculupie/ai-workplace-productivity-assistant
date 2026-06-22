# WorkPilot — AI Workplace Productivity Assistant

A modern, responsive SaaS dashboard that helps teams and individuals work smarter with AI-powered tools for communication, summarization, planning, and research.

Built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and the **Lovable AI Gateway**.

---

## Features

WorkPilot includes five productivity modules plus a dedicated Responsible AI section.

### 1. Smart Email Generator
Generate polished, professional emails from a few inputs:
- **Purpose** — what the email is about
- **Recipient** — who it is going to
- **Tone** — formal, friendly, persuasive, concise, etc.

The generated email is editable, copyable, and saved to your local history.

### 2. Meeting Notes Summarizer
Paste raw meeting notes and get a structured output:
- Executive summary
- Key decisions made
- Action items
- Deadlines

### 3. AI Task Planner
Turn a goal or project into a clear, actionable plan:
- Task breakdown
- Priorities
- Time estimates
- Suggested schedule

### 4. AI Research Assistant
Summarize any topic into a clean research brief:
- Topic overview
- Key findings
- Challenges
- Recommendations

### 5. AI Workplace Chatbot
A conversational assistant for productivity questions. Supports multiple chat threads, each persisted in your browser so you can pick up conversations later.

### Responsible AI
A dedicated page explaining how the assistant works, its limitations, and responsible usage guidelines.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 8) |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| State | TanStack Query, React hooks |
| AI | Lovable AI Gateway (`@ai-sdk/openai-compatible`) |
| Routing | TanStack Router (file-based) |
| Forms | React Hook Form + Zod |
| Persistence | Browser `localStorage` for chat threads and module history |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+

### Install dependencies

```bash
bun install
```

### Run the development server

```bash
bun dev
```

The app will be available at `http://localhost:8080` by default.

### Build for production

```bash
bun run build
```

### Preview the production build

```bash
bun run preview
```

### Lint and format

```bash
bun run lint
bun run format
```

---

## Project Structure

```text
src/
├── components/          # Reusable UI components (shadcn/ui + custom)
│   ├── ai-elements/     # AI chat UI primitives (Conversation, Message, PromptInput, Shimmer)
│   ├── app-sidebar.tsx  # Collapsible dashboard navigation
│   ├── module-shell.tsx # Common layout wrapper for tool modules
│   └── output-card.tsx  # Markdown output with edit/copy/save actions
├── lib/                 # Utilities, AI gateway, storage, and hooks
│   ├── ai-gateway.server.ts  # Server-side AI gateway client
│   ├── chat-threads.ts       # Multi-thread localStorage chat store
│   ├── storage.ts            # Module output history helpers
│   └── use-generate.ts       # Hook for calling the generate API
├── routes/              # TanStack file-based routes
│   ├── _app.tsx         # Dashboard layout with sidebar
│   ├── _app.email.tsx   # Smart Email Generator
│   ├── _app.notes.tsx   # Meeting Notes Summarizer
│   ├── _app.planner.tsx # AI Task Planner
│   ├── _app.research.tsx# AI Research Assistant
│   ├── _app.chat.*.tsx  # Chatbot routes and layout
│   ├── _app.responsible-ai.tsx
│   └── api/             # Server API routes
│       ├── chat.ts      # Streaming chat endpoint
│       └── generate.ts  # Structured generation endpoint
├── styles.css           # Global theme and Tailwind imports
└── router.tsx           # TanStack Router bootstrap
```

---

## AI & Data Notes

- **AI provider**: All AI features route through the Lovable AI Gateway using the `google/gemini-3-flash-preview` model. You can change the model in `src/lib/ai-gateway.server.ts` if needed.
- **No server-side persistence**: Chat threads and generated outputs are stored only in the browser's `localStorage`. They are not sent to any backend database.
- **Local-first**: This makes the app quick to run and test, but data is tied to the current browser and device.

---

## Environment Variables

This project uses the Lovable AI Gateway by default, so no external API keys are required for local development inside the Lovable environment.

If you run the project outside Lovable and want to use a different provider, create a `.env` file in the project root and set the appropriate keys for your AI SDK-compatible provider.

---

## Responsible AI

WorkPilot is designed to augment, not replace, human judgment. The Responsible AI page covers:

- AI-generated content should be reviewed before use in professional contexts.
- The assistant does not have access to private or proprietary data unless explicitly provided by the user.
- Outputs may occasionally be inaccurate or incomplete — always verify facts, deadlines, and recommendations.
- Respect confidentiality: avoid pasting sensitive personal information or confidential business data into the tools.

---

## Deployment

The project is configured for deployment via Lovable. The production build is optimized for edge/serverless runtimes (Cloudflare Workers). Connect the project to GitHub in the Lovable editor to enable continuous bidirectional sync and self-hosting options.

---

## License

This project is provided as a starter / reference application and is intended for personal or internal use unless otherwise specified.

---

Built with [Lovable](https://lovable.dev).

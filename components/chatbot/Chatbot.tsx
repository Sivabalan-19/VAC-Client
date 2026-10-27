"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function Chatbot({ id }: { id: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setPrompt("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id, messages: nextMessages }),
      });
      const result: { text?: string; error?: string } = await response.json();

      if (!response.ok || !result.text) {
        throw new Error(result.error || "Unable to get a response.");
      }

      setMessages([...nextMessages, { role: "assistant", content: result.text }]);
    } catch (sendError) {
      setError(
        sendError instanceof Error ? sendError.message : "Unable to get a response."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          Mind Peace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Conversation {id}</p>
      </header>

      <section
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto p-6"
      >
        {messages.length === 0 ? (
          <p className="mx-auto mt-12 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
            What would you like to talk about?
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-2xl whitespace-pre-wrap rounded-xl px-4 py-3 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100"
              }`}
            >
              {message.content}
            </div>
          ))
        )}
        {isLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-400" role="status">
            Thinking...
          </p>
        )}
        {error && (
          <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        )}
      </section>

      <form
        onSubmit={sendMessage}
        className="flex gap-3 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <label className="sr-only" htmlFor="chat-prompt">
          Message
        </label>
        <input
          id="chat-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Write a message..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}

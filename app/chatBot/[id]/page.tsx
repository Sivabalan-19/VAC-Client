import { Chatbot } from "@/components/chatbot/Chatbot";
import { Sidebar } from "@/components/chatbot/Sidebar";
import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <Chatbot id={id} />
    </div>
  );
}

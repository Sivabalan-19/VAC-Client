"use client";

import { apiRequest } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatBotPage() {
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        async function openLatestChat() {
            try {
                const response = await apiRequest<{
                    data?: { chat?: { id?: string | number } };
                }>("/chatbot/latest");
                if (cancelled) return;

                const latestChatId = response.data?.chat?.id;
                if (latestChatId) {
                    router.replace(`/chatBot/${latestChatId}`);
                    return;
                }
                router.replace("/login");
            } catch {
                if (!cancelled) {
                    router.replace("/login");
                }
            }
        }

        openLatestChat();
        return () => {
            cancelled = true;
        };
    }, [router]);

    return <div className="h-screen w-full" />;
}

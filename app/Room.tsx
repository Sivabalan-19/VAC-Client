"use client";

import React, { ReactNode, useMemo, Suspense } from "react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";

// Create a separate component that uses useSearchParams
function RoomContent({ children }: { children: ReactNode }) {
    const roomId = useExampleRoomId("liveblocks:examples:nextjs-yjs-monaco");
    console.log("Room ID:", roomId);

    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
            <RoomProvider
                id={roomId}
                initialPresence={{
                    cursor: null,
                }}
            >
                <ClientSideSuspense fallback={<div>Loading</div>}>{children}</ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}

class LiveblocksErrorBoundary extends React.Component<
    { children: ReactNode; fallback?: ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: ReactNode; fallback?: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any) {
        console.warn("Liveblocks error caught, falling back to local editor:", error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? this.props.children;
        }
        return this.props.children;
    }
}

// Main component with Suspense boundary
export function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksErrorBoundary fallback={<>{children}</>}>
            <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading editor...</div>}>
                <RoomContent>{children}</RoomContent>
            </Suspense>
        </LiveblocksErrorBoundary>
    );
}

export function Room2({ children }: { children: ReactNode }) {
    return (
        <LiveblocksErrorBoundary fallback={<>{children}</>}>
            <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading editor...</div>}>
                <RoomContent>{children}</RoomContent>
            </Suspense>
        </LiveblocksErrorBoundary>
    );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
    const params = useSearchParams();
    const exampleId = params?.get("exampleId");

    const exampleRoomId = useMemo(() => {
        return exampleId ? `${roomId}-${exampleId}` : roomId;
    }, [roomId, exampleId]);

    return exampleRoomId;
}
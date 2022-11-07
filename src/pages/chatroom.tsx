import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";

import Button from "@components/Button";

const ChatComponent = dynamic(() => import("@components/Chat"), { ssr: false });

configureAbly({ authUrl: "/api/createTokenRequest" });

export default function ChatRoom() {
  const [, ably] = useChannel("main-room", () => {});

  const handleSignOut = () => {
    signOut();
    ably.close();
  };

  return (
    <main className="mx-4 h-screen">
      <div className="mx-auto w-full max-w-3xl">
        <nav className="flex items-center justify-between py-2">
          <h1 className="text-2xl font-bold capitalize">next chat</h1>
          <Button action={handleSignOut} danger rounded>
            sign out
          </Button>
        </nav>
        <ChatComponent />
      </div>
    </main>
  );
}

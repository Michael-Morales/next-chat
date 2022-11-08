import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import { useChannel, configureAbly } from "@ably-labs/react-hooks";

import Button from "@components/Button";

const ChatComponent = dynamic(() => import("@components/Chat"), { ssr: false });

configureAbly({
  authUrl: "http://localhost:3000/api/createTokenRequest",
});

interface IMessage {
  username: string;
  data: string;
  id: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channel, ably] = useChannel("main-room", ({ clientId, data, id }) => {
    setMessages((prev) => [...prev, { username: clientId, data, id }]);
  });

  const handlePublish = useCallback(
    (message: string) => {
      channel.publish({ name: "chat-message", data: message });
    },
    [channel]
  );

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
        <ChatComponent messages={messages} handlePublish={handlePublish} />
      </div>
    </main>
  );
}

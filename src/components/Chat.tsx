import { KeyboardEventHandler, useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";

import { chatMessageSchema, IChatMessage } from "@lib/validation/chat";

import Button from "@components/Button";
import Message from "@components/Message";

configureAbly({ authUrl: "http://localhost:3000/api/createTokenRequest" });

interface IMessage {
  username: string;
  data: string;
  id: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channel] = useChannel("main-room", ({ clientId, data, id }) => {
    setMessages((prev) => [...prev, { username: clientId, data, id }]);
  });
  const emptyRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    setFocus,
  } = useForm<IChatMessage>({
    defaultValues: { message: "" },
    resolver: zodResolver(chatMessageSchema),
  });

  const onSubmit: SubmitHandler<IChatMessage> = ({ message }) => {
    channel.publish({ name: "chat-message", data: message });
    setFocus("message");
    reset();
  };

  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.code !== "Enter" || e.shiftKey || errors.message) {
      return;
    }

    return handleSubmit(onSubmit({ message: e.currentTarget.value }));
  };

  useEffect(() => {
    emptyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-72px)] flex-col justify-between">
      <div className="flex h-full flex-col gap-y-2 overflow-y-auto bg-zinc-50 p-4">
        {messages.map(({ id, username, data }) => (
          <Message key={id} username={username} message={data} />
        ))}
        <div ref={emptyRef} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex border-t">
        <textarea
          className="h-16 flex-1 resize-none border-none focus:ring-0"
          placeholder="Type a message..."
          onKeyUp={handleKeyPress}
          {...register("message")}
        ></textarea>
        <Button type="submit" disabled={!isDirty || !!errors.message}>
          send
        </Button>
      </form>
    </div>
  );
}

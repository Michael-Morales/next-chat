import { useState, KeyboardEventHandler, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";

import { chatMessageSchema, IChatMessage } from "@lib/validation/chat";

import Button from "@components/Button";
import Message from "@components/Message";

interface IMessage {
  username: string;
  data: string;
  id: string;
}

export default function Chat() {
  configureAbly({ authUrl: "/api/createTokenRequest" });

  const emptyRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    setFocus,
  } = useForm<IChatMessage>({
    mode: "onChange",
    defaultValues: { message: "" },
    resolver: zodResolver(chatMessageSchema),
  });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channel] = useChannel("main-room", ({ clientId, data, id }) => {
    setMessages((prev) => [...prev, { username: clientId, data, id }]);
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
      <div className="h-full flex-1 overflow-y-auto bg-zinc-50 p-4">
        <div className="flex flex-col justify-end gap-y-2">
          {messages.map(({ id, username, data }) => (
            <Message key={id} username={username} message={data} />
          ))}
          <div ref={emptyRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex border-t">
        <textarea
          className="h-16 flex-1 resize-none border-none"
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

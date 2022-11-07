import { useState, KeyboardEventHandler, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";

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
    formState: { isDirty },
    reset,
    setFocus,
  } = useForm({
    mode: "onChange",
    defaultValues: { message: "" },
  });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channel] = useChannel("main-room", ({ clientId, data, id }) => {
    setMessages((prev) => [...prev, { username: clientId, data, id }]);
  });

  const onSubmit: SubmitHandler<any> = ({ message }: any) => {
    channel.publish({ name: "chat-message", data: message });
    setFocus("message");
    reset();
  };

  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.code !== "Enter" || e.shiftKey) {
      return;
    }

    return handleSubmit(onSubmit({ message: e.currentTarget.value }));
  };

  useEffect(() => {
    emptyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-72px)] flex-col justify-between">
      <div className="h-full flex-1 overflow-y-auto bg-zinc-50">
        <div className="flex flex-col justify-end gap-y-2 border-b p-4">
          {messages.map(({ id, username, data }) => (
            <Message key={id} username={username} message={data} />
          ))}
          <div ref={emptyRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <textarea
          className="h-16 flex-1 resize-none border-none"
          placeholder="Type a message..."
          onKeyUp={handleKeyPress}
          {...register("message")}
        ></textarea>
        <Button type="submit" disabled={!isDirty}>
          send
        </Button>
      </form>
    </div>
  );
}

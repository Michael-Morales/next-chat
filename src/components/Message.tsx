import { useSession } from "next-auth/react";

interface IProps {
  username: string;
  message: string;
}

export default function Message({ username, message }: IProps) {
  const { data: session } = useSession();

  return (
    <div
      className={`flex max-w-[70%] flex-col gap-y-2 rounded-tl-xl rounded-tr-xl p-4 ${
        session?.user.username === username
          ? "self-end rounded-bl-xl bg-sky-200"
          : "self-start rounded-br-xl bg-sky-100"
      }`}
    >
      {session?.user.username !== username && (
        <span className="text-xs font-semibold text-zinc-600">{username}</span>
      )}
      <p className="whitespace-pre-line">{message}</p>
    </div>
  );
}

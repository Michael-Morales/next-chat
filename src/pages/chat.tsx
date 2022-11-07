import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";

import Button from "@components/Button";

export default function Chat() {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: { message: "" },
  });

  const onSubmit = (val: any) => {
    console.log(val);
  };

  return (
    <main className="mx-4 h-screen">
      <div className="mx-auto w-full max-w-3xl">
        <nav className="flex items-center justify-between py-2">
          <h1 className="text-2xl font-bold capitalize">next chat</h1>
          <Button action={() => signOut()} danger>
            sign out
          </Button>
        </nav>
        <div className="flex h-[calc(100vh-72px)] flex-col justify-between">
          <div className="flex-1 border-b bg-zinc-50  ">
            {/* chat messages */}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex">
            <textarea
              className="h-16 flex-1 resize-none border-none"
              placeholder="Type a message..."
              {...register("message")}
            ></textarea>
            <Button type="submit" disabled={!isDirty}>
              send
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

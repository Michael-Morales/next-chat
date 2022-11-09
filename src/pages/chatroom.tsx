import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "@api/auth/[...nextauth]";

import Button from "@components/Button";

const ChatComponent = dynamic(() => import("@components/Chat"), { ssr: false });

export default function ChatRoom() {
  const handleSignOut = () => {
    signOut();
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

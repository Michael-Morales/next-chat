import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "@api/auth/[...nextauth]";

import Layout from "@components/Layout";

const ChatComponent = dynamic(() => import("@components/Chat"), { ssr: false });

export default function ChatRoom() {
  return (
    <main className="mx-4 h-screen">
      <Layout>
        <ChatComponent />
      </Layout>
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

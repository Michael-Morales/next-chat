import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

import Button from "@components/Button";

export default function Layout({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const handleOpenMenu = () => {
    setOpen(!open);
  };

  return (
    <main className="mx-4 h-screen">
      <div className="mx-auto w-full max-w-3xl">
        <header className="relative z-20 flex items-center justify-between py-2">
          <h1 className="text-2xl font-bold capitalize">next chat</h1>
          <Button action={handleOpenMenu} rounded>
            menu
          </Button>
          <nav
            className={`absolute right-0  -z-10 flex flex-col gap-y-4 rounded-lg bg-zinc-50 p-4 shadow transition-all ${
              open ? "top-full opacity-100" : "-top-40 opacity-0"
            }`}
          >
            <Link
              className="self-end font-semibold transition-opacity hover:opacity-50"
              href={`/${
                router.pathname === "/settings" ? "chatroom" : "settings"
              }`}
            >
              {router.pathname === "/settings" ? "Go to chatroom" : "Settings"}
            </Link>
            <Button action={handleSignOut} danger rounded>
              sign out
            </Button>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}

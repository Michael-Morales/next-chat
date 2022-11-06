import { signOut } from "next-auth/react";

export default function Chat() {
  return (
    <>
      <h1>Chat page</h1>
      <button onClick={() => signOut()}>sign out</button>
    </>
  );
}

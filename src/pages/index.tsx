import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";

import { signInSchema, ISignIn } from "../lib/validation/auth";

import Input from "../components/Input";

export default function Home() {
  const { register, handleSubmit } = useForm<ISignIn>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<ISignIn> = (values) => {
    const { email, password } = signInSchema.parse(values);

    signIn("app-login", {
      callbackUrl: "/sign-up",
      email,
      password,
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="email"
            id="email"
            type="email"
            placeholder="example@mail.com"
            register={register("email", { required: true })}
          />
          <Input
            label="password"
            id="password"
            type="password"
            register={register("password", { required: true })}
          />
          <button>sign in</button>
        </form>
        <button onClick={() => signOut()}>sign out</button>
      </main>
    </>
  );
}

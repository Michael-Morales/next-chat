import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";

import { signInSchema, ISignIn } from "@lib/validation/auth";
import { authOptions } from "@api/auth/[...nextauth]";

import Input from "@components/Input";
import Button from "@components/Button";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignIn>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<ISignIn> = (values) => {
    const { email, password } = signInSchema.parse(values);

    signIn("app-login", {
      callbackUrl: "/chatroom",
      email,
      password,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-zinc-50 p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold capitalize">sign in</h1>
        <form
          className="mb-1 flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="email"
            id="email"
            type="email"
            placeholder="example@mail.com"
            register={register("email", { required: true })}
            error={errors.email?.message}
          />
          <Input
            label="password"
            id="password"
            type="password"
            register={register("password", {
              required: true,
              minLength: 6,
            })}
            error={errors.password?.message}
          />
          <Button type="submit">sign in</Button>
        </form>
        <p>
          <span className="mr-1 text-sm text-zinc-500">
            Don&apos;t have an account?
          </span>
          <Link
            href="/sign-up"
            className="text-sm text-sky-500 transition-colors hover:text-sky-300 focus-visible:text-sky-300"
          >
            Sign up
          </Link>
        </p>
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

  if (session) {
    return {
      redirect: {
        destination: "/chatroom",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

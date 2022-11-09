import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_getServerSession } from "next-auth";

import { signUpSchema, ISignUp } from "@lib/validation/auth";
import { authOptions } from "@api/auth/[...nextauth]";

import Input from "@components/Input";
import Button from "@components/Button";

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<ISignUp> = async (values) => {
    const parsedValues = await signUpSchema.parseAsync(values);

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedValues),
    });

    await res.json();

    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-zinc-50 p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold capitalize">sign up</h1>
        <form
          className="mb-1 flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="username"
            id="username"
            placeholder="JohnDoe"
            register={register("username", { required: true, minLength: 3 })}
            error={errors.username?.message}
          />
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
            register={register("password", { required: true, minLength: 6 })}
            error={errors.password?.message}
          />
          <Input
            label="confirm password"
            id="confirmPassword"
            type="password"
            register={register("confirmPassword", {
              required: true,
              minLength: 6,
            })}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" rounded>
            sign up
          </Button>
        </form>
        <p>
          <span className="mr-1 text-sm text-zinc-500">
            Already have an account?
          </span>
          <Link
            href="/"
            className="text-sm text-sky-500 transition-colors hover:text-sky-300 focus-visible:text-sky-300"
          >
            Sign in
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

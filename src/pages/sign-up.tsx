import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema, ISignUp } from "../lib/validation/auth";

import Input from "@/components/Input";

const ERRORS: {
  [key: string]: {
    name: "password" | "email" | "username" | "confirmPassword";
    message: string;
  };
} = {
  no_match: {
    name: "password",
    message: "Passwords don't match",
  },
  email_already_exists: {
    name: "email",
    message: "Email address already exists",
  },
  username_already_exists: {
    name: "username",
    message: "Username already exists",
  },
};

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<ISignUp> = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        setError("password", {
          type: "no_match",
          message: "Passwords don't match",
        });

        return;
      }

      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.user) {
        throw new Error(data.message);
      }

      router.push("/");
    } catch (err: any) {
      setError(ERRORS[err.message].name, {
        type: err.message,
        message: ERRORS[err.message].message,
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg bg-zinc-50 p-6 shadow-md">
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
          />
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
            register={register("password", { required: true, minLength: 6 })}
          />
          <Input
            label="confirm password"
            id="confirmPassword"
            type="password"
            register={register("confirmPassword", {
              required: true,
              minLength: 6,
            })}
          />
          <button className="rounded bg-sky-400 p-2 font-bold capitalize text-zinc-50">
            sign up
          </button>
        </form>
        <p>
          <span className="mr-1 text-sm text-zinc-500">
            Already have an account?
          </span>
          <Link
            href="/"
            className="text-sm text-sky-500 transition-colors hover:text-sky-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

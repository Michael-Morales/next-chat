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
    <main>
      <h1>sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="username"
          id="username"
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
        <button>sign up</button>
      </form>
    </main>
  );
}

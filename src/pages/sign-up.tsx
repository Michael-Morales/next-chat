import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema, ISignUp } from "../lib/validation/auth";

import Input from "../components/Input";

export default function SignUp() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ISignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<ISignUp> = async (values) => {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    console.log(data);
  };

  return (
    <main>
      <h1>sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="username"
          id="username"
          register={register("username", { required: true })}
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
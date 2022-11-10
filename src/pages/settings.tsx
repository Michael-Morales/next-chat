import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authOptions } from "@api/auth/[...nextauth]";
import { userSchema, IUser } from "@lib/validation/user";

import Layout from "@components/Layout";
import Input from "@components/Input";
import Button from "@components/Button";

export default function Settings() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<IUser> = (values) => {
    const { username } = userSchema.parse(values);

    console.log(username);
  };

  return (
    <Layout>
      <form
        className="mx-auto mt-6 flex max-w-lg flex-col gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="font-semibold">
          Current username: {session?.user.username}
        </div>
        <Input
          label="new username"
          id="username"
          register={register("username", { required: true })}
          error={errors.username?.message}
        />
        <Button type="submit" rounded>
          update
        </Button>
      </form>
    </Layout>
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

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "argon2";

import prisma from "@lib/prismadb";
import { signInSchema } from "@lib/validation/auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
    newUser: "/sign-up",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "app-login",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@mail.com",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = signInSchema.parse(credentials);

        const result = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!result) {
          return null;
        }

        const isValid = await verify(result.password, password);

        if (!isValid) {
          return null;
        }

        return { id: result.id, email, username: result.username };
      },
    }),
  ],
  callbacks: {
    signIn: async () => true,
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.username = user.username;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.userId = token.userId;
        session.user.email = token.email;
        session.user.username = token.username;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);

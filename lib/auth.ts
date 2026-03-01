import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "비밀번호",
      credentials: {
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.SHARED_PASSWORD) {
          return { id: "1", name: "KMall 직원" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

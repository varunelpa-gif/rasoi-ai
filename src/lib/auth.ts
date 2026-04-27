import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
        name:     { label: "Name",     type: "text"     },
      },
      async authorize(credentials) {
        const email    = credentials?.email as string;
        const password = credentials?.password as string;
        const name     = credentials?.name as string;

        if (!email || !email.includes("@")) return null;
        if (!password || password.length < 6)  return null;

        return {
          id:    email,
          email: email,
          name:  name || email.split("@")[0],
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages:   { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name  = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.name  = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});

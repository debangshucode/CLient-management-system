// types/next-auth.d.ts or at root as next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string; // Add your custom field here
    };
  }

  interface User {
    role?: string;
  }
}

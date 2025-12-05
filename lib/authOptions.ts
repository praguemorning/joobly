import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import dbConnect from "@/database/dbConnect";
import { User } from "@/models/User";
import { compare } from "bcryptjs";
import mongoose from "mongoose";


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      checks: ["state"],
      issuer: undefined, 
      authorization: {
        params: {
          scope: "openid profile email", 
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: { email: string, password: string } | undefined, req) {
        if (!credentials) return null;
        const email = credentials.email;
        const password = credentials.password;
      
        await dbConnect().catch(error => { error: "Connection Failed...!" });
        mongoose.connect(process.env.MONGODB_URI as string);
        const user = await User.findOne({ email });
        const passwordOk = user && await compare(password, user.password);
      
        if (user && passwordOk) {
          return user;
        }
      
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
};

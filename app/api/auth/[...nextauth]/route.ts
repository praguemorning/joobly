import { authOptions } from "@/lib/authOptions";
import NextAuth, { AuthOptions } from "next-auth";

/**
 * next-auth builds its OAuth callback URLs from NEXTAUTH_URL. Two things break
 * that here:
 *
 *  - the app is reached through a Cloudflare Worker, which fetches the
 *    *.vercel.app origin, so the request Host is never praguemorning.cz;
 *  - Next's basePath ("/jobs") is not applied to next-auth's own routes.
 *
 * Left alone it advertises https://<deployment>.vercel.app/api/auth/callback/...
 * — neither the public URL nor a path that exists — so Google rejects the
 * redirect_uri and sign-in fails.
 *
 * Pinned in code rather than left to the environment because the value is a
 * property of how this app is mounted, not of the deployment. NEXTAUTH_URL_PUBLIC
 * still overrides it.
 */
process.env.NEXTAUTH_URL =
	process.env.NEXTAUTH_URL_PUBLIC ?? "https://praguemorning.cz/jobs/api/auth";

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };

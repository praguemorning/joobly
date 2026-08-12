// Must be first: it pins NEXTAUTH_URL, and next-auth reads that when it
// initialises. ES imports are hoisted, so anything assigned below this line
// runs too late. See lib/pinAuthUrl for why the pin is needed at all.
import "@/lib/pinAuthUrl";

import { authOptions } from "@/lib/authOptions";
import NextAuth, { AuthOptions } from "next-auth";

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };

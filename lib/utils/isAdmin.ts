import { getSessionUser } from "@/lib/auth/session";

export async function isAdmin() {
  const user = await getSessionUser();
  return Boolean(user?.admin);
}

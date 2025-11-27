import { cookies } from "next/headers";
import { BACKEND_URL } from "@/lib/constant/constants";

export async function getUserFavsJobs() {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`${BACKEND_URL}/profile`, {
        headers: {
            cookie,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const user = await res.json();
    // Devuelve solo los IDs de los trabajos favoritos
    return (user.favoriteJobs || []).map((job: any) => job._id);
}

export async function getUserInfo() {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`${BACKEND_URL}/profile`, {
        headers: {
            cookie,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const user = await res.json();

    // Verifica si el usuario tiene propiedades importantes
    if (!user || !user._id || Object.keys(user).length === 0) {
        return null;
    }

    return user;
}
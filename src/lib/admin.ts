import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "hudreads_admin";
const secret = new TextEncoder().encode(
    process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me",
);

export async function createAdminSession() {
    const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function clearAdminSession() {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;
    if (!token) return false;

    try {
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export function verifyAdminPassword(password: string): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return false;
    return password === adminPassword;
}

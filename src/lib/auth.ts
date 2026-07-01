/**
 * Simple JWT-based auth for CMS admin panel.
 * Uses bcrypt for password hashing, jwt for session tokens.
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "rivansafar-dev-secret-change-me-in-prod";
const COOKIE_NAME = "rivansafar_session";

export type Role = "SUPER_ADMIN" | "TOUR_MANAGER" | "CONTENT_EDITOR" | "SALES" | "SEO_MANAGER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: AuthUser) {
  const token = signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

/** RBAC permission map — declarative per role */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"],
  TOUR_MANAGER: [
    "tours.*",
    "destinations.*",
    "hotels.*",
    "transports.*",
    "tour-dates.*",
    "media.read",
    "media.create",
  ],
  CONTENT_EDITOR: ["pages.*", "blog.*", "banners.*", "media.*", "reviews.read", "reviews.update"],
  SALES: ["requests.*", "tours.read", "reviews.read"],
  SEO_MANAGER: ["seo.*", "menus.*", "redirects.*", "pages.read"],
};

export function hasPermission(role: Role, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes("*")) return true;
  if (perms.includes(permission)) return true;
  // wildcard match: "tours.*" matches "tours.read"
  const prefix = permission.split(".")[0] + ".*";
  return perms.includes(prefix);
}

/** Authenticate user against DB by email + password */
export async function authenticate(email: string, password: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "مدیر کل",
  TOUR_MANAGER: "مدیر تورها",
  CONTENT_EDITOR: "ویراستار محتوا",
  SALES: "کارشناس فروش",
  SEO_MANAGER: "مدیر سئو",
};

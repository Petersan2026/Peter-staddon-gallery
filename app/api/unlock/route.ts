import { NextResponse } from "next/server";

const COOKIE_NAME = "psg_unlocked";

export async function POST(req: Request) {
  const form = await req.formData();

  const passkey = String(form.get("passkey") ?? "");
  const next = String(form.get("next") ?? "/");

  const expected = process.env.GALLERY_PASSKEY ?? "";

  // If the env var isn't set, unlock must never succeed.
  if (!expected || passkey !== expected) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = NextResponse.redirect(new URL(next, req.url), { status: 303 });

  // Simple gating cookie (not image security).
  res.cookies.set({
    name: COOKIE_NAME,
    value: "all",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return res;
}

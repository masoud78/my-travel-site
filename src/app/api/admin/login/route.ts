import { NextRequest, NextResponse } from "next/server";
import { authenticate, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await authenticate(email, password);
    if (!user) {
      return NextResponse.json({ success: false, error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
    }
    await setSessionCookie(user);
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, error: "خطا در ورود" }, { status: 500 });
  }
}

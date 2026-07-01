import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  name: z.string().max(100).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = newsletterSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "ایمیل معتبر نیست" },
        { status: 422 }
      );
    }

    const { email, name } = parsed.data;

    await prisma.newsletter.upsert({
      where: { email },
      update: { isActive: true, ...(name ? { name } : {}) },
      create: {
        email,
        name: name || undefined,
        isActive: true,
      },
    });

    return NextResponse.json(
      { ok: true, message: "عضویت شما در خبرنامه ثبت شد" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت عضویت. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

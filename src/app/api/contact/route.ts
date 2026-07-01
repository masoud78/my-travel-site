import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactPostSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(100),
  phone: z.string().min(8, "شماره تماس معتبر نیست").max(20),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  subject: z.string().min(2).max(200).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  type: z.enum(["CALLBACK", "GENERAL", "B2B", "CUSTOM_TOUR", "JOB"]).default("GENERAL"),
  tourId: z.string().optional().or(z.literal("")),
  pageUrl: z.string().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = contactPostSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "ورودی نامعتبر", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { email, ...data } = parsed.data;

    const contact = await prisma.contactRequest.create({
      data: {
        ...data,
        email: email || undefined,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { ok: true, id: contact.id, message: "درخواست شما با موفقیت ثبت شد" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

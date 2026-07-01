import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(100),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  tourId: z.string().optional().or(z.literal("")),
  blogPostId: z.string().optional().or(z.literal("")),
  rating: z.coerce.number().int("امتیاز باید عدد صحیح باشد").min(1, "حداقل امتیاز ۱").max(5, "حداکثر امتیاز ۵"),
  title: z.string().max(200).optional().or(z.literal("")),
  text: z.string().min(20, "نظر حداقل ۲۰ کاراکتر").max(2000, "نظر حداکثر ۲۰۰۰ کاراکتر"),
  tourTitle: z.string().optional().or(z.literal("")),
  postTitle: z.string().optional().or(z.literal("")),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get("tourId")?.trim();
    const blogPostId = searchParams.get("blogPostId")?.trim();
    const limit = Number(searchParams.get("limit") || "10");
    const status = searchParams.get("status")?.trim() || "APPROVED";

    if (tourId && blogPostId) {
      return NextResponse.json(
        { error: "فقط یکی از tourId یا blogPostId قابل ارسال است" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        status,
        ...(tourId ? { tourId } : {}),
        ...(blogPostId ? { blogPostId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 50),
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت نظرات" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = reviewSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "ورودی نامعتبر", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { email, tourId, blogPostId, text, title, tourTitle, postTitle, ...data } = parsed.data;

    if (!tourId && !blogPostId) {
      return NextResponse.json(
        { error: "شناسه تور یا مقاله باید مشخص شود" },
        { status: 422 }
      );
    }

    if (tourId && blogPostId) {
      return NextResponse.json(
        { error: "فقط یکی از تور یا مقاله باید مشخص شود" },
        { status: 422 }
      );
    }

    const review = await prisma.review.create({
      data: {
        ...data,
        content: text,
        authorName: data.name,
        authorEmail: email || undefined,
        title: title || undefined,
        tourId: tourId || undefined,
        tourTitle: tourTitle || undefined,
        blogPostId: blogPostId || undefined,
        postTitle: postTitle || undefined,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { ok: true, id: review.id, message: "نظر شما پس از بررسی منتشر خواهد شد" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت نظر. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

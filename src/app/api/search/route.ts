import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const searchSchema = z.object({
  q: z.string().optional(),
  destination: z.string().optional(),
  origin: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  budgetMax: z.coerce.number().optional(),
  transport: z.string().optional(),
  duration: z.coerce.number().optional(),
  travelers: z.coerce.number().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsed = searchSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "ورودی نامعتبر", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { q, destination, origin, budgetMax, transport, duration } = parsed.data;

    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (q?.trim()) {
      const term = q.trim();
      where.OR = [
        { title: { contains: term } },
        { description: { contains: term } },
        { shortDesc: { contains: term } },
        { destination: { name: { contains: term } } },
      ];
    }

    if (destination?.trim()) {
      where.destination = {
        OR: [
          { name: { contains: destination.trim() } },
          { slug: { contains: destination.trim() } },
        ],
      };
    }

    if (origin?.trim()) {
      where.origins = { contains: origin.trim() };
    }

    if (budgetMax !== undefined && budgetMax > 0) {
      where.startPrice = { lte: budgetMax };
    }

    if (transport?.trim()) {
      where.transportType = transport.trim().toUpperCase();
    }

    if (duration !== undefined && duration > 0) {
      where.duration = { lte: duration };
    }

    const [tours, destinations] = await Promise.all([
      prisma.tour.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { startPrice: "asc" }],
        take: 24,
        include: { destination: true },
      }),
      prisma.destination.findMany({
        where: {
          isActive: true,
          type: { in: ["COUNTRY", "CITY"] },
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        take: 10,
      }),
    ]);

    return NextResponse.json({
      query: q || "",
      filters: parsed.data,
      count: tours.length,
      tours,
      destinations,
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "خطا در جستجو. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

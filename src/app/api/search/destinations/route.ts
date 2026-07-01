import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

  try {
    const destinations = await prisma.destination.findMany({
      where: {
        isActive: true,
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { nameEn: { contains: query } },
                { slug: { contains: query } },
              ],
            }
          : {}),
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      take: 10,
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        type: true,
      },
    });

    return NextResponse.json({ destinations });
  } catch (error) {
    console.error("Destination search error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت مقصدها" },
      { status: 500 }
    );
  }
}

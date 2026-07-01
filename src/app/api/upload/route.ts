import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { createMedia } from "@/lib/admin-actions";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || undefined;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "فایلی انتخاب نشده است" }, { status: 400 });
    }

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "حجم فایل نباید بیشتر از ۵۰ مگابایت باشد" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, "-");
    const uniqueName = `${baseName}-${crypto.randomUUID().slice(0, 8)}${ext}`;

    const mimeType = file.type;
    let type = "FILE";
    if (mimeType.startsWith("image/")) type = "IMAGE";
    else if (mimeType.startsWith("video/")) type = "VIDEO";
    else if (mimeType.startsWith("audio/")) type = "AUDIO";

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;

    // Try to get image dimensions via sharp if available
    let width: number | undefined;
    let height: number | undefined;
    if (type === "IMAGE") {
      try {
        const sharp = (await import("sharp")).default;
        const meta = await sharp(buffer).metadata();
        width = meta.width;
        height = meta.height;
      } catch {
        // sharp not available or not an image
      }
    }

    const media = await createMedia({
      filename: uniqueName,
      originalName,
      mimeType,
      type,
      category,
      size: file.size,
      url,
      altText: originalName,
      width,
      height,
    });

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "خطا در آپلود فایل" }, { status: 500 });
  }
}

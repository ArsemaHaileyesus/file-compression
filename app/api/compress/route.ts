import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import fs from "fs"
import path from "path"
import { getFileTypeAndFormat } from "@/lib/compression"
import { compressFile } from "@/lib/compression.server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const compressionLevel = formData.get("compressionLevel") as string
    const customQuality = formData.get("customQuality") as string
    const userId = formData.get("userId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Auto-detect fileType and format
    const { fileType, format } = getFileTypeAndFormat(file)

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        originalName: file.name,
        originalSize: file.size,
        fileType: fileType as any,
        format,
        compressionLevel,
        status: "PROCESSING",
        userId: userId || undefined,
      },
    })

    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare compression options
    let quality = 70;
    if (customQuality && !isNaN(Number(customQuality))) {
      quality = Number(customQuality);
    }

    // For video/audio, need to write to temp file
    let tempFilePath: string | undefined = undefined;
    if (fileType === "VIDEO" || fileType === "AUDIO") {
      tempFilePath = path.join(process.cwd(), "compressed_files", `${fileRecord.id}-input`);
    }

    // Compress file using the logic in compressFile
    const { compressedBuffer, compressedSize } = await compressFile({
      buffer,
      fileType,
      format,
      compressionLevel,
      quality,
      tempFilePath,
    });

    // Save the compressed file buffer to the database instead of the filesystem
    const updatedFile = await prisma.file.update({
      where: { id: fileRecord.id },
      data: {
        compressedSize,
        status: "COMPLETED",
        compressedUrl: `/api/download/${fileRecord.id}`,
        compressedData: compressedBuffer,
      },
    })

    return NextResponse.json({
      id: updatedFile.id,
      originalName: updatedFile.originalName,
      originalSize: updatedFile.originalSize,
      compressedSize: updatedFile.compressedSize,
      compressionRatio: Math.round(((updatedFile.originalSize - compressedSize) / updatedFile.originalSize) * 100),
      downloadUrl: updatedFile.compressedUrl,
      status: updatedFile.status,
    })
  } catch (error) {
    console.error("Compression error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const recentFiles = await prisma.file.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        originalName: true,
        originalSize: true,
        compressedSize: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json(recentFiles)
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

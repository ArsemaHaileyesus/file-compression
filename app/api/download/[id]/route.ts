import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  const id = params.id;
  try {
    const file = await prisma.file.findUnique({
      where: { id },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.status !== "COMPLETED") {
      return NextResponse.json({ error: "File not ready for download" }, { status: 400 })
    }

    if (!file.compressedData) {
      return NextResponse.json({ error: "Compressed file data not found" }, { status: 404 })
    }

    return new NextResponse(file.compressedData, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=\"${file.originalName}\"`
      }
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

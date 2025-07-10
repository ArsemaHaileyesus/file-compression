import sharp from "sharp"
import archiver from "archiver"
import zlib from "zlib"
import { PDFDocument } from "pdf-lib"
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import fs from "fs"
import path from "path"

export async function compressFile({
  buffer,
  fileType,
  format,
  compressionLevel,
  quality,
  tempFilePath,
}: {
  buffer: Buffer
  fileType: string
  format: string
  compressionLevel: string
  quality?: number
  tempFilePath?: string // for video/audio
}): Promise<{ compressedBuffer: Buffer; compressedSize: number }> {
  let compressedBuffer: Buffer = buffer;
  let compressedSize: number = buffer.length;

  // Images
  if (fileType === "IMAGE") {
    let img = sharp(buffer)
    const q = quality !== undefined ? quality : 40; // More aggressive default
    if (["JPEG", "JPG"].includes(format)) {
      img = img.jpeg({ quality: q, mozjpeg: true })
    } else if (format === "PNG") {
      img = img.png({ quality: q, compressionLevel: 9 })
    } else if (format === "WEBP") {
      img = img.webp({ quality: q })
    } else if (format === "AVIF") {
      img = img.avif({ quality: q })
    } else if (format === "GIF") {
      img = img.gif()
    }
    compressedBuffer = await img.toBuffer()
    compressedSize = compressedBuffer.length
  }

  // Documents
  else if (fileType === "DOCUMENT") {
    if (format === "PDF") {
      // pdf-lib does not compress images, but can remove metadata
      const pdfDoc = await PDFDocument.load(buffer)
      pdfDoc.setTitle("")
      pdfDoc.setAuthor("")
      pdfDoc.setSubject("")
      pdfDoc.setKeywords([])
      pdfDoc.setProducer("")
      pdfDoc.setCreator("")
      compressedBuffer = Buffer.from(await pdfDoc.save())
      compressedSize = compressedBuffer.length
    } else {
      // For DOCX, XLSX, etc., just gzip as fallback
      compressedBuffer = zlib.gzipSync(buffer)
      compressedSize = compressedBuffer.length
    }
  }

  // Archives
  else if (fileType === "ARCHIVE") {
    // Re-zip the file for demonstration (real archive optimization is complex)
    const archivePath = path.join(process.cwd(), "compressed_files", `temp-archive-${Date.now()}.zip`)
    await new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(archivePath)
      const archive = archiver("zip", { zlib: { level: 9 } })
      output.on("close", () => resolve())
      archive.on("error", reject)
      archive.pipe(output)
      archive.append(buffer, { name: `file.${format.toLowerCase()}` })
      archive.finalize()
    })
    compressedBuffer = fs.readFileSync(archivePath)
    fs.unlinkSync(archivePath)
    compressedSize = compressedBuffer.length
  }

  // Video/Audio
  else if ((fileType === "VIDEO" || fileType === "AUDIO") && tempFilePath) {
    // Save buffer to temp file
    const inputPath = tempFilePath
    const outputPath = inputPath + "-compressed.mp4"
    fs.writeFileSync(inputPath, buffer)
    // More aggressive: lower bitrate, allow scaling if quality is low
    const bitrate = quality && quality < 50 ? "400k" : "800k";
    const scale = quality && quality < 50 ? "-vf scale=iw/2:ih/2" : "";
    await new Promise((resolve, reject) => {
      let cmd = ffmpeg()
        .setFfmpegPath(ffmpegPath)
        .input(inputPath)
        .outputOptions([
          `-b:v ${bitrate}`,
          `-bufsize ${bitrate}`,
        ])
      if (scale) {
        cmd = cmd.outputOptions(scale)
      }
      cmd
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath)
    })
    compressedBuffer = fs.readFileSync(outputPath)
    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
    compressedSize = compressedBuffer.length
  }

  // Fallback: gzip
  else {
    compressedBuffer = zlib.gzipSync(buffer)
    compressedSize = compressedBuffer.length
  }

  // If compression made the file larger, keep the original
  if (compressedSize >= buffer.length) {
    return { compressedBuffer: buffer, compressedSize: buffer.length }
  }
  return { compressedBuffer, compressedSize }
} 
export interface CompressionOptions {
  fileType: string
  format: string
  compressionLevel: string
  quality?: number
}

export interface FileInfo {
  name: string
  size: number
  type: string
}

export const FILE_TYPES = {
  IMAGE: {
    label: "Images",
    formats: ["JPEG", "PNG", "WebP", "AVIF", "GIF"],
    accept: "image/*",
  },
  DOCUMENT: {
    label: "Documents",
    formats: ["PDF", "DOCX", "XLSX", "PPTX", "TXT"],
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
  },
  VIDEO: {
    label: "Videos",
    formats: ["MP4", "WebM", "AVI", "MOV"],
    accept: "video/*",
  },
  AUDIO: {
    label: "Audio",
    formats: ["MP3", "WAV", "AAC", "OGG"],
    accept: "audio/*",
  },
  ARCHIVE: {
    label: "Archives",
    formats: ["ZIP", "7Z", "RAR", "TAR"],
    accept: ".zip,.7z,.rar,.tar,.gz",
  },
} as const

export const COMPRESSION_LEVELS = [
  { value: "low", label: "Low (Fast)", quality: 85 },
  { value: "medium", label: "Medium (Balanced)", quality: 70 },
  { value: "high", label: "High (Best)", quality: 50 },
  { value: "maximum", label: "Maximum (Smallest)", quality: 30 },
] as const

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function calculateCompressionRatio(original: number, compressed: number): number {
  return Math.round(((original - compressed) / original) * 100)
}

export function getFileTypeAndFormat(file: File): { fileType: string; format: string } {
  const mime = file.type;
  const name = file.name.toLowerCase();

  if (mime.startsWith("image/")) {
    const ext = name.split('.').pop() || "";
    return { fileType: "IMAGE", format: ext.toUpperCase() };
  }
  if (mime.startsWith("video/")) {
    const ext = name.split('.').pop() || "";
    return { fileType: "VIDEO", format: ext.toUpperCase() };
  }
  if (mime.startsWith("audio/")) {
    const ext = name.split('.').pop() || "";
    return { fileType: "AUDIO", format: ext.toUpperCase() };
  }
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].some(e => name.endsWith("." + e))) {
    const ext = name.split('.').pop() || "";
    return { fileType: "DOCUMENT", format: ext.toUpperCase() };
  }
  if (["zip", "rar", "7z", "tar", "gz"].some(e => name.endsWith("." + e))) {
    const ext = name.split('.').pop() || "";
    return { fileType: "ARCHIVE", format: ext.toUpperCase() };
  }
  // Default fallback
  return { fileType: "DOCUMENT", format: "TXT" };
}

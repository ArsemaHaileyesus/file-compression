"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";import { Upload, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/compression";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
  maxSize?: number;
}

interface FileWithPreview extends File {
  preview?: string;
  progress?: number;
  status?: "uploading" | "completed" | "error";
}

export function FileUpload({
  onFilesSelected,
  acceptedTypes = "*",
  maxFiles = 10,
  maxSize = undefined, // No maximum file size
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
          progress: 100,
          status: "completed" as const,
        });
        return fileWithPreview;
      });

      setFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected(newFiles);
    },
    [onFilesSelected]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneActive,
  } = useDropzone({
    onDrop,
    accept: acceptedTypes === "*" ? undefined : { [acceptedTypes]: [] },
    maxFiles,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const removeFile = (fileName: string) => {
    setFiles((prev) => {
      const updated = prev.filter((file) => file.name !== fileName);
      const fileToRemove = prev.find((file) => file.name === fileName);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50",
          isDragActive || dropzoneActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <input {...getInputProps()} />
          <div
            className={cn(
              "rounded-full p-4 mb-4 transition-colors",
              isDragActive || dropzoneActive ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragActive || dropzoneActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <Button variant="outline" type="button">
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Max file size: {maxSize ? formatFileSize(maxSize) : "Unlimited"} •
            Max files: {maxFiles}
          </p>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          {files.map((file) => (
            <Card key={file.name + file.lastModified} className="p-3">
              <div className="flex items-center space-x-3">
                {file.preview ? (
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <File className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>

                  {file.status === "uploading" && (
                    <div className="mt-1">
                      <Progress value={file.progress || 0} className="h-1" />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {file.status === "completed" && (
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

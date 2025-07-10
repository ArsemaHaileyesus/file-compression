"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "./file-upload";
import { CompressionOptions } from "./compression-options";
import { useModal } from "./modal-provider";
import { useToast } from "@/hooks/use-toast";
import { Download, FileCheck, Loader2 } from "lucide-react";
import {
  formatFileSize,
  calculateCompressionRatio,
  getFileTypeAndFormat,
} from "@/lib/compression";

interface CompressionResult {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  downloadUrl: string;
  status: "completed" | "processing" | "error";
}

export function CompressionInterface() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [customQuality, setCustomQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<CompressionResult[]>([]);
  const [progress, setProgress] = useState(0);

  const { openModal } = useModal();
  const { toast } = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    // Auto-select compression settings based on first file
    if (newFiles.length > 0) {
      const { fileType, format } = getFileTypeAndFormat(newFiles[0]);
      // Optionally store for backend use if needed
    }
  };

  const handleOptionsChange = ({
    compressionLevel,
    customQuality,
  }: {
    compressionLevel: string;
    customQuality: number;
  }) => {
    setCompressionLevel(compressionLevel);
    setCustomQuality(customQuality);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to compress",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const newResults: CompressionResult[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 1) / files.length) * 100);
        const { fileType, format } = getFileTypeAndFormat(file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("compressionLevel", compressionLevel);
        formData.append("customQuality", String(customQuality));
        const response = await fetch("/api/compress", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        newResults.push({
          ...result,
          status: result.status === "COMPLETED" ? "completed" : "error",
        });
      }
      setResults(newResults);
      setProgress(100);
      toast({
        title: "Compression completed!",
        description: `Successfully compressed ${files.length} file(s)`,
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "An error occurred during compression",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setResults([]);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            File Compression Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFilesSelected={handleFilesSelected} />
          <CompressionOptions
            compressionLevel={compressionLevel}
            customQuality={customQuality}
            onOptionsChange={handleOptionsChange}
          />
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing files...</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleCompress}
              disabled={isProcessing || files.length === 0}
              style={{ width: "20%" }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                "Compress Files"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={clearFiles}
              disabled={isProcessing}
              style={{ width: "20%" }}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.slice(-3).map((result, idx) => (
                <div
                  key={result.id || idx}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{result.originalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(result.originalSize)} →{" "}
                      {formatFileSize(result.compressedSize)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {result.compressionRatio}% saved
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <a href={result.downloadUrl} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CompressionResultsModal({
  results,
}: {
  results: CompressionResult[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-1">
              <h4 className="font-medium">{result.originalName}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span>Original: {formatFileSize(result.originalSize)}</span>
                <span>Compressed: {formatFileSize(result.compressedSize)}</span>
                <Badge variant="secondary">
                  {result.compressionRatio}% reduction
                </Badge>
              </div>
            </div>
            <Button asChild size="sm">
              <a href={result.downloadUrl} download>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center pt-4 border-t">
        <Button className="w-full">Download All Files</Button>
      </div>
    </div>
  );
}

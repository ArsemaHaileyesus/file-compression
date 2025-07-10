"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { COMPRESSION_LEVELS } from "@/lib/compression";

interface CompressionOptionsProps {
  compressionLevel: string;
  customQuality: number;
  onOptionsChange: (options: {
    compressionLevel: string;
    customQuality: number;
  }) => void;
}

export function CompressionOptions({
  compressionLevel,
  customQuality,
  onOptionsChange,
}: CompressionOptionsProps) {
  const handleCompressionChange = (level: string) => {
    onOptionsChange({
      compressionLevel: level,
      customQuality,
    });
  };

  const handleCustomQualityChange = (value: number[]) => {
    onOptionsChange({
      compressionLevel,
      customQuality: value[0],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compression Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="compression">Compression Level</Label>
          <Select
            value={compressionLevel}
            onValueChange={handleCompressionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select compression level" />
            </SelectTrigger>
            <SelectContent>
              {COMPRESSION_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quality">Quality</Label>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[customQuality]}
            onValueChange={handleCustomQualityChange}
          />
          <div className="text-xs text-muted-foreground">{customQuality}%</div>
        </div>
      </CardContent>
    </Card>
  );
}

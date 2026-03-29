"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { VideoData } from "@/lib/youtube";
import { exportToCSV } from "@/lib/csv";

interface ExportButtonProps {
  videos: VideoData[];
  channelName: string;
}

export function ExportButton({ videos, channelName }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => exportToCSV(videos, channelName)}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}

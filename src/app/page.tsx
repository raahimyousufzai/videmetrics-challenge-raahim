"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChannelInput } from "@/components/ChannelInput";
import { ChannelHeader } from "@/components/ChannelHeader";
import { StatsCards } from "@/components/StatsCards";
import { VideoTable } from "@/components/VideoTable";
import { MetricsChart } from "@/components/MetricsChart";
import { ExportButton } from "@/components/ExportButton";
import { ChannelInfo, VideoData } from "@/lib/youtube";
import { BarChart3, Loader2 } from "lucide-react";

async function fetchChannel(url: string): Promise<ChannelInfo> {
  const res = await fetch(`/api/channel?url=${encodeURIComponent(url)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function fetchVideos(channelId: string): Promise<VideoData[]> {
  const res = await fetch(`/api/videos?channelId=${channelId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
];

export default function Home() {
  const [channelUrl, setChannelUrl] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const channelQuery = useQuery({
    queryKey: ["channel", channelUrl],
    queryFn: () => fetchChannel(channelUrl),
    enabled: !!channelUrl,
  });

  const videosQuery = useQuery({
    queryKey: ["videos", channelQuery.data?.id],
    queryFn: () => fetchVideos(channelQuery.data!.id),
    enabled: !!channelQuery.data?.id,
  });

  const isLoading = channelQuery.isFetching || videosQuery.isFetching;
  const error = channelQuery.error || videosQuery.error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">VidMetrics</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        {!channelQuery.data && (
          <div className="text-center space-y-4 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              YouTube Channel
              <span className="text-primary"> Analytics</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Paste any YouTube channel URL to instantly analyze video
              performance, engagement trends, and content strategy.
            </p>
          </div>
        )}

        {/* Search */}
        <ChannelInput onSubmit={setChannelUrl} isLoading={isLoading} />

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm text-center">
            {(error as Error).message}
          </div>
        )}

        {/* Loading */}
        {isLoading && !videosQuery.data && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Fetching channel data...
            </span>
          </div>
        )}

        {/* Results */}
        {channelQuery.data && videosQuery.data && (
          <div className="space-y-6">
            <ChannelHeader channel={channelQuery.data} />

            <StatsCards videos={videosQuery.data} />

            {/* Filters & Export */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex rounded-md border overflow-hidden">
                {DATE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setDateFilter(f.value)}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      dateFilter === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <ExportButton
                videos={videosQuery.data}
                channelName={channelQuery.data.title}
              />
            </div>

            <MetricsChart videos={videosQuery.data} dateFilter={dateFilter} />

            <VideoTable videos={videosQuery.data} dateFilter={dateFilter} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 text-center text-sm text-muted-foreground">
        VidMetrics — YouTube Competitor Analysis Tool
      </footer>
    </div>
  );
}

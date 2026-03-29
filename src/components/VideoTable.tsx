"use client";

import { useState, useMemo, useEffect } from "react";
import { VideoData } from "@/lib/youtube";
import { formatNumber, formatDate } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SortKey = "views" | "likes" | "comments" | "publishedAt";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

interface VideoTableProps {
  videos: VideoData[];
  dateFilter: string;
}

export function VideoTable({ videos, dateFilter }: VideoTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filteredVideos = useMemo(() => {
    const now = new Date();
    let cutoff: Date;

    switch (dateFilter) {
      case "7d":
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return videos;
    }

    return videos.filter((v) => new Date(v.publishedAt) >= cutoff);
  }, [videos, dateFilter]);

  const avgViews = useMemo(() => {
    if (!filteredVideos.length) return 0;
    return filteredVideos.reduce((sum, v) => sum + v.views, 0) / filteredVideos.length;
  }, [filteredVideos]);

  const sorted = useMemo(() => {
    return [...filteredVideos].sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortKey === "publishedAt") {
        aVal = new Date(a.publishedAt).getTime();
        bVal = new Date(b.publishedAt).getTime();
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [filteredVideos, sortKey, sortDir]);

  // Reset page when filters or sort changes
  useEffect(() => {
    setPage(0);
  }, [dateFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginatedVideos = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "desc" ? (
      <ArrowDown className="h-3.5 w-3.5" />
    ) : (
      <ArrowUp className="h-3.5 w-3.5" />
    );
  };

  if (!sorted.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No videos found for this time period.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Video</th>
              <th
                className="text-right p-3 font-medium cursor-pointer select-none hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("views")}
              >
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> Views <SortIcon col="views" />
                </span>
              </th>
              <th
                className="text-right p-3 font-medium cursor-pointer select-none hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("likes")}
              >
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" /> Likes <SortIcon col="likes" />
                </span>
              </th>
              <th
                className="text-right p-3 font-medium cursor-pointer select-none hover:bg-muted/80 transition-colors hidden sm:table-cell"
                onClick={() => toggleSort("comments")}
              >
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> Comments{" "}
                  <SortIcon col="comments" />
                </span>
              </th>
              <th
                className="text-right p-3 font-medium cursor-pointer select-none hover:bg-muted/80 transition-colors hidden md:table-cell"
                onClick={() => toggleSort("publishedAt")}
              >
                <span className="inline-flex items-center gap-1">
                  Date <SortIcon col="publishedAt" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedVideos.map((video) => (
              <tr
                key={video.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <img
                        src={video.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-28 h-16 object-cover rounded hidden sm:block"
                      />
                    </a>
                    <div className="min-w-0">
                      <a
                        href={`https://youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary line-clamp-2 transition-colors"
                      >
                        {video.title}
                      </a>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground md:hidden">
                          {formatDate(video.publishedAt)}
                        </span>
                        {video.views > avgViews * 1.5 && (
                          <Badge variant="success" className="gap-1">
                            <TrendingUp className="h-3 w-3" /> Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-right font-mono tabular-nums">
                  {formatNumber(video.views)}
                </td>
                <td className="p-3 text-right font-mono tabular-nums">
                  {formatNumber(video.likes)}
                </td>
                <td className="p-3 text-right font-mono tabular-nums hidden sm:table-cell">
                  {formatNumber(video.comments)}
                </td>
                <td className="p-3 text-right text-muted-foreground hidden md:table-cell">
                  {formatDate(video.publishedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length} videos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

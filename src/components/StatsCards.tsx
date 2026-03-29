"use client";

import { useMemo } from "react";
import { VideoData } from "@/lib/youtube";
import { formatNumber } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Eye, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  videos: VideoData[];
}

export function StatsCards({ videos }: StatsCardsProps) {
  const stats = useMemo(() => {
    const totalViews = videos.reduce((s, v) => s + v.views, 0);
    const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
    const totalComments = videos.reduce((s, v) => s + v.comments, 0);
    const avgViews = videos.length ? totalViews / videos.length : 0;
    const engagementRate = totalViews
      ? ((totalLikes + totalComments) / totalViews) * 100
      : 0;

    return { totalViews, totalLikes, totalComments, avgViews, engagementRate };
  }, [videos]);

  const cards = [
    {
      label: "Total Views",
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg Views",
      value: formatNumber(Math.round(stats.avgViews)),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Likes",
      value: formatNumber(stats.totalLikes),
      icon: ThumbsUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Engagement Rate",
      value: stats.engagementRate.toFixed(2) + "%",
      icon: MessageSquare,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { VideoData } from "@/lib/youtube";
import { formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricsChartProps {
  videos: VideoData[];
  dateFilter: string;
}

type Metric = "views" | "likes" | "comments";
type ChartType = "bar" | "line";

export function MetricsChart({ videos, dateFilter }: MetricsChartProps) {
  const [metric, setMetric] = useState<Metric>("views");
  const [chartType, setChartType] = useState<ChartType>("bar");

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

  const chartData = useMemo(() => {
    return [...filteredVideos]
      .sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
      .slice(-20)
      .map((v) => ({
        name:
          v.title.length > 18 ? v.title.substring(0, 18) + "…" : v.title,
        views: v.views,
        likes: v.likes,
        comments: v.comments,
      }));
  }, [filteredVideos]);

  const avgValue = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((s, d) => s + d[metric], 0) / chartData.length;
  }, [chartData, metric]);

  if (!chartData.length) return null;

  const color =
    metric === "views"
      ? "hsl(221, 83%, 53%)"
      : metric === "likes"
      ? "hsl(142, 71%, 45%)"
      : "hsl(262, 83%, 58%)";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg">Performance Overview</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <div className="flex rounded-md border overflow-hidden">
              {(["views", "likes", "comments"] as Metric[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    metric === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex rounded-md border overflow-hidden">
              {(["bar", "line"] as ChartType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    chartType === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Avg {metric}: {formatNumber(Math.round(avgValue))} · Showing last{" "}
          {chartData.length} videos
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    metric.charAt(0).toUpperCase() + metric.slice(1),
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(214, 32%, 91%)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey={metric} fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    metric.charAt(0).toUpperCase() + metric.slice(1),
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(214, 32%, 91%)",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={metric}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 3 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

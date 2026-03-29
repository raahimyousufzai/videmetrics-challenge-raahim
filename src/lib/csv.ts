import { VideoData } from "./youtube";

export function exportToCSV(videos: VideoData[], channelName: string) {
  const headers = [
    "Title",
    "Views",
    "Likes",
    "Comments",
    "Published Date",
    "Video URL",
  ];

  const rows = videos.map((v) => [
    `"${v.title.replace(/"/g, '""')}"`,
    v.views,
    v.likes,
    v.comments,
    new Date(v.publishedAt).toLocaleDateString(),
    `https://youtube.com/watch?v=${v.id}`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${channelName.replace(/\s+/g, "_")}_videos.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

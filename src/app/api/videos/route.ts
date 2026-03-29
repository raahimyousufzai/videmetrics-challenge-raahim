import { NextRequest, NextResponse } from "next/server";
import { fetchChannelVideos } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId");
  if (!channelId) {
    return NextResponse.json(
      { error: "channelId is required" },
      { status: 400 }
    );
  }

  try {
    const videos = await fetchChannelVideos(channelId);
    return NextResponse.json(videos);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch videos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

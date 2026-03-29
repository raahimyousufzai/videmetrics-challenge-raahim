import { NextRequest, NextResponse } from "next/server";
import { extractChannelIdentifier, resolveChannelId } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const identifier = extractChannelIdentifier(url);
    if (!identifier) {
      return NextResponse.json(
        { error: "Invalid YouTube channel URL" },
        { status: 400 }
      );
    }
    const channel = await resolveChannelId(identifier);
    return NextResponse.json(channel);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to resolve channel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

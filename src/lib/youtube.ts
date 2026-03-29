const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
}

interface YTApiResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      channelId?: string;
      publishedAt: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
      };
    };
    statistics?: {
      subscriberCount?: string;
      videoCount?: string;
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
    contentDetails?: {
      relatedPlaylists?: { uploads: string };
      videoId?: string;
      duration?: string;
    };
  }>;
  nextPageToken?: string;
  error?: { message: string };
}

async function ytFetch(endpoint: string, params: Record<string, string>): Promise<YTApiResponse> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("key", API_KEY!);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "YouTube API error");
  }
  return res.json();
}

export function extractChannelIdentifier(url: string): {
  type: "id" | "username" | "handle" | "custom";
  value: string;
} | null {
  const trimmed = url.trim();

  // Direct channel ID
  const channelIdMatch = trimmed.match(
    /(?:youtube\.com\/channel\/|^)(UC[\w-]{22})(?:[/?]|$)/
  );
  if (channelIdMatch) return { type: "id", value: channelIdMatch[1] };

  // Handle format: @username
  const handleMatch = trimmed.match(
    /(?:youtube\.com\/)(@[\w.-]+)(?:[/?]|$)/
  );
  if (handleMatch) return { type: "handle", value: handleMatch[1] };

  // /c/customname or /user/username
  const customMatch = trimmed.match(
    /youtube\.com\/(?:c|user)\/([\w.-]+)(?:[/?]|$)/
  );
  if (customMatch) return { type: "custom", value: customMatch[1] };

  // Plain handle input like @mkbhd
  if (trimmed.startsWith("@"))
    return { type: "handle", value: trimmed };

  return null;
}

export async function resolveChannelId(
  identifier: ReturnType<typeof extractChannelIdentifier>
): Promise<ChannelInfo> {
  if (!identifier) throw new Error("Invalid channel URL");

  let data: YTApiResponse;

  if (identifier.type === "id") {
    data = await ytFetch("channels", {
      part: "snippet,statistics",
      id: identifier.value,
    });
  } else if (identifier.type === "handle") {
    data = await ytFetch("channels", {
      part: "snippet,statistics",
      forHandle: identifier.value.replace("@", ""),
    });
  } else {
    // custom or username — search for it
    const searchData = await ytFetch("search", {
      part: "snippet",
      q: identifier.value,
      type: "channel",
      maxResults: "1",
    });
    if (searchData.items?.length) {
      const channelId = searchData.items[0].snippet.channelId!;
      data = await ytFetch("channels", {
        part: "snippet,statistics",
        id: channelId,
      });
    } else {
      data = searchData;
    }
  }

  if (!data.items?.length) throw new Error("Channel not found");

  const ch = data.items[0];
  return {
    id: ch.id,
    title: ch.snippet.title,
    description: ch.snippet.description,
    thumbnail:
      ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url || "",
    subscriberCount: ch.statistics?.subscriberCount || "0",
    videoCount: ch.statistics?.videoCount || "0",
  };
}

export async function fetchChannelVideos(
  channelId: string,
  maxTotal = 500
): Promise<VideoData[]> {
  // Get uploads playlist ID
  const channelData = await ytFetch("channels", {
    part: "contentDetails",
    id: channelId,
  });

  const uploadsPlaylistId =
    channelData.items![0].contentDetails!.relatedPlaylists!.uploads;

  // Paginate through all playlist items
  const allVideoIds: string[] = [];
  let pageToken: string | undefined;

  while (allVideoIds.length < maxTotal) {
    const params: Record<string, string> = {
      part: "contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
    };
    if (pageToken) params.pageToken = pageToken;

    const playlistData = await ytFetch("playlistItems", params);

    const ids = playlistData.items?.map((item) => item.contentDetails!.videoId!) || [];
    allVideoIds.push(...ids);

    pageToken = playlistData.nextPageToken;
    if (!pageToken) break;
  }

  const videoIds = allVideoIds.slice(0, maxTotal);
  if (!videoIds.length) return [];

  // Fetch video statistics in batches of 50 (API limit per request)
  const allVideos: VideoData[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50).join(",");
    const videoData = await ytFetch("videos", {
      part: "snippet,statistics,contentDetails",
      id: batch,
    });

    const videos = videoData.items!.map((video) => ({
      id: video.id,
      title: video.snippet.title,
      thumbnail:
        video.snippet.thumbnails?.medium?.url ||
        video.snippet.thumbnails?.default?.url || "",
      publishedAt: video.snippet.publishedAt,
      views: parseInt(video.statistics?.viewCount || "0"),
      likes: parseInt(video.statistics?.likeCount || "0"),
      comments: parseInt(video.statistics?.commentCount || "0"),
      duration: video.contentDetails?.duration || "",
    }));
    allVideos.push(...videos);
  }

  return allVideos;
}

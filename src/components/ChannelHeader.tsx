"use client";

import { ChannelInfo } from "@/lib/youtube";
import { formatNumber } from "@/lib/utils";
import { Users, Video } from "lucide-react";

interface ChannelHeaderProps {
  channel: ChannelInfo;
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
      {channel.thumbnail ? (
        <img
          src={channel.thumbnail}
          alt={channel.title}
          referrerPolicy="no-referrer"
          className="w-16 h-16 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
          {channel.title.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold truncate">{channel.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {channel.description}
        </p>
      </div>
      <div className="flex gap-6 text-sm shrink-0">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="font-semibold text-foreground">
            {formatNumber(parseInt(channel.subscriberCount))}
          </span>
          <span className="hidden sm:inline">subscribers</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Video className="h-4 w-4" />
          <span className="font-semibold text-foreground">
            {formatNumber(parseInt(channel.videoCount))}
          </span>
          <span className="hidden sm:inline">videos</span>
        </div>
      </div>
    </div>
  );
}

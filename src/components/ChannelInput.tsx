"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChannelInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function ChannelInput({ onSubmit, isLoading }: ChannelInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a YouTube channel URL");
      return;
    }

    const isValid =
      trimmed.includes("youtube.com/") ||
      trimmed.includes("youtu.be/") ||
      trimmed.startsWith("@") ||
      trimmed.startsWith("UC");

    if (!isValid) {
      setError(
        "Please enter a valid YouTube channel URL (e.g., youtube.com/@mkbhd)"
      );
      return;
    }

    setError("");
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste YouTube channel URL (e.g., youtube.com/@mkbhd)"
            className="pl-10 h-12 text-base"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </form>
  );
}

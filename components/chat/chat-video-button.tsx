"use client";

import { usePathname, useRouter } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useState } from "react";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isVideo, setIsVideo] = useState(false);

  const onClick = () => {
    const newVideoId = isVideo ? "no_call" : "user_call";

    if (pathname) {
      const parts = pathname.split("/");

      const videoIndex = parts.indexOf("video");

      if (videoIndex !== -1 && videoIndex < parts.length - 1) {
        parts[videoIndex + 1] = newVideoId;
      }

      const newUrl = parts.join("/");
      router.push(newUrl);
      setIsVideo(!isVideo);
    }
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

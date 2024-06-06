import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";

import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  children?: React.ReactNode;
  showMenu?: boolean;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  showMenu = true,
  children,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold xl:px-12 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b">
      {showMenu && <MobileToggle serverId={serverId}>{children}</MobileToggle>}
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {/* {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )} */}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
      </div>
    </div>
  );
};

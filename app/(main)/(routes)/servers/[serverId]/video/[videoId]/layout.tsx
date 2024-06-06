import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";
import LatestNews from "@/components/news/latest-news";
import Scanner from "@/components/scanner/scanner";
import Watchlist from "@/components/watchlist/watchlist";

import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";
import { MediaRoom } from "@/components/media-room";
import { Copyright } from "lucide-react";
import ClientSidebar from "@/components/client-sidebar";
import ClientVideo from "@/components/client-video";

interface VideoIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
    videoId: string;
    memberId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const VideoIdLayout = async ({
  children,
  params,
  searchParams,
}: VideoIdLayoutProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  const channel = await db.channel.findUnique({
    where: {
      id: params.videoId,
    },
  });

  if (!server) {
    return redirect("/");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  const conversation = await getOrCreateConversation(
    currentMember!.id,
    params.memberId
  );

  return (
    <div className=" h-full w-full flex">
      <ClientSidebar>
        <ServerSidebar serverId={params.serverId}>{children}</ServerSidebar>
      </ClientSidebar>

      <ClientVideo>
        <div className="flex h-full min-h-screen max-h-screen overflow-hidden ">
          <div className="flex flex-1 flex-col h-full w-full ">
            <div className="bg-white dark:bg-[#313338] flex flex-col justify-center-center h-3/5">
              {params.videoId === "user_call" ? (
                <div className="h-full w-full">
                  <ChatHeader
                    name={""}
                    serverId={params.serverId}
                    type="channel"
                  />
                  <div className="h-[calc(100%-3rem)]">
                    <MediaRoom
                      chatId={conversation!.id}
                      video={true}
                      audio={true}
                      member={currentMember}
                    />
                  </div>
                </div>
              ) : channel ? (
                <div className="h-full w-full">
                  <ChatHeader
                    name={channel.name}
                    serverId={channel.serverId}
                    type="channel"
                  >
                    {children}
                  </ChatHeader>
                  <div className="h-[calc(100%-3rem)]">
                    <MediaRoom
                      member={currentMember}
                      chatId={channel.id}
                      video={true}
                      audio={true}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <ChatHeader
                    name={""}
                    serverId={params.serverId}
                    type="channel"
                  >
                    {children}
                  </ChatHeader>
                  <div className="h-full w-full flex items-center justify-center">
                    Channel Disconnected
                  </div>
                </>
              )}
            </div>
            <div className="w-full h-2/5 border-t">
              <div className="h-[calc(100%-2rem)]">
                <LatestNews />
              </div>
              <div className="h-8 flex items-center justify-center z-10 border-t space-x-3">
                <Copyright />
                <h1>Powered by ezsolution pro and pioneer associate </h1>
              </div>
            </div>
          </div>
          <div className="2xl:w-72 w-52 flex flex-col h-full border-l">
            <div className="h-3/5">
              <Scanner title="NYSE Screener" exchange="NYSE" />
              <Scanner title="NASDAQ Screener" exchange="NASDAQ" />
            </div>
            <div className="h-2/5">
              <Watchlist />
            </div>
          </div>
        </div>
      </ClientVideo>
    </div>
  );
};

export default VideoIdLayout;

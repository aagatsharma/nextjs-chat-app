import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { db } from "@/lib/db";
import LatestNews from "@/components/news/latest-news";
import Scanner from "@/components/scanner/scanner";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  const memberList = await db.member.findMany({
    where: {
      serverId: params.serverId,
    },
  });

  const members = memberList.filter(
    (member) => member.profileId !== profile.id
  );
  const profileIds = members.map((member) => member.profileId);
  // gives array of other users name except current users
  const userList = (
    await db.profile.findMany({
      where: {
        id: {
          in: profileIds,
        },
      },
    })
  ).map((user) => user.name);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-1 flex-col h-full border-b ">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        showMenu={false}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            userList={userList}
          />
        </>
      )}
    </div>
  );
};

export default ChannelIdPage;

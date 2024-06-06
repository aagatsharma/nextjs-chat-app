import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "../chat/chat-header";
import { ChatMessages } from "../chat/chat-messages";
import { ChatInput } from "../chat/chat-input";

const AdminChat = async ({ serverId }: { serverId: any }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "Admin Alert",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (!initialChannel) {
    // return null;
    return (
      <div className="flex items-center justify-center">
        <h1>
          Create Admin Alert channel from database or create new server to get
          Admin Alert Channel
        </h1>
      </div>
    );
  }

  const channel = await db.channel.findUnique({
    where: {
      id: initialChannel?.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-1 flex-col h-full border-b ">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        showMenu={false}
        type="channel"
      />

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
      {member.role === "ADMIN" && (
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      )}
    </div>
  );
};

export default AdminChat;

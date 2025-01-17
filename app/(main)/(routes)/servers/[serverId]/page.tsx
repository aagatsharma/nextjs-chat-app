import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("sign-in");
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
    include: {
      channels: {
        where: {
          name: "general",
          type: "TEXT",
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const videoServer = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          type: "VIDEO",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];
  const initialVideoChannel = videoServer?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(
    `/servers/${params.serverId}/video/${initialVideoChannel?.id}/channels/${initialChannel?.id}`
  );
};

export default ServerIdPage;

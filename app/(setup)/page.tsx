import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import UserButton from "@/components/user-button";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  if (profile.role === "ADMIN") {
    return <InitialModal />;
  }

  return (
    <div className="flex items-center h-full w-full justify-center">
      <div>
        <h1>Login as Admin or join via link</h1>
        <UserButton />
      </div>
    </div>
  );
};

export default SetupPage;

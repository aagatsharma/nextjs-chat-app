"use client";

import { Avatar } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LogOut } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import UseUser from "@/hooks/use-user";
import { useRouter } from "next/navigation";

const UserButton = () => {
  const router = useRouter();
  const user = UseUser();
  if (!user) {
    return null;
  }

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" })
      .then()
      .finally(() => {
        router.refresh();
      });
  };

  return (
    <Popover>
      <PopoverTrigger className="flex hover:bg-slate-100 dark:hover:bg-slate-900 items-center justify-center rounded-md ring-gray-300">
        <Avatar
          className={"h-7 flex items-center justify-center w-7 md:h-10 md:w-10"}
        >
          <AvatarImage src={user.imageUrl!} />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <div
          onClick={logout}
          className=" p-2 dark:hover:bg-slate-800 hover:bg-slate-200  rounded-sm cursor-pointer flex gap-x-4"
        >
          <LogOut /> Logout
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserButton;

"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useCollapsibleSidebar } from "@/hooks/use-collapsible-sidebar";

const ClientVideo = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useCollapsibleSidebar();
  return (
    <main className={`h-full ${isOpen ? "xl:pl-72" : ""} w-full`}>
      <div className="absolute top-1 max-xl:hidden">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={isOpen ? onClose : onOpen}
        >
          <Menu />
        </Button>
      </div>
      {children}
    </main>
  );
};

export default ClientVideo;

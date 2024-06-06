"use client";

import { useCollapsibleSidebar } from "@/hooks/use-collapsible-sidebar";

const ClientSidebar = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useCollapsibleSidebar();
  return (
    <div
      className={`max-xl:hidden ${
        isOpen ? "xl:flex" : "xl:hidden"
      } h-full w-72 z-20 flex-col fixed inset-y-0 border-r`}
    >
      {children}
    </div>
  );
};

export default ClientSidebar;

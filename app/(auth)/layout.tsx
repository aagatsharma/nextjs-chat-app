"use client";
import UseUser from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const currentUser = UseUser();
  useEffect(() => {
    if (currentUser) {
      redirect("/");
    }
  }, [currentUser]);
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;

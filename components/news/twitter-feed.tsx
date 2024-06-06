"use client";
import { Loader2, LoaderIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Timeline } from "react-twitter-widgets";
import { ScrollArea } from "../ui/scroll-area";

const UserTwitter = ({ userName }: { userName: string }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  return (
    <ScrollArea className="h-[calc(100%-3rem)] w-80 border ">
      <div className=" w-full flex flex-col gap-4">
        {loading && (
          <div className="flex ">
            <h1>Getting {userName} twitter</h1>
            <Loader2 className="animate-spin" />
          </div>
        )}
        <Timeline
          onLoad={() => {
            setLoading(false);
          }}
          dataSource={{ sourceType: "profile", screenName: `${userName}` }}
          options={{
            theme: theme,
            chrome: "noheader, nofooter, noborders",
            width: "full",
            height: "full",
          }}
          renderError={(_err) => {
            setLoading(false);
            return <p>Could not load timeline</p>;
          }}
        />
      </div>
    </ScrollArea>
  );
};

const TwitterFeed = () => {
  return (
    <div className="h-full">
      <div className="h-full overflow-scroll space-y-2">
        {/* <UserTwitter userName="OjeshUpreti" /> */}
        <UserTwitter userName="deitaone" />
        <UserTwitter userName="kobeissiletter" />
      </div>
    </div>
  );
};

export default TwitterFeed;

"use client";

import { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  GridLayout,
  LiveKitRoom,
  ParticipantLoop,
  ParticipantName,
  VideoConference,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
// import { useUser } from "@clerk/nextjs";
import { Loader2, Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Participant from "./participant";
import { RemoteParticipant } from "livekit-client";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  member: {
    profile: {
      name: string | null;
    };
  } | null;
}

export const MediaRoom = ({ chatId, video, audio, member }: MediaRoomProps) => {
  // const { user } = useUser();

  const [token, setToken] = useState("");
  const [join, setJoin] = useState(false);

  useEffect(() => {
    const name = member?.profile.name || "user";

    if (join) {
      (async () => {
        try {
          const resp = await fetch(
            `/api/livekit?room=${chatId}&username=${name}`
          );
          const data = await resp.json();
          setToken(data.token);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [chatId, member, join]);

  const handle = useFullScreenHandle();
  const [showMax, setShowMax] = useState(true);

  return (
    <>
      {join ? (
        token === "" ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Loading...
            </p>
          </div>
        ) : (
          <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={false}
            audio={false}

            // screen={true} //to share screen by default
          >
            <FullScreen handle={handle} className="h-full relative">
              <Participant />
              <VideoConference />

              {handle.active ? (
                <Button
                  className="absolute bottom-4 left-20"
                  size={"icon"}
                  onClick={handle.exit}
                >
                  <Minimize />
                </Button>
              ) : (
                <Button
                  className="absolute bottom-4 left-20"
                  size={"icon"}
                  onClick={handle.enter}
                >
                  <Maximize />
                </Button>
              )}
            </FullScreen>
          </LiveKitRoom>
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Button onClick={() => setJoin(true)}>Join Video call</Button>
        </div>
      )}
    </>
  );
};

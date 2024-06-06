"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UseUser from "@/hooks/use-user";
import { Input } from "../ui/input";

export function WatchlistInput() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const user = UseUser();

  const addWatchlist = () => {
    axios
      .post(`/api/watchlist/`, {
        userId: user?.id,
        symbol: value,
      })
      .then(() => {
        toast.success("Added to watchlist");
        router.refresh();
      })
      .catch((err) =>
        toast.error(err.response.data.message || "Something went wrong")
      );

    setValue("");
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <Input
        type="text"
        placeholder="Symbols"
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        value={value.toUpperCase()}
      />
      <Button
        type="submit"
        size={"icon"}
        variant={"ghost"}
        onClick={addWatchlist}
      >
        <Plus />
      </Button>
    </div>
  );
}

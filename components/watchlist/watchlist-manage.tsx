"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

interface WatchlistArray {
  id: number;
  userId: string;
  symbol: string;
}

interface WatchlistManage {
  watchlist: WatchlistArray[];
}

const WatchListManage = ({ watchlist }: WatchlistManage) => {
  const router = useRouter();
  const handleDeleteWatchlist = (id: Number) => {
    axios
      .delete(`/api/watchlist/${id}`)
      .then((res) => {
        toast.success(res.data.message);
        router.refresh();
      })
      .catch((err) =>
        toast.error(err.response.data.message || "Something went wrong")
      );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Manage</Button>
      </DialogTrigger>
      <DialogContent className="h-96 w-96">
        <DialogHeader className="h-full">
          <DialogTitle>Manage your watchlist</DialogTitle>
          <ScrollArea className="h-72 w-full">
            <DialogDescription className="flex flex-wrap pt-4 w-full gap-4">
              {watchlist.length !== 0 ? (
                watchlist.map((watch) => (
                  <Button
                    key={watch.id}
                    className="flex items-center justify-between space-x-2"
                    onClick={() => handleDeleteWatchlist(watch.id)}
                  >
                    <h1>{watch.symbol.toUpperCase()}</h1>
                    <X className="h-3 w-3 " />
                  </Button>
                ))
              ) : (
                <h1>No any symbols added to watchlist..</h1>
              )}
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WatchListManage;

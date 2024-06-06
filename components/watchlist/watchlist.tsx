import getCurrentUser from "@/actions/getCurrentUser";
import WatchListCards from "./watchlist-cards";
import { WatchlistInput } from "./watchlist-input";
import { db as prisma } from "@/lib/db";
import WatchListManage from "./watchlist-manage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WatchlistCharts from "./watchlist-charts";
import { ScrollArea } from "../ui/scroll-area";

const Watchlist = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const watchlist = await prisma.watchList.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <Tabs
      defaultValue="charts"
      className="w-full h-full flex flex-col items-center p-2"
    >
      <TabsList className="w-full z-50">
        <TabsTrigger value="watchlist" className="w-full">
          Watchlist
        </TabsTrigger>
        <TabsTrigger value="charts" className="w-full">
          Charts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="watchlist" className="w-full h-[calc(100%-8rem)] ">
        {/* <div className="h-full w-full z-50 border-t pb-24"> */}
        <div className="flex items-center justify-between">
          <h1>WatchList</h1>

          <WatchListManage watchlist={watchlist} />
        </div>
        <WatchlistInput />

        <ScrollArea className="flex flex-col h-full border-t ">
          {watchlist &&
            watchlist.map((watchlistitem) => (
              <WatchListCards
                key={watchlistitem.id}
                id={watchlistitem.id}
                symbol={watchlistitem.symbol}
              />
            ))}
        </ScrollArea>
        {/* </div> */}
      </TabsContent>
      <TabsContent value="charts" className="h-full w-full">
        <WatchlistCharts />
      </TabsContent>
    </Tabs>
  );
};

export default Watchlist;

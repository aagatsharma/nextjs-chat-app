"use client";
import dynamic from "next/dynamic";
import { ScrollArea } from "../ui/scroll-area";
import { useTheme } from "next-themes";

const MarketOverview = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.StockMarket),
  {
    ssr: false,
  }
);

const Scanner = ({
  title,
  exchange,
}: {
  title: string;
  exchange: "NYSE" | "NASDAQ";
}) => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-1/2 py-2 ">
      <div className="py-2 border-b">
        <h1 className="text-center font-bold">{title}</h1>
      </div>
      <ScrollArea className="h-full pb-8">
        <MarketOverview
          exchange={exchange}
          showFloatingTooltip={false}
          showChart={false}
          width={"auto"}
          colorTheme={theme === "dark" ? "dark" : "light"}
        />
      </ScrollArea>
    </div>
  );
};

export default Scanner;

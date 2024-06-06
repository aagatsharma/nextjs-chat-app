"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

interface WatchListCardsProps {
  symbol: string;
  id: number;
}
const SingleTicker = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.SingleTicker),
  {
    ssr: false,
  }
);

const WatchListCards = ({ symbol }: WatchListCardsProps) => {
  const { theme } = useTheme();

  return (
    <SingleTicker
      symbol={symbol}
      autosize
      colorTheme={theme === "dark" ? "dark" : "light"}
    />
  );
};

export default WatchListCards;

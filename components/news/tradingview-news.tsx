"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const Timeline = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.Timeline),
  {
    ssr: false,
  }
);

const TradingViewNews = () => {
  const { theme } = useTheme();
  return (
    // <div className="h-[calc(100%-2rem)] w-80">
    <Timeline
      displayMode="regular"
      autosize
      colorTheme={theme === "dark" ? "dark" : "light"}
    />
    // </div>
  );
};

export default TradingViewNews;

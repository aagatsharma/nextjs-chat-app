"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const AdvancedRealTimeChart = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
  }
);

const WatchlistCharts = () => {
  const { theme } = useTheme();
  return (
    <AdvancedRealTimeChart
      autosize
      hide_side_toolbar
      hide_legend
      theme={theme === "dark" ? "dark" : "light"}
      //   symbol="TSLA"
    />
  );
};

export default WatchlistCharts;

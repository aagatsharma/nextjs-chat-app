import { extract } from "@extractus/feed-extractor";
import NewsFeed from "./news-feed";
import TwitterFeed from "./twitter-feed";
import TradingViewNews from "./tradingview-news";

interface NewsFeed {
  id: string;
  title: string;
  link: string;
  published: string;
  description: string;
}

const LatestNews = async () => {
  let yahooResult: any;
  let benzingaResult: any;

  try {
    // yahooResult = await extract("https://finance.yahoo.com/news/rssindex");
    benzingaResult = await extract("https://www.benzinga.com/news/feed");
  } catch (err) {
    console.log(err);
  }

  return (
    <>
      <div className="flex gap-2 h-full">
        {/* {yahooResult ? (
          <NewsFeed news={yahooResult.entries} title="Yahoo News" />
        ) : (
          <h1>{`Can't fetch Yahoo data`}</h1>
        )} */}
        {benzingaResult ? (
          <NewsFeed news={benzingaResult.entries} title="Benzinga News" />
        ) : (
          <h1>{`Can't fetch Benzinga data`}</h1>
        )}
        <TwitterFeed />
        <TradingViewNews />
      </div>
    </>
  );
};

export default LatestNews;

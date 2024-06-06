import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

interface NewsDataProps {
  news: NewsFeedProps[];
  title: string;
}

interface NewsFeedProps {
  id: string;
  title: string;
  link: string;
  published: string;
  description: string;
}

const NewsFeed = ({ news, title }: NewsDataProps) => {
  return (
    <div className="h-full">
      <ScrollArea className="h-full w-80 border">
        <div className="p-4 w-full flex flex-col gap-4">
          <h1 className="text-lg font-bold">{title}</h1>
          {news.map((data, index) => (
            <div key={index} className="flex flex-col">
              <Link
                href={data.link}
                className="font-bold break-words overflow-wrap hover:underline"
                target="_blank"
              >
                {data.title}
              </Link>
              <h2 className="text-sm">{data.description}</h2>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewsFeed;

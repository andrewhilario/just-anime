"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const Header = (props: Props) => {
  const { data: anime, isLoading } = useQuery({
    queryKey: ["anime"],
    queryFn: async () => {
      const response = await fetch(
        "https://consumet-api-org.vercel.app/meta/anilist/random-anime",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        // const random = Math.floor(Math.random() * data.results.length);
        // data.results = data.results[random];

        // return data.results;
        return data;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="w-full h-[92.2vh] relative">
        <Skeleton className="w-full h-full bg-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-[92.2vh] relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={anime?.cover}
          alt="Just Anime"
          width={1080}
          height={2048}
          className="w-full h-full object-cover "
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent px-[10rem]">
        <div className="w-1/2 h-full flex flex-col items-start justify-start pb-[15rem]">
          <h1 className="text-7xl font-bold text-white mb-10 mt-auto ">
            {anime?.title?.romaji}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <a
              href={`${anime.id}/watch`}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Watch Now
            </a>
            <a
              href={`${anime.id}`}
              className="px-4 py-2 bg-white text-black rounded-md"
            >
              More Info
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

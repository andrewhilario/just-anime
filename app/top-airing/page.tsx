/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "@/components/navbar/Navbar";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TopAiringAnime } from "@/lib/top-airing";

type Props = {};

const TopAiring = (props: Props) => {
  const { data: topAiring, isLoading } = useQuery({
    queryKey: ["topAiring"],
    queryFn: async () => {
      const response = await fetch(
        "https://consumet-api-org.vercel.app/meta/anilist/trending"
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return data;
      }
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <Navbar />
      <div className="2xl:text-3xl text-neutral-900 py-5 px-8 font-bold">
        Top Airing Anime
      </div>
      <div className="grid grid-cols-2 2xl:grid-cols-5 gap-2 w-full mx-auto py-4 px-8">
        {topAiring?.results?.map((anime: TopAiringAnime) => {
          return (
            <Card key={anime.id}>
              <CardHeader>
                <CardTitle>{anime?.title?.romaji}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={anime.image}
                  alt={anime?.title?.english}
                  className="w-full h-80 object-cover"
                />
              </CardContent>
              <CardFooter
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
              >
                <CardDescription>{anime.genres.join(", ")}</CardDescription>

                <div className="flex justify-center items-center space-x-5">
                  <a
                    href={`/${anime?.id}`}
                    className="text-blue-500 hover:text-blue-600 
                   
                  "
                  >
                    More info
                  </a>
                  <a
                    href={`/${anime?.id}`}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Watch Now
                  </a>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TopAiring;

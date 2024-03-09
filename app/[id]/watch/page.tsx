"use client";

import Navbar from "@/components/navbar/Navbar";
import { AnimeProvider } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";

type Props = {};

const WatchAnime = (props: Props) => {
  const { id } = useParams();
  const path = usePathname();
  const query = useSearchParams();
  const router = useRouter();

  const { data: animeInfo, isLoading } = useQuery({
    queryKey: ["animeInfo", id],
    queryFn: async () => {
      const provider = AnimeProvider.GOGOANIME;

      const response = await fetch(
        `https://consumet-api-org.vercel.app/meta/anilist/info/${id}?provider=${provider}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return data;
      }
    },
    enabled: !!id
  });

  const { data: episodeInfo, isLoading: episodeLoading } = useQuery({
    queryKey: ["episodeInfo", id, query.get("episode")],
    queryFn: async () => {
      const response = await fetch(
        `https://consumet-api-org.vercel.app/meta/anilist/watch/${query.get(
          "episode"
        )}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return data;
      }
    },
    enabled: !!id && !!query.get("episode")
  });

  useEffect(() => {
    console.log("ANIME INFO", animeInfo);
    console.log("EPISODE INFO", episodeInfo);
    const params = new URLSearchParams(query.toString());
    if (!query.get("episode") && !isLoading) {
      params.set("episode", `${animeInfo?.episodes[0]?.id}`);
    }
    router.push(`${path}?${params.toString()}`);
  }, [animeInfo, episodeInfo, isLoading, path, query, router]);

  return (
    <div className="w-full">
      <Navbar />

      <div className="flex flex-col items-start justify-start px-20 pb-10">
        <div className="text-2xl py-5 font-semibold">
          <h1>Watch {animeInfo?.title?.english}</h1>
        </div>

        <div className="w-full h-[700px]">
          <ReactPlayer
            url={episodeInfo?.sources[3]?.url}
            controls={true}
            width={"100%"}
            height={"100%"}
            style={{
              backgroundColor: "black",
              borderRadius: "15px"
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-start space-x-4 px-20 pb-10">
        <h1 className="text-3xl font-bold my-10">Episodes</h1>
        <div className="flex items-center justify-start flex-wrap gap-2">
          {animeInfo?.episodes?.map((episode: any) => {
            return (
              <button
                key={episode.id}
                className="flex flex-col items-center px-10 py-2 bg-gray-400 rounded-lg text-white"
                onClick={() => {
                  const params = new URLSearchParams(query.toString());
                  params.set("episode", `${episode.id}`);
                  router.push(`${path}?${params.toString()}`);
                }}
              >
                <p className="text-lg font-semibold">{episode.number}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WatchAnime;

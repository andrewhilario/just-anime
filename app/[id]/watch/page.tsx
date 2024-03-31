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
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

type Props = {};

const WatchAnime = (props: Props) => {
  const { id } = useParams();
  const path = usePathname();
  const query = useSearchParams();
  const router = useRouter();
  const [quality, setQuality] = useState("1080p" as string);
  const [skipIntro, setSkipIntro] = useState(false);
  const [skipOutro, setSkipOutro] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const INTRO_DURATION = 85; // Example intro duration in seconds
  const OUTRO_DURATION = 85; // Example outro duration in seconds

  const { data: animeInfo, isLoading } = useQuery({
    queryKey: ["animeInfo", id],
    queryFn: async () => {
      const provider = AnimeProvider.ANIMEFOX;

      const response = await fetch(
        `https://consumet-api-org.vercel.app/meta/anilist/info/${id}?provider=${provider}`
      );
      const data = await response.json();

      if (!response.ok) {
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
      params.set("episode", `${animeInfo?.episodes.pop().id}`);
    }
    router.push(`${path}?${params.toString()}`);
  }, [animeInfo, episodeInfo, isLoading, path, query, router]);

  const handleSkipIntro = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(INTRO_DURATION, "seconds");
      setSkipIntro(false);
    }
  };

  const handleSkipOutro = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        playerRef.current.getDuration() - OUTRO_DURATION,
        "seconds"
      );
      setSkipOutro(false);
    }
  };

  if (isLoading || episodeLoading) {
    return (
      <div className="w-full">
        <Navbar />
        <div className="text-center py-42">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Navbar />

      <div className="flex flex-col items-start justify-start px-4 lg:px-20 pb-10">
        <div className="text-2xl py-5 font-semibold">
          <h1>
            Watch {animeInfo?.title?.english}
            {" Episode "}
            {query.get("episode")?.split("-").pop()}
          </h1>
        </div>

        <div className="w-full h-[300px] lg:h-[700px] relative">
          <ReactPlayer
            ref={playerRef}
            url={
              episodeInfo?.sources.find(
                (source: any) => source.quality === quality
              ).url
            }
            controls={true}
            width={"100%"}
            height={"100%"}
            style={{
              backgroundColor: "black",
              borderRadius: "15px"
            }}
            onProgress={(state) => {
              // Check for intro and outro duration and update skip state accordingly
              if (state.playedSeconds < INTRO_DURATION) {
                setSkipIntro(true);
              } else if (
                state.playedSeconds >
                state.loadedSeconds - OUTRO_DURATION
              ) {
                setSkipOutro(true);
              } else {
                setSkipIntro(false);
                setSkipOutro(false);
              }
            }}
          />
          {/* create a option for the quality */}
          <div className="absolute top-0 right-0 bg-gray-800 p-2 rounded-bl-lg">
            <select
              className="text-white bg-gray-800"
              onChange={(e) => {
                setQuality(e.target.value);
              }}
            >
              {episodeInfo?.sources.map((source: any) => {
                return (
                  <option key={source.id} value={source.quality}>
                    {source.quality}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="absolute bottom-20 right-6 flex flex-col space-y-2 p-2">
            {skipIntro && (
              <button
                className="text-white bg-gray-800 px-3 py-2 rounded-lg"
                onClick={handleSkipIntro}
              >
                Skip Intro
              </button>
            )}
            {/* {skipOutro && (
              <button
                className="text-white bg-gray-800 px-3 py-1 rounded-lg"
                onClick={handleSkipOutro}
              >
                Skip Outro
              </button>
            )} */}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start space-y-2 lg:space-x-4 px-5 lg:px-20 pb-10">
        <h1 className="text-lg lg:text-3xl font-bold my-4 lg:my-10">
          Episodes
        </h1>
        <div className="grid grid-cols-4 lg:flex items-center justify-start flex-wrap gap-2">
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
                <span className="text-lg font-semibold">{episode.number}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WatchAnime;

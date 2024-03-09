/* eslint-disable @next/next/no-img-element */
"use client";
import Navbar from "@/components/navbar/Navbar";
import { AnimeProvider } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const AnimeInfo = (props: Props) => {
  const { id } = useParams();

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

  useEffect(() => {
    console.log("ANIME INFO", animeInfo);
  }, [animeInfo]);

  if (isLoading) {
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
      <div className="px-20 mx-auto grid grid-cols-4  space-x-4 items-center mt-10 ">
        <div className="flex flex-col justify-center items-center w-full">
          <img
            src={animeInfo?.image}
            alt={animeInfo?.title?.english}
            className="w-96 h-[500px] object-cover mb-5"
          />
          <a
            href={`${animeInfo?.id}/watch`}
            className="px-20 py-4 mx-auto bg-red-500 text-white rounded-md mt-2"
          >
            Watch Now
          </a>
        </div>
        <div className="space-y-4 col-span-3">
          <h1 className="text-4xl font-bold">{animeInfo?.title?.english}</h1>
          <h2 className="text-2xl font-semibold">{animeInfo?.title?.romaji}</h2>
          <p className="text-lg">{animeInfo?.description}</p>
          <div className="grid grid-cols-2 space-y-2">
            <div>
              <h3 className="text-lg font-semibold">Genres</h3>
              <p>{animeInfo?.genres.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Rating</h3>
              <p>{animeInfo?.rating}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Episodes</h3>
              <p>{animeInfo?.totalEpisodes}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Season</h3>
              <p>{animeInfo?.season}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <p>{animeInfo?.status}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sub or Dub</h3>
              <p>{animeInfo?.subOrDub}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start space-x-4 px-20 pb-10">
        <h1 className="text-3xl font-bold my-10">Episodes</h1>
        <div className="flex items-center justify-start flex-wrap gap-2">
          {animeInfo?.episodes?.map((episode: any) => {
            return (
              <div
                key={episode.id}
                className="flex flex-col items-center px-10 py-2 bg-gray-400 rounded-lg text-white"
              >
                <p className="text-lg font-semibold">{episode.number}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-start justify-start space-x-4 px-20 pb-10">
        <h1 className="text-3xl font-bold my-10">Recommendations</h1>
        <div className="grid grid-cols-5 items-center gap-2 ">
          {animeInfo?.recommendations?.map((anime: any) => {
            return (
              <div key={anime.id} className="flex flex-col items-center">
                <img
                  src={anime.image}
                  alt={anime.title.english}
                  className="w-full h-[550px] object-cover"
                />
                <p className="text-lg font-semibold">{anime.title.english}</p>
                <a className="text-blue-500 hover:text-blue-600 ">More info</a>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-start justify-start space-x-4 px-20 pb-10">
        <h1 className="text-3xl font-bold my-10">Relations</h1>
        <div className="grid grid-cols-5 items-center gap-2 ">
          {animeInfo?.relations?.map((anime: any) => {
            return (
              <div key={anime.id} className="flex flex-col items-center">
                <img
                  src={anime.image}
                  alt={anime.title.english}
                  className="w-full h-[550px] object-cover"
                />
                <p className="text-lg font-semibold">{anime.title.english}</p>
                <p className="text-lg font-semibold">{anime.relationType}</p>
                <a className="text-blue-500 hover:text-blue-600 ">More info</a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimeInfo;

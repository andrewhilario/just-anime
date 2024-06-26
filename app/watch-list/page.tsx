/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "@/components/navbar/Navbar";
import React, { useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import useAddToFavorites from "@/hooks/useAddToFavorites";
import { Anime } from "@/types/favorites";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

type Props = {};

const WatchList = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [listFavorites, setListFavorites] = React.useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          const watchList = doc.data().watchList;
          if (watchList) {
            setListFavorites(watchList);
            setIsLoading(false);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    console.log("FAVORITES", listFavorites);
  }, [listFavorites]);

  if (isLoading) {
    const arr = Array.from({ length: 10 });

    return (
      <div className="w-full">
        <Navbar />
        <div className="2xl:text-3xl text-neutral-900 py-5 px-8 font-bold">
          Watch List
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-2 w-full mx-auto py-4 px-8">
          {arr.map((_, i) => {
            return (
              <div className="flex flex-col space-y-3 mb-4" key={i}>
                <Skeleton className="h-[325px] w-full rounded-xl bg-slate-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]  bg-slate-400" />
                  <Skeleton className="h-4 w-[200px]  bg-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Navbar />
      <div className="2xl:text-3xl text-neutral-900 py-5 px-8 font-bold">
        Watch Lists
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-2 w-full mx-auto py-4 px-8">
        {listFavorites?.map((anime: any) => {
          return (
            <Card key={anime.id}>
              <CardContent className="p-0">
                <img
                  src={anime.image}
                  alt={anime?.title?.english}
                  className="w-full h-96 object-cover rounded-t-2xl"
                />
              </CardContent>
              <CardFooter
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "0.5rem"
                }}
                className="space-y-5"
              >
                <CardTitle className="pt-4">{anime?.name}</CardTitle>
                {/* <CardDescription className="">
                  {anime.genres.join(", ")}
                </CardDescription> */}

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

export default WatchList;

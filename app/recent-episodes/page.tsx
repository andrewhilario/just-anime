/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "@/components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PopularAnime } from "@/lib/top-airing";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

type Props = {};

const Upcoming = (props: Props) => {
  const [page, setPage] = useState(1);
  const { data: recent, isLoading } = useQuery({
    queryKey: ["recent", page],
    queryFn: async () => {
      const response = await fetch(
        `https://consumet-api-org.vercel.app/meta/anilist/recent-episodes?page=${page.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return data;
      }
    }
  });

  useEffect(() => {
    console.log("RECENT", recent);
  }, [recent]);

  if (isLoading) {
    const arr = Array.from({ length: 10 });

    return (
      <div className="w-full">
        <Navbar />
        <div className="2xl:text-3xl text-neutral-900 py-5 px-8 font-bold">
          Recent Episodes
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
        Recent Episodes
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-2 w-full mx-auto py-4 px-8">
        {recent?.results?.map((anime: any) => {
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
                <CardTitle className="pt-4">
                  {anime?.title?.english} Episode {anime?.episodeNumber}
                </CardTitle>

                <div className="flex justify-center items-center space-x-5">
                  <a
                    href={`/${anime?.id}`}
                    className="text-blue-500 hover:text-blue-600 
                   
                  "
                  >
                    More info
                  </a>
                  <a
                    href={`${anime?.id}/watch?episode=${anime?.episodeId
                      .split("/")
                      .pop()}`}
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
      <Pagination className="my-5">
        <PaginationPrevious onClick={() => setPage(page - 1)} />
        <PaginationContent>
          {Array.from({ length: 10 }).map((_, i) => {
            return (
              <PaginationItem key={i} onClick={() => setPage(i + 1)}>
                <PaginationLink isActive={page === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationNext onClick={() => setPage(page + 1)} />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Upcoming;

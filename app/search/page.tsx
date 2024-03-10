"use client";

/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/navbar/Navbar";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

type Props = {};

const Search = (props: Props) => {
  const query = useSearchParams();

  const { data: searchResult, isLoading } = useQuery({
    queryKey: ["searchResult", query.get("query")],
    queryFn: async () => {
      const response = await fetch(
        `https://consumet-api-org.vercel.app/meta/anilist/${query.get("query")}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return data;
      }
    },
    enabled: !!query.get("query")
  });

  if (isLoading) {
    const arr = Array.from({ length: 10 });

    return (
      <div className="w-full">
        <Navbar />
        <div className="2xl:text-3xl text-neutral-900 py-5 px-8 font-bold">
          Search Results for {query.get("query")}
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
      <div className="flex flex-col items-start justify-start text-neutral-900 py-5 px-8 font-normal">
        <p className="text-2xl mb-2">
          Search Result &quot;{query.get("query")}&quot;
        </p>
        <p className="text-md">
          {searchResult?.results?.length} results found for {query.get("query")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-2 w-full mx-auto py-4 px-8">
        {searchResult?.results?.map((anime: any) => {
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
                <CardTitle className="pt-4">{anime?.title?.english}</CardTitle>

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

const SearchWrapper = (props: Props) => {
  return (
    <Suspense>
      <Search {...props} />
    </Suspense>
  );
};

export default SearchWrapper;

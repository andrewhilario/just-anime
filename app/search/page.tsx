"use client";

/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/navbar/Navbar";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Book } from "lucide-react";

type Props = {};

const Search = (props: Props) => {
  const query = useSearchParams();
  const [error, setError] = React.useState(null);
  const [searchType, setSearchType] = React.useState("anime" as string); // ["anime", "manga"]
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

  const { data: searchMangaResult, isLoading: mangaLoading } = useQuery({
    queryKey: ["searchMangaResult", query.get("query")],
    queryFn: async () => {
      const response = await fetch(
        `https://consumet-api-org.vercel.app/manga/mangahere/${query.get(
          "query"
        )}`
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

  useEffect(() => {
    // console.log("SEARCH RESULT", searchResult);
    console.log("SEARCH MANGA RESULT", searchMangaResult);
  }, [searchResult, searchMangaResult]);

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
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start justify-start text-neutral-900 py-5 px-8 font-normal">
          <p className="text-2xl mb-2">
            Search Result &quot;{query.get("query")}&quot;
          </p>
          <p className="text-md">
            {searchResult?.results?.length} results found for{" "}
            {query.get("query")}
          </p>
        </div>
        {/* Create a Select for Anime and Manga */}
        {/* <div className="flex flex-col items-start justify-start text-neutral-900 py-5 px-8 font-normal">
          <Select
            value={searchType}
            onValueChange={(value: any) => setSearchType(value)}
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anime">Anime</SelectItem>
              <SelectItem value="manga">Manga</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-2 w-full mx-auto py-4 px-8">
        {searchType === "anime" &&
          searchResult?.results?.map((anime: any) => {
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
                    {anime?.title?.english}
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

        {searchType === "manga" &&
          !mangaLoading &&
          searchMangaResult?.results?.map((manga: any) => {
            return (
              <Card key={manga.id}>
                <CardContent className="p-0">
                  {manga.image && !error ? (
                    <img
                      src={manga.image.split("?")[0]}
                      alt={manga?.title}
                      className="w-full h-96 object-cover rounded-t-2xl"
                      referrerPolicy={manga?.headerForImage?.Referer}
                      // check if the image has a 403 forbidden
                      onError={(e) => {
                        setError(e as any);
                      }}
                    />
                  ) : (
                    <Book
                      size={96}
                      className="w-full h-96 object-cover rounded-t-2xl text-gray-300"
                    />
                  )}
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
                  <CardTitle className="pt-4">{manga?.title}</CardTitle>

                  <div className="flex justify-center items-center space-x-5">
                    <a
                      href={`/${manga?.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      More info
                    </a>
                    <a
                      href={`/${manga?.id}?type=manga`}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Read Now
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

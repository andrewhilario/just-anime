"use client";

import { ArrowRight, Github, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {};

export default function Navbar({}: Props) {
  const [isHovering, setIsHovering] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  const router = useRouter();

  const onSearch = (data: any) => {
    if (data.search) {
      router.push(`/search?query=${data.search}`);
    } else {
      alert("Please enter a search query");
    }
  };

  return (
    // create a navbar with a logo and a link for top airing anime, popular anime, and upcoming anime and also a login and sign up button
    <div>
      <nav className="flex items-center justify-between bg-gray-800 py-4 px-24">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-white text-4xl">
            JustAnime
          </a>
          <div className="flex items-center">
            <a href="/top-airing" className="text-white mx-2">
              Top Airing
            </a>
            <a href="/popular" className="text-white mx-2">
              Popular
            </a>
            <a href="/recent-episodes" className="text-white mx-2">
              Recent Episodes
            </a>
          </div>
        </div>

        <div className="flex items-center">
          <form
            className="flex px-4 py-2 rounded-lg bg-white mr-10"
            onSubmit={handleSubmit(onSearch)}
          >
            <input
              type="text"
              placeholder="Search for anime"
              className="outline-none focus:outline-none w-64 bg-transparent text-gray-800"
              {...register("search")}
            />
            <button type="submit" className="outline-none focus:outline-none">
              <Search size={24} className="text-gray-800" />
            </button>
          </form>

          {isHovering && (
            <>
              <p className="text-white font-normal text-xs">
                Follow me on Github for more projects
              </p>
              <ArrowRight size={24} className="text-white mx-2" />
            </>
          )}
          <a
            href="https://github.com/andrewhilario"
            target="_blank"
            className="rounded-full hover:bg-gray-500 p-2"
            onMouseOver={() => {
              setIsHovering(true);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
            }}
          >
            <Github size={24} className="text-white " />
          </a>
        </div>
      </nav>
    </div>
  );
}

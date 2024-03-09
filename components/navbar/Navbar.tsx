"use client";

import { ArrowRight, Github } from "lucide-react";
import React from "react";

type Props = {};

export default function Navbar({}: Props) {
  const [isHovering, setIsHovering] = React.useState(false);

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
          {/* <a href="#" className="text-white mx-2">
            Login
          </a>
          <a href="#" className="text-white mx-2">
            Sign Up
          </a> */}
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

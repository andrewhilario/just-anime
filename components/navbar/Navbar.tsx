import React from "react";

type Props = {};

export default function Navbar({}: Props) {
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
            <a href="#" className="text-white mx-2">
              Upcoming
            </a>
          </div>
        </div>

        <div className="flex items-center">
          <a href="#" className="text-white mx-2">
            Login
          </a>
          <a href="#" className="text-white mx-2">
            Sign Up
          </a>
        </div>
      </nav>
    </div>
  );
}

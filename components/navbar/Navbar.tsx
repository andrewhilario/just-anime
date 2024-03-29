"use client";

import { auth } from "@/firebase/firebase.config";
import { ArrowRight, Github, Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarSVG from "@/public/images/avatar.jpg";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
type Props = {};

export default function Navbar({}: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { logout, user } = useAuth();

  const router = useRouter();

  const onSearch = (data: any) => {
    if (data.search) {
      router.push(`/search?query=${data.search}`);
    } else {
      alert("Please enter a search query");
    }
  };

  const handleLogout = async () => {
    try {
      await logout("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <nav className="flex  items-center justify-between bg-gray-800 py-4 px-6 md:px-12 lg:px-18 2xl:px-24">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-white text-4xl">
            JustAnime
          </a>
          <div className="hidden lg:flex items-center">
            <a href="/top-airing" className="text-white mx-2">
              Top Airing
            </a>
            <a href="/popular" className="text-white mx-2">
              Popular
            </a>
            <a href="/recent-episodes" className="text-white mx-2">
              Recent Episodes
            </a>
            {auth.currentUser && (
              <a href="/watch-list" className="text-white mx-2">
                Watch List
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="block lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <form
            className="hidden lg:flex px-4 py-2 rounded-lg bg-white mr-4 md:mr-10"
            onSubmit={handleSubmit(onSearch)}
          >
            <input
              type="text"
              placeholder="Search for anime"
              className="outline-none focus:outline-none w-40 md:w-64 bg-transparent text-gray-800"
              {...register("search")}
            />
            <button type="submit" className="outline-none focus:outline-none">
              <Search size={24} className="text-gray-800" />
            </button>
          </form>
          {!auth.currentUser ? (
            <div className="flex items-center gap-2">
              <a href="/sign-in" className="text-white px-2 py-1 ">
                Sign In
              </a>
              <a
                href="/sign-up"
                className="text-white px-4 py-2 bg-gray-500 rounded-lg "
              >
                Sign Up
              </a>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={avatarSVG.src}
                  className="bg-gray-500 border border-white"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 bg-gray-500 rounded-lg "
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 p-4 md:px-12">
          <a href="/top-airing" className="block text-white py-2">
            Top Airing
          </a>
          <a href="/popular" className="block text-white py-2">
            Popular
          </a>
          <a href="/recent-episodes" className="block text-white py-2">
            Recent Episodes
          </a>
          {auth.currentUser && (
            <a href="/watch-list" className="block text-white py-2">
              Watch List
            </a>
          )}
          {!auth.currentUser ? (
            <div className="flex items-center gap-2">
              <a href="/sign-in" className="text-white px-2 py-1 ">
                Sign In
              </a>
              <a
                href="/sign-up"
                className="text-white px-4 py-2 bg-gray-500 rounded-lg "
              >
                Sign Up
              </a>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-white mt-2">
              Sign Out
            </button>
          )}
          <form
            className="flex px-4 py-2 rounded-lg bg-white mr-4 md:mr-10 justify-between mt-4"
            onSubmit={handleSubmit(onSearch)}
          >
            <input
              type="text"
              placeholder="Search for anime"
              className="outline-none focus:outline-none w-full md:w-64 bg-transparent text-gray-800 "
              {...register("search")}
            />
            <button type="submit" className="outline-none focus:outline-none">
              <Search size={24} className="text-gray-800" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

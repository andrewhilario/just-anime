// useAddToFavorites.tsx
import React, { useEffect } from "react";
import { auth, db } from "@/firebase/firebase.config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  onSnapshot
} from "firebase/firestore";
import { Anime } from "@/types/favorites";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const useAddToFavorites = () => {
  const [favoritesMap, setFavoritesMap] = React.useState<
    Record<string, boolean>
  >({});
  const [listFavorites, setListFavorites] = React.useState<Anime[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          const watchList = doc.data()?.watchList;
          if (watchList) {
            const newFavoritesMap: Record<string, boolean> = {};
            watchList.forEach((item: Anime) => {
              newFavoritesMap[item.id] = true;
            });
            setFavoritesMap(newFavoritesMap);
            setListFavorites(watchList);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addToFavorites = async (anime: Anime) => {
    try {
      if (!auth.currentUser) {
        toast({
          title: "Not authenticated",
          description: `You need to be authenticated to add to favorites.`,
          variant: "destructive"
        });
        return;
      }

      const userWatchListRef = doc(db, "users", auth.currentUser!.uid);

      const userWatchList = await getDoc(userWatchListRef);

      // if user does not have a watchlist
      if (!userWatchList.exists()) {
        await setDoc(userWatchListRef, {
          watchList: [anime]
        });
        toast({
          title: "Added to favorites",
          description: `Added ${anime.name} to favorites.`,
          variant: "default"
        });
        return;
      } else {
        // if user has a watchlist add a arrayUnion
        await updateDoc(userWatchListRef, {
          watchList: arrayUnion(anime)
        });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Error adding to favorites",
        description: `${e}`,
        variant: "destructive"
      });
    }
  };

  const getFavorites = async (animeId: string | number) => {
    try {
      if (!user) {
        toast({
          title: "Not authenticated",
          description: `You need to be authenticated to add to favorites.`,
          variant: "destructive"
        });
        return;
      }

      const userWatchListRef = doc(db, "users", user.uid);

      const userWatchList = await getDoc(userWatchListRef);

      if (userWatchList.exists()) {
        const watchList = userWatchList.data()?.watchList;
        console.log("WATCHLIST", watchList);
        if (watchList) {
          const isAdded = watchList.some((item: Anime) => item.id === animeId);
          setFavoritesMap((prevState) => ({
            ...prevState,
            [animeId]: isAdded
          }));
        }
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Error adding to favorites",
        description: `${e}`,
        variant: "destructive"
      });
    }
  };

  return {
    addToFavorites,
    getFavorites,
    favoritesMap,
    listFavorites
  };
};

export default useAddToFavorites;

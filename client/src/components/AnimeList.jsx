import { useState, useEffect, useRef } from "react";
import "./AnimeList.css";
import AnimeCard from "./AnimeCard";

export default function AnimeList() {
  const [animeList, setAnimeList] = useState([]);
  const mainContentRef = useRef(null);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(
          "https://teched-week7-assignment.onrender.com/anime"
        );
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        console.error("Failed to fetch anime collection", error);
      }
    }
    fetchAnime();
  }, []);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (mainContentRef.current) {
        // Scroll horizontally instead of vertically
        mainContentRef.current.scrollLeft += event.deltaY;
      }
    };
    const contentDiv = mainContentRef.current;
    if (contentDiv) {
      // Add the wheel event listener to the main content
      contentDiv.addEventListener("wheel", handleWheelScroll);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (contentDiv) {
        contentDiv.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  return (
    <>
      <div className="AnimeList" ref={mainContentRef}>
        {animeList.map((anime) => (
          <AnimeCard key={anime.anime_id} anime={anime} />
        ))}
      </div>
    </>
  );
}

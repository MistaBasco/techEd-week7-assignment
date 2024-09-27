import { useState, useEffect } from "react";
import "./AnimeList.css";
import AnimeCard from "./AnimeCard";

export default function AnimeList() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch("http://localhost:8080/anime");
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        console.error("Failed to fetch anime collection", error);
      }
    }
    fetchAnime();
  }, []);

  return (
    <>
      <div className="AnimeList">
        {animeList.map((anime) => (
          <AnimeCard key={anime.anime_id} anime={anime} />
        ))}
      </div>
    </>
  );
}

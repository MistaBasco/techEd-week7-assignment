import { Link } from "react-router-dom";
import "/src/components/AnimeCard.css";

export default function AnimeCard({ anime }) {
  const {
    anime_id,
    title,
    synopsis,
    release_year,
    cover_image,
    genre_id,
    genre_name,
    tag_ids,
    tag_names,
    average_rating,
  } = anime;

  return (
    <div className="AnimeCard">
      <Link className="Link" to={`/anime/${anime_id}`}>
        <h1 className="AnimeTitle">{title}</h1>
      </Link>
      {/* <img src={anime.cover_image} alt={anime.title} /> */}
      <div className="AnimeCover">
        <h1>This is definitely an image!</h1>
      </div>
      <p className="spacer">{anime.synopsis}</p>
      <p className="spacer">
        <strong>Release Year:</strong> {anime.release_year}
      </p>
      <p className="spacer">
        <strong>Avg Rating:</strong> {anime.average_rating}
      </p>
      <p className="spacer">
        <strong>Genre:</strong>
        <Link to={`/genre/${genre_id}`}>
          <span className="GenreLink">{anime.genre_name}</span>
        </Link>
      </p>
      <div className="TagWrapper">
        <strong>Tags:</strong>
        {tag_names.length === 0 ? (
          <p>No _names available.</p>
        ) : (
          <ul>
            {tag_names.map((tag_name, index) => (
              <li key={tag_ids[index]}>{tag_name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

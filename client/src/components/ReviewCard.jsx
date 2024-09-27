import { Link } from "react-router-dom";
import "./ReviewCard.css";
import { format } from "date-fns";

export default function ReviewCard({ review }) {
  const {
    anime_name,
    reviewer_name,
    rating,
    review_text,
    likes,
    created_at,
    anime_id,
    user_id,
  } = review;

  const formattedDate = format(new Date(created_at), "MMM dd, yyyy");

  return (
    <div className="ReviewCard">
      <Link to={`/anime/${anime_id}`}>
        <h3>{anime_name}</h3>
      </Link>
      <div className="spacer">
        <strong>Review by:</strong>
        <Link to={`/user/${user_id}`}>
          <p>{reviewer_name}</p>
        </Link>
      </div>

      <p className="spacer">
        <strong>Rating:</strong> {rating}/10
      </p>

      <p className="spacer">{review_text}</p>

      <p className="spacer">
        <strong>Likes:</strong> {likes}
      </p>

      <p className="spacer">
        <strong>Date:</strong> {formattedDate}
      </p>
      <button>Like</button>
    </div>
  );
}

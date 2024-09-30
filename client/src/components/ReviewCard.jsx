import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useState } from "react";
import "/src/components/ReviewCard.css";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

export default function ReviewCard({
  review,
  // user_id,
  current_user,
  onDelete,
}) {
  const {
    anime_title,
    reviewer_name,
    rating,
    review_text,
    likes,
    created_at,
    anime_id,
    review_id,
    user_id,
  } = review;

  const [currentLikes, setCurrentLikes] = useState(likes);

  const formattedDate = format(new Date(created_at), "MMM dd, yyyy");

  const isAuthor = review.user_id === current_user; // Check if the logged-in user is the review author

  // Function to handle like action
  const handleLike = () => {
    setCurrentLikes(currentLikes + 1); // Increment likes locally
  };

  return (
    <div className="ReviewCard">
      <Link to={`/anime/${anime_id}`}>
        <h3>{anime_title}</h3>
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
        <strong>Likes:</strong> {currentLikes}
      </p>

      <p className="spacer">
        <strong>Date:</strong> {formattedDate}
      </p>
      {current_user && (
        <LikeButton
          reviewId={review_id}
          current_user={current_user}
          onLike={handleLike}
        />
      )}
      {isAuthor && current_user && (
        <DeleteButton reviewId={review.review_id} onDelete={onDelete} />
      )}
    </div>
  );
}

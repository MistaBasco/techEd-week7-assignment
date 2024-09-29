import { useState, useEffect } from "react";

export default function LikeButton({ reviewId }) {
  const [liked, setLiked] = useState(false);
  //   const userId = 1;

  useEffect(() => {
    // Check if the review is already liked by the user
    async function fetchLikeStatus() {
      try {
        const response = await fetch(
          `http://localhost:8080/reviews/${reviewId}/liked`
        );
        const data = await response.json();

        if (data.liked) {
          setLiked(true); // If the user has already liked this review, set liked to true
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    }
    fetchLikeStatus();
  }, [reviewId]);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/reviews/${reviewId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setLiked(true); // Mark as liked after successful request
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  return (
    <button onClick={handleLike} disabled={liked}>
      {liked ? "Liked" : "Like"}
    </button>
  );
}

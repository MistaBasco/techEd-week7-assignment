import { useState, useEffect } from "react";

export default function LikeButton({ reviewId, current_user, onLike }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!current_user) return;

    // Check if the review is already liked by the user
    async function fetchLikeStatus() {
      try {
        const response = await fetch(
          `https://teched-week7-assignment.onrender.com/reviews/${reviewId}/liked`
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
  }, [reviewId, current_user]);

  const handleLike = async () => {
    if (!current_user) {
      alert("You need to log in to like this review!");
      return;
    }

    setLoading(true); // Disable button while waiting for response
    try {
      const response = await fetch(
        `https://teched-week7-assignment.onrender.com/reviews/${reviewId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setLiked(true); // Mark as liked after successful request
        onLike();
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error liking review:", error);
    } finally {
      setLoading(false); // Re-enable button after request completes
    }
  };

  return (
    <button onClick={handleLike} disabled={liked || loading}>
      {loading ? "Processing..." : liked ? "Liked" : "Like"}
    </button>
  );
}

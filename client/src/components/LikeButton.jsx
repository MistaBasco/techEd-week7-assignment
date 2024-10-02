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
          `https://teched-week7-assignment.onrender.com/reviews/${reviewId}/liked?current_user=${encodeURIComponent(
            current_user
          )}`,
          {
            method: "GET", // or 'POST'
            headers: { "Content-Type": "application/json" },
            credentials: "include", // This allows cookies/sessions to be sent along with the request
          }
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
          body: JSON.stringify({ current_user }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setLiked(!liked); // Toggle liked state
        onLike();
        console.log(result.success);
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
    <button onClick={handleLike} disabled={loading}>
      {loading ? "Processing..." : liked ? "Unlike" : "Like"}
    </button>
  );
}

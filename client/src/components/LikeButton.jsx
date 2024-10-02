import { useState } from "react";

export default function LikeButton({ reviewId, current_user, onLike, liked }) {
  const [loading, setLoading] = useState(false);

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
        onLike();
        console.log(result.success);
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error liking/unliking review:", error);
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

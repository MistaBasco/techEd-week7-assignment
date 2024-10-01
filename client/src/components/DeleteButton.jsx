import { useState } from "react";

export default function DeleteButton({ reviewId, current_user, onDelete }) {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://teched-week7-assignment.onrender.com/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_user }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setDeleted(true); // Mark as deleted
        if (onDelete) onDelete(); // Notify parent component
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (deleted) {
    return <p>This review has been deleted.</p>;
  }

  return <button onClick={handleDelete}>Delete</button>;
}

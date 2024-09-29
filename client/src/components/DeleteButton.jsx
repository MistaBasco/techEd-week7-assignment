import { useState } from "react";

export default function DeleteButton({ reviewId, onDelete }) {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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

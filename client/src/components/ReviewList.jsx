import { useState, useEffect, useRef } from "react";
import "./ReviewList.css";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ current_user }) {
  const [reviews, setReviews] = useState([]);
  const reviewListRef = useRef(null);
  const scrollInterval = useRef(null);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("http://localhost:8080/reviews"); // Adjust this endpoint if necessary
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    }

    fetchReviews();

    // Auto-scroll function
    function startAutoScroll() {
      scrollTimeout.current = setTimeout(() => {
        scrollInterval.current = setInterval(() => {
          if (reviewListRef.current) {
            reviewListRef.current.scrollTop += 1; // Adjust scroll speed
          }
        }, 50); // Adjust scroll interval (lower = faster)
      }, 5000);
    }

    // Start auto-scrolling when the component is mounted
    startAutoScroll();

    // Clear interval when component unmounts
    return () => {
      clearInterval(scrollInterval.current);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Stop scrolling when user hovers over the list
  function handleMouseEnter() {
    clearInterval(scrollInterval.current);
    clearTimeout(scrollTimeout.current);
  }

  // Resume scrolling when the user leaves the list
  function handleMouseLeave() {
    scrollTimeout.current = setTimeout(() => {
      scrollInterval.current = setInterval(() => {
        if (reviewListRef.current) {
          reviewListRef.current.scrollTop += 1; // Adjust scroll speed
        }
      }, 50); // Adjust scroll interval
    }, 1000); // Small delay to resume scrolling after mouse leaves
  }
  // Function to remove a review from the list after deletion
  const handleDeleteReview = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.review_id !== reviewId)
    );
  };

  if (reviews.length === 0) {
    return <p>No reviews available</p>;
  }

  return (
    <div
      className="ReviewList"
      ref={reviewListRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {reviews.map((review) => (
        <ReviewCard
          key={review.review_id}
          review={review}
          current_user={current_user}
          onDelete={() => handleDeleteReview(review.review_id)}
        />
      ))}
    </div>
  );
}

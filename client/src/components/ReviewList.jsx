import { useState, useEffect, useRef } from "react";
import "./ReviewList.css";
import ReviewCard from "./ReviewCard";

export default function ReviewList() {
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
    };
  }, []);

  // Stop scrolling when user hovers over the list
  function handleMouseEnter() {
    clearInterval(scrollInterval.current);
  }

  // Resume scrolling when the user leaves the list
  function handleMouseLeave() {
    scrollInterval.current = setInterval(() => {
      if (reviewListRef.current) {
        reviewListRef.current.scrollTop += 1;
      }
    }, 50);
  }

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
          user_id={review.user_id}
        />
      ))}
    </div>
  );
}

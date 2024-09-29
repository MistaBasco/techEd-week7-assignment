import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewCard from "../components/ReviewCard";
import "./UserDetailsPage.css";

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch(`http://localhost:8080/user/${id}`);
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setReviews(data.reviews);
          console.log(data.user, data.reviews);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, [id]);

  if (loading) {
    return <h2>Loading user details...</h2>;
  }

  if (!user) {
    return <h2>User not found.</h2>;
  }

  return (
    <>
      <div className="page UserDetailsPage">
        <div className="UserContainer">
          <h1 className="UserTitle">{user.username}</h1>
          <p className="spacer">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="spacer">
            <strong>Member since:</strong>
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="ReviewContainer">
          <h1>Reviews by {user.username}</h1>
          <div className="Reviews">
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.review_id}
                  review={review}
                  user_id={user.user_id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

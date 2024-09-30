import ReviewForm from "../components/ReviewForm";
import "./CreateReviewPage.css";

export default function CreateReviewPage({ current_user }) {
  return (
    <>
      <div className="page CreateReviewPage">
        <h1>Post A Review!</h1>
        <ReviewForm current_user={current_user} />
      </div>
    </>
  );
}

import ReviewForm from "../components/ReviewForm";
import "./CreateReviewPage.css";

export default function CreateReviewPage() {
  return (
    <>
      <div className="page CreateReviewPage">
        <h1>Post A Review!</h1>
        <ReviewForm userId={1} />
      </div>
    </>
  );
}

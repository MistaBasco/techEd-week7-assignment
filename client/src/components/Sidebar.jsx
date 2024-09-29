import ReviewList from "./ReviewList";
import "./Sidebar.css";

export default function Sidebar({ current_user }) {
  return (
    <>
      <div className="Sidebar">
        <ReviewList current_user={current_user} />
      </div>
    </>
  );
}

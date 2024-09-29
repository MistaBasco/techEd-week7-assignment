import ReviewList from "./ReviewList";
import "/src/components/Sidebar.css";

export default function Sidebar({ current_user }) {
  return (
    <>
      <div className="Sidebar">
        <ReviewList current_user={current_user} />
      </div>
    </>
  );
}

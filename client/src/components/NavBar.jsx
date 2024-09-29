import "/src/components/NavBar.css";
import { Link } from "react-router-dom";

export default function NavBar({ current_user }) {
  return (
    <div className="NavBar">
      <Link className="Link" to={"/"}>
        Home
      </Link>
      <Link className="Link" to={`/user/${current_user}`}>
        Profile
      </Link>
      <Link className="Link" to={"/create-review"}>
        Post Review
      </Link>
      {!current_user && (
        <Link className="Link" to={"/signup"}>
          SignUp
        </Link>
      )}
    </div>
  );
}
{
  /* <Route path="/" element={<HomePage />} />
<Route path="/anime/:id" element={<AnimeDetailPage />} />
<Route path="/create-review" element={<CreateReviewPage />} />
<Route path="/profile" element={<ProfilePage />} /> */
}

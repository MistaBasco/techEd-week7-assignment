import "./NavBar.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="NavBar">
      <Link className="Link" to={"/"}>
        Home
      </Link>
      <Link className="Link" to={"/user"}>
        Profile
      </Link>
      <Link className="Link" to={"/create-review"}>
        Post Review
      </Link>
    </div>
  );
}
{
  /* <Route path="/" element={<HomePage />} />
<Route path="/anime/:id" element={<AnimeDetailPage />} />
<Route path="/create-review" element={<CreateReviewPage />} />
<Route path="/profile" element={<ProfilePage />} /> */
}

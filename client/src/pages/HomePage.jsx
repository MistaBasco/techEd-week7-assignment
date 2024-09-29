import Sidebar from "../components/Sidebar";
import AnimeList from "../components/AnimeList";
import "./HomePage.css";

export default function HomePage({ current_user }) {
  return (
    <>
      <div className="page HomePage">
        <div className="MainContent">
          <h1>Home</h1>
          <AnimeList />
        </div>
        <Sidebar current_user={current_user} />
      </div>
    </>
  );
}

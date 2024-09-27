import Sidebar from "../components/Sidebar";
import AnimeList from "../components/AnimeList";
import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <div className="page HomePage">
        <div className="MainContent">
          <h1>This is the Homepage</h1>
          <AnimeList />
        </div>
        <Sidebar />
      </div>
    </>
  );
}

import { useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AnimeList from "../components/AnimeList";
import "./HomePage.css";

export default function HomePage() {
  const mainContentRef = useRef(null);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (mainContentRef.current) {
        // Scroll horizontally instead of vertically
        mainContentRef.current.scrollLeft += event.deltaY;
      }
    };
    const contentDiv = mainContentRef.current;
    if (contentDiv) {
      // Add the wheel event listener to the main content
      contentDiv.addEventListener("wheel", handleWheelScroll);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (contentDiv) {
        contentDiv.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  return (
    <>
      <div className="page HomePage" ref={mainContentRef}>
        <div className="MainContent">
          <h1>This is the Homepage</h1>
          <AnimeList />
        </div>
        <Sidebar />
      </div>
    </>
  );
}

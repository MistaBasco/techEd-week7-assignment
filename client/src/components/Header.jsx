import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import "./Header.css";

export default function Header({ current_user, setCurrentUser }) {
  async function handleLogout() {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      setCurrentUser(null); // Clear the user from state after logout
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }
  return (
    <>
      <div className="Header">
        <NavBar current_user={current_user} />
        {!current_user && <LoginForm setCurrentUser={setCurrentUser} />}
        {current_user && (
          <>
            <h1>Logged in!</h1> <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </>
  );
}

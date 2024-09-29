import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import "./Header.css";

export default function Header({ current_user }) {
  return (
    <>
      <div className="Header">
        <NavBar current_user={current_user} />
        {!current_user && <LoginForm />}
        {current_user && <h1>Logged in!</h1>}
      </div>
    </>
  );
}

import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import "./Header.css";

export default function Header() {
  return (
    <>
      <div className="Header">
        <NavBar />
        <LoginForm />
      </div>
    </>
  );
}

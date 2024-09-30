import { Link } from "react-router-dom";
import SignupForm from "../components/SignUpForm";
import "./SignUpPage.css";

export default function SignUpPage({ setCurrentUser }) {
  return (
    <>
      <div className="page SignUpPage">
        <SignupForm setCurrentUser={setCurrentUser} />
      </div>
    </>
  );
}

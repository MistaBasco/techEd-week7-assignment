import { Link } from "react-router-dom";
import SignupForm from "../components/SignUpForm";
import "./SignUpPage.css";

export default function SignUpPage() {
  return (
    <>
      <div className="page SignUpPage">
        <SignupForm />
        <p>
          Already have an account?
          <Link className="Link" to="/login">
            Login here
          </Link>
        </p>
        <p>
          New user?
          <Link className="Link" to="/signup">
            Sign up here
          </Link>
        </p>
      </div>
    </>
  );
}

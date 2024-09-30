import { useState } from "react";
import "/src/components/SignUpForm.css";
//just putting this comment here so I can commit xD

export default function SignupForm({ setCurrentUser }) {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://teched-week7-assignment.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setSuccessMessage("Signup successful!");
        setErrorMessage(null);
        console.log("User registered:", data);
        setCurrentUser(data.user.id);
      } else {
        if (typeof setErrorMessage === "function") {
          setErrorMessage(data.error || "Failed to sign up");
        } else {
          console.error("setErrorMessage is not a function");
        }
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (typeof setErrorMessage === "function") {
        setErrorMessage("Failed to register.");
      } else {
        console.error("setErrorMessage is not a function");
      }
      setSuccessMessage(null);
    }
  }

  function handleInputChange(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className="SignupForm">
      <form onSubmit={handleSubmit}>
        <div className="spacer">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="spacer">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="spacer">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>

        {errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
}

import { useState } from "react";
import "/src/components/SignUpForm.css";

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

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Signup successful!");
        setErrorMessage(null);
        console.log("User registered:", data);
        setCurrentUser(data.user.id);
      } else {
        setErrorMessage(data.error);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("Failed to register.");
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
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formValues.username}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Sign Up</button>

        {errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
}

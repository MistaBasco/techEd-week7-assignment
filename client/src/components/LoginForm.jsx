import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm({ setCurrentUser }) {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Login Successful:", data);
        setCurrentUser(data.user.id);
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Login failed: ", error);
      setErrorMessage("Failed to login.");
    }
  }
  function handleInputChange(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }
  return (
    <>
      <div className="LoginForm">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
          />
          {/* <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            value="true"
          />
          <label htmlFor="rememberMe">Remember Me</label> */}
          <button type="submit">Submit</button>
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
    </>
  );
}

import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log("The form values are: ", formValues);
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
          {/* <p>Current value is: {formValues.username}</p> */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
          />
          {/* <p>Current value is: {formValues.password}</p> */}
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            value="true"
          />
          <label htmlFor="rememberMe">Remember Me</label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

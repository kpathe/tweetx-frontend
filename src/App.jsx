import { useState } from "react";
import "./App.css";
import authService from "../src/services/auth.service";

function App() {
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFullName = (e) => {
    setfullName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log(fullName,email,password);
    
    authService.createAccount({ fullName, email, password });
  };

  return (
    <>
      <h1 className="text-center my-20 w-full text-violet-500 text-5xl">
        tweetX
      </h1>

      <div>
        <form onSubmit={handleSignup}>
          <label htmlFor="fullName">Full Name :</label>
          <input onChange={handleFullName} type="text" />
          <label htmlFor="email">Email :</label>
          <input onChange={handleEmail} type="email" />
          <label htmlFor="password">Password :</label>
          <input onChange={handlePassword} type="password" />

          <button type="submit">Signup</button>
        </form>
      </div>
    </>
  );
}

export default App;

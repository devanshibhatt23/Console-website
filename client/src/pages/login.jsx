import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { data, error } = await signIn(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    console.log(data);

    navigate("/dashboard");
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br /><br />

        <button>Login</button>

      </form>
    </div>
  );
}
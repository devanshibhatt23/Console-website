import { useState } from "react";
import { signUp } from "../services/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check MNIT email
    if (!normalizedEmail.endsWith("@mnit.ac.in")) {
      alert("Please sign up using your official MNIT email address (@mnit.ac.in).");
      return;
    }

    // Password validation
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Sign up with Supabase
    const { data, error } = await signUp(normalizedEmail, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup Successful! Please check your email.");

    console.log("User:", data);

    // Clear form
    setEmail("");
    setPassword("");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>

        <input
          type="email"
          placeholder="Official MNIT Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}
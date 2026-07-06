import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../services/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    // Check MNIT email
    if (!normalizedEmail.endsWith("@mnit.ac.in")) {
      setError("Please sign up using your official MNIT email address (@mnit.ac.in).");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    // Sign up with Supabase
    const { data, error: signupError } = await signUp(normalizedEmail, password);

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    setMessage("Signup Successful! Please check your email for confirmation.");
    
    // Clear form
    setEmail("");
    setPassword("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "420px",
          maxWidth: "100%",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          background: "var(--code-bg)",
          boxShadow: "var(--shadow)",
          textAlign: "left",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            margin: "0 0 10px",
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          Register
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text)",
            textAlign: "center",
            margin: "0 0 30px",
          }}
        >
          Create an account using your official college email ID
        </p>

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent)",
              fontSize: "14px",
            }}
          >
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
                color: "var(--text-h)",
              }}
            >
              Official Email
            </label>
            <input
              type="email"
              placeholder="e.g. entrynumber@mnit.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "var(--mono)",
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
                color: "var(--text-h)",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "var(--mono)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "var(--accent)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
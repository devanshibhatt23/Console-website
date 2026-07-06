import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email.trim().toLowerCase(), password);

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    console.log(data);
    navigate("/dashboard");
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
          transition: "transform 0.2s ease-in-out",
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
          CONSOLE
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text)",
            textAlign: "center",
            margin: "0 0 30px",
          }}
        >
          Sign in to the college competitive coding portal
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

        <form onSubmit={handleLogin}>
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
              College Email
            </label>
            <input
              type="email"
              placeholder="e.g. name@mnit.ac.in"
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
              placeholder="••••••••"
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
            {loading ? "Signing in..." : "Login"}
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
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--accent)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
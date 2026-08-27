import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
import { UserContext } from "../App";
import { api } from "../services/API-Service";
import cog from "../assets/SVG/cog.svg";
import "./css/login.css";

const Login = ({ setUser }) => {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = localStorage.getItem("token");

      if (jwtToken && jwtToken !== "undefined") {
        try {
          setIsLoading(true);

          const response = await api.get("auth", {
            skipGlobalToast: true,
            useLogin: true,
          });

          if (response.result) {
            setUser({ username: response.username });
            addToast(`Logged in as ${response.username}!`, "success");
            navigate("/Dashboard");
          } else {
            localStorage.removeItem("token");
            setError("Authentication Failed");
          }
        } catch (error) {
          setError(`${error?.message || "Unknown Error"}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        return;
      }
    };

    checkAuth();
  }, []);

  const bypass = async () => {
    setIsLoading(true);
    const guestLogin = { username: "Guest", password: "password" };

    try {
      const response = await api.post(
        "login",
        { login: guestLogin },
        { skipGlobalToast: true, useLogin: true },
      );

      if (response.result) {
        localStorage.setItem("token", response.token);
        setUser({ username: "Guest" });
        addToast("Logged in as guest user!", "success");
        navigate("/Dashboard");
      } else {
        localStorage.removeItem("token");
        setError("Guest Bypass Failed");
      }
    } catch (error) {
      setError(`${error?.message || "Unknown Error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!login.username && !login.password) {
      setError("Please fill out Username and Password");
      return;
    } else if (!login.username) {
      setError("Please fill out Username");
      return;
    } else if (!login.password) {
      setError("Please fill out Password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(
        "login",
        { login },
        { skipGlobalToast: true, route },
      );

      if (response.result) {
        localStorage.setItem("token", response.token);
        setUser({ username: login.username });
        navigate("/Dashboard");
      } else {
        localStorage.removeItem("token");
        setError("Invalid username or password");
      }
    } catch (error) {
      setError(`${error?.message || "Unknown Error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (error) {
      setError("");
    }

    setLogin((prev) => ({ ...prev, [id]: value }));
  };

  if (user?.username) {
    return <Navigate to="/Dashboard" />;
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2>LOGIN</h2>

      <div className="login-image">
        <img
          src={cog}
          alt="cog"
          className={`logo ${isLoading ? "spin-fast" : ""}`}
        />
      </div>

      <div className="error-container" role="alert">
        {error && (
          <p id="login-error" className="error-text">
            {error}
          </p>
        )}
      </div>

      <label htmlFor="username" className="form-label">
        Username:
        <input
          type="text"
          className="form-input"
          id="username"
          autoComplete="username"
          aria-required="true"
          aria-describedby={error ? "login-error" : undefined}
          value={login.username}
          onChange={handleChange}
          disabled={isLoading}
        />
      </label>

      <label htmlFor="password" className="form-label">
        Password:
        <input
          type="password"
          className="form-input"
          id="password"
          autoComplete="current-password"
          aria-required="true"
          aria-describedby={error ? "login-error" : undefined}
          value={login.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </label>

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? "Authenticating..." : "Login"}
      </button>

      <button
        type="button"
        className="btn"
        onClick={bypass}
        disabled={isLoading}
      >
        Continue as Guest
      </button>
    </form>
  );
};
export default Login;

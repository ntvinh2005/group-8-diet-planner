import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Copyright from "../components/Copyright";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const usernameValid = username.length >= 3 && username.length <= 24;
  const passwordValid =
    password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password);
  const formValid = emailValid && usernameValid && passwordValid;

  useEffect(() => {
    setApiError("");
  }, [email, username, password]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched({ email: true, username: true, password: true });
    if (!formValid) return;
    setApiError("");
    setLoading(true);
    try {
      const user = await register(email, username, password);
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = err as any;
      setApiError(anyErr?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split min-h-screen flex lg:flex-row flex-col">
      <div
        className="auth-left lg:w-1/2 w-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center p-8 lg:p-12"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(245,158,11,0.92), rgba(234,88,12,0.92)), url('https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white space-y-6 max-w-md">
          <h1 className="text-5xl font-bold tracking-tight">BudgetBits</h1>
          <p className="text-2xl font-light">Eat Better. Spend Smarter.</p>
          <p className="text-amber-100 text-lg">
            Join thousands of students saving money while eating healthy.
          </p>
        </div>
      </div>

      <div className="auth-right lg:w-1/2 w-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6 lg:p-12">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="auth-card w-full max-w-md bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 space-y-6 animate-fadeIn"
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Start planning meals and saving money today
            </p>
          </div>

          {apiError && (
            <div role="alert" aria-live="assertive" className="form-alert mb-4">
              <svg
                className="icon-16"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 9v4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="message">{apiError}</div>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="form-row flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 h-12">
              <svg
                className="icon-16"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M3 8.5L12 13L21 8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="Email address"
                autoComplete="email"
                className="w-full outline-none bg-transparent"
                aria-invalid={!emailValid && touched.email}
                aria-describedby={
                  !emailValid && touched.email ? "email-error" : undefined
                }
              />
            </div>
            {!emailValid && touched.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="form-row flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 h-12">
              <svg
                className="icon-16"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                placeholder="Username"
                autoComplete="username"
                className="w-full outline-none bg-transparent"
                aria-invalid={!usernameValid && touched.username}
                aria-describedby={
                  !usernameValid && touched.username
                    ? "username-error"
                    : undefined
                }
              />
            </div>
            {!usernameValid && touched.username && (
              <p id="username-error" className="mt-2 text-sm text-red-600">
                Username must be 3–24 characters
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="form-row flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 h-12">
              <svg
                className="icon-16"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 15v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="4"
                  y="7"
                  width="16"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full outline-none bg-transparent"
                aria-invalid={!passwordValid && touched.password}
                aria-describedby={
                  !passwordValid && touched.password
                    ? "password-error"
                    : undefined
                }
              />
            </div>
            {!passwordValid && touched.password && (
              <p id="password-error" className="mt-2 text-sm text-red-600">
                Password must be at least 8 characters and include 1 letter and
                1 number
              </p>
            )}
          </div>

          <div className="card-footer">
            <button
              type="submit"
              disabled={!formValid || loading}
              aria-disabled={!formValid || loading}
              className={`primary-btn w-full ${
                !formValid || loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Get Started"}
            </button>

            <div className="divider" aria-hidden></div>

            <div className="text-center text-sm text-gray-600 footer-text">
              Already have an account?{" "}
              <Link to="/login" className="muted-link font-medium">
                Log in
              </Link>
            </div>

            <Copyright />
          </div>
        </form>
      </div>
    </div>
  );
}

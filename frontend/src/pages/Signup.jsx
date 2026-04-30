import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already exists. Try logging in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f3d4a] flex items-center justify-center p-6">
      <div className="flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: "540px" }}>

        {/* Left panel — image only */}
        <div className="hidden md:block relative w-[45%] bg-[#0f3d4a] flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
          />
          {/* logo */}
          <div className="absolute top-6 left-6">
            <div className="w-10 h-10 rounded-full border-2 border-teal-300 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-teal-300" />
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12 relative">
          {/* language pill */}
          <div className="absolute top-5 right-6 text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1">
            English (UK) ▾
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

          {/* Social buttons */}
          <div className="flex gap-3 mb-5">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Sign up with Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="Facebook" />
              Sign up with Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">— OR —</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border-b border-gray-200 py-2 text-sm text-gray-700 outline-none focus:border-teal-600 transition placeholder:text-gray-400 bg-transparent"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b border-gray-200 py-2 text-sm text-gray-700 outline-none focus:border-teal-600 transition placeholder:text-gray-400 bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b border-gray-200 py-2 text-sm text-gray-700 outline-none focus:border-teal-600 transition placeholder:text-gray-400 bg-transparent pr-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-0 bottom-2 text-gray-400 text-base">🔒</span>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-[#0f3d4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#0a2d38] transition disabled:opacity-50 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0f3d4a] font-semibold">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signup;
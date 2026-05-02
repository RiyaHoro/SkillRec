import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaChartLine,
  FaInfoCircle,
  FaUser,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { FaFileAlt } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  const navItem = (to, label, icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        location.pathname === to
          ? "bg-white/10 text-white backdrop-blur-md border border-white/10"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  const handleAboutClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#070816]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Sparkles className="text-white" size={22} />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            SkillSakhi
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {navItem("/", "Home", <FaHome />)}
          <button
            onClick={handleAboutClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition"
          >
            <FaInfoCircle />
            <span>About</span>
          </button>
          {navItem("/form", "Find Career", <FaSearch />)}
          {navItem("/dashboard", "Dashboard", <FaChartLine />)}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {currentUser.email?.charAt(0).toUpperCase()}
              </div>
              {navItem("/resume-generator", "Resume", <FaFileAlt />)}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500/80 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            navItem("/login", "Login", <FaUser />)
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

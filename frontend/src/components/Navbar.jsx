import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBrain,
  FaHome,
  FaSearch,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItem = (to, label, icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
        location.pathname === to
          ? "bg-white/20 text-white"
          : "text-blue-100 hover:bg-white/10 hover:text-white"
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
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
            <FaBrain className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold">SkillSakhi</h1>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navItem("/", "Home", <FaHome />)}
          {navItem("/form", "Find Career", <FaSearch />)}
          {navItem("/results", "Dashboard", <FaChartLine />)}

          <button
            onClick={handleAboutClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition"
          >
            <FaInfoCircle />
            <span>About</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
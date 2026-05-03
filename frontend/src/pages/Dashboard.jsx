import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHeart,
  FaRedo,
  FaUserCircle,
  FaFileAlt,
  FaSearch,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const userKey = `saved_careers_${currentUser?.uid}`;
  const savedCareers = JSON.parse(localStorage.getItem(userKey)) || [];

  const lastResult =
    JSON.parse(localStorage.getItem("skillsakhi_results")) || {};
  const careers = lastResult.recommended_careers || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#070816] px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-5xl text-white/90" />
            <div>
              <h1 className="text-4xl font-extrabold">Welcome Back</h1>
              <p className="text-indigo-100 mt-1">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/form")}
              className="bg-white text-indigo-700 px-5 py-3 rounded-xl font-bold hover:bg-indigo-50"
            >
              New Recommendation
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <StatCard
            title="Saved Careers"
            value={savedCareers.length}
            icon={<FaHeart />}
            color="text-red-500"
          />
          <StatCard
            title="Last Recommendations"
            value={careers.length}
            icon={<FaChartLine />}
            color="text-indigo-500"
          />
          <StatCard
            title="Profile Status"
            value="Active"
            icon={<FaUserCircle />}
            color="text-green-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <ActionCard
            title="Get Career Recommendations"
            desc="Fill your profile and get personalized career suggestions."
            icon={<FaSearch />}
            button="Start Analysis"
            onClick={() => navigate("/form")}
            color="from-blue-600 to-cyan-500"
          />

          <ActionCard
            title="Resume & Cover Letter"
            desc="Generate editable resume and cover letter formats."
            icon={<FaFileAlt />}
            button="Open Generator"
            onClick={() => navigate("/resume-generator")}
            color="from-green-600 to-emerald-500"
          />

          <ActionCard
            title="View Last Results"
            desc="Review your previous career matches and skill gaps."
            icon={<FaRedo />}
            button="View Results"
            onClick={() => navigate("/results")}
            color="from-purple-600 to-pink-500"
          />
        </div>

        {/* Saved + Last Results */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <Panel title="Saved Careers" icon={<FaHeart className="text-red-500" />}>
            {savedCareers.length === 0 ? (
              <p className="text-gray-500">No saved careers yet.</p>
            ) : (
              <div className="space-y-4">
                {savedCareers.map((career, i) => (
                  <CareerMiniCard key={i} career={career} type="saved" />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Recent Recommendations" icon={<FaRedo className="text-indigo-600" />}>
            {careers.length === 0 ? (
              <p className="text-gray-500">No recommendations generated yet.</p>
            ) : (
              <div className="space-y-4">
                {careers.slice(0, 3).map((career, i) => (
                  <CareerMiniCard key={i} career={career} type="result" />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white text-gray-900 rounded-3xl shadow-lg p-6">
      <div className={`text-3xl ${color} mb-4`}>{icon}</div>
      <p className="text-gray-500 font-semibold">{title}</p>
      <h2 className="text-4xl font-extrabold mt-2">{value}</h2>
    </div>
  );
}

function ActionCard({ title, desc, icon, button, onClick, color }) {
  return (
    <div className="bg-white text-gray-900 rounded-3xl shadow-lg p-6 hover:-translate-y-1 transition">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} text-white flex items-center justify-center text-2xl mb-5`}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{desc}</p>

      <button
        onClick={onClick}
        className="flex items-center gap-2 font-bold text-indigo-600 hover:gap-3 transition-all"
      >
        {button} <FaArrowRight />
      </button>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="bg-white text-gray-900 rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function CareerMiniCard({ career, type }) {
  const match = Math.round(career.match_score || 0);

  return (
    <div className="border rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition">
      <h3 className="font-bold text-lg">{career.career_name}</h3>
      <p className="text-sm text-gray-500">{career.category}</p>

      <div className="mt-3 flex justify-between text-sm">
        {type === "saved" ? (
          <span>Readiness: {career.readiness_score || 0}%</span>
        ) : (
          <span>Match: {match}%</span>
        )}

        <span className="text-indigo-600 font-semibold">SkillSakhi</span>
      </div>
    </div>
  );
}

export default Dashboard;
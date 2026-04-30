import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRedo, FaUserCircle } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const userKey = `saved_careers_${currentUser?.uid}`;
  const savedCareers = JSON.parse(localStorage.getItem(userKey)) || [];

  const lastResult = JSON.parse(localStorage.getItem("skillsakhi_results")) || {};
  const careers = lastResult.recommended_careers || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#070816] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl text-indigo-300" />
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-slate-300">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/form")}
              className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold"
            >
              New Recommendation
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-xl font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <Stat title="Saved Careers" value={savedCareers.length} />
          <Stat title="Last Recommendations" value={careers.length} />
          <Stat title="Profile Mode" value="Active" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <FaHeart className="text-red-500" /> Saved Careers
            </h2>

            {savedCareers.length === 0 ? (
              <p className="text-gray-500">No saved careers yet.</p>
            ) : (
              <div className="space-y-4">
                {savedCareers.map((career, i) => (
                  <div key={i} className="border rounded-2xl p-4">
                    <h3 className="font-bold text-lg">{career.career_name}</h3>
                    <p className="text-sm text-gray-500">{career.category}</p>
                    <p className="text-sm mt-2">
                      Readiness: {career.readiness_score || 0}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <FaRedo className="text-indigo-600" /> Last Results
            </h2>

            {careers.length === 0 ? (
              <p className="text-gray-500">No recommendations generated yet.</p>
            ) : (
              <div className="space-y-4">
                {careers.slice(0, 3).map((career, i) => (
                  <div key={i} className="border rounded-2xl p-4">
                    <h3 className="font-bold text-lg">{career.career_name}</h3>
                    <p className="text-sm text-gray-500">{career.category}</p>
                    <p className="text-sm mt-2">
                      Match: {Math.round((career.match_score || 0) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <p className="text-gray-500 font-semibold">{title}</p>
      <h2 className="text-4xl font-extrabold text-indigo-600 mt-2">{value}</h2>
    </div>
  );
}

export default Dashboard;
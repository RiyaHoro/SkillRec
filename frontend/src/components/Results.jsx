import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedData = JSON.parse(localStorage.getItem("skillsakhi_results"));
  const data = location.state || savedData || {};
  const user_profile = data.user_profile || {};
  const recommended_jobs = Array.isArray(data.recommended_jobs)
    ? data.recommended_jobs
    : [];

  if (recommended_jobs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No recommendation data found
          </h2>
          <p className="text-gray-600 mb-6">
            This can happen if you refreshed the results page or the backend did
            not send recommendation data.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/form")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Form
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topJob = recommended_jobs[0];

  const requiredSkills = Array.isArray(topJob.required_skills)
    ? topJob.required_skills
    : [];

  const missingSkills = Array.isArray(topJob.missing_skills)
    ? topJob.missing_skills
    : [];

  const skillGapData = requiredSkills.map((skill) => ({
    skill,
    status: missingSkills.includes(skill) ? 0 : 1,
  }));

  const pieData = [
    {
      name: "Matched Skills",
      value: requiredSkills.length - missingSkills.length,
    },
    {
      name: "Missing Skills",
      value: missingSkills.length,
    },
  ];
  
  const COLORS = ["#2563eb", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Your Career Recommendations
        </h1>
        <p className="text-gray-600 mb-8">
          Based on your profile, here are the most suitable job roles and skill insights.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Age:</span> {user_profile.age || "N/A"}</p>
              <p><span className="font-semibold">Education:</span> {user_profile.education || "N/A"}</p>
              <p><span className="font-semibold">Interests:</span> {user_profile.interests || "N/A"}</p>
              <p><span className="font-semibold">Skills:</span> {user_profile.skills || "N/A"}</p>
              <p><span className="font-semibold">Career Goal:</span> {user_profile.career_goal || "N/A"}</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Top Recommended Role</h2>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {topJob.job_title || "N/A"}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Match Score:</span>{" "}
              {Math.round((topJob.match_score || 0) * 100)}%
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Required Skills:</span>{" "}
              {requiredSkills.length ? requiredSkills.join(", ") : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Missing Skills:</span>{" "}
              {missingSkills.length ? missingSkills.join(", ") : "None"}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Skill Gap Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillGapData}>
                <XAxis dataKey="skill" />
                <YAxis ticks={[0, 1]} />
                <Tooltip />
                <Bar dataKey="status" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-3">
              1 = already has skill, 0 = needs upskilling
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Skill Match Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Other Suitable Job Roles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recommended_jobs.map((job, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {job.job_title || "Untitled Role"}
                </h3>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Match:</span>{" "}
                  {Math.round((job.match_score || 0) * 100)}%
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Missing Skills:</span>{" "}
                  {Array.isArray(job.missing_skills) && job.missing_skills.length > 0
                    ? job.missing_skills.join(", ")
                    : "None"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
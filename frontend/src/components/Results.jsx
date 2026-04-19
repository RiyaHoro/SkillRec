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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6">
        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 text-center text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-3">No Results Found</h2>
          <p className="text-slate-300 mb-6">
            Recommendation data was not found. Please fill the form again.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/form")}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Go to Form
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-white/10 px-6 py-3 font-semibold hover:bg-white/20 transition"
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

  const matchedSkillsCount = Math.max(requiredSkills.length - missingSkills.length, 0);

  const pieData = [
    { name: "Matched Skills", value: matchedSkillsCount },
    { name: "Missing Skills", value: missingSkills.length },
  ];

  const COLORS = ["#3b82f6", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-blue-300 uppercase tracking-[0.2em] text-sm mb-2">
            SkillSakhi Results
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Your Career Recommendations
          </h1>
          <p className="text-slate-300 text-lg">
            Based on your profile, here are the most suitable job roles and skill insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="rounded-3xl bg-white p-8 text-slate-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Profile Summary</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Age</p>
                <p className="text-lg font-semibold">{user_profile.age || "N/A"}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Education</p>
                <p className="text-lg font-semibold">{user_profile.education || "N/A"}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Interests</p>
                <p className="text-lg font-semibold">{user_profile.interests || "N/A"}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(user_profile.skills || "")
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Career Goal</p>
                <p className="text-lg font-semibold">{user_profile.career_goal || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Top Recommended Role</h2>
            <p className="text-4xl font-extrabold text-blue-300 mb-4">
              {topJob.job_title || "N/A"}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="rounded-full border border-blue-400/20 bg-blue-500/20 px-4 py-2 text-sm text-blue-200">
                Match Score: {Math.round((topJob.match_score || 0) * 100)}%
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200">
                Required: {requiredSkills.length}
              </span>
              <span className="rounded-full border border-amber-400/20 bg-amber-500/20 px-4 py-2 text-sm text-amber-200">
                Missing: {missingSkills.length}
              </span>
            </div>

            <div className="mb-5">
              <p className="text-sm text-slate-300 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.length ? (
                  requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-300">N/A</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-300 mb-2">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length ? (
                  missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-300">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="rounded-3xl bg-white p-6 text-slate-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Skill Gap Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillGapData}>
                <XAxis dataKey="skill" />
                <YAxis ticks={[0, 1]} />
                <Tooltip />
                <Bar dataKey="status" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-3 text-sm text-slate-500">
              1 = skill matched, 0 = needs improvement
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Skill Match Overview</h2>
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

        <div className="rounded-3xl bg-white p-8 text-slate-800 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Other Suitable Job Roles</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommended_jobs.map((job, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-800">
                  {job.job_title || "Untitled Role"}
                </h3>
                <p className="mt-3 text-slate-600">
                  <span className="font-semibold">Match:</span>{" "}
                  {Math.round((job.match_score || 0) * 100)}%
                </p>
                <p className="mt-2 text-slate-600">
                  <span className="font-semibold">Missing Skills:</span>{" "}
                  {Array.isArray(job.missing_skills) && job.missing_skills.length > 0
                    ? job.missing_skills.join(", ")
                    : "None"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/form")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-white/10 px-6 py-3 font-semibold hover:bg-white/20 transition"
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
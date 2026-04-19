import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedData = JSON.parse(localStorage.getItem("skillsakhi_results"));
  const data = location.state || savedData || {};

  const userProfile = data.user_profile || {};
  const careers = Array.isArray(data.recommended_careers)
    ? data.recommended_careers
    : [];

  if (careers.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[-80px] top-[-40px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute right-[-90px] top-[20%] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-80px] left-[30%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
        </div>

        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
            <h2 className="mb-3 text-3xl font-bold text-white">
              No recommendation data found
            </h2>
            <p className="mb-6 text-slate-300">
              Please fill the form again to get recommendations.
            </p>
            <button
              onClick={() => navigate("/form")}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5"
            >
              Go to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topCareer = careers[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-80px] top-[-40px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-90px] top-[20%] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-80px] left-[30%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_35%)]"></div>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 backdrop-blur">
            SkillSakhi Results
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
            Your Recommended
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {" "}Career Paths
            </span>
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Based on your profile, here are the most relevant career and livelihood options.
          </p>
        </div>

        {/* Top highlight */}
        <div className="mb-8 rounded-[30px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-300">
                Top Recommendation
              </p>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                {topCareer.career_name || "N/A"}
              </h2>
              <p className="mt-2 text-cyan-200">{topCareer.category || "General"}</p>
            </div>

            <div className="min-w-[260px]">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Match Score</span>
                <span>{Math.round((topCareer.match_score || 0) * 100)}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${Math.round((topCareer.match_score || 0) * 100)}%` }}
                ></div>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Best-fit career path based on your profile details.
              </p>
            </div>
          </div>
        </div>

        {/* Profile summary */}
        <div className="mb-8 rounded-[30px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Profile Summary</h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
              <p className="text-sm text-slate-400">Age</p>
              <p className="mt-1 text-lg font-semibold text-white">{userProfile.age || "N/A"}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
              <p className="text-sm text-slate-400">Education</p>
              <p className="mt-1 text-lg font-semibold text-white">{userProfile.education || "N/A"}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
              <p className="text-sm text-slate-400">Career Goal</p>
              <p className="mt-1 text-lg font-semibold text-white">{userProfile.career_goal || "N/A"}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-slate-400">Preferred Work Type</p>
              <p className="mt-1 text-lg font-semibold capitalize text-white">
                {userProfile.preferred_work_type || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-slate-400">Preferred Work Mode</p>
              <p className="mt-1 text-lg font-semibold capitalize text-white">
                {userProfile.preferred_work_mode || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-slate-400">Interests</p>
              <p className="mt-1 text-lg font-semibold text-white">{userProfile.interests || "N/A"}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10 md:col-span-2 xl:col-span-3">
              <p className="text-sm text-slate-400">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(userProfile.skills || "")
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career cards */}
        <div className="grid gap-6">
          {careers.map((career, index) => {
            const matchPercent = Math.round((career.match_score || 0) * 100);

            return (
              <div
                key={index}
                className="group rounded-[30px] border border-white/10 bg-white/10 p-7 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                      {career.career_name}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-cyan-200">
                      {career.category}
                    </p>
                  </div>

                  <div className="inline-flex w-fit rounded-full border border-violet-400/20 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200">
                    Match Score: {matchPercent}%
                  </div>
                </div>

                <p className="mb-6 leading-7 text-slate-300">
                  {career.description}
                </p>

                <div className="mb-6">
                  <div className="mb-2 flex justify-between text-sm text-slate-300">
                    <span>Career Match</span>
                    <span>{matchPercent}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${matchPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <h3 className="mb-3 font-semibold text-white">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {career.required_skills?.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <h3 className="mb-3 font-semibold text-white">Missing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {career.missing_skills?.length > 0 ? (
                        career.missing_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-200"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">
                          No major skill gaps
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <h3 className="mb-3 font-semibold text-white">Matched Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {career.matched_skills?.length > 0 ? (
                        career.matched_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          No direct skill match found
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <h3 className="mb-3 font-semibold text-white">Work Details</h3>
                    <p className="mb-2 text-slate-300">
                      <span className="font-medium text-white">Opportunity:</span>{" "}
                      {career.opportunity_type}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium text-white">Work Mode:</span>{" "}
                      {career.work_mode}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                  <h3 className="mb-2 font-semibold text-cyan-200">
                    Suggested Training Resources
                  </h3>
                  <p className="leading-7 text-slate-300">
                    {career.training_resource}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/form")}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition duration-300 hover:bg-white/15"
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
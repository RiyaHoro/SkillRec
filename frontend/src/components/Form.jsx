import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    education: "",
    interests: "",
    skills: "",
    career_goal: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://skillrec.onrender.com/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await res.json();

      localStorage.setItem("skillsakhi_results", JSON.stringify(data));
      navigate("/results", { state: data });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while getting recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
          <p className="text-sm uppercase tracking-widest text-blue-100 mb-3">
            SkillSakhi
          </p>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Discover the right career path for you
          </h2>
          <p className="text-blue-100 text-lg leading-7">
            Fill in your profile details and get personalized career recommendations,
            skill-gap analysis, and guidance for your next steps.
          </p>

          <div className="mt-8 space-y-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <h3 className="font-semibold text-lg">🎯 Personalized Suggestions</h3>
              <p className="text-sm text-blue-100 mt-1">
                Recommendations based on your interests and goals.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <h3 className="font-semibold text-lg">📈 Career Growth Focus</h3>
              <p className="text-sm text-blue-100 mt-1">
                Understand what to learn next to move ahead faster.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="bg-white p-8 md:p-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Fill Your Profile
          </h1>
          <p className="text-slate-500 mb-8">
            Enter your details to get career recommendations tailored to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Education
              </label>
              <input
                type="text"
                name="education"
                placeholder="e.g. B.Tech CSE, BCA, 12th pass"
                value={formData.education}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Interests
              </label>
              <input
                type="text"
                name="interests"
                placeholder="e.g. analytics, coding, design"
                value={formData.interests}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. Python, Excel, HTML, communication"
                value={formData.skills}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Career Goal
              </label>
              <input
                type="text"
                name="career_goal"
                placeholder="e.g. Data Analyst, Full Stack Developer"
                value={formData.career_goal}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-white font-semibold shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Analyzing..." : "Get Recommendations"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
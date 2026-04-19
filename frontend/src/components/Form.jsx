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
    preferred_work_type: "",
    preferred_work_mode: "",
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
      setError("Unable to fetch recommendations right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-12">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-80px] top-[-60px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-100px] top-[20%] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-80px] left-[30%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_35%)]"></div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left content */}
        <div className="text-white">
          <span className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 backdrop-blur">
            SkillSakhi Career Form
          </span>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Build your next
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {" "}career path
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Tell us about your education, skills, interests, and work preferences.
            We’ll turn that into personalized recommendations that feel more useful
            and more realistic.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10">
              <h3 className="mb-2 font-semibold text-cyan-200">Smart Matching</h3>
              <p className="text-sm text-slate-300">
                Find roles aligned with your profile and goals.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10">
              <h3 className="mb-2 font-semibold text-violet-200">Skill Insights</h3>
              <p className="text-sm text-slate-300">
                See what you already have and what to improve next.
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Fill Your Profile</h2>
            <p className="mt-2 text-slate-300">
              Enter your details to get career, livelihood, and skill recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Education
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
                required
              >
                <option value="" className="text-black">Select Education</option>
                <option value="8th" className="text-black">8th Pass</option>
                <option value="10th" className="text-black">10th Pass</option>
                <option value="12th" className="text-black">12th Pass</option>
                <option value="Graduate" className="text-black">Graduate</option>
                <option value="Postgraduate" className="text-black">Postgraduate</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Interests
              </label>
              <input
                type="text"
                name="interests"
                placeholder="e.g. coding, design, analytics"
                value={formData.interests}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. Python, SQL, Communication"
                value={formData.skills}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Career Goal
              </label>
              <input
                type="text"
                name="career_goal"
                placeholder="e.g. Web Developer, Data Analyst"
                value={formData.career_goal}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Preferred Work Type
              </label>
              <select
                name="preferred_work_type"
                value={formData.preferred_work_type}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
              >
                <option value="" className="text-black">Preferred Work Type</option>
                <option value="job" className="text-black">Job</option>
                <option value="self-employment" className="text-black">Self Employment</option>
                <option value="freelance" className="text-black">Freelance</option>
                <option value="business" className="text-black">Business</option>
                <option value="any" className="text-black">Any</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Preferred Work Mode
              </label>
              <select
                name="preferred_work_mode"
                value={formData.preferred_work_mode}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition duration-300 focus:border-cyan-400 focus:bg-white/15 focus:ring-2 focus:ring-cyan-400/30"
              >
                <option value="" className="text-black">Preferred Work Mode</option>
                <option value="home" className="text-black">Home</option>
                <option value="office" className="text-black">Office</option>
                <option value="flexible" className="text-black">Flexible</option>
                <option value="shop" className="text-black">Shop</option>
                <option value="any" className="text-black">Any</option>
              </select>
            </div>

            {error && (
              <div className="md:col-span-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-3.5 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition duration-300 group-hover:translate-y-0"></span>
              <span className="relative">
                {loading ? "Analyzing your profile..." : "Get Recommendations"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
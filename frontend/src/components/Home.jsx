import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaUserGraduate,
  FaChartLine,
  FaBookOpen,
  FaBriefcase,
  FaHeart,
  FaLightbulb,
} from "react-icons/fa";

function Home() {
  return (
    <main className="min-h-screen bg-[#070816] text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-purple-200 text-sm font-medium mb-6">
            <FaHeart className="text-pink-400" />
            Built for students, women, and career restarters
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Discover a Career
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              That Fits You
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 leading-8 max-w-xl">
            SkillSakhi helps you find practical career options based on your
            skills, education, interests, and life stage — with clear learning
            steps to move forward.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/form"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-900/40 hover:scale-105 transition"
            >
              Start Career Finder <FaArrowRight />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/15 transition"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl">
            {[
              "Skill-based career recommendations",
              "Career restart friendly paths",
              "Skill gap analysis",
              "Learning resources",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-2xl px-5 py-4"
              >
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <FaCheck />
                </span>
                <p className="text-gray-200 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2rem] blur opacity-40"></div>

          <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Your Guidance Journey</h2>

            <div className="space-y-5">
              {[
                {
                  no: "01",
                  icon: <FaUserGraduate />,
                  title: "Understand Your Profile",
                  desc: "Skills, interests, education, and career stage",
                },
                {
                  no: "02",
                  icon: <FaBriefcase />,
                  title: "Find Suitable Careers",
                  desc: "Career matches with confidence and readiness score",
                },
                {
                  no: "03",
                  icon: <FaBookOpen />,
                  title: "Learn What Is Missing",
                  desc: "Courses, roadmap, and skill gap guidance",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 bg-[#101225] border border-white/10 rounded-2xl p-5 hover:bg-[#151832] transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold">
                    {step.no}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-purple-300 mb-1">
                      {step.icon}
                      <h3 className="text-white font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-7">
              <div className="bg-[#101225] border border-white/10 rounded-2xl p-5">
                <FaChartLine className="text-purple-400 text-2xl mb-3" />
                <h3 className="font-bold">Career Match</h3>
                <p className="text-gray-400 text-sm mt-1">
                  See how well a career fits your profile.
                </p>
              </div>

              <div className="bg-[#101225] border border-white/10 rounded-2xl p-5">
                <FaLightbulb className="text-pink-400 text-2xl mb-3" />
                <h3 className="font-bold">Smart Suggestions</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Get skills, courses, and next-step guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-extrabold">
            Why SkillSakhi Feels Different
          </h2>
          <p className="text-gray-400 mt-4">
            It does not only suggest careers. It explains why a career is
            suitable and what skills are needed next.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaUserGraduate />,
              title: "Profile-Based Guidance",
              desc: "Uses education, skills, interests, and age group to personalize recommendations.",
            },
            {
              icon: <FaChartLine />,
              title: "Readiness Score",
              desc: "Shows how prepared the user is for a selected career path.",
            },
            {
              icon: <FaBookOpen />,
              title: "Skill Gap Analysis",
              desc: "Identifies missing skills and suggests learning resources.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/8 border border-white/10 rounded-3xl p-7 hover:-translate-y-2 hover:bg-white/12 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-7">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-white/10 rounded-[2rem] p-10 md:p-14">
          <h2 className="text-4xl font-extrabold mb-5">About SkillSakhi</h2>
          <p className="text-gray-300 leading-8 max-w-4xl">
            SkillSakhi is a demographic-aware career and skill recommendation
            platform designed to help users, especially women and career
            restarters, identify suitable careers, understand missing skills,
            and follow practical learning paths.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
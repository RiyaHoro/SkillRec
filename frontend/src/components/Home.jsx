import { useNavigate } from "react-router-dom";
import { FaRocket, FaInfoCircle, FaArrowDown } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    const section = document.getElementById("about");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#eef4ff] min-h-screen">
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Career Path with AI
              <span className="block text-yellow-300">Intelligence</span>
            </h1>

            <p className="mt-8 text-xl text-blue-100 leading-9 max-w-2xl">
              Get personalized career recommendations powered by machine learning.
              Analyze your skills, interests, education, and goals to find the
              most suitable career path, learning roadmap, and opportunity type.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/form")}
                className="flex items-center gap-3 bg-blue-900 hover:bg-blue-950 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
              >
                <FaRocket />
                Start Career Assessment
              </button>

              <button
                onClick={scrollToAbout}
                className="flex items-center gap-3 border border-white/40 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
              >
                <FaInfoCircle />
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl">
              <div>
                <h3 className="text-5xl font-bold">95+</h3>
                <p className="text-blue-100 mt-2">Accuracy</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold">1000+</h3>
                <p className="text-blue-100 mt-2">Users Helped</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold">50+</h3>
                <p className="text-blue-100 mt-2">Career Paths</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-yellow-300 rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl w-full max-w-xl">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                alt="AI Career Guidance"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-8 text-white/90">
          <FaArrowDown className="text-3xl animate-bounce" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-blue-900 mb-12">
          Why Choose Our System?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              AI Recommendations
            </h3>
            <p className="text-gray-600 leading-7">
              Uses hybrid recommendation logic with rule-based filtering and TF-IDF
              matching for personalized guidance.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              Skill Gap Analysis
            </h3>
            <p className="text-gray-600 leading-7">
              Identifies matched and missing skills so users know what to improve next.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              Learning Roadmap
            </h3>
            <p className="text-gray-600 leading-7">
              Suggests courses, training resources, and a practical path to begin or
              restart a career.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-blue-900 mb-10">
            About Our System
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-8 mb-6">
                AI Career Guidance is an intelligent platform that helps users discover
                the most suitable career paths based on their skills, interests,
                education, and experience.
              </p>

              <p className="text-lg text-gray-700 leading-8 mb-6">
                It uses a hybrid recommendation system combining rule-based filtering
                and machine learning using TF-IDF to provide personalized career insights.
              </p>

              <p className="text-lg text-gray-700 leading-8">
                The system also performs skill gap analysis, suggests learning
                resources, and provides a structured roadmap to achieve career goals.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
                alt="AI Career System"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                AI Recommendations
              </h3>
              <p className="text-gray-600">
                Uses machine learning to suggest personalized career paths.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Skill Gap Analysis
              </h3>
              <p className="text-gray-600">
                Identifies missing skills and helps users improve.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Career Roadmap
              </h3>
              <p className="text-gray-600">
                Provides step-by-step learning and growth plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
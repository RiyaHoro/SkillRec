import { useNavigate } from "react-router-dom";
import About from "./About";
import ContactUs from "./ContactUs";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
        <Navbar />
      {/* 🔥 HERO SECTION (Dark Premium) */}
      <section id="home" className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Empower Your Career with{" "}
              <span className="text-blue-400">SkillSakhi</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8">
              Discover the best career paths based on your skills, interests,
              and goals.
            </p>

            <button  onClick={() => navigate("/Form")} className="bg-blue-500 px-8 py-3 rounded-xl hover:bg-blue-600 transition" >
              Get Started
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* ✨ FEATURES (Clean White) */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Why Choose SkillSakhi?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">
                🎯 Smart Recommendations
              </h3>
              <p className="text-gray-600">
                Get career suggestions tailored to your profile.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">📊 Skill Gap Analysis</h3>
              <p className="text-gray-600">
                Identify missing skills for your dream job.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">🚀 Upskilling Guidance</h3>
              <p className="text-gray-600">
                Learn what to study next step-by-step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💜 ABOUT SECTION (Purple Soft) */}
      <section id="about" className="bg-purple-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-purple-700 mb-6">
            About SkillSakhi
          </h2>

          <p className="text-gray-700 text-lg leading-8">
            SkillSakhi helps students discover the right career path based on
            their skills, interests, and goals. We provide smart
            recommendations, skill-gap insights, and a clear roadmap to success.
          </p>
        </div>
      </section>

      {/* 💙 CONTACT SECTION (Blue Card UI) */}
      <section id="contact" className="bg-blue-100 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
            Contact Us
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border px-4 py-3 rounded-lg"
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full border px-4 py-3 rounded-lg"
              ></textarea>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

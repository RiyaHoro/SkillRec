import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-20 px-6">
      
      {/* Hero Section */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Empower Your Career with <span className="text-blue-600">SkillSakhi</span>
      </h1>

      <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
        Discover the best career paths based on your skills, interests, and goals.
        Get personalized recommendations and upskill for your dream job.
      </p>

      <button
        onClick={() => navigate("/form")}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700"
      >
        Fill Your Profile
      </button>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        
        <div className="p-6 shadow-lg rounded-xl">
          <h3 className="font-semibold text-lg">🎯 Smart Recommendations</h3>
          <p className="text-gray-600 mt-2">
            Get career suggestions based on your skills and interests.
          </p>
        </div>

        <div className="p-6 shadow-lg rounded-xl">
          <h3 className="font-semibold text-lg">📊 Skill Gap Analysis</h3>
          <p className="text-gray-600 mt-2">
            Identify missing skills needed for your dream job.
          </p>
        </div>

        <div className="p-6 shadow-lg rounded-xl">
          <h3 className="font-semibold text-lg">🚀 Upskilling Guidance</h3>
          <p className="text-gray-600 mt-2">
            Learn what to study next to grow your career.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-3">
            No recommendation data found
          </h2>
          <p className="text-gray-400 mb-6">
            Please fill the form again to get recommendations.
          </p>
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          Your Career Recommendations
        </h1>
        <p className="text-gray-400 mb-10">
          Personalized career, livelihood, and skill guidance based on your
          profile.
        </p>

        {/* Profile */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-10 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Profile Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-300">
            <p>
              <span className="text-gray-500">Age:</span>{" "}
              {userProfile.age || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Education:</span>{" "}
              {userProfile.education || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Interests:</span>{" "}
              {userProfile.interests || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Skills:</span>{" "}
              {userProfile.skills || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Career Goal:</span>{" "}
              {userProfile.career_goal || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Work Type:</span>{" "}
              {userProfile.preferred_work_type || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Work Mode:</span>{" "}
              {userProfile.preferred_work_mode || "N/A"}
            </p>
          </div>
        </div>

        {/* Career Cards */}
        <div className="space-y-10">
          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
            >
              {/* Title */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {career.career_name}
                  </h2>
                  <p className="text-blue-400 text-sm">{career.category}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {career.work_mode?.includes("home") && (
                      <span className="bg-pink-900 text-pink-300 px-3 py-1 rounded-full text-xs">
                        Home-Friendly
                      </span>
                    )}
                    {career.opportunity_type?.includes("self") && (
                      <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-xs">
                        Self-Employment
                      </span>
                    )}
                    {career.work_mode?.includes("flexible") && (
                      <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs">
                        Flexible
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 lg:mt-0 bg-blue-900 text-blue-300 px-4 py-2 rounded-full text-sm">
                  Match: {Math.round((career.match_score || 0) * 100)}%
                </div>
              </div>

              <p className="text-gray-400 mb-6">{career.description}</p>

              {/* Skills */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Required */}
                <div>
                  <h3 className="font-semibold mb-2 text-gray-300">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {career.required_skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <h3 className="font-semibold mb-2 text-gray-300">
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {career.missing_skills?.length > 0 ? (
                      career.missing_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-red-900 text-red-300 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                        No major gaps
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Courses */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-blue-300">
                  Courses & Training
                </h3>

                {career.training_resources &&
                career.training_resources.length > 0 ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {career.training_resources.map((course, i) => (
                      <div
                        key={i}
                        className="bg-gray-800 rounded-xl p-4 hover:shadow-lg transition"
                      >
                        <h4 className="font-semibold text-white mb-1">
                          {course.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-2">
                          {course.platform}
                        </p>
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                          {course.level}
                        </span>

                        <a
                          href={course.link}
                          target="_blank"
                          rel="noreferrer"
                          className="block mt-4 text-center bg-blue-600 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Start Course
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No structured course data available for this recommendation
                    yet.
                  </p>
                )}
              </div>

              {/* Roadmap */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-300">
                  Learning Roadmap
                </h3>

                <div className="border-l-2 border-blue-700 ml-2 space-y-5">
                  {career.learning_roadmap?.map((step, i) => (
                    <div key={i} className="pl-6 relative">
                      <div className="absolute -left-3 top-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
                        {step.step}
                      </div>

                      <div className="bg-gray-800 p-4 rounded-xl">
                        <h4 className="font-semibold text-white">
                          {step.title}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-800 px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-md rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">No recommendation data found</h2>
          <p className="text-gray-600 mb-5">
            Please fill the form again to get recommendations.
          </p>
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Your Recommended Career Paths
        </h1>
        <p className="text-gray-600 mb-8">
          Based on your profile, here are the most relevant career and livelihood options.
        </p>

        <div className="bg-white shadow rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-700">
            <p><span className="font-semibold">Age:</span> {userProfile.age || "N/A"}</p>
            <p><span className="font-semibold">Education:</span> {userProfile.education || "N/A"}</p>
            <p><span className="font-semibold">Interests:</span> {userProfile.interests || "N/A"}</p>
            <p><span className="font-semibold">Skills:</span> {userProfile.skills || "N/A"}</p>
            <p><span className="font-semibold">Career Goal:</span> {userProfile.career_goal || "N/A"}</p>
            <p><span className="font-semibold">Preferred Work Type:</span> {userProfile.preferred_work_type || "N/A"}</p>
            <p><span className="font-semibold">Preferred Work Mode:</span> {userProfile.preferred_work_mode || "N/A"}</p>
          </div>
        </div>

        <div className="grid gap-8">
          {careers.map((career, index) => (
            <div key={index} className="bg-white shadow rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{career.career_name}</h2>
                  <p className="text-sm text-blue-600 font-medium">{career.category}</p>
                </div>
                <div className="mt-3 lg:mt-0 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Match Score: {Math.round((career.match_score || 0) * 100)}%
                </div>
              </div>

              <p className="text-gray-700 mb-5">{career.description}</p>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.required_skills?.map((skill, idx) => (
                      <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Matched Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.matched_skills?.length > 0 ? (
                      career.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No direct matches yet</span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 lg:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-3">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.missing_skills?.length > 0 ? (
                      career.missing_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        No major skill gaps
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Work Details</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Opportunity Type:</span> {career.opportunity_type}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Work Mode:</span> {career.work_mode}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Quick Guidance</h3>
                  <p className="text-gray-700 text-sm">
                    Start with beginner-friendly learning resources, practice the missing skills,
                    and then move toward portfolio building or real opportunities.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Suggested Course Cards
                </h3>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {career.training_resources?.length > 0 ? (
                    career.training_resources.map((course, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-semibold text-gray-800">
                            {course.title}
                          </h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {course.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Platform: {course.platform}
                        </p>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
                          Start Learning
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No structured courses available.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Learning Roadmap
                </h3>

                <div className="space-y-4">
                  {career.learning_roadmap?.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start bg-gray-50 rounded-xl p-4"
                    >
                      <div className="min-w-[42px] h-[42px] rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {step.step}
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
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

        <div className="mt-8 flex gap-4">
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
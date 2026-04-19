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
      <div className="max-w-6xl mx-auto">
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

        <div className="grid gap-6">
          {careers.map((career, index) => (
            <div key={index} className="bg-white shadow rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{career.career_name}</h2>
                  <p className="text-sm text-blue-600 font-medium">{career.category}</p>
                </div>
                <div className="mt-3 md:mt-0 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Match Score: {Math.round((career.match_score || 0) * 100)}%
                </div>
              </div>

              <p className="text-gray-700 mb-4">{career.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.required_skills?.map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.missing_skills?.length > 0 ? (
                      career.missing_skills.map((skill, idx) => (
                        <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
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

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Matched Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.matched_skills?.length > 0 ? (
                      career.matched_skills.map((skill, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No direct skill match found</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Work Details</h3>
                  <p className="text-gray-700"><span className="font-medium">Opportunity:</span> {career.opportunity_type}</p>
                  <p className="text-gray-700"><span className="font-medium">Work Mode:</span> {career.work_mode}</p>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-gray-800 mb-2">Suggested Training Resources</h3>
                <p className="text-gray-700">{career.training_resource}</p>
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
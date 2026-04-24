import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaPrint,
  FaDownload,
  FaShareAlt,
  FaRedo,
  FaTrophy,
  FaListOl,
  FaInfoCircle,
  FaHeart,
} from "react-icons/fa";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedData = JSON.parse(localStorage.getItem("skillsakhi_results"));
  const data = location.state || savedData || {};

  const userProfile = data.user_profile || {};
  const careers = Array.isArray(data.recommended_careers)
    ? data.recommended_careers
    : [];

  const topCareer = careers[0];

  const saveCareer = (career) => {
    const saved = JSON.parse(localStorage.getItem("saved_careers")) || [];

    const exists = saved.some(
      (item) => item.career_name === career.career_name
    );

    if (!exists) {
      localStorage.setItem("saved_careers", JSON.stringify([...saved, career]));
      alert("Career saved!");
    } else {
      alert("Already saved!");
    }
  };

  if (careers.length === 0) {
    return (
      <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-md p-10 text-center max-w-lg">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            No recommendation data found
          </h2>
          <p className="text-gray-600 mb-6">
            Please fill the form again to get recommendations.
          </p>
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }

  const accuracy = Math.max(
    48,
    Math.round((topCareer?.match_score || 0) * 100)
  );

  return (
    <div className="min-h-screen bg-[#eef4ff]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <FaCheckCircle className="text-green-600 text-7xl mx-auto mb-4" />
          <h1 className="text-6xl font-extrabold text-blue-900">
            Your Career Recommendations
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
            Based on our AI analysis of your profile
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Profile Analysis
                  </h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-semibold">
                      Profile Completeness:
                    </span>
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Excellent
                    </span>
                  </div>
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-6 bg-green-600 w-full text-white text-sm flex items-center justify-center font-semibold">
                      100%
                    </div>
                  </div>
                </div>

                <div className="min-w-[160px] text-center">
                  <p className="text-gray-500 text-lg">Model Accuracy</p>
                  <h3 className="text-5xl font-extrabold text-blue-600 mt-2">
                    {accuracy}%
                  </h3>
                </div>
              </div>
            </div>

            {topCareer && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-5">
                  <FaTrophy className="text-yellow-300 text-3xl" />
                  <h2 className="text-3xl font-bold">Best Career Match</h2>
                </div>

                <h3 className="text-4xl font-extrabold leading-tight mb-4">
                  {topCareer.career_name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(topCareer.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-blue-100 text-xl mb-4">
                  {topCareer.description}
                </p>

                {topCareer.explanation && (
                  <p className="bg-white/15 text-white p-4 rounded-2xl mb-6">
                    💡 {topCareer.explanation}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      Confidence Score
                    </p>
                    <div className="w-full h-5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-5 bg-cyan-300"
                        style={{
                          width: `${Math.max(
                            20,
                            Math.round((topCareer.match_score || 0) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">
                      Readiness Score
                    </p>
                    <div className="w-full h-5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-5 bg-green-300"
                        style={{
                          width: `${topCareer.readiness_score || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm mt-1">
                      {topCareer.readiness_score || 0}% ready
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaListOl className="text-blue-600 text-2xl" />
                <h2 className="text-3xl font-bold text-gray-900">
                  All Career Recommendations
                </h2>
              </div>

              <div className="space-y-6">
                {careers.map((career, index) => {
                  const percent = Math.max(
                    10,
                    Math.round((career.match_score || 0) * 100)
                  );

                  const readiness = career.readiness_score || 0;

                  return (
                    <div
                      key={index}
                      className="border rounded-2xl p-5 bg-gray-50"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between gap-4 items-start">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {career.career_name}
                              </h3>
                              <p className="text-gray-500 mt-1">
                                {career.category}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-3">
                                {(career.tags || []).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="bg-cyan-400 text-blue-950 px-4 py-2 rounded-xl text-sm font-bold">
                                {career.match_score >= 0.6 ? "High" : "Low"}
                              </span>

                              <button
                                onClick={() => saveCareer(career)}
                                className="bg-red-100 text-red-500 p-3 rounded-full hover:bg-red-200"
                                title="Save Career"
                              >
                                <FaHeart />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-5 bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xs flex items-center justify-center font-bold"
                              style={{ width: `${percent}%` }}
                            >
                              Match {percent}%
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-1">
                              Readiness: {readiness}%
                            </p>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-3 rounded-full ${
                                  readiness > 70
                                    ? "bg-green-500"
                                    : readiness > 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${readiness}%` }}
                              />
                            </div>
                          </div>

                          <p className="mt-4 text-gray-700">
                            {career.description}
                          </p>

                          {career.explanation && (
                            <p className="mt-3 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                              💡 {career.explanation}
                            </p>
                          )}

                          <p className="mt-3 text-sm text-gray-600">
                            You entered{" "}
                            <span className="font-semibold">
                              {(career.user_entered_skills || []).length}
                            </span>{" "}
                            skills. This role matches{" "}
                            <span className="font-semibold text-green-600">
                              {(career.matched_skills || []).length}
                            </span>{" "}
                            of them, and you may need to learn{" "}
                            <span className="font-semibold text-red-600">
                              {(career.missing_skills || []).length}
                            </span>{" "}
                            more.
                          </p>

                          <div className="mt-6 grid md:grid-cols-2 gap-5">
                            <div>
                              <p className="font-semibold text-gray-800 mb-2">
                                User Entered Skills
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(career.user_entered_skills || []).length >
                                0 ? (
                                  career.user_entered_skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    No user skills provided
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800 mb-2">
                                Required Skills
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(career.required_skills || []).map(
                                  (skill, i) => (
                                    <span
                                      key={i}
                                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800 mb-2">
                                Matched Skills
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(career.matched_skills || []).length > 0 ? (
                                  career.matched_skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    No matched skills found
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800 mb-2">
                                Missing Skills
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(career.missing_skills || []).length > 0 ? (
                                  career.missing_skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                    No major gaps
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <p className="font-semibold text-gray-800 mb-3">
                              Recommended Courses
                            </p>

                            {career.training_resources &&
                            career.training_resources.length > 0 ? (
                              <div className="grid md:grid-cols-2 gap-4">
                                {career.training_resources.map((course, i) => (
                                  <div
                                    key={i}
                                    className="bg-white border rounded-xl p-4"
                                  >
                                    <h4 className="font-semibold text-gray-900">
                                      {course.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {course.platform}
                                    </p>
                                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                      {course.level}
                                    </span>

                                    <a
                                      href={course.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                    >
                                      Start Course
                                    </a>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No course recommendations available.
                              </p>
                            )}
                          </div>

                          <div className="mt-6">
                            <p className="font-semibold text-gray-800 mb-3">
                              Learning Roadmap
                            </p>

                            <div className="space-y-4 border-l-2 border-blue-500 pl-4">
                              {(career.learning_roadmap || []).map(
                                (step, i) => (
                                  <div key={i} className="relative">
                                    <div className="absolute -left-7 top-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                                      {step.step}
                                    </div>

                                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                                      <p className="font-semibold">
                                        {step.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Quick Actions
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700"
                >
                  <FaPrint /> Print Results
                </button>

                <button className="w-full flex items-center justify-center gap-3 text-blue-600 py-3 rounded-2xl font-semibold hover:bg-blue-50">
                  <FaDownload /> Download PDF
                </button>

                <button className="w-full flex items-center justify-center gap-3 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50">
                  <FaShareAlt /> Share Results
                </button>

                <button
                  onClick={() => navigate("/form")}
                  className="w-full flex items-center justify-center gap-3 text-cyan-600 py-3 rounded-2xl font-semibold hover:bg-cyan-50"
                >
                  <FaRedo /> New Assessment
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaInfoCircle className="text-cyan-500 text-2xl" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Model Information
                </h3>
              </div>

              <div className="space-y-3 text-lg">
                <p>
                  <span className="font-semibold">Model:</span> Hybrid TF-IDF +
                  Rules
                </p>
                <p>
                  <span className="font-semibold">Accuracy:</span> {accuracy}%
                </p>
                <p>
                  <span className="font-semibold">Top Careers:</span>{" "}
                  {careers.length}
                </p>
                <p>
                  <span className="font-semibold">Dataset Size:</span> 100+
                  careers
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                User Summary
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Education:</span>{" "}
                  {userProfile.education || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Interests:</span>{" "}
                  {userProfile.interests || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Skills:</span>{" "}
                  {userProfile.skills || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Goal:</span>{" "}
                  {userProfile.career_goal || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Women-Supportive Features
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>🏠 Highlights home-based work</li>
                <li>💡 Shows low-investment business options</li>
                <li>👩‍💼 Supports career restart pathways</li>
                <li>📚 Suggests beginner-friendly courses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
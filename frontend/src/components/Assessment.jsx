import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assessmentMap } from "../data/assessmentData";

function Assessment() {
  const navigate = useNavigate();

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [result, setResult] = useState(null);

  const questions = [
    { text: "I enjoy solving logical problems", type: "Analytical" },
    { text: "I like working with numbers or data", type: "Analytical" },
    { text: "I enjoy helping or teaching people", type: "Social" },
    { text: "I communicate well with others", type: "Social" },
    { text: "I enjoy designing or creative work", type: "Creative" },
    { text: "I like making posters, videos, or content", type: "Creative" },
    { text: "I am interested in selling or business", type: "Business" },
    { text: "I want to start my own work or service", type: "Business" },
    { text: "I enjoy coding or technical tools", type: "Technical" },
    { text: "I like building websites, apps, or systems", type: "Technical" },
    { text: "I prefer hands-on practical work", type: "Practical" },
    {
      text: "I like cooking, stitching, beauty, or craft work",
      type: "Practical",
    },
  ];

  const selectAnswer = (question) => {
    const exists = selectedQuestions.some(
      (q) => q.text === question.text
    );

    if (exists) {
      setSelectedQuestions(
        selectedQuestions.filter((q) => q.text !== question.text)
      );
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const getPersonality = () => {
    if (selectedQuestions.length === 0) return "General";

    const count = {};

    selectedQuestions.forEach((q) => {
      count[q.type] = (count[q.type] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  };

  const handleSubmit = () => {
    const personality = getPersonality();

    const resultData = assessmentMap[personality] || {
      title: "General Profile",
      strengths: ["Adaptability", "Learning ability"],
      careers: ["Explore Multiple Career Options"],
      workStyle: "Flexible and open to different paths",
      nextStep: "Explore different careers and build skills gradually.",
    };

    const finalResult = { personality, ...resultData };
    setResult(finalResult);

    const oldData =
      JSON.parse(localStorage.getItem("skillsakhi_results")) || {};

    const updated = {
      ...oldData,
      user_profile: {
        ...oldData.user_profile,
        personality_type: personality,
      },
      assessment_result: finalResult,
    };

    localStorage.setItem("skillsakhi_results", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-6 py-10">
      <div className="bg-white p-8 rounded-3xl shadow max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-3 text-blue-900 text-center">
          Career Assessment Test
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Select all statements that best describe you.
        </p>

        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.text}
              onClick={() => selectAnswer(q)}
              className={`p-4 border rounded-xl cursor-pointer transition ${
                selectedQuestions.some((item) => item.text === q.text)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
            >
              {q.text}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Submit Test
        </button>

        {result && (
          <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              {result.title}
            </h2>

            <p className="text-gray-700 mb-2">
              <b>Personality Type:</b> {result.personality}
            </p>

            <p className="text-gray-700 mb-3">
              <b>Work Style:</b> {result.workStyle}
            </p>

            <div className="mb-3">
              <b>Strengths:</b>
              <ul className="list-disc ml-5 mt-1">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <b>Suitable Careers:</b>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.careers.map((c, i) => (
                  <span
                    key={i}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-2 font-medium">
              Next Step: {result.nextStep}
            </p>

            <button
              onClick={() => {
                const updated =
                  JSON.parse(localStorage.getItem("skillsakhi_results")) || {};
                navigate("/results", { state: updated });
              }}
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              Back to Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assessment;
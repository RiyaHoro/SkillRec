import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();

  const interestOptions = [
    "Coding", "Design", "Business", "Teaching", "Cooking",
    "Writing", "Marketing", "Fashion", "Beauty", "Data",
    "Social Media", "Helping People", "Crafts", "Fitness"
  ];

  const skillOptions = [
    "Python", "JavaScript", "Communication", "Excel",
    "Canva", "Teaching", "Cooking", "Stitching",
    "Makeup", "Sales", "Writing", "Social Media",
    "Customer Handling", "Design", "Typing"
  ];

  const careerStages = [
    "Student",
    "Job Seeker",
    "Career Restart",
    "Homemaker",
    "Want to Start Business"
  ];

  const workPreferences = [
    "Any",
    "Office",
    "Home-Based",
    "Flexible",
    "Business"
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [careerStage, setCareerStage] = useState("");
  const [workPreference, setWorkPreference] = useState("Any");
  const [customSkills, setCustomSkills] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const chipStyle = (selected) =>
    `px-4 py-2 rounded-full cursor-pointer border text-sm transition ${
      selected
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!age || !education || !careerStage || selectedInterests.length === 0 || selectedSkills.length === 0) {
      setError("Please fill age, education, career stage, interests, and skills.");
      return;
    }

    setLoading(true);
    setError("");

    const finalSkills = [
      ...selectedSkills,
      ...customSkills.split(",").map((s) => s.trim()).filter(Boolean),
    ];

    const modeMap = {
      "Any": "any",
      "Office": "office",
      "Home-Based": "home",
      "Flexible": "flexible",
      "Business": "any",
    };

    const typeMap = {
      "Any": "any",
      "Office": "job",
      "Home-Based": "self",
      "Flexible": "any",
      "Business": "business",
    };

    const payload = {
      age,
      education,
      career_stage: careerStage,
      interests: selectedInterests.join(", "),
      skills: finalSkills.join(", "),
      preferred_work_mode: modeMap[workPreference] || "any",
      preferred_work_type: typeMap[workPreference] || "any",
      career_goal: careerStage,
    };

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      localStorage.setItem("skillsakhi_results", JSON.stringify(data));
      navigate("/results", { state: data });
    } catch (err) {
      console.error(err);
      setError("Backend not connected. Make sure Flask is running on localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-6 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          Demographic-Aware Career Finder
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Select a few details so SkillSakhi can suggest practical career paths for your life stage.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Age *</h3>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Education *</h3>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Education</option>
                <option value="8th">8th</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Student">Currently Enrolled in College</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Career Stage *</h3>
            <div className="flex flex-wrap gap-2">
              {careerStages.map((item) => (
                <div
                  key={item}
                  onClick={() => setCareerStage(item)}
                  className={chipStyle(careerStage === item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Work Preference</h3>
            <div className="flex flex-wrap gap-2">
              {workPreferences.map((item) => (
                <div
                  key={item}
                  onClick={() => setWorkPreference(item)}
                  className={chipStyle(workPreference === item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Select Your Interests *</h3>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((item) => (
                <div
                  key={item}
                  onClick={() =>
                    toggleItem(item, selectedInterests, setSelectedInterests)
                  }
                  className={chipStyle(selectedInterests.includes(item))}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Select Your Skills *</h3>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((item) => (
                <div
                  key={item}
                  onClick={() =>
                    toggleItem(item, selectedSkills, setSelectedSkills)
                  }
                  className={chipStyle(selectedSkills.includes(item))}
                >
                  {item}
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Add more skills, comma separated"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              className="mt-3 w-full border p-3 rounded-lg"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 font-semibold"
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
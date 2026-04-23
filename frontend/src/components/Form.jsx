import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();

  const interestOptions = [
    "Coding", "Design", "Business", "Teaching", "Cooking",
    "Writing", "Marketing", "Fashion", "Beauty", "Data"
  ];

  const skillOptions = [
    "Python", "JavaScript", "Communication", "Excel",
    "Canva", "Teaching", "Cooking", "Stitching",
    "Makeup", "Sales"
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [education, setEducation] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      selectedInterests.length === 0 ||
      selectedSkills.length === 0 ||
      !education
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const finalSkills = [
      ...selectedSkills,
      ...customSkills.split(",").map((s) => s.trim()).filter(Boolean)
    ];

    const payload = {
      interests: selectedInterests.join(", "),
      skills: finalSkills.join(", "),
      education: education,
      career_goal: ""
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
      setError("Backend not connected. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  const chipStyle = (selected) =>
    `px-4 py-2 rounded-full cursor-pointer border text-sm ${
      selected
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
    }`;

  return (
    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-6 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Quick Career Finder
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Interests */}
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

          {/* Skills */}
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
              placeholder="Add more skills (comma separated)"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              className="mt-3 w-full border p-3 rounded-lg"
            />
          </div>

          {/* Education */}
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
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

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
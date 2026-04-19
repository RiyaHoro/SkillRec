import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    education: "",
    interests: "",
    skills: "",
    career_goal: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://your-backend-url.onrender.com/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await res.json();
      console.log("Backend response:", data);

      localStorage.setItem("skillsakhi_results", JSON.stringify(data));
      navigate("/results", { state: data });
    } catch (err) {
      setError("Something went wrong while getting recommendations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Fill Your Profile</h2>
        <p className="text-gray-600 mb-6">
          Enter your details to get personalized career recommendations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="education"
            placeholder="Education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="interests"
            placeholder="Interests (e.g. analytics, coding, design)"
            value={formData.interests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="career_goal"
            placeholder="Career Goal"
            value={formData.career_goal}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
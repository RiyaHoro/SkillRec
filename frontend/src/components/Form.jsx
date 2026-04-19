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
    preferred_work_type: "",
    preferred_work_mode: "",
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
      const res = await fetch("http://127.0.0.1:5000/recommend", {
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
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Fill Your Profile</h2>
        <p className="text-gray-600 mb-6">
          Enter your details to get career, livelihood, and skill recommendations.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select Education</option>
            <option value="8th">8th Pass</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="Graduate">Graduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>

          <input
            type="text"
            name="interests"
            placeholder="Interests (comma separated)"
            value={formData.interests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg md:col-span-2"
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg md:col-span-2"
            required
          />

          <input
            type="text"
            name="career_goal"
            placeholder="Career Goal"
            value={formData.career_goal}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg md:col-span-2"
          />

          <select
            name="preferred_work_type"
            value={formData.preferred_work_type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Preferred Work Type</option>
            <option value="job">Job</option>
            <option value="self-employment">Self Employment</option>
            <option value="freelance">Freelance</option>
            <option value="business">Business</option>
            <option value="any">Any</option>
          </select>

          <select
            name="preferred_work_mode"
            value={formData.preferred_work_mode}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Preferred Work Mode</option>
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="flexible">Flexible</option>
            <option value="shop">Shop</option>
            <option value="any">Any</option>
          </select>

          {error && (
            <p className="text-red-500 text-sm md:col-span-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 md:col-span-2"
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
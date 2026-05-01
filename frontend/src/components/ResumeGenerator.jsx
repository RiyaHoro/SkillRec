import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function ResumeGenerator() {
  const navigate = useNavigate();

  const savedData = JSON.parse(localStorage.getItem("skillsakhi_results")) || {};
  const userProfile = savedData.user_profile || {};
  const careers = savedData.recommended_careers || [];
  const topCareer = careers[0] || {};

  const [template, setTemplate] = useState("ats");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDocuments = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          user_profile: {
            ...userProfile,
            name,
            email,
            phone,
            location,
          },
          career: topCareer,
        }),
      });

      const data = await res.json();

      setResume(data.resume || "");
      setCoverLetter(data.cover_letter || "");
    } catch (error) {
      alert("Backend not connected. Please start Flask server.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SkillSakhi Resume", 20, 20);

    doc.setFontSize(11);
    const resumeLines = doc.splitTextToSize(resume, 170);
    doc.text(resumeLines, 20, 35);

    doc.addPage();

    doc.setFontSize(18);
    doc.text("SkillSakhi Cover Letter", 20, 20);

    doc.setFontSize(11);
    const coverLines = doc.splitTextToSize(coverLetter, 170);
    doc.text(coverLines, 20, 35);

    doc.save("SkillSakhi_Resume_CoverLetter.pdf");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-3">
          Resume & Cover Letter Generator
        </h1>

        <p className="text-gray-600 mb-8">
          Generate a personalized resume and cover letter based on your
          SkillSakhi recommendation.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="font-semibold">Choose Resume Format</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full mt-2 border p-3 rounded-xl"
            >
              <option value="ats">ATS-Friendly Resume</option>
              <option value="fresher">Fresher / Internship Resume</option>
              <option value="restart">Women Career Restart Resume</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Recommended Career</label>
            <input
              type="text"
              value={topCareer.career_name || "No career selected"}
              readOnly
              className="w-full mt-2 border p-3 rounded-xl bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold">Phone</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-2 border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold">Location</label>
            <input
              type="text"
              placeholder="City, State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-2 border p-3 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={generateDocuments}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Resume & Cover Letter"}
          </button>

          {resume && coverLetter && (
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
            >
              Download PDF
            </button>
          )}

          <button
            onClick={() => navigate("/results")}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold"
          >
            Back to Results
          </button>
        </div>

        {resume && coverLetter && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Generated Resume
              </h2>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full h-[520px] border rounded-2xl p-4 bg-gray-50 font-mono text-sm"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Generated Cover Letter
              </h2>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-[520px] border rounded-2xl p-4 bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeGenerator;
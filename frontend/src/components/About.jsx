function About() {
  return (
    <div className="min-h-screen bg-[#eef4ff]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-md p-10">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-6">
            About AI Career Guidance
          </h1>

          <p className="text-xl text-gray-700 leading-9 mb-6">
            AI Career Guidance is an intelligent recommendation platform that analyzes
            user interests, skills, education, experience, and goals to suggest suitable
            career paths, learning resources, and skill development opportunities.
          </p>

          <p className="text-xl text-gray-700 leading-9 mb-6">
            The system uses a hybrid approach combining rule-based filtering and TF-IDF
            text similarity to generate personalized career recommendations.
          </p>

          <p className="text-xl text-gray-700 leading-9">
            It is designed for students, job seekers, career switchers, and users looking
            for flexible or home-based work options.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
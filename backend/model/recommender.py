import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from model.preprocess import clean_text, combine_user_text

class JobRecommender:
    def __init__(self, csv_path="data/jobs.csv"):
        self.jobs_df = pd.read_csv(csv_path)

        # Fill null values
        self.jobs_df["job_title"] = self.jobs_df["job_title"].fillna("")
        self.jobs_df["skills"] = self.jobs_df["skills"].fillna("")
        self.jobs_df["description"] = self.jobs_df["description"].fillna("")

        # Combine job text for better matching
        self.jobs_df["combined_text"] = self.jobs_df.apply(
            lambda row: clean_text(
                f"{row['job_title']} {row['skills']} {row['description']}"
            ),
            axis=1
        )

        # TF-IDF model
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.job_vectors = self.vectorizer.fit_transform(self.jobs_df["combined_text"])

    def recommend_jobs(self, user_data, top_n=3):
        user_text = combine_user_text(
            skills=user_data.get("skills", ""),
            interests=user_data.get("interests", ""),
            career_goal=user_data.get("career_goal", ""),
            education=user_data.get("education", "")
        )

        user_vector = self.vectorizer.transform([user_text])
        similarity_scores = cosine_similarity(user_vector, self.job_vectors).flatten()

        top_indices = similarity_scores.argsort()[::-1][:top_n]

        recommendations = []
        user_skills_set = {
            skill.strip().lower()
            for skill in user_data.get("skills", "").split(",")
            if skill.strip()
        }

        for idx in top_indices:
            row = self.jobs_df.iloc[idx]
            required_skills = [
                skill.strip()
                for skill in row["skills"].split()
                if skill.strip()
            ]

            missing_skills = [
                skill for skill in required_skills
                if skill.lower() not in user_skills_set
            ]

            recommendations.append({
                "job_title": row["job_title"],
                "match_score": round(float(similarity_scores[idx]), 2),
                "required_skills": required_skills,
                "missing_skills": missing_skills
            })

        return recommendations
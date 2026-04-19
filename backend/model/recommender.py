# recommender.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

jobs = pd.read_csv("data/jobs.csv")

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(jobs['skills'])

def recommend_jobs(user_skills):
    user_input = " ".join(user_skills)
    user_vec = vectorizer.transform([user_input])

    similarity = cosine_similarity(user_vec, tfidf_matrix)
    scores = similarity[0]

    top_indices = scores.argsort()[-3:][::-1]

    return jobs.iloc[top_indices]
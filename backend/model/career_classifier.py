import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from model.preprocess import clean_text


class CareerCategoryClassifier:
    def __init__(self, csv_path="data/careers.csv"):
        self.df = pd.read_csv(csv_path, on_bad_lines="skip").fillna("")

        self.df["input_text"] = self.df.apply(
            lambda row: clean_text(
                f"{row['min_education']} "
                f"{row['interests']} "
                f"{row['required_skills']} "
                f"{row['description']}"
            ),
            axis=1
        )

        self.model = Pipeline([
            ("tfidf", TfidfVectorizer(stop_words="english")),
            ("classifier", DecisionTreeClassifier(random_state=42))
        ])

        self.model.fit(self.df["input_text"], self.df["category"])

    def predict_category(self, user_data):
        user_text = clean_text(
            f"{user_data.get('education', '')} "
            f"{user_data.get('interests', '')} "
            f"{user_data.get('skills', '')} "
            f"{user_data.get('personality_type', '')} "
            f"{user_data.get('career_goal', '')}"
        )

        return self.model.predict([user_text])[0]
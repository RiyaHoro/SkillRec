# skill_extractor.py
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_skills(text):
    doc = nlp(text)
    skills = [token.text.lower() for token in doc if token.is_alpha]
    return skills
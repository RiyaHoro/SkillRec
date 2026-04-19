import re

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def combine_user_text(skills="", interests="", career_goal="", education=""):
    return clean_text(f"{skills} {interests} {career_goal} {education}")
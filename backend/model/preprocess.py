import re

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s,/.-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def normalize_list_from_text(text):
    if not text:
        return []
    return [item.strip().lower() for item in text.split(",") if item.strip()]
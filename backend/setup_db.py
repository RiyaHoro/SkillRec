import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///skillsakhi.db")

csv_path = "data/careers.csv"

# 1. Read CSV
df = pd.read_csv(csv_path, on_bad_lines="skip").fillna("")

# 2. Clean career names
df["career_name"] = df["career_name"].astype(str).str.strip()

# 3. Remove empty career names
df = df[df["career_name"] != ""]

# 4. Remove duplicates
df = df.drop_duplicates(subset=["career_name"], keep="first")

# 5. Push clean data to SQLite
df.to_sql("careers", engine, if_exists="replace", index=False)

print("Database updated successfully.")
print("Total unique careers added:", len(df))
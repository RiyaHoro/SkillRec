import os
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///skillsakhi.db")

DATASET_FOLDER = "data"

REQUIRED_COLUMNS = [
    "career_name",
    "category",
    "required_skills",
    "interests",
    "min_education",
    "work_mode",
    "opportunity_type",
    "women_friendly",
    "career_restart",
    "investment_level",
    "safety_level",
    "description",
    "training_resource"
]

def get_careers_data(csv_path="data/careers.csv"):
    """
    Load data from SQLite.
    If DB fails, fallback to CSV.
    """
    try:
        df = pd.read_sql("SELECT * FROM careers", engine).fillna("")
        if not df.empty:
            print("Loaded data from SQLite")
            return df
    except Exception as e:
        print("DB failed, using CSV:", e)

    return pd.read_csv(csv_path).fillna("")

def clean_column_names(df):
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )
    return df

def prepare_dataset(df):
    df = clean_column_names(df)

    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            df[col] = ""

    df = df[REQUIRED_COLUMNS]
    df = df.fillna("")
    df = df.drop_duplicates(subset=["career_name"])

    return df

all_data = []

for file in os.listdir(DATASET_FOLDER):
    if file.endswith(".csv"):
        path = os.path.join(DATASET_FOLDER, file)
        print("Loading:", path)

        df = pd.read_csv(path)
        df = prepare_dataset(df)
        all_data.append(df)

if not all_data:
    print("No CSV files found.")
else:
    final_df = pd.concat(all_data, ignore_index=True)
    final_df = final_df.drop_duplicates(subset=["career_name"])

    final_df.to_sql("careers", engine, if_exists="replace", index=False)

    print("Database updated successfully.")
    print("Total careers added:", len(final_df))
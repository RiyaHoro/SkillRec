import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///skillsakhi.db")

df = pd.read_sql("SELECT * FROM careers", engine)

print("Total careers in SQLite:", len(df))
print(df[["career_name", "category"]].head(10))
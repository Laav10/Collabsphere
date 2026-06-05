from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv()

engine = create_engine(os.getenv("NEON_DB_URL"))
with engine.connect() as conn:
    result = conn.execute(text(
        'SELECT u.name, u.roll_no, u.email, pm.role, p.title '
        'FROM projectmembers pm '
        'JOIN "User" u ON u.roll_no = pm.member_id '
        'JOIN "Project" p ON p.project_id = pm.project_id '
        'WHERE LOWER(p.title) LIKE :s OR LOWER(u.name) LIKE :s '
        'ORDER BY p.title, pm.role'
    ), {"s": "%gupta%"})
    rows = result.fetchall()
    if not rows:
        print("No results found for 'gupta'")
    for row in rows:
        print(f"Name: {row[0]}, Roll: {row[1]}, Email: {row[2]}, Role: {row[3]}, Project: {row[4]}")

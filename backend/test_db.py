from sqlalchemy import create_engine

DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/agrihub_db"

try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("✅ Database connection SUCCESS!")
    conn.close()
except Exception as e:
    print("❌ Database connection FAILED")
    print(e)
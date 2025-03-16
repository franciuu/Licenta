import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def create_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
        )
        if conn.is_connected():
            print("Conexiune la baza de date reușită.")
        return conn
    except mysql.connector.Error as err:
        print("Eroare la conectarea la baza de date:", err)
        return None

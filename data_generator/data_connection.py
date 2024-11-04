import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path('../.env')

load_dotenv(dotenv_path=env_path)


DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'database': os.getenv('DB_NAME'),
    'password': os.getenv('DB_PASSWORD')
}

def connect_to_db():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("Conexión exitosa a la base de datos.")
            return connection
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

def get_db_config():
    return DB_CONFIG
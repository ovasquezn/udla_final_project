import mysql.connector
from mysql.connector import Error
import uuid
from faker import Faker
from data_connection import connect_to_db, get_db_config

fake = Faker('es_ES')

def generate_uuid():
    return str(uuid.uuid4())

def create_fake_empresas_data(num_records=5):
    empresas_data = []
    for _ in range(num_records):
        empresas_data.append((
            generate_uuid(),
            fake.company(),
            fake.address(),
            fake.phone_number(),
            fake.company_email(),
            fake.ssn(),
            fake.random_element(elements=('gratis','basica','estandar', 'premium', 'test'))
        ))
    return empresas_data

def agregar_empresas(connection, empresas_data):
    query = """
    INSERT INTO empresas (id, nombre, direccion, telefono, email, numero_fiscal, licencia)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    empresas_data = create_fake_empresas_data()
    
    try:
        cursor = connection.cursor()
        cursor.executemany(query, empresas_data)
        connection.commit()
        print(f"{cursor.rowcount} registros insertados en la tabla empresas.")
    except Error as e:
        print(f"Error al insertar datos en la tabla empresas: {e}")
    finally:
        cursor.close()

def create_fake_colaboradores_data(empresa_id, num_records=20):
    colaboradores_data = []
    for _ in range(num_records):
        colaboradores_data.append((
            generate_uuid(),                   
            empresa_id,                 
            fake.first_name(),       
            fake.last_name(),              
            fake.job(),                      
            'activo' if fake.boolean() else 'inactivo',  
            fake.address(),                    
            fake.ssn(),                        
            fake.random_element(elements=('soltero', 'casado', 'divorciado', 'viudo')), 
            fake.bban(),                     
            fake.name(),                       
            fake.random_int(min=1000000, max=3000000), 
            fake.date_between(start_date='-5y', end_date='today'),  
            fake.random_element(elements=('indefinido', 'fijo', 'temporal')) 
        ))
    return colaboradores_data

def agregar_colaboradores(connection, empresa_id):
    query = """
    INSERT INTO colaboradores 
    (id, empresaId, nombre, apellido, cargo, estado, direccion, rut, estado_civil, cuenta_bancaria, contacto_emergencia, sueldo, fecha_ingreso, tipo_contrato)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    colaboradores_data = create_fake_colaboradores_data(empresa_id)

    try:
        cursor = connection.cursor()
        cursor.executemany(query, colaboradores_data)
        connection.commit()
        print(f"{cursor.rowcount} registros insertados exitosamente.")
    except Error as e:
        print(f"Error al insertar datos: {e}")
    finally:
        cursor.close()

def main():
    connection = connect_to_db()
    if connection:
        empresas_data = create_fake_empresas_data()
        agregar_empresas(connection, empresas_data)
        
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM empresas")
        empresas_id = [row[0] for row in cursor.fetchall()]
        
        for empresa_id in empresas_id:
            agregar_colaboradores(connection, empresa_id)
        
        connection.close()

if __name__ == "__main__":
    main()
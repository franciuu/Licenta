import os
import pickle
from datetime import datetime
from deepface import DeepFace
from db_connection import create_db_connection

def generate_all_embeddings():
    conn = create_db_connection()
    if not conn:
        print("Nu s-a putut conecta la baza de date.")
        return

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT imageUrl, idStudent FROM images")
        students = cursor.fetchall()
        cursor.close()

        for file in os.listdir():
            if file.startswith("embeddings_") and file.endswith(".pkl"):
                os.remove(file)

        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        output_path = f"embeddings_{timestamp}.pkl"

        all_embeddings = []
        print(f"Generare embeddings pentru {len(students)} imagini...")

        for student in students:
            url, student_id = student
            print(f"- URL: {url} | UUID: {student_id}")
            try:
                embedding_obj = DeepFace.represent(
                    img_path=url,
                    model_name="VGG-Face",
                    enforce_detection=True,
                    detector_backend="mtcnn"
                )

                if len(embedding_obj) == 1:
                    all_embeddings.append({
                        "idStudent": student_id,
                        "embedding": embedding_obj[0]["embedding"]
                    })
                    print(f"Embedding generat pentru student {student_id}")
                else:
                    print(f"Imagine student {student_id} are {len(embedding_obj)} fețe – ignorată.")
            except Exception as e:
                print(f"Eroare imagine student {student_id}: {e}")

        with open(output_path, "wb") as f:
            pickle.dump(all_embeddings, f)

        print(f"\nEmbeddingurile au fost salvate în {output_path}")
    except Exception as e:
        print(f"Eroare generală: {e}")
    finally:
        if conn.is_connected():
            conn.close()
            print("Conexiune închisă.")

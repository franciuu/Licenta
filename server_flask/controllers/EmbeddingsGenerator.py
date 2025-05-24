import os
import pickle
import urllib.request
from datetime import datetime
import numpy as np
import cv2
from keras_facenet import FaceNet
from mtcnn.mtcnn import MTCNN
from db_connection import create_db_connection
from scipy.spatial.distance import cosine

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

        detector = MTCNN()
        embedder = FaceNet()
        model = embedder.model

        embeddings_per_student = {}

        for url, student_id in students:
            try:
                resp = urllib.request.urlopen(url)
                img_np = np.asarray(bytearray(resp.read()), dtype="uint8")
                img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
                if img is None:
                    print(f"Imagine invalidă pentru student {student_id}.")
                    continue

                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = detector.detect_faces(img_rgb)
                if not results:
                    print(f"Nici o fata detectata")
                    continue

                main_face = max(results, key=lambda f: f['box'][2] * f['box'][3])
                x1, y1, w, h = main_face['box']
                x1, y1 = max(0, x1), max(0, y1)

                face = img_rgb[y1:y1+h, x1:x1+w]
                face = cv2.resize(face, (160, 160)).astype('float32') / 255.0

                embedding = model.predict(np.expand_dims(face, axis=0), verbose=0)[0]
                embedding /= np.linalg.norm(embedding)
                all_embeddings.append({
                    "idStudent": student_id,
                    "embedding": embedding.tolist()
                })
                embeddings_per_student.setdefault(student_id, []).append(embedding)
                print(f"Embedding generat pentru student {student_id}")
            except Exception as e:
                print(f"Eroare imagine student {student_id}: {e}")

        thresholds = {}
        for student_id, embs in embeddings_per_student.items():
            intra_dists = [cosine(embs[i], embs[j]) for i in range(len(embs)) for j in range(i+1, len(embs))]
            inter_dists = []
            for other_student_id, other_embs in embeddings_per_student.items():
                if other_student_id == student_id:
                    continue
                for e1 in embs:
                    for e2 in other_embs:
                        inter_dists.append(cosine(e1, e2))
            if intra_dists and inter_dists:
                threshold = (max(intra_dists) + min(inter_dists)) / 2
            else:
                threshold = 0.4
            thresholds[student_id] = threshold

        with open(output_path, "wb") as f:
            pickle.dump({
                "embeddings": all_embeddings,
                "thresholds": thresholds
            }, f)
        print(f"\nEmbeddingurile au fost salvate in {output_path}")

    except Exception as e:
        print(f"Eroare generală: {e}")

    finally:
        if conn.is_connected():
            conn.close()
            print("Conexiune închisă.")

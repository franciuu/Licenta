import os
import pickle
import numpy as np
import cv2
from deepface import DeepFace
from scipy.spatial.distance import cosine


def recognize_faces(imagineStudenti, embedding_threshold=0.3):
    results = []

    base_dir = os.path.abspath(os.path.dirname(__file__))  
    model_path = os.path.join(base_dir, "..", "face_detection_yunet_2023mar.onnx")
    model_path = os.path.abspath(model_path)  

    detector = cv2.FaceDetectorYN.create(model=model_path, input_size=(320, 320), config="")
    h, w, _ = imagineStudenti.shape
    detector.setInputSize((w, h))

    faces = detector.detect(imagineStudenti)

    embedding_file = None
    for file in os.listdir():
        if file.startswith("embeddings_") and file.endswith(".pkl"):
            embedding_file = file
            break

    if embedding_file:
        with open(embedding_file, "rb") as f:
            saved_embeddings = pickle.load(f)
        print(f"Loaded embeddings from {embedding_file}")
    else:
        print("Nu am găsit fișierul de embeddings.")
        return results

    if faces[1] is not None:
        for i, face in enumerate(faces[1]):
            x, y, w, h = map(int, face[:4])
            face_crop = imagineStudenti[y:y+h, x:x+w]

            try:
                embedding_obj = DeepFace.represent(
                    img_path=face_crop,
                    model_name="VGG-Face",
                    enforce_detection=False,
                    detector_backend="mtcnn"
                )

                if len(embedding_obj) != 1:
                    print(f"Ignorat: {len(embedding_obj)} fețe în crop.")
                    continue

                input_embedding = np.array(embedding_obj[0]["embedding"])
                best_match = None
                best_distance = 1.0

                for item in saved_embeddings:
                    distance = cosine(input_embedding, np.array(item["embedding"]))
                    if distance < best_distance:
                        best_distance = distance
                        best_match = item["idStudent"]

                if best_distance < embedding_threshold:
                    results.append({
                        "student": best_match,
                        "distance": round(best_distance, 4)
                    })
                else:
                    results.append({
                        "student": None,
                        "distance": round(best_distance, 4)
                    })

            except Exception as e:
                print(f"Eroare embedding față: {e}")

    return results

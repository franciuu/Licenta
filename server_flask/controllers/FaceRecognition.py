import os
import pickle
import numpy as np
import cv2
from keras_facenet import FaceNet
from scipy.spatial.distance import cosine, cdist

embedder = FaceNet()
model = embedder.model

base_dir = os.path.abspath(os.path.dirname(__file__))  
model_path = os.path.join(base_dir, "..", "face_detection_yunet_2023mar.onnx")
model_path = os.path.abspath(model_path)  
detector = cv2.FaceDetectorYN.create(model=model_path, input_size=(320, 320), config="")

def augmentations(face_img):
    augmented_faces = [face_img]
    augmented_faces.append(np.fliplr(face_img))

    for angle in [-10, 10]:
        m = cv2.getRotationMatrix2D((80, 80), angle, 1.0)
        rotated = cv2.warpAffine(face_img, m, (160, 160), borderMode=cv2.BORDER_REFLECT)
        augmented_faces.append(rotated)

    blur = cv2.GaussianBlur(face_img, (3, 3), 0)
    augmented_faces.append(blur)

    bright = np.clip(face_img + 0.08, 0, 1)
    augmented_faces.append(bright)

    noise = np.clip(face_img + np.random.normal(0, 0.01, face_img.shape), 0, 1)
    augmented_faces.append(noise.astype(np.float32))

    return augmented_faces

def recognize_faces(imagineStudenti):
    results = []
   
    h, w = imagineStudenti.shape[:2]
    detector.setInputSize((w, h))
    _, faces = detector.detect(imagineStudenti)

    embedding_file = None
    for file in os.listdir():
        if file.startswith("embeddings_") and file.endswith(".pkl"):
            embedding_file = file
            break

    if not embedding_file:
        print("Nu am găsit fișierul de embeddings.")
        return results
    
    with open(embedding_file, "rb") as f:
            data = pickle.load(f)
            saved_embeddings = data["embeddings"]
            thresholds = data["thresholds"]
            print(f"Loaded embeddings from {embedding_file}")

    if faces is not None:
        for face in faces:
            x1, y1, w, h = list(map(int, face[:4]))
            face_crop = imagineStudenti[y1:y1+h, x1:x1+w]
            face_resized = cv2.resize(face_crop, (160, 160)).astype('float32') / 255.0
            aug_imgs = augmentations(face_resized)

            embeddings_aug = model.predict(np.array(aug_imgs), verbose=0)
            embeddings_aug = embeddings_aug / np.linalg.norm(embeddings_aug, axis=1, keepdims=True)
            aggregated_embedding = np.mean(embeddings_aug, axis=0)
            aggregated_embedding /= np.linalg.norm(aggregated_embedding)

            db_embeddings = np.array([np.array(item["embedding"]) for item in saved_embeddings])            
            db_student_ids = [item["idStudent"] for item in saved_embeddings]
            dists = cdist([aggregated_embedding], db_embeddings, metric='cosine')[0]

            min_dist_per_student = {}
            for sid, dist in enumerate(dists):
                student_id = db_student_ids[sid]
                if student_id not in min_dist_per_student or dist < min_dist_per_student[student_id]:
                    min_dist_per_student[student_id] = dist

            best_match = None
            best_distance = 1.0
            
            for sid, dist in min_dist_per_student.items():
                if dist < thresholds.get(sid, 0.4) and dist < best_distance:
                    best_distance = dist
                    best_match = sid
                
            results.append({
                "student": best_match,
                "distance": round(best_distance, 4) 
            })

    return results

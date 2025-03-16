import base64
import cv2
import os
import numpy as np
from datetime import datetime
from deepface import DeepFace

cached_students = []

def decode_image(image_base64):
    try:
        image_data = base64.b64decode(image_base64)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        raise ValueError(f"Eroare la decodificarea imaginii: {str(e)}")

def load_students_from_db(db_connection):
    global cached_students
    try:
            cursor = db_connection.cursor()
            cursor.execute("SELECT imageUrl, idStudent FROM images")
            cached_students = cursor.fetchall()

            print("✅ URL-urile din DB:")
            for row in cached_students:
                print(f"- Student: {row[0]} | URL: {row[1]}")

            cursor.close()
            db_connection.close()
            print("✅ Lista de imagini încărcată în cache.")
    except Exception as e:
            print(f"❌ Eroare la încărcarea imaginilor din DB: {e}")


def recognize_faces(image_data):
    image = decode_image(image_data)

    os.makedirs("temp", exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    input_path = f"temp/image_{timestamp}.jpg"
    cv2.imwrite(input_path, image)

    best_match = None
    best_confidence = 0

    for image_url, student_uuid in cached_students:
        try:
            result = DeepFace.verify(
                img1_path=input_path,
                img2_path=image_url,
                enforce_detection=False,
                model_name="VGG-Face"
            )

            verified = result.get("verified", False)
            confidence = result.get("distance", 1.0)

            if verified and (1 - confidence) > best_confidence:
                best_confidence = 1 - confidence
                best_match = student_uuid
        except Exception as df_err:
            print(f"Eroare DeepFace pentru {image_url}: {df_err}")
           
    # # Simulare răspuns pentru testare (în loc de real face recognition)
    # uuid = "c9799df4-18c7-48d0-8de3-ad249ef6fae0"
    # confidence = 0.92

    # # Întoarcem doar obiectul care se potrivește cu ce așteaptă Node
    # return {
    #     "identity": uuid,
    #     "confidence": confidence
    # }

    if best_match:
        return {
            "identity": best_match,
            "confidence": round(best_confidence, 4)
        }
    else:
        return {
            "identity": None,
            "confidence": 0
        }
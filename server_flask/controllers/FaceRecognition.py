import base64
import cv2
import os
import numpy as np
from datetime import datetime

def decode_image(image_base64):
    try:
        image_data = base64.b64decode(image_base64)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        raise ValueError(f"Eroare la decodificarea imaginii: {str(e)}")

def recognize_faces(image_data, db_connection=None):
    image = decode_image(image_data)

    os.makedirs("temp", exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"temp/image_{timestamp}.jpg"
    cv2.imwrite(filename, image)

    if db_connection:
        try:
            cursor = db_connection.cursor()
            cursor.execute("SELECT imageUrl, idStudent FROM images")
            results = cursor.fetchall()
            print("✅ URL-urile din DB:")
            for row in results:
                print(f"- Student: {row[0]} | URL: {row[1]}")
            cursor.close()
        except Exception as e:
            print(f"❌ Eroare interogare DB în recognize_faces: {e}")
    else:
        print("Nu s-a primit conexiunea la baza de date.")

    # Simulare răspuns pentru testare (în loc de real face recognition)
    identity = "c9799df4-18c7-48d0-8de3-ad249ef6fae0"
    confidence = 0.92

    # Întoarcem doar obiectul care se potrivește cu ce așteaptă Node
    return {
        "identity": identity,
        "confidence": confidence
    }

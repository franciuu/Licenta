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

def recognize_faces(image_data):
    image = decode_image(image_data)

    os.makedirs("temp", exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"temp/image_{timestamp}.jpg"
    cv2.imwrite(filename, image)

    # Aici poți pune logica de recunoaștere facială cu modelul tău
    # În loc de DeepFace, folosesc un exemplu de recunoaștere generic

    # Simulare răspuns pentru testare (în loc de real face recognition)
    identity = "c9799df4-18c7-48d0-8de3-ad249ef6fae0"
    confidence = 0.92

    # Întoarcem doar obiectul care se potrivește cu ce așteaptă Node
    return {
        "identity": identity,
        "confidence": confidence
    }

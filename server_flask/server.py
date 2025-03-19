from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.FaceRecognition import recognize_faces
from controllers.EmbeddingsGenerator import generate_all_embeddings
import base64
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)  

@app.route('/generate-embeddings', methods=['POST'])
def trigger_embedding_generation():
    try:
        generate_all_embeddings()
        return jsonify({"message": "✅ Embeddingurile au fost generate cu succes."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recognize', methods=['POST'])
def face_recognition():
    try:
        data = request.get_json()
        image_data = data.get("imageData")

        if not image_data:
            return jsonify({"error": "Lipsesc datele necesare"}), 400
        
        try:
            image_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if image is None:
                raise ValueError("Imaginea decodificată e None")
        except Exception as decode_err:
            print(f"❌ Eroare la decodare imagine: {decode_err}")
            return jsonify({"error": f"Decoding error: {str(decode_err)}"}), 500

        result = recognize_faces(image)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return jsonify({"message": "Flask server is running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

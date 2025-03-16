from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.FaceRecognition import recognize_faces, load_students_from_db
from db_connection import create_db_connection

app = Flask(__name__)
CORS(app)  

db_connection = create_db_connection()
if db_connection:
    load_students_from_db(db_connection)

@app.route('/recognize', methods=['POST'])
def face_recognition():
    try:
        data = request.get_json()
        image_data = data.get("imageData")

        if not image_data:
            return jsonify({"error": "Lipsesc datele necesare"}), 400

        result = recognize_faces(image_data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return jsonify({"message": "Flask server is running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

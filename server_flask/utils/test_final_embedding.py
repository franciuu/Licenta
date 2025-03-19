from deepface import DeepFace

# Imagine de test
img_path = "https://res.cloudinary.com/dmv0koreq/image/upload/v1742315493/students/rwfnci5j8lh1yf9oyide.jpg"

# Obținem embedding-ul
try:
    embedding = DeepFace.represent(
        img_path=img_path,
        model_name="VGG-Face",
        detector_backend="mtcnn",
        enforce_detection=False
    )
    print("✅ Embedding OK:", embedding[0]["embedding"][:10])
except Exception as e:
    print("❌ Eroare la generare embedding:", e)

from deepface import DeepFace
model = DeepFace.build_model("VGG-Face")
print("✅ Model Type:", type(model))

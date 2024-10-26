import whisper

# Load the Whisper model
model = whisper.load_model("base")  # Options: tiny, base, small, medium, large

# Transcribe the audio file
result = model.transcribe("test.m4a")
print("Transcription:", result["text"])

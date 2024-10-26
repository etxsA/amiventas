
# Realizar un servidor sencillo solo para procesar los dato
from flask import Flask, request, jsonify
import whisper
import os
import time

app = Flask(__name__)
model = whisper.load_model("tiny", device="cuda")

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    print("Received Request...");
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    audio_path = "./temp_audio.wav"
    audio_file.save(audio_path)

    time.sleep(1);

    # Realizar transcripcion
    result = model.transcribe(audio_path)
    transcription = result['text']

    # Borrar Archivo Temporal
    os.remove(audio_path)

    return jsonify({"transcription": transcription})

if __name__ == '__main__':
    app.run(port=5000)
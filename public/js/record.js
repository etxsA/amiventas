let mediaRecorder;
let audioChunks = [];
let stream;
let clickEvent = 0; // 0 = Record, 1 = Stop

document.getElementById("record").addEventListener("click", async () => {
    if (clickEvent === 0) {
        try {
            // Start recording
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", async () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                audioChunks = []; // Clear audio chunks for the next recording
                document.getElementById("status").innerText = "Recording complete. Ready to send.";

                // Stop all audio stream tracks
                stream.getTracks().forEach((track) => track.stop());

                // Prepare and send the audio blob via FormData
                const formData = new FormData();
                formData.append("audio", audioBlob, "recording.wav");

                try {
                    const response = await fetch("/upload-audio", {
                        method: "POST",
                        body: formData,
                    });

                    const result = await response.json();
                    document.getElementById("status").innerText = `Transcription: ${result.transcription}`;
                } catch (error) {
                    document.getElementById("status").innerText = "Error uploading audio.";
                    console.error("Upload error:", error);
                }
            });

            mediaRecorder.start();
            clickEvent = 1;
            document.getElementById("mymic").setAttribute("fill", "red"); // Indicate recording visually
            document.getElementById("status").innerText = "Recording...";
        } catch (error) {
            console.error("Error accessing microphone:", error);
            document.getElementById("status").innerText = "Microphone access denied.";
        }
    } else if (clickEvent === 1) {
        // Stop recording
        mediaRecorder.stop();
        clickEvent = 0;
        document.getElementById("mymic").setAttribute("fill", "white"); // Indicate stopped recording
    }
});

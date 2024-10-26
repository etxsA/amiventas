import fs from "fs";
import axios from "axios";
import path from "path";
import "dotenv/config";
import FormData from "form-data";
export async function transcribe(req, res) {
    try {
        const audioPath = req.file.path;

        // Create form-data and attach the file
        const formData = new FormData();
        formData.append('audio', fs.createReadStream(audioPath));

        // Intercambio con servidor local
        const pythonResponse = await axios.post(
            process.env.PYTHON_SERVER,  
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                },
            }
        );

        // Delete the local file after sending
        fs.unlinkSync(audioPath);

        // Send back the transcription to the HTML page
        res.json(pythonResponse.data);
    } catch (error) {
        console.error("Error, no se pudo completar la transcripcion", error);
        res.status(500).json({ error: error.message });
    }
};


import fs from "fs";
import axios from "axios";
import path from "path";
import "dotenv/config";
import FormData from "form-data";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY);

const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

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

        // Start of interaction with gpt

        const prompt = "Vas a recibir un transcripcion de un reporte de orden de un tienda de conveniencia, identifica el producto el precio y la cantidad y regresa en formato JSON; ejemplo: Texto: Recibo 5 sabritas 20 pesos Salida: {producto: 'sabritas', precio: 20, cantidad: 5}, A continuación la entrada: " + pythonResponse.data.transcription;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.error("Error, no se pudo completar la transcripcion", error);
        res.status(500).json({ error: error.message });
    }
};


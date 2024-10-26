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

        // Start of interaction with gpt
        const prompt = 'Vas a recibir una transcripción de un reporte de orden de una tienda de conveniencia \
        Solo regresa un arreglo de strings. El primer elemento debe ser el número de la situación que se presentó (1 a 3), y los demás elementos deben ser los valores necesarios. Si no se reconoce ninguna de las situaciones, regresa ["4"]. Las situaciones son las siguientes: \
        1. El usuario indica los productos que compró: Identifica el producto, precio y cantidad y regresa en formato de arreglo. Ejemplo: \
        Entrada: "Recibo 5 sabritas 20 pesos" Salida: ["1", "sabritas", "20", "5"] \
        2. El vendedor registra un pedido realizado al proveedor: Especifica el nombre del proveedor, producto, precio y cantidad. Ejemplo: \
        Entrada: "Recibo de Bimbo 50 paquetes de donitas a precio por unidad de 28 pesos" Salida: ["2", "Bimbo", "donitas", "28", "50"] \
        3. El usuario da instrucciones para acceder a una de 5 ubicaciones en el aplicativo de la tienda (1. Presupuesto, 2. Ventas Diarias, 3. Inventario, 4. Proveedores, 5. Ventas): \
        Relaciona las indicaciones estrictamente con una de estas ubicaciones y regresa un arreglo con el número de la situación y el número de la ubicación. Ejemplo: \
        Entrada: "¿Qué tanto he vendido hoy?" Salida: ["3", "2"] \
        A continuación está el prompt del usuario: ' + pythonResponse.data.transcription;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        let objeto;
        try {
            // Sanitizar el texto
            let cleanText = text.replace(/```/g, "").trim();
            cleanText = cleanText.replace(/(\w+):/g, '"$1":'); 
            cleanText = cleanText.replace(/'([^']+)'/g, '"$1"');

            objeto = JSON.parse(`[${cleanText}]`);
        } catch (parseError) {
            console.error("No :", parseError);
            objeto = { error: "Parsing failed; unexpected response format.", rawText: text };
        }

        // Log the parsed object or handle further
        if(!objeto) {
            throw Error("No se pudo entender la solicitud");
        }

        console.log(objeto[0][0]);
        if(objeto[0][0] === '1') {
            return;
        } else if(objeto[0][0] === '2') {
            return;
        } else if(objeto[0][0] === '3') {

            switch(objeto[0][1]) {
                case '1':
                    return res.json({redirect: "/dashboard/budget"});
                case '2':
                    return res.json({redirect: "/dashboard/daily"});
                case '3':

                    return res.json({redirect: "/dashboard/inventory"});
                case '4':
                    return res.json({redirect: "/dashboard/suppliers"});
                case '5':
                    return res.json({redirect: "/dashboard/sales"});
                default:
                    return res.json({redirect: "/"});
            }
        }else {
            throw Error("No se pudo completar la solicitud intenta decirlo de nuevo");
        }
    } catch (error) {
        console.error("Error, no se pudo completar la transcripcion", error);
        res.status(500).json({ error: error.message });
    }
};


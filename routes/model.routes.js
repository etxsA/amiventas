import e from "express";
import multer from "multer";

// Controllers
import { transcribe } from "../controllers/model.controller.js";

const router = e.Router();

// Configuración para guardar temporalmente los archivos de audio. 
const upload = multer({ dest: 'uploads/' });
// ChatBot en la pagina inicial
router.get('/', (req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

//Get the audio file 
router.post('/upload-audio', upload.single('audio'), transcribe);

export default router;  
// controllers/userController.js
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import  db  from '../config/db.js'; // Importa tu configuración de Firebase


export const getProducData = async (req, res) => {
    const { nombre } = req.body;

    try {
        const usersCollection = collection(db, "productos");
        const userDocRef = doc(usersCollection, nombre);
        const producDoc = await getDoc(userDocRef);

        if (!producDoc.exists()) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Obtener los datos del usuario
        const producData = producDoc.data();
        res.json(producData);
    } catch (error) {
        console.error("Error fetching products", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateProducImage = async (req, res) => {
    const { nombre, imageUrl } = req.body;

    try {
        const producCollection = collection(db, 'productos');
        const userDocRef = doc(usersCollection, nombre);

        await updateDoc(userDocRef, {
            produc_img: imageUrl // Actualiza el campo 'user_img' con la nueva URL de la imagen
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating product image URL:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getProducImage = async (req, res) => {
    const { name } = req.query; // Obtener el correo electrónico del query string

    try {
        const usersCollection = collection(db, "productos");
        const userDocRef = doc(usersCollection, nombre);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Obtener los datos del usuario
        const producData = userDoc.data();

        if (producData.produc_img) {
            res.json({ produc_img: userData.produc_img });
        } else {
            res.json({ produc_img: null }); // Opcional: Devolver null si no hay imagen definida
        }
    } catch (error) {
        console.error("Error obteniendo la imagen del producto:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }

};

export const updateProducto = async (req, res) => {
    const {nombre} = req.body;

    if(!nombre)
        return res.status(400).send('Bad Request: Nombre Requiered');

    const allowedKeys = ["nombre", "produc_img", "provedor", "cantidad", "precio"];
    
    let objK = Object.keys(req.body);

    for(let k of objK) {
        if(!allowedKeys.includes(k))
            return res.status(400).alert({'alert': 'Check parameters'});
    }
    

    try {
        const currentUser = await doc(db,'productos', nombre);
        await updateDoc(currentUser, req.body); 
        return res.status(200).json({'alert': 'Producto Actualizado con Exito'});
    } catch(e) {
        console.error("Error Fetching user, : ", e);
        return res.status(500).json({'alert': 'Error fetching producto'});
    } 

};

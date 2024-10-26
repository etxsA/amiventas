// routes/userRoutes.js
import express from 'express';
import {  
    getProducData, 
    updateProducImage, 
    getProducImage, 
    updateProducto,
} from '../controllers/producto.controller.js';

const router = express.Router();

router.post('/product', getProducData);
router.post('/update_product_image', updateProducImage);
router.get('/get_product_img', getProducImage);
router.post('/update_product', updateProducto);

export default router;

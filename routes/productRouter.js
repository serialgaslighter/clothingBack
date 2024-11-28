import express from 'express';
import { getAllProducts, getSingleProduct, addProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

export const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(addProduct)

productRouter
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct)
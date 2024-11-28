import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { invalidPathHandler } from './middlewares/invalidPath.js';
import { productRouter } from './routes/productRouter.js';
import mongoose from 'mongoose';
import "dotenv/config";

const app = express();
const PORT = 3000;
const MONGO_DB_URI = process.env.MONGO_DB_URI

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);

app.use("*", invalidPathHandler);
app.use(errorHandler);


// =================== SERVER START ===================
mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log(`Connection with mongoDB: SUCCESS ✅`);
    app.listen(PORT, () => {
      console.log(`Listening at http://localhost:${PORT}`);
    })
  })
  .catch(error => {
    console.error(`Connection with mongoDB: FAILED ⛔`, error);
    process.exit(1);
  })
mongoose.connection.on(`error`, () => {
  console.error(`Connection with mongoDB: FAILED ⛔:`, error);
})
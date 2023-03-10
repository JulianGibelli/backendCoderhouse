//importo funciones de schema y modelo desde mongoose
import { Schema,model } from "mongoose";

//defino como se llamara mi nueva coleccion
const cartsCollection = "carts";

const cartSchema = new Schema({
  products: {
    type: Array,
    required: true,
  },
});

export const cartsModelo = model(cartsCollection, cartSchema);

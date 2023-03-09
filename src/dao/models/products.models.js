import { Schema, model } from "mongoose";

//defino el nombre de mi coleccion
const products = "products";

//defino el esquema para mis productos
const productsEsquema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: Object,
    default: []
  },
  code: {
    type: String,
    required: true,
  },
  stock: Number,
  category: String
});

export const productsModelo = model(products, productsEsquema);

import { Router } from "express";

import { Cart } from "../../dao/cartControlador.js";

const cart = new Cart();
const routerCart = Router();
const archivoURL = "./src/cart.json";

//DB ENDPOINT PARA AGREGAR UN NUEVO CARRITO A LA COLECCION
routerCart.post("/", cart.addCart);

//DB ENDPOINT PARA OBTENER PRODUCTOS ṔOR ID DEL CARRITO

//DB ENDPOINT PARA AGREGAR UN PRODUCTO AL CARRITO ESPECIFICADO POR ID
routerCart.post("/:cid/product/:pid", cart.addProduct);

//DB ENDOPOINT PARA ELIMINAR UN CARRITO ESPECIFICADO POR ID
routerCart.delete("/:cid", cart.deleteCart);

export { routerCart };

import { Router } from "express";

import { Product } from "../../dao/productsControlador.js";

const routerProductos = Router();
const producto = new Product();

//DB ENDPOINT PARA OBTENER TODOS LOS PRODUCTOS
routerProductos.get("/", producto.getProducts);

//DB ENDPOINT PARA OBTENER PRODUCTO POR ID
routerProductos.get("/:pid", producto.getProduct);

//DB ENDPOINT PARA AGREGAR UN PRODUCTO !Funcionando
routerProductos.post("/", producto.addProduct);

//DB ENDPOINT PARA ACTUALIZAR UN PRODUCTO DADO UN ID Y DETALLES
routerProductos.put("/:pid", producto.modifyProduct);

//DB ENDPOINT PARA ELIMINAR UN PRODUCTO DADO UN ID
routerProductos.delete("/:pid", producto.deleteProduct);

export { routerProductos };

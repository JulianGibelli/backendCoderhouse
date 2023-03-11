import { Router } from "express";
import * as fs from "fs";
import { lecturaArchivo, escrituraArchivo } from "../../utils/utils.js";
import { serverSocket } from "../../app.js";

const routervistas = Router();
const archivoURL = "./src/productos.json";

//lectura de archivo, obtengo el contenido, copio a un nuevo array y aplano para obtener el contenido de los products
//let arayprueba = [...await lecturaArchivo(archivoURL)].map((item) => item.products).flat();

let arayprueba = await lecturaArchivo(archivoURL)
console.log(arayprueba)


async function deleteProductSocket(id) {
  let productos = await lecturaArchivo(archivoURL);
  let products = productos.map((item) => item.products).flat();
  console.log("lectura del archivo", products);
  let productIndex = products.findIndex((product) => product.id === id);
  let productExists = productIndex !== -1;
  if (productExists) {
    products.splice(productIndex, 1);
    await escrituraArchivo(archivoURL, JSON.stringify(products, null, 2));
    return "Mensaje: Producti eliminado correctamente";
  } else {
    return "Error: Producto no encontrado";
  }
}

routervistas.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("home", { arayprueba });
});

//cuando el cliente va a la ruta /realtimeproducts 
routervistas.get("/realtimeproducts", (req, res) => {  

  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  res.setHeader("Content-Type", "text/html");
  res.render("realTimeProducts");
});

routervistas.get("/chat",(req,res)=>{
  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  res.setHeader("Content-Type", "text/html");
  res.render("chat");
})

export { routervistas };

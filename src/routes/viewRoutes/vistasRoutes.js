import { Router } from "express";
import * as fs from "fs";
import { lecturaArchivo, escrituraArchivo } from "../../app.js";
import { serverSocket } from "../../app.js";

const routervistas = Router();
const archivoURL = "./src/cart.json";

let arayprueba = [];
lecturaArchivo(archivoURL).then((respuesta) => {
  arayprueba = respuesta.map((item) => item.products).flat();
});


async function deleteProductSocket(id) {
  let productos = await lecturaArchivo(archivoURL);
  let products = productos.map((item) => item.products).flat();
  console.log("lectura del archivo",products)
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

//cuando el cliente va a la ruta /realtimeproducts establezco una conexion del tipo websockets
routervistas.get("/realtimeproducts", (req, res) => {
  
  //establezco la conection
  serverSocket.on("connection", (socket) => {
    console.log(`Se han conectado, socket id ${socket.id}`);

    // Enviar la lista de productos al cliente cuando se conecte
    console.log(arayprueba);
    socket.emit("productList", arayprueba);


    socket.on("deleteProduct",async(id)=>{
      let response = await deleteProductSocket(id);
      console.log("soy la respuesta del deleteproductSocket",response)
      socket.emit("deleteProductRes", response);
    })

  });

  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  res.setHeader("Content-Type", "text/html");
  res.render("realTimeProducts");
});

export { routervistas };

import express from "express";
import { existsSync } from "fs";
import { readFile, writeFile } from "node:fs/promises";
import { routerCart } from "./routes/cart/cartRoutes.js";
import { routerProductos } from "./routes/products/productsRoutes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { routervistas } from "./routes/viewRoutes/vistasRoutes.js";
import { v4 as uuidv4 } from "uuid";

//funcion de lectura de archivo, tomando como parametro el path del archivo
export async function lecturaArchivo(path) {
  try {
    if (existsSync(path)) {
      let leidoDeArchivo = await readFile(path, "utf8");
      //retorna una instancia de promesa
      leidoDeArchivo = JSON.parse(leidoDeArchivo);
      return leidoDeArchivo;
    } else {
      return [];
    }
  } catch (error) {
    console.log("error al intentar leer archivo->", error);
  }
}
//funcion de escritura de archivo, tomando path del archivo y contenido a incluir
export async function escrituraArchivo(path, contenidoAEscribir) {
  try {
    const escritoArchivo = await writeFile(path, contenidoAEscribir);
    //retorna una instancia de promesa
    return escritoArchivo;
  } catch (error) {
    console.log("error al intentar escribir archivo->", error);
  }
}

async function deleteProductSocket(id) {
  let products = await lecturaArchivo("./src/productos.json");
  console.log("tipo de dato del id-->",typeof id)
  console.log("el id: ", id)
  let productIndex = products.findIndex((product) => product.id == id);
  let productExists = productIndex !== -1;
  if (productExists) {
    products.splice(productIndex, 1);
    await escrituraArchivo("./src/productos.json", JSON.stringify(products, null, 2));
    return "Message: Product deleted successfully";
  } else {
    return "Error: Product not found";
  }
}

async function addProductSocket(objetoEmpty,code){
  
  let arayprueba = await lecturaArchivo("./src/productos.json")
  let indexCodeRepetido = arayprueba.findIndex((p)=>p.code == code)
  //busco si encontro o no ya el codigo en el archivo
  if(indexCodeRepetido == -1){
    objetoEmpty.id = uuidv4(),
    arayprueba.push(objetoEmpty)
    await escrituraArchivo("./src/productos.json", JSON.stringify(arayprueba, null, 2));
    return "Message: Producto agregado correctamente!";
   
  }else{
    return `Producto con codigo ${code} ya cargado!`
  }
}


const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use("/api/products", routerProductos);
app.use("/api/carts", routerCart);

//le indico que todo lo que vaya a / sea renderizado por el router de vistas que llama a la vista home para que muestre el contenido
app.use("/", routervistas);

const serverhttp = app.listen(8081, (err) => {
  if (err) {
    throw new Error("super errorrr!!!...");
  } else {
    console.log("Example app listening on port 8081!");
  }
});

//exporto mi servidor websobket
export const serverSocket = new Server(serverhttp);

//establezco una nueva connection
serverSocket.on("connection", async (socket) => {
  //cuando se conecta un nuevo cliente lo saludo y emito el listado de productos
  console.log("New client connected", socket.handshake.headers.referer);

  //si se trata de una conexion a realtime products
  if(socket.handshake.headers.referer.includes("/realtimeproducts")){

    let arayprueba = await lecturaArchivo("./src/productos.json")
    socket.emit("products",arayprueba)

   
  }


  socket.on("deleteProduct", async (id) => {
    let response = await deleteProductSocket(id);
    let arayprueba = await lecturaArchivo("./src/productos.json")
    socket.emit("deleteProductRes", response,arayprueba);
  });

   socket.on("addProduct", async (data) => {
    let response = await addProductSocket(data);
    let arayprueba = await lecturaArchivo("./src/productos.json")
    socket.emit("addProductRes", response,arayprueba);
  }); 
});

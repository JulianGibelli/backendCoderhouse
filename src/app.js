import express from "express";
import { existsSync } from "fs";
import { readFile, writeFile } from "node:fs/promises";
import { routerCart } from "./routes/cart/cartRoutes.js";
import { routerProductos } from "./routes/products/productsRoutes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { routervistas } from "./routes/viewRoutes/vistasRoutes.js";

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
app.use("/", routervistas );



const serverhttp = app.listen(8081, (err) => {
  if (err) {
    throw new Error("super errorrr!!!...");
  } else {
    console.log("Example app listening on port 8081!");
  }
});

export const serverSocket = new Server(serverhttp);





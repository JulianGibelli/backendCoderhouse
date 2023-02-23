import express from "express";
import { existsSync } from "fs";
import { readFile, writeFile } from "node:fs/promises";
import { routerCart } from "./routes/cart/cartRoutes.js";

import { routerProductos } from "./routes/products/productsRoutes.js";

//funcion de lectura de archivo, tomando como parametro el path del archivo
export async function lecturaArchivo(path) {
  try {
    if(existsSync(path)){ 
      let leidoDeArchivo = await readFile(path, "utf8"); 
      //retorna una instancia de promesa
      leidoDeArchivo=JSON.parse(leidoDeArchivo); 
      return leidoDeArchivo;
      
    }else{
      return [];
    }
  } catch (error) {
    console.log("error al intentar leer archivo->", error);
  }
}

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", routerProductos);
app.use("/api/carts", routerCart);


app.get("*", (req, res) => {
  res.send("todo funciona con asteriscoo...");
});

app.listen(8081, (err) => {
  if (err) {
    throw new Error("super errorrr!!!...");
  } else {
    console.log("Example app listening on port 8081!");
  }
});

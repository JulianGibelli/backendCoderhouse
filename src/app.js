import express from "express";
import * as fs from "fs";
import { readFile, writeFile } from "node:fs/promises";

//funcion de lectura de archivo, tomando como parametro el path del archivo
async function lecturaArchivo(path) {
  try {
    const leidoDeArchivo = await readFile(path, "utf8");
    //retorna una instancia de promesa
    return leidoDeArchivo;
  } catch (error) {
    console.log("error al intentar leer archivo->", error);
  }
}

//funcion de server, toma el manager creado desde index para trabajar con su propiedad path
export function server(manager) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));

  app.get("/products", (req, res) => {
    //tengo que tomar el path al archivo provisto por mi clase manager la cual paso como parametro
    //con el path tengo que hacer una lectura de mi archivo
    //corroborar previamente que el archivo a leer existe
    const archivoURL = manager.path;

    //si existe el archivo en la url
    if (fs.existsSync(archivoURL)) {
      lecturaArchivo(archivoURL).then((respuesta) => {
        let arrayParseado = JSON.parse(respuesta);
        //si tengo query limit y no supera el maximo de elementos del array
        if (req.query.limit) {
          const arrayLimitado = arrayParseado.slice(0, req.query.limit);

          res.send(arrayLimitado);
        } else {
          res.send(arrayParseado);
          // res.send(JSON.parse(respuesta));
        }
      });
    } else {
      //enviar un archivo not found
      res.send(`<h1>Archivo Productos no cargados!</h1>`);
    }
  });

  app.get("/products/:pid", (req, res) => {
    //tengo que tomar el path al archivo provisto por mi clase manager la cual paso como parametro
    //con el path tengo que hacer una lectura de mi archivo
    //corroborar previamente que el archivo a leer existe
    const archivoURL = manager.path;

    //si existe el archivo en la url
    if (fs.existsSync(archivoURL)) {
      lecturaArchivo(archivoURL).then((respuesta) => {
        let arrayParseado = JSON.parse(respuesta);

        const productoFiltrado = arrayParseado.find((i) => {
          return i.id == req.params.pid;
        });

        if (productoFiltrado) {
          res.send(productoFiltrado);
        } else {
          res.send(
            `<h2>Su producto con id ${req.params.pid} no se ha encontrado</h2>`
          );
        }
      });
    } else {
      //enviar un archivo not found
      res.send(`<h1>Archivo Productos no cargados!</h1>`);
    }
  });

  app.get("*", (req, res) => {
    res.send("todo funciona con asteriscoo...");
  });

  app.listen(3001, (err) => {
    if (err) {
      throw new Error("super errorrr!!!...");
    } else {
      console.log("Example app listening on port 3001!");
    }
  });
}

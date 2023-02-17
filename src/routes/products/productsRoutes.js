import { Router } from "express";
import * as fs from "fs";
import { lecturaArchivo, escrituraArchivo } from "../../app.js";
import { v4 as uuidv4 } from "uuid";

const routerProductos = Router();
const archivoURL =
  "/home/shibe/Escritorio/webtest/backend/desafioEnt4/backendCoderhouse/src/productos.json";

//ENDPOINT PARA OBTENER TODOS LOS PRODUCTOS
routerProductos.get("/", (req, res) => {
  //si tiene parametro query limit limito a esa cantidad de productos, sino muestros todos

  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);
      //si tengo query limit y no supera el maximo de elementos del array
      if (req.query.limit) {
        const arrayLimitado = arrayParseado.slice(0, req.query.limit);

        res.status(200).send(arrayLimitado);
      } else {
        res.status(200).send(arrayParseado);
        // res.send(JSON.parse(respuesta));
      }
    });
  } else {
    //enviar un archivo not found
    res.status(404).send(`<h1>Archivo Productos no cargados!</h1>`);
  }
});

//ENDPOINT PARA OBTENER PRODUCTO POR ID
routerProductos.get("/:pos", (req, res) => {
  let pos = req.params.pos;
  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      const productoFiltrado = arrayParseado.find((i) => {
        return i.id == pos;
      });

      if (productoFiltrado) {
        res.status(200).send(productoFiltrado);
      } else {
        res
          .status(404)
          .send(`<h2>Su producto con id ${pos} no se ha encontrado</h2>`);
      }
    });
  } else {
    //enviar un archivo not found
    res.status(404).send(`<h1>Archivo Productos no cargados!</h1>`);
  }
});

//ENDPOINT PARA AGREGAR UN PRODUCTO
routerProductos.post("/", (req, res) => {
  console.log(req.body);
  console.log(typeof req.body);
  let {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail,
  } = req.body;

  const objAgregar = {
    title: title,
    description: description,
    code: parseInt(code),
    price: parseInt(price),
    status: status,
    stock: stock,
    category: category,
    thumbnail: thumbnail || [],
    id: uuidv4(),
  };

  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      arrayParseado.push(objAgregar);

      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado)).then(
        (respuesta) => {
          res.setHeader("Content-Type", "text/plain");
          res.status(201).json({
            message: respuesta,
          });
        }
      );

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Agregado producto con id ${objAgregar.id}`,
      });
    });
  }
});

//ENDPOINT PARA ACTUALIZAR UN PRODUCTO DADO UN ID Y DETALLES A ACTUALIZAR
routerProductos.put("/:pid", (req, res) => {
  //tomo el id del elemento a actualizar
  let idAModificar = req.params.pid;

  //hago destructuring de todo lo que se que puede llegar a existir en el body enviado
  let {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail,
  } = req.body;

  //lo agrego a un nuevo objeto
  const objAgregar = {
    title: title || "",
    description: description || "",
    code: parseInt(code) || "999",
    price: parseInt(price) || "999",
    status: status,
    stock: stock || "999",
    category: category || "asd",
    thumbnail: thumbnail || [],
    id: idAModificar,
  };

  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      //busco la posicion del elemento que tiene ese id a modificar
      let indiceProductoAModificar = arrayParseado.findIndex(
        (pr) => pr.id == idAModificar
      );

      //si no encontro producto por ese indice
      if (indiceProductoAModificar == -1) {
        res.setHeader("Content-Type", "text/plain");
        return res.status(404).json({
          message: `No se encontro un producto con ID:  ${idAModificar}`,
        });
      }

      //si encuentro ese id modifico el elemento en esa posicion con el nuevo objeto a agregar
      arrayParseado[idAModificar] = objAgregar;

      //escribo el archivo parseado
      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado)).then(
        (respuesta) => {
          res.setHeader("Content-Type", "text/plain");
          res.status(201).json({
            message: respuesta,
          });
        }
      );

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Agregado producto con id ${objAgregar.id}`,
      });
    });
  }
});

//ENDPOINT PARA ELIMINAR UN PRODUCTO DADO UN ID
routerProductos.delete("/:pid", (req, res) => {
  //tomo el id del elemento a actualizar
  let idAModificar = req.params.pid; 

 

  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      //busco la posicion del elemento que tiene ese id a modificar
      let indiceProductoAModificar = arrayParseado.findIndex(
        (pr) => pr.id == idAModificar
      );

      //si no encontro producto por ese indice
      if (indiceProductoAModificar == -1) {
        res.setHeader("Content-Type", "text/plain");
        return res.status(404).json({
          message: `No se encontro un producto con ID:  ${idAModificar}`,
        });
      }

      //si encuentro ese id modifico el elemento en esa posicion con el nuevo objeto a agregar
      arrayParseado.splice(indiceProductoAModificar,1)

      //escribo el archivo parseado
      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado)).then(
        (respuesta) => {
          res.setHeader("Content-Type", "text/plain");
          res.status(201).json({
            message: respuesta,
          });
        }
      );

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Eliminado producto con id ${idAModificar}`,
      });
    });
  }
});

export { routerProductos };

import { Router } from "express";
import * as fs from "fs";
import { lecturaArchivo, escrituraArchivo } from "../../app.js";
import { v4 as uuidv4 } from "uuid";

const routerCart = Router();
const archivoURL =
  "/home/shibe/Escritorio/webtest/backend/desafioEnt4/backendCoderhouse/src/cart.json";

//ENDPOINT PARA AGREGAR UN PRODUCTO
routerCart.post("/", (req, res) => {
  const objAgregar = {
    id: uuidv4(),
    products: [],
  };

  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      arrayParseado.push(objAgregar);

      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado));

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Se creo el carrito con id: ${objAgregar.id}`,
      });
    });
  }
});

//ENDPOINT PARA OBTENER PRODUCTOS POR ID DEL CARRITO
routerCart.get("/:cid", (req, res) => {
  let cid = req.params.cid;
  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      const carritoFiltrado = arrayParseado.find((c) => {
        return c.id == cid;
      });

      if (carritoFiltrado) {
        res.status(200).JSON({ items: carritoFiltrado.products });
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

//ENDPOINT PARA AGREGAR UN PRODUCTO AL CARRITO ESPECIFICADO POR ID
routerCart.post("/:cid/product/:pid", (req, res) => {
  let carritoID = req.params.cid;
  let productID = req.params.pid;

  let { quantity } = req.body;

  const objAgregar = {
    id: productID,
    quantity: quantity,
  };

  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = JSON.parse(respuesta);

      const carritoFiltrado = arrayParseado.find((c) => {
        return c.id == carritoID;
      });
      const carritoFiltradoIndex = arrayParseado.findIndex((c) => {
        return c.id == carritoID;
      });
      //si encuentro el carrito con id parametro
      if (carritoFiltrado) {
        let productoFiltrado = carritoFiltrado["products"].findIndex(
          (p) => p.id == productID
        );
        //si no existe producto previamente en el carrito
        if (productoFiltrado == -1) {
          carritoFiltrado["products"].push(objAgregar);
        } else {
          carritoFiltrado["products"]["productoFiltrado"]["quantity"] +=
            objAgregar.quantity;
        }
      } else {
        return res
          .status(404)
          .send(`<h2>Su carrito con id ${carritoID} no se ha encontrado</h2>`);
      }

      
      arrayParseado[carritoFiltradoIndex] = carritoFiltrado

      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado));

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Se actualizo el carrito con id: ${carritoID}`,
      });
    });
  }
});
export { routerCart };

import * as fs from "fs";
import { lecturaArchivo, escrituraArchivo } from "../../utils/utils.js";
import { v4 as uuidv4 } from "uuid";

const archivoURL = "./src/productos.json";

//FS ENDPOINT PARA OBTENER TODOS LOS PRODUCTOS !FUNCIONANDO! 
routerProductos.get("/", (req, res) => {
  //si tiene parametro query limit limito a esa cantidad de productos, sino muestros todos

  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = respuesta;
      //si tengo query limit y no supera el maximo de elementos del array
      if (req.query.limit) {
        const arrayLimitado = arrayParseado.slice(0, req.query.limit);

        res.status(200).send(arrayLimitado);
      } else {
        res.status(200).send(arrayParseado);
      }
    });
  } else {
    //enviar un archivo not found
    res.status(404).send(`<h1>Archivo Productos no cargados!</h1>`);
  }
});

//ENDPOINT PARA OBTENER PRODUCTO POR ID !FUNCIONANDO!
routerProductos.get("/:pos", (req, res) => {
  let pos = req.params.pos;
  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = respuesta;

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
 

//ENDPOINT PARA ACTUALIZAR UN PRODUCTO DADO UN ID Y DETALLES A ACTUALIZAR
routerProductos.put("/:pid", (req, res) => {
  //tomo el id del elemento a actualizar
  let idAModificar = req.params.pid.toString();

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


  //valido si el archivo existe
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = respuesta;

      //busco la posicion del elemento que tiene ese id a modificar
      let indiceProductoAModificar = arrayParseado.findIndex(
        (pr) => pr.id == idAModificar
      );
      console.log("indiceProductoAModificar", indiceProductoAModificar)
      //si no encontro producto por ese indice
      if (indiceProductoAModificar == -1) {
        res.setHeader("Content-Type", "text/plain");
        return res.status(404).json({
          message: `No se encontro un producto con ID:  ${idAModificar}`,
        });
      }

      title && (arrayParseado[indiceProductoAModificar]["title"] = title);
      description && (arrayParseado[indiceProductoAModificar]["description"] = description);
      code && (arrayParseado[indiceProductoAModificar]["code"] = code);
      price && (arrayParseado[indiceProductoAModificar]["price"] = price);
      status && (arrayParseado[indiceProductoAModificar]["status"] = status);
      stock && (arrayParseado[indiceProductoAModificar]["stock"] = stock);
      category && (arrayParseado[indiceProductoAModificar]["category"] = category);
      thumbnail && (arrayParseado[indiceProductoAModificar]["thumbnail"] = thumbnail);

      //escribo el archivo parseado
      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado,null,5))

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Actualizado producto con id ${idAModificar}`,
      });
    });
  }else{
    res.status(404).send(`<h1>Archivo Productos no cargados!</h1>`);
  }
}); 


//ENDPOINT PARA ELIMINAR UN PRODUCTO DADO UN ID !FUNCIONANDO!
routerProductos.delete("/:pid", (req, res) => {
  //tomo el id del elemento a actualizar
  let idAModificar = req.params.pid;

  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = respuesta;

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
      arrayParseado.splice(indiceProductoAModificar, 1);

      //escribo el archivo parseado
      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado,null,5)).then(
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
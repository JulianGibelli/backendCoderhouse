import * as fs from "fs";
import { lecturaArchivo, escrituraArchivo } from "../../utils/utils.js";
import { v4 as uuidv4 } from "uuid";
//ENDPOINT PARA AGREGAR UN CARRITO
/* routerCart.post("/", (req, res) => {
  //genera un carrito con id autogenerado y array vacio
  const carritoAgregar = {
    id: uuidv4(),
    products: [],
  };

  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      //parseo la collection y se convierte en arrayparseado
      let arrayParseado = respuesta;

      //a esa coleccion le pusheo un nuevo objeto -> el carrito nuevo
      arrayParseado.push(carritoAgregar);

      //escribo el nuevo contenido en el path del archivo
      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado,null,5));

      //respondo informando que se agrego el nuevo carrito al archivo
      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Se creo el carrito con id: ${carritoAgregar.id}`,
      });
    });

    //si no existe el archivo en la url
  } else {
    let arrayParseado = [];
    arrayParseado.push(carritoAgregar);
    //escribo un nuevo archivo con la nueva collection
    escrituraArchivo(archivoURL, JSON.stringify(arrayParseado,null,5));
    //informo de la creacion del archivo con el carrito nuevo
    res.setHeader("Content-Type", "text/plain");
    res.status(201).json({
      message: `Se creo el archivo y se agrego el carrito con id: ${carritoAgregar.id}`,
    });
  }
}); */

//ENDPOINT PARA OBTENER PRODUCTOS POR ID DEL CARRITO
/* routerCart.get("/:cid", (req, res) => {
  let cid = req.params.cid;
  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      let arrayParseado = respuesta;

      //tomo el carrito filtrado a partir del ID enviado por parametro
      const carritoFiltrado = arrayParseado.find((c) => {
        return c.id == cid;
      });
      //si existe el carrito
      if (carritoFiltrado) {
        res.status(200).json({ items: carritoFiltrado.products });
      } else {
        res
          .status(404)
          .send(`<h2>Su producto con id ${pos} no se ha encontrado</h2>`);
      }
    });
  } else {
    //enviar un archivo not found
    res.status(404).send(`<h1>Archivo Cart no cargado!</h1>`);
  }
}); */

//ENDPOINT PARA AGREGAR UN PRODUCTO AL CARRITO ESPECIFICADO POR ID
/* routerCart.post("/:cid/product/:pid", async(req, res) => {
  //recibo por params el id del product y del cart
  let carritoID = req.params.cid;
  let productID = req.params.pid;
  //por body me envian la cantidad a agregar del product
  let { quantity } = req.body;

  let todosLosProductos=await lecturaArchivo('./src/productos.json');
  
    let indiceProducto=todosLosProductos.findIndex(p=>p.id==productID);
    
    if (indiceProducto==-1){
      return res.status(404).json({
        message:"Producto Inexistente en base de datos...!!!"
      })
    }

  //defino un nuevo objeto a agregar al array de productos del cart
  const objAgregar = {
    id: productID,
    quantity: parseInt(quantity),
  };

  //si existe el archivo en la url
  if (fs.existsSync(archivoURL)) {
    lecturaArchivo(archivoURL).then((respuesta) => {
      //parseo la collection y se convierte en arrayparseado
      let arrayParseado = respuesta;

      //busco dentro de la collection ese carrito filtrado
      const carritoFiltradoIndex = arrayParseado.findIndex((c) => {
        return c.id == carritoID;
      });

      //busco el carrito que tenga el mismo carritoID del parametro
      const carritoFiltrado = arrayParseado.find((c) => {
        return c.id == carritoID;
      });

      //si encuentro el carrito con id parametro
      if (carritoFiltrado) {
        //busco el producto que tenga el mismo productID del parametro
        let productoFiltrado = carritoFiltrado["products"].findIndex(
          (p) => p.id == productID
        );
        //si no existe producto previamente en el carrito
        if (productoFiltrado == -1) {
          //al carrito filtrado en su array de product le pusheo el objeto a agregar
          carritoFiltrado["products"].push(objAgregar);
        } else {
          //si existe el producto previamente, me posiciono y en su prop cantidad sumo
          carritoFiltrado["products"][productoFiltrado]["quantity"] =
            parseInt(
              carritoFiltrado["products"][productoFiltrado]["quantity"]
            ) + parseInt(objAgregar.quantity);
        }
      } else {
        return res
          .status(404)
          .send(`<h2>Su carrito con id ${carritoID} no se ha encontrado</h2>`);
      }

      arrayParseado[carritoFiltradoIndex] = carritoFiltrado;

      escrituraArchivo(archivoURL, JSON.stringify(arrayParseado,null,5));

      res.setHeader("Content-Type", "text/plain");
      res.status(201).json({
        message: `Se actualizo el carrito con id: ${carritoID}`,
      });
    });
  }
}); */

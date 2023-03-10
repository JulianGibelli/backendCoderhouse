import { cartsModelo } from "./models/carts.models.js";
import { v4 as uuidv4 } from "uuid";

export class Cart {
  constructor() {}

  //unicamente da de alta un nuevo carrito en mi coleccion, le asigna un id (siempre distinto automaticamente) y un products vacio
  async addCart(req, res) {
    let cartCreado = await cartsModelo.create({ products: [] });

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({
      cartCreado,
    });
  }

  //por medio del id del carrito y el id de producto, se agregara este mismo y su cantidad al carrito
  async addProduct(req, res) {
    let carrito;
    let producto;
    let idCarrito = req.params.cid;
    console.log("id del carro", idCarrito);
    let idProducto = req.params.pid;
    console.log("id del producto", idProducto);
    let { quantity } = req.body;

    if (!quantity) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        mensaje: `Debe incluir cantidad de producto a agregar!`,
      });
    }

    try {
      //voy a buscarlo a mi DB por ese id, si no lo encuentro arroja error
      carrito = await cartsModelo.find({ _id: { $eq: `${idCarrito}` } });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        mensaje: `Error: no se encontro el carrito con ID: ${idCarrito} en la DB`,
      });
    }
    
    //Busco el carrito por id y que tiene el producto a modificar por su id
    producto = await cartsModelo.find({
      $and: [{ _id: { $eq: `${idCarrito}` } }, { 'products["id"]': { $eq: `${idProducto}` } }],
    });

    //Estoy seguro que tengo el carrito pero nose si tiene el producto a modificar/agrgar
    console.log(producto);
    if (producto.length !== 0) {
        producto = await cartsModelo.updateOne(
          {
            $and: [
              { _id: { $eq: `${idCarrito}` } },
              { 'products["id"]': { $eq: `${idProducto}` } },
            ],
          },
          { $inc: { "products.$.quantity": parseInt(quantity) } }
        );
    } else {
        //si no tengo productos cargados en el carrito actual, es decir, cargaria mi primer elemento!
        producto = await cartsModelo.updateOne(
          { _id: { $eq: `${idCarrito}` } },
          { $set: { products: { id: idProducto, quantity: parseInt(quantity) } } }
        );
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({
          producto,
        });
    }
  }

  async deleteCart(req,res){
      let cartId = req.params.cid;

      let cartsModificado = await cartsModelo.deleteOne({ _id: cartId });

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        cartsModificado,
      });
  }
}

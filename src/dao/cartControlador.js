import { cartsModelo } from "./models/carts.models.js";

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
    console.log(idCarrito);
    let idProducto = req.params.pid;
    console.log(idProducto);
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

    //intenta buscar el producto con id dado en el carrito con id dado
    try {
      producto = await cartsModelo.find({
        $and: [{ _id: { $eq: `${idCarrito}` } }, { "products.id": { $eq: `${idProducto}` } }],
      });
    } catch (error) {
        console.log("encontre el carrito pero no el product id")
    }
  }
}

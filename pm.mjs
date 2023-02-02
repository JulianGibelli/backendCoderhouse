import * as fs from "fs";
import { readFile, writeFile } from "node:fs/promises";

export default class ProductManager {
  //por defecto path de productos, pero obligatoria por medio de constructor
  //ejecuto la creacion automatica del archivo!! TODO!!!
  constructor(path) {
    this.path = path;
  }

  //funcion addProduct, recibe parametros obligatorios para crear el producto
  //asincrona con try/catch
  //previamente deberia de leer el archivo y revisar si el producto a cargar ya existe
  //luego de validar eso deberia de agregar el producto al archivo
  async addProduct(code, title, description, price, thumbnail, stock) {
    let product = {
      code: code,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      stock: stock,
    };
    try {
      //me fijo si ya existe o no el archivo creado
      if (fs.existsSync(this.path)) {
        //ya existe, leo el contenido del archivo
        const productosLectura = await readFile(this.path);
        //parsea el contenido para un objeto al cual pueda operar: inicio [] -> [ {}, {}]
        const productosParseados = JSON.parse(productosLectura);
        //es una coleccion! array de objetos
        console.log("soy productos parseados", productosParseados);
        console.log(
          "soy longitud de productos parseados",
          productosParseados.length
        );

        //completo datos pedidos por metodo en un objeto local

        product.id = productosParseados.length + 1;
        //busca si el producto con el code creado ya existe
        const indexCode = productosParseados.findIndex(
          (item) => item.code === product.code
        );

        console.log("soy index code", indexCode);

        if (indexCode === -1) {
          //si no encontro previo producto lo agrego
          console.log("mi producto! ->", product);
          //agrego el nuevo objeto a la lista de productos
          productosParseados.push(product);
          console.log("productos PARSEADOS! ->", productosParseados);
          //escribo el nuevo archivo
          fs.unlinkSync(this.path);
          await writeFile(this.path, JSON.stringify(productosParseados));
          console.log("Producto agregado con exito!");
        } else {
          //si el elemento a agregar ya existe en el archivo!!
          product.id -= 1;
          console.error(`Producto con id:${product.code} ya existente!`);
        }
      } else {
        //si no existe el archivo escribo
        //completo datos pedidos por metodo en un objeto local
        console.log("Creado el archivo por primera vez!");

        product.id = 1;

        await writeFile(this.path, JSON.stringify([product]));
      }
    } catch (error) {
      console.log(error);
    }
  }

  //funcion que devuelve todos los productos ya creados
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        //ya existe, leo el contenido del archivo
        const productosLectura = await readFile(this.path);
        //parsea el contenido para un objeto al cual pueda operar: inicio [] -> [ {}, {}]
        const productosParseados = JSON.parse(productosLectura);
        console.log("Productos: ", productosParseados);
      } else {
        console.log("No hay archivo creado");
      }
    } catch (error) {
      console.log("error por catch->", error);
    }
  }

  //funcion que busca por id el producto en la lista de productos
  async getProductById(idParam) {
    try {
      if (fs.existsSync(this.path)) {
        //ya existe, leo el contenido del archivo
        const productosLectura = await readFile(this.path);
        //parsea el contenido para un objeto al cual pueda operar: inicio [] -> [ {}, {}]
        const productosParseados = JSON.parse(productosLectura);

        const productFiltrado = productosParseados.find((item) => {
          return item.id == idParam;
        });

        //operador nullish: -> si el prodcutFiltrado fuese null o undefined devuelve lo de la derecha
        return productFiltrado ?? `Item con id: ${idParam} no encontrado`;
      } else {
        console.log("No hay archivo creado");
      }
    } catch (error) {
      console.log("Error por catch->", error);
    }
  }
}

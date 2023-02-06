import ProductManager from "./pm.mjs";

const manager = new ProductManager("./productos.json");
manager.addProduct(1, "mouse", "mouse rosa", 50, "imagen", 4);
manager.addProduct(56, "teclado", "teclado rosa", 70, "imagen", 23);
manager.addProduct(23, "auricular", "auricular rosa", 60, "imagen", 212);
manager.getProducts();

manager.getProductById(2).then((res) => {
  console.log(res);
});

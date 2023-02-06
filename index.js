import ProductManager from "./pm.mjs";

const manager = new ProductManager("./productos.json");
await manager.addProduct(1, "mouse", "mouse rosa", 50, "imagen", 4);
await manager.addProduct(56, "teclado", "teclado rosa", 70, "imagen", 23);
await manager.addProduct(23, "auricular", "auricular rosa", 60, "imagen", 212);
await manager.getProducts();

await manager.getProductById(2).then((res) => {
  console.log(res);
});

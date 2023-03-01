import { existsSync } from "fs";
import { readFile, writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";


//funcion de lectura de archivo, tomando como parametro el path del archivo
export async function lecturaArchivo(path) {
    try {
      if (existsSync(path)) {
        let leidoDeArchivo = await readFile(path, "utf8");
        //retorna una instancia de promesa
        leidoDeArchivo = JSON.parse(leidoDeArchivo);
        return leidoDeArchivo;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error al intentar leer archivo->", error);
    }
  }
  //funcion de escritura de archivo, tomando path del archivo y contenido a incluir
  export async function escrituraArchivo(path, contenidoAEscribir) {
    try {
      const escritoArchivo = await writeFile(path, contenidoAEscribir);
      //retorna una instancia de promesa
      return escritoArchivo;
    } catch (error) {
      console.log("error al intentar escribir archivo->", error);
    }
  }
  
  export async function deleteProductSocket(id) {
    let products = await lecturaArchivo("./src/productos.json");
    console.log("tipo de dato del id-->",typeof id)
    console.log("el id: ", id)
    let productIndex = products.findIndex((product) => product.id == id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products.splice(productIndex, 1);
      await escrituraArchivo("./src/productos.json", JSON.stringify(products, null, 2));
      return "Message: Product deleted successfully";
    } else {
      return "Error: Product not found";
    }
  }
  
  export async function addProductSocket(objetoEmpty,code){
    
    let arayprueba = await lecturaArchivo("./src/productos.json")
    let indexCodeRepetido = arayprueba.findIndex((p)=>p.code == code)
    //busco si encontro o no ya el codigo en el archivo
    if(indexCodeRepetido == -1){
      objetoEmpty.id = uuidv4(),
      arayprueba.push(objetoEmpty)
      await escrituraArchivo("./src/productos.json", JSON.stringify(arayprueba, null, 2));
      return "Message: Producto agregado correctamente!";
     
    }else{
      return `Producto con codigo ${code} ya cargado!`
    }
  }
  
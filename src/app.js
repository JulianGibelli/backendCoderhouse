import express from "express";
import { mongoose } from "mongoose";
import { routerCart } from "./routes/cart/cartRoutes.js";
import { routerProductos } from "./routes/products/productsRoutes.js";
import { routervistas } from "./routes/viewRoutes/vistasRoutes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import {
  lecturaArchivo,
  escrituraArchivo,
  deleteProductSocket,
  addProductSocket,
} from "./utils/utils.js";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use("/api/products", routerProductos);
app.use("/api/carts", routerCart);

//le indico que todo lo que vaya a / sea renderizado por el router de vistas que llama a la vista home para que muestre el contenido
app.use("/", routervistas);

const serverhttp = app.listen(8081, (err) => {
  if (err) {
    throw new Error("super errorrr!!!...");
  } else {
    console.log("Example app listening on port 8081!");
  }
});

//exporto mi servidor websobket
export const serverSocket = new Server(serverhttp);
const mensajes = [];
//establezco una nueva connection
/* serverSocket.on("connection", async (socket) => {
  //cuando se conecta un nuevo cliente lo saludo y emito el listado de productos
  console.log("New client connected", socket.handshake.headers.referer);

  //si se trata de una conexion a realtime products
  if (socket.handshake.headers.referer.includes("/realtimeproducts")) {
    let arayprueba = await lecturaArchivo("./src/productos.json");
    socket.emit("products", arayprueba);
  }

  socket.on("deleteProduct", async (id) => {
    let response = await deleteProductSocket(id);
    let arayprueba = await lecturaArchivo("./src/productos.json");
    socket.emit("deleteProductRes", response, arayprueba);
  });

  socket.on("addProduct", async (data) => {
    let response = await addProductSocket(data);
    let arayprueba = await lecturaArchivo("./src/productos.json");
    socket.emit("addProductRes", response, arayprueba);
  });

  socket.emit("hola", {
    emisor: "Servidor",
    mensaje: `Hola, desde el server...!!!`,
    mensajes,
  });

  socket.on("respuestaAlSaludo", (mensaje) => {
    console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

    socket.broadcast.emit("nuevoUsuario", mensaje.emisor);
  });

  socket.on("mensaje", (mensaje) => {
    console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);
    
    mensajes.push(mensaje);
    console.log(mensajes);

    socket.broadcast.emit("nuevoMensaje", mensaje);
  });
}); */


serverSocket.on('connection',(socket)=>{
    // console.log(socket.handshake);
    console.log(`Se han conectado, socket id ${socket.id}`)

    socket.emit('hola',{
        emisor:'Servidor',
        mensaje:`Hola, desde el server...!!!`,
        mensajes
    })

    socket.on('respuestaAlSaludo',(mensaje)=>{
        console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

        socket.broadcast.emit('nuevoUsuario',mensaje.emisor)
    })

    socket.on('mensaje',(mensaje)=>{
        console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

        // aca deberia de guardar mis mensajes en la bd
        mensajes.push(mensaje);

        serverSocket.emit('nuevoMensaje',mensaje)

    })


}) // fin de server.on connection



const conectar = async () => {
  try {
    // acceso a servidor local:
    // await mongoose.connect('mongodb://127.0.0.1:27017/pruebas_mongo')

    await mongoose.connect(
      "mongodb+srv://juligibelli:123Ar456.@cluster0.ysg0sy4.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce"
    );
    console.log(`Conexión a DB establecida`);
  } catch (err) {
    console.log(`Error al conectarse con el servidor de BD: ${err}`);
  }
};

conectar();

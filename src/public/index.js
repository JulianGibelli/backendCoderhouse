//este es mi frontend junto con las vistas!!

//ACA GENERO LA CONEXION CON MI SERVIDOR, SE HIZO UNA CONNECTION!
//cada vez qe entre a localhost se inicia una connection nueva!

socket = io()

//LOGICA DE MIS VISTAS

let deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(e.target[0].value)


  let id = e.target[0].value.trim();
  socket.emit("deleteProduct", id);
  e.target.reset();
});





//ENVIOS Y RECIBOS DE WEBSOCKET
// Escuchar la lista de productos actualizada desde el servidor
socket.on("productList", (products) => {
  // Actualizar la lista de productos en la vista
  const productList = document.querySelector("#productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    console.log(product)
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} -  QUANTITY: ${product.quantity}`;
    productList.appendChild(li);
  });
});

socket.on("deleteProductRes", (products) => {
  // Actualizar la lista de productos en la vista
  const productList = document.querySelector("#productList");
  productList.innerHTML += products ;
  
});



//este es mi frontend junto con las vistas!!
//ACA GENERO LA CONEXION CON MI SERVIDOR, SE HIZO UNA CONNECTION!
//cada vez qe entre a localhost se inicia una connection nueva!

let nombre = "";

Swal.fire({
  title: "Identifiquese",
  input: "text",
  text: "Ingrese su nickname",
  inputValidator: (value) => {
    return !value && "Debe ingresar un nombre...!!!";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  nombre = resultado.value;

  let divMensajes = document.querySelector("#mensajes");
  let textMensaje = document.querySelector("#mensaje");

  textMensaje.focus();

  textMensaje.addEventListener("keyup", (evento) => {
    // console.log(evento.key, evento.keyCode, evento.target.value);
    if (evento.keyCode == 13) {
      if (evento.target.value.trim() != "") {
        socket.emit("mensaje", {
          emisor: nombre,
          mensaje: evento.target.value,
        });
        textMensaje.value = "";
        textMensaje.focus();
      }
    }
  });

  socket = io();

  socket.on("hola", (objeto) => {
    console.log(`${objeto.emisor} dice ${objeto.mensaje}`);

    objeto.mensajes.forEach((el) => {
      divMensajes.innerHTML += `<br><div class='mensaje'><strong>${el.emisor}</strong> dice <i>${el.mensaje}</i></div>`;
    });

    divMensajes.scrollTop = divMensajes.scrollHeight;

    socket.emit("respuestaAlSaludo", {
      emisor: nombre,
      mensaje: `Hola, desde el Frontend`,
    });
  });

  socket.on("nuevoUsuario", (usuario) => {
    Swal.fire({
      text: `${usuario} se ha conectado...!!!`,
      toast: true,
      position: "top-right",
    });
  });

  socket.on("nuevoMensaje", (mensaje) => {
    divMensajes.innerHTML += `<br><div class='mensaje'><strong>${mensaje.emisor}</strong> dice <i>${mensaje.mensaje}</i></div>`;

    divMensajes.scrollTop = divMensajes.scrollHeight;
  });

  
});

/*
//LOGICA DE MIS VISTAS
if (location.pathname == "/realtimeproducts") {
  let deleteProductForm = document.getElementById("deleteProductForm");
  deleteProductForm.addEventListener("submit", (e) => {
    //prevengo la accion por defecto del formulario de eliminacion
    e.preventDefault();

    //lo guardo en una variable y lo envio al servidor websocket
    let id = e.target[0].value.trim();
    socket.emit("deleteProduct", id);
    //reseteo el formulario
    e.target.reset();
  });

  let addProductoForm = document.getElementById("addProductForm");
  addProductoForm.addEventListener("submit", (e) => {
    //prevengo la accion por defecto del formulario de alta de producto
    e.preventDefault();
    const data = new FormData(addProductoForm);
    let objetoEmpty = {};
    const code = data.get("code");

    for (const value of data.values()) {
      if (!value) {
        alert("Complete todos los datos!");
        return e.target.reset();
      }
    }

    data.forEach((value, key) => {
      objetoEmpty[key] = value;
    });
    //si todos los campos estan completos envio el formadata
    socket.emit("addProduct", objetoEmpty, code);
    return e.target.reset();
  });
}

//ENVIOS Y RECIBOS DE WEBSOCKET
// Escuchar la lista de productos actualizada desde el servidor
socket.on("products", (arayprueba) => {
  // Actualizar la lista de productos en la vista
  const productList = document.querySelector("#productList");
  productList.innerHTML = "";
  arayprueba.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} - Titulo: ${product.title} - Description: ${
      product.description
    } - Price: ${product.price} - Category: ${product.category || "No tiene asociada"}`;
    productList.appendChild(li);
  });
});

socket.on("deleteProductRes", (response, arayprueba) => {
  // Actualizar la lista de productos en la vista

  alert(response);

  productList.innerHTML = "";
  arayprueba.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} - Titulo: ${product.title} - Description: ${
      product.description
    } - Price: ${product.price} - Category: ${product.category || "No tiene asociada"}`;
    productList.appendChild(li);
  });
});

socket.on("addProductRes", (response, arayprueba) => {
  // Actualizar la lista de productos en la vista

  alert(response);

  productList.innerHTML = "";
  arayprueba.forEach((product) => {
    console.log(product);
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} - Titulo: ${product.title} - Description: ${
      product.description
    } - Price: ${product.price} - Category: ${product.category || "No tiene asociada"}`;
    productList.appendChild(li);
  });
});

*/
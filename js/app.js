function esAdmin() {
  return window.location.pathname.indexOf('/admin/') !== -1;
}

function formatoPrecio(numero) {
  return '$' + Number(numero).toLocaleString('es-CL');
}

function mensaje(texto) {
  var caja = document.getElementById('mensaje');
  if (caja) {
    caja.textContent = texto;
    caja.className = 'mensaje mostrar';
    setTimeout(function () {
      caja.className = 'mensaje';
    }, 2500);
  } else {
    alert(texto);
  }
}

function iniciarProductos() {
  if (!localStorage.getItem('pcforge_productos')) {
    localStorage.setItem('pcforge_productos', JSON.stringify(PRODUCTOS_INICIALES));
  }
}

function obtenerProductos() {
  iniciarProductos();
  return JSON.parse(localStorage.getItem('pcforge_productos'));
}

function guardarProductos(productos) {
  localStorage.setItem('pcforge_productos', JSON.stringify(productos));
}

function buscarProducto(id) {
  var productos = obtenerProductos();

  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id == id) {
      return productos[i];
    }
  }

  return null;
}

function crearTarjetaProducto(producto) {
  var html = '';
  html += '<article class="tarjeta">';
  html += '<a href="detalle-producto.html?id=' + producto.id + '">';
  html += '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
  html += '</a>';
  html += '<div class="tarjeta-contenido">';
  html += '<span class="etiqueta">' + producto.categoria + '</span>';
  html += '<h3>' + producto.nombre + '</h3>';
  html += '<p class="precio">' + formatoPrecio(producto.precio) + '</p>';
  html += '<div class="acciones">';
  html += '<a class="boton secundario" href="detalle-producto.html?id=' + producto.id + '">Ver detalle</a>';

  if (producto.stock > 0) {
    html += '<button class="boton" onclick="agregarCarrito(' + producto.id + ', 1)">Añadir</button>';
  } else {
    html += '<button class="boton" disabled>Sin stock</button>';
  }

  html += '</div>';
  html += '</div>';
  html += '</article>';
  return html;
}

function mostrarProductos() {
  var contenedor = document.getElementById('lista-productos');
  if (!contenedor) return;

  var productos = obtenerProductos();
  var limite = Number(document.body.getAttribute('data-limite')) || productos.length;
  var html = '';

  for (var i = 0; i < productos.length && i < limite; i++) {
    html += crearTarjetaProducto(productos[i]);
  }

  contenedor.innerHTML = html;
}

function mostrarDetalleProducto() {
  var contenedor = document.getElementById('detalle-producto');
  if (!contenedor) return;

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get('id') || 1;
  var producto = buscarProducto(id);

  if (!producto) {
    contenedor.innerHTML = '<p>Producto no encontrado.</p>';
    return;
  }

  document.title = producto.nombre + ' | PC Forge';

  var alertaStock = '';
  if (producto.stock <= producto.stockCritico) {
    alertaStock = '<p class="alerta">Stock crítico: quedan pocas unidades.</p>';
  }

  var html = '';
  html += '<div><img class="detalle-imagen" src="' + producto.imagen + '" alt="' + producto.nombre + '"></div>';
  html += '<div>';
  html += '<span class="etiqueta">' + producto.categoria + '</span>';
  html += '<h1>' + producto.nombre + '</h1>';
  html += '<p class="precio grande">' + formatoPrecio(producto.precio) + '</p>';
  html += '<p>' + producto.descripcion + '</p>';
  html += '<p><strong>Stock:</strong> ' + producto.stock + ' unidades</p>';
  html += alertaStock;

  if (producto.stock > 0) {
    html += '<label for="cantidad">Cantidad</label>';
    html += '<input class="cantidad" id="cantidad" type="number" min="1" max="' + producto.stock + '" value="1">';
    html += '<button class="boton verde" onclick="agregarCarrito(' + producto.id + ', document.getElementById(\'cantidad\').value)">Añadir al carrito</button>';
  } else {
    html += '<p class="alerta">Producto sin stock disponible.</p>';
  }

  html += '</div>';
  contenedor.innerHTML = html;
  mostrarProductosRelacionados(producto.id);
}

function mostrarProductosRelacionados(idActual) {
  var contenedor = document.getElementById('productos-relacionados');
  if (!contenedor) return;

  var productos = obtenerProductos();
  var html = '';
  var cantidad = 0;

  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id != idActual && cantidad < 4) {
      html += crearTarjetaProducto(productos[i]);
      cantidad++;
    }
  }

  contenedor.innerHTML = html;
}

function obtenerCarrito() {
  var carrito = localStorage.getItem('pcforge_carrito');
  if (!carrito) return [];
  return JSON.parse(carrito);
}

function guardarCarrito(carrito) {
  localStorage.setItem('pcforge_carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarCarrito(id, cantidad) {
  var producto = buscarProducto(id);
  if (!producto || producto.stock <= 0) {
    mensaje('Este producto no tiene stock disponible.');
    return;
  }

  cantidad = Number(cantidad);
  if (!cantidad || cantidad < 1) cantidad = 1;
  if (cantidad > producto.stock) cantidad = producto.stock;

  var carrito = obtenerCarrito();
  var encontrado = false;

  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito[i].cantidad += cantidad;
      if (carrito[i].cantidad > producto.stock) {
        carrito[i].cantidad = producto.stock;
      }
      encontrado = true;
    }
  }

  if (!encontrado) {
    carrito.push({id: Number(id), cantidad: cantidad});
  }

  guardarCarrito(carrito);
  mensaje('Producto agregado al carrito.');
}

function actualizarContadorCarrito() {
  var carrito = obtenerCarrito();
  var total = 0;

  for (var i = 0; i < carrito.length; i++) {
    total += carrito[i].cantidad;
  }

  var contadores = document.querySelectorAll('.contador-carrito');

  for (var j = 0; j < contadores.length; j++) {
    contadores[j].textContent = total;
  }
}

function eliminarDelCarrito(id) {
  var carrito = obtenerCarrito();
  var nuevoCarrito = [];

  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id != id) {
      nuevoCarrito.push(carrito[i]);
    }
  }

  guardarCarrito(nuevoCarrito);
  mostrarCarrito();
}

function cambiarCantidad(id, cantidad) {
  var carrito = obtenerCarrito();
  var producto = buscarProducto(id);

  if (!producto) return;

  cantidad = Number(cantidad);
  if (!cantidad || cantidad < 1) cantidad = 1;
  if (cantidad > producto.stock) cantidad = producto.stock;

  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito[i].cantidad = cantidad;
    }
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

function calcularTotal() {
  var carrito = obtenerCarrito();
  var total = 0;

  for (var i = 0; i < carrito.length; i++) {
    var producto = buscarProducto(carrito[i].id);
    if (producto) {
      total += producto.precio * carrito[i].cantidad;
    }
  }

  return total;
}

function mostrarCarrito() {
  var contenedor = document.getElementById('productos-carrito');
  if (!contenedor) return;

  var carrito = obtenerCarrito();
  var html = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<div class="panel"><h2>Carrito vacío</h2><p>Agrega productos desde el catálogo.</p></div>';
    document.getElementById('total-carrito').textContent = formatoPrecio(0);
    return;
  }

  for (var i = 0; i < carrito.length; i++) {
    var producto = buscarProducto(carrito[i].id);
    if (!producto) continue;

    var subtotal = producto.precio * carrito[i].cantidad;

    html += '<div class="fila-carrito">';
    html += '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
    html += '<div><h3>' + producto.nombre + '</h3>';
    html += '<p>' + formatoPrecio(producto.precio) + ' c/u</p>';
    html += '<label for="cantidad-' + producto.id + '">Cantidad</label>';
    html += '<input id="cantidad-' + producto.id + '" type="number" min="1" max="' + producto.stock + '" value="' + carrito[i].cantidad + '" onchange="cambiarCantidad(' + producto.id + ', this.value)"></div>';
    html += '<div><strong>' + formatoPrecio(subtotal) + '</strong><br>';
    html += '<button class="boton rojo" onclick="eliminarDelCarrito(' + producto.id + ')">Eliminar</button></div>';
    html += '</div>';
  }

  contenedor.innerHTML = html;
  document.getElementById('total-carrito').textContent = formatoPrecio(calcularTotal());
}

function aplicarCupon() {
  var input = document.getElementById('cupon');
  var codigo = input.value.trim().toUpperCase();
  var total = calcularTotal();

  if (codigo === 'DUOC10') {
    total = total * 0.90;
    document.getElementById('total-carrito').textContent = formatoPrecio(total);
    mensaje('Cupón DUOC10 aplicado: 10% de descuento.');
  } else {
    mensaje('Cupón no válido.');
  }
}

function obtenerUsuarios() {
  var usuarios = localStorage.getItem('pcforge_usuarios');

  if (!usuarios) {
    var iniciales = [
      {id:1, run:'190110222', nombre:'Administrador', apellidos:'PC Forge', correo:'admin@duoc.cl', fechaNacimiento:'', tipo:'Administrador', region:'Metropolitana', comuna:'Santiago', direccion:'Casa Matriz'},
      {id:2, run:'123456785', nombre:'Cliente', apellidos:'Demo', correo:'cliente@gmail.com', fechaNacimiento:'', tipo:'Cliente', region:'Metropolitana', comuna:'Puente Alto', direccion:'Dirección demo'},
      {id:3, run:'111111111', nombre:'Vendedor', apellidos:'Demo', correo:'vendedor@duoc.cl', fechaNacimiento:'', tipo:'Vendedor', region:'Metropolitana', comuna:'Santiago', direccion:'Sucursal demo'}
    ];

    localStorage.setItem('pcforge_usuarios', JSON.stringify(iniciales));
    return iniciales;
  }

  return JSON.parse(usuarios);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('pcforge_usuarios', JSON.stringify(usuarios));
}

function obtenerSesion() {
  var sesion = localStorage.getItem('pcforge_sesion');
  if (!sesion) return null;
  return JSON.parse(sesion);
}

function protegerAdmin() {
  if (!esAdmin()) return;

  var usuario = obtenerSesion();

  if (!usuario) {
    window.location.href = '../login.html';
    return;
  }

  if (usuario.tipo === 'Cliente') {
    window.location.href = '../index.html';
    return;
  }

  if (usuario.tipo === 'Vendedor') {
    var pagina = window.location.pathname.split('/').pop();
    if (pagina !== 'productos.html') {
      window.location.href = 'productos.html';
    }
  }
}

function aplicarPermisosAdmin() {
  if (!esAdmin()) return;

  var usuario = obtenerSesion();
  if (!usuario || usuario.tipo !== 'Vendedor') return;

  var elementos = document.querySelectorAll('.solo-admin');

  for (var i = 0; i < elementos.length; i++) {
    elementos[i].style.display = 'none';
  }
}

function mostrarProductosAdmin() {
  var cuerpo = document.getElementById('tabla-productos');
  if (!cuerpo) return;

  var productos = obtenerProductos();
  var sesion = obtenerSesion();
  var html = '';

  for (var i = 0; i < productos.length; i++) {
    html += '<tr>';
    html += '<td>' + productos[i].codigo + '</td>';
    html += '<td>' + productos[i].nombre + '</td>';
    html += '<td>' + formatoPrecio(productos[i].precio) + '</td>';
    html += '<td>' + productos[i].stock + '</td>';

    if (sesion && sesion.tipo === 'Vendedor') {
      html += '<td><a class="boton pequeno" href="../detalle-producto.html?id=' + productos[i].id + '">Ver</a></td>';
    } else {
      html += '<td><a class="boton pequeno" href="producto-form.html?id=' + productos[i].id + '">Editar</a> ';
      html += '<button class="boton rojo pequeno" onclick="eliminarProductoAdmin(' + productos[i].id + ')">Eliminar</button></td>';
    }

    html += '</tr>';
  }

  cuerpo.innerHTML = html;
}

function eliminarProductoAdmin(id) {
  if (!confirm('¿Eliminar este producto?')) return;

  var productos = obtenerProductos();
  var nuevos = [];

  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id != id) {
      nuevos.push(productos[i]);
    }
  }

  guardarProductos(nuevos);
  mostrarProductosAdmin();
}

function cargarProductoFormulario() {
  var formulario = document.getElementById('form-producto');
  if (!formulario) return;

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get('id');
  if (!id) return;

  var producto = buscarProducto(id);
  if (!producto) return;

  document.getElementById('titulo-form-producto').textContent = 'Editar producto';
  document.getElementById('producto-id').value = producto.id;
  document.getElementById('codigo').value = producto.codigo;
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('descripcion').value = producto.descripcion;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('stockCritico').value = producto.stockCritico;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('imagen').value = producto.imagen;
}

function mostrarUsuariosAdmin() {
  var cuerpo = document.getElementById('tabla-usuarios');
  if (!cuerpo) return;

  var usuarios = obtenerUsuarios();
  var html = '';

  for (var i = 0; i < usuarios.length; i++) {
    html += '<tr>';
    html += '<td>' + usuarios[i].run + '</td>';
    html += '<td>' + usuarios[i].nombre + ' ' + usuarios[i].apellidos + '</td>';
    html += '<td>' + usuarios[i].correo + '</td>';
    html += '<td>' + usuarios[i].tipo + '</td>';
    html += '<td><a class="boton pequeno" href="usuario-form.html?id=' + usuarios[i].id + '">Editar</a></td>';
    html += '</tr>';
  }

  cuerpo.innerHTML = html;
}

function cargarUsuarioFormulario() {
  var formulario = document.getElementById('form-usuario');
  if (!formulario) return;

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get('id');
  if (!id) return;

  var usuarios = obtenerUsuarios();
  var usuario = null;

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id == id) {
      usuario = usuarios[i];
    }
  }

  if (!usuario) return;

  document.getElementById('titulo-form-usuario').textContent = 'Editar usuario';
  document.getElementById('usuario-id').value = usuario.id;
  document.getElementById('run').value = usuario.run;
  document.getElementById('nombre').value = usuario.nombre;
  document.getElementById('apellidos').value = usuario.apellidos;
  document.getElementById('correo').value = usuario.correo;
  document.getElementById('fechaNacimiento').value = usuario.fechaNacimiento || '';
  document.getElementById('tipo').value = usuario.tipo;
  document.getElementById('direccion').value = usuario.direccion;
  document.getElementById('region').value = usuario.region;
  actualizarComunas();
  document.getElementById('comuna').value = usuario.comuna;
}

function cerrarSesion() {
  localStorage.removeItem('pcforge_sesion');
  window.location.href = esAdmin() ? '../login.html' : 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
  iniciarProductos();
  protegerAdmin();
  aplicarPermisosAdmin();
  actualizarContadorCarrito();
  mostrarProductos();
  mostrarDetalleProducto();
  mostrarCarrito();
  mostrarProductosAdmin();
  mostrarUsuariosAdmin();
  cargarProductoFormulario();
  cargarUsuarioFormulario();
});

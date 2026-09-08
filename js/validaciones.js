function error(id, texto) {
  var caja = document.getElementById('error-' + id);
  if (caja) {
    caja.textContent = texto;
  }
}

function valor(id) {
  var elemento = document.getElementById(id);
  if (!elemento) return '';
  return elemento.value.trim();
}

function requerido(id, nombre) {
  if (valor(id) === '') {
    error(id, nombre + ' es requerido.');
    return false;
  }

  error(id, '');
  return true;
}

function maximo(id, nombre, maximoPermitido) {
  if (valor(id).length > maximoPermitido) {
    error(id, nombre + ' no puede superar ' + maximoPermitido + ' caracteres.');
    return false;
  }

  return true;
}

function correoValido(correo) {
  var partes = correo.split('@');
  if (partes.length !== 2) return false;
  if (partes[0].trim() === '' || partes[1].trim() === '') return false;

  var dominio = partes[1].toLowerCase();

  return dominio === 'duoc.cl' ||
    dominio === 'profesor.duoc.cl' ||
    dominio === 'gmail.com';
}

function validarCorreo(id, obligatorio) {
  var correo = valor(id);

  if (obligatorio && correo === '') {
    error(id, 'El correo es requerido.');
    return false;
  }

  if (correo !== '' && !correoValido(correo)) {
    error(id, 'Use un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
    return false;
  }

  if (correo.length > 100) {
    error(id, 'El correo no puede superar 100 caracteres.');
    return false;
  }

  error(id, '');
  return true;
}

function runValido(run) {
  run = run.toUpperCase().replaceAll('.', '').replaceAll('-', '');

  if (run.length < 7 || run.length > 9) return false;

  var cuerpo = run.slice(0, -1);
  var dvIngresado = run.slice(-1);

  if (isNaN(cuerpo)) return false;

  var suma = 0;
  var multiplicador = 2;

  for (var i = cuerpo.length - 1; i >= 0; i--) {
    suma = suma + Number(cuerpo[i]) * multiplicador;
    multiplicador++;

    if (multiplicador > 7) {
      multiplicador = 2;
    }
  }

  var resultado = 11 - (suma % 11);
  var dvCalculado = String(resultado);

  if (resultado === 11) dvCalculado = '0';
  if (resultado === 10) dvCalculado = 'K';

  return dvCalculado === dvIngresado;
}

function validarRunCampo() {
  var run = valor('run').toUpperCase();

  if (run === '') {
    error('run', 'El RUN es requerido.');
    return false;
  }

  if (!runValido(run)) {
    error('run', 'RUN no válido. Escríbalo sin puntos ni guion.');
    return false;
  }

  error('run', '');
  return true;
}

function cargarRegiones() {
  var region = document.getElementById('region');
  if (!region) return;

  var seleccionActual = region.value;
  var html = '<option value="">Seleccione región</option>';

  for (var nombre in REGIONES) {
    html += '<option value="' + nombre + '">' + nombre + '</option>';
  }

  region.innerHTML = html;
  region.value = seleccionActual;
  region.onchange = actualizarComunas;
}

function actualizarComunas() {
  var region = document.getElementById('region');
  var comuna = document.getElementById('comuna');
  if (!region || !comuna) return;

  var lista = REGIONES[region.value] || [];
  var html = '<option value="">Seleccione comuna</option>';

  for (var i = 0; i < lista.length; i++) {
    html += '<option value="' + lista[i] + '">' + lista[i] + '</option>';
  }

  comuna.innerHTML = html;
}

function validarLogin(evento) {
  evento.preventDefault();

  var ok = true;

  if (!validarCorreo('correo', true)) {
    ok = false;
  }

  var password = valor('password');

  if (password.length < 4 || password.length > 10) {
    error('password', 'La contraseña debe tener entre 4 y 10 caracteres.');
    ok = false;
  } else {
    error('password', '');
  }

  if (!ok) return;

  var correo = valor('correo').toLowerCase();
  var usuarios = obtenerUsuarios();
  var tipo = 'Cliente';

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo.toLowerCase() === correo) {
      tipo = usuarios[i].tipo;
    }
  }

  localStorage.setItem('pcforge_sesion', JSON.stringify({
    correo: correo,
    tipo: tipo
  }));

  if (tipo === 'Administrador') {
    window.location.href = 'admin/index.html';
  } else if (tipo === 'Vendedor') {
    window.location.href = 'admin/productos.html';
  } else {
    window.location.href = 'index.html';
  }
}

function validarContacto(evento) {
  evento.preventDefault();

  var ok = true;

  if (!requerido('nombre', 'Nombre')) ok = false;
  if (!maximo('nombre', 'Nombre', 100)) ok = false;
  if (!validarCorreo('correo', false)) ok = false;
  if (!requerido('comentario', 'Comentario')) ok = false;
  if (!maximo('comentario', 'Comentario', 500)) ok = false;

  if (ok) {
    document.getElementById('form-mensaje').textContent = 'Mensaje enviado correctamente.';
    evento.target.reset();
  }
}

function validarUsuario(evento) {
  evento.preventDefault();

  var ok = true;

  if (!validarRunCampo()) ok = false;
  if (!requerido('nombre', 'Nombre') || !maximo('nombre', 'Nombre', 50)) ok = false;
  if (!requerido('apellidos', 'Apellidos') || !maximo('apellidos', 'Apellidos', 100)) ok = false;
  if (!validarCorreo('correo', true)) ok = false;
  if (!requerido('region', 'Región')) ok = false;
  if (!requerido('comuna', 'Comuna')) ok = false;
  if (!requerido('direccion', 'Dirección') || !maximo('direccion', 'Dirección', 300)) ok = false;

  var tipo = document.getElementById('tipo');

  if (tipo && !requerido('tipo', 'Tipo de usuario')) {
    ok = false;
  }

  if (!ok) return;

  var usuarios = obtenerUsuarios();
  var idCampo = document.getElementById('usuario-id');
  var id = idCampo ? Number(idCampo.value) : 0;
  var run = valor('run').toUpperCase();
  var correo = valor('correo').toLowerCase();

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id !== id && usuarios[i].run.toUpperCase() === run) {
      error('run', 'El RUN ya se encuentra registrado.');
      ok = false;
    }

    if (usuarios[i].id !== id && usuarios[i].correo.toLowerCase() === correo) {
      error('correo', 'El correo ya se encuentra registrado.');
      ok = false;
    }
  }

  if (!ok) return;

  var datos = {
    id: id || Date.now(),
    run: run,
    nombre: valor('nombre'),
    apellidos: valor('apellidos'),
    correo: correo,
    fechaNacimiento: valor('fechaNacimiento'),
    tipo: tipo ? tipo.value : 'Cliente',
    region: valor('region'),
    comuna: valor('comuna'),
    direccion: valor('direccion')
  };

  var editado = false;

  for (var j = 0; j < usuarios.length; j++) {
    if (usuarios[j].id === datos.id) {
      usuarios[j] = datos;
      editado = true;
    }
  }

  if (!editado) {
    usuarios.push(datos);
  }

  guardarUsuarios(usuarios);
  document.getElementById('form-mensaje').textContent = 'Usuario guardado correctamente.';

  if (esAdmin()) {
    setTimeout(function () {
      window.location.href = 'usuarios.html';
    }, 700);
  } else {
    evento.target.reset();
    cargarRegiones();
    actualizarComunas();
  }
}

function validarProducto(evento) {
  evento.preventDefault();

  var ok = true;

  if (!requerido('codigo', 'Código')) ok = false;

  if (valor('codigo').length < 3) {
    error('codigo', 'El código debe tener mínimo 3 caracteres.');
    ok = false;
  }

  if (!requerido('nombre', 'Nombre') || !maximo('nombre', 'Nombre', 100)) ok = false;
  if (!maximo('descripcion', 'Descripción', 500)) ok = false;

  var precio = Number(valor('precio'));

  if (valor('precio') === '' || precio < 0) {
    error('precio', 'Ingrese un precio mayor o igual a 0.');
    ok = false;
  } else {
    error('precio', '');
  }

  var stock = Number(valor('stock'));

  if (valor('stock') === '' || stock < 0 || !Number.isInteger(stock)) {
    error('stock', 'El stock debe ser un número entero mayor o igual a 0.');
    ok = false;
  } else {
    error('stock', '');
  }

  var stockCriticoTexto = valor('stockCritico');
  var stockCritico = Number(stockCriticoTexto || 0);

  if (stockCriticoTexto !== '' && (stockCritico < 0 || !Number.isInteger(stockCritico))) {
    error('stockCritico', 'Debe ser un número entero mayor o igual a 0.');
    ok = false;
  } else {
    error('stockCritico', '');
  }

  if (!requerido('categoria', 'Categoría')) ok = false;
  if (!ok) return;

  var productos = obtenerProductos();
  var id = Number(document.getElementById('producto-id').value);
  var codigo = valor('codigo').toUpperCase();

  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id !== id && productos[i].codigo.toUpperCase() === codigo) {
      error('codigo', 'El código ya se encuentra registrado.');
      ok = false;
    }
  }

  if (!ok) return;

  var imagen = valor('imagen');

  if (imagen === '' && id) {
    var anterior = buscarProducto(id);
    if (anterior) imagen = anterior.imagen;
  }

  if (imagen === '') {
    imagen = 'img/producto-1.svg';
  }

  var producto = {
    id: id || Date.now(),
    codigo: codigo,
    nombre: valor('nombre'),
    categoria: valor('categoria'),
    precio: precio,
    stock: stock,
    stockCritico: stockCritico,
    imagen: imagen,
    descripcion: valor('descripcion')
  };

  var editado = false;

  for (var j = 0; j < productos.length; j++) {
    if (productos[j].id === producto.id) {
      productos[j] = producto;
      editado = true;
    }
  }

  if (!editado) {
    productos.push(producto);
  }

  guardarProductos(productos);
  document.getElementById('form-mensaje').textContent = 'Producto guardado correctamente.';

  setTimeout(function () {
    window.location.href = 'productos.html';
  }, 700);
}

function activarValidacionTiempoReal() {
  var campos = document.querySelectorAll('input[required], textarea[required], select[required]');

  for (var i = 0; i < campos.length; i++) {
    if (campos[i].id === 'correo' || campos[i].id === 'run' || campos[i].id === 'password') {
      continue;
    }

    campos[i].addEventListener('input', function () {
      if (this.value.trim() === '') {
        error(this.id, 'Este campo es requerido.');
      } else {
        error(this.id, '');
      }
    });
  }

  var correo = document.getElementById('correo');

  if (correo) {
    correo.addEventListener('input', function () {
      validarCorreo('correo', correo.hasAttribute('required'));
    });
  }

  var run = document.getElementById('run');

  if (run) {
    run.addEventListener('input', validarRunCampo);
  }

  var password = document.getElementById('password');

  if (password) {
    password.addEventListener('input', function () {
      if (password.value.length < 4 || password.value.length > 10) {
        error('password', 'La contraseña debe tener entre 4 y 10 caracteres.');
      } else {
        error('password', '');
      }
    });
  }

  var comentario = document.getElementById('comentario');

  if (comentario) {
    comentario.addEventListener('input', function () {
      if (comentario.value.length > 500) {
        error('comentario', 'Comentario no puede superar 500 caracteres.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  cargarRegiones();
  actualizarComunas();
  activarValidacionTiempoReal();

  var login = document.getElementById('form-login');
  if (login) login.addEventListener('submit', validarLogin);

  var contacto = document.getElementById('form-contacto');
  if (contacto) contacto.addEventListener('submit', validarContacto);

  var usuario = document.getElementById('form-usuario');
  if (usuario) usuario.addEventListener('submit', validarUsuario);

  var producto = document.getElementById('form-producto');
  if (producto) producto.addEventListener('submit', validarProducto);
});

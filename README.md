# PC Forge - Evaluación Parcial 1 DSY1104

PC Forge es una tienda online de hardware desarrollada con HTML5, CSS3 y JavaScript. El proyecto incluye una tienda pública, carrito de compras, formularios con validación y un módulo administrativo básico.

## Ejecución

Se recomienda abrir el proyecto con Live Server desde Visual Studio Code para asegurar un comportamiento consistente de LocalStorage entre todas las páginas.

1. Abrir la carpeta `PCForge_Final` en Visual Studio Code.
2. Abrir `index.html`.
3. Ejecutar la opción `Open with Live Server`.

## Credenciales de prueba

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@duoc.cl` | `1234` |
| Vendedor | `vendedor@duoc.cl` | `1234` |
| Cliente | `cliente@gmail.com` | `1234` |

La contraseña se valida por longitud, entre 4 y 10 caracteres, de acuerdo con los requisitos de la evaluación.

## Estructura

```text
PCForge_Final/
├── index.html
├── productos.html
├── detalle-producto.html
├── carrito.html
├── registro.html
├── login.html
├── nosotros.html
├── blog.html
├── blog-detalle-1.html
├── blog-detalle-2.html
├── contacto.html
├── admin/
│   ├── index.html
│   ├── productos.html
│   ├── producto-form.html
│   ├── usuarios.html
│   └── usuario-form.html
├── css/
│   └── estilos.css
├── js/
│   ├── datos.js
│   ├── app.js
│   └── validaciones.js
└── img/
```

## Funcionalidades principales

- Navegación entre todas las páginas de la tienda.
- Catálogo de productos generado con JavaScript.
- Detalle de producto y productos relacionados.
- Carrito de compras almacenado en LocalStorage.
- Cambio de cantidades, eliminación de productos y cálculo de total.
- Cupón de demostración `DUOC10` con 10% de descuento.
- Registro de usuarios con validación de RUN chileno.
- Validación de correos `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`.
- Validación de contraseña entre 4 y 10 caracteres.
- Región y comuna dependientes mediante JavaScript.
- Formulario de contacto con mensajes de error personalizados.
- Administración de productos y usuarios mediante LocalStorage.
- Perfiles Cliente, Vendedor y Administrador.
- Diseño responsive con una hoja de estilos CSS externa.

## Control de versiones sugerido

```text
feat: crea estructura HTML de la tienda
style: implementa diseño responsive con CSS externo
feat: carga catálogo de productos con JavaScript
feat: implementa carrito de compras con LocalStorage
feat: agrega validaciones de formularios
feat: incorpora módulo administrativo
feat: agrega perfiles y permisos de usuario
docs: completa ERS y planilla de requerimientos
```

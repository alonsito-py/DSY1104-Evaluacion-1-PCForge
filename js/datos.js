var PRODUCTOS_INICIALES = [
  {id:1, codigo:'GPU4070', nombre:'Tarjeta Gráfica RTX 4070', categoria:'Componentes', precio:699990, stock:8, stockCritico:3, imagen:'img/producto-1.svg', descripcion:'Tarjeta gráfica para jugar, estudiar y trabajar con excelente rendimiento.'},
  {id:2, codigo:'CPU7800', nombre:'Procesador Ryzen 7 7800X', categoria:'Componentes', precio:449990, stock:10, stockCritico:3, imagen:'img/producto-2.svg', descripcion:'Procesador de alto rendimiento para equipos gamer y estaciones de trabajo.'},
  {id:3, codigo:'SSD1TB', nombre:'SSD NVMe 1TB', categoria:'Componentes', precio:89990, stock:15, stockCritico:4, imagen:'img/producto-3.svg', descripcion:'Unidad rápida de almacenamiento para sistema operativo, juegos y programas.'},
  {id:4, codigo:'RAM32', nombre:'Memoria RAM 32GB DDR5', categoria:'Componentes', precio:129990, stock:12, stockCritico:4, imagen:'img/producto-4.svg', descripcion:'Kit de memoria DDR5 para multitarea, productividad y gaming.'},
  {id:5, codigo:'PSU750', nombre:'Fuente 750W 80+ Gold', categoria:'Componentes', precio:109990, stock:6, stockCritico:2, imagen:'img/producto-5.svg', descripcion:'Fuente eficiente y estable para computadores de alto rendimiento.'},
  {id:6, codigo:'CASE01', nombre:'Gabinete Airflow RGB', categoria:'Componentes', precio:74990, stock:9, stockCritico:3, imagen:'img/producto-6.svg', descripcion:'Gabinete con buen flujo de aire, espacio interior y ventilación RGB.'},
  {id:7, codigo:'MON144', nombre:'Monitor 27\" 144Hz', categoria:'Equipos y Periféricos', precio:189990, stock:7, stockCritico:2, imagen:'img/producto-8.svg', descripcion:'Monitor de 27 pulgadas y 144Hz ideal para juegos y uso diario.'},
  {id:8, codigo:'PCGAMER', nombre:'PC Armado i5 + RTX', categoria:'PC Armados', precio:849990, stock:4, stockCritico:2, imagen:'img/producto-12.svg', descripcion:'Computador armado y listo para usar, pensado para gaming en Full HD.'}
];

var REGIONES = {
  'Metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'La Florida', 'Providencia'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
  'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle']
};

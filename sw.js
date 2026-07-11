// Nombre del almacenamiento en caché
const CACHE_NAME = 'batpez-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json'
];

// Instalar el Service Worker y guardar archivos base
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', (e) => {
  console.log('Service Worker de BatPez IA Activado 🐟');
});

// Escuchar el evento que dispara la alarma/notificación desde el celular
self.addEventListener('user-notification', (e) => {
  const data = e.data ? e.data.json() : { titulo: 'Misión Activa', cuerpo: '¡Hora de enfocarse!' };
  
  const opciones = {
    body: data.cuerpo,
    icon: '1000022870.jpg', // Usa una de tus imágenes como icono
    badge: '1000022870.jpg',
    vibrate: [200, 100, 200, 100, 400], // Patrón de vibración neón
    data: { dateOfArrival: Date.now() }
  };

  e.waitUntil(
    self.registration.showNotification(data.titulo, opciones)
  );
});

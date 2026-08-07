// src/service-worker.js
// Este archivo se importa en el service worker de Angular PWA

self.addEventListener('push', event => {
    if (!event.data) return;

    const data = event.data.json();

    const opciones = {
        body: data.body,
        icon: data.icon || '/assets/icons/icon-192x192.png',
        badge: data.badge || '/assets/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/' },
    };

    event.waitUntil(
        self.registration.showNotification(data.title, opciones)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // Si la app ya está abierta, enfocarla
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // Si no está abierta, abrirla
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
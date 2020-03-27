// var cacheName = 'ACPOffline-v1';
// var appShellFiles = [
//     '/',
//     'ACP.webmanifest'
// ];
//
// self.addEventListener('install', (e) => {
//     console.log('[Service Worker] install');
//     e.waitUntil(
//         caches.open(cacheName).then((cache) => {
//             console.log('[Service Worker] Caching all: app shell');
//             return cache.addAll(appShellFiles);
//         })
//     );
// });
//
// self.addEventListener('fetch', (e) => {
//     e.respondWith(
//         caches.match(e.request).then((r) => {
//             console.log('[Service Worker] Fetching resourse: ' + e.request.url);
//             return r || fetch(e.request).then((response) => {
//                 return caches.open(cacheName).then((cache) => {
//                     console.log('[Service Worker] Caching new resource: ' + e.request.url);
//                     cache.put(e.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });
//
// // self.addEventListener('activate', (e) => {
// //     e.waitUntil(
// //         caches.keys().then((keyList) => {
// //             return Promise.all(keylist.map((key) => {
// //                 if (key !== cacheName) {
// //                     return caches.delete(key);
// //                 }
// //             }));
// //         })
// //     );
// // });

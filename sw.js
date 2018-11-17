var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/fallback.json',
  'css/main.css',
  'js/jquery.min.js',
  'js/main.js',
  'images/logo.jpg'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('In install serviceworker... opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

//mengambil dan memasangnya
self.addEventListener('fetch', function(event) {
    var request = event.request
    var url = new URL(request.url)

    //pisahkan request API dan INTERNAL
    if(url.origin === location.origin) {
        Event.respondWith(
            caches.match(request).then(function(response) {
                return response || fetch(request)
            })
        )
    } else {
        event.respondWith(
            caches.open('products-cache').then(function(cache){
                return fetch(request).then(function(liveResponse){
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                }).catch(function(){
                    return caches.match(request).then(function(response){
                        if(response) return response
                            return caches.match('fallback.json')
                    })
                })
            })
        )   
    }
});

// activasinya
self.addEventListener('activate', function(event) {  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName){
              return cacheName != CACHE_NAME
          }).map(function(cacheName){
              return caches.delete(cacheName)
          })
        );
      })
    );
  });
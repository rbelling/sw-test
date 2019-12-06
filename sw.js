self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/image-list.js',
        '/star-wars-logo.jpg',
        '/gallery/bountyHunters.jpg',
        '/gallery/myLittleVader.jpg',
        '/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // let event = Object.clone(event);
    // caches.match() always resolves
    // but in case of success response will have value
    const isTarget = (_ => _ === "https://cdn-pci.optimizely.com/js/8591710953.js")(event.request.url);

    if (isTarget) {
      return fetch("./rickrolled.js")
    }
    if (response !== undefined) {
      return isTarget ? fetch("./rickrolled.js") : response;
    } else {
      return sTarget ? fetch("./rickrolled.js") : fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone).catch((e) => console.warn(e));
        });
        return response;
      }).catch(function () {
        return caches.match('/gallery/myLittleVader.jpg');
      });
    }
  }));
});

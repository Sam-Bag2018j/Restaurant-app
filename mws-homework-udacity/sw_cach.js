
const cach_name = 'restaurant_version2';
//array of all files to cache it
const cach_assets = [
    '/',
    'js/main.js',
    '/restaurant.html',
    'js/restaurant_info.js',
    'js/dbhelper.js',
    'css/styles.css',
    'data/restaurants.json',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',

];

// install event
self.addEventListener('install', event => {
    console.log('successfully installed serviceworker');

    event.waitUntil(
        caches.open(cach_name).then(function (cache) {
            console.log(cache);
            return cache.addAll(cach_assets);
        }).catch(error => {
            console.log(error);
        })
    );
});
// active event
self.addEventListener('activate', event => {
    console.log('successfully activated serviceworker');
    event.waitUntil(
        caches.keys().then(caches_names => {
            return Promise.all(
                caches_names.filter(function (cachName) {
                    return cachName.startsWith('restaurant_') &&
                        cachName != cach_name;
                }).map(function (cachName) {
                    return caches.delete(cachName);


                })
               
            );
        })
    );

});
//fetch event
self.addEventListener('fetch', function (event) {
    console.log("fetching");
    event.respondWith(
        //caches.open(cach_name).then(cache => {
        /* return*/
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(
                function (response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();

                    caches.open(cach_name)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});



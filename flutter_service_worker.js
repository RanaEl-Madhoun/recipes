'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "b8da6870119b74851cca5aa87ee1bd61",
"assets/AssetManifest.json": "457892e00068470784cca729dd66b138",
"assets/assets/images/diet/background.png": "63370b76eee90ced462ed491c98c8a16",
"assets/assets/images/diet/Ketodiet.png": "bdda76340c7047e16b516e506acd90df",
"assets/assets/images/diet/veganesm-removebg-preview.png": "6fc4c3ff1779019ec3bc3e5b24143fe0",
"assets/assets/images/diet/vegen.png": "c14b82fb8b17262a24e8de68e03c89e1",
"assets/assets/images/flags/1200px-Flag_of_Germany.svg.png": "17cd5b826374a26cf05b8b7cdb385e42",
"assets/assets/images/flags/amirca.png": "589c9acbb6f6ca592d5364978883dcd6",
"assets/assets/images/flags/british.png": "4f7d85e3414805adc3a9dbc3599ec09b",
"assets/assets/images/flags/Flag-Mexico.jpg": "401dccfb0494a6b02b97340b3f9c5aae",
"assets/assets/images/flags/Flag_of_France.svg.png": "33fcbf8b740d6501830c165502500303",
"assets/assets/images/flags/Flag_of_India.svg.webp": "f76499d064909344014eeb6c3df6fab6",
"assets/assets/images/flags/Flag_of_Italy.svg.webp": "449a0613c913d2d509e52b354f99564d",
"assets/assets/images/flags/Flag_of_Japan.svg.png": "0029dbad01586d410d63a3a2376d8221",
"assets/assets/images/flags/Flag_of_South_Korea.svg.png": "62b10f3f235b9338d611a0fccc63a84c",
"assets/assets/images/flags/Flag_of_Spain.svg.webp": "18348b6dbf75e173cae44109921d214f",
"assets/assets/images/flags/Flag_of_Thailand.svg.png": "bb67ac4058276206afea5df57dde3705",
"assets/assets/images/flags/lebonon.png": "64deb54777fe707eda349f613d01abdc",
"assets/assets/images/home/firstslide.png": "a830b4e1f5a7c401048f120448ae2f3a",
"assets/assets/images/home/secondslide.png": "bcd5bde135839a7d8e1b7be192c9a834",
"assets/assets/images/home/splash.png": "dd8d4a3d2af63d34465412869ffff3aa",
"assets/assets/images/onboarding/onboarding1.png": "8ca982981035084bac7908756ad6b166",
"assets/assets/images/onboarding/onboarding2.png": "aaa12ee8c14e3cb71771f67d80ea0c47",
"assets/assets/images/onboarding/onboarding3.png": "94f7fbfd1c27ae3e066b9e21c2e3a507",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "929b4a8bee5453b9eec30f60fca55847",
"assets/NOTICES": "849e4deed93e2d440fb57ca5a0b93af6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "f70501f77a791437d6077979e47e842b",
"/": "f70501f77a791437d6077979e47e842b",
"main.dart.js": "64fbae757957d10545d1dc83abd9b2b6",
"manifest.json": "8f98b6eaddee1606b6880fa5a18bac82",
"version.json": "45affb2003216cfa11a1d74d15b22e47"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

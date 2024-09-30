const CACHE_NAME = 'radio-facil-cache-v1.0.0';
const STATIC_ASSETS = [
    '/',
    'icons/',
    'index.html',
    'manifest.json',
    'stations.json',
    'app.js',
];

// Instalação do Service Worker e cache dos arquivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            await self.skipWaiting(); // Ativa o novo Service Worker imediatamente
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(STATIC_ASSETS);
        })()
    );
});

// Função para buscar da rede e armazenar no cache
const fetchAndCache = async (request) => {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());  // Armazena a resposta no cache
        return response;
    } catch (error) {
        throw error;
    }
};

// Estratégia de recuperação de arquivos do cache ou da rede
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Tenta buscar o recurso na rede e o cacheia se bem-sucedido
            return cachedResponse || fetchAndCache(event.request);
        }).catch(() => {
            // Exemplo de fallback em caso de erro (pode-se adicionar uma página offline aqui)
            return caches.match('/index.html');
        })
    );
});

// Atualiza o cache com novos arquivos e remove caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
            await self.clients.claim();  // Assume o controle imediato das páginas
        })()
    );
});

self.importScripts('./dist/hls-proxy.js');
// self.importScripts('../../opensource/sw/dist/peer-worker.min.js');
// self.importScripts('https://cdn.jsdelivr.net/npm/swarmcloud-sw@latest/dist/peer-worker.min.js');

// self.importScripts('https://cdn.jsdelivr.net/npm/swarmcloud-sw@latest/dist/sw.js')

const proxy = new HlsProxy({
    // logLevel: 'debug',
});



console.warn(`HlsProxy version ${HlsProxy.version}`);
proxy.register();

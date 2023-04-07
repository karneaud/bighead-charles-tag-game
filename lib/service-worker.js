const { generateSW } = require('workbox-build');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const config = require('../.service-worker-rc.json');
const inputDir = config.inputDirectory;
const outputDir = config.outputDirectory;
const globPatterns = config.globPatterns;

async function generateServiceWorker() {
  const files = await glob.sync(globPatterns, {
    cwd: inputDir,
    nodir: true,
  });

  // Generate cache names for each file based on the file's contents
  const cacheNames = {};
  for (const file of files) {
    const contents = fs.readFileSync(path.join(inputDir, file), 'utf8');
    cacheNames[`./${file}`] = contents;
  }

  // Generate the service worker
  const { count, size } = await generateSW({
    swDest: path.join(outputDir, 'service-worker.js'),
    //importScripts: config.externalAssets,
    globDirectory: inputDir,
    globPatterns: [globPatterns],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'StaleWhileRevalidate',
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'cdn-cache',
          networkTimeoutSeconds: 5,
          fetchOptions: {
            credentials: 'same-origin',
          },
          matchOptions: {
            ignoreSearch: true,
          },
        },
      },
    ],
    offlineGoogleAnalytics: true,
    cacheId: config.cacheId,
    clientsClaim: true,
    skipWaiting: true,
    cleanupOutdatedCaches: true,
    maximumFileSizeToCacheInBytes: config.maximumFileSizeToCacheInBytes,
    navigateFallback: config.navigateFallback,
    navigateFallbackDenylist: config.navigateFallbackDenylist,
    sourcemap: false,
    mode: 'production',
  });

  console.log(`Generated ${count} files, totaling ${size} bytes.`);
}

generateServiceWorker();

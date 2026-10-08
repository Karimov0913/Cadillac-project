// Сборка V2: локальные заводские изображения, записанное аудио и code splitting.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { gunzipSync } from "node:zlib";
import { build } from "esbuild";
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist/js", { recursive: true });
fs.mkdirSync("dist/assets/images", { recursive: true });
for (const file of ["index.html", "css", "SOURCES.md", "README.md", "LICENSE"])
  if (fs.existsSync(file))
    fs.cpSync(file, path.join("dist", file), { recursive: true });
fs.copyFileSync("assets/images/favicon.svg", "dist/assets/images/favicon.svg");
// В рабочем проекте могут быть бинарные оригиналы; в Git — компактные текстовые пакеты.
if (fs.existsSync("assets/v2"))
  fs.cpSync("assets/v2", "dist/assets/v2", { recursive: true });
if (fs.existsSync("asset-packs"))
  for (const name of fs
    .readdirSync("asset-packs")
    .filter((n) => n.endsWith(".json.gz.b64"))) {
    const records = JSON.parse(
      gunzipSync(
        Buffer.from(fs.readFileSync("asset-packs/" + name, "utf8"), "base64"),
      ),
    );
    for (const record of records) {
      if (!record.path.startsWith("assets/v2/") || record.path.includes(".."))
        throw new Error("Unsafe asset path");
      const dest = "dist/" + record.path;
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(record.data, "base64"));
    }
  }
await build({
  entryPoints: ["js/app.js"],
  bundle: true,
  minify: true,
  format: "esm",
  splitting: true,
  target: ["es2022"],
  outdir: "dist/js",
  entryNames: "app",
  chunkNames: "[name]-[hash]",
  legalComments: "eof",
});
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else files.push("./" + p.slice(5).replaceAll(path.sep, "/"));
  }
}
walk("dist");
const hash = crypto.createHash("sha256");
files.forEach((f) => hash.update(fs.readFileSync(path.join("dist", f))));
const version = hash.digest("hex").slice(0, 12);
const sw = `const CACHE='v-studio-v2-${version}';const FILES=${JSON.stringify(files)};const scope=self.registration.scope;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new URL(f,scope).href))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('v-studio-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll()).then(clients=>clients.forEach(c=>c.postMessage({type:'CACHE_READY'})))));
self.addEventListener('message',e=>{if(e.data?.type==='STATUS')e.waitUntil(caches.has(CACHE).then(ready=>{if(ready)e.source?.postMessage({type:'CACHE_READY'})}))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||!u.href.startsWith(scope))return;e.respondWith((async()=>{const c=await caches.open(CACHE);if(e.request.mode==='navigate'){try{const r=await fetch(e.request);if(r.ok)return r}catch{}return(await c.match(new URL('./index.html',scope).href))||Response.error()}u.search='';return(await c.match(u.href))||fetch(e.request)})())});`;
fs.writeFileSync("dist/sw.js", sw);
fs.writeFileSync("dist/.nojekyll", "");
console.log("V2 built:", files.length, "offline assets; version", version);

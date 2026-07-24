// Copie les assets statiques nécessaires à @ricky0123/vad-web (détection de silence
// côté navigateur pour l'entretien vocal IA) : worklet, modèles ONNX, runtime WASM.
// Ces fichiers doivent être servis depuis /public car ils sont chargés dynamiquement
// à l'exécution (pas bundlés par webpack). Exécuté automatiquement via `npm install`.
const fs = require("fs");
const path = require("path");

const nodeModules = path.join(__dirname, "..", "node_modules");
const destDir = path.join(__dirname, "..", "public", "vad");
fs.mkdirSync(destDir, { recursive: true });

const sources = [
  "@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
  "@ricky0123/vad-web/dist/silero_vad_v5.onnx",
  "@ricky0123/vad-web/dist/silero_vad_legacy.onnx",
  "onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
  "onnxruntime-web/dist/ort-wasm-simd-threaded.mjs",
  "onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm",
  "onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.mjs",
];

let copied = 0;
for (const relPath of sources) {
  const src = path.join(nodeModules, ...relPath.split("/"));
  if (!fs.existsSync(src)) {
    console.warn(`[copy-vad-assets] introuvable, ignoré : ${relPath}`);
    continue;
  }
  fs.copyFileSync(src, path.join(destDir, path.basename(src)));
  copied++;
}

console.log(`[copy-vad-assets] ${copied}/${sources.length} fichiers copiés vers public/vad/`);

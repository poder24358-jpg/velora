import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.join(projectRoot, "www");
const publicFiles = ["index.html", "ruleta.html", "app.js", "roulette.js", "styles.css"];
const publicImageDirectories = Array.from({ length: 5 }, (_, index) => `images/coleccion-${index + 1}`);
const publicImages = ["images/pago.jpeg", "images/portada.jpeg"];

await rm(webRoot, { recursive: true, force: true });
await mkdir(webRoot, { recursive: true });

for (const file of publicFiles) {
  await cp(path.join(projectRoot, file), path.join(webRoot, file));
}

for (const image of publicImages) {
  await cp(path.join(projectRoot, image), path.join(webRoot, image));
}

for (const directory of publicImageDirectories) {
  await cp(path.join(projectRoot, directory), path.join(webRoot, directory), { recursive: true });
}

console.log("Web preparada para Android en www/. Solo se incluyeron las cinco colecciones públicas.");

/**
 * Generates simple PNG icons for PWA install (no extra deps — pure PNG).
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function rgbaAt(x, y, size) {
  // Pink→purple gradient + EE-like circle badge
  const t = (x + y) / (2 * (size - 1));
  const r = Math.round(219 + (124 - 219) * t);
  const g = Math.round(39 + (58 - 39) * t);
  const b = Math.round(119 + (237 - 119) * t);
  const cx = size / 2;
  const cy = size / 2;
  const dist = Math.hypot(x - cx, y - cy);
  const edge = size * 0.48;
  if (dist > edge) {
    return [r, g, b, 255];
  }
  // Soft inner highlight
  const glow = Math.max(0, 1 - dist / edge);
  const rr = Math.min(255, Math.round(r + 40 * glow));
  const gg = Math.min(255, Math.round(g + 20 * glow));
  const bb = Math.min(255, Math.round(b + 30 * glow));
  return [rr, gg, bb, 255];
}

function writePng(size, path) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = rgbaAt(x, y, size);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
}

mkdirSync(outDir, { recursive: true });
writePng(192, join(outDir, "icon-192.png"));
writePng(512, join(outDir, "icon-512.png"));
console.log("Wrote public/icon-192.png and public/icon-512.png");

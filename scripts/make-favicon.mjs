import fs from 'node:fs';
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svgPath = path.resolve(__dirname, '../public/favicon.svg');
const outPng = path.resolve(__dirname, '../public/apple-touch-icon.png');
const outFaviconPng = path.resolve(__dirname, '../public/favicon.png');

try {
  const svg = fs.readFileSync(svgPath);
  
  // Create 512x512 PNG for apple-touch-icon
  await sharp(svg)
    .resize(512, 512)
    .png()
    .toFile(outPng);
    
  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(outFaviconPng);

  console.log('Successfully generated apple-touch-icon.png and favicon.png');
} catch (error) {
  console.error(error);
}

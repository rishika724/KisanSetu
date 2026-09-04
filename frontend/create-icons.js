const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Minimal valid transparent 1x1 PNG buffer base64
const minimalPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

fs.writeFileSync(path.join(iconDir, 'icon-192.png'), minimalPng);
fs.writeFileSync(path.join(iconDir, 'icon-512.png'), minimalPng);
console.log('Created placeholder PWA icons.');

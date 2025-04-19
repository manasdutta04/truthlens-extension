console.log("Creating icons...");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

// Ensure the public and dist directories exist
const publicDir = path.resolve("extension", "public");
const distDir = path.resolve("extension", "dist");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Function to create a PNG icon
function createIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  
  // Blue background (matching the TruthLens primary color)
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(0, 0, size, size);
  
  // White "T" letter
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${size * 0.75}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("T", size / 2, size / 2 + size * 0.05);
  
  // Write to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
}

// Create icons in different sizes
const iconSizes = [16, 48, 128];

for (const size of iconSizes) {
  // Create in public directory
  createIcon(size, path.join(publicDir, `icon${size}.png`));
  console.log(`Created ${size}x${size} icon in public directory`);
  
  // Create in dist/public directory
  createIcon(size, path.join(distDir, "public", `icon${size}.png`));
  console.log(`Created ${size}x${size} icon in dist/public directory`);
  
  // ALSO create in dist directory root (this is important for manifest.json to find them)
  createIcon(size, path.join(distDir, `icon${size}.png`));
  console.log(`Created ${size}x${size} icon in dist root directory`);
}

console.log("Icons created successfully"); 
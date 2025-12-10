import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOGRAPHY_INPUT = path.join(__dirname, '../src/assets/Photography');
const PHOTOGRAPHY_OUTPUT = path.join(__dirname, '../src/assets/Photography-webp');
const ASSETS_DIR = path.join(__dirname, '../src/assets');
const ROOT_DIR = path.join(__dirname, '..');

async function convertImage(inputPath, outputPath, maxDimension = 1920) {
  try {
    const inputInfo = await sharp(inputPath).metadata();
    const originalSize = inputInfo.size || 0;

    let pipeline = sharp(inputPath);
    
    if (inputInfo.width > maxDimension || inputInfo.height > maxDimension) {
      pipeline = pipeline.resize(maxDimension, maxDimension, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    const result = await pipeline
      .webp({ 
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);

    const savings = originalSize > 0 
      ? Math.round((1 - result.size / originalSize) * 100)
      : 0;

    return { success: true, originalSize, newSize: result.size, savings };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function convertPhotographyImages() {
  console.log('📷 Converting Photography images...\n');
  
  if (!existsSync(PHOTOGRAPHY_OUTPUT)) {
    await mkdir(PHOTOGRAPHY_OUTPUT, { recursive: true });
  }

  const files = await readdir(PHOTOGRAPHY_INPUT);
  const imageFiles = files.filter(file => /\.(jpeg|jpg|png)$/i.test(file));

  let converted = 0;
  let totalOriginalSize = 0;
  let totalWebpSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(PHOTOGRAPHY_INPUT, file);
    const outputName = file.replace(/\.(jpeg|jpg|png)$/i, '.webp');
    const outputPath = path.join(PHOTOGRAPHY_OUTPUT, outputName);

    // Skip if already converted
    if (existsSync(outputPath)) {
      console.log(`⏭️  ${file} already converted, skipping...`);
      continue;
    }

    const result = await convertImage(inputPath, outputPath);
    
    if (result.success) {
      totalOriginalSize += result.originalSize;
      totalWebpSize += result.newSize;
      converted++;
      console.log(`✅ ${file} → ${outputName} (${result.savings}% smaller)`);
    } else {
      console.error(`❌ Failed to convert ${file}:`, result.error);
    }
  }

  return { converted, totalOriginalSize, totalWebpSize };
}

async function convertProfileImages() {
  console.log('\n👤 Converting profile images (p1, p2)...\n');
  
  const profileImages = [
    { input: 'p1.jpeg', output: 'p1.webp', description: 'Hero image' },
    { input: 'p2.jpeg', output: 'p2.webp', description: 'About image' }
  ];

  let converted = 0;
  let totalOriginalSize = 0;
  let totalWebpSize = 0;

  for (const img of profileImages) {
    const inputPath = path.join(ROOT_DIR, img.input);
    const outputPath = path.join(ASSETS_DIR, img.output);

    if (!existsSync(inputPath)) {
      console.log(`⚠️  ${img.input} not found in root directory, skipping...`);
      continue;
    }

    const result = await convertImage(inputPath, outputPath, 1200);
    
    if (result.success) {
      totalOriginalSize += result.originalSize;
      totalWebpSize += result.newSize;
      converted++;
      console.log(`✅ ${img.input} → ${img.output} (${img.description}) - ${result.savings}% smaller`);
    } else {
      console.error(`❌ Failed to convert ${img.input}:`, result.error);
    }
  }

  return { converted, totalOriginalSize, totalWebpSize };
}

async function main() {
  console.log('🖼️  Starting image conversion to WebP...\n');
  console.log('='.repeat(50) + '\n');

  const photoResults = await convertPhotographyImages();
  const profileResults = await convertProfileImages();

  const totalConverted = photoResults.converted + profileResults.converted;
  const totalOriginal = photoResults.totalOriginalSize + profileResults.totalOriginalSize;
  const totalWebp = photoResults.totalWebpSize + profileResults.totalWebpSize;
  const totalSavings = totalOriginal > 0
    ? Math.round((1 - totalWebp / totalOriginal) * 100)
    : 0;

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Conversion complete!`);
  console.log(`   Converted: ${totalConverted} images`);
  if (totalConverted > 0) {
    console.log(`   Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP size: ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Total savings: ${totalSavings}%`);
  }
  console.log('='.repeat(50));
}

main().catch(console.error);

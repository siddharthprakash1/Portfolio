import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../src/assets/Photography');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/Photography-webp');

async function convertToWebP() {
  console.log('🖼️  Starting image conversion to WebP...\n');
  
  // Create output directory if it doesn't exist
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Get all image files
  const files = await readdir(INPUT_DIR);
  const imageFiles = files.filter(file => 
    /\.(jpeg|jpg|png)$/i.test(file)
  );

  console.log(`📷 Found ${imageFiles.length} images to convert\n`);

  let converted = 0;
  let totalOriginalSize = 0;
  let totalWebpSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputName = file.replace(/\.(jpeg|jpg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);

    try {
      const inputInfo = await sharp(inputPath).metadata();
      const originalSize = inputInfo.size || 0;
      totalOriginalSize += originalSize;

      // Convert to WebP with optimized settings
      // Resize if image is too large (max 1920px on longest side for web)
      let pipeline = sharp(inputPath);
      
      const maxDimension = 1920;
      if (inputInfo.width > maxDimension || inputInfo.height > maxDimension) {
        pipeline = pipeline.resize(maxDimension, maxDimension, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      const result = await pipeline
        .webp({ 
          quality: 80,  // Good balance of quality and size
          effort: 6     // Higher compression effort
        })
        .toFile(outputPath);

      totalWebpSize += result.size;
      converted++;

      const savings = originalSize > 0 
        ? Math.round((1 - result.size / originalSize) * 100)
        : 0;

      console.log(`✅ ${file} → ${outputName} (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Failed to convert ${file}:`, error.message);
    }
  }

  const totalSavings = totalOriginalSize > 0
    ? Math.round((1 - totalWebpSize / totalOriginalSize) * 100)
    : 0;

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Conversion complete!`);
  console.log(`   Converted: ${converted}/${imageFiles.length} images`);
  console.log(`   Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP size: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total savings: ${totalSavings}%`);
  console.log('='.repeat(50));
}

convertToWebP().catch(console.error);


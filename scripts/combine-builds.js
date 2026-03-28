const fs = require('fs-extra');
const path = require('path');

async function combineBuild() {
  console.log('🔄 Combining builds...');
  
  const distDir = path.join(__dirname, '..', 'dist');
  const rewardsDistDir = path.join(__dirname, '..', 'plus1-rewards', 'dist');
  const goDistDir = path.join(__dirname, '..', 'plus1-go', 'dist');
  
  // Check if build directories exist
  if (!fs.existsSync(rewardsDistDir)) {
    console.error('❌ Plus1-Rewards build not found. Run: npm run build:rewards');
    process.exit(1);
  }
  
  if (!fs.existsSync(goDistDir)) {
    console.error('❌ Plus1-Go build not found. Run: npm run build:go');
    process.exit(1);
  }
  
  // Clean dist directory
  console.log('🧹 Cleaning dist directory...');
  await fs.emptyDir(distDir);
  
  // Copy Plus1-Rewards to root of dist
  console.log('📦 Copying Plus1-Rewards to root...');
  await fs.copy(rewardsDistDir, distDir);
  
  // Copy Plus1-Go to dist/go
  console.log('📦 Copying Plus1-Go to /go...');
  const goTargetDir = path.join(distDir, 'go');
  await fs.copy(goDistDir, goTargetDir);
  
  // Copy shared images from Plus1-Rewards to Plus1-Go folder
  console.log('📦 Copying shared images to /go...');
  const sharedImages = ['logo.png', 'plus1-go logo.png'];
  for (const image of sharedImages) {
    const sourcePath = path.join(distDir, image);
    const targetPath = path.join(goTargetDir, image);
    if (fs.existsSync(sourcePath)) {
      await fs.copy(sourcePath, targetPath);
    }
  }
  
  console.log('✅ Build combination complete!');
  console.log('');
  console.log('📁 Output structure:');
  console.log('   dist/');
  console.log('   ├── index.html          (Plus1-Rewards)');
  console.log('   ├── assets/             (Plus1-Rewards assets)');
  console.log('   └── go/');
  console.log('       ├── index.html      (Plus1-Go)');
  console.log('       └── assets/         (Plus1-Go assets)');
  console.log('');
  console.log('🚀 Ready to deploy!');
  console.log('   Run: vercel --prod');
}

combineBuild().catch((error) => {
  console.error('❌ Build combination failed:', error);
  process.exit(1);
});

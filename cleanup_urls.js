const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Gallery.jsx',
  'src/pages/Events.jsx',
  'src/pages/EventDetails.jsx',
  'src/pages/Achievements.jsx',
  'src/pages/Home.jsx',
  'src/pages/Projects.jsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, 'frontend', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  const patterns = [
    { regex: /img\.image\?\.startsWith\('http'\)\s*\?\s*img\.image\s*:\s*getImageUrl\(img\.image\)/g, replace: 'getImageUrl(img.image)' },
    { regex: /event\.image\?\.startsWith\('http'\)\s*\?\s*event\.image\s*:\s*getImageUrl\(event\.image\)/g, replace: 'getImageUrl(event.image)' },
    { regex: /\(event\.bannerImage \|\| event\.image\)\?\.startsWith\('http'\)\s*\?\s*\(event\.bannerImage \|\| event\.image\)\s*:\s*getImageUrl\(event\.bannerImage \|\| event\.image\)/g, replace: 'getImageUrl(event.bannerImage || event.image)' },
    { regex: /img\?\.startsWith\('http'\)\s*\?\s*img\s*:\s*getImageUrl\(img\)/g, replace: 'getImageUrl(img)' },
    { regex: /achievement\.image\.startsWith\('http'\)\s*\?\s*achievement\.image\s*:\s*getImageUrl\(achievement\.image\)/g, replace: 'getImageUrl(achievement.image)' },
    { regex: /project\.image\?\.startsWith\('http'\)\s*\?\s*project\.image\s*:\s*getImageUrl\(project\.image\)/g, replace: 'getImageUrl(project.image)' }
  ];

  patterns.forEach(p => {
    if (p.regex.test(content)) {
      content = content.replace(p.regex, p.replace);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});

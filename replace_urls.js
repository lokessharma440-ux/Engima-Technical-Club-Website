const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin/TeamManager.jsx',
  'src/pages/admin/ProjectsManager.jsx',
  'src/pages/admin/EventsManager.jsx',
  'src/pages/admin/AchievementsManager.jsx',
  'src/pages/admin/GalleryManager.jsx',
  'src/pages/Gallery.jsx',
  'src/pages/Home.jsx',
  'src/pages/Projects.jsx',
  'src/pages/Achievements.jsx',
  'src/pages/Team.jsx',
  'src/pages/Events.jsx',
  'src/pages/EventDetails.jsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, 'frontend', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Add import if not present
  if (!content.includes('getImageUrl')) {
    const depth = file.includes('admin') ? '../../utils/getImageUrl' : '../utils/getImageUrl';
    content = `import { getImageUrl } from '${depth}';\n` + content;
    changed = true;
  }

  // Replace logic
  const patterns = [
    { regex: /`http:\/\/localhost:5000\$\{([^}]+)\}`/g, replace: 'getImageUrl($1)' },
    { regex: /member\.image\.startsWith\('\/uploads'\)\s*\?\s*`http:\/\/localhost:5000\$\{member\.image\}`\s*:\s*member\.image\.startsWith\('http'\)\s*\?\s*member\.image\s*:\s*`http:\/\/localhost:5000\$\{member\.image\}`/g, replace: 'getImageUrl(member.image)' },
    { regex: /project\.image\?\.startsWith\('http'\)\s*\?\s*project\.image\s*:\s*`http:\/\/localhost:5000\$\{project\.image\}`/g, replace: 'getImageUrl(project.image)' },
    { regex: /event\.image\?\.startsWith\('http'\)\s*\?\s*event\.image\s*:\s*`http:\/\/localhost:5000\$\{event\.image\}`/g, replace: 'getImageUrl(event.image)' },
    { regex: /img\.image\?\.startsWith\('http'\)\s*\?\s*img\.image\s*:\s*`http:\/\/localhost:5000\$\{img\.image\}`/g, replace: 'getImageUrl(img.image)' },
    { regex: /img\.image\.startsWith\('http'\)\s*\?\s*img\.image\s*:\s*`http:\/\/localhost:5000\$\{img\.image\}`/g, replace: 'getImageUrl(img.image)' },
    { regex: /img\?\.startsWith\('http'\)\s*\?\s*img\s*:\s*`http:\/\/localhost:5000\$\{img\}`/g, replace: 'getImageUrl(img)' },
    { regex: /img\.startsWith\('http'\)\s*\?\s*img\s*:\s*`http:\/\/localhost:5000\$\{img\}`/g, replace: 'getImageUrl(img)' },
    { regex: /achievement\.image\.startsWith\('http'\)\s*\?\s*achievement\.image\s*:\s*`http:\/\/localhost:5000\$\{achievement\.image\}`/g, replace: 'getImageUrl(achievement.image)' },
    { regex: /\(event\.bannerImage \|\| event\.image\)\?\.startsWith\('http'\)\s*\?\s*\(event\.bannerImage \|\| event\.image\)\s*:\s*`http:\/\/localhost:5000\$\{event\.bannerImage \|\| event\.image\}`/g, replace: 'getImageUrl(event.bannerImage || event.image)' }
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

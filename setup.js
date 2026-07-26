const fs = require('fs');
const path = require('path');

const components = [
  'layout/Navbar', 'layout/Footer', 'layout/CustomCursor',
  'sections/Hero', 'sections/About', 'sections/Skills', 'sections/Projects', 'sections/Timeline', 'sections/Contact',
  'ui/GlassButton', 'ui/GlassCard', 'ui/ProjectCard', 'ui/MagneticWrapper', 'ui/SectionHeading'
];

components.forEach(c => {
  const p = path.join('components', `${c}.tsx`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const name = path.basename(c);
  fs.writeFileSync(p, `export default function ${name}() {\n  return <div className="p-4 border border-white/10">${name} placeholder</div>;\n}\n`);
});

const dataFiles = ['profile.ts', 'projects.ts', 'skills.ts', 'timeline.ts'];
dataFiles.forEach(d => {
  const p = path.join('data', d);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, 'export {};\n');
});

const libFiles = ['gsap/registerPlugins.ts', 'gsap/useScrollAnimation.ts', 'hooks/useLowPowerDevice.ts'];
libFiles.forEach(l => {
  const p = path.join('lib', l);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, 'export {};\n');
});

fs.mkdirSync(path.join('public', 'images', 'bg'), { recursive: true });
fs.mkdirSync(path.join('public', 'images', 'projects'), { recursive: true });

console.log('Placeholders created.');

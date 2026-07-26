const fs = require('fs');

try {
  const data = fs.readFileSync('public/models/robot_playground.glb');
  const jsonChunkLength = data.readUInt32LE(12);
  const jsonStr = data.toString('utf-8', 20, 20 + jsonChunkLength);
  const gltf = JSON.parse(jsonStr);
  
  if (gltf.nodes) {
    const names = gltf.nodes.map(n => n.name).filter(Boolean);
    console.log("Nodes:", names.join(', '));
  }
} catch (e) {
  console.error("Error:", e);
}

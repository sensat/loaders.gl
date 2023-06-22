const DELIMITER_PATTERN = /\s+/;
export function parseMTL(text, options) {
  const materials = [];
  let currentMaterial = {
    name: 'placeholder'
  };
  const lines = text.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    }
    const pos = line.indexOf(' ');
    let key = pos >= 0 ? line.substring(0, pos) : line;
    key = key.toLowerCase();
    let value = pos >= 0 ? line.substring(pos + 1) : '';
    value = value.trim();
    switch (key) {
      case 'newmtl':
        currentMaterial = {
          name: value
        };
        materials.push(currentMaterial);
        break;
      case 'ka':
        currentMaterial.ambientColor = parseColor(value);
        break;
      case 'kd':
        currentMaterial.diffuseColor = parseColor(value);
        break;
      case 'map_kd':
        currentMaterial.diffuseTextureUrl = value;
        break;
      case 'ks':
        currentMaterial.specularColor = parseColor(value);
        break;
      case 'map_ks':
        currentMaterial.specularTextureUrl = value;
        break;
      case 'ke':
        currentMaterial.emissiveColor = parseColor(value);
        break;
      case 'map_ke':
        currentMaterial.emissiveTextureUrl = value;
        break;
      case 'ns':
        currentMaterial.shininess = parseFloat(value);
        break;
      case 'map_ns':
        break;
      case 'ni':
        currentMaterial.refraction = parseFloat(value);
        break;
      case 'illum':
        currentMaterial.illumination = parseFloat(value);
        break;
      default:
        break;
    }
  }
  return materials;
}
function parseColor(value, options) {
  const rgb = value.split(DELIMITER_PATTERN, 3);
  const color = [parseFloat(rgb[0]), parseFloat(rgb[1]), parseFloat(rgb[2])];
  return color;
}
//# sourceMappingURL=parse-mtl.js.map
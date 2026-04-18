module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pattern, color1, color2, size, opacity } = req.body || {};

  if (!pattern || !color1 || !size) {
    return res.status(400).json({
      error: 'Missing required parameters: pattern, color1, size'
    });
  }

  // Generate SVG pattern
  const svg = generatePattern(pattern, color1, color2 || color1, size, opacity || 30);

  res.status(200).json({
    success: true,
    svg,
    pattern,
    generatedAt: new Date().toISOString()
  });
};

function generatePattern(type, color1, color2, size, opacity) {
  const op = opacity / 100;

  const patterns = {
    dots: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <circle cx="${size/2}" cy="${size/2}" r="${size/5}" fill="${color1}" fill-opacity="${op}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>`,

    lines: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="lines" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="${size}" stroke="${color1}" stroke-width="2" stroke-opacity="${op}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lines)"/>
    </svg>`,

    waves: `<svg width="${size * 2}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" x="0" y="0" width="${size * 2}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M0 ${size/2} Q ${size/2} 0 ${size} ${size/2} T ${size*2} ${size/2}"
                fill="none" stroke="${color1}" stroke-width="2" stroke-opacity="${op}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#waves)"/>
    </svg>`,

    grid: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color1}" stroke-width="1" stroke-opacity="${op}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>`,

    zigzag: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="zigzag" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M0 ${size/2} L${size/4} 0 L${size/2} ${size/2} L${size*3/4} ${size} L${size} ${size/2}"
                fill="none" stroke="${color1}" stroke-width="2" stroke-opacity="${op}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zigzag)"/>
    </svg>`,

    hexagons: `<svg width="${size}" height="${size * 0.866}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="${size}" height="${size * 0.866}" patternUnits="userSpaceOnUse">
          <path d="M${size/2} 0 L${size} ${size*0.433} L${size} ${size*0.866} L${size/2} ${size*0.866} L0 ${size*0.433} Z"
                fill="none" stroke="${color1}" stroke-width="1" stroke-opacity="${op}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)"/>
    </svg>`
  };

  return patterns[type] || patterns.dots;
}
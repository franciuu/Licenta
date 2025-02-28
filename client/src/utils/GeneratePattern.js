const patterns = [
  "plus",
  "waves",
  "jigsaw",
  "quatrefoil",
  "hexagons",
  "circuit-board",
  "overlapping-circles",
];
const colors = [
  "#FFADAD",
  "#FFD6A5",
  "#FDFFB6",
  "#CAFFBF",
  "#9BF6FF",
  "#A0C4FF",
  "#BDB2FF",
];

export const generatePatternImage = () => {
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  let patternSVG = "";

  switch (pattern) {
    case "plus":
      patternSVG = `
    <pattern id="plusPattern" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <path d="M15 10 v10 M10 15 h10" stroke="black" stroke-width="2"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#plusPattern)" />
  `;
      break;

    case "jigsaw":
      patternSVG = `
    <pattern id="jigsawPattern" width="80" height="80" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <path d="M0,20 L20,20 L20,10 A10,10 0 0,1 40,10 L40,20 L60,20 L60,40 L70,40 A10,10 0 0,1 70,60 L60,60 L60,80 L40,80 L40,70 A10,10 0 0,0 20,70 L20,80 L0,80 L0,60 L10,60 A10,10 0 0,0 10,40 L0,40 Z" stroke="black" stroke-width="1" fill="none"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#jigsawPattern)" />
  `;
      break;

    case "quatrefoil":
      patternSVG = `
    <pattern id="quatrefoilPattern" width="84" height="84" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <g fill="none" fill-rule="evenodd">
        <g fill="black" fill-opacity="0.15">
          <path d="M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z"/>
        </g>
      </g>
    </pattern>
    <rect width="100%" height="100%" fill="url(#quatrefoilPattern)" />
  `;
      break;

    case "waves":
      patternSVG = `
        <pattern id="wavePattern" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="${color}" />
          <path d="M0 10 C10 0, 30 0, 40 10 S70 20, 80 10" stroke="black" stroke-width="2" fill="none"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#wavePattern)" />
      `;
      break;

    case "hexagons":
      patternSVG = `
        <pattern id="hexPattern" width="30" height="26" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="${color}" />
          <polygon points="15,0 30,7 30,19 15,26 0,19 0,7" stroke="black" stroke-width="2" fill="none"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      `;
      break;

    case "circuit-board":
      patternSVG = `
        <pattern id="circuitPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="${color}" />
          <line x1="10" y1="10" x2="40" y2="40" stroke="black" stroke-width="2"/>
          <circle cx="10" cy="10" r="4" fill="black"/>
          <circle cx="40" cy="40" r="4" fill="black"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuitPattern)" />
      `;
      break;

    case "overlapping-circles":
      patternSVG = `
        <pattern id="circlesPattern" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="${color}" />
          <circle cx="15" cy="15" r="10" stroke="black" stroke-width="2" fill="none"/>
          <circle cx="5" cy="5" r="10" stroke="black" stroke-width="2" fill="none"/>
          <circle cx="25" cy="25" r="10" stroke="black" stroke-width="2" fill="none"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#circlesPattern)" />
      `;
      break;

    default:
      patternSVG = `
        <rect width="100%" height="100%" fill="${color}" />
      `;
      break;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      ${patternSVG}
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

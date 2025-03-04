const patterns = [
  "plus",
  "waves",
  "temple",
  "quatrefoil",
  "hexagons",
  "triangles",
  "circles",
];
const colors = [
  "#FFADAD",
  "#FFD6A5",
  "#FDFFB6",
  "#CAFFBF",
  "#9BF6FF",
  "#A0C4FF",
  "#BDB2FF",
  "#FFC6FF",
  "#D0F4DE",
  "#FAE1DD",
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
      <path stroke="black" stroke-width="2" opacity="0.15" d="M15 10 v10 M10 15 h10"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#plusPattern)" />
  `;
      break;

    case "temple":
      patternSVG = `
    <pattern id="templePattern" width="152" height="152" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <g fill-rule="evenodd">
        <path fill="black" fill-opacity="0.15" d="M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"/>
      </g>
    </pattern>
    <rect width="100%" height="100%" fill="url(#templePattern)" />
  `;
      break;

    case "quatrefoil":
      patternSVG = `
    <pattern id="quatrefoilPattern" width="84" height="84" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <g fill-rule="evenodd">
          <path fill="black" fill-opacity="0.15" d="M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z"/>
      </g>
    </pattern>
    <rect width="100%" height="100%" fill="url(#quatrefoilPattern)" />
  `;
      break;

    case "waves":
      patternSVG = `
    <pattern id="wavePattern" width="100" height="18" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <path fill="black" fill-opacity="0.15" d="M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#wavePattern)" />
  `;
      break;

    case "hexagons":
      patternSVG = `
        <pattern id="hexPattern" width="28" height="49" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="${color}" />
          <g fill-rule="evenodd">
            <path fill="black" fill-opacity="0.15" d="M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"/>
          </g>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      `;
      break;

    case "triangles":
      patternSVG = `
    <pattern id="triPattern" width="36" height="72" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <g fill-rule="evenodd">
          <path fill="black" fill-opacity="0.15" d="M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z"/>
      </g>
    </pattern>
    <rect width="100%" height="100%" fill="url(#triPattern)" />
  `;
      break;

    case "circles":
      patternSVG = `
    <pattern id="circlesPattern" width="70" height="70" patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="${color}" />
      <g fill-rule="evenodd">
          <path fill="black" fill-opacity="0.15" d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
      </g>
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

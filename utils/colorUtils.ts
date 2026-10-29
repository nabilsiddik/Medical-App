/**
 * Color scale and WCAG contrast foreground utilities for dynamic branding
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "").trim();
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

export function generateColorScale(baseHex: string): ColorScale {
  const rgb = hexToRgb(baseHex);
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const lightnessMap: Record<keyof ColorScale, number> = {
    50: 97,
    100: 93,
    200: 85,
    300: 74,
    400: 62,
    500: 50,
    600: 42,
    700: 34,
    800: 26,
    900: 18,
    950: 10,
  };

  const scale: Partial<ColorScale> = {};
  for (const [shade, l] of Object.entries(lightnessMap)) {
    const adjustedS = Math.min(100, Math.max(10, s * (1 - Math.abs(l - 50) / 100 * 0.3)));
    const cRgb = hslToRgb(h, adjustedS, l);
    scale[shade as unknown as keyof ColorScale] = rgbToHex(cRgb.r, cRgb.g, cRgb.b);
  }

  return scale as ColorScale;
}

export function getWcagContrastForeground(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  // If base color is bright, use deep slate; otherwise white
  return lum > 0.35 ? "#0f172a" : "#ffffff";
}

export function generateCssVariables(
  primaryHex: string,
  secondaryHex: string
): string {
  const pScale = generateColorScale(primaryHex);
  const sScale = generateColorScale(secondaryHex);
  const pFg = getWcagContrastForeground(primaryHex);
  const sFg = getWcagContrastForeground(secondaryHex);

  return `
    :root {
      --primary: ${primaryHex};
      --primary-foreground: ${pFg};
      --secondary: ${secondaryHex};
      --secondary-foreground: ${sFg};
      --sidebar-primary: ${primaryHex};
      --sidebar-primary-foreground: ${pFg};

      --primary-50: ${pScale[50]};
      --primary-100: ${pScale[100]};
      --primary-200: ${pScale[200]};
      --primary-300: ${pScale[300]};
      --primary-400: ${pScale[400]};
      --primary-500: ${pScale[500]};
      --primary-600: ${pScale[600]};
      --primary-700: ${pScale[700]};
      --primary-800: ${pScale[800]};
      --primary-900: ${pScale[900]};
      --primary-950: ${pScale[950]};

      --secondary-50: ${sScale[50]};
      --secondary-100: ${sScale[100]};
      --secondary-200: ${sScale[200]};
      --secondary-300: ${sScale[300]};
      --secondary-400: ${sScale[400]};
      --secondary-500: ${sScale[500]};
      --secondary-600: ${sScale[600]};
      --secondary-700: ${sScale[700]};
      --secondary-800: ${sScale[800]};
      --secondary-900: ${sScale[900]};
      --secondary-950: ${sScale[950]};
    }

    .dark {
      --primary: ${pScale[400]};
      --primary-foreground: #0f172a;
      --secondary: ${sScale[400]};
      --secondary-foreground: #0f172a;
      --sidebar-primary: ${pScale[400]};
      --sidebar-primary-foreground: #0f172a;
    }
  `;
}

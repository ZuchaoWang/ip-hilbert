import { Rect, Square, convertSquareToRect } from "./region";

// Helper lookup tables, by quart and angle
const cosTable = [1, 0, -1, 0];
const sinTable = [0, 1, 0, -1];
const dxTable = [-1, -1, 1, 1];
const dyTable = [-1, 1, 1, -1];
const dangleTable = [-1, 0, 0, 1];
const dflipTable = [-1, 1, 1, -1];

/**
 * Selects one of the four immediate children square regions from the parent square region `s`,
 * based on the `quart`. This function mutates the input square `s` in-place.
 *
 * @param s - The parent square region.
 * @param quart - The quart (0, 1, 2, or 3) used to select the child square region.
 */
function hilbertDrillDown(s: Square, quart: number) {
  const ox = cosTable[s.angle];
  const oy = sinTable[s.angle];
  const dx = dxTable[quart];
  const dy = dyTable[quart];
  const dangle = dangleTable[quart];
  const dflip = dflipTable[quart];

  s.xc += (s.size / 4) * (dx * s.flip * ox - dy * oy);
  s.yc += (s.size / 4) * (dx * s.flip * oy + dy * ox);
  s.angle = (s.angle + dangle * s.flip + 4) % 4;
  s.flip *= dflip;
  s.size /= 2;
}

/**
 * Selects one of the two immediate children rectangular regions from the parent square region `s`,
 * based on the `quart`. The `quart` must be 0 or 2.
 * This function creates a new rectangular region without modifying input square region.
 *
 * @param s - The parent square region.
 * @param quart - The quart (0 or 2) used to select the child rectangular region.
 */
function hilbertDrillDownHalf(s: Square, quart: number): Rect {
  const ox = cosTable[s.angle];
  const oy = sinTable[s.angle];
  const dx = quart / 2 ? 1 : -1;

  const xc = s.xc + (s.size / 4) * (dx * s.flip * ox);
  const yc = s.yc + (s.size / 4) * (dx * s.flip * oy);
  const width = s.angle % 2 === 0 ? s.size / 2 : s.size;
  const height = s.angle % 2 === 0 ? s.size : s.size / 2;
  return { x: xc - width / 2, y: yc - height / 2, width, height };
}

/**
 * Creates a descendant square region from a parent square region,
 * based on the leading quarts.
 *
 * @param s - The parent square region.
 * @param leadingQuarts - The array of quarts used to select the descendant square region.
 */
export function hilbertQuartsToSquareRegion(
  s: Square,
  leadingQuarts: number[]
): Square {
  const clonedSquare: Square = { ...s };  // cloning the square s
  for (let i = 0; i < leadingQuarts.length; i++) {
    hilbertDrillDown(clonedSquare, leadingQuarts[i]);
  }
  return clonedSquare;
}

/**
 * Creates a descendant rectangular region from a parent square region,
 * based on the leading quarts and last quart.
 *
 * @param s - The parent square region.
 * @param leadingQuarts - The array of quarts used to select the descendant square or rectangular region.
 * @param lastQuart - The optional last quart (undefined, 0, or 2) used to further refine the selected rectangular region.
 */
export function hilbertQuartsToRectRegion(
  s: Square,
  leadingQuarts: number[],
  lastQuart?: number
): Rect {
  const descendantSquare = hilbertQuartsToSquareRegion(s, leadingQuarts);
  if (lastQuart === undefined) {
    return convertSquareToRect(descendantSquare);
  } else {
    return hilbertDrillDownHalf(descendantSquare, lastQuart);
  }
}

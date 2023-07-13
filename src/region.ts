/**
 * Interface for representing a square region in a 2D plane.
 *
 * @property {number} xc - The x-coordinate of the center of the square.
 * @property {number} yc - The y-coordinate of the center of the square.
 * @property {number} size - The full width and height of the square.
 * @property {number} angle - The orientation angle of the square. It has values 0, 1, 2, or 3,
 *                            which correspond to angles 0, PI/2, PI, and PI*3/2 respectively in a unit circle.
 *                            We assume the math coordinate system, with x axis going right, y axis going up.
 * @property {number} flip - The flip parameter. A value of 1 means no flipping, and -1 means the square is flipped.
 */
export interface Square {
  xc: number;
  yc: number;
  size: number;
  angle: number;
  flip: number;
}

/**
 * Interface for representing a rectangular region in a 2D plane.
 *
 * @property {number} x - The x-coordinate of the rectangle's minimum boundary.
 * @property {number} y - The y-coordinate of the rectangle's minimum boundary.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Converts a square region to a rectangular region.
 * @param {Square} s - The square region to be converted.
 * @return {Rect} The resulting rectangular region.
 */
export function convertSquareToRect(s: Square): Rect {
  return {
    x: s.xc - s.size / 2,
    y: s.yc - s.size / 2,
    width: s.size,
    height: s.size,
  };
}

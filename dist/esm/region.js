/**
 * Converts a square region to a rectangular region.
 * @param {Square} s - The square region to be converted.
 * @return {Rect} The resulting rectangular region.
 */
export function convertSquareToRect(s) {
    return {
        x: s.xc - s.size / 2,
        y: s.yc - s.size / 2,
        width: s.size,
        height: s.size,
    };
}
/**
 * Checks if a point with coordinates (x, y) is within a square region.
 * The check is inclusive of the xmin and ymin boundaries and exclusive of the xmax and ymax boundaries.
 *
 * @param x - The x-coordinate of the point.
 * @param y - The y-coordinate of the point.
 * @param s - The square region to be checked against. It is represented by an object with attributes 'xc' (center x-coordinate), 'yc' (center y-coordinate), and 'size' (length of a side).
 *
 * @returns A boolean value indicating whether the point is within the square region.
 */
export function isXYPosInSquare(x, y, s) {
    return (x >= s.xc - s.size / 2) && (x < s.xc + s.size / 2) && (y >= s.yc - s.size / 2) && (y < s.yc + s.size / 2);
}
/**
 * Checks if a point with coordinates (x, y) is within a rectangular region.
 * The check is inclusive of the xmin and ymin boundaries and exclusive of the xmax and ymax boundaries.
 *
 * @param x - The x-coordinate of the point.
 * @param y - The y-coordinate of the point.
 * @param r - The rectangular region to be checked against. It is represented by an object with attributes 'x' (left x-coordinate), 'y' (bottom y-coordinate), 'width', and 'height'.
 *
 * @returns A boolean value indicating whether the point is within the rectangular region.
 */
export function isXYPosInRect(x, y, r) {
    return (x >= r.x) && (x < r.x + r.width) && (y >= r.y) && (y < r.y + r.height);
}

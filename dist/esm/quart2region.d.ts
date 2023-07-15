import { Rect, Square } from "./region";
/**
 * Creates a descendant square region from a parent square region,
 * based on the leading quarts.
 *
 * @param s - The parent square region.
 * @param leadingQuarts - The array of quarts used to select the descendant square region.
 */
export declare function hilbertQuartsToSquareRegion(s: Square, leadingQuarts: number[]): Square;
/**
 * Creates a descendant rectangular region from a parent square region,
 * based on the leading quarts and last bit.
 *
 * @param s - The parent square region.
 * @param leadingQuarts - The array of quarts used to select the descendant square or rectangular region.
 * @param lastBit - The optional last bit (undefined, 0, or 1) used to further refine the selected rectangular region.
 */
export declare function hilbertQuartsToRectRegion(s: Square, leadingQuarts: number[], lastBit?: number): Rect;
/**
 * Convert a position (x, y) within a given square region to a sequence of quarts based on the Hilbert curve.
 * This function starts by checking if the position is within the given square region.
 * If it is not, the function returns undefined. If it is, the function calls
 * hilbertXYPosToQuartInSquareRegionOneStep to perform a recursive calculation, which
 * determines the quart indices that represent the position in the Hilbert curve.
 *
 * @param s - The square region within which the position is to be converted.
 * @param x - The x-coordinate of the position.
 * @param y - The y-coordinate of the position.
 * @param depth - The depth of recursion, which determines the level of detail in the Hilbert curve.
 *
 * @returns An array of quart indices if the position is within the square, undefined otherwise.
 */
export declare function hilbertXYPosToQuartsInSquareRegion(s: Square, x: number, y: number, depth: number): number[] | undefined;

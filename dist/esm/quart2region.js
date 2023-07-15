import { convertSquareToRect, isXYPosInSquare } from "./region";
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
function hilbertQuartToSquareRegionOneStep(s, quart) {
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
 * based on the `bit`. The `bit` must be 0 or 1.
 * This function creates a new rectangular region without modifying input square region.
 *
 * @param s - The parent square region.
 * @param bit - The bit (0 or 2) used to select the child rectangular region.
 */
function hilbertBitToHalfRectRegionOneStep(s, bit) {
    const ox = cosTable[s.angle];
    const oy = sinTable[s.angle];
    const dx = bit ? 1 : -1;
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
export function hilbertQuartsToSquareRegion(s, leadingQuarts) {
    const clonedSquare = { ...s }; // cloning the square s
    for (let i = 0; i < leadingQuarts.length; i++) {
        hilbertQuartToSquareRegionOneStep(clonedSquare, leadingQuarts[i]);
    }
    return clonedSquare;
}
/**
 * Creates a descendant rectangular region from a parent square region,
 * based on the leading quarts and last bit.
 *
 * @param s - The parent square region.
 * @param leadingQuarts - The array of quarts used to select the descendant square or rectangular region.
 * @param lastBit - The optional last bit (undefined, 0, or 1) used to further refine the selected rectangular region.
 */
export function hilbertQuartsToRectRegion(s, leadingQuarts, lastBit) {
    const descendantSquare = hilbertQuartsToSquareRegion(s, leadingQuarts);
    if (lastBit === undefined) {
        return convertSquareToRect(descendantSquare);
    }
    else {
        return hilbertBitToHalfRectRegionOneStep(descendantSquare, lastBit);
    }
}
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
export function hilbertXYPosToQuartsInSquareRegion(s, x, y, depth) {
    const quarts = [];
    const within = hilbertXYPosToQuartInSquareRegionOneStep(s, x, y, depth, quarts);
    return within ? quarts : undefined;
}
/**
 * A recursive helper function for hilbertXYPosToQuartsInSquareRegion.
 *
 * This function takes a square region and a point (x, y), and attempts to find
 * the point within a child square of the current square. The function uses a depth-first
 * search, traversing through the Hilbert curve path. If the point is found within a child
 * square, the function returns true and the path to the point is stored in 'quarts'.
 * If the point is not found, the function returns false.
 *
 * @param s - The current square region being examined.
 * @param x - The x-coordinate of the point being searched for.
 * @param y - The y-coordinate of the point being searched for.
 * @param depth - The current depth of the recursive search.
 * @param quarts - The array storing the path of quarts to the point.
 * @returns - Boolean indicating whether the point was found within the current square 's'.
 */
function hilbertXYPosToQuartInSquareRegionOneStep(s, x, y, depth, quarts) {
    // Check if the point is within the current square region
    if (!isXYPosInSquare(x, y, s)) {
        return false;
    }
    else if (depth === 0) {
        return true;
    }
    else {
        // Check the four child squares
        const clonedSquare = { ...s }; // Clone the current square 
        // Loop through each child square represented by quarts [0, 1, 2, 3]
        for (let i = 0; i < 4; i++) {
            // Add current quart to the path
            quarts.push(i);
            // Update the cloned square to the i-th child square
            clonedSquare.xc = s.xc;
            clonedSquare.yc = s.yc;
            clonedSquare.size = s.size;
            clonedSquare.angle = s.angle;
            clonedSquare.flip = s.flip;
            hilbertQuartToSquareRegionOneStep(clonedSquare, i);
            // Recursive step: try to find the point in the updated child square
            const within = hilbertXYPosToQuartInSquareRegionOneStep(clonedSquare, x, y, depth - 1, quarts);
            // If the point is within this child square, return true and end the loop
            if (within) {
                return true;
            }
            // If the point is not in this child square, remove the current quart from the path
            quarts.pop();
        }
        // If the point was not found in any of the child squares, return false
        return false;
    }
}

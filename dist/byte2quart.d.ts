import { Prefix } from "./prefix";
/**
 * Extract a quart (2-bit number) from the specified position within a byte array.
 *
 * @param bytes - The byte array to extract the quart from.
 * @param i - The position (zero-based) of the quart to be extracted. Each byte contains four quarts, with the leftmost quart being in position 0 and the rightmost quart in position 3.
 * @returns The extracted quart, or undefined if the provided position is outside the bounds of the byte array.
 *
 * @remarks This function is handy when dealing with binary numbers where each digit is a 2-bit number (0-3), such as when converting a binary representation of a network address into a Hilbert curve's "quart" code.
 */
export declare function extractQuartFromBytes(bytes: number[], i: number): number | undefined;
/**
 * Converts a Prefix into quarts representation while skipping a specified number of initial quarts.
 *
 * @param {Prefix} prefix - An object containing 'bytes' representing the prefix and 'maskLen' representing the mask length.
 * @param {number} numQuartsSkip - The number of initial quarts to skip.
 *
 * @returns {Object | undefined} An object containing 'leadingQuarts' and 'lastBit', where 'leadingQuarts' is an array of quarts and 'lastBit' is the last bit or undefined.
 * 'lastBit' appears when prefix.maskLen is odd thus prefix cannot be represented by integer number of quarts (which requires prefix.maskLen to be even)
 * If 'lastBit' is defined, it must be 0 (left) or 1 (right), and indicates that the prefix corresponds to a rectangle on the Hilbert curve.
 * If 'lastBit' is undefined, it indicates that the prefix corresponds to a square on the Hilbert curve.
 * If 'numQuartsSkip' is greater than half of 'maskLen', the function returns undefined.
 */
export declare function convertPrefixToQuartsAndBit(prefix: Prefix, numQuartsSkip: number): {
    leadingQuarts: number[];
    lastBit: number | undefined;
} | undefined;
/**
 * Converts an array of quarts (4-state units) into an array of bytes.
 * Each byte will represent four quarts.
 * If the number of quarts is not a multiple of 4, 0s will be padded at the end to form the last byte.
 *
 * @param {number[]} quarts - The array of quarts to be converted.
 * @returns {number[]} The converted array of bytes.
 */
export declare function convertQuartsToBytes(quarts: number[]): number[];

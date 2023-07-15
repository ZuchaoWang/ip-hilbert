/**
 * Extract a quart (2-bit number) from the specified position within a byte array.
 *
 * @param bytes - The byte array to extract the quart from.
 * @param i - The position (zero-based) of the quart to be extracted. Each byte contains four quarts, with the leftmost quart being in position 0 and the rightmost quart in position 3.
 * @returns The extracted quart, or undefined if the provided position is outside the bounds of the byte array.
 *
 * @remarks This function is handy when dealing with binary numbers where each digit is a 2-bit number (0-3), such as when converting a binary representation of a network address into a Hilbert curve's "quart" code.
 */
export function extractQuartFromBytes(bytes, i) {
    // Calculate the index of the byte containing the quart, and the position of the quart within that byte.
    let byteIndex = Math.floor(i / 4);
    let quartInByte = i % 4;
    // If the position is out of bounds, return undefined.
    if (i < 0 || i >= bytes.length * 4) {
        return undefined;
    }
    // Create a bitmask to isolate the quart. The shift amount is determined by the quart's position within the byte.
    let shiftAmount = (3 - quartInByte) * 2;
    let bitmask = 0b11; // binary: 11
    // Apply the bitmask to the relevant byte to extract the quart.
    let byte = bytes[byteIndex];
    let quart = (byte >> shiftAmount) & bitmask;
    return quart;
}
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
export function convertPrefixToQuartsAndBit(prefix, numQuartsSkip) {
    // Extracting the bytes and mask length from the prefix
    const { bytes, maskLen } = prefix;
    if (numQuartsSkip < 0 || numQuartsSkip > Math.floor(maskLen / 2) || maskLen > bytes.length * 8) {
        return undefined;
    }
    // Initializing an empty leadingQuarts array
    const leadingQuarts = [];
    // For each quart starting from the numQuartsSkip position up to half the mask length, 
    // calculate the corresponding leadingQuart from the bytes and append to the leadingQuarts array
    for (let i = numQuartsSkip; i < Math.floor(maskLen / 2); i++) {
        leadingQuarts.push(extractQuartFromBytes(bytes, i));
    }
    // If the mask length is odd and numQuartsSkip is less than half the mask length, 
    // there will be one remaining quart. Calculate this quart and store it in lastBit.
    // If the mask length is even, or numQuartsSkip is equal to half the mask length, 
    // lastBit will remain undefined
    let lastBit;
    if (maskLen % 2 === 1) {
        lastBit = Math.floor(extractQuartFromBytes(bytes, Math.floor(maskLen / 2)) / 2);
    }
    // Return the leadingQuarts and lastBit
    // If lastBit is defined, it indicates that the prefix corresponds to a rectangle on the Hilbert curve
    // If lastBit is undefined, it indicates that the prefix corresponds to a square on the Hilbert curve
    return { leadingQuarts, lastBit };
}
/**
 * Converts an array of quarts (4-state units) into an array of bytes.
 * Each byte will represent four quarts.
 * If the number of quarts is not a multiple of 4, 0s will be padded at the end to form the last byte.
 *
 * @param {number[]} quarts - The array of quarts to be converted.
 * @returns {number[]} The converted array of bytes.
 */
export function convertQuartsToBytes(quarts) {
    const bytes = [];
    for (let i = 0; i < quarts.length; i += 4) {
        // Creating a byte from four quarts, padding with 0 if necessary
        const byte = (quarts[i] << 6) | ((quarts[i + 1] || 0) << 4) | ((quarts[i + 2] || 0) << 2) | (quarts[i + 3] || 0);
        bytes.push(byte);
    }
    return bytes;
}

/**
 * Extract a quart (2-bit number) from the specified position within a byte array.
 *
 * @param bytes - The byte array to extract the quart from.
 * @param i - The position (zero-based) of the quart to be extracted. Each byte contains four quarts, with the leftmost quart being in position 0 and the rightmost quart in position 3.
 * @returns The extracted quart, or undefined if the provided position is outside the bounds of the byte array.
 *
 * @remarks This function is handy when dealing with binary numbers where each digit is a 2-bit number (0-3), such as when converting a binary representation of a network address into a Hilbert curve's "quart" code.
 */
export function extractQuartFromBytes(bytes: number[], i: number): number | undefined {
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
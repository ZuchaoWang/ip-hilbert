/**
 * Prefix interface representing an IP prefix.
 * @property bytes - The byte array representation of the IP part of the prefix. It can be obtained by ipaddr.js's IP.toByteArray.
 * @property maskLen - The length of the mask for the prefix, ranging from 0 to the length of the bytes array multiplied by 8.
 */
export interface Prefix {
  bytes: number[];
  maskLen: number;
}

/**
 * Checks if a given prefix is contained within another prefix.
 * @param parent - The parent prefix to be checked.
 * @param child - The child prefix to be checked.
 * @return A boolean value indicating whether the child prefix is contained within the parent prefix.
 */
export function isPrefixContain(parent: Prefix, child: Prefix): boolean {
  // If the prefix length of the parent is longer than that of the child,
  // the child cannot be contained within the parent. Hence return false.
  if (parent.maskLen > child.maskLen) {
    return false;
  }

  // Calculate how many full 8-bit parts are included in the parent prefix,
  // and what the remainder is when the parent prefix length is divided by 8.
  const quot = Math.floor(parent.maskLen / 8);
  const rema = parent.maskLen % 8;

  // For each full 8-bit part that is included in the parent prefix,
  // check if the corresponding part in the child address is the same.
  // If not, the child is not contained within the parent, so return false.
  for (let i = 0; i < quot; i++) {
    if (parent.bytes[i] !== child.bytes[i]) {
      return false;
    }
  }

  // If there are any remaining bits in the parent prefix that don't make up a full 8-bit part,
  // create a mask that includes these bits and check if the relevant bits in the parent and child addresses are the same.
  // If not, the child is not contained within the parent, so return false.
  if (rema !== 0) {
    const mask = 0x100 - (1 << (8 - rema));
    if ((parent.bytes[quot] & mask) !== (child.bytes[quot] & mask)) {
      return false;
    }
  }

  // If all the checks pass, the child is contained within the parent, so return true.
  return true;
}

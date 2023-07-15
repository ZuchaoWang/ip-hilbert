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
export declare function isPrefixContain(parent: Prefix, child: Prefix): boolean;

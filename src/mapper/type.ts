import { Prefix } from "../prefix";
import { Rect } from "../region";

/**
 * Interface for the HilbertMapper that provides methods for mapping.
 * between IP prefixes and rectangular grid regions in Hilbert curve mapping.
 */
export interface HilbertMapper {
  /**
   * Returns the width of the grid.
   *
   * @returns {number} The width of the grid.
   */
  getWidth: () => number;
  
  /**
   * Returns the height of the grid.
   *
   * @returns {number} The height of the grid.
   */
  getHeight: () => number;

  /**
   * Converts a position, represented by x and y index in the grid,
   * into a IP prefix according to the Hilbert curve. 
   * Returns undefined if the provided grid index are out of the grid range.
   *
   * @param {number} x - The x-index of the position on the grid.
   * @param {number} y - The y-index of the position on the grid.
   * @returns {Prefix | undefined} The corresponding Hilbert curve prefix, or undefined if out of range.
   */
  gridPosToPrefix: (x: number, y: number) => Prefix | undefined;

  /**
   * Converts a prefix into a rectangular region in the grid according to the Hilbert curve.
   * Returns undefined if the provided prefix is out of range.
   * If the prefix is smaller than a grid, the region will be the grid containing the prefix.
   *
   * @param {Prefix} prefix - The IP prefix.
   * @returns {Rect | undefined} The corresponding grid region, or undefined if the prefix is out of range.
   */
  prefixToRectRegion: (prefix: Prefix) => Rect | undefined;
}

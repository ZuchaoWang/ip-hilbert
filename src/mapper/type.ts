import { Prefix } from "../prefix";
import { Rect } from "../region";

/**
 * Interface for the HilbertMapper that provides methods for mapping
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
   * Converts a position, represented by integer x and y coordinates in the grid,
   * into a prefix according to the Hilbert curve. 
   * Returns undefined if the provided coordinates are out of the grid range.
   *
   * @param {number} x - The x-coordinate of the position.
   * @param {number} y - The y-coordinate of the position.
   * @returns {Prefix | undefined} The corresponding Hilbert curve prefix, or undefined if out of range.
   */
  xyPosToPrefix: (x: number, y: number) => Prefix | undefined;

  /**
   * Converts a prefix into a rectangular region in the grid according to the Hilbert curve
   * Returns undefined if the provided prefix is out of range.
   *
   * @param {Prefix} prefix - The Hilbert curve prefix.
   * @returns {Rect | undefined} The corresponding grid region, or undefined if the prefix is out of range.
   */
  prefixToRectRegion: (prefix: Prefix) => Rect | undefined;
}

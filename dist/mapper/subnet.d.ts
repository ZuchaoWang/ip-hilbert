import { Prefix } from "../prefix";
import { Rect } from "../region";
import { HilbertMapper } from "./type";
/**
 * SubnetHilbertMapper class is responsible for mapping a prefix, called a subnet,
 * to a Hilbert curve grid map. It enables focus on a specific subnet by drawing it
 * on the map and ignoring prefixes outside the subnet.
 *
 * The class provides methods to convert a prefix to a rectangular region within the subnet
 * and a grid position back to a prefix. It also outputs the width and height of the grid map.
 *
 * The class maintains two coordinate systems:
 *
 * - Grid coordinate system: This system represents the position on the Hilbert curve grid map.
 *   The entire grid map precisely overlays the subnet. Each grid's prefix mask length is
 *   determined by `_gridMaskLen`, setting the resolution of the mapper. Larger `_gridMaskLen`
 *   values result in a more detailed mapping.
 *
 * - Internal coordinate system: This system represents the internal spatial configuration of the mapper.
 *   It exactly overlays the `_refPrefix`, which is the smallest prefix with an even mask length
 *   containing the subnet. An even mask length is required to ensure the subnet fits within a
 *   square region, simplifying computation. Additionally, the internal coordinate system has twice
 *   the resolution of the grid system. This difference in scale preserves integer precision of the
 *   center of each grid, crucial for computations involving square regions, as they track their
 *   positions using their centers (`xc`/`yc`).
 *
 * The class transparently converts between these two coordinate systems as needed, exposing only
 * the grid coordinate system through its interface.
 */
export declare class SubnetHilbertMapper implements HilbertMapper {
    private _subnetPrefix;
    private _gridMaskLen;
    private _refPrefix;
    private _refSquareInternal;
    private _subnetRectInternal;
    /**
     * Construct a SubnetHilbertMapper.
     * @param subnetPrefix - Prefix of the subnet
     * @param gridMaskLen - Mask length of each grid, must be even, at least as large as subnetPrefix.maskLen, but no larger than subnetPrefix.maskLen + 32
     */
    constructor(subnetPrefix: Prefix, gridMaskLen: number);
    /**
     * This function validates the inputs and throws an error if they are not acceptable.
     */
    private _validateInputs;
    /**
   * Convert a x-coordinate from grid to internal system
   * @param x - The x-coordinate in grid system
   * @returns The corresponding x-coordinate in internal system
   */
    private _gridToInternalX;
    /**
     * Convert a y-coordinate from grid to internal system
     * @param y - The y-coordinate in grid system
     * @returns The corresponding y-coordinate in internal system
     */
    private _gridToInternalY;
    /**
     * Convert a x-coordinate from internal to grid system
     * @param xInternal - The x-coordinate in internal system
     * @returns The corresponding x-coordinate in grid system
     */
    private _internalToGridX;
    /**
     * Convert a y-coordinate from internal to grid system
     * @param yInternal - The y-coordinate in internal system
     * @returns The corresponding y-coordinate in grid system
     */
    private _internalToGridY;
    /**
     * Convert size from internal to grid system
     * @param sizeInternal - The size in internal system
     * @returns The corresponding size in grid system
     */
    private _internalToGridSize;
    /**
     * Get the width of the subnet in grid system
     * @returns The width of the subnet
     */
    getWidth(): number;
    /**
     * Get the height of the subnet in grid system
     * @returns The height of the subnet
     */
    getHeight(): number;
    /**
     * Convert a x, y grid-index to prefix in the subnet
     * @param x - The x-index on the grid
     * @param y - The y-index on the grid
     * @returns The corresponding prefix if the x, y index is in the subnet's grid, undefined otherwise
     */
    gridPosToPrefix(x: number, y: number): Prefix | undefined;
    /**
     * Convert a prefix to a rectangle region in the subnet
     * @param prefix - The prefix to convert
     * @returns The corresponding rectangle region if the prefix is in the subnet, undefined otherwise
     *          If the prefix is smaller than a grid, the region will be the grid containing the prefix
     */
    prefixToRectRegion(prefix: Prefix): Rect | undefined;
}

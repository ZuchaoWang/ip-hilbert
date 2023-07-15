import { convertPrefixToQuarts, convertQuartsToBytes } from "../byte2quart";
import { Prefix, isPrefixContain } from "../prefix";
import { hilbertQuartsToRectRegion, hilbertQuartsToSquareRegion, hilbertXYPosToQuartsInSquareRegion } from "../quart2region";
import { Rect, Square, isXYPosInRect } from "../region";
import { HilbertMapper } from "./type";

/**
 * Calculate the region square based on reference prefix and grid mask length
 * @param refPrefix - Reference prefix
 * @param gridMaskLen - Grid mask length
 * @returns The calculated reference square region
 */
function calculateRefSquareRegion(refPrefix: Prefix, gridMaskLen: number): Square {
  const refQuarts = convertPrefixToQuarts(refPrefix, 0)!.leadingQuarts;
  const refSquareRegionInGlobal = hilbertQuartsToSquareRegion({ xc: 1, yc: 1, size: 2, angle: 0, flip: 1 }, refQuarts); // only angle and flip are relevant
  const gridOrderInRef = gridMaskLen / 2 - refPrefix.maskLen / 2;
  const refRootRegionSize = 1 << (gridOrderInRef + 1); // use twice size to preserve integer precision, hence + 1
  return { xc: refRootRegionSize / 2, yc: refRootRegionSize / 2, size: refRootRegionSize, angle: refSquareRegionInGlobal.angle, flip: refSquareRegionInGlobal.flip };
}

/**
 * Calculate rectangle region within reference square region
 * @param refSquareRegion - Reference square region
 * @param numQuartsSkip - Number of quarters to skip
 * @param prefix - Prefix to use in calculation
 * @returns The calculated rectangle region
 */
function calculateRectRegionWithinRefSquareRegion(refSquareRegion: Square, numQuartsSkip: number, prefix: Prefix): Rect {
  const { leadingQuarts, lastQuart } = convertPrefixToQuarts(prefix, numQuartsSkip)!;
  const rectRegion = hilbertQuartsToRectRegion(refSquareRegion, leadingQuarts, lastQuart);
  return rectRegion;
}

/**
 * SubnetHilbertMapper class is responsible for mapping a prefix, called a subnet, to a Hilbert curve grid map.
 * It enables focus on a specific subnet by drawing it on the map and ignoring prefixes outside the subnet.
 * 
 * The class provides methods to convert a prefix to a rectangular region within the subnet and a grid position 
 * back to a prefix. It also outputs the width and height of the grid map.
 * 
 * The class maintains two coordinate systems:
 * 
 * - Grid coordinate system: This system represents the position on the Hilbert curve grid map. The entire grid map 
 *   precisely overlays the subnet. Each grid's prefix mask length is determined by `_gridMaskLen`, setting the 
 *   resolution of the mapper. Larger `_gridMaskLen` values result in a more detailed mapping.
 * 
 * - Region coordinate system: This system represents the internal spatial configuration of the mapper.
 *   It exactly overlays the `_refPrefix`, which is the smallest prefix with an even mask length containing the subnet.
 *   An even mask length is required to ensure the subnet fits within a square region, simplifying computation.
 *   Additionally, the region coordinate system has twice the resolution of the grid system. This difference in scale 
 *   preserves integer precision of the center of each grid, crucial for computations involving square regions,
 *   as they track their positions using their centers (`xc`/`yc`).
 * 
 * The class transparently converts between these two coordinate systems as needed, exposing only the grid coordinate 
 * system through its interface.
 */
export class SubnetHilbertMapper implements HilbertMapper {
  private _subnetPrefix: Prefix;
  private _gridMaskLen: number;
  // derived from above
  private _refPrefix: Prefix;
  private _refSquareRegion: Square;
  private _subnetRectRegion: Rect;

  /**
   * Construct a SubnetHilbertMapper.
   * @param subnetPrefix - Prefix of the subnet
   * @param gridMaskLen - Mask length of each grid
   */
  constructor(subnetPrefix: Prefix, gridMaskLen: number) {
    this._subnetPrefix = subnetPrefix;
    this._gridMaskLen = gridMaskLen;
    this._validateInputs();
    // calculateDerivedValues
    this._refPrefix = this._subnetPrefix.maskLen % 2 === 0 ? this._subnetPrefix : { bytes: this._subnetPrefix.bytes, maskLen: this._subnetPrefix.maskLen - 1 };
    this._refSquareRegion = calculateRefSquareRegion(this._refPrefix, this._gridMaskLen);
    this._subnetRectRegion = calculateRectRegionWithinRefSquareRegion(this._refSquareRegion, this._refPrefix.maskLen / 2, this._subnetPrefix);
  }

  /**
   * This function validates the inputs and throws an error if they are not acceptable.
   */
  private _validateInputs() {
    if (this._gridMaskLen % 2 === 0) {
      throw new Error("SubnetHilbertMapper: gridMaskLen must be even, so that each grid is a square region");
    }
    if (this._gridMaskLen - this._subnetPrefix.maskLen > 15) {
      throw new Error("SubnetHilbertMapper: at most show 2^15 x 2^15 grids");
    }
    if (this._gridMaskLen < this._subnetPrefix.maskLen) {
      throw new Error("SubnetHilbertMapper: gridMaskLen too small, now the prefix for each grid is even larger than the subnet");
    }
  }

  /**
   * Convert a x-coordinate from grid to region
   * @param x - The x-coordinate in grid system
   * @returns The corresponding x-coordinate in region system
   */
  private _gridToRegionX(x: number): number {
    return x * 2 + this._subnetRectRegion.x;
  }

  /**
   * Convert a y-coordinate from grid to region
   * @param y - The y-coordinate in grid system
   * @returns The corresponding y-coordinate in region system
   */
  private _gridToRegionY(y: number): number {
    return y * 2 + this._subnetRectRegion.y;
  }

  /**
   * Convert a x-coordinate from region to grid
   * @param x - The x-coordinate in region system
   * @returns The corresponding x-coordinate in grid system
   */
  private _regionToGridX(x: number): number {
    return (x - this._subnetRectRegion.x) / 2;
  }

  /**
   * Convert a y-coordinate from region to grid
   * @param y - The y-coordinate in region system
   * @returns The corresponding y-coordinate in grid system
   */
  private _regionToGridY(y: number): number {
    return (y - this._subnetRectRegion.y) / 2;
  }

  /**
   * Convert size from region to grid
   * @param size - The size in region system
   * @returns The corresponding size in grid system
   */
  private _regionToGridSize(size: number): number {
    return size / 2;
  }

  /**
   * Get the width of the subnet in grid system
   * @returns The width of the subnet
   */
  getWidth(): number {
    return this._regionToGridSize(this._subnetRectRegion.width);
  }

  /**
   * Get the height of the subnet in grid system
   * @returns The height of the subnet
   */
  getHeight(): number {
    return this._regionToGridSize(this._subnetRectRegion.height);
  }

  /**
   * Convert a x, y position to prefix in the subnet
   * @param x - The x-coordinate
   * @param y - The y-coordinate
   * @returns The corresponding prefix if the x, y position is in the subnet, undefined otherwise
   */
  xyPosToPrefix(x: number, y: number): Prefix | undefined {
    const x2 = this._gridToRegionX(x);
    const y2 = this._gridToRegionY(y);
    if (isXYPosInRect(x2, y2, this._subnetRectRegion)) {
      const refQuarts = convertPrefixToQuarts(this._refPrefix, 0)!.leadingQuarts;
      const posQuarts = hilbertXYPosToQuartsInSquareRegion(this._refSquareRegion, x2, y2, this._gridMaskLen / 2 - this._refPrefix.maskLen / 2)!;
      const tailQuarts = new Array(this._refPrefix.bytes.length * 4 - refQuarts.length - posQuarts.length).fill(0);
      const allQuarts = [...refQuarts, ...posQuarts, ...tailQuarts];
      const bytes = convertQuartsToBytes(allQuarts);
      return { bytes, maskLen: this._refPrefix.maskLen };
    } else {
      return undefined;
    }
  }

  /**
   * Convert a prefix to a rectangle region in the subnet
   * @param prefix - The prefix to convert
   * @returns The corresponding rectangle region if the prefix is in the subnet, undefined otherwise
   */
  prefixToRectRegion(prefix: Prefix): Rect | undefined {
    if (isPrefixContain(this._subnetPrefix, prefix)) {
      const rectRegion = calculateRectRegionWithinRefSquareRegion(this._refSquareRegion, this._refPrefix.maskLen / 2, prefix);
      return {
        x: this._regionToGridX(rectRegion.x),
        y: this._regionToGridY(rectRegion.y),
        width: this._regionToGridSize(rectRegion.width),
        height: this._regionToGridSize(rectRegion.height)
      };
    } else {
      return undefined;
    }
  }
}

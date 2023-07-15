import { convertPrefixToQuartsAndBit, convertQuartsToBytes } from "../byte2quart";
import { isPrefixContain } from "../prefix";
import { hilbertQuartsToRectRegion, hilbertQuartsToSquareRegion, hilbertXYPosToQuartsInSquareRegion } from "../quart2region";
import { isXYPosInRect } from "../region";
/**
 * Calculate the square within the internal system based on reference prefix and grid mask length
 * @param refPrefix - Reference prefix
 * @param gridMaskLen - Grid mask length
 * @returns The calculated reference square within internal system
 */
function calculateRefSquareInternal(refPrefix, gridMaskLen) {
    const refQuarts = convertPrefixToQuartsAndBit(refPrefix, 0).leadingQuarts;
    // only angle and flip are relevant, this is neither grid or internal coordinate system
    const refSquareUnitInGlobal = hilbertQuartsToSquareRegion({ xc: 1, yc: 1, size: 2, angle: 0, flip: 1 }, refQuarts);
    const gridOrderInRef = gridMaskLen / 2 - refPrefix.maskLen / 2;
    const refSquareInternalSize = Math.pow(2, gridOrderInRef + 1); // use twice size to preserve integer precision, hence + 1
    return { xc: refSquareInternalSize / 2, yc: refSquareInternalSize / 2, size: refSquareInternalSize, angle: refSquareUnitInGlobal.angle, flip: refSquareUnitInGlobal.flip };
}
/**
 * Calculate rectangle within the reference square of the internal system
 * @param refSquareInternal - Reference square within the internal system
 * @param numQuartsSkip - Number of quarters to skip
 * @param prefix - Prefix to use in calculation
 * @returns The calculated rectangle within the internal system
 */
function calculateRectWithinRefSquareInternal(refSquareInternal, numQuartsSkip, prefix) {
    const { leadingQuarts, lastBit } = convertPrefixToQuartsAndBit(prefix, numQuartsSkip);
    const rectRegion = hilbertQuartsToRectRegion(refSquareInternal, leadingQuarts, lastBit);
    return rectRegion;
}
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
export class SubnetHilbertMapper {
    _subnetPrefix;
    _gridMaskLen;
    // derived from above
    _refPrefix;
    _refSquareInternal;
    _subnetRectInternal;
    /**
     * Construct a SubnetHilbertMapper.
     * @param subnetPrefix - Prefix of the subnet
     * @param gridMaskLen - Mask length of each grid, must be even, at least as large as subnetPrefix.maskLen, but no larger than subnetPrefix.maskLen + 32
     */
    constructor(subnetPrefix, gridMaskLen) {
        this._subnetPrefix = subnetPrefix;
        this._gridMaskLen = gridMaskLen;
        this._validateInputs();
        // calculateDerivedValues
        this._refPrefix = this._subnetPrefix.maskLen % 2 === 0 ? this._subnetPrefix : { bytes: this._subnetPrefix.bytes, maskLen: this._subnetPrefix.maskLen - 1 };
        this._refSquareInternal = calculateRefSquareInternal(this._refPrefix, this._gridMaskLen);
        this._subnetRectInternal = calculateRectWithinRefSquareInternal(this._refSquareInternal, this._refPrefix.maskLen / 2, this._subnetPrefix);
    }
    /**
     * This function validates the inputs and throws an error if they are not acceptable.
     */
    _validateInputs() {
        if (this._gridMaskLen % 2) {
            throw new Error("SubnetHilbertMapper: gridMaskLen must be even, so that each grid is a square region");
        }
        if (this._gridMaskLen - this._subnetPrefix.maskLen > 32) {
            // maybe we can support larger gridMaskLen, but it's not necessary now
            throw new Error("SubnetHilbertMapper: at most show 2^32 x 2^32 grids");
        }
        if (this._gridMaskLen < this._subnetPrefix.maskLen) {
            throw new Error("SubnetHilbertMapper: gridMaskLen too small, now the prefix for each grid is even larger than the subnet");
        }
    }
    /**
   * Convert a x-coordinate from grid to internal system
   * @param x - The x-coordinate in grid system
   * @returns The corresponding x-coordinate in internal system
   */
    _gridToInternalX(x) {
        return x * 2 + this._subnetRectInternal.x;
    }
    /**
     * Convert a y-coordinate from grid to internal system
     * @param y - The y-coordinate in grid system
     * @returns The corresponding y-coordinate in internal system
     */
    _gridToInternalY(y) {
        return y * 2 + this._subnetRectInternal.y;
    }
    /**
     * Convert a x-coordinate from internal to grid system
     * @param xInternal - The x-coordinate in internal system
     * @returns The corresponding x-coordinate in grid system
     */
    _internalToGridX(xInternal) {
        return (xInternal - this._subnetRectInternal.x) / 2;
    }
    /**
     * Convert a y-coordinate from internal to grid system
     * @param yInternal - The y-coordinate in internal system
     * @returns The corresponding y-coordinate in grid system
     */
    _internalToGridY(yInternal) {
        return (yInternal - this._subnetRectInternal.y) / 2;
    }
    /**
     * Convert size from internal to grid system
     * @param sizeInternal - The size in internal system
     * @returns The corresponding size in grid system
     */
    _internalToGridSize(sizeInternal) {
        return sizeInternal / 2;
    }
    /**
     * Get the width of the subnet in grid system
     * @returns The width of the subnet
     */
    getWidth() {
        return this._internalToGridSize(this._subnetRectInternal.width);
    }
    /**
     * Get the height of the subnet in grid system
     * @returns The height of the subnet
     */
    getHeight() {
        return this._internalToGridSize(this._subnetRectInternal.height);
    }
    /**
     * Convert a x, y grid-index to prefix in the subnet
     * @param x - The x-index on the grid
     * @param y - The y-index on the grid
     * @returns The corresponding prefix if the x, y index is in the subnet's grid, undefined otherwise
     */
    gridPosToPrefix(x, y) {
        const xInternal = this._gridToInternalX(x);
        const yInternal = this._gridToInternalY(y);
        if (isXYPosInRect(xInternal, yInternal, this._subnetRectInternal)) {
            const refQuarts = convertPrefixToQuartsAndBit(this._refPrefix, 0).leadingQuarts;
            const posQuarts = hilbertXYPosToQuartsInSquareRegion(this._refSquareInternal, xInternal, yInternal, this._gridMaskLen / 2 - this._refPrefix.maskLen / 2);
            const tailQuarts = new Array(this._refPrefix.bytes.length * 4 - refQuarts.length - posQuarts.length).fill(0);
            const allQuarts = [...refQuarts, ...posQuarts, ...tailQuarts];
            const bytes = convertQuartsToBytes(allQuarts);
            return { bytes, maskLen: this._gridMaskLen };
        }
        else {
            return undefined;
        }
    }
    /**
     * Convert a prefix to a rectangle region in the subnet
     * @param prefix - The prefix to convert
     * @returns The corresponding rectangle region if the prefix is in the subnet, undefined otherwise
     *          If the prefix is smaller than a grid, the region will be the grid containing the prefix
     */
    prefixToRectRegion(prefix) {
        if (isPrefixContain(this._subnetPrefix, prefix)) {
            const largeEnoughPrefix = prefix.maskLen <= this._gridMaskLen ? prefix : { bytes: prefix.bytes, maskLen: this._gridMaskLen };
            const rectRegion = calculateRectWithinRefSquareInternal(this._refSquareInternal, this._refPrefix.maskLen / 2, largeEnoughPrefix);
            return {
                x: this._internalToGridX(rectRegion.x),
                y: this._internalToGridY(rectRegion.y),
                width: this._internalToGridSize(rectRegion.width),
                height: this._internalToGridSize(rectRegion.height)
            };
        }
        else {
            return undefined;
        }
    }
}

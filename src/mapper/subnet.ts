import { convertPrefixToQuarts } from "../byte2quart";
import { Prefix } from "../prefix";
import { hilbertQuartsToRectRegion, hilbertQuartsToSquareRegion } from "../quart2region";
import { Rect, Square } from "../region";
import { HilbertMapper } from "./type";

function calculateRefSquareRegion(refPrefix: Prefix, gridMaskLen: number): Square {
  const refQuarts = convertPrefixToQuarts(refPrefix, 0)!.leadingQuarts;
  const refSquareRegionInGlobal = hilbertQuartsToSquareRegion({ xc: 1, yc: 1, size: 2, angle: 0, flip: 1 }, refQuarts);
  const gridOrderInRef = gridMaskLen / 2 - refPrefix.maskLen / 2;
  const refRootRegionSize = 1 << (gridOrderInRef + 1); // use twice size to preserve integer precision, hence + 1
  return { xc: refRootRegionSize / 2, yc: refRootRegionSize, size: refRootRegionSize, angle: refSquareRegionInGlobal.angle, flip: refSquareRegionInGlobal.flip };
}

function calculateRectRegionWithinRefSquareRegion(refSquareRegion: Square, numQuartsSkip: number, prefix: Prefix): Rect {
  const { leadingQuarts, lastQuart } = convertPrefixToQuarts(prefix, numQuartsSkip)!;
  const rectRegion = hilbertQuartsToRectRegion(refSquareRegion, leadingQuarts, lastQuart);
  return rectRegion;
}

export class SubnetHilbertMapper implements HilbertMapper {
  private _subnetPrefix: Prefix;
  private _gridMaskLen: number;
  // derived from above
  private _refPrefix: Prefix;
  private _refSquareRegion: Square;
  private _subnetRectRegion: Rect;

  constructor(subnetPrefix: Prefix, gridMaskLen: number) {
    this._subnetPrefix = subnetPrefix;
    this._gridMaskLen = gridMaskLen;
    if (this._gridMaskLen % 2 === 0) {
      throw new Error("SubnetHilbertMapper: gridMaskLen must be even");
    }
    if (this._gridMaskLen - this._subnetPrefix.maskLen > 20) {
      throw new Error("SubnetHilbertMapper: at most show 2^20 x 2^20 grids");
    }
    if (this._gridMaskLen < this._subnetPrefix.maskLen) {
      throw new Error("SubnetHilbertMapper: gridMaskLen too small");
    }

    this._refPrefix = this._subnetPrefix.maskLen % 2 === 0 ? this._subnetPrefix : { bytes: this._subnetPrefix.bytes, maskLen: this._subnetPrefix.maskLen - 1 };
    this._refSquareRegion = calculateRefSquareRegion(this._refPrefix, this._gridMaskLen);
    this._subnetRectRegion = calculateRectRegionWithinRefSquareRegion(this._refSquareRegion, this._refPrefix.maskLen / 2, this._subnetPrefix);
  }

  getWidth(): number {
    return this._subnetRectRegion.width / 2;  // used twice size to preserve integer precision, now half it
  }
    
  getHeight(): number {
    return this._subnetRectRegion.height / 2;  // used twice size to preserve integer precision, now half it
  }

  xyPosToPrefix(x: number, y: number): Prefix {
    const x2 = x * 2; // use twice size to preserve integer precision
    const y2 = y * 2; // use twice size to preserve integer precision
    
  }

  prefixToRectRegion(prefix: Prefix): Rect {
    const rectRegion = calculateRectRegionWithinRefSquareRegion(this._refSquareRegion, this._refPrefix.maskLen / 2, prefix);
    return { x: (rectRegion.x - this._subnetRectRegion.x) / 2, y: (rectRegion.y - this._subnetRectRegion.y) / 2, width: rectRegion.width / 2, height: rectRegion.height / 2 };  // used twice size to preserve integer precision, now half it
  }
}

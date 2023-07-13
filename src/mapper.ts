import { convertPrefixToQuarts } from "./byte2quart";
import { Prefix } from "./prefix";
import { hilbertQuartsToSquareRegion } from "./quart2region";
import { Rect, Square } from "./region";

export interface HilbertMapper {
  getWidth: () => number;
  getHeight: () => number;
  xyPosToPrefix: (x: number, y: number) => Prefix;
  prefixToRectRegion: (prefix: Prefix) => Rect;
}

function calculateRefSquareRegion(refPrefix: Prefix, gridMaskLen: number): Square {
  const refQuarts = convertPrefixToQuarts(refPrefix, 0)!.leadingQuarts;
  const refSquareRegionInGlobal = hilbertQuartsToSquareRegion({ xc: 1, yc: 1, size: 2, angle: 0, flip: 1 }, refQuarts);
  const gridOrderInRef = gridMaskLen / 2 - refPrefix.maskLen / 2;
  const refRootRegionSize = 1 << (gridOrderInRef + 1); // use twice size to preserve integer precision, hence + 1
  return { xc: refRootRegionSize / 2, yc: refRootRegionSize, size: refRootRegionSize, angle: refSquareRegionInGlobal.angle, flip: refSquareRegionInGlobal.flip };
}

export class SubnetHilbertMapper implements HilbertMapper {
  private _subnetPrefix: Prefix;
  private _gridMaskLen: number;
  private _refPrefix: Prefix;
  private _refSquareRegion: Square;

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
  }
}

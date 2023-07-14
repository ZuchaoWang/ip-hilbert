import { Prefix } from "../prefix";
import { Rect } from "../region";

export interface HilbertMapper {
  getWidth: () => number;
  getHeight: () => number;
  xyPosToPrefix: (x: number, y: number) => Prefix;
  prefixToRectRegion: (prefix: Prefix) => Rect;
}

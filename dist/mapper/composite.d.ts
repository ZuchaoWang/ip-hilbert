import { Prefix } from "../prefix";
import { Rect } from "../region";
import { HilbertMapper } from "./type";
/**
 * A Composite HilbertMapper combines multiple child HilbertMappers into one larger grid.
 * The children are positioned at certain offsets in the larger grid.
 * This class is useful when you have disjoint subnets that you want to visualize together on one grid.
 * Each subnet can be mapped to a child HilbertMapper, and then the child mappers can be combined
 * into one larger Composite.
 */
export declare class CompositeHilbertMapper implements HilbertMapper {
    private _width;
    private _height;
    private _children;
    /**
     * @param width - The width of the overall grid.
     * @param height - The height of the overall grid.
     * @param children - An array of child HilbertMappers with their respective offsets in the overall grid.
     */
    constructor(width: number, height: number, children: {
        mapper: HilbertMapper;
        offset: [number, number];
    }[]);
    /** @returns The width of the overall grid. */
    getWidth(): number;
    /** @returns The height of the overall grid. */
    getHeight(): number;
    /**
     * Convert a grid position to a prefix.
     * It will go through each child mapper to see if the grid position, adjusted by the offset,
     * can be converted to a prefix. If the adjusted position falls outside of the child mapper,
     * it will return undefined, and the next child mapper will be tried.
     *
     * @param x - The x coordinate in the overall grid.
     * @param y - The y coordinate in the overall grid.
     * @returns The prefix if the position can be converted, otherwise undefined.
     */
    gridPosToPrefix(x: number, y: number): Prefix | undefined;
    /**
     * Convert a prefix to a rectangle region in the grid.
     * It will go through each child mapper to see if the prefix can be converted to a rectangle region.
     * If a child mapper can convert the prefix, the rectangle region will be adjusted by the offset
     * of the child mapper in the overall grid.
     *
     * @param prefix - The prefix to be converted.
     * @returns The rectangle region if the prefix can be converted, otherwise undefined.
     */
    prefixToRectRegion(prefix: Prefix): Rect | undefined;
}

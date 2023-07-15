"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeHilbertMapper = void 0;
/**
 * A Composite HilbertMapper combines multiple child HilbertMappers into one larger grid.
 * The children are positioned at certain offsets in the larger grid.
 * This class is useful when you have disjoint subnets that you want to visualize together on one grid.
 * Each subnet can be mapped to a child HilbertMapper, and then the child mappers can be combined
 * into one larger Composite.
 */
class CompositeHilbertMapper {
    _width;
    _height;
    _children;
    /**
     * @param width - The width of the overall grid.
     * @param height - The height of the overall grid.
     * @param children - An array of child HilbertMappers with their respective offsets in the overall grid.
     */
    constructor(width, height, children) {
        this._width = width;
        this._height = height;
        this._children = children;
    }
    /** @returns The width of the overall grid. */
    getWidth() {
        return this._width;
    }
    /** @returns The height of the overall grid. */
    getHeight() {
        return this._height;
    }
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
    gridPosToPrefix(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return undefined;
        }
        else {
            for (const { mapper, offset } of this._children) {
                const prefix = mapper.gridPosToPrefix(x - offset[0], y - offset[1]);
                if (prefix !== undefined) {
                    return prefix;
                }
            }
            return undefined;
        }
    }
    /**
     * Convert a prefix to a rectangle region in the grid.
     * It will go through each child mapper to see if the prefix can be converted to a rectangle region.
     * If a child mapper can convert the prefix, the rectangle region will be adjusted by the offset
     * of the child mapper in the overall grid.
     *
     * @param prefix - The prefix to be converted.
     * @returns The rectangle region if the prefix can be converted, otherwise undefined.
     */
    prefixToRectRegion(prefix) {
        for (const { mapper, offset } of this._children) {
            const region = mapper.prefixToRectRegion(prefix);
            if (region !== undefined) {
                return {
                    x: region.x + offset[0],
                    y: region.y + offset[1],
                    width: region.width,
                    height: region.height,
                };
            }
        }
        return undefined;
    }
}
exports.CompositeHilbertMapper = CompositeHilbertMapper;

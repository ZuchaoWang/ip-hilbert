[@zuchaowang/ip-hilbert](../README.md) / HilbertMapper

# Interface: HilbertMapper

Interface for the HilbertMapper that provides methods for mapping.
between IP prefixes and rectangular grid regions in Hilbert curve mapping.

## Implemented by

- [`CompositeHilbertMapper`](../classes/CompositeHilbertMapper.md)
- [`SubnetHilbertMapper`](../classes/SubnetHilbertMapper.md)

## Table of contents

### Properties

- [getHeight](HilbertMapper.md#getheight)
- [getWidth](HilbertMapper.md#getwidth)
- [gridPosToPrefix](HilbertMapper.md#gridpostoprefix)
- [prefixToRectRegion](HilbertMapper.md#prefixtorectregion)

## Properties

### getHeight

• **getHeight**: () => `number`

#### Type declaration

▸ (): `number`

Returns the height of the grid.

##### Returns

`number`

The height of the grid.

#### Defined in

[mapper/type.ts:21](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/type.ts#L21)

___

### getWidth

• **getWidth**: () => `number`

#### Type declaration

▸ (): `number`

Returns the width of the grid.

##### Returns

`number`

The width of the grid.

#### Defined in

[mapper/type.ts:14](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/type.ts#L14)

___

### gridPosToPrefix

• **gridPosToPrefix**: (`x`: `number`, `y`: `number`) => `undefined` \| [`Prefix`](Prefix.md)

#### Type declaration

▸ (`x`, `y`): `undefined` \| [`Prefix`](Prefix.md)

Converts a position, represented by x and y index in the grid,
into a IP prefix according to the Hilbert curve. 
Returns undefined if the provided grid index are out of the grid range.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-index of the position on the grid. |
| `y` | `number` | The y-index of the position on the grid. |

##### Returns

`undefined` \| [`Prefix`](Prefix.md)

The corresponding Hilbert curve prefix, or undefined if out of range.

#### Defined in

[mapper/type.ts:32](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/type.ts#L32)

___

### prefixToRectRegion

• **prefixToRectRegion**: (`prefix`: [`Prefix`](Prefix.md)) => `undefined` \| [`Rect`](Rect.md)

#### Type declaration

▸ (`prefix`): `undefined` \| [`Rect`](Rect.md)

Converts a prefix into a rectangular region in the grid according to the Hilbert curve.
Returns undefined if the provided prefix is out of range.
If the prefix is smaller than a grid, the region will be the grid containing the prefix.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | [`Prefix`](Prefix.md) | The IP prefix. |

##### Returns

`undefined` \| [`Rect`](Rect.md)

The corresponding grid region, or undefined if the prefix is out of range.

#### Defined in

[mapper/type.ts:42](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/type.ts#L42)

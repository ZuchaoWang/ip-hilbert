[@zuchaowang/ip-hilbert](../README.md) / SubnetHilbertMapper

# Class: SubnetHilbertMapper

SubnetHilbertMapper class is responsible for mapping a prefix, called a subnet, 
to a Hilbert curve grid map. It enables focus on a specific subnet by drawing it 
on the map and ignoring prefixes outside the subnet.

The class provides methods to convert a prefix to a rectangular region within the subnet 
and a grid position back to a prefix. It also outputs the width and height of the grid map.

The class maintains two coordinate systems:

- Grid coordinate system: This system represents the position on the Hilbert curve grid map. 
  The entire grid map precisely overlays the subnet. Each grid's prefix mask length is 
  determined by `_gridMaskLen`, setting the resolution of the mapper. Larger `_gridMaskLen` 
  values result in a more detailed mapping.

- Internal coordinate system: This system represents the internal spatial configuration of the mapper.
  It exactly overlays the `_refPrefix`, which is the smallest prefix with an even mask length 
  containing the subnet. An even mask length is required to ensure the subnet fits within a 
  square region, simplifying computation. Additionally, the internal coordinate system has twice 
  the resolution of the grid system. This difference in scale preserves integer precision of the 
  center of each grid, crucial for computations involving square regions, as they track their 
  positions using their centers (`xc`/`yc`).

The class transparently converts between these two coordinate systems as needed, exposing only 
the grid coordinate system through its interface.

## Implements

- [`HilbertMapper`](../interfaces/HilbertMapper.md)

## Table of contents

### Constructors

- [constructor](SubnetHilbertMapper.md#constructor)

### Methods

- [getHeight](SubnetHilbertMapper.md#getheight)
- [getWidth](SubnetHilbertMapper.md#getwidth)
- [gridPosToPrefix](SubnetHilbertMapper.md#gridpostoprefix)
- [prefixToRectRegion](SubnetHilbertMapper.md#prefixtorectregion)

## Constructors

### constructor

• **new SubnetHilbertMapper**(`subnetPrefix`, `gridMaskLen`)

Construct a SubnetHilbertMapper.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subnetPrefix` | [`Prefix`](../interfaces/Prefix.md) | Prefix of the subnet. |
| `gridMaskLen` | `number` | Mask length of each grid, must be even, at least as large as `subnetPrefix.maskLen`, but no larger than `subnetPrefix.maskLen + 32`. |

#### Defined in

[mapper/subnet.ts:74](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/subnet.ts#L74)

## Methods

### getHeight

▸ **getHeight**(): `number`

Get the height of the subnet in grid system.

#### Returns

`number`

The height of the subnet.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[getHeight](../interfaces/HilbertMapper.md#getheight)

#### Defined in

[mapper/subnet.ts:157](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/subnet.ts#L157)

___

### getWidth

▸ **getWidth**(): `number`

Get the width of the subnet in grid system.

#### Returns

`number`

The width of the subnet.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[getWidth](../interfaces/HilbertMapper.md#getwidth)

#### Defined in

[mapper/subnet.ts:149](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/subnet.ts#L149)

___

### gridPosToPrefix

▸ **gridPosToPrefix**(`x`, `y`): `undefined` \| [`Prefix`](../interfaces/Prefix.md)

Convert a x, y grid-index to prefix in the subnet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-index on the grid. |
| `y` | `number` | The y-index on the grid. |

#### Returns

`undefined` \| [`Prefix`](../interfaces/Prefix.md)

The corresponding prefix if the x, y index is in the subnet's grid, undefined otherwise.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[gridPosToPrefix](../interfaces/HilbertMapper.md#gridpostoprefix)

#### Defined in

[mapper/subnet.ts:167](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/subnet.ts#L167)

___

### prefixToRectRegion

▸ **prefixToRectRegion**(`prefix`): `undefined` \| [`Rect`](../interfaces/Rect.md)

Convert a prefix to a rectangle region in the subnet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | [`Prefix`](../interfaces/Prefix.md) | The prefix to convert. |

#### Returns

`undefined` \| [`Rect`](../interfaces/Rect.md)

The corresponding rectangle region if the prefix is in the subnet, undefined otherwise.
         If the prefix is smaller than a grid, the region will be the grid containing the prefix.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[prefixToRectRegion](../interfaces/HilbertMapper.md#prefixtorectregion)

#### Defined in

[mapper/subnet.ts:188](https://github.com/ZuchaoWang/ip-hilbert/blob/b9a456d/src/mapper/subnet.ts#L188)

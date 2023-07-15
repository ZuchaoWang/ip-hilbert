[@zuchaowang/ip-hilbert](../README.md) / CompositeHilbertMapper

# Class: CompositeHilbertMapper

A Composite HilbertMapper combines multiple child HilbertMappers into one larger grid.
The children are positioned at certain offsets in the larger grid.
This class is useful when you have disjoint subnets that you want to visualize together on one grid.
Each subnet can be mapped to a child HilbertMapper, and then the child mappers can be combined
into one larger Composite.

## Implements

- [`HilbertMapper`](../interfaces/HilbertMapper.md)

## Table of contents

### Constructors

- [constructor](CompositeHilbertMapper.md#constructor)

### Methods

- [getHeight](CompositeHilbertMapper.md#getheight)
- [getWidth](CompositeHilbertMapper.md#getwidth)
- [gridPosToPrefix](CompositeHilbertMapper.md#gridpostoprefix)
- [prefixToRectRegion](CompositeHilbertMapper.md#prefixtorectregion)

## Constructors

### constructor

• **new CompositeHilbertMapper**(`width`, `height`, `children`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | The width of the overall grid. |
| `height` | `number` | The height of the overall grid. |
| `children` | { `mapper`: [`HilbertMapper`](../interfaces/HilbertMapper.md) ; `offset`: [`number`, `number`]  }[] | An array of child HilbertMappers with their respective offsets in the overall grid. |

#### Defined in

[mapper/composite.ts:22](https://github.com/ZuchaoWang/ip-hilbert/blob/7a83986/src/mapper/composite.ts#L22)

## Methods

### getHeight

▸ **getHeight**(): `number`

#### Returns

`number`

The height of the overall grid.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[getHeight](../interfaces/HilbertMapper.md#getheight)

#### Defined in

[mapper/composite.ts:38](https://github.com/ZuchaoWang/ip-hilbert/blob/7a83986/src/mapper/composite.ts#L38)

___

### getWidth

▸ **getWidth**(): `number`

#### Returns

`number`

The width of the overall grid.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[getWidth](../interfaces/HilbertMapper.md#getwidth)

#### Defined in

[mapper/composite.ts:33](https://github.com/ZuchaoWang/ip-hilbert/blob/7a83986/src/mapper/composite.ts#L33)

___

### gridPosToPrefix

▸ **gridPosToPrefix**(`x`, `y`): `undefined` \| [`Prefix`](../interfaces/Prefix.md)

Convert a grid position to a prefix.
It will go through each child mapper to see if the grid position, adjusted by the offset,
can be converted to a prefix. If the adjusted position falls outside of the child mapper,
it will return undefined, and the next child mapper will be tried.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x coordinate in the overall grid. |
| `y` | `number` | The y coordinate in the overall grid. |

#### Returns

`undefined` \| [`Prefix`](../interfaces/Prefix.md)

The prefix if the position can be converted, otherwise undefined.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[gridPosToPrefix](../interfaces/HilbertMapper.md#gridpostoprefix)

#### Defined in

[mapper/composite.ts:52](https://github.com/ZuchaoWang/ip-hilbert/blob/7a83986/src/mapper/composite.ts#L52)

___

### prefixToRectRegion

▸ **prefixToRectRegion**(`prefix`): `undefined` \| [`Rect`](../interfaces/Rect.md)

Convert a prefix to a rectangle region in the grid.
It will go through each child mapper to see if the prefix can be converted to a rectangle region.
If a child mapper can convert the prefix, the rectangle region will be adjusted by the offset
of the child mapper in the overall grid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | [`Prefix`](../interfaces/Prefix.md) | The prefix to be converted. |

#### Returns

`undefined` \| [`Rect`](../interfaces/Rect.md)

The rectangle region if the prefix can be converted, otherwise undefined.

#### Implementation of

[HilbertMapper](../interfaces/HilbertMapper.md).[prefixToRectRegion](../interfaces/HilbertMapper.md#prefixtorectregion)

#### Defined in

[mapper/composite.ts:75](https://github.com/ZuchaoWang/ip-hilbert/blob/7a83986/src/mapper/composite.ts#L75)

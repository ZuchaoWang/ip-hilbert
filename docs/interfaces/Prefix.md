[@zuchaowang/ip-hilbert](../README.md) / Prefix

# Interface: Prefix

Prefix interface representing an IP prefix.

## Table of contents

### Properties

- [bytes](Prefix.md#bytes)
- [maskLen](Prefix.md#masklen)

## Properties

### bytes

• **bytes**: `number`[]

The byte array representation of the IP part of the prefix. It can be obtained by ipaddr.js's IP.toByteArray.

#### Defined in

[prefix.ts:7](https://github.com/ZuchaoWang/ip-hilbert/blob/4255698/src/prefix.ts#L7)

___

### maskLen

• **maskLen**: `number`

The length of the mask for the prefix, ranging from 0 to the length of the bytes array multiplied by 8.

#### Defined in

[prefix.ts:8](https://github.com/ZuchaoWang/ip-hilbert/blob/4255698/src/prefix.ts#L8)

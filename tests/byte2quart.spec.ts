import { convertPrefixToQuarts, convertQuartsToBytes, extractQuartFromBytes } from "../src/byte2quart";
import { parsePrefix } from "./utils";

describe("extractQuartFromBytes", () => {
  // Convert your parts to bytes
  const bytes = [0b11000100, 0b11001100, 0b11110000, 0b01110000, 0b10110111, 0b11111011];

  it("extracts the correct quart from the first byte", () => {
    const index = 0;
    const expected = 3; // 0b11
    const result = extractQuartFromBytes(bytes, index);
    expect(result).toBe(expected);
  });

  it("extracts the correct quart from a middle byte", () => {
    const index = 12;
    const expected = 1; // 0b01
    const result = extractQuartFromBytes(bytes, index);
    expect(result).toBe(expected);
  });

  it("extracts the correct quart from the last byte", () => {
    const index = 22;
    const expected = 2; // 0b10
    const result = extractQuartFromBytes(bytes, index);
    expect(result).toBe(expected);
  });

  it("returns undefined when the index is too small", () => {
    const index = -1;
    const result = extractQuartFromBytes(bytes, index);
    expect(result).toBeUndefined();
  });

  it("returns undefined when the index is too large", () => {
    const index = 30;
    const result = extractQuartFromBytes(bytes, index);
    expect(result).toBeUndefined();
  });
});


describe("convertPrefixToQuarts function", () => {
  it("should return correct leadingQuarts and lastQuart for given IPv6 CIDR with even mask length", () => {
    const ipv6CIDR1 = parsePrefix("::/0");
    const expectedQuad1 = { leadingQuarts: [], lastQuart: undefined };
    expect(convertPrefixToQuarts(ipv6CIDR1, 0)).toEqual(expectedQuad1);

    const ipv6CIDR2 = parsePrefix("2001:db8::/32");
    const expectedQuad2 = {
      leadingQuarts: [0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 3, 1, 2, 3, 2, 0],
      lastQuart: undefined
    };
    expect(convertPrefixToQuarts(ipv6CIDR2, 0)).toEqual(expectedQuad2);

    const ipv6CIDR3 = parsePrefix("aabb:ccdd::/64");
    const expectedQuad3 = {
      leadingQuarts: [
        2,
        2,
        2,
        2,
        2,
        3,
        2,
        3,
        3,
        0,
        3,
        0,
        3,
        1,
        3,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      lastQuart: undefined
    };
    expect(convertPrefixToQuarts(ipv6CIDR3, 0)).toEqual(expectedQuad3);

    const ipv6CIDR4 = parsePrefix("ab00::/8");
    const expectedQuad4 = {
      leadingQuarts: [2, 2, 2, 3],
      lastQuart: undefined
    };
    expect(convertPrefixToQuarts(ipv6CIDR4, 0)).toEqual(expectedQuad4);

    const ipv6CIDR5 = parsePrefix("abcd::/16");
    const expectedQuad5 = {
      leadingQuarts: [2, 2, 2, 3, 3, 0, 3, 1],
      lastQuart: undefined
    };
    expect(convertPrefixToQuarts(ipv6CIDR5, 0)).toEqual(expectedQuad5);
  });

  it("should return correct leadingQuarts and lastQuart for given IPv6 CIDR with odd mask length", () => {
    const ipv6CIDR1 = parsePrefix("2001:db8::/33");
    const expectedQuad1 = {
      leadingQuarts: [0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 3, 1, 2, 3, 2, 0],
      lastQuart: 0
    };
    expect(convertPrefixToQuarts(ipv6CIDR1, 0)).toEqual(expectedQuad1);

    const ipv6CIDR2 = parsePrefix("2001:db8:8000::/33");
    const expectedQuad2 = {
      leadingQuarts: [0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 3, 1, 2, 3, 2, 0],
      lastQuart: 2
    };
    expect(convertPrefixToQuarts(ipv6CIDR2, 0)).toEqual(expectedQuad2);

    const ipv6CIDR3 = parsePrefix("::/1");
    const expectedQuad3 = {
      leadingQuarts: [],
      lastQuart: 0
    };
    expect(convertPrefixToQuarts(ipv6CIDR3, 0)).toEqual(expectedQuad3);

    const ipv6CIDR4 = parsePrefix("ab80::/9");
    const expectedQuad4 = {
      leadingQuarts: [2, 2, 2, 3],
      lastQuart: 2
    };
    expect(convertPrefixToQuarts(ipv6CIDR4, 0)).toEqual(expectedQuad4);

    const ipv6CIDR5 = parsePrefix("abcd::/17");
    const expectedQuad5 = {
      leadingQuarts: [2, 2, 2, 3, 3, 0, 3, 1],
      lastQuart: 0
    };
    expect(convertPrefixToQuarts(ipv6CIDR5, 0)).toEqual(expectedQuad5);
  });

  it("should return correct leadingQuarts and lastQuart for given IPv4 CIDR with even and odd mask length", () => {
    // For IPv4 CIDR with even mask length
    const ipv4CIDREven = parsePrefix("192.168.0.0/16");
    const expectedQuadEven = {
      leadingQuarts: [3, 0, 0, 0, 2, 2, 2, 0],
      lastQuart: undefined,
    };
    expect(convertPrefixToQuarts(ipv4CIDREven, 0)).toEqual(expectedQuadEven);

    // For IPv4 CIDR with odd mask length
    const ipv4CIDROdd = parsePrefix("192.168.0.0/15");
    const expectedQuadOdd = {
      leadingQuarts: [3, 0, 0, 0, 2, 2, 2],
      lastQuart: 0,
    };
    expect(convertPrefixToQuarts(ipv4CIDROdd, 0)).toEqual(expectedQuadOdd);
  });

  it("should return correct leadingQuarts and lastQuart with non-zero numQuartsSkip", () => {
    // For IPv6 CIDR
    const ipv6CIDR = parsePrefix("2001:db8::/32");
    const expectedQuadIPv6 = {
      leadingQuarts: [3, 1, 2, 3, 2, 0],
      lastQuart: undefined,
    };
    expect(convertPrefixToQuarts(ipv6CIDR, 10)).toEqual(expectedQuadIPv6);

    // For IPv4 CIDR
    const ipv4CIDR = parsePrefix("192.168.0.0/15");
    const expectedQuadIPv4 = {
      leadingQuarts: [2],
      lastQuart: 0,
    };
    expect(convertPrefixToQuarts(ipv4CIDR, 6)).toEqual(expectedQuadIPv4);
  });

  it("should return undefined when numQuartsSkip is too large", () => {
    // For IPv6 CIDR
    const ipv6CIDR = parsePrefix("2001:db8::/32");
    expect(convertPrefixToQuarts(ipv6CIDR, 100)).toBeUndefined();

    // For IPv4 CIDR
    const ipv4CIDR = parsePrefix("192.168.0.0/16");
    expect(convertPrefixToQuarts(ipv4CIDR, 100)).toBeUndefined();
  });

  it("should return undefined when numQuartsSkip is negative", () => {
    // For IPv6 CIDR
    const ipv6CIDR = parsePrefix("2001:db8::/32");
    expect(convertPrefixToQuarts(ipv6CIDR, -1)).toBeUndefined();

    // For IPv4 CIDR
    const ipv4CIDR = parsePrefix("192.168.0.0/16");
    expect(convertPrefixToQuarts(ipv4CIDR, -1)).toBeUndefined();
  });
});

describe('convertQuartsToBytes', () => {
  it('should convert array of quarts into array of bytes correctly', () => {
    const N = 100; // Num of random test cases
    const M = 64; // Max number of quarts length
    for (let i = 0; i < N; i++) {
      const quartsLength = Math.floor(Math.random() * (M + 1));
      const quarts: number[] = [];
      for (let i = 0; i < quartsLength; i++) {
        quarts.push(Math.floor(Math.random() * 4));
      }

      const bytes = convertQuartsToBytes(quarts);
      for (let j = 0; j < bytes.length * 4; j++) {  // for each quart position in the bytes
        const quart = extractQuartFromBytes(bytes, j);
        if (j < quarts.length) {  // if within original array's length, should equal
          expect(quart).toEqual(quarts[j]);
        } else {  // otherwise should be 0
          expect(quart).toEqual(0);
        }
      }
    }
  });
});
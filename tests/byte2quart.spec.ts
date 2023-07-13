import { extractQuartFromBytes } from "../src/byte2quart";

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
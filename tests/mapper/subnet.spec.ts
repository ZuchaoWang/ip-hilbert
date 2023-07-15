import { SubnetHilbertMapper } from "../../src/mapper/subnet";
import { parsePrefix } from "../utils";

describe('SubnetHilbertMapper constructor input validation', () => {
  it("should not throw error when input is legal", () => {
    expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 26)).not.toThrow();
  });

  it('should throw error when gridMaskLen is even', () => {
      expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 27)).toThrow();
  });

  it('should throw error when gridMaskLen - subnetPrefix.maskLen > 15', () => {
      expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 40)).toThrow();
  });

  it('should throw error when gridMaskLen < subnetPrefix.maskLen', () => {
      expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 22)).toThrow();
  });
});

describe("SubnetHilbertMapper prefixToRectRegion for IPv4", () => {
  // ref: https://observablehq.com/@vasturiano/hilbert-map-of-ipv4-address-space

  it("should have correct width and height", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("0.0.0.0/0"), 8);
    expect(subnetMapper.getWidth()).toBe(16);
    expect(subnetMapper.getHeight()).toBe(16);
  });

  it("should map prefix to correct rect region", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("0.0.0.0/0"), 8);
    expect(subnetMapper.prefixToRectRegion(parsePrefix("224.0.0.0/4"))).toEqual({x: 8, y:0, width: 4, height: 4});   // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("49.0.0.0/8"))).toEqual({x: 2, y: 7, width: 1, height: 1});   // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("102.0.0.0/8"))).toEqual({x: 5, y: 15, width: 1, height: 1}); // AFRINIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("186.0.0.0/7"))).toEqual({x: 12, y: 8, width: 2, height: 1}); // LACNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("202.0.0.0/7"))).toEqual({x: 12, y: 4, width: 1, height: 2}); // APNIC
  });
});
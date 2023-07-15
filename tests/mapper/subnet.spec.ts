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

  it("should have correct width and height under 0.0.0.0/0", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("0.0.0.0/0"), 8);
    expect(subnetMapper.getWidth()).toBe(16);
    expect(subnetMapper.getHeight()).toBe(16);
  });

  it("should map prefix to correct rect region under 0.0.0.0/0", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("0.0.0.0/0"), 8);
    expect(subnetMapper.prefixToRectRegion(parsePrefix("224.0.0.0/4"))).toEqual({ x: 8, y: 0, width: 4, height: 4 });  // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("49.0.0.0/8"))).toEqual({ x: 2, y: 7, width: 1, height: 1 });   // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("102.0.0.0/8"))).toEqual({ x: 5, y: 15, width: 1, height: 1 }); // AFRINIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("214.0.0.0/7"))).toEqual({ x: 8, y: 6, width: 2, height: 1 });  // US-DOD
    expect(subnetMapper.prefixToRectRegion(parsePrefix("202.0.0.0/7"))).toEqual({ x: 12, y: 4, width: 1, height: 2 }); // APNIC
  });

  it("should have correct width and height under 192.0.0.0/3", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("192.0.0.0/3"), 8);
    expect(subnetMapper.getWidth()).toBe(8);
    expect(subnetMapper.getHeight()).toBe(4);
  });

  it("should map prefix to correct rect region under 192.0.0.0/3", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("192.0.0.0/3"), 8);
    expect(subnetMapper.prefixToRectRegion(parsePrefix("224.0.0.0/4"))).toBeUndefined();                              // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("49.0.0.0/8"))).toBeUndefined();                               // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("102.0.0.0/8"))).toBeUndefined();                              // AFRINIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("214.0.0.0/7"))).toEqual({ x: 0, y: 2, width: 2, height: 1 }); // US-DOD
    expect(subnetMapper.prefixToRectRegion(parsePrefix("202.0.0.0/7"))).toEqual({ x: 4, y: 0, width: 1, height: 2 }); // APNIC
  });
});
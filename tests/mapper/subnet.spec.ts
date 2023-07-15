import { SubnetHilbertMapper } from "../../src/mapper/subnet";
import { parsePrefix } from "../utils";

describe('SubnetHilbertMapper constructor input validation', () => {
  it("should not throw error when input is legal", () => {
    const subnetPrefix = parsePrefix('192.0.2.0/24');
    expect(() => new SubnetHilbertMapper(subnetPrefix, 26)).not.toThrow();
  });

  it('should throw error when gridMaskLen is even', () => {
      const subnetPrefix = parsePrefix('192.0.2.0/24');
      expect(() => new SubnetHilbertMapper(subnetPrefix, 27)).toThrow();
  });

  it('should throw error when gridMaskLen - subnetPrefix.maskLen > 15', () => {
      const subnetPrefix = parsePrefix('192.0.2.0/24');
      expect(() => new SubnetHilbertMapper(subnetPrefix, 40)).toThrow();
  });

  it('should throw error when gridMaskLen < subnetPrefix.maskLen', () => {
      const subnetPrefix = parsePrefix('192.0.2.0/24');
      expect(() => new SubnetHilbertMapper(subnetPrefix, 22)).toThrow();
  });
});
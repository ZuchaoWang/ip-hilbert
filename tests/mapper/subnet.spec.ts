import { SubnetHilbertMapper } from "../../src/mapper/subnet";
import { parsePrefix, stringifyPrefix } from "../utils";

describe('SubnetHilbertMapper constructor input validation', () => {
  it("should not throw error when input is legal", () => {
    expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 26)).not.toThrow();
  });

  it('should throw error when gridMaskLen is even', () => {
    expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 27)).toThrow();
  });

  it('should throw error when gridMaskLen - subnetPrefix.maskLen > 32', () => {
    // IPv4 does not have maskLen 57, this is just to trigger the error
    expect(() => new SubnetHilbertMapper(parsePrefix('192.0.2.0/24'), 57)).toThrow();
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
    expect(subnetMapper.prefixToRectRegion(parsePrefix("224.0.0.0/4"))).toEqual({ x: 8, y: 0, width: 4, height: 4 });   // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("49.0.0.0/8"))).toEqual({ x: 2, y: 7, width: 1, height: 1 });    // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("102.0.0.0/8"))).toEqual({ x: 5, y: 15, width: 1, height: 1 });  // AFRINIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("214.0.0.0/7"))).toEqual({ x: 8, y: 6, width: 2, height: 1 });   // US-DOD
    expect(subnetMapper.prefixToRectRegion(parsePrefix("202.0.0.0/7"))).toEqual({ x: 12, y: 4, width: 1, height: 2 });  // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("217.0.0.0/8"))).toEqual({ x: 8, y: 5, width: 1, height: 1 });   // RIPE NCC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("217.64.0.0/10"))).toEqual({ x: 8, y: 5, width: 1, height: 1 }); // within RIPE NCC
  });

  it("should have correct width and height under 192.0.0.0/3", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("192.0.0.0/3"), 8);
    expect(subnetMapper.getWidth()).toBe(8);
    expect(subnetMapper.getHeight()).toBe(4);
  });

  it("should map prefix to correct rect region under 192.0.0.0/3", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("192.0.0.0/3"), 8);
    expect(subnetMapper.prefixToRectRegion(parsePrefix("224.0.0.0/4"))).toBeUndefined();                                // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("49.0.0.0/8"))).toBeUndefined();                                 // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("102.0.0.0/8"))).toBeUndefined();                                // AFRINIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("214.0.0.0/7"))).toEqual({ x: 0, y: 2, width: 2, height: 1 });   // US-DOD
    expect(subnetMapper.prefixToRectRegion(parsePrefix("202.0.0.0/7"))).toEqual({ x: 4, y: 0, width: 1, height: 2 });   // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("217.0.0.0/8"))).toEqual({ x: 0, y: 1, width: 1, height: 1 });   // RIPE NCC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("217.64.0.0/10"))).toEqual({ x: 0, y: 1, width: 1, height: 1 }); // within RIPE NCC
  });
});

describe("SubnetHilbertMapper prefixToRectRegion for IPv6", () => {
  // ref: https://observablehq.com/@vasturiano/hilbert-map-of-ipv6-address-space

  it("should have correct width and height under ::/0", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("::/0"), 12);
    expect(subnetMapper.getWidth()).toBe(64);
    expect(subnetMapper.getHeight()).toBe(64);
  });

  it("should map prefix to correct rect region under ::/0", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("::/0"), 12);
    expect(subnetMapper.prefixToRectRegion(parsePrefix("ff00::/8"))).toEqual({ x: 60, y: 0, width: 4, height: 4 });   // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2000::/3"))).toEqual({ x: 0, y: 16, width: 32, height: 16 }); // IANA unicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2400::/12"))).toEqual({ x: 24, y: 16, width: 1, height: 1 }); // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2a00::/11"))).toEqual({ x: 28, y: 28, width: 1, height: 2 }); // RIPE NCC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2a04::/13"))).toEqual({ x: 28, y: 28, width: 1, height: 1 }); // within RIPE NCC
  });

  it("should have correct width and height under 2000::/3", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("2000::/3"), 12);
    expect(subnetMapper.getWidth()).toBe(32);
    expect(subnetMapper.getHeight()).toBe(16);
  });

  it("should map prefix to correct rect region under 2000::/3", () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("2000::/3"), 12);
    expect(subnetMapper.prefixToRectRegion(parsePrefix("ff00::/8"))).toBeUndefined();                                 // multicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2000::/3"))).toEqual({ x: 0, y: 0, width: 32, height: 16 });  // IANA unicast
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2400::/12"))).toEqual({ x: 24, y: 0, width: 1, height: 1 });  // APNIC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2a00::/11"))).toEqual({ x: 28, y: 12, width: 1, height: 2 }); // RIPE NCC
    expect(subnetMapper.prefixToRectRegion(parsePrefix("2a04::/13"))).toEqual({ x: 28, y: 12, width: 1, height: 1 }); // within RIPE NCC
  });
});

describe('SubnetHilbertMapper gridPosToPrefix for IPv4', () => {
  it('should detects out of range position', () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("192.0.0.0/3"), 8);

    const prefixOutOfRange = subnetMapper.gridPosToPrefix(-1, -1);
    expect(prefixOutOfRange).toBeUndefined();

    const prefixInRange = subnetMapper.gridPosToPrefix(0, 1);
    const prefixInRangeStr = stringifyPrefix(prefixInRange!);
    expect(prefixInRangeStr).toBe("217.0.0.0/8"); // RIPE NCC
  });

  it('should pass randomized tests using prefixToRectRegion', () => {
    const N = 100;
    const numTotalBytes = 4;

    for (let i = 0; i < N; i++) {
      // randomly generate even gridMaskLen between 0 and 32 (inclusive)
      const gridMaskLen = Math.floor(Math.random() * (numTotalBytes * 4 + 1)) * 2;

      // randomly generate subnet prefix
      const subnetMaskLen = Math.floor(Math.random() * (gridMaskLen + 1));
      const subnetBytes = [];
      for (let j = 0; j < numTotalBytes; j++) {
        subnetBytes.push(Math.floor(Math.random() * 256));
      }
      const subnetPrefix = { bytes: subnetBytes, maskLen: subnetMaskLen };

      // create SubnetHilbertMapper instance
      const subnetMapper = new SubnetHilbertMapper(subnetPrefix, gridMaskLen);

      // get width and height
      const width = subnetMapper.getWidth();
      const height = subnetMapper.getHeight();

      // randomly choose x and y within width and height
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      // use gridPosToPrefix to get the prefix
      const prefix = subnetMapper.gridPosToPrefix(x, y);

      // use prefixToRectRegion to get back the region
      const rectRegion = subnetMapper.prefixToRectRegion(prefix!);

      // assertions
      expect(rectRegion).toEqual({ x, y, width: 1, height: 1 });
    }
  });
});

describe('SubnetHilbertMapper gridPosToPrefix for IPv6', () => {
  it('should detects out of range position', () => {
    const subnetMapper = new SubnetHilbertMapper(parsePrefix("2000::/3"), 12);

    const prefixOutOfRange = subnetMapper.gridPosToPrefix(-1, -1);
    expect(prefixOutOfRange).toBeUndefined();

    const prefixInRange = subnetMapper.gridPosToPrefix(24, 0);
    const prefixInRangeStr = stringifyPrefix(prefixInRange!);
    expect(prefixInRangeStr).toBe("2400::/12"); // APNIC
  });

  it('should pass randomized tests using prefixToRectRegion', () => {
    const N = 100;
    const numTotalBytes = 16;
  
    for (let i = 0; i < N; i++) {
      // randomly generate gridMaskLen between 0 and 128 (inclusive)
      const gridMaskLen = Math.floor(Math.random() * (numTotalBytes * 4 + 1)) * 2;
  
      // ensure subnetMaskLen is at least gridMaskLen-32
      const minSubnetMaskLen = Math.max(0, gridMaskLen - 32);
      const subnetMaskLen = Math.floor(Math.random() * (gridMaskLen - minSubnetMaskLen + 1)) + minSubnetMaskLen;
  
      // randomly generate subnet prefix
      const subnetBytes = [];
      for (let j = 0; j < numTotalBytes; j++) {
        subnetBytes.push(Math.floor(Math.random() * 256));
      }
      const subnetPrefix = { bytes: subnetBytes, maskLen: subnetMaskLen };
  
      // create SubnetHilbertMapper instance
      const subnetMapper = new SubnetHilbertMapper(subnetPrefix, gridMaskLen);
  
      // get width and height
      const width = subnetMapper.getWidth();
      const height = subnetMapper.getHeight();
  
      // randomly choose x and y within width and height
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
  
      // use gridPosToPrefix to get the prefix
      const prefix = subnetMapper.gridPosToPrefix(x, y);
  
      // use prefixToRectRegion to get back the region
      const rectRegion = subnetMapper.prefixToRectRegion(prefix!);
    
      // assertions
      expect(rectRegion).toEqual({ x, y, width: 1, height: 1 });
    }
  });
});
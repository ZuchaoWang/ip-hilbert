import { CompositeHilbertMapper } from "../../src/mapper/composite";
import { SubnetHilbertMapper } from "../../src/mapper/subnet";
import { parsePrefix } from "../utils";

describe('CompositeHilbertMapper', () => {
  let multiMapper: CompositeHilbertMapper;

  beforeAll(() => {
    const subnetMapper1 = new SubnetHilbertMapper(parsePrefix('2400::/12'), 26); // APNIC
    const subnetMapper2 = new SubnetHilbertMapper(parsePrefix('2a00::/11'), 26); // RIPE NCC

    multiMapper = new CompositeHilbertMapper(
      256, 
      256, 
      [{ mapper: subnetMapper1, offset: [0, 0] }, { mapper: subnetMapper2, offset: [128, 0] }]
    );
  });

  it('getWidth and getHeight should return width and height', () => {
    expect(multiMapper.getWidth()).toEqual(256);
    expect(multiMapper.getHeight()).toEqual(256);
  });

  it('gridPosToPrefix should detect out of range', () => {
    expect(multiMapper.gridPosToPrefix(32, 32)).not.toBeUndefined(); // APNIC
    expect(multiMapper.gridPosToPrefix(160, 32)).not.toBeUndefined(); // RIPE NCC
    expect(multiMapper.gridPosToPrefix(160, 160)).not.toBeUndefined(); // RIPE NCC
    expect(multiMapper.gridPosToPrefix(32, 160)).toBeUndefined();
    expect(multiMapper.gridPosToPrefix(-1, -1)).toBeUndefined();
  });

  it('prefixToRectRegion should detect out of range', () => {
    expect(multiMapper.prefixToRectRegion(parsePrefix('2000::/3'))).toBeUndefined();
    expect(multiMapper.prefixToRectRegion(parsePrefix('2440::/14'))).toBeUndefined();
    expect(multiMapper.prefixToRectRegion(parsePrefix('2600::/14'))).toBeUndefined();
    expect(multiMapper.prefixToRectRegion(parsePrefix('2405:1234::/32'))).not.toBeUndefined(); // APNIC
    expect(multiMapper.prefixToRectRegion(parsePrefix('2a00::/11'))).not.toBeUndefined(); // RIPE NCC
    expect(multiMapper.prefixToRectRegion(parsePrefix('2a08::/12'))).not.toBeUndefined(); // RIPE NCC
  });

  it('should pass randomized tests for gridPosToPrefix and prefixToRectRegion', () => {
    const N = 100;
    const width = multiMapper.getWidth();
    const height = multiMapper.getHeight();

    for (let i = 0; i < N; i++) {
      // randomly choose x and y within width and height
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      // use gridPosToPrefix to get the prefix
      const prefix = multiMapper.gridPosToPrefix(x, y);

      if (prefix !== undefined) {
        // use prefixToRectRegion to get back the region
        const rectRegion = multiMapper.prefixToRectRegion(prefix);

        // assertions
        expect(rectRegion).toEqual({ x, y, width: 1, height: 1 });
      }
    }
  });
});
import {
  hilbertQuartsToSquareRegion,
  hilbertQuartsToRectRegion,
} from "./quart2hilbert";

describe("hilbert square region", () => {
  it("can calculate bottom left at different quarts length", () => {
    expect(hilbertQuartsToSquareRegion(1, 1, 2, [])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 0,
      flip: 1,
    });
    expect(hilbertQuartsToSquareRegion(2, 2, 4, [0])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 3,
      flip: -1,
    });
    expect(hilbertQuartsToSquareRegion(4, 4, 8, [0, 0])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 0,
      flip: 1,
    });
    expect(hilbertQuartsToSquareRegion(8, 8, 16, [0, 0, 0])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 3,
      flip: -1,
    });
  });

  it("can calculate any position at quarts length 3", () => {
    expect(hilbertQuartsToSquareRegion(8, 8, 16, [0, 0, 0])).toMatchObject({
      xc: 1,
      yc: 1,
    });
    expect(hilbertQuartsToSquareRegion(8, 8, 16, [1, 0, 2])).toMatchObject({
      xc: 3,
      yc: 11,
    });
    expect(hilbertQuartsToSquareRegion(8, 8, 16, [1, 3, 2])).toMatchObject({
      xc: 5,
      yc: 9,
    });
    expect(hilbertQuartsToSquareRegion(8, 8, 16, [2, 2, 2])).toMatchObject({
      xc: 15,
      yc: 15,
    });
    expect(hilbertQuartsToSquareRegion(8, 8, 16, [3, 3, 3])).toMatchObject({
      xc: 15,
      yc: 1,
    });
  });
});

describe("hilbert rect region", () => {
  it("can calculate bottom left square region", () => {
    expect(hilbertQuartsToRectRegion(8, 8, 16, [0, 0, 0])).toEqual({
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [0, 0])).toEqual({
      x: 0,
      y: 0,
      width: 4,
      height: 4,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [0])).toEqual({
      x: 0,
      y: 0,
      width: 8,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [])).toEqual({
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    });
  });

  it("can calculate any region", () => {
    expect(hilbertQuartsToRectRegion(8, 8, 16, [1, 3, 2])).toEqual({
      x: 4,
      y: 8,
      width: 2,
      height: 2,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [1, 3])).toEqual({
      x: 4,
      y: 8,
      width: 4,
      height: 4,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [1])).toEqual({
      x: 0,
      y: 8,
      width: 8,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [1], 0)).toEqual({
      x: 0,
      y: 8,
      width: 4,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [1], 2)).toEqual({
      x: 4,
      y: 8,
      width: 4,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [2, 0], 0)).toEqual({
      x: 8,
      y: 8,
      width: 4,
      height: 2,
    });
    expect(hilbertQuartsToRectRegion(8, 8, 16, [2, 0], 2)).toEqual({
      x: 8,
      y: 10,
      width: 4,
      height: 2,
    });
  });
});

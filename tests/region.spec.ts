import { convertSquareToRect, isXYPosInRect, isXYPosInSquare, Square } from "../src/region";

describe("convertSquareToRect", () => {
  test(`pass random test cases`, () => {
    const N = 100; // number of test cases
    const M = 10000; // range for random size, x and y values
    for (let i = 0; i < N; i++) {
      // Generate random size, x and y values, and flip and angle values
      const size = 2 * Math.floor((Math.random() * M) / 2); // ensuring size is even
      const x = Math.floor(Math.random() * M);
      const y = Math.floor(Math.random() * M);
      const flip = Math.random() > 0.5 ? 1 : -1;
      const angle = Math.floor(Math.random() * 4);

      // Construct the square
      const square: Square = {
        xc: x + size / 2,
        yc: y + size / 2,
        size,
        flip,
        angle,
      };

      // Run the function and check the result
      const rect = convertSquareToRect(square);
      expect(rect).toEqual({ x, y, width: size, height: size });
    }
  });
});

describe("isXYPosInSquare function", () => {
  it("should return true when the point is inside the square", () => {
    const square = { xc: 5, yc: 5, size: 4, angle: 0, flip: 1 };
    expect(isXYPosInSquare(4, 4, square)).toBeTruthy();
  });

  it("should return false when the point is outside the square", () => {
    const square = { xc: 5, yc: 5, size: 4, angle: 0, flip: 1 };
    expect(isXYPosInSquare(8, 8, square)).toBeFalsy();
  });

  it("should return true when the point is on the xmin boundary of the square", () => {
    const square = { xc: 5, yc: 5, size: 4, angle: 0, flip: 1 };
    expect(isXYPosInSquare(3, 4, square)).toBeTruthy();
  });

  it("should return true when the point is on the ymin boundary of the square", () => {
    const square = { xc: 5, yc: 5, size: 4, angle: 0, flip: 1 };
    expect(isXYPosInSquare(4, 3, square)).toBeTruthy();
  });

  it("should return false when the point is on the xmax boundary of the square", () => {
    const square = { xc: 5, yc: 5, size: 4, angle: 0, flip: 1 };
    expect(isXYPosInSquare(7, 4, square)).toBeFalsy();
  });

  it("should return false when the point is on the ymax boundary of the square", () => {
    const square = { xc: 5, yc: 5, size: 4, angle: 0, flip: 1 };
    expect(isXYPosInSquare(4, 7, square)).toBeFalsy();
  });
});

describe("isXYPosInRect function", () => {
  it("should return true when the point is inside the rectangle", () => {
    const rect = { x: 2, y: 2, width: 4, height: 4 };
    expect(isXYPosInRect(3, 3, rect)).toBeTruthy();
  });

  it("should return false when the point is outside the rectangle", () => {
    const rect = { x: 2, y: 2, width: 4, height: 4 };
    expect(isXYPosInRect(7, 7, rect)).toBeFalsy();
  });

  it("should return true when the point is on the xmin boundary of the rectangle", () => {
    const rect = { x: 2, y: 2, width: 4, height: 4 };
    expect(isXYPosInRect(2, 3, rect)).toBeTruthy();
  });

  it("should return true when the point is on the ymin boundary of the rectangle", () => {
    const rect = { x: 2, y: 2, width: 4, height: 4 };
    expect(isXYPosInRect(3, 2, rect)).toBeTruthy();
  });

  it("should return false when the point is on the xmax boundary of the rectangle", () => {
    const rect = { x: 2, y: 2, width: 4, height: 4 };
    expect(isXYPosInRect(6, 3, rect)).toBeFalsy();
  });

  it("should return false when the point is on the ymax boundary of the rectangle", () => {
    const rect = { x: 2, y: 2, width: 4, height: 4 };
    expect(isXYPosInRect(3, 6, rect)).toBeFalsy();
  });
});
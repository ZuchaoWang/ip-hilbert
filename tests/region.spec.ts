import { convertSquareToRect, Square } from "../src/region";

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

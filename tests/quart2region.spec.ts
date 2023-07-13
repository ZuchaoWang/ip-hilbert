import { Square } from "../src/region";
import {
  hilbertQuartsToSquareRegion,
  hilbertQuartsToRectRegion,
} from "../src/quart2region";

describe("hilbert square region", () => {
  it("can calculate bottom left at different quarts length", () => {
    expect(hilbertQuartsToSquareRegion({ xc: 1, yc: 1, size: 2, angle: 0, flip: 1 }, [])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 0,
      flip: 1,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 2, yc: 2, size: 4, angle: 0, flip: 1 }, [0])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 3,
      flip: -1,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 4, yc: 4, size: 8, angle: 0, flip: 1 }, [0, 0])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 0,
      flip: 1,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [0, 0, 0])).toEqual({
      xc: 1,
      yc: 1,
      size: 2,
      angle: 3,
      flip: -1,
    });
  });

  it("can calculate any position at quarts length 3", () => {
    expect(hilbertQuartsToSquareRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [0, 0, 0])).toMatchObject({
      xc: 1,
      yc: 1,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1, 0, 2])).toMatchObject({
      xc: 3,
      yc: 11,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1, 3, 2])).toMatchObject({
      xc: 5,
      yc: 9,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [2, 2, 2])).toMatchObject({
      xc: 15,
      yc: 15,
    });
    expect(hilbertQuartsToSquareRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [3, 3, 3])).toMatchObject({
      xc: 15,
      yc: 1,
    });
  });

  it("produces same result when processing quarts in one or two steps", () => {
    // randomized test
    // with two steps, the second step can test non-default flip and angle
    
    const N = 100; // number of test cases
    const M = 10; // max order for generating quarts

    for (let i = 0; i < N; i++) {
      // Generate random order within the range of 1 ~ M
      const order = Math.floor(Math.random() * M) + 1;

      // Create starting square
      const initialSquare: Square = {
        xc: Math.pow(2, order - 1),
        yc: Math.pow(2, order - 1),
        size: Math.pow(2, order),
        angle: 0,
        flip: 1,
      };

      // Generate 0~order random quarts
      const numQuarts = Math.floor(Math.random() * (order + 1));
      const quarts = Array.from({ length: numQuarts }, () => Math.floor(Math.random() * 4));

      // Process quarts in one step
      const oneStepResult = hilbertQuartsToSquareRegion(initialSquare, quarts);

      // Process quarts in two steps
      const splitPoint = Math.floor(Math.random() * (numQuarts + 1));
      const firstStepQuarts = quarts.slice(0, splitPoint);
      const secondStepQuarts = quarts.slice(splitPoint);
      const firstStepResult = hilbertQuartsToSquareRegion(initialSquare, firstStepQuarts);
      const twoStepResult = hilbertQuartsToSquareRegion(firstStepResult, secondStepQuarts);

      // The result should be the same for one-step and two-step processing
      expect(oneStepResult).toEqual(twoStepResult);
    }
  });
});

describe("hilbert rect region", () => {
  it("can calculate bottom left square region", () => {
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [0, 0, 0])).toEqual({
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [0, 0])).toEqual({
      x: 0,
      y: 0,
      width: 4,
      height: 4,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [0])).toEqual({
      x: 0,
      y: 0,
      width: 8,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [])).toEqual({
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    });
  });

  it("can calculate any region", () => {
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1, 3, 2])).toEqual({
      x: 4,
      y: 8,
      width: 2,
      height: 2,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1, 3])).toEqual({
      x: 4,
      y: 8,
      width: 4,
      height: 4,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1])).toEqual({
      x: 0,
      y: 8,
      width: 8,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1], 0)).toEqual({
      x: 0,
      y: 8,
      width: 4,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [1], 2)).toEqual({
      x: 4,
      y: 8,
      width: 4,
      height: 8,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [2, 0], 0)).toEqual({
      x: 8,
      y: 8,
      width: 4,
      height: 2,
    });
    expect(hilbertQuartsToRectRegion({ xc: 8, yc: 8, size: 16, angle: 0, flip: 1 }, [2, 0], 2)).toEqual({
      x: 8,
      y: 10,
      width: 4,
      height: 2,
    });
  });

  it("produces same result when processing quarts in one or two steps", () => {
    // randomized test
    // with two steps, the second step can test non-default flip and angle
    
    const N = 100; // number of test cases
    const M = 10; // max order for generating quarts

    for (let i = 0; i < N; i++) {
      // Generate random order within the range of 1 ~ M
      const order = Math.floor(Math.random() * M) + 1;

      // Create starting square
      const initialSquare: Square = {
        xc: Math.pow(2, order - 1),
        yc: Math.pow(2, order - 1),
        size: Math.pow(2, order),
        angle: 0,
        flip: 1,
      };

      // Determine if lastQuart is defined or undefined
      let lastQuart: number | undefined = undefined;
      if (Math.random() < 0.33) {
        lastQuart = Math.floor(Math.random() * 2) * 2;
      }

      // Generate leadingQuarts considering the condition of lastQuart
      const numQuarts = lastQuart === undefined
        ? Math.floor(Math.random() * (order + 1))
        : Math.floor(Math.random() * order);
      const leadingQuarts = Array.from({ length: numQuarts }, () => Math.floor(Math.random() * 4));

      // Process quarts in one step
      const oneStepResult = hilbertQuartsToRectRegion(initialSquare, leadingQuarts, lastQuart);

      // Process quarts in two steps
      const splitPoint = Math.floor(Math.random() * leadingQuarts.length);
      const firstStepQuarts = leadingQuarts.slice(0, splitPoint);
      const secondStepQuarts = leadingQuarts.slice(splitPoint);
      const firstStepResult = hilbertQuartsToSquareRegion(initialSquare, firstStepQuarts);
      const twoStepResult = hilbertQuartsToRectRegion(firstStepResult, secondStepQuarts, lastQuart);

      // The result should be the same for one-step and two-step processing
      expect(oneStepResult).toEqual(twoStepResult);
    }
  });
});

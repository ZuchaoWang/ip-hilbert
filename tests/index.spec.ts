import { add } from "../src/index";

describe("ip-hilbert", () => {
  it("should add correctly", () => {
    expect(add(1, 2)).toBe(3);
  });
});
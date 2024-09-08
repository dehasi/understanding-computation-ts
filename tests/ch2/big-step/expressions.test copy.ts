import { Add, Multiply, Nmbr } from "../../../src/ch2/small-step/expressions";

describe("Reduction toString", () => {
  test("Number", () => {
    const expr = new Multiply(
      new Nmbr(1),
      new Multiply(new Add(new Nmbr(2), new Nmbr(3)), new Nmbr(4)),
    );

    expect(expr.toString()).toEqual("1 * 2 + 3 * 4");
  });
});

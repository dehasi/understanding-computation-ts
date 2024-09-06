import { Add, Machine, Multiply, Nmbr } from "../../src/ch2/expressions";

describe("Reduction", () => {
  test("toString", () => {
    const expr = new Multiply(
      new Nmbr(1),
      new Multiply(new Add(new Nmbr(2), new Nmbr(3)), new Nmbr(4)),
    );

    expect(expr.toString()).toEqual("1 * 2 + 3 * 4");
  });
});

describe("Reduction", () => {
  test("Machine", () => {
    const machine = new Machine(
      new Add(
        new Multiply(new Nmbr(1), new Nmbr(2)),
        new Multiply(new Nmbr(3), new Nmbr(4)),
      ),
    );

    const reductions = machine.run().map((x) => x.toString());

    expect(reductions).toEqual(["1 * 2 + 3 * 4", "2 + 3 * 4", "2 + 12", "14"]);
  });
});

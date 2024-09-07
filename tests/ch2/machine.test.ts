import {
  Add,
  LessThan,
  Multiply,
  Nmbr,
  Variable,
} from "../../src/ch2/expressions";
import { Machine } from "../../src/ch2/Machine";

describe("Machine reduction", () => {
  test("Nmbr", () => {
    const machine = new Machine(
      new Add(
        new Multiply(new Nmbr(1), new Nmbr(2)),
        new Multiply(new Nmbr(3), new Nmbr(4)),
      ),
      new Map(),
    );

    const reductions = machine.run().map((x) => x.toString());

    expect(reductions).toEqual(["1 * 2 + 3 * 4", "2 + 3 * 4", "2 + 12", "14"]);
  });

  test("Boolean", () => {
    const machine = new Machine(
      new LessThan(new Nmbr(5), new Add(new Nmbr(2), new Nmbr(2))),
      new Map(),
    );

    const reductions = machine.run().map((x) => x.toString());

    expect(reductions).toEqual(["5 < 2 + 2", "5 < 4", "false"]);
  });

  test("Variable", () => {
    const machine = new Machine(
      new Add(new Variable("x"), new Variable("y")),
      new Map([
        ["x", new Nmbr(3)],
        ["y", new Nmbr(4)],
      ]),
    );

    const reductions = machine.run().map((x) => x.toString());

    expect(reductions).toEqual(["x + y", "3 + y", "3 + 4", "7"]);
  });
});

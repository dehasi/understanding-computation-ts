import {
  Add,
  Assign,
  LessThan,
  Multiply,
  Nmbr,
  Variable,
} from "../../src/ch2/expressions";
import { ExpressionMachine, StatementMachine } from "../../src/ch2/machine";

describe("Expression Machine reduction", () => {
  test("Nmbr", () => {
    const machine = new ExpressionMachine(
      new Add(
        new Multiply(new Nmbr(1), new Nmbr(2)),
        new Multiply(new Nmbr(3), new Nmbr(4)),
      ),
      new Map(),
    );

    const reductions = machine.run();

    expect(reductions).toEqual([
      "1 * 2 + 3 * 4, {}",
      "2 + 3 * 4, {}",
      "2 + 12, {}",
      "14, {}",
    ]);
  });

  test("Boolean", () => {
    const machine = new ExpressionMachine(
      new LessThan(new Nmbr(5), new Add(new Nmbr(2), new Nmbr(2))),
      new Map(),
    );

    const reductions = machine.run().map((x) => x.toString());

    expect(reductions).toEqual(["5 < 2 + 2, {}", "5 < 4, {}", "false, {}"]);
  });

  test("Variable", () => {
    const machine = new ExpressionMachine(
      new Add(new Variable("x"), new Variable("y")),
      new Map([
        ["x", new Nmbr(3)],
        ["y", new Nmbr(4)],
      ]),
    );

    const reductions = machine.run().map((x) => x.toString());

    expect(reductions).toEqual([
      "x + y, {x=>3, y=>4}",
      "3 + y, {x=>3, y=>4}",
      "3 + 4, {x=>3, y=>4}",
      "7, {x=>3, y=>4}",
    ]);
  });
});

describe("Statement Machine", () => {
  test("Assign", () => {
    const machine = new StatementMachine(
      new Assign("x", new Add(new Variable("x"), new Nmbr(1))),
      new Map([["x", new Nmbr(2)]]),
    );

    const reductions = machine.run();

    expect(reductions).toEqual([
      "x = x + 1, {x=>2}",
      "x = 2 + 1, {x=>2}",
      "x = 3, {x=>2}",
      "do-nothing, {x=>3}",
    ]);
  });
});

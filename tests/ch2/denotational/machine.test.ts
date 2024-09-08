import { FALSE, TRUE } from "../../../src/ch2/denotational/expressions";

import {
  ExpressionMachine,
  StatementMachine,
} from "../../../src/ch2/big-step/machine";

import { DO_NOTHING, While } from "../../../src/ch2/denotational/statements";
import {
  _if,
  _while,
  add,
  assign,
  b,
  env,
  lt,
  mul,
  n,
  seq,
  v,
} from "./test-utils";

describe("Expression Machine reduction", () => {
  test("Nmbr", () => {
    const machine = new ExpressionMachine(
      add(mul(n(1), n(2)), mul(n(3), n(4))),
      env(),
    );

    const evaluated = machine.run();

    expect(evaluated).toEqual(n(14));
  });

  test("Boolean", () => {
    const machine = new ExpressionMachine(lt(n(5), add(n(2), n(2))), env());

    const evaluated = machine.run();

    expect(evaluated).toEqual(b(false));
  });

  test("Variable", () => {
    const machine = new ExpressionMachine(
      add(v("x"), v("y")),
      env(["x", n(3)], ["y", n(4)]),
    );

    const evaluated = machine.run();

    expect(evaluated).toEqual(n(7));
  });
});

describe("Statement Machine", () => {
  test("Assign", () => {
    const machine = new StatementMachine(
      assign("x", add(v("x"), n(1))),
      env(["x", n(2)]),
    );

    const evaluated = machine.run();

    expect(evaluated).toEqual(env(["x", n(3)]));
  });

  test("If Else", () => {
    const machine = new StatementMachine(
      _if(v("x"), assign("y", n(1)), assign("y", n(2))),
      env(["x", b(true)]),
    );

    const evaluated = machine.run();

    expect(evaluated).toEqual(env(["x", TRUE], ["y", n(1)]));
  });

  test("If only", () => {
    const machine = new StatementMachine(
      _if(v("x"), assign("y", n(1)), DO_NOTHING),
      env(["x", b(false)]),
    );

    const evaluated = machine.run();

    expect(evaluated).toEqual(env(["x", FALSE]));
  });

  test("Sequence", () => {
    const machine = new StatementMachine(
      seq(assign("x", add(n(1), n(1))), assign("y", add(v("x"), n(3)))),
      env(),
    );

    const evaluated = machine.run();

    expect(evaluated).toEqual(env(["x", n(2)], ["y", n(5)]));
  });

  test("While (x<2)", () => {
    const machine = new StatementMachine(
      _while(lt(v("x"), n(2)), assign("x", add(v("x"), n(1)))),
      env(["x", n(0)]),
    );

    const evaluated = machine.run();
    expect(evaluated).toEqual(env(["x", n(2)]));
  });

  test("While (x<5)", () => {
    const machine = new StatementMachine(
      _while(lt(v("x"), n(5)), assign("x", mul(v("x"), n(3)))),

      env(["x", n(1)]),
    );

    const reductions = machine.run();
    expect(reductions).toEqual(env(["x", n(9)]));
  });
});

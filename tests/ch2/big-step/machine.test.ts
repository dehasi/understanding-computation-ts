import { FALSE, TRUE } from "../../../src/ch2/big-step/expressions";

import {
  ExpressionMachine,
  StatementMachine,
} from "../../../src/ch2/big-step/machine";

import { DO_NOTHING, While } from "../../../src/ch2/big-step/statements";
import { _if, add, assign, b, env, lt, mul, n, seq, v } from "./test-utils";

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
      new While(lt(v("x"), n(2)), assign("x", add(v("x"), n(1)))),

      env(["x", n(0)]),
    );

    const reductions = machine.run();
    expect(reductions).toEqual([
      "while (x < 2) { x = x + 1 }, {x=>0}",
      "if (x < 2) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>0}",
      "if (0 < 2) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>0}",
      "if (true) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>0}",
      "x = x + 1; while (x < 2) { x = x + 1 }, {x=>0}",
      "x = 0 + 1; while (x < 2) { x = x + 1 }, {x=>0}",
      "x = 1; while (x < 2) { x = x + 1 }, {x=>0}",
      "do-nothing; while (x < 2) { x = x + 1 }, {x=>1}",

      "while (x < 2) { x = x + 1 }, {x=>1}",
      "if (x < 2) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>1}",
      "if (1 < 2) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>1}",
      "if (true) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>1}",
      "x = x + 1; while (x < 2) { x = x + 1 }, {x=>1}",
      "x = 1 + 1; while (x < 2) { x = x + 1 }, {x=>1}",
      "x = 2; while (x < 2) { x = x + 1 }, {x=>1}",
      "do-nothing; while (x < 2) { x = x + 1 }, {x=>2}",

      "while (x < 2) { x = x + 1 }, {x=>2}",
      "if (x < 2) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>2}",
      "if (2 < 2) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>2}",
      "if (false) {x = x + 1; while (x < 2) { x = x + 1 }} else {do-nothing}, {x=>2}",
      "do-nothing, {x=>2}",
    ]);
  });

  test("While (x<5)", () => {
    const machine = new StatementMachine(
      new While(lt(v("x"), n(5)), assign("x", mul(v("x"), n(3)))),

      env(["x", n(1)]),
    );

    const reductions = machine.run();
    expect(reductions).toEqual([
      "while (x < 5) { x = x * 3 }, {x=>1}",
      "if (x < 5) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>1}",
      "if (1 < 5) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>1}",
      "if (true) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>1}",
      "x = x * 3; while (x < 5) { x = x * 3 }, {x=>1}",
      "x = 1 * 3; while (x < 5) { x = x * 3 }, {x=>1}",
      "x = 3; while (x < 5) { x = x * 3 }, {x=>1}",
      "do-nothing; while (x < 5) { x = x * 3 }, {x=>3}",
      "while (x < 5) { x = x * 3 }, {x=>3}",
      "if (x < 5) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>3}",
      "if (3 < 5) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>3}",
      "if (true) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>3}",
      "x = x * 3; while (x < 5) { x = x * 3 }, {x=>3}",
      "x = 3 * 3; while (x < 5) { x = x * 3 }, {x=>3}",
      "x = 9; while (x < 5) { x = x * 3 }, {x=>3}",
      "do-nothing; while (x < 5) { x = x * 3 }, {x=>9}",
      "while (x < 5) { x = x * 3 }, {x=>9}",
      "if (x < 5) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>9}",
      "if (9 < 5) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>9}",
      "if (false) {x = x * 3; while (x < 5) { x = x * 3 }} else {do-nothing}, {x=>9}",
      "do-nothing, {x=>9}",
    ]);
  });
});

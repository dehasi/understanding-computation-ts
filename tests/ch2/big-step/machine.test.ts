import {
  Add,
  Boolean,
  LessThan,
  Multiply,
  Nmbr,
  Variable,
} from "../../../src/ch2/big-step/expressions";

import {
  ExpressionMachine,
  StatementMachine,
} from "../../../src/ch2/big-step/machine";

import {
  Assign,
  DO_NOTHING,
  If,
  Sequence,
  While,
  MyWhile,
} from "../../../src/ch2/big-step/statements";

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

    const reductions = machine.run();

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

    const reductions = machine.run();

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

  test("If Else", () => {
    const machine = new StatementMachine(
      new If(
        new Variable("x"),
        new Assign("y", new Nmbr(1)),
        new Assign("y", new Nmbr(2)),
      ),
      new Map([["x", new Boolean(true)]]),
    );

    const reductions = machine.run();

    expect(reductions).toEqual([
      "if (x) {y = 1} else {y = 2}, {x=>true}",
      "if (true) {y = 1} else {y = 2}, {x=>true}",
      "y = 1, {x=>true}",
      "do-nothing, {x=>true, y=>1}",
    ]);
  });

  test("If only", () => {
    const machine = new StatementMachine(
      new If(new Variable("x"), new Assign("y", new Nmbr(1)), DO_NOTHING),
      new Map([["x", new Boolean(false)]]),
    );

    const reductions = machine.run();

    expect(reductions).toEqual([
      "if (x) {y = 1} else {do-nothing}, {x=>false}",
      "if (false) {y = 1} else {do-nothing}, {x=>false}",
      "do-nothing, {x=>false}",
    ]);
  });

  test("Sequence", () => {
    const machine = new StatementMachine(
      new Sequence(
        new Assign("x", new Add(new Nmbr(1), new Nmbr(1))),
        new Assign("y", new Add(new Variable("x"), new Nmbr(3))),
      ),
      new Map(),
    );

    const reductions = machine.run();

    expect(reductions).toEqual([
      "x = 1 + 1; y = x + 3, {}",
      "x = 2; y = x + 3, {}",
      "do-nothing; y = x + 3, {x=>2}",
      "y = x + 3, {x=>2}",
      "y = 2 + 3, {x=>2}",
      "y = 5, {x=>2}",
      "do-nothing, {x=>2, y=>5}",
    ]);
  });

  test("MyWhile", () => {
    const machine = new StatementMachine(
      new MyWhile(
        new LessThan(new Variable("x"), new Nmbr(2)),
        new Assign("x", new Add(new Variable("x"), new Nmbr(1))),
      ),

      new Map([["x", new Nmbr(0)]]),
    );

    const reductions = machine.run();
    expect(reductions).toEqual([
      "while(x < 2) {x = x + 1}, {x=>0}",
      "while(0 < 2) {x = x + 1}, {x=>0}",
      "while(true) {x = x + 1}, {x=>0}",
      "while(true) {x = 0 + 1}, {x=>0}",
      "while(true) {x = 1}, {x=>0}",
      "while(true) {do-nothing}, {x=>1}",
      "while(x < 2) {x = x + 1}, {x=>1}",
      "while(1 < 2) {x = x + 1}, {x=>1}",
      "while(true) {x = x + 1}, {x=>1}",
      "while(true) {x = 1 + 1}, {x=>1}",
      "while(true) {x = 2}, {x=>1}",
      "while(true) {do-nothing}, {x=>2}",
      "while(x < 2) {x = x + 1}, {x=>2}",
      "while(2 < 2) {x = x + 1}, {x=>2}",
      "while(false) {x = x + 1}, {x=>2}",
      "do-nothing, {x=>2}",
    ]);
  });

  test("While (x<2)", () => {
    const machine = new StatementMachine(
      new While(
        new LessThan(new Variable("x"), new Nmbr(2)),
        new Assign("x", new Add(new Variable("x"), new Nmbr(1))),
      ),

      new Map([["x", new Nmbr(0)]]),
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
      new While(
        new LessThan(new Variable("x"), new Nmbr(5)),
        new Assign("x", new Multiply(new Variable("x"), new Nmbr(3))),
      ),

      new Map([["x", new Nmbr(1)]]),
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

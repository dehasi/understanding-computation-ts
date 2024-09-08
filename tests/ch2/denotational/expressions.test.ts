import { Add, Multiply, Nmbr } from "../../../src/ch2/denotational/expressions";
import { add, b, env, n, v } from "../denotational/test-utils";

describe("Denotional to JS", () => {
  test("Number", () => {
    const expr = n(1);

    expect(expr.toString()).toEqual("1");
    const result = eval(expr.to_JS())(env());
    expect(result).toEqual(1);
  });

  test("Boolean", () => {
    const expr = b(false);

    expect(expr.toString()).toEqual("false");
    const result = eval(expr.to_JS())(env());
    expect(result).toEqual(false);
  });

  test("Variable", () => {
    const expr = v("x");

    expect(expr.toString()).toEqual("x");
    const script = expr.to_JS();
    expect(script.toString()).toEqual('(e) => {return e.get("x");}');
    const result = eval(script)(new Map([["x", 42]]));
    expect(result).toEqual(42);
  });

  test("Add numbers", () => {
    const expr = add(n(2), n(3));

    expect(expr.toString()).toEqual("2 + 3");
    const script = expr.to_JS();
    expect(script.toString()).toEqual(
      "(e) => {return ((e) => {return 2;})(e)) + (((e) => {return 3;})(e));}",
    );
    const result = eval(script)(new Map());
    expect(result).toEqual(5);
  });

  test("Add Variables", () => {
    const expr = add(v("x"), v("y"));

    expect(expr.toString()).toEqual("x + y");
    const script = expr.to_JS();
    expect(script.toString()).toEqual(
      '(e) => {return (((e) => {return e.get("x");})(e)) + (((e) => {return e.get("y");})(e));}',
    );
    const result = eval(script)(
      new Map([
        ["x", 2],
        ["y", 40],
      ]),
    );
    expect(result).toEqual(42);
  });
});

describe("Reduction toString", () => {
  test("Number: 1*(2+3)*4", () => {
    const expr = new Multiply(
      new Nmbr(1),
      new Multiply(new Add(new Nmbr(2), new Nmbr(3)), new Nmbr(4)),
    );

    expect(expr.toString()).toEqual("1 * 2 + 3 * 4");
    expect(expr.evaluate(new Map())).toEqual(new Nmbr(20));
  });
});

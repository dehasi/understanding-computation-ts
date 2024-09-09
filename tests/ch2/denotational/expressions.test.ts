import { add, b, env, lt, mul, n, v } from "../denotational/test-utils";

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
      "(e) => {return (((e) => {return 2;})(e)) + (((e) => {return 3;})(e));}",
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

  test("LessThan", () => {
    const expr = lt(v("x"), v("y"));

    expect(expr.toString()).toEqual("x < y");
    const script = expr.to_JS();
    expect(script.toString()).toEqual(
      '(e) => {return (((e) => {return e.get("x");})(e)) < (((e) => {return e.get("y");})(e));}',
    );
    const result = eval(script)(
      new Map([
        ["x", 2],
        ["y", 40],
      ]),
    );
    expect(result).toEqual(true);
  });

  test("Multiply", () => {
    const expr = mul(v("x"), v("y"));

    expect(expr.toString()).toEqual("x * y");
    const script = expr.to_JS();
    expect(script.toString()).toEqual(
      '(e) => {return (((e) => {return e.get("x");})(e)) * (((e) => {return e.get("y");})(e));}',
    );
    const result = eval(script)(
      new Map([
        ["x", 21],
        ["y", 2],
      ]),
    );
    expect(result).toEqual(42);
  });
});

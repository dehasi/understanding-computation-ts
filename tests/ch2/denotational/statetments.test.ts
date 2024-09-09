import { FALSE, TRUE } from "../../../src/ch2/denotational/expressions";

import {
  ExpressionMachine,
  StatementMachine,
} from "../../../src/ch2/big-step/machine";

import { DO_NOTHING, While } from "../../../src/ch2/denotational/statements";
import {
  _if,
  _while,
  // _while,
  add,
  assign,
  b,
  env,
  env_js,
  lt,
  mul,
  n,
  seq,
  v,
} from "./test-utils";

describe("Statement Machine", () => {
  test("Assign", () => {
    const statement = assign("x", add(v("x"), n(1)));

    expect(statement.toString()).toEqual("x = x + 1");

    const script = statement.to_JS();
    expect(script).toEqual(
      '(e) => { const ne = new Map(e); ne.set("x", (((e) => {return (((e) => {return e.get("x");})(e)) + (((e) => {return 1;})(e));})(e))); return ne; }',
    );
    const result = eval(script)(new Map([["x", 42]]));
    expect(result).toEqual(new Map([["x", 43]]));
  });

  test("If Else", () => {
    const statement = _if(v("x"), assign("y", n(1)), assign("y", n(2)));

    expect(statement.toString()).toEqual("if (x) {y = 1} else {y = 2}");
    const script = statement.to_JS();
    const result = eval(script)(env_js(["x", true]));
    expect(result).toEqual(env_js(["x", true], ["y", 1]));
  });

  test("If only", () => {
    const statement = _if(v("x"), assign("y", n(1)), DO_NOTHING);

    expect(statement.toString()).toEqual("if (x) {y = 1} else {do-nothing}");
    const script = statement.to_JS();
    const result = eval(script)(env_js(["x", false]));
    expect(result).toEqual(env_js(["x", false]));
  });

  test("Sequence", () => {
    const statement = seq(
      assign("x", add(n(1), n(1))),
      assign("y", add(v("x"), n(3))),
    );
    expect(statement.toString()).toEqual("x = 1 + 1; y = x + 3");

    const script = statement.to_JS();
    const result = eval(script)(env_js());
    expect(result).toEqual(env_js(["x", 2], ["y", 5]));
  });

  test("While (x<2)", () => {
    const statement = _while(lt(v("x"), n(2)), assign("x", add(v("x"), n(1))));

    expect(statement.toString()).toEqual("while (x < 2) { x = x + 1 }");

    const script = statement.to_JS();
    const result = eval(script)(env_js(["x", 0]));
    expect(result).toEqual(env_js(["x", 2]));
  });

  test("While (x<5)", () => {
    const statement = _while(lt(v("x"), n(5)), assign("x", mul(v("x"), n(3))));
    expect(statement.toString()).toEqual("while (x < 5) { x = x * 3 }");

    const script = statement.to_JS();
    const result = eval(script)(env_js(["x", 1]));
    expect(result).toEqual(env_js(["x", 9]));
  });
});

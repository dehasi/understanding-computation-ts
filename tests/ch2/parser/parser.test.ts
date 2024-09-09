import { parse } from "../../../lib/ch2/parser"; // Import the generated parser

describe("Peggy", () => {
  test("first", () => {
    const code = "x = x + 1";

    const ast = parse(code);
    const result = ast.evaluate(new Map([["x", { value: 1 }]]));
    expect(result.get("x").value).toEqual(2);
  });

  test("second", () => {
    const code = `
      x = 0
      y = 1
      while(x < 10) {
        x = x + 1
        x = x + y
      }`;

    const ast = parse(code.trim());
    const result = ast.evaluate(new Map([["x", { value: 1 }]]));
    expect(result.get("x").value).toEqual(10);
  });
});

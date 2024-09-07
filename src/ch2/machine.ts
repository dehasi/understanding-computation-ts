import { Expression } from "./expressions";

export class Machine {
  private expression: Expression;
  private environment: Map<String, Expression>;

  constructor(expression: Expression, environment: Map<String, Expression>) {
    this.expression = expression;
    this.environment = environment;
  }

  step(): Expression {
    return (this.expression = this.expression.reduce(this.environment));
  }

  run(): Array<string> {
    const result = new Array<string>();

    while (this.expression.reducible()) {
      result.push(`${this.expression}, ${this.str(this.environment)}`);
      this.step();
    }
    result.push(`${this.expression}, ${this.str(this.environment)}`);
    return result;
  }
  private str(map: Map<String, Expression>): string {
    const res = Array.from(map)
      .map(([key, value]) => `${key}=>${value}`)
      .join(", ");
    return `{${res}}`;
  }
}

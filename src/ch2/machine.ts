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

  run(): Array<Expression> {
    const result = new Array<Expression>();

    while (this.expression.reducible()) {
      result.push(this.expression);
      this.step();
    }
    result.push(this.expression);
    return result;
  }
}

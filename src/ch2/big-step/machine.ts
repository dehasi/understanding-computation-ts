import { Expression, Environment } from "./expressions";
import { Statement } from "./statements";

export class ExpressionMachine {
  private expression: Expression;
  private environment: Map<String, Expression>;

  constructor(expression: Expression, environment: Map<String, Expression>) {
    this.expression = expression;
    this.environment = environment;
  }

  run() {
    return this.expression.evaluate(this.environment);
  }

  private static str(map: Map<String, Expression>): string {
    const res = Array.from(map)
      .map(([key, value]) => `${key}=>${value}`)
      .join(", ");
    return `{${res}}`;
  }
}

export class StatementMachine {
  private statement: Statement;
  private environment: Environment;

  constructor(statement: Statement, environment: Environment) {
    this.statement = statement;
    this.environment = environment;
  }

  run() {
    return this.statement.evaluate(this.environment);
  }
  private str(map: Map<String, Expression>): string {
    const res = Array.from(map)
      .map(([key, value]) => `${key}=>${value}`)
      .join(", ");
    return `{${res}}`;
  }
}

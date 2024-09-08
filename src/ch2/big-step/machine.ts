import { Expression, Environment } from "./expressions";
import { Statement } from "./statements";

export class ExpressionMachine {
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

export class StatementMachine {
  private statement: Statement;
  private environment: Environment;

  constructor(statement: Statement, environment: Environment) {
    this.statement = statement;
    this.environment = environment;
  }

  step(): void {
    [this.statement, this.environment] = this.statement.reduce(
      this.environment,
    );
  }

  run(): Array<string> {
    const result = new Array<string>();

    while (this.statement.reducible()) {
      result.push(`${this.statement}, ${this.str(this.environment)}`);
      this.step();
    }
    result.push(`${this.statement}, ${this.str(this.environment)}`);
    return result;
  }
  private str(map: Map<String, Expression>): string {
    const res = Array.from(map)
      .map(([key, value]) => `${key}=>${value}`)
      .join(", ");
    return `{${res}}`;
  }
}

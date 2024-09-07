import { Environment } from "./commons";
import { Expression } from "./expressions";

class Statement {
  // readonly reduceable: () => boolean;

  reducible(): boolean {
    throw new Error("Method must be implemented.");
  }

  reduce(env: Environment): [Statement, Environment] {
    throw new Error("Method must be implemented.");
  }

  inspect(): string {
    return `${this}`;
  }
}
// Statements
class DoNothing extends Statement {
  equals(other: any): boolean {
    return other instanceof DoNothing;
  }
  reducible(): boolean {
    return false;
  }
  toString(): string {
    return "do-nothing";
  }
}

export const doNothing = new DoNothing();

class Assign extends Statement {
  private readonly name: string;
  private readonly expression: Expression;

  constructor(name: string, expression: Expression) {
    super();
    this.name = name;
    this.expression = expression;
  }

  reduce(env: Environment): [Statement, Environment] {
    if (this.expression.reducible()) {
      return [new Assign(this.name, this.expression.reduce(env)), env];
    } else {
      const newEnv = new Map(env);
      newEnv.set(this.name, this.expression);

      return [doNothing, newEnv];
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `${this.name} = ${this.expression}`;
  }
}

export { Statement, Assign, DoNothing };

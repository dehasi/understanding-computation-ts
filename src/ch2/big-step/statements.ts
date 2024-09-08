import { Expression, FALSE, TRUE, Environment } from "./expressions";

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

export const DO_NOTHING = new DoNothing();

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

      return [DO_NOTHING, newEnv];
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `${this.name} = ${this.expression}`;
  }
}

class If extends Statement {
  private readonly condition: Expression;
  private readonly consequence: Statement;
  private readonly alternative: Statement;

  constructor(
    condition: Expression,
    consequence: Statement,
    alternative: Statement,
  ) {
    super();
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  reduce(env: Environment): [Statement, Environment] {
    if (this.condition.reducible()) {
      return [
        new If(this.condition.reduce(env), this.consequence, this.alternative),
        env,
      ];
    } else {
      if (TRUE.equals(this.condition)) {
        return [this.consequence, env];
      } else if (FALSE.equals(this.condition)) {
        return [this.alternative, env];
      } else {
        throw new Error("Expected Boolean, got " + typeof this.condition);
      }
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `if (${this.condition}) {${this.consequence}} else {${this.alternative}}`;
  }
}

class Sequence extends Statement {
  private readonly first: Statement;
  private readonly second: Statement;

  constructor(first: Statement, second: Statement) {
    super();

    this.first = first;
    this.second = second;
  }

  reduce(env: Environment): [Statement, Environment] {
    if (this.first instanceof DoNothing) {
      return [this.second, env];
    }
    const [reduced, newEnv] = this.first.reduce(env);
    return [new Sequence(reduced, this.second), newEnv];
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `${this.first}; ${this.second}`;
  }
}

// This is my solution. the Books solution is below
class MyWhile extends Statement {
  private readonly condition: Expression;
  private readonly body: Statement;
  private readonly prev?: MyWhile;

  constructor(
    condition: Expression,
    body: Statement,
    prev: MyWhile | undefined = undefined,
  ) {
    super();
    this.condition = condition;
    this.body = body;
    this.prev = prev;
  }

  reduce(env: Environment): [Statement, Environment] {
    if (this.condition.reducible()) {
      return [new MyWhile(this.condition.reduce(env), this.body, this), env];
    }

    if (TRUE.equals(this.condition)) {
      if (this.body.reducible()) {
        const [reduced_body, reduced_env] = this.body.reduce(env);
        return [new MyWhile(this.condition, reduced_body, this), reduced_env];
      }
      // while is finished
      let p: MyWhile | undefined = this;
      while (p.prev) p = p.prev;
      return [p, env];
    } else if (FALSE.equals(this.condition)) {
      return [DO_NOTHING, env];
    } else {
      throw new Error("Expected Boolean, got " + typeof this.condition);
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `while(${this.condition}) {${this.body}}`;
  }
}

class While extends Statement {
  private readonly condition: Expression;
  private readonly body: Statement;

  constructor(condition: Expression, body: Statement) {
    super();
    this.condition = condition;
    this.body = body;
  }

  reduce(env: Environment): [Statement, Environment] {
    return [
      new If(this.condition, new Sequence(this.body, this), DO_NOTHING),
      env,
    ];
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `while (${this.condition}) { ${this.body} }`;
  }
}
export { Statement, Assign, DoNothing, If, Sequence, MyWhile, While };

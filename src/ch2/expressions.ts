class Expression {
  // readonly reduceable: () => boolean;

  reducible(): boolean {
    throw new Error("Method must be implemented.");
  }

  reduce(env: Map<String, Expression>): Expression {
    throw new Error("Method must be implemented.");
  }
}

class Nmbr extends Expression {
  readonly value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  reducible(): boolean {
    return false;
  }

  toString(): string {
    return `${this.value}`;
  }
}

class Boolean extends Expression {
  readonly value: boolean;

  constructor(value: boolean) {
    super();
    this.value = value;
  }

  reducible(): boolean {
    return false;
  }

  toString(): string {
    return `${this.value}`;
  }
}

class LessThan extends Expression {
  private readonly left: Expression;
  private readonly right: Expression;

  constructor(left: Expression, right: Expression) {
    super();
    this.left = left;
    this.right = right;
  }

  reduce(env: Map<String, Expression>): Expression {
    if (this.left.reducible()) {
      return new LessThan(this.left.reduce(env), this.right);
    } else if (this.right.reducible()) {
      return new LessThan(this.left, this.right.reduce(env));
    } else {
      return new Boolean(
        (this.left as Nmbr).value < (this.right as Nmbr).value,
      );
    }
  }
  reducible(): boolean {
    return true;
  }

  toString(): string {
    return `${this.left} < ${this.right}`;
  }
}

class Add extends Expression {
  private readonly left: Expression;
  private readonly right: Expression;

  constructor(left: Expression, right: Expression) {
    super();
    this.left = left;
    this.right = right;
  }

  reduce(env: Map<String, Expression>): Expression {
    if (this.left.reducible()) {
      return new Add(this.left.reduce(env), this.right);
    } else if (this.right.reducible()) {
      return new Add(this.left, this.right.reduce(env));
    } else {
      return new Nmbr((this.left as Nmbr).value + (this.right as Nmbr).value);
    }
  }
  reducible(): boolean {
    return true;
  }

  toString(): string {
    return `${this.left} + ${this.right}`;
  }
}

class Multiply extends Expression {
  private readonly left: Expression;
  private readonly right: Expression;

  constructor(left: Expression, right: Expression) {
    super();
    this.left = left;
    this.right = right;
  }

  reduce(env: Map<String, Expression>): Expression {
    if (this.left.reducible()) {
      return new Multiply(this.left.reduce(env), this.right);
    } else if (this.right.reducible()) {
      return new Multiply(this.left, this.right.reduce(env));
    } else {
      return new Nmbr((this.left as Nmbr).value * (this.right as Nmbr).value);
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `${this.left} * ${this.right}`;
  }
}

class Variable extends Expression {
  readonly name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  reducible(): boolean {
    return true;
  }

  reduce(env: Map<String, Expression>): Expression {
    if (env.has(this.name)) return env.get(this.name) as Expression;
    else throw new Error(`No name ${this.name} in env: ${env}`);
  }

  toString(): string {
    return `${this.name}`;
  }
}
class Machine {
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
export {
  Expression,
  Nmbr,
  Add,
  Multiply,
  Machine,
  Boolean,
  LessThan,
  Variable,
};

class Expression {
  // readonly reduceable: () => boolean;

  reducible(): boolean {
    throw new Error("Method must be implemented.");
  }

  reduce(env: Map<String, Expression>): Expression {
    throw new Error("Method must be implemented.");
  }

  inspect(): string {
    return `${this}`;
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

// Statements
class DoNothing extends Expression {
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

class Assign extends Expression {
  private readonly name: string;
  private readonly expression: Expression;

  constructor(name: string, expression: Expression) {
    super();
    this.name = name;
    this.expression = expression;
  }

  reduce(env: Map<String, Expression>): Expression {
    if (this.expression.reducible()) {
      return new Assign(this.name, this.expression.reduce(env));
    } else {
      const newEnv = new Map(env);
      newEnv.set(this.name, this.expression);
      return new DoNothing();
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `${this.name} = ${this.expression}`;
  }
}

export { Expression, Nmbr, Add, Multiply, Boolean, LessThan, Variable, Assign };

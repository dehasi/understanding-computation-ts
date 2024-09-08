class Expression {
  evaluate(env: Map<String, Expression>): Expression {
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

  evaluate(env: Map<String, Expression>): Expression {
    return this;
  }

  equals(that: any): boolean {
    return that instanceof Nmbr && this.value == that.value;
  }
  toString(): string {
    return `${this.value}`;
  }

  static assertNmbr(x: unknown): asserts x is Nmbr {
    if (x instanceof Nmbr) return;
    else
      throw new Error(
        "Expected Nmbr, got: " + (x?.constructor?.name || typeof x),
      );
  }
}

class Boolean extends Expression {
  readonly value: boolean;

  constructor(value: boolean) {
    super();
    this.value = value;
  }

  evaluate(env: Map<String, Expression>): Expression {
    return this;
  }

  equals(that: any): boolean {
    return that instanceof Boolean && this.value == that.value;
  }

  toString(): string {
    return `${this.value}`;
  }

  static assert(x: unknown): asserts x is Boolean {
    if (x instanceof Boolean) return;
    else
      throw new Error(
        "Expected Boolean, got: " + (x?.constructor?.name || typeof x),
      );
  }
}
export const TRUE = new Boolean(true);
export const FALSE = new Boolean(false);

class LessThan extends Expression {
  private readonly left: Expression;
  private readonly right: Expression;

  constructor(left: Expression, right: Expression) {
    super();
    this.left = left;
    this.right = right;
  }

  evaluate(env: Environment): Expression {
    const left = this.left.evaluate(env);
    const right = this.right.evaluate(env);

    Nmbr.assertNmbr(left);
    Nmbr.assertNmbr(right);
    return new Boolean(left.value < right.value);
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

  evaluate(env: Map<String, Expression>): Expression {
    const left = this.left.evaluate(env);
    const right = this.right.evaluate(env);

    Nmbr.assertNmbr(left);
    Nmbr.assertNmbr(right);
    return new Nmbr(left.value + right.value);
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

  evaluate(env: Map<String, Expression>): Expression {
    const left = this.left.evaluate(env);
    const right = this.right.evaluate(env);

    Nmbr.assertNmbr(left);
    Nmbr.assertNmbr(right);
    return new Nmbr(left.value * right.value);
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

  evaluate(env: Map<String, Expression>): Expression {
    if (env.has(this.name)) return env.get(this.name)!;
    else throw new Error(`No name ${this.name} in env: ${env}`);
  }

  toString(): string {
    return `${this.name}`;
  }
}

export type Environment = Map<String, Expression>;
export { Expression, Nmbr, Add, Multiply, Boolean, LessThan, Variable };

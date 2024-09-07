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

  equals(that: any): boolean {
    return that instanceof Nmbr && this.value == that.value;
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

  equals(that: any): boolean {
    return that instanceof Boolean && this.value == that.value;
  }

  toString(): string {
    return `${this.value}`;
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

export { Expression, Nmbr, Add, Multiply, Boolean, LessThan, Variable };

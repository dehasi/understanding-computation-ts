class Expression {
  // readonly reduceable: () => boolean;

  reducible(): boolean {
    throw new Error("Method must be implemented.");
  }

  reduce(): Expression {
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

  reduce(): Expression {
    if (this.left.reducible()) {
      return new LessThan(this.left.reduce(), this.right);
    } else if (this.right.reducible()) {
      return new LessThan(this.left, this.right.reduce());
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

  reduce(): Expression {
    if (this.left.reducible()) {
      return new Add(this.left.reduce(), this.right);
    } else if (this.right.reducible()) {
      return new Add(this.left, this.right.reduce());
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

  reduce(): Expression {
    if (this.left.reducible()) {
      return new Multiply(this.left.reduce(), this.right);
    } else if (this.right.reducible()) {
      return new Multiply(this.left, this.right.reduce());
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

class Machine {
  private expression: Expression;
  constructor(expression: Expression) {
    this.expression = expression;
  }

  step(): Expression {
    return (this.expression = this.expression.reduce());
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
export { Expression, Nmbr, Add, Multiply, Machine, Boolean, LessThan };

class Expression {
  to_JS(): string {
    throw new Error("Method must be implemented.");
  }
}

class Nmbr extends Expression {
  readonly value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  to_JS(): string {
    return `(e) => {return ${this.value};}`;
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

  to_JS(): string {
    return `(e) => {return ${this.value};}`;
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

  to_JS(): string {
    const left = this.left.to_JS();
    const right = this.right.to_JS();
    return `(e) => {return ((${left})(e)) < ((${right})(e));}`;
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

  to_JS(): string {
    const left = this.left.to_JS();
    const right = this.right.to_JS();
    return `(e) => {return ((${left})(e)) + ((${right})(e));}`;
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

  to_JS(): string {
    const left = this.left.to_JS();
    const right = this.right.to_JS();
    return `(e) => {return ((${left})(e)) * ((${right})(e));}`;
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

  to_JS(): string {
    return `(e) => {return e.get("${this.name}");}`;
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

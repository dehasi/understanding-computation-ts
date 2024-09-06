class Struct {
  // readonly reduceable: () => boolean;

  reducible(): boolean {
    throw new Error("Method must be implemented.");
  }

  reduce(): Struct {
    throw new Error("Method must be implemented.");
  }
}

class Nmbr extends Struct {
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

class Add extends Struct {
  readonly left: Struct;
  readonly right: Struct;

  constructor(left: Struct, right: Struct) {
    super();
    this.left = left;
    this.right = right;
  }

  reduce(): Struct {
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

class Multiply extends Struct {
  readonly left: Struct;
  readonly right: Struct;

  constructor(left: Struct, right: Struct) {
    super();
    this.left = left;
    this.right = right;
  }

  reduce(): Struct {
    if (this.left.reducible()) {
      return new Multiply(this.left.reduce(), this.right);
    } else if (this.right.reducible()) {
      return new Multiply(this.left, this.right.reduce());
    } else {
      return new Nmbr((this.left as Nmbr).value + (this.right as Nmbr).value);
    }
  }
  reducible(): boolean {
    return true;
  }
  toString(): string {
    return `${this.left} * ${this.right}`;
  }
}

export { Struct, Nmbr, Add, Multiply };

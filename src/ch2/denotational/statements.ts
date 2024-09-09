import { Expression, FALSE, TRUE, Environment, Boolean } from "./expressions";

class Statement {
  to_JS(): string {
    throw new Error("Method must be implemented.");
  }
}

class DoNothing extends Statement {
  to_JS(): string {
    return "(e) => { return e; }";
  }
  equals(other: any): boolean {
    return other instanceof DoNothing;
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

  to_JS(): string {
    const exp = this.expression.to_JS();
    return `(e) => { const ne = new Map(e); ne.set("${this.name}", ((${exp})(e))); return ne; }`;
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

  to_JS(): string {
    return `(e) => { if((${this.condition.to_JS()})(e)) return (${this.consequence.to_JS()})(e); else  return (${this.alternative.to_JS()})(e);}`;
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

  to_JS(): string {
    return `(e) => { return (${this.second.to_JS()})((${this.first.to_JS()})(e)); }`;
  }
  toString(): string {
    return `${this.first}; ${this.second}`;
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

  to_JS(): string {
    const cond = this.condition.to_JS();
    const body = this.body.to_JS();
    return `(e) => { while((${cond})(e)) e = (${body})(e); return e; }`;
  }

  toString(): string {
    return `while (${this.condition}) { ${this.body} }`;
  }
}
export { Statement, Assign, DoNothing, If, Sequence, While };

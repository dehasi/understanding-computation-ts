import {
  Add,
  Boolean,
  Environment,
  Expression,
  LessThan,
  Multiply,
  Nmbr,
  Variable,
} from "../../../src/ch2/denotational/expressions";

import {
  Assign,
  If,
  Statement,
  Sequence,
  While,
} from "../../../src/ch2/denotational/statements";

export const env = (
  ...entries: readonly [string, Expression][]
): Environment => {
  return new Map(entries);
};

export const env_js = (
  ...entries: readonly [string, any][]
): Map<string, any> => {
  return new Map(entries);
};

export const b = (n: boolean): Boolean => {
  return new Boolean(n);
};
export const n = (n: number): Nmbr => {
  return new Nmbr(n);
};

export const v = (n: string): Variable => {
  return new Variable(n);
};

export const add = (left: Expression, right: Expression): Add => {
  return new Add(left, right);
};

export const mul = (left: Expression, right: Expression): Multiply => {
  return new Multiply(left, right);
};

export const lt = (left: Expression, right: Expression): LessThan => {
  return new LessThan(left, right);
};

// Statements
export const _if = (cond: Expression, seq: Statement, alt: Statement): If => {
  return new If(cond, seq, alt);
};

export const _while = (cond: Expression, body: Statement): While => {
  return new While(cond, body);
};

export const seq = (first: Statement, second: Statement): Sequence => {
  return new Sequence(first, second);
};

export const assign = (name: string, expression: Expression): Assign => {
  return new Assign(name, expression);
};

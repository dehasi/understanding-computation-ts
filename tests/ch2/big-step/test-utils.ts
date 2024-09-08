import {
  Add,
  Boolean,
  Environment,
  Expression,
  Multiply,
  Nmbr,
  Variable,
} from "../../../src/ch2/big-step/expressions";
import { If, Sequence, Statement } from "../../../src/ch2/big-step/statements";

export const env = (
  ...entries: readonly [string, Expression][]
): Environment => {
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

export const if_ = (cond: Expression, seq: Statement, alt: Statement): If => {
  return new If(cond, seq, alt);
};

export const seq = (first: Statement, second: Statement): Sequence => {
  return new Sequence(first, second);
};

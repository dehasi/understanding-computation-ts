import {
  Add,
  Boolean,
  Environment,
  Expression,
  LessThan,
  Multiply,
  Nmbr,
  Variable,
} from "../../../src/ch2/big-step/expressions";
import { Assign, If, Sequence, Statement } from "../../../src/ch2/big-step/statements";

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

export const _if = (cond: Expression, seq: Statement, alt: Statement): If => {
  return new If(cond, seq, alt);
};

export const seq = (first: Statement, second: Statement): Sequence => {
  return new Sequence(first, second);
};

export const lt = (left: Expression, right: Expression): LessThan => {
  return new LessThan(left, right);
};

export const assign = (name: string, expression: Expression): Assign {
  return new Assign(name, expression)
}

// import { Expression, FALSE, TRUE, Environment, Boolean } from "./expressions";

// class Statement {
//   evaluate(env: Environment): Environment {
//     throw new Error("Method must be implemented.");
//   }
// }

// class DoNothing extends Statement {
//   evaluate(env: Environment): Environment {
//     return env;
//   }
//   equals(other: any): boolean {
//     return other instanceof DoNothing;
//   }

//   toString(): string {
//     return "do-nothing";
//   }
// }

// export const DO_NOTHING = new DoNothing();

// class Assign extends Statement {
//   private readonly name: string;
//   private readonly expression: Expression;

//   constructor(name: string, expression: Expression) {
//     super();
//     this.name = name;
//     this.expression = expression;
//   }

//   evaluate(env: Environment): Environment {
//     const expr = this.expression.evaluate(env);

//     const newEnv = new Map(env);
//     newEnv.set(this.name, expr);

//     return newEnv;
//   }

//   toString(): string {
//     return `${this.name} = ${this.expression}`;
//   }
// }

// class If extends Statement {
//   private readonly condition: Expression;
//   private readonly consequence: Statement;
//   private readonly alternative: Statement;

//   constructor(
//     condition: Expression,
//     consequence: Statement,
//     alternative: Statement,
//   ) {
//     super();
//     this.condition = condition;
//     this.consequence = consequence;
//     this.alternative = alternative;
//   }

//   evaluate(env: Environment): Environment {
//     const condition = this.condition.evaluate(env);
//     Boolean.assert(condition);
//     if (condition.value) {
//       return this.consequence.evaluate(env);
//     } else {
//       return this.alternative.evaluate(env);
//     }
//   }

//   toString(): string {
//     return `if (${this.condition}) {${this.consequence}} else {${this.alternative}}`;
//   }
// }

// class Sequence extends Statement {
//   private readonly first: Statement;
//   private readonly second: Statement;

//   constructor(first: Statement, second: Statement) {
//     super();

//     this.first = first;
//     this.second = second;
//   }

//   evaluate(env: Environment): Environment {
//     return this.second.evaluate(this.first.evaluate(env));
//   }
//   toString(): string {
//     return `${this.first}; ${this.second}`;
//   }
// }

// class While extends Statement {
//   private readonly condition: Expression;
//   private readonly body: Statement;

//   constructor(condition: Expression, body: Statement) {
//     super();
//     this.condition = condition;
//     this.body = body;
//   }

//   evaluate(env: Environment): Environment {
//     const cond = this.condition.evaluate(env);
//     Boolean.assert(cond);

//     if (cond.value) {
//       const new_env = this.body.evaluate(env);
//       return this.evaluate(new_env);
//     } else {
//       return env;
//     }
//   }

//   toString(): string {
//     return `while (${this.condition}) { ${this.body} }`;
//   }
// }
// export { Statement, Assign, DoNothing, If, Sequence, While };

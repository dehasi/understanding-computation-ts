


{
class Nmbr {
  constructor(value) {
    this.value = value;
  }

  evaluate(env) {
    return this;
  }

  toString() {
    return `${this.value}`;
  }

  static assertNmbr(x) {
    if (x instanceof Nmbr) return;
    throw new Error("Expected Nmbr, got: " + (x?.constructor?.name || typeof x));
  }
}

class Boolean  {
  constructor(value) {
    this.value = value;
  }

  evaluate(env) {
    return this;
  }

  equals(that) {
    return that instanceof Boolean && this.value == that.value;
  }

  toString() {
    return `${this.value}`;
  }
}

const TRUE = new Boolean(true);
const FALSE = new Boolean(false);

class LessThan  {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  evaluate(env) {
    const left = this.left.evaluate(env);
    const right = this.right.evaluate(env);

    return new Boolean(left.value < right.value);
  }

  toString() {
    return `${this.left} < ${this.right}`;
  }
}

class Add {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  evaluate(env) {
    const left = this.left.evaluate(env);
    const right = this.right.evaluate(env);

    return new Nmbr(left.value + right.value);
  }

  toString() {
    return `${this.left} + ${this.right}`;
  }
}

class Multiply {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  evaluate(env) {
    const left = this.left.evaluate(env);
    const right = this.right.evaluate(env);

    return new Nmbr(left.value * right.value);
  }

  toString() {
    return `${this.left} * ${this.right}`;
  }
}

class Variable {
  constructor(name) {
    this.name = name;
  }

  evaluate(env) {
    if (env.has(this.name)) return env.get(this.name);
    throw new Error(`No name ${this.name} in env: ${env}`);
  }

  toString() {
    return `${this.name}`;
  }
}


class DoNothing {
  evaluate(env) {
    return env;
  }

  equals(other) {
    return other instanceof DoNothing;
  }

  toString() {
    return "do-nothing";
  }
}

const DO_NOTHING = new DoNothing();

class Assign {
  constructor(name, expression) {
    this.name = name;
    this.expression = expression;
  }

  evaluate(env) {
    const expr = this.expression.evaluate(env);
    const newEnv = new Map(env);
    newEnv.set(this.name, expr);
    return newEnv;
  }

  toString() {
    return `${this.name} = ${this.expression}`;
  }
}

class If  {
  constructor(condition, consequence, alternative) {
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  evaluate(env) {
    const condition = this.condition.evaluate(env);
    Boolean.assert(condition);
    if (condition.value) {
      return this.consequence.evaluate(env);
    } else {
      return this.alternative.evaluate(env);
    }
  }

  toString() {
    return `if (${this.condition}) {${this.consequence}} else {${this.alternative}}`;
  }
}

class Sequence {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }

  evaluate(env) {
    return this.second.evaluate(this.first.evaluate(env));
  }

  toString() {
    return `${this.first}; ${this.second}`;
  }
}

class While {
  constructor(condition, body) {
    this.condition = condition;
    this.body = body;
  }

  evaluate(env) {
    const cond = this.condition.evaluate(env);
    if (cond.value) {
      const new_env = this.body.evaluate(env);
      return this.evaluate(new_env);
    } else {
      return env;
    }
  }

  toString() {
    return `while (${this.condition}) { ${this.body} }`;
  }
}


}
start
  = statement

statement
  = sequence

sequence
  = first:sequenced_statement _ ";"? _ second:sequence {
      return new Sequence(first, second);
    }
  / sequenced_statement

sequenced_statement
  = while_statement / assign_statement / if_statement / do_nothing_statement

while_statement
  = "while" _ "(" _ condition:expression _ ")" _ "{" _ body:statement _ "}" {
      return new While(condition, body);
    }

assign_statement
  = name:[a-z]+ _ "=" _ expr:expression {
      return new Assign(name.join(''), expr);
    }

if_statement
  = "if" _ "(" _ condition:expression _ ")" _ "{" _ consequence:statement _ "}" _ "else" _ "{" _ alternative:statement _ "}" {
      return new If(condition, consequence, alternative);
    }

do_nothing_statement
  = "do-nothing" _ ";"? {
      return new DoNothing();
    }

expression
  = less_than

less_than
  = left:add _ "<" _ right:less_than {
      return new LessThan(left, right);
    }
  / add

add
  = left:multiply _ "+" _ right:add {
      return new Add(left, right);
    }
  / multiply

multiply
  = left:brackets _ "*" _ right:multiply {
      return new Multiply(left, right);
    }
  / brackets

brackets
  = "(" _ expression _ ")" {
      return expression;
    }
  / term

term
  = number / boolean / variable

number
  = [0-9]+ {
      return new Nmbr(parseInt(text(), 10));
    }

boolean
  = ("true" / "false") ![a-z] {
      return new Boolean(text() === "true");
    }

variable
  = [a-z]+ {
      return new Variable(text());
    }

_ "whitespace"
  = [ \t\n\r]*   // Match zero or more whitespace characters

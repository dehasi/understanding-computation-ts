{
  const  { Nmbr, Boolean, TRUE, FALSE, LessThan, Add, Multiply, Variable, DoNothing, DO_NOTHING, Assign, If, Sequence, While } =  require("../../src/ch2/parser/ast-classes")
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
      return DO_NOTHING;
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

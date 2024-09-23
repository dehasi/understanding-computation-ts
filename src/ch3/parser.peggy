{
  const  { Choose, Empty, Literal, Concatenate, Repeat } =  require("../../src/ch3/regular-expressions")
}

start = choose

choose
  = first:concatenate_or_empty "|" rest:choose {
        return new Choose(first, rest)
    }
  / concatenate_or_empty

concatenate_or_empty
  = concatenate 
  / empty


concatenate
  = first:repeat rest:concatenate {
        return Concatenate.new(first, rest);
    }
  / repeat

empty
  = '' {
      return new Empty();
    }

repeat 
  = brackets '*' {
        return new Repeat(brackets);
    } 
  / brackets


brackets
  = "(" choose ")" {
        return choose;
  }
  / literal

literal
  = [a-z]+ {
        return new Literal(text());
    }

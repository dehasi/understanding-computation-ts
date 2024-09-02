

// exp    | term + term
//        | term - term
// term   | factor * factor
//        | factor / factor
//        | factor % factor
// factor | number
//        | (expr)
export const solve  = (expression :string): number => {
    let i = 0
    
    const expr = (): number => {
        let t = term();
        for(let o = op(); '-+'.includes(o); o = op()) {
            i++
            if(o == '+') 
                t += term();
            else if(o == '-')
                t -= term();
            else 
                break
        }
        return t
    }

    const term = (): number => {
        let f = factor();
        for(let o = op();'*/%'.includes(o); o = op()) {
            i++
            switch(o) {
                case '*': 
                    f *= factor()
                    break
                case '/': 
                    f = (f / factor())|0
                    break
                case '%': 
                    f %= factor()
                    break
                default: 
                    return f
            }
        }
        return f
    }
        
    const factor = ():number => {
        if(expression[i] == '(') {
            i++
            const f = expr()
            if(expression[i] == ')') i++
            else throw new Error(`no right paren at ${i}`);
            return f
        }
        const start = i;
        while('0' <= expression[i] && expression[i] <= '9' ) 
            i++

        return +expression.substring(start, i)
    }

    const op = (): string =>{
        while(expression[i] == ' ' || expression[i] == '\t')
            i++
        return expression[i]
    }

    return expr()
}
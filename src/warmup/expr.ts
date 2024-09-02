

// exp    | term + term
//        | term - term
// term   | factor * factor
//        | factor / factor
//        | factor % factor
// factor | number
//        | (expr)
export const expr = (expression :string, i:number=0): number => {
    const factor = ():number => {
        const start = i;
        while('0' <= expression[i] && expression[i] <= '9' ) 
            i++

        return +expression.substring(start, i)
    }
    const term = (): number => {
        let f = factor();
        let o = op()
        while('*/%'.includes(o)) {
            i++
            switch(o) {
                case '*': 
                    f *= factor()
                    break
                case '/': 
                    f = f / factor()
                    break
                case '%': 
                    f = f % factor()
                    break
                default: 
                    return f
            }
            o = op()
        }
        return f
    }
    const op = (): string =>{
        while(expression[i] == ' ' || expression[i] == '\t')
            i++
        return expression[i]
    }
    
    let t = term();
    let v = op()
    while('-+'.includes(v)) {
        i++
        if(v == '+') 
            t += term();
        else if(v == '-')
            t -= term();
        else 
            break
        v = op()
    }
    return t
}
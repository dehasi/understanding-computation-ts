

// exp    | term + term
//        | term - term
// term   | factor * factor
//        | factor / factor
//        | factor % factor
// factor | number
//        | (expr)
export const expr = (expression :string, i:number=0): number => {
    const term = (): number => {
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
    
    let t = term();
    let v = op()
    while(v) {
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
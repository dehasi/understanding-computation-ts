import { expr } from "../../src/warmup/expr";

describe('Test simple expressions', () => {
    let expressions: Map<string, number> = new Map([
        ['0', 0],
        ['2+3', 5],
        ['2+2*2', 6],
        ['2+4/2', 4],
        ['2+5%2', 3],
        ['2+5%2asdsad', 3],
        ['2-3', -1]
    ]);

    for(let [expression,result] of expressions) {
        test(expression, () => {
            expect(expr(expression)).toEqual(result)
        })
    }
})

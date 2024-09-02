import { expr } from "../../src/warmup/expr";

describe('Test', () => {
    let expressions: Map<string, number> = new Map([
        ['0', 0],
        ['2+3', 5],
        ['2-3', -1]
    ]);

    for(let [expression,result] of expressions) {
        test(expression, () => {
            expect(expr(expression)).toEqual(result)
        })
    }
})

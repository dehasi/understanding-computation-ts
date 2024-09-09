import { solve } from "../../src/warmup/expr";

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
            expect(solve(expression)).toEqual(result)
        })
    }
})


describe('Test expressions with breakets', () => {
    let expressions: Map<string, number> = new Map([
        ['(0)', 0],
        ['(2+2)*2', 8],
        ['15/(2+3)', 3]
    ]);

    for(let [expression,result] of expressions) {
        test(expression, () => {
            expect(solve(expression)).toEqual(result)
        })
    }
})

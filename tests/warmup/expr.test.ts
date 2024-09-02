import { expr } from "../../src/warmup/expr";

describe('Test', () => {
    test('0', () => {
        expect(expr('0')).toEqual(0)
    })   
    test('2+3', () => {
        expect(expr('2+3')).toEqual(5)
    })
    test('2-3', () => {
        expect(expr('2-3')).toEqual(-1)
    })
})

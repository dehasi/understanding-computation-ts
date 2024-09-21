import { Empty, Literal } from "../../src/ch3/regular-expressions"

describe('Regular Expressions', () => {

    test('Empty', () => {
        const nfa_design = new Empty().to_nfa_design()

        expect(nfa_design.accepts('')).toEqual(true);
        expect(nfa_design.accepts('a')).toEqual(false);
    })

    test('Literal', () => {
        const nfa_design = new Literal('a').to_nfa_design()

        expect(nfa_design.accepts('')).toEqual(false);
        expect(nfa_design.accepts('a')).toEqual(true);
        expect(nfa_design.accepts('b')).toEqual(false);
    })

    test('Pattern', () => {
        expect(new Empty().matches('a')).toEqual(false);
        expect(new Literal('a').matches('a')).toEqual(true);
    })
})

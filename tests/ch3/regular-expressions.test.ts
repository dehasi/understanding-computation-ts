import { Choose, Concatenate, Empty, Literal, Repeat } from "../../src/ch3/regular-expressions"

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


    test('Concatenate', () => {
        const pattern = new Concatenate(
            new Literal('a'), new Literal('b')
        );

        expect(pattern.matches('a')).toEqual(false);
        expect(pattern.matches('ab')).toEqual(true);
        expect(pattern.matches('abc')).toEqual(false);
    })

    test('Choose', () => {
        const pattern = new Choose(
            new Literal('a'), new Literal('b')
        );

        expect(pattern.matches('a')).toEqual(true);
        expect(pattern.matches('b')).toEqual(true);
        expect(pattern.matches('c')).toEqual(false);
        expect(pattern.matches('ab')).toEqual(false);
        expect(pattern.matches('abc')).toEqual(false);
    })

    test('Repeat', () => {
        const pattern = new Repeat(
            new Literal('a')
        );

        expect(pattern.matches('')).toEqual(true);
        expect(pattern.matches('a')).toEqual(true);
        expect(pattern.matches('aa')).toEqual(true);
        expect(pattern.matches('aaa')).toEqual(true);
        expect(pattern.matches('b')).toEqual(false);
        expect(pattern.matches('ab')).toEqual(false);
        expect(pattern.matches('abc')).toEqual(false);
    })

    test('Repeat: Concatenate', () => {
        const pattern = new Repeat(
            new Concatenate(new Literal('a'),
                new Choose(new Empty(), new Literal('b')))
        );

        expect(pattern.toString()).toEqual('(a(|b))*')
        expect(pattern.matches('')).toEqual(true);
        expect(pattern.matches('a')).toEqual(true);
        expect(pattern.matches('ab')).toEqual(true);
        expect(pattern.matches('aba')).toEqual(true);
        expect(pattern.matches('abab')).toEqual(true);
        expect(pattern.matches('abaab')).toEqual(true);
        expect(pattern.matches('abba')).toEqual(false);
    })
})

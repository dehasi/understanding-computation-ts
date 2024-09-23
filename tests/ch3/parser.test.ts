import { parse } from "../../lib/ch3/parser";
describe('Parser', () => {
    test('a|b', () => {
        const pattern = parse('a|b');

        expect(pattern.toString()).toEqual('a|b');


        expect(pattern.matches('a')).toEqual(true);
        expect(pattern.matches('b')).toEqual(true);
        expect(pattern.matches('c')).toEqual(false);
        expect(pattern.matches('ab')).toEqual(false);
        expect(pattern.matches('abc')).toEqual(false);
    })

    test('(a|b)*', () => {
        const pattern = parse('(a|b)*');

        expect(pattern.toString()).toEqual('(a|b)*');


        expect(pattern.matches('a')).toEqual(true);
        expect(pattern.matches('b')).toEqual(true);
        expect(pattern.matches('c')).toEqual(false);
        expect(pattern.matches('ab')).toEqual(true);
        expect(pattern.matches('abc')).toEqual(false);
    })
})
import { FARule } from "../../src/ch3/common"
import { NFA, NFADesign, NFARulebook } from "../../src/ch3/nondeterministic-finite-automata"
import { set } from "./test-utils"

describe('NFA', () => {
    const rulebook = new NFARulebook([
        new FARule(1, 'a', 1), new FARule(1, 'b', 1), new FARule(1, 'b', 2),
        new FARule(2, 'a', 3), new FARule(2, 'b', 3),
        new FARule(3, 'a', 4), new FARule(3, 'b', 4),
    ])

    test('rulebook', () => {
        expect(rulebook.next_states(set(1), 'b')).toEqual(set(1, 2));

        expect(rulebook.next_states(set(1, 2), 'a')).toEqual(set(1, 3));

        expect(rulebook.next_states(set(1, 3), 'b')).toEqual(set(1, 2, 4));
    })

    test('read_charactter', () => {
        const nfa = new NFA(set(1), [4], rulebook);
        expect(nfa.accepting()).toEqual(false);


        nfa.read_character('b');
        expect(nfa.accepting()).toEqual(false);

        nfa.read_character('a');
        expect(nfa.accepting()).toEqual(false);

        nfa.read_character('b');
        expect(nfa.accepting()).toEqual(true);
    })

    test('read_string', () => {
        const nfa = new NFA(set(1), [4], rulebook);
        expect(nfa.accepting()).toEqual(false);

        nfa.read_string('bbbbb');
        expect(nfa.accepting()).toEqual(true);
    })

    test('NFADesign', () => {
        const nfa_design = new NFADesign(set(1), [4], rulebook);

        expect(nfa_design.accepts('bab')).toEqual(true);
    })
})

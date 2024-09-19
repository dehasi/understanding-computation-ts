import { DFA, DFARulebook, FARule } from "../../src/ch3/deterministic-finite-automata"

describe('DFA', () => {
    const rulebook = new DFARulebook([
        new FARule(1, 'a', 2), new FARule(1, 'b', 1),
        new FARule(2, 'a', 2), new FARule(2, 'b', 3),
        new FARule(3, 'a', 3), new FARule(3, 'b', 3),
    ])
    test('rulebook', () => {
        expect(rulebook.next_state(1, 'a')).toEqual(2)
        expect(rulebook.next_state(1, 'b')).toEqual(1)
        expect(rulebook.next_state(2, 'b')).toEqual(3)
    });

    test('accepting', () => {
        expect(new DFA(1, [1, 3], rulebook).accepting()).toEqual(true);
        expect(new DFA(1, [3], rulebook).accepting()).toEqual(false);
    })
    
    test('accepting', () => {
        const dfa = new DFA(1, [3], rulebook);
        expect(dfa.accepting()).toEqual(false);
        
        dfa.read_charactter('b');
        expect(dfa.accepting()).toEqual(false);

        dfa.read_charactter('a');
        dfa.read_charactter('a');
        dfa.read_charactter('a');
        expect(dfa.accepting()).toEqual(false);

        dfa.read_charactter('b');
        expect(dfa.accepting()).toEqual(true);
    })
})

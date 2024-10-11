import { FARule, NFADesign, NFARulebook, NIL, NFASimulation } from "../../src/ch3/nfa-dfa-converter"

import { set } from "./test-utils"


describe('Converter', () => {
    const rulebook = new NFARulebook([
        new FARule(1, 'a', 1), new FARule(1, 'a', 2), new FARule(1, NIL, 2),
        new FARule(2, 'b', 3),
        new FARule(3, 'b', 1), new FARule(3, NIL, 2),
    ])

    test('rulebook', () => {
        expect(rulebook.alphabet()).toEqual(set(NIL, 'a', 'b'));
    })

    test('NFADesign: to_nfa', () => {
        const nfa_design = new NFADesign(1, [3], rulebook);

        expect(nfa_design.to_nfa()._current_states()).toEqual(set(1, 2));
        expect(nfa_design.to_nfa(set(2))._current_states()).toEqual(set(2));
        expect(nfa_design.to_nfa(set(3))._current_states()).toEqual(set(2, 3));
    })


    test('NFA: read_character -> _current_states', () => {
        const nfa_design = new NFADesign(1, [3], rulebook);
        const nfa = nfa_design.to_nfa(set(2, 3))
        nfa.read_character('b')
        expect(nfa._current_states()).toEqual(set(1, 2, 3));
    })

    test('NFASimulation: next_state', () => {
        const nfa_design = new NFADesign(1, [3], rulebook);
        const simulation = new NFASimulation(nfa_design);

        expect(simulation.next_state(set(1, 2), 'a')).toEqual(set(1, 2));
        expect(simulation.next_state(set(1, 2), 'b')).toEqual(set(3, 2));
        expect(simulation.next_state(set(3, 2), 'b')).toEqual(set(3, 2, 1));
        expect(simulation.next_state(set(1, 3, 2), 'b')).toEqual(set(3, 2, 1));
        expect(simulation.next_state(set(1, 3, 2), 'a')).toEqual(set(1, 2));
    })

    test('NFASimulation: rulebook', () => {
        const nfa_design = new NFADesign(1, [3], rulebook);
        const simulation = new NFASimulation(nfa_design);

        expect([...simulation.rules_for(set(1, 2))].map(rule => rule.toString())).toEqual([
            "#<FARule {1, 2} --a--> {1, 2}>",
            "#<FARule {1, 2} ----> {2}>",
            "#<FARule {1, 2} --b--> {3, 2}>"])

        expect([...simulation.rules_for(set(3, 2))].map(rule => rule.toString())).toEqual([
            "#<FARule {3, 2} --a--> {}>",
            "#<FARule {3, 2} ----> {2}>",
            "#<FARule {3, 2} --b--> {1, 3, 2}>"])
    })

    test('NFASimulation: discover', () => {

        const nfa_design = new NFADesign(1, [3], rulebook);
        const start_state = nfa_design.to_nfa()._current_states();
        expect(start_state).toEqual(set(1, 2));

        const simulation = new NFASimulation(nfa_design);

        const [states, rules] = simulation.discover_states_and_rules(start_state);
        console.debug(states)
        console.debug(rules)
    })
})
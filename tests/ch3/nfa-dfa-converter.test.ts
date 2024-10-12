import { FARule, NFADesign, NFARulebook, NIL, NFASimulation } from "../../src/ch3/nfa-dfa-converter"

import { set } from "./test-utils"


describe('Converter', () => {
    const rulebook = new NFARulebook([
        FARule.new(1, 'a', 1), FARule.new(1, 'a', 2), FARule.new(1, NIL, 2),
        FARule.new(2, 'b', 3),
        FARule.new(3, 'b', 1), FARule.new(3, NIL, 2),
    ])
    const nfa_design = new NFADesign('1', ['3'], rulebook);


    test('NFADesign: to_nfa', () => {
        expect(nfa_design.to_nfa()._current_states()).toEqual(set('1', '2'));
        expect(nfa_design.to_nfa(set('2'))._current_states()).toEqual(set('2'));
        expect(nfa_design.to_nfa(set('3'))._current_states()).toEqual(set('2', '3'));
    })


    test('NFA: read_character -> _current_states', () => {
        const nfa = nfa_design.to_nfa(set('2', '3'))
        expect(nfa._current_states()).toEqual(set('2', '3'));
        nfa.read_character('b')
        expect(nfa._current_states()).toEqual(set('1', '2', '3'));
    })

    test('NFASimulation: next_state', () => {
        const simulation = new NFASimulation(nfa_design);

        expect(simulation.next_state(set('1', '2'), 'a')).toEqual(set('1', '2'));
        expect(simulation.next_state(set('1', '2'), 'b')).toEqual(set('3', '2'));
        expect(simulation.next_state(set('3', '2'), 'b')).toEqual(set('3', '2', '1'));
        expect(simulation.next_state(set('1', '3', '2'), 'b')).toEqual(set('3', '2', '1'));
        expect(simulation.next_state(set('1', '3', '2'), 'a')).toEqual(set('1', '2'));
    })

    test('rulebook', () => {
        expect(rulebook.alphabet()).toEqual(set('a', 'b'));
    })

    test('NFASimulation: rulebook', () => {
        const simulation = new NFASimulation(nfa_design);

        expect([...simulation.rules_for(set('1', '2'))].map(rule => rule.toString())).toEqual([
            "#<FARule {1, 2} --a--> {1, 2}>",
            "#<FARule {1, 2} --b--> {2, 3}>"])

        expect([...simulation.rules_for(set('3', '2'))].map(rule => rule.toString())).toEqual([
            "#<FARule {2, 3} --a--> {}>",
            "#<FARule {2, 3} --b--> {1, 2, 3}>"])
    })

    test('NFASimulation: discover', () => {
        const start_state = nfa_design.to_nfa()._current_states();
        expect(start_state).toEqual(set('1', '2'));

        const simulation = new NFASimulation(nfa_design);

        const [states, rules] = simulation.discover_states_and_rules(start_state);
        // FIX: different values in the book
        expect(states).toContain('{1, 2}')
        expect(states).toContain('{2, 3}')
        expect(states).toContain('{}')
        expect(states).toContain('{1, 2, 3}')

        console.debug(states)
        console.debug(rules)
    })

    test('NFASimulation: accepting', () => {
        expect(nfa_design.to_nfa(set('1', '2')).accepting()).toBeFalsy()
        expect(nfa_design.to_nfa(set('2', '3')).accepting()).toBeTruthy()
    })

    test('NFASimulation: to_dfa_design', () => {
        const simulation = new NFASimulation(nfa_design);

        const dfa_design = simulation.to_dfa_design();

        expect(dfa_design.accepts('aab')).toBeTruthy()
        expect(dfa_design.accepts('bbbabb')).toBeTruthy()
        expect(dfa_design.accepts('aaa')).toBeFalsy()
    })
})
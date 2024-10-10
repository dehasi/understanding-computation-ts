import { FARule } from "../../src/ch3/common"
import { NFADesign, NFARulebook, NIL } from "../../src/ch3/nfa-dfa-converter"

import { set } from "./test-utils"


describe('Converter', () => {
    const rulebook = new NFARulebook([
        new FARule(1, 'a', 1), new FARule(1, 'a', 2), new FARule(1, NIL, 2),
        new FARule(2, 'b', 3),
        new FARule(3, 'b', 1), new FARule(3, NIL, 2),
    ])


    test('NFADesign', () => {
        const nfa_design = new NFADesign(1, [3], rulebook);

        expect(nfa_design.to_nfa()._current_states()).toEqual(set(1, 2));
        expect(nfa_design.to_nfa(set(2))._current_states()).toEqual(set( 2));
        expect(nfa_design.to_nfa(set(3))._current_states()).toEqual(set(3,2));
    })

})
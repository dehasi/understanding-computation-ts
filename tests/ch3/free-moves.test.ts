import { FARule } from "../../src/ch3/common"
import { NFA, NFADesign, NFARulebook, NIL } from "../../src/ch3/free-moves"

import { set } from "./test-utils"


describe('Free Moves', () => {
    const rulebook = new NFARulebook([
        new FARule(1, NIL, 2), new FARule(1, NIL, 4),
        new FARule(2, 'a', 3),
        new FARule(3, 'a', 2),
        new FARule(4, 'a', 5),
        new FARule(5, 'a', 6),
        new FARule(6, 'a', 4),
    ])

    test('rulebook', () => {
        expect(rulebook.next_states(set(1), NIL)).toEqual(set(2, 4));
    })

    test('follow_free_moves', () => {
        expect(rulebook.follow_free_moves(set(1))).toEqual(set(1, 2, 4));
    })

})
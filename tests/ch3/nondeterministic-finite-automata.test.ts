import { FARule } from "../../src/ch3/common"
import { NFARulebook } from "../../src/ch3/nondeterministic-finite-automata"
import { set } from "./test-utils"

describe('NFA', () => {
    const rulebook = new NFARulebook([
        new FARule(1, 'a', 2), new FARule(1, 'b', 1), new FARule(1, 'b', 2),
        new FARule(2, 'a', 3), new FARule(2, 'b', 3),
        new FARule(3, 'a', 4), new FARule(3, 'b', 4),
    ])

    test('rulebook', () => {
        expect(rulebook.next_states(set(1), 'b')).toEqual(set(1, 2))
    })
})
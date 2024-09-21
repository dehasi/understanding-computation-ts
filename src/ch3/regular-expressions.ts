
import { character, assert, required, intersection, is_subset, union } from "./common";

export type state = Object;

export class FARule {
    state: state;
    character: character;
    next_state: state;

    constructor(state: state, character: character, next_state: state) {
        assert(character.length < 2, `expected only 0 or 1 length, but found: ${character.length} for character: ${character}`);
        this.state = state;
        this.character = character;
        this.next_state = next_state;
    }

    applies_to(state: state, character: character): boolean {
        return this.state === state && this.character === character
    }

    follow(): state {
        return this.next_state;
    }

    toString(): string {
        return `#<FARule ${this.state} --${this.character}--> ${this.next_state}>`;
    }
}

export const NIL = '';

export class NFARulebook {
    rules: ReadonlyArray<FARule>

    constructor(rules: ReadonlyArray<FARule>) {
        this.rules = rules;
    }

    next_states(states: Set<state>, character: character): Set<state> {
        return new Set([...states].flatMap(state => this.follow_rules_for(state, character)));
    }

    follow_free_moves(states: Set<state>): Set<state> {
        const more_states = this.next_states(states, NIL);
        if (is_subset(more_states, states)) {
            return states
        } else {
            return this.follow_free_moves(union(states, more_states));
        }
    }


    follow_rules_for(state: state, character: character): ReadonlyArray<state> {
        return this.rules_for(state, character).map(x => x.follow())
    }

    rules_for(state: state, character: character): ReadonlyArray<FARule> {
        return required(
            this.rules.filter(rule => rule.applies_to(state, character)),
            `FARule not found for (${state}, ${character})`
        );
    }
}

export class NFA {
    current_states: Set<state>;
    accept_states: ReadonlyArray<state>;
    rulebook: NFARulebook;

    constructor(current_state: Set<state>, accept_states: ReadonlyArray<state>, rulebook: NFARulebook) {
        this.current_states = current_state;
        this.accept_states = accept_states;
        this.rulebook = rulebook;
    }

    accepting(): boolean {
        return intersection(this._current_states(), new Set(this.accept_states)).size > 0;
    }

    _current_states(): Set<state> {
        return this.rulebook.follow_free_moves(this.current_states)
    }

    read_character(character: character): void {
        this.current_states = this.rulebook.next_states(this._current_states(), character);
    }

    read_string(string: string): void {
        for (const ch of string) {
            this.read_character(ch)
        }
    }
}

export class NFADesign {
    start_state: state;
    accept_states: ReadonlyArray<state>;
    rulebook: NFARulebook;

    constructor(start_state: state, accept_states: ReadonlyArray<state>, rulebook: NFARulebook) {
        this.start_state = start_state;
        this.accept_states = accept_states;
        this.rulebook = rulebook;
    }

    to_nfa(): NFA {
        return new NFA(new Set([this.start_state]), this.accept_states, this.rulebook);
    }

    accepts(string: string): boolean {
        const dfa = this.to_nfa();
        dfa.read_string(string)
        return dfa.accepting();
    }
}

let x = 0;
const new_state = (): state => {
    x = x + 1;
    return x;
}

export class Pattern {
    to_nfa_design(): NFADesign {
        throw new Error(`to_nfa_design is not implemented for ${this.constructor.name}`);
    }

    matches(string: string): boolean {
        return this.to_nfa_design().accepts(string);
    }

    toStirng(): string {
        throw new Error("Method not implemented.");
    }
}

export class Empty extends Pattern {
    to_nfa_design(): NFADesign {
        const start_state = new_state();
        const accept_states = [start_state];
        const rulebook = new NFARulebook([]);

        return new NFADesign(start_state, accept_states, rulebook);
    }

    toString(): string {
        return ''
    }
}

export class Literal extends Pattern {
    character: character;

    constructor(character: character) {
        super();
        this.character = character

    }
    to_nfa_design(): NFADesign {
        const start_state = new_state();
        const accept_state = new_state();
        const rule = new FARule(start_state, this.character, accept_state);
        const rulebook = new NFARulebook([rule]);

        return new NFADesign(start_state, [accept_state], rulebook);
    }

    toString(): string {
        return this.character
    }
}

export class Concatenate extends Pattern {
    private first: Pattern;
    private second: Pattern;
    constructor(first: Pattern, second: Pattern) {
        super();
        this.first = first;
        this.second = second;
    }

    to_nfa_design(): NFADesign {
        const first_nfa_design = this.first.to_nfa_design();
        const second_nfa_design = this.second.to_nfa_design();


        const start_state = first_nfa_design.start_state
        const accept_states = second_nfa_design.accept_states;
        const rules = [...first_nfa_design.rulebook.rules, ...second_nfa_design.rulebook.rules]
        // Translate first nfa accept states to free moves
        //
        const extra_rules = first_nfa_design.accept_states.map(state => {
            return new FARule(state, NIL, second_nfa_design.start_state);
        })
        const rulebook = new NFARulebook([...rules, ...extra_rules]);

        return new NFADesign(start_state, accept_states, rulebook);
    }

    toString(): string {
        return this.first.toStirng() + this.second.toStirng();
    }
}

export class Choose extends Pattern {
    private first: Pattern;
    private second: Pattern;
    constructor(first: Pattern, second: Pattern) {
        super();
        this.first = first;
        this.second = second;
    }

    to_nfa_design(): NFADesign {
        const first_nfa_design = this.first.to_nfa_design();
        const second_nfa_design = this.second.to_nfa_design();


        const start_state = new_state()
        const accept_states = [...first_nfa_design.accept_states, ...second_nfa_design.accept_states]
        const rules = [...first_nfa_design.rulebook.rules, ...second_nfa_design.rulebook.rules]

        const extra_rules = [first_nfa_design, second_nfa_design].map(nfa_design => {
            return new FARule(start_state, NIL, nfa_design.start_state)
        })
        const rulebook = new NFARulebook([...rules, ...extra_rules]);

        return new NFADesign(start_state, accept_states, rulebook);
    }

    toString(): string {
        return this.first.toStirng() + "|" + this.second.toStirng();
    }
}
import { required, intersection, is_subset, union, assert } from "./common";

export const NIL = '';

export type state = any;
export type character = string
// 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' |
// 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' |
// 'w' | 'x' | 'y' | 'z';

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
        return `#<FARule ${this.pretty(this.state)} --${this.character}--> ${this.pretty(this.next_state)}>`;
    }
    private pretty(state: any): string {
        if (state instanceof Set) {
            return `{${[...state].join(', ')}}`;
        } else if (Array.isArray(state)) {
            return `[${state.join(', ')}]`;
        } else {
            return `state`;
        }
    }
}

export class NFARulebook {
    private rules: ReadonlyArray<FARule>

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


    follow_rules_for(state: state, character: character): Array<Set<state>> {
        return this.rules_for(state, character).map(x => x.follow())
    }

    rules_for(state: state, character: character): ReadonlyArray<FARule> {
        return required(
            this.rules.filter(rule => rule.applies_to(state, character)),
            `FARule not found for (${state}, ${character})`
        );
    }

    alphabet(): ReadonlySet<character> {
        return new Set(this.rules.map(rule => rule.character))
    }
}

export class NFA {
    private current_states: Set<state>;
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

    to_nfa(current_states = new Set([this.start_state])): NFA {
        return new NFA(current_states, this.accept_states, this.rulebook);
    }

    accepts(string: string): boolean {
        const dfa = this.to_nfa();
        dfa.read_string(string)
        return dfa.accepting();
    }
}

export class NFASimulation {
    private nfa_design: NFADesign

    constructor(nfa_design: NFADesign) {
        this.nfa_design = nfa_design;
    }

    next_state(state: Set<state>, character: character): Set<state> {
        const nfa = this.nfa_design.to_nfa(state);
        nfa.read_character(character);
        return nfa._current_states()
    }

    rules_for(state: Set<state>): Set<FARule> {
        return new Set([...this.nfa_design.rulebook.alphabet()].map(characheter => new FARule(state, characheter, this.next_state(state, characheter))))

    }
}
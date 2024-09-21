
import { character, assert, required, intersection } from "./common";

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

export class NFARulebook {
    private rules: ReadonlyArray<FARule>

    constructor(rules: ReadonlyArray<FARule>) {
        this.rules = rules;
    }

    next_states(states: Set<state>, character: character): Set<state> {
        return new Set([...states].flatMap(state => this.follow_rules_for(state, character)));
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
        return intersection(this.current_states, new Set(this.accept_states)).size > 0;
    }

    read_character(character: character): void {
        this.current_states = this.rulebook.next_states(this.current_states, character);
    }

    read_string(string: string): void {
        for (const ch of string) {
            this.read_character(ch)
        }
    }
}

export class NFADesign {
    start_states: Set<state>;
    accept_states: ReadonlyArray<state>;
    rulebook: NFARulebook;

    constructor(start_states: Set<state>, accept_states: ReadonlyArray<state>, rulebook: NFARulebook) {
        this.start_states = start_states;
        this.accept_states = accept_states;
        this.rulebook = rulebook;
    }

    to_nfa(): NFA {
        return new NFA(this.start_states, this.accept_states, this.rulebook);
    }

    accepts(string: string): boolean {
        const dfa = this.to_nfa();
        dfa.read_string(string)
        return dfa.accepting();
    }
}


export class Pattern {
    to_nfa_design(): NFADesign {
        throw new Error(`to_nfa_design is not implemented for ${this.constructor.name}`);
    }
}

export class Empty extends Pattern {
    to_nfa_design(): NFADesign {
        const start_state = new Object();
        const accept_states = [start_state];
        const rulebook = new NFARulebook([]);

        return new NFADesign(new Set([start_state]), accept_states, rulebook);
    }
}

export class Literal extends Pattern {
    character: character;

    constructor(character: character) {
        super();
        this.character = character

    }
    to_nfa_design(): NFADesign {
        const start_state = new Object();
        const accept_state = new Object();
        const rule = new FARule(start_state, this.character, accept_state);
        const rulebook = new NFARulebook([rule]);

        return new NFADesign(new Set([start_state]), [accept_state], rulebook);
    }
}

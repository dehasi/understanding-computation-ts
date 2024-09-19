import { FARule, state, character, required } from "./common";

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
    current_state: state;
    accept_states: ReadonlyArray<state>;
    rulebook: NFARulebook;

    constructor(current_state: state, accept_states: ReadonlyArray<state>, rulebook: NFARulebook) {
        this.current_state = current_state;
        this.accept_states = accept_states;
        this.rulebook = rulebook;
    }

    accepting(): boolean {
        return this.accept_states.includes(this.current_state);
    }

    read_character(character: character): void {
        // this.current_state = this.rulebook.next_states(this.current_states, character);
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

    to_dfa(): NFA {
        return new NFA(this.start_state, this.accept_states, this.rulebook);
    }

    accepts(string: string): boolean {
        const dfa = this.to_dfa();
        dfa.read_string(string)
        return dfa.accepting();
    }
}
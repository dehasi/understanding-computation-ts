import { state, FARule, character, required, intersection, is_subset, union } from "./common";

export const NIL = '';

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


    follow_rules_for(state: state, character: character): ReadonlyArray<state> {
        return this.rules_for(state, character).map(x => x.follow())
    }

    rules_for(state: state, character: character): ReadonlyArray<FARule> {
        return required(
            this.rules.filter(rule => rule.applies_to(state, character)),
            `FARule not found for (${state}, ${character})`
        );
    }

    alphabet(): ReadonlyArray<string> {
        return 'abcdefghijklmnopqrstuvwxyz'.split('');
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

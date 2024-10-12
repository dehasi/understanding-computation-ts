import { FARule, state, character, required } from "./common";


export class DFARulebook {
    private rules: ReadonlyArray<FARule>

    constructor(rules: ReadonlyArray<FARule>) {
        this.rules = rules;
    }

    next_state(state: state, character: character): state {
        return this.rule_for(state, character).follow();
    }

    rule_for(state: state, character: character): FARule {
        return required(
            this.rules.find(rule => rule.applies_to(state, character)),
            `FARule not found for (${state}, ${character})`
        );
    }
}

export class DFA {
    current_state: state;
    accept_states: ReadonlyArray<state>;
    rulebook: DFARulebook;

    constructor(current_state: state, accept_states: ReadonlyArray<state>, rulebook: DFARulebook) {
        this.current_state = current_state;
        this.accept_states = accept_states;
        this.rulebook = rulebook;
    }

    accepting(): boolean {
        return this.accept_states.includes(this.current_state);
    }

    read_character(character: character): void {
        this.current_state = this.rulebook.next_state(this.current_state, character);
    }

    read_string(string: string): void {
        for (const ch of string) {
            this.read_character(ch)
        }
    }
}

export class DFADesign {
    start_state: state;
    accept_states: ReadonlyArray<state>;
    rulebook: DFARulebook;

    constructor(start_state: state, accept_states: ReadonlyArray<state>, rulebook: DFARulebook) {
        this.start_state = start_state;
        this.accept_states = accept_states;
        this.rulebook = rulebook;
    }

    to_dfa(): DFA {
        return new DFA(this.start_state, this.accept_states, this.rulebook);
    }

    accepts(string: string): boolean {
        const dfa = this.to_dfa();
        dfa.read_string(string)
        return dfa.accepting();
    }
}
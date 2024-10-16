import { required, intersection, is_subset, union } from "./common";

export const NIL = 'none';

export type state = string;
export type character = string
// 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' |
// 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' |
// 'w' | 'x' | 'y' | 'z';

export class FARule {
    state: state;
    character: character;
    next_state: state;

    static new(state: number, characheter: character, next_state: number): FARule {
        return new FARule(state + '', characheter, next_state + '');
    }

    constructor(state: state, character: character, next_state: state) {
        this.state = state;
        this.character = character;
        this.next_state = next_state;
    }

    applies_to(state: state, character: character): boolean {
        return this.state === state && this.character === character
    }

    private eq<T>(setA: Set<T>, setB: Set<T>): boolean {
        return setA.size === setB.size && [...setA].every(item => setB.has(item));
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
            return `${state}`;
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


    follow_rules_for(state: state, character: character): ReadonlyArray<state> {
        return this.rules_for(state, character).map(x => x.follow())
    }

    rules_for(state: state, character: character): ReadonlyArray<FARule> {
        return required(
            this.rules.filter(rule => rule.applies_to(state, character)),
            `FARule not found for (${state}, ${character})`
        );
    }

    alphabet(): ReadonlySet<character> {
        // As TS dosen't have 'compact' method, we return NIL "manually"
        return new Set(this.rules.map(rule => rule.character).filter(character => character !== NIL))
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
        return new Set([...this.nfa_design.rulebook.alphabet()].map(characheter =>
            new FARule(this.combined(state), characheter, this.combined(this.next_state(state, characheter)))))
    }


    discover_states_and_rules(states: Set<state>): [Set<state>, Set<FARule>] {
        const rules = [...states].flatMap(state => [...this.rules_for(new Set(this.uncombined(state)))]);
        //const more_states = new Set(rules.map(rule => rule.follow()).filter(state => state !== '{}') .flatMap(state => this.uncombined(state)))
        const more_states = new Set(rules.map(rule => rule.follow()))
        if (is_subset(more_states, states))
            return [states, new Set(rules)]
        else
            return this.discover_states_and_rules(new Set([...states, ...more_states]))
    }

    private combined(states: Set<state>): string {
        if (states.size == 1) return [...states][0];

        return '{' + [...states].sort().join(', ') + '}';
    }
    
    private uncombined(state: string): Array<state> {
        if (state.startsWith('{')) {
            return state.substring(1, state.length - 1).split(', ')
        }
        else return [state];
    }

    to_dfa_design(): DFADesign {
        const start_state = this.combined(this.nfa_design.to_nfa()._current_states());
        const [states, rules] = this.discover_states_and_rules(new Set([start_state]));
        const accept_states = [...states].filter(state => this.nfa_design.to_nfa(new Set(this.uncombined(state))).accepting());

        return new DFADesign(start_state, accept_states, new DFARulebook([...rules]))
    }
}
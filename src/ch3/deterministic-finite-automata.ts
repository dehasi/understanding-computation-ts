
function assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function requred<T>(value: T | undefined, message?: string): T {
    if (!value) {
        throw new Error(message || "Required value is missing");
    }
    return value;
}

export type state = number;
export type character = string
// 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' |
// 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' |
// 'w' | 'x' | 'y' | 'z';

export class FARule {
    state: state;
    character: character;
    next_state: state;

    constructor(state: state, character: character, next_state: state) {
        assert(character.length === 1, `expected only one char, but found ${character}`);
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

export class DFARulebook {
    private rules: ReadonlyArray<FARule>

    constructor(rules: ReadonlyArray<FARule>) {
        this.rules = rules;
    }

    next_state(state: state, character: character): state {
        return this.rule_for(state, character).follow();
    }

    rule_for(state: state, character: character): FARule {
        return requred(
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

    read_charactter(character: character): void {
        this.current_state = this.rulebook.next_state(this.current_state, character);
    }

    read_string(string: string): void {
        for (const ch of string) {
            this.read_charactter(ch)
        }
    }
}

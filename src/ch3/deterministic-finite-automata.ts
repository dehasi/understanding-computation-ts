
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


export class FARule {
    state: state;
    character: string;
    next_state: state;

    constructor(state: state, character: string, next_state: state) {
        this.state = state;
        this.character = character.charAt(0);
        this.next_state = next_state;
    }

    applies_to(state: state, character: string): boolean {
        return this.state === state && this.character == character
    }

    follow(): state {
        return this.state;
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

    next_state(state: state, character: string): state {
        return this.rule_for(state, character).follow();
    }

    rule_for(state: state, character: string): FARule {
        return requred(
            this.rules.find(rule => rule.applies_to(state, character)),
            `FARule not found for (${state}, ${character})`
        );
    }
}


export function assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

export function required<T>(value: T | undefined, message?: string): T {
    if (!value) {
        throw new Error(message || "Required value is missing");
    }
    return value;
}

export const intersection = <T>(s1: Set<T>, s2: Set<T>): Set<T> => {
    return new Set([...s1].filter(x => s2.has(x)));
}

export const union = <T>(s1: Set<T>, s2: Set<T>): Set<T> => {
    return new Set([...s1, ...s2]);
}

export const is_subset = <T>(subset: Set<T>, superset: Set<T>): boolean => {
    return [...subset].every(x => superset.has(x));
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
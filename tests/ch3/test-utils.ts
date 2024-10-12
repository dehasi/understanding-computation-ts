

export const set = <T>(...entries: readonly T[]): Set<T> => {
    return new Set(entries)
}

export const comb = <T>(...entries: readonly T[]): string => {
    return  '{' + entries.join(', ') + '}'
}
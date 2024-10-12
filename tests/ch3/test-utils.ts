

export const set = <T>(...entries: readonly T[]): Set<T> => {
    return new Set(entries)
}

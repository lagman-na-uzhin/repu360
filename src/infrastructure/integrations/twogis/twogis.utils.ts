export function extractBaseId(longId) {
    const underscoreIndex = longId.indexOf('_');

    if (underscoreIndex !== -1) {
        return longId.substring(0, underscoreIndex);
    }

    return longId;
}

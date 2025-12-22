export const validGameName = (gameName) => {
    if (!gameName || typeof gameName !== "string" || gameName.includes("..") || gameName.includes("/") || gameName.includes("\\")) {
        return false
    }
    return true
}
/**
 * Filters the Yo-kai list based on their Tribe.
 * 
 * @param {Array<Object>} allYokai - The master list of Yo-kai objects.
 * @param {string|number} id - The unique identifier of the Tribe to match.
 * 
 * @returns {Array<Object>} A new array containing only Yo-kai from the specified Tribe.
 */
export function filterYokaiByTribe(allYokai, id) {
    return allYokai.filter(y => y.tribe_id === id);
}

/**
 * Filters the Yo-kai list based on their Rank (e.g., E, D, C, B, A, S).
 * 
 * @param {Array<Object>} allYokai - The master list of Yo-kai objects.
 * @param {string|number} id - The unique identifier of the Rank to match.
 * 
 * @returns {Array<Object>} A new array containing only Yo-kai of the specified Rank.
 */
export function filterYokaiByRank(allYokai, id) {
    return allYokai.filter(y => y.rank_id === id);
}

/**
 * Filters the Yo-kai list based on their Type (e.g., 'regular', 'rare', 'legendary').
 * 
 * @param {Array<Object>} allYokai - The master list of Yo-kai objects.
 * @param {string|number} id - The unique identifier of the Yo-kai type to match.
 * 
 * @returns {Array<Object>} A new array containing only Yo-kai of the specified Type.
 */
export function filterYokaiByYokaiType(allYokai, id) {
    return allYokai.filter(y => y.yokai_type === id);
}

/**
 * Filters the Yo-kai list by the game in which they made their first appearance.
 * 
 * @param {Array<Object>} allYokai - The master list of Yo-kai objects.
 * @param {string|number} id - The unique identifier of the game to match.
 * 
 * @returns {Array<Object>} A new array of Yo-kai debuting in the specified game.
 */
export function filterYokaiByFirstGame(allYokai, id) {
    return allYokai.filter(y => y.first_game_id === id);
}

/**
 * Filters the Yo-kai list to find all characters present in a specific game title.
 * Checks if the game ID exists within the Yo-kai's game availability array.
 * 
 * @param {Array<Object>} allYokai - The master list of Yo-kai objects.
 * @param {string|number} id - The unique identifier of the game to search for.
 * 
 * @returns {Array<Object>} A new array of Yo-kai that appear in the specified game.
 */
export function filterYokaiByGame(allYokai, id) {
    return allYokai.filter(y => y.game_ids.includes(id));
}
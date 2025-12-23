export function filterYokaiByTribe(allYokai, id) {
    return allYokai.filter(y => y.tribe_id === id);
}

export function filterYokaiByRank(allYokai, id) {
    return allYokai.filter(y => y.rank_id === id);
}

export function filterYokaiByYokaiType(allYokai, id) {
    return allYokai.filter(y => y.yokai_type === id);
}

export function filterYokaiByFirstGame(allYokai, id) {
    return allYokai.filter(y => y.first_game_id === id);
}

export function filterYokaiByGame(allYokai, id) {
    return allYokai.filter(y => y.game_ids.includes(id));
}
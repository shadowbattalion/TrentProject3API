const {
    get_all_games_dal
} = require('../dal/games')


async function list_available_games_services(){

    return await get_all_games_dal()

}


module.exports = {
    list_available_games_services
}
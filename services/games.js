const {
    get_all_games_dal,
    get_games_details_dal
} = require('../dal/games')


async function list_available_games_services(title){

    return await get_all_games_dal(title)

}


async function list_available_games_details_services(game_id){
    try{
        
        let game = await get_games_details_dal(game_id)
        game_json = game.toJSON()

        //modify date format
        game_json.added_date=game_json.added_date.toLocaleDateString('en-GB')
        game_json.released_date=game_json.released_date.toLocaleDateString('en-GB')

        

        //check for empty images
        game_json.images=game_json.images.filter((image)=>{return image.url!=""})
        
        //check for empty reviews
        game_json.reviews=game_json.reviews.filter((review)=>{return review.review!=""})

        return game_json

    } catch(e) {

        return false

    }
}



module.exports = {
    list_available_games_services,
    list_available_games_details_services
}
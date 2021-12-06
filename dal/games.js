const {Game} = require('../models')


async function get_all_games_dal(title){
    console.log(title)
    let games = Game.collection()

    if(title){
        games = games.where('title', 'like', "%"+title+"%")
    }
    // games = games.where({'delete':0})
    
    
    games = await games.fetch()

    // let game = await Game.where({'delete':0}).fetchAll()
    return games
}


async function get_games_details_dal(game_id){

    const game = await Game.where({// dal/games
        'id':game_id,
        'delete':0
    }).fetch({
        require:true,
        withRelated:['category','content_tags', 'platforms', 'images', 'reviews']
    })
    
    return game
}


async function set_delete_flag_dal(game_id){



    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true
    })


    game.set("delete",1)
    await game.save()



}


async function check_game_availability_dal(game_id){

    const game = await Game.where({
        'id':game_id,
        'delete':0
    }).fetch({
        require:true,
        withRelated:['category','content_tags', 'platforms', 'images', 'reviews']
    })

    return game

}


module.exports = {
    get_all_games_dal,
    get_games_details_dal, 
    set_delete_flag_dal, 
    check_game_availability_dal
}
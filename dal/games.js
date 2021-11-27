const {Game} = require('../models')




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


module.exports = {set_delete_flag_dal, check_game_availability_dal}
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





module.exports = {set_delete_flag_dal}
const { CartGame, Game } = require('../models');

const get_cart = async (user_id) => {
    return await CartGame.collection()
        .where({
            user_id
        })
        .orderBy("id")
        .fetch({
            require: false,
            withRelated: ['game', 'game.category']
        });
}



const get_user_game = async (user_id, game_id) => {
    return await CartGame.where({
        user_id,
        game_id
    }).fetch({
        require: false,
        withRelated: ['game', 'game.category']
    });
}



async function get_all_games_from_cart_dal(game_id){

    let games_in_cart = await CartGame.where({
        game_id
    }).fetchAll({
        require: false
    });

    return games_in_cart 
}



async function game_details(game_id){

    return await Game.where({
        "id":game_id
    }).fetch({
        require: false,
    })

}


async function add_game_to_cart(user_id, game_id, cost_after_discount, quantity) {

    
    let cart_game = new CartGame({
        user_id,
        game_id,
        quantity,
        sub_total:cost_after_discount //change in db
    })
    await cart_game.save();
    return cart_game;
}



async function remove_game_from_cart(user_id, game_id) {
    let cart_game = await get_user_game(user_id, game_id)
    if (cart_game) {
        await cart_game.destroy();
        return true;
    }
    return false;
}


async function add_quantity(user_id, game_id, cost_after_discount, new_quantity){
    let cart_game = await get_user_game(user_id, game_id)   
    let final_quantity = cart_game.get('quantity')+parseInt(new_quantity)
    
    cart_game.set('quantity', final_quantity)
    cart_game.set('sub_total', final_quantity*parseFloat(cost_after_discount))
    await cart_game.save()   
}


async function subtract_quantity(user_id, game_id, cost_after_discount, new_quantity){
    let cart_game = await get_user_game(user_id, game_id)
    
    let final_quantity = cart_game.get('quantity')-parseInt(new_quantity)
    
    
    if(final_quantity<1){
        final_quantity = 1
    }else{
        cart_game.set('quantity', final_quantity)
        
    }
    
    cart_game.set('sub_total', cost_after_discount*final_quantity)
    
    await cart_game.save()   
}

module.exports = { 
    get_cart, 
    get_user_game,
    game_details, 
    add_game_to_cart, 
    remove_game_from_cart, 
    add_quantity, 
    subtract_quantity,
    get_all_games_from_cart_dal
}
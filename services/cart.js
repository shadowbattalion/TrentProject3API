const { get_cart, get_user_game, add_game_to_cart, remove_game_from_cart, add_quantity, subtract_quantity} = require('../dal/cart_games')


async function get_cart_for_user(user_id){
    return await get_cart(user_id)
}




async function add_game (user_id, game_id){
    try{
        let cart_game = await get_user_game(user_id, game_id)


        if(cart_game){
            await add_quantity(user_id, game_id, 1)
            return true
                                
        } else {

            await add_game_to_cart(user_id, game_id, 1)
            return true

        }
    } catch(e){
        return false
    }
}




async function remove_game(user_id, game_id) {
    let removeItem = await remove_game_from_cart(user_id, game_id)
    if(removeItem){
        return true
    }else{
        return false
    }
    
}


async function add_game_quantity(user_id, poster_id){
    try{
        await add_quantity(user_id, poster_id, 1)
        return true
    }catch(e){

        return false
    }

}


async function subtract_game_quantity(user_id, poster_id){
    try{
        await subtract_quantity(user_id, poster_id, 1)
        return true
    }catch(e){

        return false
    }

}

module.exports = {get_cart_for_user, add_game, remove_game, add_game_quantity, subtract_game_quantity}





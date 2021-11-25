const { get_cart, get_user_game, game_details , add_game_to_cart, remove_game_from_cart, add_quantity, subtract_quantity} = require('../dal/cart_games')


async function get_cart_for_user(user_id){
    return await get_cart(user_id)
}

async function calculate_total(user_id){
    let cart_game_list = await get_cart_for_user(user_id)
    
    let total = 0

    if(cart_game_list){

        for(let cart_game of cart_game_list.toJSON()){
            
            total=total+cart_game.sub_total

        }


    }

    return total
}


async function add_game (user_id, game_id){
    try{
        let cart_game = await get_user_game(user_id, game_id)
        
        


        if(cart_game){
            
            let cost=cart_game.toJSON().game.cost
            let discount = cart_game.toJSON().game.discount
            let cost_after_discount = ((cost/100)*(1-discount/100)).toFixed(2)

            await add_quantity(user_id, game_id, cost_after_discount, 1)
            return true
                                
        } else {

            let game = await game_details(game_id)

            let cost = game.toJSON().cost
            let discount = game.toJSON().discount
            let cost_after_discount = ((cost/100)*(1-discount/100)).toFixed(2)
            
            await add_game_to_cart(user_id, game_id, cost_after_discount, 1)
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


async function add_game_quantity(user_id, game_id){
    try{
        let cart_game = await get_user_game(user_id, game_id)
        let cost=cart_game.toJSON().game.cost
        let discount = cart_game.toJSON().game.discount
        let cost_after_discount = ((cost/100)*(1-discount/100)).toFixed(2)

        await add_quantity(user_id, game_id, cost_after_discount, 1)
        return true
    }catch(e){

        return false
    }

}


async function subtract_game_quantity(user_id, game_id){
    try{
        let cart_game = await get_user_game(user_id, game_id)
        let cost=cart_game.toJSON().game.cost
        let discount = cart_game.toJSON().game.discount
        let cost_after_discount = ((cost/100)*(1-discount/100)).toFixed(2)

        await subtract_quantity(user_id, game_id, cost_after_discount, 1)
        return true
    }catch(e){

        return false
    }

}

module.exports = {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity}





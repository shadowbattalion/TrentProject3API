const { get_cart, get_user_game, add_game_to_cart, remove_game_from_cart, add_quantity, subtract_quantity} = require('../dal/cart')
const {check_game_availability_dal} = require("../dal/games")



async function get_cart_for_user(user_id){
    let cart_game_list = await get_cart(user_id)
   
    
    let total = 0 
    

    if(cart_game_list){

        cart_game_list = cart_game_list.toJSON()

        for(let cart_game of cart_game_list){
            let cost = parseFloat(cart_game.game.cost)
            let discount = parseFloat(cart_game.game.discount)
            let quantity = parseInt(cart_game.quantity)
            let sub_total = (((cost)*(1-discount/100)).toFixed(2))*quantity
            
            cart_game['sub_total']=sub_total
            total=parseFloat(total)+parseFloat(sub_total)

        }

        return [cart_game_list, total]
    } else {

        return [cart_game_list, total]

    }
}


async function add_game (user_id, game_id){
    try{

        await check_game_availability_dal(game_id)
        let cart_game = await get_user_game(user_id, game_id)
        
        


        if(cart_game){
            
      
            // let cost_after_discount = ((cost)*(1-discount/100)).toFixed(2)

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


async function add_game_quantity(user_id, game_id){
    try{
         
       
        await add_quantity(user_id, game_id, 1)
        return true
    }catch(e){

        return false
    }

}


async function subtract_game_quantity(user_id, game_id){
    try{
        console.log("test=============")
        await subtract_quantity(user_id, game_id, 1)
        return true
    }catch(e){

        return false
    }

}

module.exports = {get_cart_for_user, add_game, remove_game, add_game_quantity, subtract_game_quantity}





const express =  require('express')
const router = express.Router()


const {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity} = require('../../services/cart')

router.get('/', async (req,res)=>{

    let cart_games = await get_cart_for_user(1)
    let total = await calculate_total(1)

    res.json({
        cart_games,
        total
    })
    
})

module.exports=router
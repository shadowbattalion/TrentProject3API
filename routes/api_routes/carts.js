const express =  require('express')
const router = express.Router()


const {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity} = require('../../services/cart')
const {refresh_check_api} = require('../../middleware')

router.get('/', [refresh_check_api], async (req,res)=>{

    let cart_games = await get_cart_for_user(1)
    let total = await calculate_total(1)

    res.json({
        cart_games,
        total
    })
    
})




router.get('/:game_id/add', [refresh_check_api], async function(req, res){
       
    let outcome = await add_game(req.session.user.id, req.params.game_id)
    if(outcome){

        res.json({
            outcome
        })
            
    }else{
        
        res.json({
            "message":"Fail to add game"
        })
            
    }

    
})


router.post('/:game_id/delete', [refresh_check_api], async function(req,res){


    let outcome = await remove_game(req.session.user.id, req.params.game_id)
    if(outcome){
        res.json({
            outcome
        })               
    } else {
        res.json({
            "message":"Fail to delete game"
        })              
    }

    res.redirect('/cart')

})


router.post('/:game_id/quantity/add', [refresh_check_api],  async function(req,res){
    
    let outcome = await add_game_quantity(req.session.user.id, req.params.game_id)


    if(outcome){
        res.json({
            outcome
        })               
    } else {
        res.json({
            "message":"Fail to increase quantity"
        })              
    }

    

})


router.post('/:game_id/quantity/subtract', [refresh_check_api],  async function(req,res){
    
    let outcome = subtract_game_quantity(req.session.user.id, req.params.game_id)


    if(outcome){
        res.json({
            outcome
        })               
    } else {
        res.json({
            "message":"Fail to reduce quantity"
        })              
    }

    res.redirect("/cart")

})







module.exports=router
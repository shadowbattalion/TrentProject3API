const express =  require('express')
const router = express.Router()


const {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity} = require('../../services/cart')
const {auth_check_api} = require('../../middleware')

router.get('/', [auth_check_api], async (req,res)=>{

    let cart_games = await get_cart_for_user(req.user.id)
    let total = await calculate_total(req.user.id)

    res.json({
        cart_games,
        total
    })
    
})




router.post('/:game_id/add', [auth_check_api], async function(req, res){
       
    let outcome = await add_game(req.user.id, req.params.game_id)
    if(outcome){

        res.json({
            "message":outcome
        })
            
    }else{
        
        res.json({
            "message":"Fail to add game"
        })
            
    }

    
})


router.post('/:game_id/delete', [auth_check_api], async function(req,res){


    let outcome = await remove_game(req.user.id, req.params.game_id)
    if(outcome){
        res.json({
            "message":outcome
        })               
    } else {
        res.json({
            "message":"Fail to delete game"
        })              
    }

    

})


router.put('/:game_id/quantity/add', [auth_check_api],  async function(req,res){

    let outcome = await add_game_quantity(req.user.id, req.params.game_id)


    if(outcome){
        res.json({
            "message":outcome
        })               
    } else {
        res.json({
            "message":"Fail to increase quantity"
        })              
    }

    

})


router.put('/:game_id/quantity/subtract', [auth_check_api],  async function(req,res){
    
    let outcome = subtract_game_quantity(req.user.id, req.params.game_id)


    if(outcome){
        res.json({
            "message":outcome
        })               
    } else {
        res.json({
            "message":"Fail to reduce quantity"
        })              
    }

   

})







module.exports=router
const express = require('express')
const router = express.Router()


const {auth_check} = require('../../middleware')
const {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity} = require('../../services/cart')


router.get('/', [auth_check], async (req, res) => {

    let cart_games = await get_cart_for_user(req.session.user.id)
    let total = await calculate_total(req.session.user.id)
    
    res.render('cart/index',{
            'cart_games': cart_games.toJSON(),
            total
    })

})



router.get('/:game_id/add', [auth_check], async function(req, res){
       
    let outcome = await add_game(req.session.user.id, req.params.game_id)
    if(outcome){
            req.flash("success_flash", "Item successfully added")
            
    }else{
            req.flash("error_flash", "Fail to add item")
            
    }

    
    res.redirect('/list-games')

})


router.post('/:game_id/delete', [auth_check], async function(req,res){


    let outcome = await remove_game(req.session.user.id, req.params.game_id)
    if(outcome){
            req.flash("success_flash", "Item has been removed from cart")                
    } else {
            req.flash("error_flash", "Failed to removed from cart")               
    }

    res.redirect('/cart')

})


router.post('/:game_id/quantity/add', [auth_check],  async function(req,res){
    
    let outcome = await add_game_quantity(req.session.user.id, req.params.game_id)


    if(outcome){
            req.flash("success_flash", "Quantity increased!")
    }else{
            req.flash("error_flash", "Fail to add quantity")

    }

    res.redirect("/cart")

})


router.post('/:game_id/quantity/subtract', [auth_check],  async function(req,res){
    
    let outcome = subtract_game_quantity(req.session.user.id, req.params.game_id)


    if(outcome){
            req.flash("success_flash", "Quantity decreased!")
    }else{
            req.flash("error_flash", "Fail to add quantity")

    }

    res.redirect("/cart")

})






module.exports = router
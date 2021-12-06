const express = require('express')
const router = express.Router()


const {auth_check} = require('../../middleware')
const {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity} = require('../../services/cart')


router.get('/', [auth_check], async (req, res) => {

        try{
                let [cart_game_list, total] = await get_cart_for_user(req.session.user.id)
                
                
                res.render('cart/index',{
                        'cart_games_list': cart_game_list,
                        total
                })

        } catch(e){


                res.render('error/error-page')


        }



})


router.get('/:game_id/add', [auth_check], async function(req, res){

        try{
        
                let outcome = await add_game(req.session.user.id, req.params.game_id)
                if(outcome){
                        req.flash("success_flash", "Item successfully added")
                        
                }else{
                        req.flash("error_flash", "Fail to add item")
                        
                }

                
                res.redirect('/list-games')

        } catch(e){


                res.render('error/error-page')


        }

})


router.post('/:game_id/delete', [auth_check], async function(req,res){

        try{
                let outcome = await remove_game(req.session.user.id, req.params.game_id)
                if(outcome){
                        req.flash("success_flash", "Item has been removed from cart")                
                } else {
                        req.flash("error_flash", "Failed to removed from cart")               
                }

                res.redirect('/cart')

        } catch(e){


                res.render('error/error-page')


        }

})


router.post('/:game_id/quantity/add', [auth_check],  async function(req,res){

        try{
                let outcome = await add_game_quantity(req.session.user.id, req.params.game_id)


                if(outcome){
                        req.flash("success_flash", "Quantity increased!")
                }else{
                        req.flash("error_flash", "Fail to add quantity")

                }

                res.redirect("/cart")

        } catch(e){


                res.render('error/error-page')


        }

})


router.post('/:game_id/quantity/subtract', [auth_check],  async function(req,res){

        try{
        
                let outcome = subtract_game_quantity(req.session.user.id, req.params.game_id)


                if(outcome){
                        req.flash("success_flash", "Quantity decreased!")
                }else{
                        req.flash("error_flash", "Fail to add quantity")

                }

                res.redirect("/cart")

        } catch(e){


                res.render('error/error-page')


        }

})






module.exports = router
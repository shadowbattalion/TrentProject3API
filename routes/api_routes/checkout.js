const e = require('connect-flash');
const express = require('express');
const router = express.Router();

const {auth_check_api} = require('../../middleware')
const {get_cart_for_user} = require('../../services/cart')
const {add_to_order_service} = require('../../services/order')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



router.get('/', [auth_check_api], async (req, res) => {
    
    try{
        
        let [games_in_cart, total] =  await get_cart_for_user(req.user.id)
        
        // step 1 - create line items
        let lineItems = [];
        let meta = [];

        //save user of current session and cart for recording in orders table
        meta.push({
            'user_id':req.user.id
        })
        
        let game_quantity = []
        for(let cart_game of games_in_cart){

            
            let title = cart_game.game.title
            let quantity = parseInt(cart_game.quantity)
            let cost = parseFloat(cart_game.game.cost)
            let discount = parseFloat(cart_game.game.discount)
            let cost_after_discount = Math.floor(((cost*100)*(1-discount/100)))
            let sub_total = (((cost)*(1-discount/100)).toFixed(2))*quantity
            const lineItem = {
                    'quantity': quantity,
                    'price_data': {
                        'currency':'SGD',
                        'unit_amount': cost_after_discount,
                        'product_data':{
                            'name': title,  
                        }
                    }
        
                }
            if (cart_game.game.banner_image) {
                lineItem.price_data.product_data.images = [ cart_game.game.banner_image];
            }
            lineItems.push(lineItem);
            
            
            game_quantity.push({
                'game_id': cart_game.game.id,
                'quantity': quantity,
                'sub_total': sub_total
            })


        }
        
        //then push the game-quantity object into meta
        //Sample: [{ user_id: 1 },[{ game_id: 4, quantity: 1 },{ game_id: 5, quantity: 1 },{ game_id: 2, quantity: 3 }]]
        meta.push(game_quantity)

        // step 2 - create stripe payment
        let metaData = JSON.stringify(meta);
        const payment = {
            payment_method_types: ['card'],
            mode:'payment',
            line_items: lineItems,
            'success_url':process.env.STRIPE_SUCCESS_API_URL,
            'cancel_url':process.env.STRIPE_ERROR_API_URL,
            metadata: {
                'orders': metaData
            }
        }

        // step 3: register the session
        let stripeSession = await stripe.checkout.sessions.create(payment)
        

        res.json({
            "message":true,
            'stripe_url':stripeSession.url
        })
        
        
        

    }catch(e){
        
        res.json({
            "message":false
        }) 


    }


}) 





module.exports = router;
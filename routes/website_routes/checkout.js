const express = require('express');
const router = express.Router();

const {get_cart_for_user, calculate_total, add_game, remove_game, add_game_quantity, subtract_game_quantity} = require('../../services/cart')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



router.get('/', async (req, res) => {
    
    //get all the items from the cart
    let games_in_cart =  await get_cart_for_user(req.session.user.id)
    
    //create line items from user's shopping cart
    let line_items_list=[]
    let meta=[]
    for(let cart_game of games_in_cart){

        
    

        let cost = cart_game.related('game').get('cost')
        let discount = cart_game.related('game').get('discount')
        let cost_after_discount = Math.floor(((cost)*(1-discount/100)))

        console.log("========================")
        console.log(cart_game.related('game').get('title'))
        console.log(cost)
        console.log(discount)
        console.log(cost_after_discount)

        const line_item={
            'name':cart_game.related('game').get('title'),
            'amount':cost_after_discount,
            'quantity':cart_game.get('quantity'),
            'currency':'SGD'
        }
        if(cart_game.related('game').get('banner_image')){
            line_item['images']=[cart_game.related('game').get('banner_image')]
        }
        line_items_list.push(line_item)
        meta.push({
            'game_id':cart_game.related('game').get('id'),
            'quantity':cart_game.get('quantity') // why put second time
        })


    }

    let meta_JSON = JSON.stringify(meta)

    console.log(process.env.STRIPE_ERROR_URL)
    let payment = {
        'payment_method_types':['card'],
        'line_items':line_items_list,
        'success_url':process.env.STRIPE_SUCCESS_URL,
        'cancel_url':process.env.STRIPE_ERROR_URL,
        'metadata':{
            'orders':meta_JSON
        }

    }

    // console.log(process.env.STRIPE_ERROR_URL)
    let stripe_sess = await stripe.checkout.sessions.create(payment)
    console.log(stripe_sess)
    console.log("========================================================================================")
    res.render('checkout/checkout',{
        'session_id':stripe_sess.id,
        'publishable_key':process.env.STRIPE_PUBLISHABLE_KEY

    })


})




router.get('/success', (req,res)=>{
    req.flash("success_flash", "Your order has been proccessed.")  
    res.redirect('/list-games')
})

router.get('/error', (req,res)=>{
    req.flash("error_flash", "Your order failed. Try to checkout again!")
    res.redirect('/cart')  
})


module.exports = router;
const e = require('connect-flash');
const express = require('express');
const router = express.Router();

const {get_cart_for_user} = require('../../services/cart')
const {add_to_order_service} = require('../../services/order')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



router.get('/', async (req, res) => {
    
    //get all the items from the cart
    let games_in_cart =  await get_cart_for_user(req.session.user.id)
    
    //create line items from user's shopping cart
    let line_items_list=[]
    let meta=[]

    //push in user_id first
    meta.push({
        'user_id':req.session.user.id
    })
    //then group the game and its quantity into dictionary
    let game_quantity = []
    for(let cart_game of games_in_cart){

        
    

        let cost = cart_game.related('game').get('cost')
        let discount = cart_game.related('game').get('discount')
        let cost_after_discount = Math.floor(((cost)*(1-discount/100)))

        // console.log("========================")
        // console.log(cart_game.related('game').get('title'))
        // console.log(cost)
        // console.log(discount)
        // console.log(cost_after_discount)

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



        game_quantity.push({
            'game_id':cart_game.related('game').get('id'),
            'quantity':cart_game.get('quantity') 
        })


       

    }
    //then push the game-quantity object into meta
    //Sample: [{ user_id: 1 },[{ game_id: 4, quantity: 1 },{ game_id: 5, quantity: 1 },{ game_id: 2, quantity: 3 }]]
    meta.push(game_quantity)

    console.log(meta)
    let meta_JSON = JSON.stringify(meta)

    
    let payment = {
        'payment_method_types':['card'],
        'line_items':line_items_list,
        'success_url':process.env.STRIPE_SUCCESS_URL,
        'cancel_url':process.env.STRIPE_ERROR_URL,
        'metadata':{
            'orders':meta_JSON
        }

    }

    let stripe_sess = await stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout',{
        'session_id':stripe_sess.id,
        'publishable_key':process.env.STRIPE_PUBLISHABLE_KEY

    })


})

router.post('/process_payment',express.raw({type:"application/json"}), async (req,res)=>{


    let payload  = req.body
    let end_point_secret = process.env.STRIPE_ENDPOINT_KEY

    let signature_head = req.headers['stripe-signature']


    let evt = null

    try{
        evt = stripe.webhooks.constructEvent(payload,signature_head,end_point_secret)
        console.log(evt.type)
        
        if(evt.type == "checkout.session.completed"){
            let stripe_sess = evt.data.object

            let outcome = await add_to_order_service(stripe_sess)
            
            
            if(outcome){
                console.log("Orders recorded")                
            } else {
                console.log("Orders fail")               
            }

            res.send({
                'received': true
            })


        }
        if(evt.type == "checkout.session.expired"){
            let stripe_sess = evt.data.object

            let outcome = await add_to_order_service(stripe_sess)
            
            
            if(outcome){
                console.log("Orders recorded")                
            } else {
                console.log("Orders fail")               
            }

            res.send({
                'received': true
            })



        }



    } catch(e) {

        res.send({
            'error':e.message
        })


    }


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
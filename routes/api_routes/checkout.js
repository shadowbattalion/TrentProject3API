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
        
        // console.log(games_in_cart)
        
        
        let line_items_list=[]
        let meta=[]

        
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

            // console.log("========================")
            // console.log(cart_game.related('game').get('title'))
            // console.log(cost)
            // console.log(discount)
            // console.log(cost_after_discount)

            const line_item={
                'name':title,
                'amount':cost_after_discount,
                'quantity':quantity,
                'currency':'SGD'
            }
            if(cart_game.game.banner_image){
                line_item['images']=[cart_game.game.banner_image]
            }
            line_items_list.push(line_item)



            game_quantity.push({
                'game_id':cart_game.game.id,
                'quantity':quantity,
                'sub_total': sub_total
            })


        

        }
        //then push the game-quantity object into meta
        //Sample: [{ user_id: 1 },[{ game_id: 4, quantity: 1 },{ game_id: 5, quantity: 1 },{ game_id: 2, quantity: 3 }]]
        meta.push(game_quantity)

        let meta_JSON = JSON.stringify(meta)
        
        
        let payment = {
            'payment_method_types':['card'],
            'line_items':line_items_list,
            'success_url':process.env.STRIPE_SUCCESS_API_URL,
            'cancel_url':process.env.STRIPE_ERROR_API_URL,
            'metadata':{
                'orders':meta_JSON
            }

        }

        let stripe_sess = await stripe.checkout.sessions.create(payment)
        

        res.json({
            "message":true,
            'stripe_url':stripe_sess.url
        })
        
        // console.log(stripe_sess.url)
        // res.redirect(stripe_sess.url)

    }catch(e){

        res.json({
            "message":false
        }) 


    }


}) 

router.post('/process_payment',express.raw({type:"application/json"}), async (req,res)=>{


    let payload  = req.body
    let end_point_secret = process.env.STRIPE_ENDPOINT_KEY

    let signature_head = req.headers['stripe-signature']


    try{
        
    
        if(signature_head){

            let evt = null

    
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


            }else{

                res.send({
                    'error':"An error has occured"
                })

            }

        

    } catch(e) {

        res.send({
            'error':"An error has occured"
        })


    }


})



router.get('/success', (req,res)=>{
   
    res.render('checkout/api-checkout-success')
})

router.get('/error', (req,res)=>{
   
    res.render('checkout/api-checkout-failure')  
})


module.exports = router;
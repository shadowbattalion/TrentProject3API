const e = require('connect-flash');
const express = require('express');
const router = express.Router();

const {auth_check} = require('../../middleware')
const {get_cart_for_user} = require('../../services/cart')
const {add_to_order_service} = require('../../services/order')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



router.get('/', [auth_check], async (req, res) => {
    
    try{
        
        let [games_in_cart, total] =  await get_cart_for_user(req.session.user.id)

       

        // step 1 - create line items
        let lineItems = [];
        let meta = [];
        for (let cart_game of games_in_cart) {



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
            // save the quantity data along with the product id
            meta.push({
                'product_id' : cart_game.game.id,
                'quantity': quantity,
                'sub_total':sub_total
            })
        }

        // step 2 - create stripe payment
        let metaData = JSON.stringify(meta);
        const payment = {
            payment_method_types: ['card'],
            mode:'payment',
            line_items: lineItems,
            'success_url':process.env.STRIPE_SUCCESS_URL,
            'cancel_url':process.env.STRIPE_ERROR_URL,
            metadata: {
                'orders': metaData
            }
        }

        // step 3: register the session
        let stripeSession = await stripe.checkout.sessions.create(payment)
        res.render('checkout/checkout', {
            'sessionId': stripeSession.id, // 4. Get the ID of the session
            'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
        })

    }catch(e){
        console.log(e)
        req.flash("error_flash", "Please add at least one item in the cart")
        req.session.save(function () { 
            res.redirect('/cart')
        })


    }


})

router.post('/process_payment',express.raw({type:"application/json"}), async (req,res)=>{


    try{

        let payload  = req.body
        let end_point_secret = process.env.STRIPE_ENDPOINT_KEY

        let signature_head = req.headers['stripe-signature']
        
    
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

        

        } catch(e){

            res.render('error/error-page')
    
        }


})


router.get('/success', (req,res)=>{

    try{
        req.flash("success_flash", "Your order has been proccessed.")
        req.session.save(function () { 
            res.redirect('/list-games')
        })
    } catch(e){

        res.render('error/error-page')

    }
})

router.get('/error', (req,res)=>{

    try{
        req.flash("error_flash", "Your order failed. Try to checkout again!")
        req.session.save(function () { 
            res.redirect('/cart')
        })
    } catch(e){

        res.render('error/error-page')

    }  
})


module.exports = router;
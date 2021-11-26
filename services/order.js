const {add_user_to_order_dal, add_items_to_orderItems_dal} = require('../dal/order')

async function add_to_order_service(stripe_sess){

    
    try{
        
        let user_id
        let game_quantity 

        if(Object.keys(stripe_sess.metadata).length !== 0){
            
            let user_orders = JSON.parse(stripe_sess.metadata.orders)
            user_id = user_orders[0].user_id
            game_quantity =  user_orders[1] //to be stored in orderItems table

        }else{

            user_id = 1 // for testing webhook purpose, we need to create a fake user in the users table
            game_quantity = [{"game_id":1,"quantity":0}] // for testing webhook purpose, we need to create a fake game in the users table
        }

        
        let payment_method = stripe_sess.payment_method_types.join(',')
        let status = stripe_sess.payment_status

        let total

        if(stripe_sess.amount_total){
            total = stripe_sess.amount_total/100 
        }else{

            total = 0
        }

        let current_date = new Date()//.toLocaleString('en-GB')

        

        let saved_object = await add_user_to_order_dal(payment_method, status, total, current_date, user_id)

        
        //store in orderItems table
        let order_id =  saved_object.attributes.id
        for(let item of game_quantity){

    
            await add_items_to_orderItems_dal(order_id, item.game_id, item.quantity)


        }


        return true
    } catch(e){
        return false
    }


}


module.exports = {add_to_order_service}
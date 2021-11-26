const {add_user_to_order_dal} = require('../dal/order')

async function add_user_to_order_service(stripe_sess){

    
    try{
        console.log(stripe_sess.metadata)
        let user_id

        if(Object.keys(stripe_sess.metadata).length !== 0){
            console.log(stripe_sess.metadata)
            let user_orders = JSON.parse(stripe_sess.metadata.orders)
            user_id = user_orders[0].user_id
            //other orders
        }else{

            user_id = 1 // for testing webhook purpose, we need to create a user in the users table
        }

        console.log(user_id)

        let payment_method = stripe_sess.payment_method_types.join(',')
        let status = stripe_sess.payment_status

        let total

        if(stripe_sess.amount_total){
            total = stripe_sess.amount_total/100 
        }else{

            total = 0
        }

        let current_date = new Date()//.toLocaleString('en-GB')

        

        await add_user_to_order_dal(payment_method, status, total, current_date, user_id)
        return true
    } catch(e){
        return false
    }


}


module.exports = {add_user_to_order_service}
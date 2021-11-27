const {
    get_order_collection_dal, 
    fetch_order_collection_dal, 
    find_orders_dal, add_user_to_order_dal, 
    add_items_to_orderItems_dal, clear_user_cart_dal
} = require('../dal/order')




async function get_order_collection_service(){
    return await get_order_collection_dal()
}




function dates_converter(list){
    
    let new_list=[]
    for(let item of list.toJSON()){
        item.date=item.date.toLocaleString('en-GB')
        new_list.push(item)
    }
    return new_list
}


function date_converter(object){
    
   
    object=object.toJSON()

    object.date= object.date.toLocaleString('en-GB')


    return object
}




async function search_service(form_data, pass_through, retreive_search){
    
    if (pass_through) {
        retreive_search = retreive_search.query('join', 'users', 'user_id', 'users.id')
        .where('users.display_name', 'like', '%' + form_data.display_name + '%')
    }


    if (pass_through) {
        let status
        if(form_data.status==0){
            status="%%"
        }else if(form_data.status==1){
            status="unpaid"
        }else if(form_data.status==2){
            status="paid"
        }
        retreive_search = retreive_search.where('status', 'like', status);
    }

    let orders = await fetch_order_collection_dal(retreive_search)
    
    return dates_converter(orders)
}


async function get_order_service(order_id){

    let order = await find_orders_dal(order_id)
    
    return date_converter(order)
}

async function get_order_and_update_status_service(form_data, order_id){

    try{
        let order = await find_orders_dal(order_id)

        let status
                        
        if(form_data.status==1){
            status="unpaid"
        }else if(form_data.status==2){
            status="paid"
        }
            
        order.set({"status":status})
        await order.save()

        return [true, status, order.get('id')]
    } catch(e){
        let status=""
        return [false,status, order.get('id')]
    }
}



async function get_order_delete_service(order_id){

    try{
        let order = await find_orders_dal(order_id)

        let deleted_order_id=order.get('id')
        await order.destroy()
        
        return [true, deleted_order_id]
    } catch(e){
        
        return [false, deleted_order_id]
    }
}



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
            game_quantity = [{"game_id":1,"quantity":0}] // for testing webhook purpose, we need to create a fake game in the cart
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

        //clear cart
        console.log(user_id)
        await clear_user_cart_dal(user_id)



        return true
    } catch(e){
        return false
    }


}


module.exports = {
    get_order_collection_service,
    search_service, get_order_service,
    get_order_and_update_status_service, 
    get_order_delete_service, 
    add_to_order_service
}
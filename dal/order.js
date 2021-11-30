const {Order, OrderItem, CartGame, User} = require('../models');

async function get_order_collection_dal(){

    let orders = await Order.collection()
    return orders

}

async function fetch_order_collection_dal(retreive_search){

    let search =  await retreive_search.fetch({
        require:false,
        withRelated:['user','order_items.game']
    })

    return search


}


async function get_user_order_dal(user_id){
    console.log(user_id)
    const user_orders = await Order.where({
        user_id
    }).fetchAll({
        require:true,
        withRelated:['user','order_items.game']
    })

    return user_orders


}





async function find_orders_dal(order_id){
    const order = await Order.where({
        'id':order_id
    }).fetch({
        require:true,
        withRelated:['user','order_items.game']
    })

    return order
}


async function add_user_to_order_dal(payment_method, status, total, date, user_id) {

    
    let order = new Order({
        payment_method, 
        status, 
        total, 
        date, 
        user_id
    })
    await order.save()
    return order
}



async function add_items_to_orderItems_dal(order_id, game_id, quantity, subtotal){

    
    let order_item = new OrderItem({
        order_id, 
        game_id, 
        quantity,
        sub_total:subtotal
    })
    
    await order_item.save()
    return order_item

}



async function clear_user_cart_dal(user_id){

    const cart = await CartGame.where({
        'user_id':user_id
    }).fetchAll({
        require:true
    })

  
    for(let item of cart){

        await item.destroy()

    }
    

}



async function get_all_games_unpaid_order_dal (game_id){

    let games_in_order = await OrderItem.where({
        game_id
    }).fetchAll({
        require: false,
        withRelated:['order']
    });



   

    return games_in_order
}





module.exports = {
    get_order_collection_dal, 
    fetch_order_collection_dal, 
    find_orders_dal,  
    add_user_to_order_dal, 
    add_items_to_orderItems_dal, 
    clear_user_cart_dal,
    get_all_games_unpaid_order_dal,
    get_user_order_dal
}

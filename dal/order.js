const {Order, OrderItem} = require('../models');


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



async function add_items_to_orderItems_dal(order_id, game_id, quantity){


    let order_item = new OrderItem({
        order_id, 
        game_id, 
        quantity
    })

    await order_item.save()
    return order_item

}

module.exports = {add_user_to_order_dal, add_items_to_orderItems_dal}

const {Order} = require('../models');


async function add_user_to_order_dal(payment_method, status, total, date, user_id) {

    
    let order = new Order({
        payment_method, 
        status, 
        total, 
        date, 
        user_id
    })
    await order.save();
    return order;
}

module.exports = {add_user_to_order_dal}

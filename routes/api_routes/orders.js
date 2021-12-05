const express = require("express")
const router = express.Router()




const {auth_check_api} = require('../../middleware')

const {
    get_user_order_service
}  = require('../../services/order')














router.get('/user-orders', [auth_check_api], async(req,res)=>{


    let user_id = req.user.id
    
    let user_orders = await get_user_order_service(user_id)

    console.log(user_orders)

       
    res.json({
        'user_orders': user_orders
    })



})



module.exports = router
const express = require("express")
const router = express.Router()


const {Order, OrderItem, Game } = require('../../models')
const {bootstrap, create_search_order_form, create_update_order_form} = require('../../forms')
const {auth_check} = require('../../middleware')

const {
    get_order_collection_service, 
    search_service, get_order_service, 
    get_order_and_update_status_service, 
    get_order_delete_status_service
}  = require('../../services/order')





router.get('/', [auth_check], async(req,res)=>{

    let retreive_search = await get_order_collection_service()

    let form = create_search_order_form()

        
    form.handle(req, {
        'empty': async (form) => {
           
            
            let orders_json_list = await search_service(form.data, 0, retreive_search)
            
            res.render('orders/index', {
                'orders':orders_json_list,
                'form': form.toHTML(bootstrap)
            })

        },
        'error': async (form) => {
            
           
            let orders_json_list = await search_service(form.data, 0, retreive_search)

            res.render('orders/index', {
                'orders':orders_json_list,
                'form': form.toHTML(bootstrap)
            })

        },
        'success': async (form) => {
            
                       
            let orders_json_list = await search_service(form.data, 1, retreive_search)
             
            
            res.render('orders/index', {
                'orders':orders_json_list,
                'form': form.toHTML(bootstrap)
            })
        }
    })
 

})







router.get('/:order_id/update', [auth_check], async(req,res)=>{

    const order_id = req.params.order_id

    const order = await get_order_service(order_id)    

    const update_form = create_update_order_form()

    res.render('orders/update',{
        "order":order.toJSON(),
        "form":update_form.toHTML(bootstrap)   
    })


})



router.post('/:order_id/update', [auth_check], async(req,res)=>{

    const update_form = create_update_order_form()
    update_form.handle(req,{
        "success": async (form) => {
            
            const order_id = req.params.order_id

            let [outcome, status, id] = await get_order_and_update_status_service(form.data, order_id)
            if (outcome){

                req.flash("success_flash", `Order Number ${id} has been updated to ${status}`)
                res.redirect('/orders')

            }else{

                req.flash("error_flash", `Order Number ${id} fail to be updated. Please try again.`)
                res.redirect('/orders')

            }
            
        
        },
        "error": async(form)=>{
            res.render('orders/update', {
                "order":order.toJSON(),
                "form":update_form.toHTML(bootstrap) 
            })
        }
    })



})




router.get('/:order_id/delete', [auth_check], async(req,res)=>{


    const order_id = req.params.order_id

    const order = await get_order_service(order_id)   

    res.render('orders/delete', {
        'order': order.toJSON()
    })
})


router.post('/:order_id/delete', [auth_check], async(req,res)=>{


    const order_id = req.params.order_id

    let [outcome, id] = await get_order_delete_status_service(order_id)
    if (outcome){

        req.flash("success_flash", `Order Number ${id} has been deleted.`)
        res.redirect('/orders')

    }else{

        req.flash("error_flash", `Order Number ${id} failed to be deleted`)
        res.redirect('/orders')

    }
    
})

module.exports = router
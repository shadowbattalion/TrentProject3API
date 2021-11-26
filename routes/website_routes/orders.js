const express = require("express")
const router = express.Router()


const {Order, OrderItem, Game } = require('../../models')
const {bootstrap, create_search_order_form, create_update_order_form} = require('../../forms')
const {auth_check} = require('../../middleware')






router.get('/', [auth_check], async(req,res)=>{


    let retreive_search = Order.collection()

    let form = create_search_order_form()

        
    form.handle(req, {
        'empty': async (form) => {
            console.log("TEST1")
            let orders = await retreive_search.fetch({
                require:false,
                withRelated:['user','order_items.game']
            })


            let orders_json_list=[]
            for(let order of orders.toJSON()){
                order.date=order.date.toLocaleString('en-GB')
                orders_json_list.push(order)
            }
            res.render('orders/index', {
                'orders':orders_json_list,
                'form': form.toHTML(bootstrap)
            })

        },
        'error': async (form) => {
            console.log("TEST2")
            let orders = await retreive_search.fetch({
                require:false,
                withRelated:['user','order_items.game']
            })


            let orders_json_list=[]
            for(let order of orders.toJSON()){
                order.date=order.date.toLocaleString('en-GB')
                orders_json_list.push(order)
            }

            
            res.render('orders/index', {
                'orders':orders_json_list,
                'form': form.toHTML(bootstrap)
            })

        },
        'success': async (form) => {
            console.log("TEST3")

            
            if (form.data.display_name) {
                retreive_search = retreive_search.query('join', 'users', 'user_id', 'users.id')
                .where('users.display_name', 'like', '%' + form.data.display_name+ '%')
            }


            
            let orders = await retreive_search.fetch({
                require:false,
                withRelated:['user','order_items.game']
            })


            let orders_json_list=[]
            for(let order of orders.toJSON()){
                order.date=order.date.toLocaleString('en-GB')
                orders_json_list.push(order)
            }

            
            res.render('orders/index', {
                'orders':orders_json_list,
                'form': form.toHTML(bootstrap)
            })
        }
    })

    



})







router.get('/:order_id/update', [auth_check], async(req,res)=>{

    const order_id = req.params.order_id

    const order = await Order.where({
        'id':order_id
    }).fetch()

       

    const update_form = create_update_order_form()

    
    res.render('orders/update',{
        "order":order.toJSON(),
        "form":update_form.toHTML(bootstrap)   
    })


})



router.post('/:game_id/update', [auth_check], async(req,res)=>{


    const order_id = req.params.order_id

    const order = await Order.where({
        'id':order_id
    }).fetch()

       

    const update_form = create_update_order_form()

    update_form.handle(req,{
        "success": async (form) => {
            order.set(form.data.status)
            await order.save()
            
            req.flash("success_flash", `Order Number  has been updated`)
            res.redirect(`/orders`)
        },
        "error": async(form)=>{
            res.render('orders/update', {
                "order":order.toJSON(),
                "form":update_form.toHTML(bootstrap) 
            })
        }
    })





})


// router.get('/:game_id/delete', [auth_check], async(req,res)=>{


//     const game_id = req.params.game_id

//     const game = await Game.where({
//         'id':game_id
//     }).fetch({
//         require:true
//     })

//     res.render('games/delete', {
//         'game': game.toJSON()
//     })
// })



// router.post('/:game_id/delete', [auth_check], async(req,res)=>{


//     const game_id = req.params.game_id

//     const game = await Game.where({
//         'id':game_id
//     }).fetch({
//         require:true
//     })

    
//     req.flash("success_flash", `${game.get('title')} has been deleted`)
//     await game.destroy();
    
//     res.redirect('/list-games')
// })

module.exports = router
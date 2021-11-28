const express = require("express")
const router = express.Router()


const {Game, Category, ContentTag, Platform, Image, Review} = require('../../models')
const {bootstrap, create_game_form, create_search_form} = require('../../forms')
const {auth_check} = require('../../middleware')
const {get_all_games_from_cart_dal}=require('../../dal/cart')
const {get_all_games_unpaid_order_dal}=require('../../dal/order')
const {set_delete_flag_dal}=require("../../dal/games")






router.get('/', [auth_check], async(req,res)=>{

    let games = await Game.collection().fetch()


    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    
    categories.unshift([0, 'All'])


    const content_tags = await ContentTag.fetchAll().map((content_tag) =>{
        return [content_tag.get('id'), content_tag.get('name')]
    })


    const platforms = await Platform.fetchAll().map((platform) =>{
        return [platform.get('id'), platform.get('name')]
    })
    
    
    let form = create_search_form(categories, content_tags, platforms)

    let retreive_search = Game.collection()
    
    form.handle(req, {
        'empty': async (form) => {
            let games = await retreive_search.fetch()


            let games_json_list=[]
            for(let game of games.toJSON()){
                if(game.delete==0){
                    game.added_date=game.added_date.toLocaleDateString('en-GB')
                    games_json_list.push(game) 
                }
            }
    
            
            res.render('games/index', {
                'games':games_json_list,
                'form': form.toHTML(bootstrap)
            })

        },
        'error': async (form) => {

            let games = await retreive_search.fetch()


            let games_json_list=[]
            for(let game of games.toJSON()){
                if(game.delete==0){
                    game.added_date=game.added_date.toLocaleDateString('en-GB')
                    games_json_list.push(game) 
                }
            }

            
            res.render('games/index', {
                'games':games_json_list,
                'form': form.toHTML(bootstrap)
            })

        },
        'success': async (form) => {
            
            
            if (form.data.category_id != "0" && form.data.category_id) {
                retreive_search = retreive_search.where('category_id', '=', parseInt(form.data.category_id))
            }

            if (form.data.content_tags) {
                let tags = form.data.content_tags.split(',');
                retreive_search = retreive_search.query('join', 'content_tags_games as c', 'games.id', 'c.game_id').where('content_tag_id', 'in',tags);
            }

            if (form.data.platforms) {
                let platforms = form.data.platforms.split(',');
                retreive_search = retreive_search.query('join', 'games_platforms as gp', 'games.id', 'gp.game_id').where('platform_id', 'in', platforms);
            }


            if (form.data.title) {
                retreive_search = retreive_search.where('title', 'like', `%${form.data.title}%`);
            }


            if (form.data.company_name) {
                retreive_search = retreive_search.where('company_name', 'like', `%${form.data.company_name}%`);
            }

            
            
            let games = await retreive_search.fetch()

           

            let games_json_list=[]
            for(let game of games.toJSON()){
                if(game.delete==0){
                    game.added_date=game.added_date.toLocaleDateString('en-GB')
                    games_json_list.push(game) 
                }
            }

            
            res.render('games/index', {
                'games':games_json_list,
                'form': form.toHTML(bootstrap)
            })

        }
    })






})


router.get('/:game_id/details', [auth_check], async(req,res)=>{

    try{
        const game_id = req.params.game_id

        const game = await Game.where({// dal/games
            'id':game_id,
            'delete':0
        }).fetch({
            require:true,
            withRelated:['category','content_tags', 'platforms', 'images', 'reviews']
        })

        game_json = game.toJSON()

        //modify date format
        game_json.added_date=game_json.added_date.toLocaleDateString('en-GB')
        game_json.released_date=game_json.released_date.toLocaleDateString('en-GB')

        

        //check for empty images
        game_json.images=game_json.images.filter((image)=>{return image.url!=""})
        
        //check for empty reviews
        game_json.reviews=game_json.reviews.filter((review)=>{return review.review!=""})
        

        res.render('games/game-details',{
            'game':game_json
        })
    } catch(e){

        res.render('error/error-page')

    }

})




router.get('/add', [auth_check], async(req,res)=>{



    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    
    const content_tags = await ContentTag.fetchAll().map((content_tag) =>{
        return [content_tag.get('id'), content_tag.get('name')]
    })
    
    const platforms = await Platform.fetchAll().map((platform) => {
        return [platform.get('id'), platform.get('name')]
    })



    const game_form = create_game_form(categories, content_tags, platforms)
    res.render('games/add',{
        "form":game_form.toHTML(bootstrap),
        "name": process.env.CLDNRY_NAME,
        "api_key": process.env.CLDNRY_API_KEY,
        "preset": process.env.CLDNRY_UPLOAD_PRESET

    })

})


router.post('/add', [auth_check], async(req,res)=>{


    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })

    const content_tags = await ContentTag.fetchAll().map((content_tag) =>{
        return [content_tag.get('id'), content_tag.get('name')]
    })

    const platforms = await Platform.fetchAll().map((platform) => {
        return [platform.get('id'), platform.get('name')]
    })



    const game_form = create_game_form(categories, content_tags, platforms)
    game_form.handle(req,{
        "success": async(form)=>{
            let {content_tags, platforms, review_1, review_2, review_3, review_4, review_5, url_1, url_2, url_3, url_4, url_5, url_1_thumbnail, url_2_thumbnail, url_3_thumbnail, url_4_thumbnail, url_5_thumbnail, cost, ...game_data}=form.data
            game_data['delete']=0
            game_data['cost']=parseFloat(cost).toFixed(2)
            const game=new Game(game_data)
            let saved_object = await game.save()

            let combined_urls = []
            let urls =  [url_1, url_2, url_3, url_4, url_5]
            let url_thumbnails = [url_1_thumbnail, url_2_thumbnail, url_3_thumbnail, url_4_thumbnail, url_5_thumbnail]
            for (let i = 0; i<urls.length; i++){

                combined_urls.push([urls[i],url_thumbnails[i]])

            }

            
            for (let combined_url of combined_urls){
               
                let image_object = new Image({'game_id':saved_object.attributes.id, 'url':combined_url[0], 'url_thumbnail':combined_url[1]})
                await image_object.save()
            }


            for (let review of [review_1, review_2, review_3, review_4, review_5]){
               
                let new_review = new Review({'game_id':saved_object.attributes.id, 'review':review})
                await new_review.save()
            }
           
            if(content_tags){
                
                await game.content_tags().attach(content_tags.split(","))
                
            }

            if(platforms){
                
                await game.platforms().attach(platforms.split(","))
                
            }

            req.flash("success_flash", `${game.get('title')} has been added`)
            res.redirect('/list-games')
        },
        "error": async(form)=>{
            res.render('games/add', {
                "form":form.toHTML(bootstrap),
                "name": process.env.CLDNRY_NAME,
                "api_key": process.env.CLDNRY_API_KEY,
                "preset": process.env.CLDNRY_UPLOAD_PRESET
            })

        }


    })

 

})



router.get('/:game_id/update', [auth_check], async(req,res)=>{

    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true,
        withRelated:['content_tags','platforms','images','reviews']
    })

    
    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })

    const content_tags = await ContentTag.fetchAll().map((content_tag) =>{
        return [content_tag.get('id'), content_tag.get('name')]
    })

    const platforms = await Platform.fetchAll().map((platform) => {
        return [platform.get('id'), platform.get('name')]
    })
      



    const game_form = create_game_form(categories, content_tags, platforms)

    game_form.fields.title.value = game.get('title')
    game_form.fields.cost.value = game.get('cost')
    game_form.fields.discount.value = game.get('discount')
    game_form.fields.description.value = game.get('description')
    game_form.fields.recommended_requirement.value = game.get('recommended_requirement')
    game_form.fields.minimum_requirement.value = game.get('minimum_requirement')
    

    let reviews = await game.related('reviews').pluck('review')

    game_form.fields.review_1.value = reviews[0]
    game_form.fields.review_2.value = reviews[1]
    game_form.fields.review_3.value = reviews[2]
    game_form.fields.review_4.value = reviews[3]
    game_form.fields.review_5.value = reviews[4]

    game_form.fields.banner_image.value = game.get('banner_image')
    game_form.fields.banner_image_thumbnail.value = game.get('banner_image_thumbnail')
    let images = await game.related('images').pluck('url')
    game_form.fields.url_1.value = images[0]
    game_form.fields.url_2.value = images[1]
    game_form.fields.url_3.value = images[2]
    game_form.fields.url_4.value = images[3]
    game_form.fields.url_5.value = images[4]

    let images_thumbnail = await game.related('images').pluck('url_thumbnail')
    game_form.fields.url_1_thumbnail.value = images_thumbnail[0]
    game_form.fields.url_2_thumbnail.value = images_thumbnail[1]
    game_form.fields.url_3_thumbnail.value = images_thumbnail[2]
    game_form.fields.url_4_thumbnail.value = images_thumbnail[3]
    game_form.fields.url_5_thumbnail.value = images_thumbnail[4]

    game_form.fields.company_name.value = game.get('company_name')
    game_form.fields.added_date.value = game.get('added_date')
    game_form.fields.released_date.value = game.get('released_date')
    game_form.fields.category_id.value = game.get('category_id')

    let content_tags_chosen = await game.related('content_tags').pluck('id')
    game_form.fields.content_tags.value = content_tags_chosen

    let platforms_chosen = await game.related('platforms').pluck('id')
    game_form.fields.platforms.value = platforms_chosen



    res.render('games/update',{
        "form":game_form.toHTML(bootstrap),
        "game":game.toJSON(),
        "name": process.env.CLDNRY_NAME,
        "api_key": process.env.CLDNRY_API_KEY,
        "preset": process.env.CLDNRY_UPLOAD_PRESET
    })


})


async function filtering(ids, main_table, main_table_column, table){

    ids = ids.split(',')
    let current_tag_ids = await main_table.related(table).pluck('id')
           
    let removing_tag_ids = current_tag_ids.filter((current_tag_id)=>{ 
                return ids.includes(current_tag_id)===false
            })
           
    await main_table_column.detach(removing_tag_ids)
    await main_table_column.attach(ids)



}


router.post('/:game_id/update', [auth_check], async(req,res)=>{


    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true,
        withRelated:['content_tags','platforms']
    })

    
    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })

    const content_tags = await ContentTag.fetchAll().map((content_tag) => {
        return [content_tag.get('id'), content_tag.get('name')]
    })

    const platforms = await Platform.fetchAll().map((platform) => {
        return [platform.get('id'), platform.get('name')]
    })


    //tables to fetch each image id based on game_id
    const images_object = await Image.where({'game_id':game_id}).fetchAll().map((image)=>{
        return image.get('id')
    })

    //tables to fetch each review id based on game_id
    const reviews_object = await Review.where({'game_id':game_id}).fetchAll().map((review)=>{
        return review.get('id')
    })

    



    const game_form = create_game_form(categories, content_tags, platforms)

    game_form.handle(req,{
        "success": async (form) => {
            let {content_tags, platforms, review_1, review_2, review_3, review_4, review_5, url_1, url_2, url_3, url_4, url_5, url_1_thumbnail, url_2_thumbnail, url_3_thumbnail, url_4_thumbnail, url_5_thumbnail, cost, ...game_data}=form.data
            game_data['delete']=0
            game_data['cost']=parseFloat(cost).toFixed(2)
            game.set(game_data)
            await game.save()
            
            //update images based on array of image ids
            let combined_urls = []
            let urls =  [url_1, url_2, url_3, url_4, url_5]
            let url_thumbnails = [url_1_thumbnail, url_2_thumbnail, url_3_thumbnail, url_4_thumbnail, url_5_thumbnail]
            for (let i = 0; i<urls.length; i++){

                combined_urls.push([urls[i],url_thumbnails[i]])

            }

            images_object.forEach(async (key, i) => {
                
                const image = await Image.where({
                    'id':key
                }).fetch({
                    require:true
                })
                
                image.set({'url':combined_urls[i][0], 'url_thumbnail':combined_urls[i][1]})
                await image.save()

            
            })

            //update reviews based on array of review ids
            let reviews = [review_1, review_2, review_3, review_4, review_5]

            reviews_object.forEach(async (key, i) => {
                
                const review = await Review.where({
                    'id':key
                }).fetch({
                    require:true
                })
                
                review.set({"review": reviews[i]})
                await review.save()

            
            })

            //ask paul

            //content_tag_update
            filtering(content_tags, game, game.content_tags(), 'content_tags')
            //platform update
            filtering(platforms, game, game.platforms(), 'platforms')

            
            req.flash("success_flash", `${game.get('title')} has been updated`)
            res.redirect(`/list-games/${game_id}/details`)
        },
        "error": async(form)=>{
            res.render('games/update', {
                "form":form.toHTML(bootstrap),
                "game":game.toJSON()
            })
        }
    })





})


router.get('/:game_id/delete', [auth_check], async(req,res)=>{


    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true
    })

    res.render('games/delete', {
        'game': game.toJSON()
    })
})



router.post('/:game_id/delete', [auth_check], async(req,res)=>{


    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true
    })

    let games_in_cart = await get_all_games_from_cart_dal(game_id)


    let game_ids_in_cart=[]
    for (let id of games_in_cart.toJSON()){

        game_ids_in_cart.push(id['game_id'])


    }


    let games_in_order = await get_all_games_unpaid_order_dal(game_id)

    let game_ids_unpaid_in_order = []
    let game_ids_paid_in_order = []
    for (let game of games_in_order.toJSON()){

        if(game.order.status=="unpaid"){

            game_ids_unpaid_in_order.push(game.game_id)

        }

        if(game.order.status=="paid"){

            game_ids_paid_in_order.push(game.game_id)

        }


    }


   

    // console.log(game_ids)
    // console.log(game_ids.includes(parseInt(game_id)))

    let check_game_id_in_cart = game_ids_in_cart.includes(parseInt(game_id))
    let check_game_id_unpaid_in_order = game_ids_unpaid_in_order.includes(parseInt(game_id))

    
    // console.log(game_id)
    // console.log(game_ids_in_cart)
    // console.log(check_game_id_in_cart)
    // console.log("============================")
    // console.log(game_id)
    // console.log(game_ids_unpaid_in_order)
    // console.log(check_game_id_unpaid_in_order)
    // console.log("============================")

    if(check_game_id_in_cart || check_game_id_unpaid_in_order){

        let cart = ""
        let order = ""

        if(check_game_id_in_cart){
            cart="cart"
        }

        if(check_game_id_unpaid_in_order){
            order="order"
        }

        req.flash("error_flash", `${game.get('title')} is still in a customer's ${cart}/${order}`)

        
    } else{

       

        req.flash("success_flash", `${game.get('title')} has been deleted`)

        console.log(game_id)
        console.log(game_ids_paid_in_order)
        console.log(game_ids_paid_in_order.includes(parseInt(game_id)))
        if(game_ids_paid_in_order.includes(parseInt(game_id))){
            console.log("fake delete")
            await set_delete_flag_dal(game_id) // if such games is not in customer's cart, and already paid, set delete flag

        }else{
            console.log("delete")
            // await game.destroy();
        }

    }
    

    

    
    
    res.redirect('/list-games')
})

module.exports = router
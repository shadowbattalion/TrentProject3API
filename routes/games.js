const express = require("express")
const router = express.Router()


const {Game, Category, ContentTag, Platform, Image, Review} = require('../models')

const {bootstrap_field , create_game_form} = require('../forms')







router.get('/', async(req,res)=>{

    let games = await Game.collection().fetch()
    //modify date format
    let games_json_list=[]
    for(let game of games.toJSON()){
        game.added_date=game.added_date.toLocaleDateString('en-GB')
        games_json_list.push(game)
    }
   
    res.render('games/index',{
        'games':games_json_list
    })


})


router.get('/:game_id/details', async(req,res)=>{

    try{
        const game_id = req.params.game_id

        const game = await Game.where({
            'id':game_id
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




router.get('/add', async(req,res)=>{



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
        "form":game_form.toHTML(bootstrap_field)
    })

})


router.post('/add',async(req,res)=>{


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
            let {content_tags, platforms, review_1, review_2, review_3, review_4, review_5, url_1, url_2, url_3, url_4, url_5, ...game_data}=form.data

            const game=new Game(game_data)
            let saved_object = await game.save()
            
            for (let url of [url_1, url_2, url_3, url_4, url_5]){
               
                let image_object = new Image({'game_id':saved_object.attributes.id, 'url':url})
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

            req.flash("success_messages", `${game.get('title')} has been added`)
            res.redirect('/list-games')
        },
        "error": async(form)=>{
            res.render('games/add', {
                "form":form.toHTML(bootstrap_field)
            })

        }


    })

 

})



router.get('/:game_id/update', async(req,res)=>{

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
    game_form.fields.banner_image.value = game.get('banner_image')

    let reviews = await game.related('reviews').pluck('review')

    game_form.fields.review_1.value = reviews[0]
    game_form.fields.review_2.value = reviews[1]
    game_form.fields.review_3.value = reviews[2]
    game_form.fields.review_4.value = reviews[3]
    game_form.fields.review_5.value = reviews[4]

    let images = await game.related('images').pluck('url')

    game_form.fields.url_1.value = images[0]
    game_form.fields.url_2.value = images[1]
    game_form.fields.url_3.value = images[2]
    game_form.fields.url_4.value = images[3]
    game_form.fields.url_5.value = images[4]

    game_form.fields.company_name.value = game.get('company_name')
    game_form.fields.added_date.value = game.get('added_date')
    game_form.fields.released_date.value = game.get('released_date')
    game_form.fields.category_id.value = game.get('category_id')

    let content_tags_chosen = await game.related('content_tags').pluck('id')
    game_form.fields.content_tags.value = content_tags_chosen

    let platforms_chosen = await game.related('platforms').pluck('id')
    game_form.fields.platforms.value = platforms_chosen

    res.render('games/update',{
        'form':game_form.toHTML(bootstrap_field),
        'game':game.toJSON()
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


router.post('/:game_id/update', async(req,res)=>{


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
            let {content_tags, platforms, review_1, review_2, review_3, review_4, review_5, url_1, url_2, url_3, url_4, url_5, ...game_data}=form.data
            game.set(game_data)
            await game.save()
            
            //update images based on array of image ids
            let urls = [url_1, url_2, url_3, url_4, url_5]

            images_object.forEach(async (key, i) => {
                
                const image = await Image.where({
                    'id':key
                }).fetch({
                    require:true
                })
                
                image.set({"url": urls[i]})
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

            
            req.flash("success_messages", `${game.get('title')} has been updated`)
            res.redirect(`/list-games/${game_id}/details`)
        },
        "error": async(form)=>{
            res.render('games/update', {
                "form":form.toHTML(bootstrap_field),
                "game":game.toJSON()
            })
        }
    })





})


router.get('/:game_id/delete', async(req,res)=>{


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



router.post('/:game_id/delete', async(req,res)=>{


    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true
    })

    
    req.flash("success_messages", `${game.get('title')} has been deleted`)
    await game.destroy();
    
    res.redirect('/list-games')
})

module.exports = router
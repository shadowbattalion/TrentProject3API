const express = require("express")
const router = express.Router()


const {Game, Category, ContentTag} = require('../models')

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

    
    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true,
        withRelated:['category'],
        withRelated:['content_tags']
    })


    //modify date format
    game_json = game.toJSON()
    game_json.added_date=game_json.added_date.toLocaleDateString('en-GB')

    res.render('games/game-details',{
        'game':game_json
    })


})




router.get('/add', async(req,res)=>{



    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const content_tags = await ContentTag.fetchAll().map( content_tag => [content_tag.get('id'), content_tag.get('name')])




    const game_form = create_game_form(categories, content_tags)
    res.render('games/add',{
        "form":game_form.toHTML(bootstrap_field)
    })

})


router.post('/add',async(req,res)=>{


    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const content_tags = await ContentTag.fetchAll().map( content_tag => [content_tag.get('id'), content_tag.get('name')])




    const game_form = create_game_form(categories, content_tags)
    game_form.handle(req,{
        "success": async(form)=>{
            let {content_tags, ...game_data}=form.data
            const game=new Game(game_data)
            await game.save()
            if(content_tags){
                
                await game.content_tags().attach(content_tags.split(","))
                
            }

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
        withRelated:['content_tags']
    })

    
    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const content_tags = await ContentTag.fetchAll().map( content_tag => [content_tag.get('id'), content_tag.get('name')])




    const game_form = create_game_form(categories, content_tags)

    game_form.fields.title.value = game.get('title')
    game_form.fields.cost.value = game.get('cost')
    game_form.fields.discount.value = game.get('discount')
    game_form.fields.description.value = game.get('description')
    game_form.fields.recommended_requirement.value = game.get('recommended_requirement')
    game_form.fields.minimum_requirement.value = game.get('minimum_requirement')
    game_form.fields.banner_image.value = game.get('banner_image')
    game_form.fields.company_name.value = game.get('company_name')
    game_form.fields.added_date.value = game.get('added_date')
    game_form.fields.category_id.value = game.get('category_id')
    let content_tags_chosen = await game.related('content_tags').pluck('id')
    game_form.fields.content_tags.value= content_tags_chosen

    res.render('games/update',{
        'form':game_form.toHTML(bootstrap_field),
        'game':game.toJSON()
    })


})


router.post('/:game_id/update', async(req,res)=>{


    const game_id = req.params.game_id

    const game = await Game.where({
        'id':game_id
    }).fetch({
        require:true
    })

    
    const categories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const content_tags = await ContentTag.fetchAll().map( content_tag => [content_tag.get('id'), content_tag.get('name')])




    const game_form = create_game_form(categories, content_tags)

    game_form.handle(req,{
        "success": async (form) => {
            let {content_tags, ...game_data}=form.data
            game.set(game_data)
            game.save()

            
            let content_tag_id = content_tags.split(',')
            let current_tags = await game.related('content_tags').pluck('id')
            let removing_tags = current_tags.filter((tag_id)=>content_tag_id.includes(tag_id)===false)
            await game.content_tags().detach(removing_tags)
            await game.content_tags().attach(content_tag_id)
            
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

    await game.destroy();
    res.redirect('/list-games')
})

module.exports = router
const express = require("express")
const router = express.Router()


const {Game} = require('../models')

const {bootstrap_field , create_game_form} = require('../forms')



router.get('/', async(req,res)=>{

    let games = await Game.collection().fetch()
    //modify date format
    let games_modified_date=[]
    for(let game of games.toJSON()){
        game.added_date=game.added_date.toLocaleDateString('en-GB')
        games_modified_date.push(game)
    }
   
    res.render('games/index',{
        'games':games_modified_date
    })


})


router.get('/add', async(req,res)=>{
    const game_form = create_game_form()
    res.render('games/add',{
        "form":game_form.toHTML(bootstrap_field)
    })

})


router.post('/add',async(req,res)=>{
    const game_form = create_game_form()
    game_form.handle(req,{
        "success": async(form)=>{
            const game=new Game()
            game.set(form.data)
            await game.save()
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
        require:true
    })

    const game_form=create_game_form()

    game_form.fields.title.value = game.get('title')
    game_form.fields.cost.value = game.get('cost')
    game_form.fields.discount.value = game.get('discount')
    game_form.fields.description.value = game.get('description')
    game_form.fields.recommended_requirement.value = game.get('recommended_requirement')
    game_form.fields.minimum_requirement.value = game.get('minimum_requirement')
    game_form.fields.banner_image.value = game.get('banner_image')
    game_form.fields.company_name.value = game.get('company_name')
    game_form.fields.added_date.value = game.get('added_date')

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

    
    const game_form=create_game_form()

    game_form.handle(req,{
        "success": async (form) => {
            game.set(form.data)
            game.save()
            res.redirect('/list-games')
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
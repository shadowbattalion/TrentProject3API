const bookhself = require('../bookshelf')


const Game = bookhself.model('Games',{
    tableName:'games'
})



module.exports={Game}
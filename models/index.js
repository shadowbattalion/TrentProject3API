const bookhself = require('../bookshelf')


const Games = bookhself.model('Games',{
    tableName:'games'
})



module.exports={Games}
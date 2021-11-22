const bookshelf = require('../bookshelf')


const Category = bookshelf.model('Category',{
    tableName: 'categories',
    games(){
        return this.hasMany('Game')
    }
})


const Game = bookshelf.model('Game',{
    tableName:'games',
    category(){
        return this.belongsTo('Category')
    },
    content_tags(){
        return this.belongsToMany('ContentTag')
    }
})

const ContentTag=bookshelf.model('ContentTag',{
    tableName:'content_tags',
    games() {
        return this.belongsToMany('Game')
    }
})

module.exports={Game, Category, ContentTag}
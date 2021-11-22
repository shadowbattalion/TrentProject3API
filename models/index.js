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
    },
    images(){
        return this.hasMany('Image')
    }
})

const ContentTag=bookshelf.model('ContentTag',{
    tableName:'content_tags',
    games() {
        return this.belongsToMany('Game')
    }
})


const Image = bookshelf.model('Image',{
    tableName:'images',
    game(){
        return this.belongsTo('Game')
    }
})

module.exports={Game, Category, ContentTag, Image}
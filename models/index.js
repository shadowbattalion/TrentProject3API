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
    platforms(){
        return this.belongsToMany('Platform')
    },
    images(){
        return this.hasMany('Image')
    },
    reviews(){
        return this.hasMany('Review')
    }
})

const ContentTag=bookshelf.model('ContentTag',{
    tableName:'content_tags',
    games() {
        return this.belongsToMany('Game')
    }
})

const Platform = bookshelf.model('Platform',{
    tableName:'platforms',
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

const Review = bookshelf.model('Review',{
    tableName:'reviews',
    game(){
        return this.belongsTo('Game')
    }
})


const CartGame = bookshelf.model('CartGame', {
    tableName: 'cart_games',
    game() {
        return this.belongsTo('Game')
    }

})


const User = bookshelf.model('User',{
    tableName: 'users',
    orders (){
        return this.hasMany('Order')
    }
})


const Order = bookshelf.model('Order',{
    tableName: 'orders',
    user(){
        return this.belongsTo('User')
    },
    order_items(){
        return this.hasMany('OrderItem')
    }
})


const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'games_orders',
    order() {
        return this.belongsTo('Order')
    },
    game() {
        return this.belongsTo('Game')
    }

})


const BlackList = bookshelf.model('BlackList',{
    tableName: 'blacklisted_tokens',
})




module.exports={Game, Category, ContentTag, Platform, Image, Review, User, CartGame, Order, OrderItem, BlackList}
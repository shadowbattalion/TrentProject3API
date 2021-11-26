'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('games', 'category_id',{
    type: 'int',
    unsigned:true,
    notNull:false,
    foreignKey: {
      name:'game_category_fk',
      table:'categories',
      rules:{
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      },
      mapping: 'id'
    },

  })
};

exports.down = function(db) {
  return db.removeForeignKey('games', 'game_category_fk').then(()=>{return db.removeColumn('games', 'category_id')})
};

exports._meta = {
  "version": 1
};

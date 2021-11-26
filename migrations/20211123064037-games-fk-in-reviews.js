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
  return db.addColumn('reviews', 'game_id',{
    type: 'int',
    unsigned:true,
    notNull:true,
    foreignKey: {
      name:'review_game_fk',
      table:'games',
      mapping: 'id',
      rules:{
        onDelete:'CASCADE',
        onUpdate:'RESTRICT'
      }
    }

  })
};

exports.down = function(db) {
  return db.removeForeignKey('reviews', 'review_game_fk').then(()=>{return db.removeColumn('reviews', 'game_id')})
};

exports._meta = {
  "version": 1
};

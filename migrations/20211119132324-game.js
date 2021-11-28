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
  return db.createTable('games',{
    id:{type: 'int', primaryKey:true, autoIncrement:true, unsigned: true},
    title:{type: 'string', length:50},
    cost:{type: 'real'},
    discount:{type: 'int'},
    description:{type: 'string', length:600},
    recommended_requirement:{type: 'string', length:600},
    minimum_requirement:{type: 'string', length:600},
    banner_image:{type: 'string', length:300},
    banner_image_thumbnail:{type: 'string', length:300},
    company_name:{type: 'string', length:100},
    added_date:{type: 'date'},
    released_date:{type: 'date'},
    delete:{type: 'int', notNull:false}
  })
};

exports.down = function(db) {
  return db.dropTable('games');
};

exports._meta = {
  "version": 1
};

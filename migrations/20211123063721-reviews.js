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
  return db.createTable('reviews',{
    id: {type: 'int', primaryKey:true, autoIncrement:true, unsigned: true},
    review: {type: 'string', length:200}
  })
};

exports.down = function(db) {
  return db.dropTable('reviews')
};
exports._meta = {
  "version": 1
};

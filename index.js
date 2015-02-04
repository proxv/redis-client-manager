var redis = require('redis');
var timers = require('timers');

function RedisClientManager(redisConfig) {
  redisConfig = redisConfig || {};
  this._redisDbNum = redisConfig.database || redisConfig.db || redisConfig.dbNum || 0;
  this._redisConfig = redisConfig;
  this._redisClientsByName = {};
}

RedisClientManager.prototype.getClient = function(name, cb) {
  var redisClient = this._redisClientsByName[name];
  if (!redisClient) {
    redisClient = redis.createClient(this._redisConfig);
    redisClient.name = name;
    this._redisClientsByName[name] = redisClient;
  }

  if (this._redisDbNum) {
    redisClient.select(this._redisDbNum, function(err) {
      if (err) {
        cb(err);
      } else {
        cb(null, redisClient);
      }
    });
  } else {
    timers.setImmediate(cb, null, redisClient);
  }
};

module.exports = RedisClientManager;

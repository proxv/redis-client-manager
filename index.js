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
    var port = this._redisConfig.port || 6379;
    var host = this._redisConfig.host || '127.0.0.1';
    redisClient = redis.createClient(port, host, this._redisConfig);
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

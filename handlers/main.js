'use strict';

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

exports.home = function(request, h) {
  const client = redis.createClient();
  client.on('error', (err) => {
    console.log(err);
  });

  client.hmset('user:1000',
               'name', 'John Doe',
               'email', 'jdoe@exp.com',
               redis.print);
  return client.hgetallAsync('user:1000');
};

exports.pubSub = function(request, h) {
  const sub = redis.createClient();
  const pub = redis.createClient();
  let msg_count = 0;

  sub.on('subscribe', function(channel, count) {
    console.log('sub subscribed to ' + channel + ', ' + count + ' total subscriptions');
    if (count == 2) {
      pub.publish('nice channel', 'I am sending a message.');
      pub.publish('another one', 'I am sending another message.');
      pub.publish('nice channel', 'I am sending my last message.');
    }
  });

  sub.on('unsubscribe', function(channel, count) {
    console.log('sub unsubscribed to ' + channel + ', ' + count + ' total subscriptions');
    if (count == 0) {
      pub.quit();
      sub.quit();
    }
  });

  sub.on('message', function(channel, message) {
    console.log('sub channel ' + channel + ': ' + message);
    msg_count += 1;
    if (msg_count === 3) {
      sub.unsubscribe();
    }
  });

  sub.on('ready', function () {
    sub.incr('did a thing');
    sub.subscribe('nice channel', 'another one');
  });

  return true;
};


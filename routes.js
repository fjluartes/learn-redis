'use strict';

const Main = require('./handlers/main');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: Main.home
}, {
    method: 'GET',
    path: '/pub-sub',
    handler: Main.pubSub
}];

'use strict';

/**
 * Module dependencies.
 */

var each = require('component-each');
var integration = require('@segment/analytics.js-integration');

/**
 * Expose `RocketFuel`.
 */

var RocketFuel = module.exports = integration('Rocket Fuel')
  .option('accountId', '')
  .option('universalActionId', '')
  .tag('stargate step', '<img src="//{{ actionId }}p.rfihub.com/ca.gif?rb={{ accountId }}&ca={{ actionId }}&ra={{ cacheBuster }}&_o={{ accountId }}&_t={{ actionId }}"/>')
  .tag('universal', '<img src="//{{ universalActionId }}p.rfihub.com/ca.gif?rb={{ accountId }}&ca={{ universalActionId }}&_o=37037&_t=20809061&ra={{ cacheBuster }}"/>')
  .mapping('events');

/**
 * Page load the universal pixel.
 *
 * @api public
 * @param {Page} page
 */

RocketFuel.prototype.page = function() {
  var user = this.analytics.user();
  var custType = 'new';
  if (user.id()) custType = 'existing';

  this.load('universal', {
    custType: custType,
    cacheBuster: this.cacheBuster()
  });
};

/**
 * Track events.
 *
 * @param {Track} track
 */

RocketFuel.prototype.track = function(track) {
  var eventName = track && track.obj && track.obj.event;
  var events = this.events(track.event());
  var self = this;
  var eventActionIdMap = {
    'Load Homepage': '20809060',
    'Click Join Now': '20809169',
    'Click Stargate Next': '20809170',
    'Click SoundCloud Connect': '20809171',
    'Click YouTube Connect': '20809172',
    'Click Stargate Skip': '20809062',
  }

  return self.load('stargate step', {
    actionId: eventActionIdMap[eventName] || '',
    cacheBuster: self.cacheBuster()
  });
};

/**
 * Generate a random number for cachebusting.
 *
 * @api private
 */

RocketFuel.prototype.cacheBuster = function() {
  return Math.round(Math.random() * 99999999);
};

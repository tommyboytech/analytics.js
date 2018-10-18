/*
 * Module dependencies.
 */

var Integrations = require('./integrations');
var analytics = require('@segment/analytics.js-core');
var each = require('@ndhoule/each');

each(function(Integration) {
  analytics.use(Integration);
}, Integrations);

/*
 * Exports.
 */

module.exports = analytics;

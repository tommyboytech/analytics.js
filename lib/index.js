/*
 * Module dependencies.
 */

var analytics = require('./analytics');
var Segment = require('./integrations').segmentio;

// Get a handle on the global analytics queue, as initialized by the
// analytics.js snippet. The snippet stubs out the analytics.js API and queues
// up calls for execution when the full analytics.js library (this file) loads.
var analyticsq = global.analytics || [];

// Parse the version from the analytics.js snippet.
var snippetVersion = analyticsq && analyticsq.SNIPPET_VERSION ? parseFloat(analyticsq.SNIPPET_VERSION, 10) : 0;

// add persistent props support
analytics._persistent_properties = {};
analytics.add_persistent_properties = function(props) {
    for (var key in props) {
        analytics._persistent_properties[key] = props[key];
    }
};

_SegmentNormalize = Segment.prototype.normalize;
Segment.prototype.normalize = function(msg) {
  msg.properties = msg.properties || {};
  for (var key in analytics._persistent_properties) {
    if (msg.properties[key] === undefined) {
      msg.properties[key] = analytics._persistent_properties[key];
    }
  }
  return _SegmentNormalize.call(this, msg);
}

// Initialize analytics.js. CDN will render configuration objects into
// `{"Facebook Pixel":{"legacyEvents":{},"initWithExistingTraits":false,"pixelId":"974260729352574","standardEvents":{}},"Google Analytics":{"trackingId":"UA-85527854-1","classic":false,"includeSearch":false,"reportUncaughtExceptions":false,"anonymizeIp":false,"domain":"","enhancedLinkAttribution":false,"nonInteraction":false,"siteSpeedSampleRate":1,"trackCategorizedPages":true,"trackNamedPages":true,"dimensions":{},"metrics":{},"mobileTrackingId":"","sampleRate":100,"sendUserId":false,"contentGroupings":{},"doubleClick":false,"enhancedEcommerce":false,"ignoredReferrers":[]},"Mixpanel":{"secureCookie":false,"setAllTraitsByDefault":true,"trackAllPages":false,"consolidatedPageCalls":true,"crossSubdomainCookie":true,"increments":[],"legacySuperProperties":false,"people":true,"peopleProperties":[],"token":"4a4479ef2bd67f8c9776a8d368cc6772","persistence":"cookie","superProperties":[],"trackCategorizedPages":false,"trackNamedPages":false},"Twitter Ads":{"events":{"email subscribe":"nvl74","play":"nvl75"},"identifier":"productId","page":"nvl72","universalTagPixelId":""},"Segment.io":{"apiKey":"DrDc0RtB8RMUze5FRRE2VePYpbLGz1d4","addBundledMetadata":true,"unbundledIntegrations":[]}}` and `{"track":{}}` using project settings.
analytics.initialize(analyticsq.SETTINGS, {
  initialPageview: snippetVersion === 0,
  plan: {"track":{}}
});

// Make any queued calls up before the full analytics.js library
// loaded
while (analyticsq && analyticsq.length > 0) {
  var args = analyticsq.shift();
  var method = args.shift();

  if (typeof analytics[method] === 'function') {
    analytics[method].apply(analytics, args);
  }
}

// Free the reference to analyticsq
analyticsq = null;

/*
 * Exports.
 */

// Set `global.analytics` explicitly rather than using Browserify's
// `--standalone` flag in order to avoid hooking into an already-declared
// `global.require`
global.analytics = analytics;

'use strict';

var Promise = require('es6-promise').Promise;
var urlBuilder = require('../lib/url-builder.js');

var googleApi;

function loadAutoCompleteAPI(params) {
  var script = document.createElement('script');

  script.type = 'text/javascript';

  script.src = urlBuilder({
    base: 'https://maps.googleapis.com/maps/api/js',
    libraries: params.libraries || [],
    callback: 'googleMapsAutoCompleteAPILoad',
    apiKey: params.apiKey,
    client: params.client,
    language: params.language
  });

  document.querySelector('head').appendChild(script);
}

/**
 * googleMapsApiLoader
 *
 * @param  {object} params
 * @param  {object} params.libraries
 *
 * @return {promise}
 */
function googleMapsApiLoader(params) {
  if (googleApi) {
    return Promise.resolve(googleApi);
  }

  var windowRef = window ? window : {};

  var deferred = function(resolve, reject) {
    loadAutoCompleteAPI(params);

    windowRef.googleMapsAutoCompleteAPILoad = function() {
      googleApi = windowRef.google;
      resolve(googleApi);
    };

    setTimeout(function() {
      if (!windowRef.google) {
        reject(new Error('Loading took too long'));
      }
    }, 5000);
  };

  return new Promise(deferred);
}

module.exports = googleMapsApiLoader;


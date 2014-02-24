import checkAuth from "analytics-promises/auth";
import queryAccountsList from "analytics-promises/accounts";
import queryWebPropertiesList from "analytics-promises/webProperties";
import queryProfilesList from "analytics-promises/profiles";
import queryCoreReportingApi from "analytics-promises/core";
import { setRateLimit } from "analytics-promises/utils";

function loadAnalytics() {
  var promise = new RSVP.Promise(function (resolve, reject) {
    gapi.client.load('analytics', 'v3', handler);

    function handler() {
      resolve(this);
    }
  });

  return promise;
}

function init(params) {
  var immediate = true;

  if (typeof arguments[1] !== "undefined") {
    immediate = arguments[1];
  }

  if (params && params.rateLimit) {
    setRateLimit(params.rateLimit);
  }

  return checkAuth(immediate, params)
    .then(function () {
      return loadAnalytics();
    });
}

function accounts() {
  return queryAccountsList();
}

function webProperties(account) {
  return queryWebPropertiesList(account);
}

function profiles(webProperty) {
  return queryProfilesList(webProperty);
}

function query(profile, params) {
  return queryCoreReportingApi(profile, params);
}

export { init, accounts, webProperties, profiles, query };

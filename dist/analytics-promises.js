/*!
 * analytics-promises 0.4.1
 * https://github.com/erikwiffin/analytics-promises
 * 
 * @copyright 2014, Erik Wiffin <erik.wiffin@gmail.com>
 * @license analytics-promises may be freely distributed under the MIT license.
 */
(function(global) {
/**
  @class Analytics
  @module Analytics
  */
var define, require;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  require = function(name) {

    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(require(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };

  require.entries = registry;
})();

define("analytics-promises/accounts", 
  ["analytics-promises/utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var execute = __dependency1__.execute;

    function queryAccountsList() {
      var promise = new RSVP.Promise(function (resolve, reject) {
        execute(gapi.client.analytics.management.accounts.list(), handler);

        function handler(response) {
          if (!response.code) {
            if (response && response.items && response.items.length) {
              resolve(response.items);
            } else {
              reject('No accounts found for this user.');
            }
          } else {
            reject('There was an error querying accounts: ' + response.message);
          }
        }
      });

      return promise;
    }

    __exports__["default"] = queryAccountsList;
  });
define("analytics-promises/auth", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var clientId, apiKey;
    var scopes = 'https://www.googleapis.com/auth/analytics.readonly';

    function checkAuth(immediate) {
      
      // Set some config variables
      if (arguments[1] && arguments[1].clientId && arguments[1].apiKey) {
        clientId = arguments[1].clientId;
        apiKey = arguments[1].apiKey;
      }

      var promise = new RSVP.Promise(function (resolve, reject) {
        gapi.client.setApiKey(apiKey);
        gapi.auth.authorize({
          client_id: clientId,
          scope: scopes,
          immediate: immediate
        }, handler);

        function handler(authResult) {
          if (authResult && !(authResult instanceof Error)) {
            resolve(authResult);
          } else {
            reject(authResult);
          }
        }
      });

      return promise;
    }

    __exports__["default"] = checkAuth;
  });
define("analytics-promises/core", 
  ["analytics-promises/utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var execute = __dependency1__.execute;

    function queryCoreReportingApi(profile, query) {
      var promise = new RSVP.Promise(function (resolve, reject) {

        if (profile && profile.id) {
          profile = 'ga:' + profile.id;
        }

        query.ids = profile;

        execute(gapi.client.analytics.data.ga.get(query), handler);

        function handler (response) {
          if (!response.code) {
            resolve(response);
          } else {
            reject('There was an error querying the core reporting api: ' + response.message);
          }
        }
      });

      return promise;
    }

    __exports__["default"] = queryCoreReportingApi;
  });
define("analytics-promises/profiles", 
  ["analytics-promises/utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var execute = __dependency1__.execute;

    function queryProfilesList(webProperty) {
      var promise = new RSVP.Promise(function (resolve, reject) {
        var accountId, webPropertyId, gapiMethod;

        if (webProperty && webProperty.accountId && webProperty.id) {
          accountId = webProperty.accountId;
          webPropertyId = webProperty.id;
        }

        gapiMethod = gapi.client.analytics.management.profiles.list({
          'accountId': accountId,
          'webPropertyId': webPropertyId
        });
        execute(gapiMethod, handler);

        function handler(response) {
          if (!response.code) {
            if (response && response.items && response.items.length) {
              resolve(response.items);
            } else {
              reject('No profiles found for this user.');
            }
          } else {
            reject('There was an error querying profiles: ' + response.message);
          }
        }
      });

      return promise;
    }

    __exports__["default"] = queryProfilesList;
  });
define("analytics-promises/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var lastCallTime = 0;
    var callsThisSecond = 0;
    var limit = 10;

    function setRateLimit(newLimit) {
      limit = newLimit;
    }

    __exports__.setRateLimit = setRateLimit;function execute(gapiMethod, originalHandler) {
      var promise = new RSVP.Promise(function (resolve, reject) {

        var wait;
        var now = Math.floor(Date.now() / 1000);
        var handler = (function () {
          return function () {
            originalHandler.apply(this, arguments);
            resolve();
          };
        })(originalHandler);

        if (now > lastCallTime) {
          lastCallTime = now;
          callsThisSecond = 0;
        }

        callsThisSecond++;

        if (callsThisSecond > limit) {
          wait = 1000 - (Date.now() - parseInt(now + '000', 10));
          setTimeout(function () {
            execute(gapiMethod, handler);
          }, wait);
        } else {
          gapiMethod.execute(handler);
        }
      });

      return promise;
    }

    __exports__.execute = execute;
  });
define("analytics-promises/webProperties", 
  ["analytics-promises/utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var execute = __dependency1__.execute;

    function queryWebPropertiesList(account) {
      var promise = new RSVP.Promise(function (resolve, reject) {

        var gapiMethod;

        if (account && account.id) {
          account = account.id;
        }

        gapiMethod = gapi.client.analytics.management.webproperties.list({
          'accountId': account
        });
        execute(gapiMethod, handler);

        function handler(response) {
          if (!response.code) {
            if (response && response.items && response.items.length) {
              resolve(response.items);
            } else {
              reject('No webProperties found for this user.');
            }
          } else {
            reject('There was an error querying webProperties: ' + response.message);
          }
        }
      });

      return promise;
    }

    __exports__["default"] = queryWebPropertiesList;
  });
define("analytics-promises", 
  ["analytics-promises/auth","analytics-promises/accounts","analytics-promises/webProperties","analytics-promises/profiles","analytics-promises/core","analytics-promises/utils","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var checkAuth = __dependency1__["default"];
    var queryAccountsList = __dependency2__["default"];
    var queryWebPropertiesList = __dependency3__["default"];
    var queryProfilesList = __dependency4__["default"];
    var queryCoreReportingApi = __dependency5__["default"];
    var setRateLimit = __dependency6__.setRateLimit;

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

    __exports__.init = init;
    __exports__.accounts = accounts;
    __exports__.webProperties = webProperties;
    __exports__.profiles = profiles;
    __exports__.query = query;
  });
global.Analytics = require('analytics-promises');
}(window));
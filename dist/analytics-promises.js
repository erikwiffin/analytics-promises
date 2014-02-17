/*!
 * analytics-promises 0.1.0
 * https://github.com/erikwiffin/analytics-promises
 * 
 * @copyright 201414, Erik Wiffin <erik.wiffin@gmail.com>
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
  ["exports"],
  function(__exports__) {
    "use strict";
    function queryAccountsList() {
      var promise = new RSVP.Promise(function (resolve, reject) {
        gapi.client.analytics.management.accounts.list()
          .execute(handler);

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
        gapi.auth.setToken('notasecret');
        gapi.auth.authorize({
          client_id: clientId,
          scope: scopes,
          immediate: immediate
        }, handler);

        function handler(authResult) {
          if (authResult) {
            resolve(this);
          } else {
            reject(this);
          }
        }
      });

      return promise;
    }

    __exports__["default"] = checkAuth;
  });
define("analytics-promises/core", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function queryCoreReportingApi(profile, query) {
      var promise = new RSVP.Promise(function (resolve, reject) {

        if (profile && profile.id) {
          profile = 'ga:' + profile.id;
        }

        query.ids = profile;

        gapi.client.analytics.data.ga.get(query)
          .execute(handler);

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
  ["exports"],
  function(__exports__) {
    "use strict";
    function queryProfilesList(webProperty) {
      var promise = new RSVP.Promise(function (resolve, reject) {
        var accountId, webPropertyId;

        if (webProperty && webProperty.accountId && webProperty.id) {
          accountId = webProperty.accountId;
          webPropertyId = webProperty.id;
        }

        gapi.client.analytics.management.profiles.list({
          'accountId': accountId,
          'webPropertyId': webPropertyId
        }).execute(handler);

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
define("analytics-promises/webProperties", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function queryWebPropertiesList(account) {
      var promise = new RSVP.Promise(function (resolve, reject) {
        if (account && account.id) {
          account = account.id;
        }

        gapi.client.analytics.management.webproperties.list({
          'accountId': account
        }).execute(handler);

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
  ["analytics-promises/auth","analytics-promises/accounts","analytics-promises/webProperties","analytics-promises/profiles","analytics-promises/core","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var checkAuth = __dependency1__["default"];
    var queryAccountsList = __dependency2__["default"];
    var queryWebPropertiesList = __dependency3__["default"];
    var queryProfilesList = __dependency4__["default"];
    var queryCoreReportingApi = __dependency5__["default"];

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
      return checkAuth(true, params)
        .catch(function () {
          return checkAuth(false);
        })
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
import { execute } from "analytics-promises/utils";

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

export default queryProfilesList;

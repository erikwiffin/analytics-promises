import { execute } from "analytics-promises/utils";

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

export default queryWebPropertiesList;

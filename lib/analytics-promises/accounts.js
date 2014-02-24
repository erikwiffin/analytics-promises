import { execute } from "analytics-promises/utils";

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

export default queryAccountsList;

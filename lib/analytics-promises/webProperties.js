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

export default queryWebPropertiesList;

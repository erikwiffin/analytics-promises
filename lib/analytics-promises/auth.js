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

export default checkAuth;

var scopes = 'https://www.googleapis.com/auth/analytics.readonly';
var clientId = '32779766298-jg91rqpco54iv5736v4cv8dr2na2mi7b.apps.googleusercontent.com';
var apiKey = 'AIzaSyBU2E4CrfY7PBjq1_FMLrbOqsxshXnGPfo';

function checkAuth(immediate) {
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

export default checkAuth;

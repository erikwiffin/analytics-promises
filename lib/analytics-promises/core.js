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

export default queryCoreReportingApi;

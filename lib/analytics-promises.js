import checkAuth from "analytics-promises/auth";

function init() {
  var promise;

  _.defer(checkAuth, promise);

  return promise;
}

export { init };

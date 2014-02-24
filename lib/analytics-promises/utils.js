var lastCallTime = 0;
var callsThisSecond = 0;
var limit = 10;

export function setRateLimit(newLimit) {
  limit = newLimit;
}

export function execute(gapiMethod, originalHandler) {
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

analytics-promises
==================

Wrapper library for Google Analytics

analytics-promises is built on top of [RSVP.js](https://github.com/tildeio/rsvp.js) and is designed to make working with the Google Analytics javascript API a little bit friendlier.

Usage
-----

analytics-promises has [RSVP.js](https://github.com/tildeio/rsvp.js) as a hard dependency. You need to include it first for analytics-promises to run.
```html
    <script src="rsvp.js"></script>
    <script src="analytics-promises.min.js"></script>
```
Or, you can use the helpfully packaged analytics-promises-dependencies.js which comes with RSVP.js built-in.

Examples
--------

Turn this:
```js
    function makeApiCall() {
      outputToPage('Querying Accounts.');
      gapi.client.analytics.management.accounts.list().execute(handleAccounts);
    }

    function handleAccounts(response) {
      if (!response.code) {
        if (response && response.items && response.items.length) {
          var firstAccountId = response.items[0].id;
          queryWebproperties(firstAccountId);
        } else {
          updatePage('No accounts found for this user.')
        }
      } else {
        updatePage('There was an error querying accounts: ' + response.message);
      }
    }
```
into this:
```js
    Analytics.accounts()
      .then(queryWebProperties)
      .catch(updatePage);
```

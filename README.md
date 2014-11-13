# http-responses

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Middleware for standardizing the way you send HTTP response statuses.

Prevents inconsistencies in your code by standardizing the way you handle sending HTTP response statuses and bodies.

###### Before

```js
res.status(401)
res.send(401, body)
res.json(401, body)
next({ status: 401, message: body })
next({ code: 401, message: body })
next(401)
```

###### After

```js
return next(new res.Unauthorized(body))
```

## Install

```sh
$ npm install http-responses
```

Express.js

```js
app.use(require('http-responses'))
```

## Api

### Informational Methods

- 100: `res.Continue()`
- 101: `res.SwitchingProtocols(String protocols)`
- 102: `res.Processing()`

### Success Methods

- 200: `res.Ok([view, ]body)`

  view is optional, and body can be `String`, `Object`, or `Function`
- 204: `res.NoContent()`

### Redirect Methods

- 300: `res.redirect` - native express method.
- 301: `res.MovedPermanently(location)`
- 302: `res.Found(location)`
- 307: `res.TemporaryRedirect(location)`
- 308: `res.PermanentRedirect(location)`

### Error Methods

**Properties**

`code` - optional, sub status-code (iis style); defaults to status code.

`message` - required, mixed type can be string, object, number, date, etc...

**Methods**

- 400: `new res.BadRequest([code, ]message)`
- 401: `new res.Unauthorized([code, ]message)`
- 402: `new res.PaymentRequired([code, ]message)`
- 403: `new res.Forbidden([code, ]message)`
- 404: `new res.NotFound([code, ]message)`
- 405: `new res.MethodNotAllowed([code, ]message)`
- 406: `new res.NotAcceptable([code, ]message)`
- 407: `new res.ProxyAuthenticationRequired([code, ]message)`
- 408: `new res.RequestTimeout([code, ]message)`
- 409: `new res.Conflict([code, ]message)`
- 411: `new res.LengthRequired([code, ]message)`
- 412: `new res.PreconditionFailed([code, ]message)`
- 413: `new res.PayloadTooLarge([code, ]message)`
- 414: `new res.URITooLong([code, ]message)`
- 415: `new res.UnsupportedMediaType([code, ]message)`
- 416: `new res.RangeNotSatisfied([code, ]message)`
- 417: `new res.ExpectationFailed([code, ]message)`
- 423: `new res.Locked([code, ]message)`
- 428: `new res.PreconditionRequired([code, ]message)`
- 429: `new res.TooManyRequests([code, ]message)`
- 500: `new res.InternalServerError([code, ]message)`
- 501: `new res.NotImplemented([code, ]message)`
- 502: `new res.BadGateway([code, ]message)`
- 503: `new res.ServiceUnavailable([code, ]message)`
- 504: `new res.GatewayTimeout([code, ]message)`
- 505: `new res.HTTPVersionNotSupported([code, ]message)`
- 507: `new res.InsufficientStorage([code, ]message)`
- 508: `new res.LoopDetected([code, ]message)`
- 510: `new res.NotExtended([code, ]message)`
- 511: `new res.NetworkAuthenticationRequired([code, ]message)`

**Special Methods**

- 426: `res.UpgradeRequired(String protocols,[code, ]message)`

## Usage Example

```js
app.use('/:id', function (req, res, next) {
  if (!req.param('id', false)) {
    return next(new res.Conflict('Id is required.'));
  }

  return res.Ok({
    id: id
  });
});
```

## Express Error Handler

```js
app.use(function (err, req, res, next) {
  res.status(err.status).format({
    json: function () {
      res.json({
        code: err.code,
        message: err.message
      });
    },

    html: function () {
      res.render(err.status, {
        code: err.code,
        message: err.message
      });
    }
  });
});
```

## Supported Frameworks

- [Express][express-url]
- [Connect][connect-url]

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/http-responses.svg?style=flat
[npm-url]: https://npmjs.org/package/http-responses
[travis-image]: https://img.shields.io/travis/Nijikokun/http-responses.svg?style=flat
[travis-url]: https://travis-ci.org/Nijikokun/http-responses
[coveralls-image]: https://img.shields.io/coveralls/Nijikokun/http-responses.svg?style=flat
[coveralls-url]: https://coveralls.io/r/Nijikokun/http-responses?branch=master
[downloads-image]: https://img.shields.io/npm/dm/http-responses.svg?style=flat
[downloads-url]: https://npmjs.org/package/http-responses
[gratipay-image]: https://img.shields.io/gratipay/Nijikokun.svg?style=flat
[gratipay-url]: https://www.gratipay.com/Nijikokun/
[express-url]: https://expressjs.com
[connect-url]: https://github.com/senchalabs/connect

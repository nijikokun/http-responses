/*!
 * http-responses
 * Copyright(c) 2014 Nijiko Yonskai <nijikokun@gmail.com>
 * MIT Licensed
 */

var xml = require('js2xmlparser');

/**
 * Response error codes, and content negotiation methods.
 * @type {Object}
 * @private
 */
var ResponseTypes = {
  // Error Types
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  URITooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfied: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  Locked: 423,

  UpgradeRequired: function (protocols, code, message) {
    var error = GenericRestError(426);
    this.set('Upgrade', protocols);
    return new error(code, message);
  },

  PreconditionRequired: 428,
  TooManyRequests: 429,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,

  // Redirect types
  MovedPermanently: function (location) {
    this.redirect(301, location);
  },

  Found: function (location) {
    this.redirect(302, location);
  },

  NotModified: function () {
    this.status(304).send();
  },

  TemporaryRedirect: function (location) {
    this.redirect(307, location);
  },

  PermanentRedirect: function (location) {
    this.redirect(308, location);
  },

  // Content Helpers
  ok: function (view, body, api) {
    var self = this;

    function handleGeneric () {
      return self.send(body);
    }

    function handleJSON () {
      return self.json(body);
    }

    function handleXML () {
      return self.set('Content-Type', 'application/xml').send(xml(view, body))
    }

    function handleHTML () {
      return self.render(view, body);
    }

    this.status(200);

    if (!body) {
      body = view;
      view = undefined;
    }

    if (typeof body === 'function') {
      body();
    } else {
      this.format({
        text: handleGeneric,
        json: handleJSON,

        xml: function () {
          if (view) {
            return handleXML();
          }

          return handleGeneric();
        },

        html: function () {
          if (view) {
            if (api) {
              return handleXML();
            }

            return handleHTML();
          }

          return handleGeneric();
        }
      });
    }
  },

  NoContent: function () {
    this.status(204).send();
  },

  Continue: function () {
    this.status(100).send();
  },

  SwitchingProtocols: function (protocols) {
    this.set('Upgrade', protocols).status(101).send();
  },

  Processing: function () {
    this.status(102).send();
  }
};

/**
 * Setup pre-defined status code for RestError method
 * @param {Number} status HTTP Status Code
 * @private
 */
function GenericRestError (status) {
  return function RestError (code, message, headers) {
    if (!message) {
      message = code;
      code = status;
    }

    this.status = status;
    this.code = code;
    this.message = message;
    this.headers = headers;
  };
}

/**
 * Iterates over ResponseTypes and sets appropriate method signature according to
 * content type of the object value. Skips property should a method already
 * exist on the middleware res object.
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Function} next
 */
module.exports = function (req, res, next) {
  var type;

  // Iterate over each response type, and implement appropriate call signature
  for (type in ResponseTypes) {
    if (ResponseTypes.hasOwnProperty(type) && !res[type]) {
      if (typeof ResponseTypes[type] === 'number') {
        res[type] = GenericRestError(ResponseTypes[type]);
      } else {
        res[type] = ResponseTypes[type].bind(res);
      }
    }
  }

  return next();
};

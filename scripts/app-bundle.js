define('app-constant',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var AppConstants = exports.AppConstants = {
        auth0Domain: 'personallog.eu.auth0.com',
        auth0ClientId: 'G4wIF5AYeG9Dtu4Y5yuOuXFrUYUzfLVu',
        baseUrl: "http://localhost:3008/api/v1/",
        assetsUrl: "http://localhost:3008/images"
    };
});
define('app-router',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AppRouter = AppRouter;
    function AppRouter(config) {
        config.title = 'Personal Log';
        config.options.pushState = true;

        config.map([{ route: '', moduleId: 'modules/home/home', title: 'Home' }, { route: 'home', moduleId: 'modules/home/home', title: 'Home' }, { route: 'feeds', moduleId: 'modules/feed/feed', title: 'Feeds', settings: { auth: true } }, { route: 'search', moduleId: 'modules/search/search', title: 'Search', settings: { auth: true } }]);
    }
});
define('app-service',['exports', 'aurelia-framework', './app-constant', 'aurelia-fetch-client', './services/authService/auth-service', 'lodash'], function (exports, _aureliaFramework, _appConstant, _aureliaFetchClient, _authService, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AppService = undefined;

    var _ = _interopRequireWildcard(_lodash);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var AppService = exports.AppService = (_dec = (0, _aureliaFramework.inject)(_authService.AuthService), _dec(_class = function () {
        function AppService(AuthService) {
            _classCallCheck(this, AppService);

            this.httpClient = new _aureliaFetchClient.HttpClient();
            this.httpClient.configure(function (config) {
                config.withBaseUrl(_appConstant.AppConstants.baseUrl).withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("id_token")
                    }
                }).withInterceptor({
                    request: function request(_request) {
                        return _request;
                    },
                    response: function response(_response) {
                        if (_response.status == 401) {
                            AuthService.login();
                        }
                        return _response;
                    }
                });
            });
        }

        AppService.prototype.getFeeds = function getFeeds() {
            return this.httpClient.fetch("feeds", {
                method: "get"
            }).then(function (data) {
                return data.json();
            });
        };

        AppService.prototype.createNewFeed = function createNewFeed(feed) {
            var form = new FormData();
            _.forEach(feed, function (value, key) {
                form.append(key, value);
            });

            return this.httpClient.fetch("feeds", {
                method: 'post',
                body: form
            }).then(function (data) {
                return data.json();
            });
        };

        AppService.prototype.deleteFeed = function deleteFeed(id) {
            return this.httpClient.fetch("feeds/" + id, {
                method: "delete"
            });
        };

        AppService.prototype.search = function search(input) {
            return this.httpClient.fetch("feeds/" + encodeURIComponent(input), {
                method: 'get'
            }).then(function (data) {
                return data.json();
            });
        };

        return AppService;
    }()) || _class);
});
define('app',['exports', 'aurelia-framework', 'aurelia-router', './app-constant', './services/authService/auth-service'], function (exports, _aureliaFramework, _aureliaRouter, _appConstant, _authService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_authService.AuthService), _dec(_class = function () {
    function App(AuthService) {
      _classCallCheck(this, App);

      this.authService = AuthService;
      console.log("AAAA");
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      this.router = router;
      config.title = 'Personal Log';
      config.map([{ route: '', moduleId: 'modules/home/home', title: 'Home' }, { route: 'home', moduleId: 'modules/home/home', title: 'Home' }, { route: 'feeds', moduleId: 'modules/feed/feed', title: 'Feeds', settings: { auth: true } }, { route: 'search', moduleId: 'modules/search/search', title: 'Search', settings: { auth: true } }]);

      config.mapUnknownRoutes('not-found');
      this.appTitle = config.title;
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('modules/feed/feed',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Feed = exports.Feed = function Feed() {
        _classCallCheck(this, Feed);

        console.log("Feed");
    };
});
define('modules/home/home',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Home = exports.Home = function Home() {
        _classCallCheck(this, Home);

        console.log("Home");
    };
});
define('modules/search/search',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Search = exports.Search = function Search() {
        _classCallCheck(this, Search);

        console.log("Search");
    };
});
define('services/authService/auth-service',['exports', 'aurelia-framework', 'jwt-decode', 'aurelia-router', '../../app-constant'], function (exports, _aureliaFramework, _jwtDecode, _aureliaRouter, _appConstant) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var jwt_decode = _interopRequireWildcard(_jwtDecode);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
    function AuthService(Router) {
      _classCallCheck(this, AuthService);

      this.auth0lock = {};
      this.router = Router;
      this.auth0lockPasswordless = {};
      this.auth0Options = {
        closable: false,
        language: 'de',
        theme: {
          logo: '/assets/img/icon-naw.jpg',
          primaryColor: '#D11E33'
        },
        languageDictionary: {
          emailInputPlaceholder: "max.meier@nowatwork.ch",
          title: "now@work",
          forgotPasswordAction: "Passwort vergessen? Zum ersten Mal hier?"
        },
        auth: {
          responseType: 'token',
          redirect: false,
          params: {
            scope: 'openid picture email name nickname auth'
          }
        }
      };

      this.auth0lock = new Auth0Lock(_appConstant.AppConstants.auth0ClientId, _appConstant.AppConstants.auth0Domain);

      this._registerAuthenticationListener();
    }

    AuthService.prototype._registerAuthenticationListener = function _registerAuthenticationListener() {
      var _this = this;

      this.auth0lock.on("authenticated", function (authResult) {
        _this.auth0lock.getProfile(authResult.idToken, function (error, profile) {
          if (error) {
            return;
          }

          localStorage.setItem('id_token', authResult.idToken);
          localStorage.setItem('profile', JSON.stringify(profile));
          _this.auth0lock.hide();
          _this.router.navigate('feeds');
        });
      });
    };

    AuthService.prototype.login = function login() {
      this.auth0lock.show();
    };

    AuthService.prototype.logout = function logout() {
      localStorage.removeItem('profile');
      localStorage.removeItem('id_token');
    };

    AuthService.prototype.isTokenValid = function isTokenValid() {
      return new Promise(function (resolve, reject) {
        var token = localStorage.getItem('id_token');
        if (!token) {
          return reject();
        }

        var jwtExp = jwt_decode(token).exp;
        var expiryDate = new Date(0);
        expiryDate.setUTCSeconds(jwtExp);

        if (new Date() < expiryDate) {
          return reject();
        }

        return resolve();
      });
    };

    AuthService.prototype.showLoginIfUnauthorized = function showLoginIfUnauthorized() {
      var _this2 = this;

      this.isTokenValid().then(function () {
        _this2.router.navigate('feeds');
      }).catch(function (error) {
        return _this2.login();
      });
    };

    return AuthService;
  }()) || _class);
});
define('jwt-decode/base64_url_decode',['require','exports','module','./atob'],function (require, exports, module) {var atob = require('./atob');

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

});

define('jwt-decode/atob',['require','exports','module'],function (require, exports, module) {/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./styles/main.css\"></require>\n\n  <router-view></router-view>\n</template>\n"; });
define('text!modules/feed/feed.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"pl-container\">\r\n        \r\n    </div>\r\n</template>"; });
define('text!modules/home/home.html', ['module'], function(module) { module.exports = "<template>\r\n    AAAAAAAAAA\r\n</template>"; });
define('text!modules/search/search.html', ['module'], function(module) { module.exports = "<template>\r\n    CCCCCCCCCC\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map
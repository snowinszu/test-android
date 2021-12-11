(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["MP4Proxy"] = factory();
    else
        root["MP4Proxy"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId]) {
                /******/ 			return installedModules[moduleId].exports;
                /******/ 		}
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = installedModules[moduleId] = {
                /******/ 			i: moduleId,
                /******/ 			l: false,
                /******/ 			exports: {}
                /******/ 		};
            /******/
            /******/ 		// Execute the module function
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/ 		module.l = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// define getter function for harmony exports
        /******/ 	__webpack_require__.d = function(exports, name, getter) {
            /******/ 		if(!__webpack_require__.o(exports, name)) {
                /******/ 			Object.defineProperty(exports, name, {
                    /******/ 				configurable: false,
                    /******/ 				enumerable: true,
                    /******/ 				get: getter
                    /******/ 			});
                /******/ 		}
            /******/ 	};
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/ 	__webpack_require__.n = function(module) {
            /******/ 		var getter = module && module.__esModule ?
                /******/ 			function getDefault() { return module['default']; } :
                /******/ 			function getModuleExports() { return module; };
            /******/ 		__webpack_require__.d(getter, 'a', getter);
            /******/ 		return getter;
            /******/ 	};
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "/src/";
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(__webpack_require__.s = 2);
        /******/ })
        /************************************************************************/
        /******/ ([
            /* 0 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                module.exports = __webpack_require__(3);

                /***/ }),
            /* 1 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                module.exports = function (module) {
                    if (!module.webpackPolyfill) {
                        module.deprecate = function () {};
                        module.paths = [];
                        // module.parent = undefined by default
                        if (!module.children) module.children = [];
                        Object.defineProperty(module, "loaded", {
                            enumerable: true,
                            get: function get() {
                                return module.l;
                            }
                        });
                        Object.defineProperty(module, "id", {
                            enumerable: true,
                            get: function get() {
                                return module.i;
                            }
                        });
                        module.webpackPolyfill = 1;
                    }
                    return module;
                };

                /***/ }),
            /* 2 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });

                var _regenerator = __webpack_require__(0);

                var _regenerator2 = _interopRequireDefault(_regenerator);

                var handleMediaRequest = function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(request, clientId, url, rangeStart, rangeEnd) {
                        var client, streamKey, total, streamInfo, msg, data, clientAlive, stream, respHeader;
                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        _context3.next = 2;
                                        return self.clients.get(clientId);

                                    case 2:
                                        client = _context3.sent;

                                        if (client) {
                                            _context3.next = 6;
                                            break;
                                        }

                                        if (debug) console.warn("windowClient not exist");
                                        return _context3.abrupt("return", fetch(request));

                                    case 6:
                                        streamKey = url + "-" + clientId;
                                        total = 0;

                                        if (!streamMapping.has(streamKey)) {
                                            _context3.next = 20;
                                            break;
                                        }

                                        streamInfo = streamMapping.get(streamKey);

                                        if (streamInfo.active) {
                                            _context3.next = 12;
                                            break;
                                        }

                                        return _context3.abrupt("return", fetch(request));

                                    case 12:
                                        streamInfo.stream.closed = true;
                                        total = streamInfo.total;
                                        // streamMapping.delete(streamKey);
                                        streamInfo.offset = rangeStart;
                                        streamInfo.rangeStart = rangeStart;
                                        streamInfo.closed = false;
                                        streamInfo.loading = false;
                                        _context3.next = 45;
                                        break;

                                    case 20:
                                        lengthRequesting = true;
                                        _context3.prev = 21;
                                        _context3.next = 24;
                                        return msgClient.sendMessageToClient(client, {
                                            action: _events2.default.SW_MEDIA,
                                            data: {
                                                url: url
                                                // total,
                                            }
                                        }, MSG_SEND_TIMEOUT);

                                    case 24:
                                        msg = _context3.sent;

                                        lengthRequesting = false;
                                        data = msg.data;

                                        if (!(!data || !data.active)) {
                                            _context3.next = 31;
                                            break;
                                        }

                                        if (debug) console.warn('window client is not active');
                                        streamMapping.set(streamKey, {
                                            active: false,
                                            clientId: clientId
                                        });
                                        return _context3.abrupt("return", fetch(request));

                                    case 31:
                                        if (data.total) {
                                            _context3.next = 34;
                                            break;
                                        }

                                        if (debug) console.warn('cannot get file length');
                                        return _context3.abrupt("return", fetch(request));

                                    case 34:
                                        debug = data && data.debug;
                                        if (data.fragSize) fragSize = data.fragSize;
                                        total = data.total;
                                        // console.warn(`total is ${total}`);
                                        streamMapping.set(streamKey, {
                                            active: true,
                                            offset: rangeStart,
                                            rangeStart: rangeStart,
                                            total: total,
                                            closed: false,
                                            clientId: clientId,
                                            loading: false
                                        });
                                        _context3.next = 45;
                                        break;

                                    case 40:
                                        _context3.prev = 40;
                                        _context3.t0 = _context3["catch"](21);

                                        lengthRequesting = false;
                                        if (debug) console.warn(_context3.t0);
                                        return _context3.abrupt("return", fetch(request));

                                    case 45:
                                        if (!rangeEnd) {
                                            rangeEnd = total - 1;
                                        }
                                        clientAlive = true;
                                        // let clientAlive = false;

                                        stream = new ReadableStream({
                                            start: function start(controller) {
                                                if (debug) console.log("ReadableStream start range " + rangeStart + "-" + (rangeEnd || ''));
                                            },
                                            pull: function pull(controller) {
                                                var _this = this;

                                                var range = void 0;
                                                if (stream.closed) {
                                                    if (debug) console.warn("stream is closed");
                                                    return;
                                                }
                                                var streamInfo = streamMapping.get(streamKey);
                                                if (!streamInfo) return;
                                                if (streamInfo.offset >= rangeEnd) {
                                                    if (debug) console.info("reach end, close controller");
                                                    controller.close();
                                                    streamInfo.closed = true;
                                                    return;
                                                }
                                                if (streamInfo.loading) {
                                                    if (debug) console.warn("stream is loading");
                                                    return;
                                                }
                                                streamInfo.loading = true;
                                                var startByte = streamInfo.offset;
                                                var endByte = (0, _swTool.getEndByteOfFrag)(startByte, fragSize, rangeEnd);
                                                range = "bytes=" + startByte + "-" + endByte;
                                                if (debug) console.log("ReadableStream pull " + range);
                                                streamInfo.offset += endByte - startByte + 1;
                                                return new Promise(function () {
                                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(resolve, reject) {
                                                        var _msg, _data;

                                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                            while (1) {
                                                                switch (_context2.prev = _context2.next) {
                                                                    case 0:
                                                                        if (!clientAlive) {
                                                                            _context2.next = 22;
                                                                            break;
                                                                        }

                                                                        _context2.prev = 1;
                                                                        _context2.next = 4;
                                                                        return msgClient.sendMessageToClient(client, {
                                                                            action: _events2.default.SW_GET_FRAG,
                                                                            data: {
                                                                                url: url,
                                                                                start: startByte,
                                                                                end: endByte
                                                                            }
                                                                        }, FRAG_LOAD_TIMEOUT);

                                                                    case 4:
                                                                        _msg = _context2.sent;
                                                                        _data = _msg.data;

                                                                        if (!(_data && _data.buffer)) {
                                                                            _context2.next = 14;
                                                                            break;
                                                                        }

                                                                        if (debug) console.info("hit cache range " + startByte + "-" + endByte + " size " + _data.buffer.byteLength);
                                                                        controller.enqueue(new Uint8Array(_data.buffer));
                                                                        streamInfo.loading = false;
                                                                        resolve();
                                                                        return _context2.abrupt("return");

                                                                    case 14:
                                                                        if (debug) console.info("miss cache range " + startByte + "-" + endByte);

                                                                    case 15:
                                                                        _context2.next = 20;
                                                                        break;

                                                                    case 17:
                                                                        _context2.prev = 17;
                                                                        _context2.t0 = _context2["catch"](1);

                                                                        if (debug) console.warn(_context2.t0);
                                                                    // clientAlive = false;

                                                                    case 20:
                                                                        _context2.next = 23;
                                                                        break;

                                                                    case 22:
                                                                        if (debug) console.warn("windowClient not alive");

                                                                    case 23:
                                                                        if (debug) console.log("fetch range " + range + " from network");
                                                                        fetch(url, {
                                                                            headers: {
                                                                                Range: range
                                                                            },
                                                                            mode: "cors"
                                                                        }).then(function () {
                                                                            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(response) {
                                                                                return _regenerator2.default.wrap(function _callee$(_context) {
                                                                                    while (1) {
                                                                                        switch (_context.prev = _context.next) {
                                                                                            case 0:
                                                                                                _context.t0 = msgClient;
                                                                                                _context.t1 = client;
                                                                                                _context.t2 = _events2.default.SW_FRAG;
                                                                                                _context.t3 = url;
                                                                                                _context.t4 = startByte;
                                                                                                _context.t5 = endByte;
                                                                                                _context.next = 8;
                                                                                                return response.clone().arrayBuffer();

                                                                                            case 8:
                                                                                                _context.t6 = _context.sent;
                                                                                                _context.t7 = {
                                                                                                    url: _context.t3,
                                                                                                    start: _context.t4,
                                                                                                    end: _context.t5,
                                                                                                    buffer: _context.t6
                                                                                                };
                                                                                                _context.t8 = {
                                                                                                    action: _context.t2,
                                                                                                    data: _context.t7
                                                                                                };
                                                                                                _context.t9 = FRAG_SEND_TIMEOUT;

                                                                                                _context.t10 = function (err) {
                                                                                                    if (debug) console.warn(err);
                                                                                                };

                                                                                                _context.t0.sendMessageToClient.call(_context.t0, _context.t1, _context.t8, _context.t9).catch(_context.t10);

                                                                                                return _context.abrupt("return", response.arrayBuffer());

                                                                                            case 15:
                                                                                            case "end":
                                                                                                return _context.stop();
                                                                                        }
                                                                                    }
                                                                                }, _callee, _this);
                                                                            }));

                                                                            return function (_x8) {
                                                                                return _ref3.apply(this, arguments);
                                                                            };
                                                                        }()).then(function (buffer) {
                                                                            var streamInfo = streamMapping.get(streamKey);
                                                                            if (!streamInfo) return;
                                                                            if (streamInfo.rangeStart !== rangeStart) {
                                                                                if (debug) console.info("stream from " + rangeStart + " destroyed");
                                                                                controller.close();
                                                                                return;
                                                                            }
                                                                            if (streamInfo.closed) {
                                                                                if (debug) console.info("stream is closed");
                                                                                return;
                                                                            }
                                                                            if (debug) console.log("controller enqueue buffer " + range);
                                                                            controller.enqueue(new Uint8Array(buffer));
                                                                            streamInfo.loading = false;
                                                                            resolve();
                                                                        }).catch(function (err) {
                                                                            streamInfo.loading = false;
                                                                            if (debug) console.error(err);
                                                                            controller.error(err);
                                                                            reject();
                                                                        });

                                                                    case 25:
                                                                    case "end":
                                                                        return _context2.stop();
                                                                }
                                                            }
                                                        }, _callee2, _this, [[1, 17]]);
                                                    }));

                                                    return function (_x6, _x7) {
                                                        return _ref2.apply(this, arguments);
                                                    };
                                                }());
                                            },
                                            cancel: function cancel(reason) {
                                                if (debug) console.warn("ReadableStream cancel reason " + reason);
                                            }
                                        });

                                        streamMapping.get(streamKey).stream = stream;
                                        respHeader = new Headers();

                                        respHeader.set('Content-Type', 'video/mp4');
                                        respHeader.set('Content-Length', "" + (total - rangeStart));
                                        respHeader.set('Content-Range', "bytes " + rangeStart + "-" + (total - 1) + "/" + total);
                                        return _context3.abrupt("return", new Response(stream, {
                                            status: 206,
                                            statusText: 'Partial Content',
                                            headers: respHeader
                                        }));

                                    case 54:
                                    case "end":
                                        return _context3.stop();
                                }
                            }
                        }, _callee3, this, [[21, 40]]);
                    }));

                    return function handleMediaRequest(_x, _x2, _x3, _x4, _x5) {
                        return _ref.apply(this, arguments);
                    };
                }();

                var _messageClient = __webpack_require__(5);

                var _messageClient2 = _interopRequireDefault(_messageClient);

                var _events = __webpack_require__(6);

                var _events2 = _interopRequireDefault(_events);

                var _swTool = __webpack_require__(8);

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                var MP4_MEDIA_FILES = ['mp4', 'm4a', 'mkv'];
                var MSG_SEND_TIMEOUT = 1500;
                var FRAG_LOAD_TIMEOUT = 7000;
                var FRAG_SEND_TIMEOUT = 2500;
                var fragSize = 512 * 1024;
                var debug = false;
// let debug = true;
                var lengthRequesting = false;
                var msgClient = new _messageClient2.default();
                var streamMapping = new Map(); // url => { offset, total, clientId, rangeStart, closed }

                var MP4Proxy = function MP4Proxy() {
                    _classCallCheck(this, MP4Proxy);
                };

                exports.default = MP4Proxy;


                self.addEventListener('install', function (event) {
                    return event.waitUntil(self.skipWaiting());
                });
                self.addEventListener('activate', function (event) {
                    return event.waitUntil(self.clients.claim());
                });
                self.addEventListener('fetch', onFetch);

                function onFetch(event) {
                    // console.warn(`sw onFetch`)
                    // console.warn(event)
                    var request = event.request,
                        clientId = event.clientId;

                    if (request.method !== 'GET') {
                        return;
                    }
                    var url = request.url;

                    var suffix = (0, _swTool.getUrlSuffix)(url);
                    if (MP4_MEDIA_FILES.includes(suffix)) {
                        if (lengthRequesting) {
                            if (debug) console.warn("file length is requesting");
                            return;
                        }
                        if (streamMapping.size > 10) {
                            streamMapping.clear();
                        }
                        var headers = request.headers,
                            _url = request.url;

                        var range = headers.get("range") || undefined;
                        if (debug) console.info("requesting " + _url + " range " + range);

                        var _parseRangeHeader = (0, _swTool.parseRangeHeader)(range),
                            rangeStart = _parseRangeHeader.start,
                            rangeEnd = _parseRangeHeader.end;
                        // console.warn(`rangeStart ${rangeStart} rangeEnd ${rangeEnd}`)
                        // 忽略范围请求


                        if (rangeEnd && rangeEnd - rangeStart <= 100 || rangeEnd === 0) {
                            if (debug) console.warn("ignore media request range " + rangeStart + "-" + rangeEnd);
                            return;
                        }
                        return event.respondWith(handleMediaRequest(request, clientId, _url, rangeStart, rangeEnd));
                    }
                }

                MP4Proxy.version = "0.1.0";
                module.exports = exports["default"];

                /***/ }),
            /* 3 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                /**
                 * Copyright (c) 2014-present, Facebook, Inc.
                 *
                 * This source code is licensed under the MIT license found in the
                 * LICENSE file in the root directory of this source tree.
                 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
                var g = function () {
                    return this;
                }() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
                var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
                var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
                g.regeneratorRuntime = undefined;

                module.exports = __webpack_require__(4);

                if (hadRuntime) {
                    // Restore the original runtime.
                    g.regeneratorRuntime = oldRuntime;
                } else {
                    // Remove the global property added by runtime.js.
                    try {
                        delete g.regeneratorRuntime;
                    } catch (e) {
                        g.regeneratorRuntime = undefined;
                    }
                }

                /***/ }),
            /* 4 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";
                /* WEBPACK VAR INJECTION */(function(module) {

                    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

                    /**
                     * Copyright (c) 2014-present, Facebook, Inc.
                     *
                     * This source code is licensed under the MIT license found in the
                     * LICENSE file in the root directory of this source tree.
                     */

                    !function (global) {
                        "use strict";

                        var Op = Object.prototype;
                        var hasOwn = Op.hasOwnProperty;
                        var undefined; // More compressible than void 0.
                        var $Symbol = typeof Symbol === "function" ? Symbol : {};
                        var iteratorSymbol = $Symbol.iterator || "@@iterator";
                        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
                        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

                        var inModule = ( false ? "undefined" : _typeof(module)) === "object";
                        var runtime = global.regeneratorRuntime;
                        if (runtime) {
                            if (inModule) {
                                // If regeneratorRuntime is defined globally and we're in a module,
                                // make the exports object identical to regeneratorRuntime.
                                module.exports = runtime;
                            }
                            // Don't bother evaluating the rest of this file if the runtime was
                            // already defined globally.
                            return;
                        }

                        // Define the runtime globally (as expected by generated code) as either
                        // module.exports (if we're in a module) or a new, empty object.
                        runtime = global.regeneratorRuntime = inModule ? module.exports : {};

                        function wrap(innerFn, outerFn, self, tryLocsList) {
                            // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
                            var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
                            var generator = Object.create(protoGenerator.prototype);
                            var context = new Context(tryLocsList || []);

                            // The ._invoke method unifies the implementations of the .next,
                            // .throw, and .return methods.
                            generator._invoke = makeInvokeMethod(innerFn, self, context);

                            return generator;
                        }
                        runtime.wrap = wrap;

                        // Try/catch helper to minimize deoptimizations. Returns a completion
                        // record like context.tryEntries[i].completion. This interface could
                        // have been (and was previously) designed to take a closure to be
                        // invoked without arguments, but in all the cases we care about we
                        // already have an existing method we want to call, so there's no need
                        // to create a new function object. We can even get away with assuming
                        // the method takes exactly one argument, since that happens to be true
                        // in every case, so we don't have to touch the arguments object. The
                        // only additional allocation required is the completion record, which
                        // has a stable shape and so hopefully should be cheap to allocate.
                        function tryCatch(fn, obj, arg) {
                            try {
                                return { type: "normal", arg: fn.call(obj, arg) };
                            } catch (err) {
                                return { type: "throw", arg: err };
                            }
                        }

                        var GenStateSuspendedStart = "suspendedStart";
                        var GenStateSuspendedYield = "suspendedYield";
                        var GenStateExecuting = "executing";
                        var GenStateCompleted = "completed";

                        // Returning this object from the innerFn has the same effect as
                        // breaking out of the dispatch switch statement.
                        var ContinueSentinel = {};

                        // Dummy constructor functions that we use as the .constructor and
                        // .constructor.prototype properties for functions that return Generator
                        // objects. For full spec compliance, you may wish to configure your
                        // minifier not to mangle the names of these two functions.
                        function Generator() {}
                        function GeneratorFunction() {}
                        function GeneratorFunctionPrototype() {}

                        // This is a polyfill for %IteratorPrototype% for environments that
                        // don't natively support it.
                        var IteratorPrototype = {};
                        IteratorPrototype[iteratorSymbol] = function () {
                            return this;
                        };

                        var getProto = Object.getPrototypeOf;
                        var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
                        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
                            // This environment has a native %IteratorPrototype%; use it instead
                            // of the polyfill.
                            IteratorPrototype = NativeIteratorPrototype;
                        }

                        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
                        GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
                        GeneratorFunctionPrototype.constructor = GeneratorFunction;
                        GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

                        // Helper for defining the .next, .throw, and .return methods of the
                        // Iterator interface in terms of a single ._invoke method.
                        function defineIteratorMethods(prototype) {
                            ["next", "throw", "return"].forEach(function (method) {
                                prototype[method] = function (arg) {
                                    return this._invoke(method, arg);
                                };
                            });
                        }

                        runtime.isGeneratorFunction = function (genFun) {
                            var ctor = typeof genFun === "function" && genFun.constructor;
                            return ctor ? ctor === GeneratorFunction ||
                                // For the native GeneratorFunction constructor, the best we can
                                // do is to check its .name property.
                                (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
                        };

                        runtime.mark = function (genFun) {
                            if (Object.setPrototypeOf) {
                                Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
                            } else {
                                genFun.__proto__ = GeneratorFunctionPrototype;
                                if (!(toStringTagSymbol in genFun)) {
                                    genFun[toStringTagSymbol] = "GeneratorFunction";
                                }
                            }
                            genFun.prototype = Object.create(Gp);
                            return genFun;
                        };

                        // Within the body of any async function, `await x` is transformed to
                        // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
                        // `hasOwn.call(value, "__await")` to determine if the yielded value is
                        // meant to be awaited.
                        runtime.awrap = function (arg) {
                            return { __await: arg };
                        };

                        function AsyncIterator(generator) {
                            function invoke(method, arg, resolve, reject) {
                                var record = tryCatch(generator[method], generator, arg);
                                if (record.type === "throw") {
                                    reject(record.arg);
                                } else {
                                    var result = record.arg;
                                    var value = result.value;
                                    if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
                                        return Promise.resolve(value.__await).then(function (value) {
                                            invoke("next", value, resolve, reject);
                                        }, function (err) {
                                            invoke("throw", err, resolve, reject);
                                        });
                                    }

                                    return Promise.resolve(value).then(function (unwrapped) {
                                        // When a yielded Promise is resolved, its final value becomes
                                        // the .value of the Promise<{value,done}> result for the
                                        // current iteration. If the Promise is rejected, however, the
                                        // result for this iteration will be rejected with the same
                                        // reason. Note that rejections of yielded Promises are not
                                        // thrown back into the generator function, as is the case
                                        // when an awaited Promise is rejected. This difference in
                                        // behavior between yield and await is important, because it
                                        // allows the consumer to decide what to do with the yielded
                                        // rejection (swallow it and continue, manually .throw it back
                                        // into the generator, abandon iteration, whatever). With
                                        // await, by contrast, there is no opportunity to examine the
                                        // rejection reason outside the generator function, so the
                                        // only option is to throw it from the await expression, and
                                        // let the generator function handle the exception.
                                        result.value = unwrapped;
                                        resolve(result);
                                    }, reject);
                                }
                            }

                            var previousPromise;

                            function enqueue(method, arg) {
                                function callInvokeWithMethodAndArg() {
                                    return new Promise(function (resolve, reject) {
                                        invoke(method, arg, resolve, reject);
                                    });
                                }

                                return previousPromise =
                                    // If enqueue has been called before, then we want to wait until
                                    // all previous Promises have been resolved before calling invoke,
                                    // so that results are always delivered in the correct order. If
                                    // enqueue has not been called before, then it is important to
                                    // call invoke immediately, without waiting on a callback to fire,
                                    // so that the async generator function has the opportunity to do
                                    // any necessary setup in a predictable way. This predictability
                                    // is why the Promise constructor synchronously invokes its
                                    // executor callback, and why async functions synchronously
                                    // execute code before the first await. Since we implement simple
                                    // async functions in terms of async generators, it is especially
                                    // important to get this right, even though it requires care.
                                    previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
                                        // Avoid propagating failures to Promises returned by later
                                        // invocations of the iterator.
                                        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                            }

                            // Define the unified helper method that is used to implement .next,
                            // .throw, and .return (see defineIteratorMethods).
                            this._invoke = enqueue;
                        }

                        defineIteratorMethods(AsyncIterator.prototype);
                        AsyncIterator.prototype[asyncIteratorSymbol] = function () {
                            return this;
                        };
                        runtime.AsyncIterator = AsyncIterator;

                        // Note that simple async functions are implemented on top of
                        // AsyncIterator objects; they just return a Promise for the value of
                        // the final result produced by the iterator.
                        runtime.async = function (innerFn, outerFn, self, tryLocsList) {
                            var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

                            return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
                                : iter.next().then(function (result) {
                                    return result.done ? result.value : iter.next();
                                });
                        };

                        function makeInvokeMethod(innerFn, self, context) {
                            var state = GenStateSuspendedStart;

                            return function invoke(method, arg) {
                                if (state === GenStateExecuting) {
                                    throw new Error("Generator is already running");
                                }

                                if (state === GenStateCompleted) {
                                    if (method === "throw") {
                                        throw arg;
                                    }

                                    // Be forgiving, per 25.3.3.3.3 of the spec:
                                    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                                    return doneResult();
                                }

                                context.method = method;
                                context.arg = arg;

                                while (true) {
                                    var delegate = context.delegate;
                                    if (delegate) {
                                        var delegateResult = maybeInvokeDelegate(delegate, context);
                                        if (delegateResult) {
                                            if (delegateResult === ContinueSentinel) continue;
                                            return delegateResult;
                                        }
                                    }

                                    if (context.method === "next") {
                                        // Setting context._sent for legacy support of Babel's
                                        // function.sent implementation.
                                        context.sent = context._sent = context.arg;
                                    } else if (context.method === "throw") {
                                        if (state === GenStateSuspendedStart) {
                                            state = GenStateCompleted;
                                            throw context.arg;
                                        }

                                        context.dispatchException(context.arg);
                                    } else if (context.method === "return") {
                                        context.abrupt("return", context.arg);
                                    }

                                    state = GenStateExecuting;

                                    var record = tryCatch(innerFn, self, context);
                                    if (record.type === "normal") {
                                        // If an exception is thrown from innerFn, we leave state ===
                                        // GenStateExecuting and loop back for another invocation.
                                        state = context.done ? GenStateCompleted : GenStateSuspendedYield;

                                        if (record.arg === ContinueSentinel) {
                                            continue;
                                        }

                                        return {
                                            value: record.arg,
                                            done: context.done
                                        };
                                    } else if (record.type === "throw") {
                                        state = GenStateCompleted;
                                        // Dispatch the exception by looping back around to the
                                        // context.dispatchException(context.arg) call above.
                                        context.method = "throw";
                                        context.arg = record.arg;
                                    }
                                }
                            };
                        }

                        // Call delegate.iterator[context.method](context.arg) and handle the
                        // result, either by returning a { value, done } result from the
                        // delegate iterator, or by modifying context.method and context.arg,
                        // setting context.delegate to null, and returning the ContinueSentinel.
                        function maybeInvokeDelegate(delegate, context) {
                            var method = delegate.iterator[context.method];
                            if (method === undefined) {
                                // A .throw or .return when the delegate iterator has no .throw
                                // method always terminates the yield* loop.
                                context.delegate = null;

                                if (context.method === "throw") {
                                    if (delegate.iterator.return) {
                                        // If the delegate iterator has a return method, give it a
                                        // chance to clean up.
                                        context.method = "return";
                                        context.arg = undefined;
                                        maybeInvokeDelegate(delegate, context);

                                        if (context.method === "throw") {
                                            // If maybeInvokeDelegate(context) changed context.method from
                                            // "return" to "throw", let that override the TypeError below.
                                            return ContinueSentinel;
                                        }
                                    }

                                    context.method = "throw";
                                    context.arg = new TypeError("The iterator does not provide a 'throw' method");
                                }

                                return ContinueSentinel;
                            }

                            var record = tryCatch(method, delegate.iterator, context.arg);

                            if (record.type === "throw") {
                                context.method = "throw";
                                context.arg = record.arg;
                                context.delegate = null;
                                return ContinueSentinel;
                            }

                            var info = record.arg;

                            if (!info) {
                                context.method = "throw";
                                context.arg = new TypeError("iterator result is not an object");
                                context.delegate = null;
                                return ContinueSentinel;
                            }

                            if (info.done) {
                                // Assign the result of the finished delegate to the temporary
                                // variable specified by delegate.resultName (see delegateYield).
                                context[delegate.resultName] = info.value;

                                // Resume execution at the desired location (see delegateYield).
                                context.next = delegate.nextLoc;

                                // If context.method was "throw" but the delegate handled the
                                // exception, let the outer generator proceed normally. If
                                // context.method was "next", forget context.arg since it has been
                                // "consumed" by the delegate iterator. If context.method was
                                // "return", allow the original .return call to continue in the
                                // outer generator.
                                if (context.method !== "return") {
                                    context.method = "next";
                                    context.arg = undefined;
                                }
                            } else {
                                // Re-yield the result returned by the delegate method.
                                return info;
                            }

                            // The delegate iterator is finished, so forget it and continue with
                            // the outer generator.
                            context.delegate = null;
                            return ContinueSentinel;
                        }

                        // Define Generator.prototype.{next,throw,return} in terms of the
                        // unified ._invoke helper method.
                        defineIteratorMethods(Gp);

                        Gp[toStringTagSymbol] = "Generator";

                        // A Generator should always return itself as the iterator object when the
                        // @@iterator function is called on it. Some browsers' implementations of the
                        // iterator prototype chain incorrectly implement this, causing the Generator
                        // object to not be returned from this call. This ensures that doesn't happen.
                        // See https://github.com/facebook/regenerator/issues/274 for more details.
                        Gp[iteratorSymbol] = function () {
                            return this;
                        };

                        Gp.toString = function () {
                            return "[object Generator]";
                        };

                        function pushTryEntry(locs) {
                            var entry = { tryLoc: locs[0] };

                            if (1 in locs) {
                                entry.catchLoc = locs[1];
                            }

                            if (2 in locs) {
                                entry.finallyLoc = locs[2];
                                entry.afterLoc = locs[3];
                            }

                            this.tryEntries.push(entry);
                        }

                        function resetTryEntry(entry) {
                            var record = entry.completion || {};
                            record.type = "normal";
                            delete record.arg;
                            entry.completion = record;
                        }

                        function Context(tryLocsList) {
                            // The root entry object (effectively a try statement without a catch
                            // or a finally block) gives us a place to store values thrown from
                            // locations where there is no enclosing try statement.
                            this.tryEntries = [{ tryLoc: "root" }];
                            tryLocsList.forEach(pushTryEntry, this);
                            this.reset(true);
                        }

                        runtime.keys = function (object) {
                            var keys = [];
                            for (var key in object) {
                                keys.push(key);
                            }
                            keys.reverse();

                            // Rather than returning an object with a next method, we keep
                            // things simple and return the next function itself.
                            return function next() {
                                while (keys.length) {
                                    var key = keys.pop();
                                    if (key in object) {
                                        next.value = key;
                                        next.done = false;
                                        return next;
                                    }
                                }

                                // To avoid creating an additional object, we just hang the .value
                                // and .done properties off the next function object itself. This
                                // also ensures that the minifier will not anonymize the function.
                                next.done = true;
                                return next;
                            };
                        };

                        function values(iterable) {
                            if (iterable) {
                                var iteratorMethod = iterable[iteratorSymbol];
                                if (iteratorMethod) {
                                    return iteratorMethod.call(iterable);
                                }

                                if (typeof iterable.next === "function") {
                                    return iterable;
                                }

                                if (!isNaN(iterable.length)) {
                                    var i = -1,
                                        next = function next() {
                                            while (++i < iterable.length) {
                                                if (hasOwn.call(iterable, i)) {
                                                    next.value = iterable[i];
                                                    next.done = false;
                                                    return next;
                                                }
                                            }

                                            next.value = undefined;
                                            next.done = true;

                                            return next;
                                        };

                                    return next.next = next;
                                }
                            }

                            // Return an iterator with no values.
                            return { next: doneResult };
                        }
                        runtime.values = values;

                        function doneResult() {
                            return { value: undefined, done: true };
                        }

                        Context.prototype = {
                            constructor: Context,

                            reset: function reset(skipTempReset) {
                                this.prev = 0;
                                this.next = 0;
                                // Resetting context._sent for legacy support of Babel's
                                // function.sent implementation.
                                this.sent = this._sent = undefined;
                                this.done = false;
                                this.delegate = null;

                                this.method = "next";
                                this.arg = undefined;

                                this.tryEntries.forEach(resetTryEntry);

                                if (!skipTempReset) {
                                    for (var name in this) {
                                        // Not sure about the optimal order of these conditions:
                                        if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                                            this[name] = undefined;
                                        }
                                    }
                                }
                            },

                            stop: function stop() {
                                this.done = true;

                                var rootEntry = this.tryEntries[0];
                                var rootRecord = rootEntry.completion;
                                if (rootRecord.type === "throw") {
                                    throw rootRecord.arg;
                                }

                                return this.rval;
                            },

                            dispatchException: function dispatchException(exception) {
                                if (this.done) {
                                    throw exception;
                                }

                                var context = this;
                                function handle(loc, caught) {
                                    record.type = "throw";
                                    record.arg = exception;
                                    context.next = loc;

                                    if (caught) {
                                        // If the dispatched exception was caught by a catch block,
                                        // then let that catch block handle the exception normally.
                                        context.method = "next";
                                        context.arg = undefined;
                                    }

                                    return !!caught;
                                }

                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    var record = entry.completion;

                                    if (entry.tryLoc === "root") {
                                        // Exception thrown outside of any try block that could handle
                                        // it, so set the completion value of the entire function to
                                        // throw the exception.
                                        return handle("end");
                                    }

                                    if (entry.tryLoc <= this.prev) {
                                        var hasCatch = hasOwn.call(entry, "catchLoc");
                                        var hasFinally = hasOwn.call(entry, "finallyLoc");

                                        if (hasCatch && hasFinally) {
                                            if (this.prev < entry.catchLoc) {
                                                return handle(entry.catchLoc, true);
                                            } else if (this.prev < entry.finallyLoc) {
                                                return handle(entry.finallyLoc);
                                            }
                                        } else if (hasCatch) {
                                            if (this.prev < entry.catchLoc) {
                                                return handle(entry.catchLoc, true);
                                            }
                                        } else if (hasFinally) {
                                            if (this.prev < entry.finallyLoc) {
                                                return handle(entry.finallyLoc);
                                            }
                                        } else {
                                            throw new Error("try statement without catch or finally");
                                        }
                                    }
                                }
                            },

                            abrupt: function abrupt(type, arg) {
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                                        var finallyEntry = entry;
                                        break;
                                    }
                                }

                                if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                                    // Ignore the finally entry if control is not jumping to a
                                    // location outside the try/catch block.
                                    finallyEntry = null;
                                }

                                var record = finallyEntry ? finallyEntry.completion : {};
                                record.type = type;
                                record.arg = arg;

                                if (finallyEntry) {
                                    this.method = "next";
                                    this.next = finallyEntry.finallyLoc;
                                    return ContinueSentinel;
                                }

                                return this.complete(record);
                            },

                            complete: function complete(record, afterLoc) {
                                if (record.type === "throw") {
                                    throw record.arg;
                                }

                                if (record.type === "break" || record.type === "continue") {
                                    this.next = record.arg;
                                } else if (record.type === "return") {
                                    this.rval = this.arg = record.arg;
                                    this.method = "return";
                                    this.next = "end";
                                } else if (record.type === "normal" && afterLoc) {
                                    this.next = afterLoc;
                                }

                                return ContinueSentinel;
                            },

                            finish: function finish(finallyLoc) {
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    if (entry.finallyLoc === finallyLoc) {
                                        this.complete(entry.completion, entry.afterLoc);
                                        resetTryEntry(entry);
                                        return ContinueSentinel;
                                    }
                                }
                            },

                            "catch": function _catch(tryLoc) {
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    if (entry.tryLoc === tryLoc) {
                                        var record = entry.completion;
                                        if (record.type === "throw") {
                                            var thrown = record.arg;
                                            resetTryEntry(entry);
                                        }
                                        return thrown;
                                    }
                                }

                                // The context.catch method must only be called with a location
                                // argument that corresponds to a known catch block.
                                throw new Error("illegal catch attempt");
                            },

                            delegateYield: function delegateYield(iterable, resultName, nextLoc) {
                                this.delegate = {
                                    iterator: values(iterable),
                                    resultName: resultName,
                                    nextLoc: nextLoc
                                };

                                if (this.method === "next") {
                                    // Deliberately forget the last sent value so that we don't
                                    // accidentally pass it on to the delegate.
                                    this.arg = undefined;
                                }

                                return ContinueSentinel;
                            }
                        };
                    }(
// In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
                        function () {
                            return this;
                        }() || Function("return this")());
                    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

                /***/ }),
            /* 5 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });

                var _regenerator = __webpack_require__(0);

                var _regenerator2 = _interopRequireDefault(_regenerator);

                var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                var MessageClient = function () {
                    function MessageClient() {
                        _classCallCheck(this, MessageClient);

                        this.sendMessageToClient = this.sendMessageToClient.bind(this);
                    }

                    _createClass(MessageClient, [{
                        key: 'sendMessageToClient',
                        value: function () {
                            var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(client, message, timeout) {
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                return _context.abrupt('return', new Promise(function (resolve, reject) {
                                                    if (!client) {
                                                        reject('client is null');
                                                        return;
                                                    }
                                                    var messageChannel = new MessageChannel();
                                                    messageChannel.port1.onmessage = function (event) {
                                                        // console.warn(event.data.data)
                                                        resolve({
                                                            data: event.data.data
                                                        });
                                                    };
                                                    messageChannel.port1.onmessageerror = function (event) {
                                                        reject(event);
                                                    };

                                                    // console.warn(`postMessage to client ${client.id} ${JSON.stringify(message)}`);
                                                    client.postMessage(message, [messageChannel.port2]);

                                                    // Set up the timeout
                                                    setTimeout(function () {
                                                        messageChannel.port1.close();
                                                        messageChannel.port2.close();

                                                        reject('MessageChannel ' + message.action + ' timed out after ' + timeout + ' ms');
                                                    }, timeout);
                                                }));

                                            case 1:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, this);
                            }));

                            function sendMessageToClient(_x, _x2, _x3) {
                                return _ref.apply(this, arguments);
                            }

                            return sendMessageToClient;
                        }()
                    }]);

                    return MessageClient;
                }();

                exports.default = MessageClient;
                module.exports = exports['default'];

                /***/ }),
            /* 6 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });

                var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

                var _events = __webpack_require__(7);

                var _events2 = _interopRequireDefault(_events);

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                exports.default = _extends({}, _events2.default, {

                    ERROR: 'error',
                    SW_MEDIA: 'SW_MEDIA',
                    SW_FRAG: 'SW_FRAG',
                    SW_GET_FRAG: 'SW_GET_FRAG',

                    FRAG_LOADED: 'FRAG_LOADED'
                });
                module.exports = exports['default'];

                /***/ }),
            /* 7 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                /**
                 * Created by xieting on 2018/4/3.
                 */

                exports.default = {
                    //data-channel
                    // DC_PING: 'PING',
                    // DC_PONG: 'PONG',
                    DC_SIGNAL: 'SIGNAL',
                    DC_OPEN: 'OPEN',
                    DC_REQUEST: 'REQUEST',
                    DC_PIECE_NOT_FOUND: 'PIECE_NOT_FOUND', // 当请求的数据找不到时触发
                    DC_PIECE_ABORT: 'PIECE_ABORT',
                    DC_CLOSE: 'CLOSE',
                    DC_RESPONSE: 'RESPONSE',
                    DC_ERROR: 'ERROR',
                    DC_PIECE: "PIECE",
                    DC_TIMEOUT: "TIMEOUT",
                    DC_PIECE_ACK: "PIECE_ACK",
                    DC_METADATA: "METADATA",
                    DC_PLAT_ANDROID: "ANDROID",
                    DC_PLAT_IOS: "IOS",
                    DC_PLAT_WEB: "WEB",
                    DC_CHOKE: "CHOKE",
                    DC_UNCHOKE: "UNCHOKE",
                    // DC_INTERESTED: "INTERESTED",
                    // DC_NOTINTERESTED: "NOT_INTERESTED",
                    DC_HAVE: "HAVE",
                    DC_LOST: "LOST",
                    DC_GET_PEERS: "GET_PEERS",
                    DC_PEERS: "PEERS",
                    DC_STATS: "STATS",
                    DC_SUBSCRIBE: "SUBSCRIBE",
                    DC_UNSUBSCRIBE: "UNSUBSCRIBE",
                    DC_SUBSCRIBE_ACCEPT: "SUBSCRIBE_ACCEPT",
                    DC_SUBSCRIBE_REJECT: "SUBSCRIBE_REJECT",
                    DC_SUBSCRIBE_LEVEL: "SUBSCRIBE_LEVEL",
                    DC_PEER_SIGNAL: "PEER_SIGNAL",
                    DC_PLAYLIST: "PLAYLIST",

                    //buffer-manager
                    BM_LOST: 'lost',
                    BM_ADDED_SEG_: 'BM_ADDED_SEG_',
                    BM_ADDED_SN_: 'BM_ADDED_SN_',
                    BM_SEG_ADDED: 'BM_SEG_ADDED',

                    // engine
                    FRAG_CHANGED: 'FRAG_CHANGED',
                    FRAG_LOADED: 'FRAG_LOADED',
                    FRAG_LOADING: 'FRAG_LOADING',
                    RESTART_P2P: 'RESTART_P2P',

                    EXCEPTION: "exception"
                };
                module.exports = exports['default'];

                /***/ }),
            /* 8 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.isClientAlive = undefined;

                var _regenerator = __webpack_require__(0);

                var _regenerator2 = _interopRequireDefault(_regenerator);

                var isClientAlive = exports.isClientAlive = function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(clientId) {
                        return _regenerator2.default.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        return _context.abrupt('return', clients.matchAll().then(function (cs) {
                                            return cs.some(function (c) {
                                                return c.id === clientId;
                                            });
                                        }));

                                    case 1:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, this);
                    }));

                    return function isClientAlive(_x) {
                        return _ref.apply(this, arguments);
                    };
                }();

                exports.parseRangeHeader = parseRangeHeader;
                exports.getUrlSuffix = getUrlSuffix;
                exports.makeHeadersWithRange = makeHeadersWithRange;
                exports.getEndByteOfFrag = getEndByteOfFrag;

                var _urlToolkit = __webpack_require__(9);

                var URLToolkit = _interopRequireWildcard(_urlToolkit);

                function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

                function parseRangeHeader(rangeHeader) {
                    if (!rangeHeader) return {};
                    var normalizedRangeHeader = rangeHeader.trim().toLowerCase();
                    if (!normalizedRangeHeader.startsWith('bytes=')) {
                        throw new Error('unit-must-be-bytes', { normalizedRangeHeader: normalizedRangeHeader });
                    }

                    // Specifying multiple ranges separate by commas is valid syntax, but this
                    // library only attempts to handle a single, contiguous sequence of bytes.
                    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range#Syntax
                    if (normalizedRangeHeader.includes(',')) {
                        throw new Error('single-range-only', { normalizedRangeHeader: normalizedRangeHeader });
                    }

                    var rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
                    // We need either at least one of the start or end values.
                    if (!rangeParts || !(rangeParts[1] || rangeParts[2])) {
                        throw new Error('invalid-range-values', { normalizedRangeHeader: normalizedRangeHeader });
                    }

                    return {
                        start: rangeParts[1] === '' ? undefined : Number(rangeParts[1]),
                        end: rangeParts[2] === '' ? undefined : Number(rangeParts[2])
                    };
                }

                function getUrlSuffix(url) {
                    var urlObj = URLToolkit.parseURL(url);
                    return urlObj.path.substring(urlObj.path.lastIndexOf('.') + 1);
                }

                function makeHeadersWithRange(range) {
                    var headers = new Headers();
                    if (range) {
                        headers.set('range', range);
                    }
                    return headers;
                }

                function getEndByteOfFrag(startByte, fragSize, rangeEnd) {
                    var idx = startByte / fragSize | 0;
                    var endByte = startByte + fragSize - 1;
                    if (endByte >= idx * fragSize + fragSize) {
                        endByte = idx * fragSize + fragSize - 1;
                    }
                    if (endByte > rangeEnd) {
                        endByte = rangeEnd;
                    }
                    return endByte;
                }

                /***/ }),
            /* 9 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";
                /* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

                    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// see https://tools.ietf.org/html/rfc1808

                    (function (root) {
                        var URL_REGEX = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/?#]*\/)*[^;?#]*)?(;[^?#]*)?(\?[^#]*)?(#.*)?$/;
                        var FIRST_SEGMENT_REGEX = /^([^\/?#]*)(.*)$/;
                        var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
                        var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g;

                        var URLToolkit = {
                            // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
                            // E.g
                            // With opts.alwaysNormalize = false (default, spec compliant)
                            // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
                            // With opts.alwaysNormalize = true (not spec compliant)
                            // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
                            buildAbsoluteURL: function buildAbsoluteURL(baseURL, relativeURL, opts) {
                                opts = opts || {};
                                // remove any remaining space and CRLF
                                baseURL = baseURL.trim();
                                relativeURL = relativeURL.trim();
                                if (!relativeURL) {
                                    // 2a) If the embedded URL is entirely empty, it inherits the
                                    // entire base URL (i.e., is set equal to the base URL)
                                    // and we are done.
                                    if (!opts.alwaysNormalize) {
                                        return baseURL;
                                    }
                                    var basePartsForNormalise = URLToolkit.parseURL(baseURL);
                                    if (!basePartsForNormalise) {
                                        throw new Error('Error trying to parse base URL.');
                                    }
                                    basePartsForNormalise.path = URLToolkit.normalizePath(basePartsForNormalise.path);
                                    return URLToolkit.buildURLFromParts(basePartsForNormalise);
                                }
                                var relativeParts = URLToolkit.parseURL(relativeURL);
                                if (!relativeParts) {
                                    throw new Error('Error trying to parse relative URL.');
                                }
                                if (relativeParts.scheme) {
                                    // 2b) If the embedded URL starts with a scheme name, it is
                                    // interpreted as an absolute URL and we are done.
                                    if (!opts.alwaysNormalize) {
                                        return relativeURL;
                                    }
                                    relativeParts.path = URLToolkit.normalizePath(relativeParts.path);
                                    return URLToolkit.buildURLFromParts(relativeParts);
                                }
                                var baseParts = URLToolkit.parseURL(baseURL);
                                if (!baseParts) {
                                    throw new Error('Error trying to parse base URL.');
                                }
                                if (!baseParts.netLoc && baseParts.path && baseParts.path[0] !== '/') {
                                    // If netLoc missing and path doesn't start with '/', assume everthing before the first '/' is the netLoc
                                    // This causes 'example.com/a' to be handled as '//example.com/a' instead of '/example.com/a'
                                    var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
                                    baseParts.netLoc = pathParts[1];
                                    baseParts.path = pathParts[2];
                                }
                                if (baseParts.netLoc && !baseParts.path) {
                                    baseParts.path = '/';
                                }
                                var builtParts = {
                                    // 2c) Otherwise, the embedded URL inherits the scheme of
                                    // the base URL.
                                    scheme: baseParts.scheme,
                                    netLoc: relativeParts.netLoc,
                                    path: null,
                                    params: relativeParts.params,
                                    query: relativeParts.query,
                                    fragment: relativeParts.fragment
                                };
                                if (!relativeParts.netLoc) {
                                    // 3) If the embedded URL's <net_loc> is non-empty, we skip to
                                    // Step 7.  Otherwise, the embedded URL inherits the <net_loc>
                                    // (if any) of the base URL.
                                    builtParts.netLoc = baseParts.netLoc;
                                    // 4) If the embedded URL path is preceded by a slash "/", the
                                    // path is not relative and we skip to Step 7.
                                    if (relativeParts.path[0] !== '/') {
                                        if (!relativeParts.path) {
                                            // 5) If the embedded URL path is empty (and not preceded by a
                                            // slash), then the embedded URL inherits the base URL path
                                            builtParts.path = baseParts.path;
                                            // 5a) if the embedded URL's <params> is non-empty, we skip to
                                            // step 7; otherwise, it inherits the <params> of the base
                                            // URL (if any) and
                                            if (!relativeParts.params) {
                                                builtParts.params = baseParts.params;
                                                // 5b) if the embedded URL's <query> is non-empty, we skip to
                                                // step 7; otherwise, it inherits the <query> of the base
                                                // URL (if any) and we skip to step 7.
                                                if (!relativeParts.query) {
                                                    builtParts.query = baseParts.query;
                                                }
                                            }
                                        } else {
                                            // 6) The last segment of the base URL's path (anything
                                            // following the rightmost slash "/", or the entire path if no
                                            // slash is present) is removed and the embedded URL's path is
                                            // appended in its place.
                                            var baseURLPath = baseParts.path;
                                            var newPath = baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) + relativeParts.path;
                                            builtParts.path = URLToolkit.normalizePath(newPath);
                                        }
                                    }
                                }
                                if (builtParts.path === null) {
                                    builtParts.path = opts.alwaysNormalize ? URLToolkit.normalizePath(relativeParts.path) : relativeParts.path;
                                }
                                return URLToolkit.buildURLFromParts(builtParts);
                            },
                            parseURL: function parseURL(url) {
                                var parts = URL_REGEX.exec(url);
                                if (!parts) {
                                    return null;
                                }
                                return {
                                    scheme: parts[1] || '',
                                    netLoc: parts[2] || '',
                                    path: parts[3] || '',
                                    params: parts[4] || '',
                                    query: parts[5] || '',
                                    fragment: parts[6] || ''
                                };
                            },
                            normalizePath: function normalizePath(path) {
                                // The following operations are
                                // then applied, in order, to the new path:
                                // 6a) All occurrences of "./", where "." is a complete path
                                // segment, are removed.
                                // 6b) If the path ends with "." as a complete path segment,
                                // that "." is removed.
                                path = path.split('').reverse().join('').replace(SLASH_DOT_REGEX, '');
                                // 6c) All occurrences of "<segment>/../", where <segment> is a
                                // complete path segment not equal to "..", are removed.
                                // Removal of these path segments is performed iteratively,
                                // removing the leftmost matching pattern on each iteration,
                                // until no matching pattern remains.
                                // 6d) If the path ends with "<segment>/..", where <segment> is a
                                // complete path segment not equal to "..", that
                                // "<segment>/.." is removed.
                                while (path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length) {}
                                return path.split('').reverse().join('');
                            },
                            buildURLFromParts: function buildURLFromParts(parts) {
                                return parts.scheme + parts.netLoc + parts.path + parts.params + parts.query + parts.fragment;
                            }
                        };

                        if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = URLToolkit;else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                            return URLToolkit;
                        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
                        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports['URLToolkit'] = URLToolkit;else root['URLToolkit'] = URLToolkit;
                    })(undefined);
                    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

                /***/ })
            /******/ ]);
});

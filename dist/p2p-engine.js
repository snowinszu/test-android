(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["P2pEngineHls"] = factory();
	else
		root["P2pEngineHls"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/_events@3.3.0@events/events.js":
/*!*****************************************************!*\
  !*** ./node_modules/_events@3.3.0@events/events.js ***!
  \*****************************************************/
/***/ ((module) => {

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



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
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
}

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
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
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
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
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

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
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
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

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
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
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
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
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

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
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

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
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

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
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

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
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
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
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
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/_reconnecting-websocket@4.4.0@reconnecting-websocket/dist/reconnecting-websocket-mjs.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/_reconnecting-websocket@4.4.0@reconnecting-websocket/dist/reconnecting-websocket-mjs.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var Event = /** @class */ (function () {
    function Event(type, target) {
        this.target = target;
        this.type = type;
    }
    return Event;
}());
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(error, target) {
        var _this = _super.call(this, 'error', target) || this;
        _this.message = error.message;
        _this.error = error;
        return _this;
    }
    return ErrorEvent;
}(Event));
var CloseEvent = /** @class */ (function (_super) {
    __extends(CloseEvent, _super);
    function CloseEvent(code, reason, target) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _this = _super.call(this, 'close', target) || this;
        _this.wasClean = true;
        _this.code = code;
        _this.reason = reason;
        return _this;
    }
    return CloseEvent;
}(Event));

/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
var getGlobalWebSocket = function () {
    if (typeof WebSocket !== 'undefined') {
        // @ts-ignore
        return WebSocket;
    }
};
/**
 * Returns true if given argument looks like a WebSocket class
 */
var isWebSocket = function (w) { return typeof w !== 'undefined' && !!w && w.CLOSING === 2; };
var DEFAULT = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
    minUptime: 5000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    maxEnqueuedMessages: Infinity,
    startClosed: false,
    debug: false,
};
var ReconnectingWebSocket = /** @class */ (function () {
    function ReconnectingWebSocket(url, protocols, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._listeners = {
            error: [],
            message: [],
            open: [],
            close: [],
        };
        this._retryCount = -1;
        this._shouldReconnect = true;
        this._connectLock = false;
        this._binaryType = 'blob';
        this._closeCalled = false;
        this._messageQueue = [];
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
         */
        this.onclose = null;
        /**
         * An event listener to be called when an error occurs
         */
        this.onerror = null;
        /**
         * An event listener to be called when a message is received from the server
         */
        this.onmessage = null;
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
         * this indicates that the connection is ready to send and receive data
         */
        this.onopen = null;
        this._handleOpen = function (event) {
            _this._debug('open event');
            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
            clearTimeout(_this._connectTimeout);
            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
            _this._ws.binaryType = _this._binaryType;
            // send enqueued messages (messages sent before websocket open event)
            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
            _this._messageQueue = [];
            if (_this.onopen) {
                _this.onopen(event);
            }
            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleMessage = function (event) {
            _this._debug('message event');
            if (_this.onmessage) {
                _this.onmessage(event);
            }
            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleError = function (event) {
            _this._debug('error event', event.message);
            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
            if (_this.onerror) {
                _this.onerror(event);
            }
            _this._debug('exec error listeners');
            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
            _this._connect();
        };
        this._handleClose = function (event) {
            _this._debug('close event');
            _this._clearTimeouts();
            if (_this._shouldReconnect) {
                _this._connect();
            }
            if (_this.onclose) {
                _this.onclose(event);
            }
            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._url = url;
        this._protocols = protocols;
        this._options = options;
        if (this._options.startClosed) {
            this._shouldReconnect = false;
        }
        this._connect();
    }
    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
        get: function () {
            return ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
        get: function () {
            return ReconnectingWebSocket.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
        get: function () {
            return ReconnectingWebSocket.CLOSING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
        get: function () {
            return ReconnectingWebSocket.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
        get: function () {
            return this._ws ? this._ws.binaryType : this._binaryType;
        },
        set: function (value) {
            this._binaryType = value;
            if (this._ws) {
                this._ws.binaryType = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
        /**
         * Returns the number or connection retries
         */
        get: function () {
            return Math.max(this._retryCount, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
        /**
         * The number of bytes of data that have been queued using calls to send() but not yet
         * transmitted to the network. This value resets to zero once all queued data has been sent.
         * This value does not reset to zero when the connection is closed; if you keep calling send(),
         * this will continue to climb. Read only
         */
        get: function () {
            var bytes = this._messageQueue.reduce(function (acc, message) {
                if (typeof message === 'string') {
                    acc += message.length; // not byte size
                }
                else if (message instanceof Blob) {
                    acc += message.size;
                }
                else {
                    acc += message.byteLength;
                }
                return acc;
            }, 0);
            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
        /**
         * The extensions selected by the server. This is currently only the empty string or a list of
         * extensions as negotiated by the connection
         */
        get: function () {
            return this._ws ? this._ws.extensions : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
        /**
         * A string indicating the name of the sub-protocol the server selected;
         * this will be one of the strings specified in the protocols parameter when creating the
         * WebSocket object
         */
        get: function () {
            return this._ws ? this._ws.protocol : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
        /**
         * The current state of the connection; this is one of the Ready state constants
         */
        get: function () {
            if (this._ws) {
                return this._ws.readyState;
            }
            return this._options.startClosed
                ? ReconnectingWebSocket.CLOSED
                : ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
        /**
         * The URL as resolved by the constructor
         */
        get: function () {
            return this._ws ? this._ws.url : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
     * CLOSED, this method does nothing
     */
    ReconnectingWebSocket.prototype.close = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._closeCalled = true;
        this._shouldReconnect = false;
        this._clearTimeouts();
        if (!this._ws) {
            this._debug('close enqueued: no ws instance');
            return;
        }
        if (this._ws.readyState === this.CLOSED) {
            this._debug('close: already closed');
            return;
        }
        this._ws.close(code, reason);
    };
    /**
     * Closes the WebSocket connection or connection attempt and connects again.
     * Resets retry counter;
     */
    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
        this._shouldReconnect = true;
        this._closeCalled = false;
        this._retryCount = -1;
        if (!this._ws || this._ws.readyState === this.CLOSED) {
            this._connect();
        }
        else {
            this._disconnect(code, reason);
            this._connect();
        }
    };
    /**
     * Enqueue specified data to be transmitted to the server over the WebSocket connection
     */
    ReconnectingWebSocket.prototype.send = function (data) {
        if (this._ws && this._ws.readyState === this.OPEN) {
            this._debug('send', data);
            this._ws.send(data);
        }
        else {
            var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
            if (this._messageQueue.length < maxEnqueuedMessages) {
                this._debug('enqueue', data);
                this._messageQueue.push(data);
            }
        }
    };
    /**
     * Register an event handler of a specific event type
     */
    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type].push(listener);
        }
    };
    ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
        var e_1, _a;
        var listeners = this._listeners[event.type];
        if (listeners) {
            try {
                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                    var listener = listeners_1_1.value;
                    this._callEventListener(event, listener);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return true;
    };
    /**
     * Removes an event listener
     */
    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
        }
    };
    ReconnectingWebSocket.prototype._debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._options.debug) {
            // not using spread because compiled version uses Symbols
            // tslint:disable-next-line
            console.log.apply(console, __spread(['RWS>'], args));
        }
    };
    ReconnectingWebSocket.prototype._getNextDelay = function () {
        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
        var delay = 0;
        if (this._retryCount > 0) {
            delay =
                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
            if (delay > maxReconnectionDelay) {
                delay = maxReconnectionDelay;
            }
        }
        this._debug('next delay', delay);
        return delay;
    };
    ReconnectingWebSocket.prototype._wait = function () {
        var _this = this;
        return new Promise(function (resolve) {
            setTimeout(resolve, _this._getNextDelay());
        });
    };
    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
        if (typeof urlProvider === 'string') {
            return Promise.resolve(urlProvider);
        }
        if (typeof urlProvider === 'function') {
            var url = urlProvider();
            if (typeof url === 'string') {
                return Promise.resolve(url);
            }
            if (!!url.then) {
                return url;
            }
        }
        throw Error('Invalid URL');
    };
    ReconnectingWebSocket.prototype._connect = function () {
        var _this = this;
        if (this._connectLock || !this._shouldReconnect) {
            return;
        }
        this._connectLock = true;
        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
        if (this._retryCount >= maxRetries) {
            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
            return;
        }
        this._retryCount++;
        this._debug('connect', this._retryCount);
        this._removeListeners();
        if (!isWebSocket(WebSocket)) {
            throw Error('No valid WebSocket class provided');
        }
        this._wait()
            .then(function () { return _this._getNextUrl(_this._url); })
            .then(function (url) {
            // close could be called before creating the ws
            if (_this._closeCalled) {
                return;
            }
            _this._debug('connect', { url: url, protocols: _this._protocols });
            _this._ws = _this._protocols
                ? new WebSocket(url, _this._protocols)
                : new WebSocket(url);
            _this._ws.binaryType = _this._binaryType;
            _this._connectLock = false;
            _this._addListeners();
            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
        });
    };
    ReconnectingWebSocket.prototype._handleTimeout = function () {
        this._debug('timeout event');
        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
    };
    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._clearTimeouts();
        if (!this._ws) {
            return;
        }
        this._removeListeners();
        try {
            this._ws.close(code, reason);
            this._handleClose(new CloseEvent(code, reason, this));
        }
        catch (error) {
            // ignore
        }
    };
    ReconnectingWebSocket.prototype._acceptOpen = function () {
        this._debug('accept open');
        this._retryCount = 0;
    };
    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
        if ('handleEvent' in listener) {
            // @ts-ignore
            listener.handleEvent(event);
        }
        else {
            // @ts-ignore
            listener(event);
        }
    };
    ReconnectingWebSocket.prototype._removeListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('removeListeners');
        this._ws.removeEventListener('open', this._handleOpen);
        this._ws.removeEventListener('close', this._handleClose);
        this._ws.removeEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.removeEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._addListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('addListeners');
        this._ws.addEventListener('open', this._handleOpen);
        this._ws.addEventListener('close', this._handleClose);
        this._ws.addEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.addEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._clearTimeouts = function () {
        clearTimeout(this._connectTimeout);
        clearTimeout(this._uptimeTimeout);
    };
    return ReconnectingWebSocket;
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReconnectingWebSocket);


/***/ }),

/***/ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js":
/*!************************************************************************!*\
  !*** ./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js ***!
  \************************************************************************/
/***/ (function(module) {

// see https://tools.ietf.org/html/rfc1808

(function (root) {
  var URL_REGEX =
    /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/;
  var FIRST_SEGMENT_REGEX = /^(?=([^\/?#]*))\1([^]*)$/;
  var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
  var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g;

  var URLToolkit = {
    // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
    // E.g
    // With opts.alwaysNormalize = false (default, spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
    // With opts.alwaysNormalize = true (not spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
    buildAbsoluteURL: function (baseURL, relativeURL, opts) {
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
        basePartsForNormalise.path = URLToolkit.normalizePath(
          basePartsForNormalise.path
        );
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
        fragment: relativeParts.fragment,
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
            var newPath =
              baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) +
              relativeParts.path;
            builtParts.path = URLToolkit.normalizePath(newPath);
          }
        }
      }
      if (builtParts.path === null) {
        builtParts.path = opts.alwaysNormalize
          ? URLToolkit.normalizePath(relativeParts.path)
          : relativeParts.path;
      }
      return URLToolkit.buildURLFromParts(builtParts);
    },
    parseURL: function (url) {
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
        fragment: parts[6] || '',
      };
    },
    normalizePath: function (path) {
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
      while (
        path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length
      ) {}
      return path.split('').reverse().join('');
    },
    buildURLFromParts: function (parts) {
      return (
        parts.scheme +
        parts.netLoc +
        parts.path +
        parts.params +
        parts.query +
        parts.fragment
      );
    },
  };

  if (true)
    module.exports = URLToolkit;
  else {}
})(this);


/***/ }),

/***/ "./src/common/hls/m3u8-parser/attr-list.js":
/*!*************************************************!*\
  !*** ./src/common/hls/m3u8-parser/attr-list.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const DECIMAL_RESOLUTION_REGEX = /^(\d+)x(\d+)$/; // eslint-disable-line no-useless-escape
const ATTR_LIST_REGEX = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g; // eslint-disable-line no-useless-escape

// adapted from https://github.com/kanongil/node-m3u8parse/blob/master/attrlist.js
class AttrList {
  constructor (attrs) {
    if (typeof attrs === 'string') {
      attrs = AttrList.parseAttrList(attrs);
    }

    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        this[attr] = attrs[attr];
      }
    }
  }

  decimalInteger (attrName) {
    const intValue = parseInt(this[attrName], 10);
    if (intValue > Number.MAX_SAFE_INTEGER) {
      return Infinity;
    }

    return intValue;
  }

  hexadecimalInteger (attrName) {
    if (this[attrName]) {
      let stringValue = (this[attrName] || '0x').slice(2);
      stringValue = ((stringValue.length & 1) ? '0' : '') + stringValue;

      const value = new Uint8Array(stringValue.length / 2);
      for (let i = 0; i < stringValue.length / 2; i++) {
        value[i] = parseInt(stringValue.slice(i * 2, i * 2 + 2), 16);
      }

      return value;
    } else {
      return null;
    }
  }

  hexadecimalIntegerAsNumber (attrName) {
    const intValue = parseInt(this[attrName], 16);
    if (intValue > Number.MAX_SAFE_INTEGER) {
      return Infinity;
    }

    return intValue;
  }

  decimalFloatingPoint (attrName) {
    return parseFloat(this[attrName]);
  }

  enumeratedString (attrName) {
    return this[attrName];
  }

  decimalResolution (attrName) {
    const res = DECIMAL_RESOLUTION_REGEX.exec(this[attrName]);
    if (res === null) {
      return undefined;
    }

    return {
      width: parseInt(res[1], 10),
      height: parseInt(res[2], 10)
    };
  }

  static parseAttrList (input) {
    let match, attrs = {};
    ATTR_LIST_REGEX.lastIndex = 0;
    while ((match = ATTR_LIST_REGEX.exec(input)) !== null) {
      let value = match[2], quote = '"';

      if (value.indexOf(quote) === 0 &&
          value.lastIndexOf(quote) === (value.length - 1)) {
        value = value.slice(1, -1);
      }

      attrs[match[1]] = value;
    }
    return attrs;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AttrList);


/***/ }),

/***/ "./src/common/hls/m3u8-parser/codecs.js":
/*!**********************************************!*\
  !*** ./src/common/hls/m3u8-parser/codecs.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isCodecSupportedInMp4": () => (/* binding */ isCodecSupportedInMp4),
/* harmony export */   "isCodecType": () => (/* binding */ isCodecType)
/* harmony export */ });
// from http://mp4ra.org/codecs.html
const sampleEntryCodesISO = {
  audio: {
    'a3ds': true,
    'ac-3': true,
    'ac-4': true,
    'alac': true,
    'alaw': true,
    'dra1': true,
    'dts+': true,
    'dts-': true,
    'dtsc': true,
    'dtse': true,
    'dtsh': true,
    'ec-3': true,
    'enca': true,
    'g719': true,
    'g726': true,
    'm4ae': true,
    'mha1': true,
    'mha2': true,
    'mhm1': true,
    'mhm2': true,
    'mlpa': true,
    'mp4a': true,
    'raw ': true,
    'Opus': true,
    'samr': true,
    'sawb': true,
    'sawp': true,
    'sevc': true,
    'sqcp': true,
    'ssmv': true,
    'twos': true,
    'ulaw': true
  },
  video: {
    'avc1': true,
    'avc2': true,
    'avc3': true,
    'avc4': true,
    'avcp': true,
    'drac': true,
    'dvav': true,
    'dvhe': true,
    'encv': true,
    'hev1': true,
    'hvc1': true,
    'mjp2': true,
    'mp4v': true,
    'mvc1': true,
    'mvc2': true,
    'mvc3': true,
    'mvc4': true,
    'resv': true,
    'rv60': true,
    's263': true,
    'svc1': true,
    'svc2': true,
    'vc-1': true,
    'vp08': true,
    'vp09': true
  }
};

function isCodecType (codec, type) {
  const typeCodes = sampleEntryCodesISO[type];
  return !!typeCodes && typeCodes[codec.slice(0, 4)] === true;
}

function isCodecSupportedInMp4 (codec, type) {
  return self.MediaSource.isTypeSupported(`${type || 'video'}/mp4;codecs="${codec}"`);
}




/***/ }),

/***/ "./src/common/hls/m3u8-parser/fragment.js":
/*!************************************************!*\
  !*** ./src/common/hls/m3u8-parser/fragment.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Fragment)
/* harmony export */ });
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _level_key__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./level-key */ "./src/common/hls/m3u8-parser/level-key.js");





class Fragment {
  constructor () {
    this._url = null;
    this._byteRange = null;
    this._decryptdata = null;
    this.tagList = [];
    this.programDateTime = null;
    this.rawProgramDateTime = null;

    // Holds the types of data this fragment supports
    this._elementaryStreams = {
      [Fragment.ElementaryStreamTypes.AUDIO]: false,
      [Fragment.ElementaryStreamTypes.VIDEO]: false
    };
  }

  /**
   * `type` property for this._elementaryStreams
   *
   * @enum
   */
  static get ElementaryStreamTypes () {
    return {
      AUDIO: 'audio',
      VIDEO: 'video'
    };
  }

  get url () {
    if (!this._url && this.relurl) {
      this._url = url_toolkit__WEBPACK_IMPORTED_MODULE_0__.buildAbsoluteURL(this.baseurl, this.relurl, { alwaysNormalize: true });
    }

    return this._url;
  }

  set url (value) {
    this._url = value;
  }

  get byteRange () {
    if (!this._byteRange && !this.rawByteRange) {
      return [];
    }

    if (this._byteRange) {
      return this._byteRange;
    }

    let byteRange = [];
    if (this.rawByteRange) {
      const params = this.rawByteRange.split('@', 2);
      if (params.length === 1) {
        const lastByteRangeEndOffset = this.lastByteRangeEndOffset;
        byteRange[0] = lastByteRangeEndOffset || 0;
      } else {
        byteRange[0] = parseInt(params[1]);
      }
      byteRange[1] = parseInt(params[0]) + byteRange[0];
      this._byteRange = byteRange;
    }
    return byteRange;
  }

  /**
   * @type {number}
   */
  get byteRangeStartOffset () {
    return this.byteRange[0];
  }

  get byteRangeEndOffset () {
    return this.byteRange[1];
  }

  get decryptdata () {
    if (!this._decryptdata) {
      this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn);
    }

    return this._decryptdata;
  }

  get endProgramDateTime () {
    if (!Number.isFinite(this.programDateTime)) {
      return null;
    }

    let duration = !Number.isFinite(this.duration) ? 0 : this.duration;

    return this.programDateTime + (duration * 1000);
  }

  get encrypted () {
    return !!((this.decryptdata && this.decryptdata.uri !== null) && (this.decryptdata.key === null));
  }

  /**
   * @param {ElementaryStreamType} type
   */
  addElementaryStream (type) {
    this._elementaryStreams[type] = true;
  }

  /**
   * @param {ElementaryStreamType} type
   */
  hasElementaryStream (type) {
    return this._elementaryStreams[type] === true;
  }

  /**
   * Utility method for parseLevelPlaylist to create an initialization vector for a given segment
   * @returns {Uint8Array}
   */
  createInitializationVector (segmentNumber) {
    let uint8View = new Uint8Array(16);

    for (let i = 12; i < 16; i++) {
      uint8View[i] = (segmentNumber >> 8 * (15 - i)) & 0xff;
    }

    return uint8View;
  }

  /**
   * Utility method for parseLevelPlaylist to get a fragment's decryption data from the currently parsed encryption key data
   * @param levelkey - a playlist's encryption info
   * @param segmentNumber - the fragment's segment number
   * @returns {*} - an object to be applied as a fragment's decryptdata
   */
  fragmentDecryptdataFromLevelkey (levelkey, segmentNumber) {
    let decryptdata = levelkey;

    if (levelkey && levelkey.method && levelkey.uri && !levelkey.iv) {
      decryptdata = new _level_key__WEBPACK_IMPORTED_MODULE_1__["default"]();
      decryptdata.method = levelkey.method;
      decryptdata.baseuri = levelkey.baseuri;
      decryptdata.reluri = levelkey.reluri;
      decryptdata.iv = this.createInitializationVector(segmentNumber);
    }

    return decryptdata;
  }
}


/***/ }),

/***/ "./src/common/hls/m3u8-parser/index.js":
/*!*********************************************!*\
  !*** ./src/common/hls/m3u8-parser/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ M3U8Parser)
/* harmony export */ });
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fragment */ "./src/common/hls/m3u8-parser/fragment.js");
/* harmony import */ var _level__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./level */ "./src/common/hls/m3u8-parser/level.js");
/* harmony import */ var _level_key__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./level-key */ "./src/common/hls/m3u8-parser/level-key.js");
/* harmony import */ var _attr_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./attr-list */ "./src/common/hls/m3u8-parser/attr-list.js");
/* harmony import */ var _codecs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./codecs */ "./src/common/hls/m3u8-parser/codecs.js");









/**
 * M3U8 parser
 * @module
 */

// https://regex101.com is your friend
const MASTER_PLAYLIST_REGEX = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;
const MASTER_PLAYLIST_MEDIA_REGEX = /#EXT-X-MEDIA:(.*)/g;

const LEVEL_PLAYLIST_REGEX_FAST = new RegExp([
  /#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, // duration (#EXTINF:<duration>,<title>), group 1 => duration, group 2 => title
  /|(?!#)([\S+ ?]+)/.source, // segment URI, group 3 => the URI (note newline is not eaten)
  /|#EXT-X-BYTERANGE:*(.+)/.source, // next segment's byterange, group 4 => range spec (x@y)
  /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, // next segment's program date/time group 5 => the datetime spec
  /|#.*/.source // All other non-segment oriented tags will match with all groups empty
].join(''), 'g');

const LEVEL_PLAYLIST_REGEX_SLOW = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)([^:]*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/;

const MP4_REGEX_SUFFIX = /\.(mp4|m4s|m4v|m4a)$/i;

class M3U8Parser {
  static findGroup (groups, mediaGroupId) {
    if (!groups) {
      return null;
    }

    let matchingGroup = null;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (group.id === mediaGroupId) {
        matchingGroup = group;
      }
    }

    return matchingGroup;
  }

  static convertAVC1ToAVCOTI (codec) {
    let result, avcdata = codec.split('.');
    if (avcdata.length > 2) {
      result = avcdata.shift() + '.';
      result += parseInt(avcdata.shift()).toString(16);
      result += ('000' + parseInt(avcdata.shift()).toString(16)).substr(-4);
    } else {
      result = codec;
    }
    return result;
  }

  static resolve (url, baseUrl) {
    return url_toolkit__WEBPACK_IMPORTED_MODULE_0__.buildAbsoluteURL(baseUrl, url, { alwaysNormalize: true });
  }

  static parseMasterPlaylist (string, baseurl) {
    let levels = [], result;
    MASTER_PLAYLIST_REGEX.lastIndex = 0;

    function setCodecs (codecs, level) {
      ['video', 'audio'].forEach((type) => {
        const filtered = codecs.filter((codec) => (0,_codecs__WEBPACK_IMPORTED_MODULE_5__.isCodecType)(codec, type));
        if (filtered.length) {
          const preferred = filtered.filter((codec) => {
            return codec.lastIndexOf('avc1', 0) === 0 || codec.lastIndexOf('mp4a', 0) === 0;
          });
          level[`${type}Codec`] = preferred.length > 0 ? preferred[0] : filtered[0];

          // remove from list
          codecs = codecs.filter((codec) => filtered.indexOf(codec) === -1);
        }
      });

      level.unknownCodecs = codecs;
    }

    while ((result = MASTER_PLAYLIST_REGEX.exec(string)) != null) {
      const level = {};

      const attrs = level.attrs = new _attr_list__WEBPACK_IMPORTED_MODULE_4__["default"](result[1]);
      level.url = M3U8Parser.resolve(result[2], baseurl);

      const resolution = attrs.decimalResolution('RESOLUTION');
      if (resolution) {
        level.width = resolution.width;
        level.height = resolution.height;
      }
      level.bitrate = attrs.decimalInteger('AVERAGE-BANDWIDTH') || attrs.decimalInteger('BANDWIDTH');
      level.name = attrs.NAME;

      setCodecs([].concat((attrs.CODECS || '').split(/[ ,]+/)), level);

      if (level.videoCodec && level.videoCodec.indexOf('avc1') !== -1) {
        level.videoCodec = M3U8Parser.convertAVC1ToAVCOTI(level.videoCodec);
      }

      levels.push(level);
    }
    return levels;
  }

  static parseMasterPlaylistMedia (string, baseurl, type, audioGroups = []) {
    let result;
    let medias = [];
    let id = 0;
    MASTER_PLAYLIST_MEDIA_REGEX.lastIndex = 0;
    while ((result = MASTER_PLAYLIST_MEDIA_REGEX.exec(string)) !== null) {
      const media = {};
      const attrs = new _attr_list__WEBPACK_IMPORTED_MODULE_4__["default"](result[1]);
      if (attrs.TYPE === type) {
        media.groupId = attrs['GROUP-ID'];
        media.name = attrs.NAME;
        media.type = type;
        media.default = (attrs.DEFAULT === 'YES');
        media.autoselect = (attrs.AUTOSELECT === 'YES');
        media.forced = (attrs.FORCED === 'YES');
        if (attrs.URI) {
          media.url = M3U8Parser.resolve(attrs.URI, baseurl);
        }

        media.lang = attrs.LANGUAGE;
        if (!media.name) {
          media.name = media.lang;
        }

        if (audioGroups.length) {
          const groupCodec = M3U8Parser.findGroup(audioGroups, media.groupId);
          media.audioCodec = groupCodec ? groupCodec.codec : audioGroups[0].codec;
        }
        media.id = id++;
        medias.push(media);
      }
    }
    return medias;
  }

  static parseLevelPlaylist (string, baseurl) {
    let currentSN = 0;
    let totalduration = 0;
    let level = new _level__WEBPACK_IMPORTED_MODULE_2__["default"](baseurl);
    let levelkey = new _level_key__WEBPACK_IMPORTED_MODULE_3__["default"]();
    let cc = 0;
    let prevFrag = null;
    let frag = new _fragment__WEBPACK_IMPORTED_MODULE_1__["default"]();
    let result;
    let i;

    let firstPdtIndex = null;

    LEVEL_PLAYLIST_REGEX_FAST.lastIndex = 0;

    while ((result = LEVEL_PLAYLIST_REGEX_FAST.exec(string)) !== null) {
      const duration = result[1];
      if (duration) { // INF
        frag.duration = parseFloat(duration);
        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        const title = (' ' + result[2]).slice(1);
        frag.title = title || null;
        frag.tagList.push(title ? [ 'INF', duration, title ] : [ 'INF', duration ]);
      } else if (result[3]) { // url
        if (Number.isFinite(frag.duration)) {
          const sn = currentSN++;
          // frag.type = type;
          frag.start = totalduration;
          frag.levelkey = levelkey;
          frag.sn = sn;
          // frag.level = id;
          frag.cc = cc;
          // frag.urlId = levelUrlId;
          frag.baseurl = baseurl;
          // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
          frag.relurl = (' ' + result[3]).slice(1);
          assignProgramDateTime(frag, prevFrag);

          level.fragments.push(frag);
          prevFrag = frag;
          totalduration += frag.duration;

          frag = new _fragment__WEBPACK_IMPORTED_MODULE_1__["default"]();
        }
      } else if (result[4]) { // X-BYTERANGE
        frag.rawByteRange = (' ' + result[4]).slice(1);
        if (prevFrag) {
          const lastByteRangeEndOffset = prevFrag.byteRangeEndOffset;
          if (lastByteRangeEndOffset) {
            frag.lastByteRangeEndOffset = lastByteRangeEndOffset;
          }
        }
      } else if (result[5]) { // PROGRAM-DATE-TIME
        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        frag.rawProgramDateTime = (' ' + result[5]).slice(1);
        frag.tagList.push(['PROGRAM-DATE-TIME', frag.rawProgramDateTime]);
        if (firstPdtIndex === null) {
          firstPdtIndex = level.fragments.length;
        }
      } else {
        result = result[0].match(LEVEL_PLAYLIST_REGEX_SLOW);
        for (i = 1; i < result.length; i++) {
          if (result[i] !== undefined) {
            break;
          }
        }

        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        const value1 = (' ' + result[i + 1]).slice(1);
        const value2 = (' ' + result[i + 2]).slice(1);

        switch (result[i]) {
        case '#':
          frag.tagList.push(value2 ? [ value1, value2 ] : [ value1 ]);
          break;
        case 'PLAYLIST-TYPE':
          level.type = value1.toUpperCase();
          break;
        case 'MEDIA-SEQUENCE':
          currentSN = level.startSN = parseInt(value1);
          break;
        case 'TARGETDURATION':
          level.targetduration = parseFloat(value1);
          break;
        case 'VERSION':
          level.version = parseInt(value1);
          break;
        case 'EXTM3U':
          break;
        case 'ENDLIST':
          level.live = false;
          break;
        case 'DIS':
          cc++;
          frag.tagList.push(['DIS']);
          break;
        case 'DISCONTINUITY-SEQ':
          cc = parseInt(value1);
          break;
        case 'KEY':
          // https://tools.ietf.org/html/draft-pantos-http-live-streaming-08#section-3.4.4
          var decryptparams = value1;
          var keyAttrs = new _attr_list__WEBPACK_IMPORTED_MODULE_4__["default"](decryptparams);
          var decryptmethod = keyAttrs.enumeratedString('METHOD'),
            decrypturi = keyAttrs.URI,
            decryptiv = keyAttrs.hexadecimalInteger('IV');
          if (decryptmethod) {
            levelkey = new _level_key__WEBPACK_IMPORTED_MODULE_3__["default"]();
            if ((decrypturi) && (['AES-128', 'SAMPLE-AES', 'SAMPLE-AES-CENC'].indexOf(decryptmethod) >= 0)) {
              levelkey.method = decryptmethod;
              // URI to get the key
              levelkey.baseuri = baseurl;
              levelkey.reluri = decrypturi;
              levelkey.key = null;
              // Initialization Vector (IV)
              levelkey.iv = decryptiv;
            }
          }
          break;
        case 'START':
          let startParams = value1;
          let startAttrs = new _attr_list__WEBPACK_IMPORTED_MODULE_4__["default"](startParams);
          let startTimeOffset = startAttrs.decimalFloatingPoint('TIME-OFFSET');
          // TIME-OFFSET can be 0
          if (Number.isFinite(startTimeOffset)) {
            level.startTimeOffset = startTimeOffset;
          }

          break;
        case 'MAP':
          let mapAttrs = new _attr_list__WEBPACK_IMPORTED_MODULE_4__["default"](value1);
          frag.relurl = mapAttrs.URI;
          frag.rawByteRange = mapAttrs.BYTERANGE;
          frag.baseurl = baseurl;
          // frag.level = id;
          // frag.type = type;
          frag.sn = 'initSegment';
          level.initSegment = frag;
          frag = new _fragment__WEBPACK_IMPORTED_MODULE_1__["default"]();
          frag.rawProgramDateTime = level.initSegment.rawProgramDateTime;
          break;
        default:
          console.warn(`line parsed but not handled: ${result}`);
          break;
        }
      }
    }
    frag = prevFrag;
    // logger.log('found ' + level.fragments.length + ' fragments');
    if (frag && !frag.relurl) {
      level.fragments.pop();
      totalduration -= frag.duration;
    }
    level.totalduration = totalduration;
    level.averagetargetduration = totalduration / level.fragments.length;
    level.endSN = currentSN - 1;
    level.startCC = level.fragments[0] ? level.fragments[0].cc : 0;
    level.endCC = cc;

    if (!level.initSegment && level.fragments.length) {
      // this is a bit lurky but HLS really has no other way to tell us
      // if the fragments are TS or MP4, except if we download them :/
      // but this is to be able to handle SIDX.
      if (level.fragments.every((frag) => MP4_REGEX_SUFFIX.test(frag.relurl))) {
        console.warn('MP4 fragments found but no init segment (probably no MAP, incomplete M3U8), trying to fetch SIDX');

        frag = new _fragment__WEBPACK_IMPORTED_MODULE_1__["default"]();
        frag.relurl = level.fragments[0].relurl;
        frag.baseurl = baseurl;
        frag.level = id;
        // frag.type = type;
        frag.sn = 'initSegment';

        level.initSegment = frag;
        level.needSidxRanges = true;
      }
    }

    /**
     * Backfill any missing PDT values
       "If the first EXT-X-PROGRAM-DATE-TIME tag in a Playlist appears after
       one or more Media Segment URIs, the client SHOULD extrapolate
       backward from that tag (using EXTINF durations and/or media
       timestamps) to associate dates with those segments."
     * We have already extrapolated forward, but all fragments up to the first instance of PDT do not have their PDTs
     * computed.
     */
    if (firstPdtIndex) {
      backfillProgramDateTimes(level.fragments, firstPdtIndex);
    }

    return level;
  }
}

function backfillProgramDateTimes (fragments, startIndex) {
  let fragPrev = fragments[startIndex];
  for (let i = startIndex - 1; i >= 0; i--) {
    const frag = fragments[i];
    frag.programDateTime = fragPrev.programDateTime - (frag.duration * 1000);
    fragPrev = frag;
  }
}

function assignProgramDateTime (frag, prevFrag) {
  if (frag.rawProgramDateTime) {
    frag.programDateTime = Date.parse(frag.rawProgramDateTime);
  } else if (prevFrag && prevFrag.programDateTime) {
    frag.programDateTime = prevFrag.endProgramDateTime;
  }

  if (!Number.isFinite(frag.programDateTime)) {
    frag.programDateTime = null;
    frag.rawProgramDateTime = null;
  }
}


/***/ }),

/***/ "./src/common/hls/m3u8-parser/level-key.js":
/*!*************************************************!*\
  !*** ./src/common/hls/m3u8-parser/level-key.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LevelKey)
/* harmony export */ });
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__);


class LevelKey {
  constructor () {
    this.method = null;
    this.key = null;
    this.iv = null;
    this._uri = null;
  }

  get uri () {
    if (!this._uri && this.reluri) {
      this._uri = url_toolkit__WEBPACK_IMPORTED_MODULE_0__.buildAbsoluteURL(this.baseuri, this.reluri, { alwaysNormalize: true });
    }

    return this._uri;
  }
}


/***/ }),

/***/ "./src/common/hls/m3u8-parser/level.js":
/*!*********************************************!*\
  !*** ./src/common/hls/m3u8-parser/level.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Level)
/* harmony export */ });
class Level {
  constructor (baseUrl) {
    // Please keep properties in alphabetical order
    this.endCC = 0;
    this.endSN = 0;
    this.fragments = [];
    this.initSegment = null;
    this.live = true;
    this.needSidxRanges = false;
    this.startCC = 0;
    this.startSN = 0;
    this.startTimeOffset = null;
    this.targetduration = 0;
    this.totalduration = 0;
    this.type = null;
    this.url = baseUrl;
    this.version = null;
  }

  get hasProgramDateTime () {
    return !!(this.fragments[0] && Number.isFinite(this.fragments[0].programDateTime));
  }
}


/***/ }),

/***/ "./src/common/idb-keyval/index.js":
/*!****************************************!*\
  !*** ./src/common/idb-keyval/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "createStores": () => (/* binding */ createStores),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "delMany": () => (/* binding */ delMany),
/* harmony export */   "entries": () => (/* binding */ entries),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "getMany": () => (/* binding */ getMany),
/* harmony export */   "keys": () => (/* binding */ keys),
/* harmony export */   "promisifyRequest": () => (/* binding */ promisifyRequest),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "setMany": () => (/* binding */ setMany),
/* harmony export */   "update": () => (/* binding */ update),
/* harmony export */   "values": () => (/* binding */ values)
/* harmony export */ });

const STORE_NOT_INIT = 'store not init'

function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        request.onabort = request.onerror = () => reject(request.error);
    });
}

// export function getStore(dbName) {
//     return new Promise((resolve, reject) => {
//         indexedDB.databases().then(dbs => {
//             const db = dbs.find(db => db.name === dbName);
//             if (db) {
//                 const timer = setTimeout(() => {
//                     resolve(null)
//                 }, 300)
//                 const request = indexedDB.open(dbName)
//                 request.onsuccess = (sender) => {
//                     clearTimeout(timer)
//                     resolve(sender.target.result) };
//                 request.onerror = (e) => {
//                     clearTimeout(timer)
//                     resolve(null)
//                 }
//             } else {
//                 resolve(null)
//             }
//         }).catch(reject)
//     }).catch(e => {})
// }

function createStores(dbName, stores) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => {
        const db = request.result;
        stores.forEach(storeName => {
            db.createObjectStore(storeName);
        })
    }
    const dbp = promisifyRequest(request);
    return stores.map(storeName => (txMode, callback) =>
        dbp.then((db) =>
            callback(db.transaction(storeName, txMode).objectStore(storeName)),
        ))
}

// export function getStoreFuns(db, stores) {
//     return stores.map(storeName => (txMode, callback) =>
//         callback(db.transaction(storeName, txMode).objectStore(storeName))
//     )
// }

/**
 * Get a value by its key.
 */
function get(key, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readonly', (store) => promisifyRequest(store.get(key)));
}

/**
 * Set a value with a key.
 *
 */
function set(key, value, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readwrite', (store) => {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}

/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * */
function setMany(entries, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readwrite', (store) => {
        entries.forEach((entry) => store.put(entry[1], entry[0]));
        return promisifyRequest(store.transaction);
    });
}

/**
 * Get multiple values by their keys
 */
function getMany(keys, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readonly', (store) =>
        Promise.all(keys.map((key) => promisifyRequest(store.get(key)))),
    );
}

/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 */
function update(key, updater, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore(
        'readwrite',
        (store) =>
            // Need to create the promise manually.
            // If I try to chain promises, the transaction closes in browsers
            // that use a promise polyfill (IE10/11).
            new Promise((resolve, reject) => {
                store.get(key).onsuccess = function () {
                    try {
                        store.put(updater(this.result), key);
                        resolve(promisifyRequest(store.transaction));
                    } catch (err) {
                        reject(err);
                    }
                };
            }),
    );
}

/**
 * Delete a particular key from the store.
 *
 */
function del(key, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readwrite', (store) => {
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
}

/**
 * Delete multiple keys at once.
 *
 */
function delMany(keys, getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readwrite', (store) => {
        keys.forEach((key) => store.delete(key));
        return promisifyRequest(store.transaction);
    });
}

/**
 * Clear all values in the store.
 *
 */
function clear(getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readwrite', (store) => {
        store.clear();
        return promisifyRequest(store.transaction);
    });
}

// firefox下不起作用
// export function clearAll(excluded) {
//     return new Promise((resolve, reject) => {
//         indexedDB.databases().then(dbs => {
//             const promises = dbs.filter(db => db.name !== excluded).map(db => {
//                 // console.warn(`del db ${db.name}`)
//                 return new Promise((resolve, reject) => {
//                     const req = indexedDB.deleteDatabase(db.name);
//                     req.onsuccess = resolve;
//                     req.onerror = reject;
//                     req.onblocked = reject;
//                 });
//             });
//             Promise.all(promises).then(resolve).catch(reject);
//         }).catch(reject)
//     }).catch(e => {})
// }

function eachCursor(store, callback) {
    store.openCursor().onsuccess = function () {
        if (!this.result) return;
        callback(this.result);
        this.result.continue();
    };
    return promisifyRequest(store.transaction);
}

/**
 * Get all keys in the store.
 *
 */
function keys(getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readonly', (store) => {
        // Fast path for modern browsers
        if (store.getAllKeys) {
            return promisifyRequest(store.getAllKeys());
        }

        const items = [];

        return eachCursor(store, (cursor) =>
            items.push(cursor.key)
    ).then(() => items);
    });
}

/**
 * Get all values in the store.
 *
 */
function values(getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readonly', (store) => {
        // Fast path for modern browsers
        if (store.getAll) {
            return promisifyRequest(store.getAll());
        }

        const items = [];

        return eachCursor(store, (cursor) => items.push(cursor.value)).then(
            () => items,
        );
    });
}

/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 */
function entries(getStore) {
    if (!getStore) return Promise.reject(STORE_NOT_INIT)
    return getStore('readonly', (store) => {
        // Fast path for modern browsers
        // (although, hopefully we'll get a simpler path some day)
        if (store.getAll && store.getAllKeys) {
            return Promise.all([
                promisifyRequest(
                    store.getAllKeys(),
            ),
                promisifyRequest(store.getAll()),
        ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
        }

        const items = [];

        return getStore('readonly', (store) =>
            eachCursor(store, (cursor) =>
                items.push([cursor.key, cursor.value]),
            ).then(() => items),
        );
    });
}


/***/ }),

/***/ "./src/common/media/util-func.js":
/*!***************************************!*\
  !*** ./src/common/media/util-func.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getMediaBuffered": () => (/* binding */ getMediaBuffered),
/* harmony export */   "listenMediaRebuffer": () => (/* binding */ listenMediaRebuffer)
/* harmony export */ });

function getMediaBuffered(media) {
    let duration = 0;
    let currentTime = media.currentTime;
    let buffered = media.buffered;
    for (let i=buffered.length-1;i>=0;i--) {
        // console.warn(`${i} start ${buffered.start(i)} end ${buffered.end(i)}`);
        if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
            duration = buffered.end(i) - currentTime;
            break;
        }
    }
    return duration > 0 ? duration : 0;
}

function listenMediaRebuffer(media, cb) {
    let slowInternetTimeout = null;

    let threshold = 2500; //ms after which user perceives buffering

    const waitingEvent = () => {
        if (slowInternetTimeout) return
        slowInternetTimeout = setTimeout(() => {
            // buffering
            // console.warn(`video waiting`)
            cb()
        }, threshold);
    }
    const playingEvent = () => {
        // console.warn(`video playing`)
        if(slowInternetTimeout != null){
            clearTimeout(slowInternetTimeout);
            slowInternetTimeout = null;
        }
    }

    media.addEventListener('waiting', waitingEvent);
    media.addEventListener('playing', playingEvent);

    return () => {
        // console.warn(`removeEventListener`)
        media.removeEventListener('waiting', waitingEvent);
        media.removeEventListener('playing', playingEvent);
    }
}


/***/ }),

/***/ "./src/common/sw/sw-tool.js":
/*!**********************************!*\
  !*** ./src/common/sw/sw-tool.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "copyHeaders": () => (/* binding */ copyHeaders),
/* harmony export */   "getUrlSuffix": () => (/* binding */ getUrlSuffix),
/* harmony export */   "makeHeadersWithRange": () => (/* binding */ makeHeadersWithRange),
/* harmony export */   "makeHeadersWithRangeOnly": () => (/* binding */ makeHeadersWithRangeOnly),
/* harmony export */   "parseRangeHeader": () => (/* binding */ parseRangeHeader),
/* harmony export */   "proxyIdentifier": () => (/* binding */ proxyIdentifier)
/* harmony export */ });
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__);


const proxyIdentifier = '__PROXY_IDENTIFIER__';

function parseRangeHeader(rangeHeader) {
    if (!rangeHeader) return {};
    const normalizedRangeHeader = rangeHeader.trim().toLowerCase();
    if (!normalizedRangeHeader.startsWith('bytes=')) {
        throw new Error('unit-must-be-bytes', {normalizedRangeHeader});
    }

    // Specifying multiple ranges separate by commas is valid syntax, but this
    // library only attempts to handle a single, contiguous sequence of bytes.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range#Syntax
    if (normalizedRangeHeader.includes(',')) {
        throw new Error('single-range-only', {normalizedRangeHeader});
    }

    const rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
    // We need either at least one of the start or end values.
    if (!rangeParts || !(rangeParts[1] || rangeParts[2])) {
        throw new Error('invalid-range-values', {normalizedRangeHeader});
    }

    return {
        start: rangeParts[1] === '' ? 0 : Number(rangeParts[1]),
        end: rangeParts[2] === '' ? undefined : Number(rangeParts[2]),
    };
}

function getUrlSuffix(url, separator = '.') {
    const urlObj = url_toolkit__WEBPACK_IMPORTED_MODULE_0__.parseURL(url);
    return urlObj.path.substring(urlObj.path.lastIndexOf(separator)+1);
}

function copyHeaders(headers) {
    return new Headers(headers);
}

function makeHeadersWithRange(headers, range) {
    const newHeaders = copyHeaders(headers);
    if (range) {
        newHeaders.set('Range', range);
    }
    return newHeaders
}

function makeHeadersWithRangeOnly(range) {
    const headers = new Headers();
    if (range) {
        headers.set('range', range);
    }
    return headers
}


/***/ }),

/***/ "./src/common/timer.js":
/*!*****************************!*\
  !*** ./src/common/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTimeoutGenerator": () => (/* binding */ createTimeoutGenerator)
/* harmony export */ });

const EnumStatus = {
    uninitialized: 0,
    initialized: 1,
    waiting: 2,
    working: 3,
    canceled: 4,
}

function createTimeoutGenerator() {
    const timeoutGenerator = function (cb) {
        let ticket;
        function execute(interval = 1000) {
            ticket = setTimeout(cb, interval);
        }
        return {
            execute,
            cancel: function () {
                clearTimeout(ticket);
            },
        }
    };
    return new NextGenerator(timeoutGenerator);
}

// export function createRequestAnimationFrameGenerator() {
//     const requestAnimationFrameGenerator = function (cb) {
//         let ticket;
//         function execute() {
//             ticket = self.requestAnimationFrame(cb);
//         }
//
//         return {
//             execute,
//             cancel: function () {
//                 cancelAnimationFrame(ticket);
//             },
//         }
//     };
//
//     return new NextGenerator(requestAnimationFrameGenerator);
// }

class NextGenerator {
    constructor(generator) {
        this.generator = generator;
        this.status = EnumStatus.initialized;
        this.next = this.next.bind(this);
    }

    next(interval) {
        // 状态判断
        if (this.status === EnumStatus.canceled) {
            return console.warn(
                "status is canceled"
            );
        }
        if (this.status === EnumStatus.waiting) {
            return console.warn(
                "status is waiting"
            );
        }

        // 计时器到期，真正被执行的函数
        const boundFn = this.execute.bind(this, this.cb);
        this.nextInfo = this.generator(boundFn);

        this.status = EnumStatus.waiting;
        this.nextInfo.execute(interval);
    }

    execute(cb, context) {
        this.status = EnumStatus.working;
        cb.apply(context, [this.next]);
    }

    cancel() {
        this.status = EnumStatus.canceled;
        if (this.nextInfo && typeof this.nextInfo.cancel === "function") {
            this.nextInfo.cancel();
        }
    }

    start(cb, interval) {
        if (typeof cb !== "function") {
            throw new SyntaxError("param cb must be a function");
        }
        this.cb = cb;

        this.next(interval);
    }

    continue(interval) {
        this.status = EnumStatus.initialized;
        this.next(interval);
    }
}




/***/ }),

/***/ "./src/core/config.js":
/*!****************************!*\
  !*** ./src/core/config.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// import URLToolkit from 'url-toolkit';

//时间单位统一为秒
let commonConfig = {

    wsMaxRetries: 10,                            // websocket连接重试次数

    p2pEnabled: true,                           // 是否开启P2P，默认true

    wifiOnly: false,                             // 是否只在wifi模式分享

    memoryCacheLimit: {                            // p2p缓存的最大数据量（分为PC和移动端）
        pc: 400*1024*1024,                       // PC端缓存大小
        mobile: 100*1024*1024,                   // 移动端缓存大小
    },

    dcDownloadTimeout: 25,                          // p2p下载的最大超时时间

    logLevel: 'error',                            // log的level，分为debug、info、warn、error、none，设为true等于debug，设为false等于none，默认none

    tag: '',                                     // 用户自定义标签

    webRTCConfig: {},                            // 传入channelConfig用于createDataChannel，config用于RTCPeerConnection

    // useHttpRange: false,                          // 是否允许Http Range请求

    token: undefined,                                    // electron专用token
    appName: undefined,
    appId: undefined,

    prefetchNum: 5,         // 同时预下载的切片最大数量

    showSlogan: true,         // 展示广告

    trickleICE: true,

    announceLocation: 'eu',       // cn eu hk us    TODO 废弃
    trackerZone: undefined,

    geoIpPreflight: true,

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (commonConfig);


/***/ }),

/***/ "./src/core/engine-base.js":
/*!*********************************!*\
  !*** ./src/core/engine-base.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/logger */ "./src/core/utils/logger.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _peer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./peer */ "./src/core/peer.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_utils_platform__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_player_detector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/player-detector */ "./src/core/utils/player-detector.js");








const SAM = {
    '_': 'nllL',
    'f': 'd3NzJ',
    'ss': '==',
    '3': 'TNBLy9z',
    '8': 'aWduY',
    'u': 'mNvbQ',
    'qa': 'WwuY2RuY',
};

class EngineBase extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(p2pConfig = {}) {
        super();
        // console.warn(`EngineBase`);
        this.p2pEnabled = !(p2pConfig.p2pEnabled === false || (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getQueryParam)('_p2p') === '0');    //默认开启P2P
        if (p2pConfig.tag && p2pConfig.tag.length > 20) {
            throw new Error(`Tag is too long`);
        }
        if (p2pConfig.appName && p2pConfig.appName.length > 30) {
            throw new Error(`appName is too long`);
        }
        if (p2pConfig.appId && p2pConfig.appId.length > 30) {
            throw new Error(`appId is too long`);
        }
        if (p2pConfig.token && p2pConfig.token.length > 20) {
            throw new Error(`Token is too long`);
        }
    }

    //初始化logger
    initLogger() {
        // 展示广告
        const { config } = this;
        if (config.showSlogan && (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.navLang)() === 'en') {
            console.log(`%cLet the browsers become your unlimitedly scalable CDN!\n%c${(0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getHomeUrl)()}`,
                "color: dodgerblue; padding:20px 0; font-size: x-large", 'font-size: medium; padding-bottom:15px');
        }
        const logger = new _utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"](config.logLevel);
        config.logger = this.logger = logger;
        return logger;
    }

    getExtraForStats() {
        const json = {};
        // const { tracker } = this;
        // const { scheduler } = tracker;
        return json
    }

    getExtraForPeersRequest() {
        const json = {};
        json.num_want = this._getNumWant();
        return json;
    }

    _getNumWant() {
        const { tracker } = this;
        if (!tracker.scheduler) return
        const num = tracker.scheduler.peersNum
        if (num > 0 && tracker.maxConnsActive - num > 0) {
            return tracker.maxConnsActive - num;
        }
        return undefined
    }

    makeChannelId(prefix, channelId) {
        if (!prefix || typeof prefix !== 'string') {
            const errMsg = `token is required while using customized channelId!`;
            console.error(errMsg);
            throw new Error(errMsg);
        }
        return typeof channelId === 'function' ? (url, browserInfo) => {
            return `${prefix}-${channelId(url, browserInfo)}`
        } : () => {
            return `${prefix}-${channelId}`
        }
    }

    makeSignalId() {
        let signalId = '';
        const { config } = this;
        const defaultAddr = decodeURIComponent(self.atob(SAM['f']+SAM['3']+SAM['8']+SAM['qa']+SAM['_']+SAM['u']+SAM['ss']));
        if (config.signalConfig) {
            config.wsSignalerAddr = config.signalConfig;
        }
        const { wsSignalerAddr } = config;
        if (!wsSignalerAddr) {
            config.wsSignalerAddr = {
                main: defaultAddr,
                byDefault: true,
            }
        } else {
            let mainSignal;
            if (typeof wsSignalerAddr === 'object') {
                if (!wsSignalerAddr.main) wsSignalerAddr.main = defaultAddr
                mainSignal = wsSignalerAddr.main;
            } else if (typeof wsSignalerAddr === 'string') {
                mainSignal = wsSignalerAddr
                config.wsSignalerAddr = { main: mainSignal }
            }
            if (mainSignal === defaultAddr) {
                mainSignal = undefined;
            }
            if (mainSignal && !config.wsSignalerAddr.backup) {
                signalId = url_toolkit__WEBPACK_IMPORTED_MODULE_2___default().parseURL(mainSignal).netLoc.substr(2);
            }
            // this.logger.warn(`wsSignalerAddr is deprecated, please set signal address on dashboard`);
        }
        return signalId;
    }

    get commonBrowserInfo() {
        const device = _utils_platform__WEBPACK_IMPORTED_MODULE_5___default().getPlatform();
        const netType = _utils_platform__WEBPACK_IMPORTED_MODULE_5___default().getNetType() || 'wifi';
        // this.netType = "4g";
        this.netType = netType;
        const { main, backup, byDefault } = (this.config.wsSignalerAddr || {});
        return {
            signal: byDefault ? undefined : main,
            signal2: backup,
            device,
            netType,
            player: (0,_utils_player_detector__WEBPACK_IMPORTED_MODULE_6__["default"])() || undefined,
        }
    }

    get isMobileNet() {
        return this.netType !== 'wifi' && this.netType !== 'ethernet'
    }

    setupWindowListeners(destroyed) {
        // 关闭页面前向peers发送close消息
        const iOS = ['iPad', 'iPhone'].indexOf(navigator.platform) >= 0;
        const eventName = iOS ? 'pagehide' : 'beforeunload';
        const event = () => {
            // 上报统计
            if (this.fetcher) {
                this.fetcher.postStatsWithBeacon()
            }
            if (this.p2pEnabled) {
                this.disableP2P();
            }
            self.removeEventListener(eventName, event);
        }
        if (destroyed) {
            self.removeEventListener(eventName, event);
        } else {
            self.addEventListener(eventName, event);
        }
    }

    destroy() {
        this.disableP2P(true);
        this.removeAllListeners();
        this.setupWindowListeners(true);
    }

    // 在停止的情况下重新启动P2P
    enableP2P() {
        if (!this.p2pEnabled) {
            if (this.logger) this.logger.info(`enable P2P`);
            this.config.p2pEnabled = this.p2pEnabled = true;
            if (!this.browserInfo) return null;
            this._init(this.channel, this.browserInfo);
            return this;
        }
        return null;
    }

    get version() {
        return EngineBase.version;
    }

    static isSupported() {
        const browserRTC = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getBrowserRTC)();
        return !!(browserRTC && (browserRTC.RTCPeerConnection.prototype.createDataChannel !== undefined));
    }

    static get TrackerZone() {
        return {
            CN: 'eu',      // TODO 移除
            EU: 'eu',
            HK: 'hk',
            USA: 'us',
        }
    }
}

EngineBase.version = "2.8.11";

EngineBase.protocolVersion = _peer__WEBPACK_IMPORTED_MODULE_4__["default"].VERSION;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EngineBase);


/***/ }),

/***/ "./src/core/events.js":
/*!****************************!*\
  !*** ./src/core/events.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Created by xieting on 2018/4/3.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    //data-channel
    // DC_PING: 'PING',
    // DC_PONG: 'PONG',
    DC_SIGNAL: 'SIGNAL',
    DC_OPEN: 'OPEN',
    DC_REQUEST: 'REQUEST',
    DC_SEND_REQUEST: 'SEND_REQUEST',
    DC_PIECE_NOT_FOUND: 'PIECE_NOT_FOUND',                    // 当请求的数据找不到时触发
    DC_PIECE_ABORT: 'PIECE_ABORT',
    DC_PIECE_CANCEL: 'PIECE_CANCEL',
    DC_CLOSE: 'CLOSE',
    DC_RESPONSE: 'RESPONSE',
    DC_ERROR: 'ERROR',
    DC_PIECE: "PIECE",
    DC_PIECE_DATA: "PIECE_DATA",
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
    DC_HAVE_REVERSE: 'HAVE_REVERSE',
    DC_LOST: "LOST",
    DC_GET_PEERS: "GET_PEERS",
    DC_PEERS: "PEERS",
    DC_STATS: "STATS",
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

    EXCEPTION: "exception",

    REQUESTING_MAP_HAVE: 'REQUESTING_MAP_HAVE',
    BUILDER_MAP_HAVE: 'BUILDER_MAP_HAVE',
    SYN_OUTPUT: 'SYN_OUTPUT',
    SYN_ERROR: 'SYN_ERROR',
    SYN_PARTIAL: 'SYN_PARTIAL',

});


/***/ }),

/***/ "./src/core/peer-channel.js":
/*!**********************************!*\
  !*** ./src/core/peer-channel.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/queue-microtask */ "./src/core/utils/queue-microtask.js");
/* harmony import */ var _utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/buffer */ "./src/core/utils/buffer.js");




// const errCode = require('./utils/err-code')


const MAX_BUFFERED_AMOUNT = 64 * 1024
const ICECOMPLETE_TIMEOUT = 5 * 1000
const CHANNEL_CLOSING_TIMEOUT = 5 * 1000

// HACK: Filter trickle lines when trickle is disabled #354
function filterTrickle (sdp) {
    return sdp.replace(/a=ice-options:trickle\s\n/g, '')
    // return sdp
}

function warn (message) {
    console.warn(message)
}

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */
// TODO safari主动连接chrome失败
class Peer extends (events__WEBPACK_IMPORTED_MODULE_1___default()) {
    constructor (opts) {
        // opts = Object.assign({
        //     allowHalfOpen: false
        // }, opts)

        super()


        // this._id = randombytes(4).toString('hex').slice(0, 7)

        // this._debug('new peer %o', opts)

        this.channelName = opts.initiator
            ? opts.channelName
            : null
        // console.warn(`peer-channel channelName ${this.channelName}`)

        this.initiator = opts.initiator || false
        this.channelConfig = opts.channelConfig || Peer.channelConfig
        this.channelNegotiated = this.channelConfig.negotiated
        // console.warn(Peer.config)
        // console.warn(opts.config)
        this.config = Object.assign({}, Peer.config, opts.config)
        // warn(JSON.stringify(this.config));
        this.offerOptions = opts.offerOptions || {}
        this.answerOptions = opts.answerOptions || {}
        this.sdpTransform = opts.sdpTransform || (sdp => sdp)
        // this.streams = opts.streams || (opts.stream ? [opts.stream] : []) // support old "stream" option
        this.trickle = opts.trickle !== undefined ? opts.trickle : true
        this.allowHalfTrickle = opts.allowHalfTrickle !== undefined ? opts.allowHalfTrickle : false
        this.iceCompleteTimeout = opts.iceCompleteTimeout || ICECOMPLETE_TIMEOUT

        this.destroyed = false
        this.destroying = false
        this._connected = false

        this.remoteAddress = undefined
        this.remoteFamily = undefined
        this.remotePort = undefined
        this.localAddress = undefined
        this.localFamily = undefined
        this.localPort = undefined

        this._wrtc = (opts.wrtc && typeof opts.wrtc === 'object')
            ? opts.wrtc
            : (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_0__.getBrowserRTC)()

        // if (!this._wrtc) {
        //     if (typeof window === 'undefined') {
        //         throw errCode(new Error('No WebRTC support: Specify `opts.wrtc` option in this environment'), 'ERR_WEBRTC_SUPPORT')
        //     } else {
        //         throw errCode(new Error('No WebRTC support: Not a supported browser'), 'ERR_WEBRTC_SUPPORT')
        //     }
        // }

        this._pcReady = false
        this._channelReady = false
        this._iceComplete = false // ice candidate trickle done (got null candidate)
        this._iceCompleteTimer = null // send an offer/answer anyway after some timeout
        this._channel = null
        this._pendingCandidates = []

        this._isNegotiating = false // is this peer waiting for negotiation to complete?
        this._firstNegotiation = true
        this._batchedNegotiation = false // batch synchronous negotiations
        this._queuedNegotiation = false // is there a queued negotiation request?
        this._sendersAwaitingStable = []
        this._senderMap = new Map()
        this._closingInterval = null

        // this._remoteTracks = []
        // this._remoteStreams = []

        this._chunk = null
        this._cb = null
        this._interval = null

        try {
            this._pc = new (this._wrtc.RTCPeerConnection)(this.config)
        } catch (err) {
            _utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2___default()(() => this.destroy(err))
            return
        }

        this._pc.oniceconnectionstatechange = () => {
            this._onIceStateChange()
        }
        this._pc.onicegatheringstatechange = () => {
            this._onIceStateChange()
        }
        this._pc.onconnectionstatechange = () => {
            this._onConnectionStateChange()
        }
        this._pc.onsignalingstatechange = () => {
            this._onSignalingStateChange()
        }
        this._pc.onicecandidate = event => {
            this._onIceCandidate(event)
        }

        // Other spec events, unused by this implementation:
        // - onconnectionstatechange
        // - onicecandidateerror
        // - onfingerprintfailure
        // - onnegotiationneeded

        if (this.initiator || this.channelNegotiated) {
            this._setupData({
                channel: this._pc.createDataChannel(this.channelName, this.channelConfig)
            })
        } else {
            this._pc.ondatachannel = event => {
                this._setupData(event)
            }
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
        this._needsNegotiation()

        // this._onFinishBound = () => {
        //     this._onFinish()
        // }
        // this.once('finish', this._onFinishBound)
    }

    get bufferSize () {
        return (this._channel && this._channel.bufferedAmount) || 0
    }

    // HACK: it's possible channel.readyState is "closing" before peer.destroy() fires
    // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
    get connected () {
        return (this._connected && this._channel.readyState === 'open')
    }

    // address () {
    //     return { port: this.localPort, family: this.localFamily, address: this.localAddress }
    // }

    signal (data) {
        if (this.destroyed || !this._pc) return
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data)
            } catch (err) {
                data = {}
            }
        }
        // this._debug('signal()')

        if (data.renegotiate && this.initiator) {
            // this._debug('got request to renegotiate')
            this._needsNegotiation()
        }
        // if (data.transceiverRequest && this.initiator) {
        //     // this._debug('got request for transceiver')
        //     this.addTransceiver(data.transceiverRequest.kind, data.transceiverRequest.init)
        // }
        if (data.candidate) {
            if (this._pc.remoteDescription && this._pc.remoteDescription.type) {
                try {
                    this._addIceCandidate(data.candidate)
                } catch(e) {}
            } else {
                this._pendingCandidates.push(data.candidate)
            }
        }
        if (data.sdp) {
            this._pc.setRemoteDescription(new (this._wrtc.RTCSessionDescription)(data))
                .then(() => {
                    if (this.destroyed) return

                    this._pendingCandidates.forEach(candidate => {
                        try {
                            this._addIceCandidate(candidate)
                        } catch(e) {}
                    })
                    this._pendingCandidates = []

                    if (this._pc.remoteDescription.type === 'offer') this._createAnswer()
                })
                .catch(err => {
                    this.destroy(err)
                })
        }
        if (!data.sdp && !data.candidate && !data.renegotiate && !data.transceiverRequest) {
            this.destroy(new Error('signal() called with invalid signal data'))
        }
    }

    _addIceCandidate (candidate) {
        const iceCandidateObj = new this._wrtc.RTCIceCandidate(candidate)
        this._pc.addIceCandidate(iceCandidateObj)
            .catch(err => {
                if (!iceCandidateObj.address || iceCandidateObj.address.endsWith('.local')) {
                    warn('Ignoring unsupported ICE candidate.')
                } else {
                    this.destroy(err)
                }
            })
    }

    /**
     * Send text/binary data to the remote peer.
     * @param {ArrayBufferView|ArrayBuffer|Buffer|string|Blob} chunk
     */
    send(chunk) {
        if (typeof chunk === 'string') {
            const s = RTCDataChannel.prototype.send.toString();
            if (s.includes('[native code]')) {
                this._channel.send(chunk);
            } else {
                // console.warn(s);
            }
        } else {
            this._channel.send(chunk);
        }
    }

    /**
     * Add a Transceiver to the connection.
     * @param {String} kind
     * @param {Object} init
     */
    // addTransceiver (kind, init) {
    //     // this._debug('addTransceiver()')
    //
    //     if (this.initiator) {
    //         try {
    //             this._pc.addTransceiver(kind, init)
    //             this._needsNegotiation()
    //         } catch (err) {
    //             this.destroy(err)
    //         }
    //     } else {
    //         this.emit('signal', { // request initiator to renegotiate
    //             type: 'transceiverRequest',
    //             transceiverRequest: { kind, init }
    //         })
    //     }
    // }

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

    _needsNegotiation () {
        // this._debug('_needsNegotiation')
        if (this._batchedNegotiation) return // batch synchronous renegotiations
        this._batchedNegotiation = true
        _utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2___default()(() => {
            this._batchedNegotiation = false
            if (this.initiator || !this._firstNegotiation) {
                // this._debug('starting batched negotiation')
                this.negotiate()
            } else {
                // this._debug('non-initiator initial negotiation request discarded')
            }
            this._firstNegotiation = false
        })
    }

    negotiate () {
        if (this.initiator) {
            if (this._isNegotiating) {
                this._queuedNegotiation = true
                // this._debug('already negotiating, queueing')
            } else {
                // this._debug('start negotiation')
                setTimeout(() => { // HACK: Chrome crashes if we immediately call createOffer
                    this._createOffer()
                }, 0)
            }
        } else {
            if (this._isNegotiating) {
                this._queuedNegotiation = true
                // this._debug('already negotiating, queueing')
            } else {
                // this._debug('requesting negotiation from initiator')
                this.emit('signal', { // request initiator to renegotiate
                    type: 'renegotiate',
                    renegotiate: true
                })
            }
        }
        this._isNegotiating = true
    }

    // TODO: Delete this method once readable-stream is updated to contain a default
    // implementation of destroy() that automatically calls _destroy()
    // See: https://github.com/nodejs/readable-stream/issues/283
    destroy (err) {
        this._destroy(err)
    }

    _destroy (err) {
        if (this.destroyed || this.destroying) return
        this.destroying = true

        // this._debug('destroying (error: %s)', err && (err.message || err))

        _utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2___default()(() => { // allow events concurrent with the call to _destroy() to fire (see #692)
            this.destroyed = true
            this.destroying = false

            // this._debug('destroy (error: %s)', err && (err.message || err))

            // this.readable = this.writable = false

            // if (!this._readableState.ended) this.push(null)
            // if (!this._writableState.finished) this.end()

            this._connected = false
            this._pcReady = false
            this._channelReady = false
            // this._remoteTracks = null
            // this._remoteStreams = null
            this._senderMap = null

            clearInterval(this._closingInterval)
            this._closingInterval = null

            clearInterval(this._interval)
            this._interval = null
            this._chunk = null
            this._cb = null

            // if (this._onFinishBound) this.removeListener('finish', this._onFinishBound)
            // this._onFinishBound = null

            if (this._channel) {
                try {
                    this._channel.close()
                } catch (err) {}

                // allow events concurrent with destruction to be handled
                this._channel.onmessage = null
                this._channel.onopen = null
                this._channel.onclose = null
                this._channel.onerror = null
            }
            if (this._pc) {
                try {
                    this._pc.close()
                } catch (err) {}

                // allow events concurrent with destruction to be handled
                this._pc.oniceconnectionstatechange = null
                this._pc.onicegatheringstatechange = null
                this._pc.onsignalingstatechange = null
                this._pc.onicecandidate = null
                // this._pc.ontrack = null
                this._pc.ondatachannel = null
            }
            this._pc = null
            this._channel = null

            if (err) this.emit('error', err)
            this.emit('close')
        })
    }

    _setupData (event) {
        if (!event.channel) {
            // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
            // which is invalid behavior. Handle it gracefully.
            // See: https://github.com/feross/simple-peer/issues/163
            return this.destroy(new Error('Data channel event is missing `channel` property'))
        }

        this._channel = event.channel
        this._channel.binaryType = 'arraybuffer'

        if (typeof this._channel.bufferedAmountLowThreshold === 'number') {
            this._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT
        }

        this.channelName = this._channel.label

        this._channel.onmessage = event => {
            this._onChannelMessage(event)
        }
        this._channel.onbufferedamountlow = () => {
            this._onChannelBufferedAmountLow()
        }
        this._channel.onopen = () => {
            this._onChannelOpen()
        }
        this._channel.onclose = () => {
            this._onChannelClose()
        }
        this._channel.onerror = err => {
            this.destroy(err)
        }

        // HACK: Chrome will sometimes get stuck in readyState "closing", let's check for this condition
        // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
        let isClosing = false
        this._closingInterval = setInterval(() => { // No "onclosing" event
            if (this._channel && this._channel.readyState === 'closing') {
                if (isClosing) this._onChannelClose() // closing timed out: equivalent to onclose firing
                isClosing = true
            } else {
                isClosing = false
            }
        }, CHANNEL_CLOSING_TIMEOUT)
    }

    // _read () {}

    get isBufferedAmountHigh() {
        return this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT
    }

    write (chunk, cb) {
        if (this.destroyed) return cb(new Error('cannot write after peer is destroyed'))

        if (this._connected) {
            try {
                this.send(chunk)
            } catch (err) {
                return this.destroy(err)
            }
            // console.warn(`peerchannel buffer ${this._channel.bufferedAmount}`)
            if (this.isBufferedAmountHigh) {
                // this._debug('start backpressure: bufferedAmount %d', this._channel.bufferedAmount)
                this._cb = cb
            } else {
                cb(null)
            }
        } else {
            // this._debug('write before connect')
            this._chunk = chunk
            this._cb = cb
        }
    }

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

    _startIceCompleteTimeout () {
        if (this.destroyed) return
        if (this._iceCompleteTimer) return
        // this._debug('started iceComplete timeout')
        this._iceCompleteTimer = setTimeout(() => {
            if (!this._iceComplete) {
                this._iceComplete = true
                // this._debug('iceComplete timeout completed')
                this.emit('iceTimeout')
                // console.warn(`emit _iceComplete ${new Date()}`)
                this.emit('_iceComplete')
            }
        }, this.iceCompleteTimeout)
    }

    _createOffer () {
        if (this.destroyed) return

        this._pc.createOffer(this.offerOptions)
            .then(offer => {
                if (this.destroyed) return
                if (!this.trickle && !this.allowHalfTrickle) offer.sdp = filterTrickle(offer.sdp)
                offer.sdp = this.sdpTransform(offer.sdp)
                // console.warn(`createOffer sdp ${offer.sdp}`)
                const sendOffer = () => {
                    if (this.destroyed) return
                    // console.warn(`sendOffer localDescription ${this._pc.localDescription.sdp} ${new Date()}`)
                    // console.warn(`sendOffer offer ${offer.sdp}`)
                    const signal = this._pc.localDescription || offer
                    // this._debug('signal')
                    this.emit('signal', {
                        type: signal.type,
                        sdp: signal.sdp
                    })
                }

                const onSuccess = () => {
                    // this._debug('createOffer success')
                    if (this.destroyed) return
                    if (this.trickle || this._iceComplete) sendOffer()
                    else this.once('_iceComplete', sendOffer) // wait for candidates
                }

                const onError = err => {
                    this.destroy(err)
                }

                this._pc.setLocalDescription(offer)
                    .then(onSuccess)
                    .catch(onError)
            })
            .catch(err => {
                this.destroy(err)
            })
    }

    // _requestMissingTransceivers () {
    //     if (this._pc.getTransceivers) {
    //         this._pc.getTransceivers().forEach(transceiver => {
    //             if (!transceiver.mid && transceiver.sender.track && !transceiver.requested) {
    //                 transceiver.requested = true // HACK: Safari returns negotiated transceivers with a null mid
    //                 this.addTransceiver(transceiver.sender.track.kind)
    //             }
    //         })
    //     }
    // }

    _createAnswer () {
        if (this.destroyed) return

        this._pc.createAnswer(this.answerOptions)
            .then(answer => {
                if (this.destroyed) return
                if (!this.trickle && !this.allowHalfTrickle) answer.sdp = filterTrickle(answer.sdp)
                answer.sdp = this.sdpTransform(answer.sdp)
                // console.warn(`createAnswer sdp ${answer.sdp}`)
                const sendAnswer = () => {
                    if (this.destroyed) return
                    // console.warn(`sendAnswer localDescription ${this._pc.localDescription.sdp} ${new Date()}`)
                    // console.warn(`sendAnswer answer ${answer.sdp}`)
                    const signal = this._pc.localDescription || answer
                    // this._debug('signal')
                    this.emit('signal', {
                        type: signal.type,
                        sdp: signal.sdp
                    })
                    // if (!this.initiator) this._requestMissingTransceivers()
                }

                const onSuccess = () => {
                    if (this.destroyed) return
                    if (this.trickle || this._iceComplete) sendAnswer()
                    else this.once('_iceComplete', sendAnswer)
                }

                const onError = err => {
                    this.destroy(err)
                }

                this._pc.setLocalDescription(answer)
                    .then(onSuccess)
                    .catch(onError)
            })
            .catch(err => {
                this.destroy(err)
            })
    }

    _onConnectionStateChange () {
        if (this.destroyed) return
        if (this._pc.connectionState === 'failed') {
            this.destroy(new Error('Connection failed.'))
        }
    }

    // TODO iceRestart
    _onIceStateChange () {
        if (this.destroyed) return
        const iceConnectionState = this._pc.iceConnectionState
        const iceGatheringState = this._pc.iceGatheringState

        // this._debug(
        //     'iceStateChange (connection: %s) (gathering: %s)',
        //     iceConnectionState,
        //     iceGatheringState
        // )
        this.emit('iceStateChange', iceConnectionState, iceGatheringState)

        if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
            this._pcReady = true
            this._maybeReady()
        }
        if (iceConnectionState === 'failed') {
            this.destroy(new Error('Ice connection failed.'))
        }
        if (iceConnectionState === 'closed') {
            this.destroy(new Error('Ice connection closed.'))
        }
    }

    getStats (cb) {
        // statreports can come with a value array instead of properties
        const flattenValues = report => {
            if (Object.prototype.toString.call(report.values) === '[object Array]') {
                report.values.forEach(value => {
                    Object.assign(report, value)
                })
            }
            return report
        }

        // Promise-based getStats() (standard)
        if (this._pc.getStats.length === 0) {
            this._pc.getStats()
                .then(res => {
                    const reports = []
                    res.forEach(report => {
                        reports.push(flattenValues(report))
                    })
                    cb(null, reports)
                }, err => cb(err))

            // Single-parameter callback-based getStats() (non-standard)
        } else if (this._pc.getStats.length > 0) {
            this._pc.getStats(res => {
                // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
                if (this.destroyed) return

                const reports = []
                res.result().forEach(result => {
                    const report = {}
                    result.names().forEach(name => {
                        report[name] = result.stat(name)
                    })
                    report.id = result.id
                    report.type = result.type
                    report.timestamp = result.timestamp
                    reports.push(flattenValues(report))
                })
                cb(null, reports)
            }, err => cb(err))

            // Unknown browser, skip getStats() since it's anyone's guess which style of
            // getStats() they implement.
        } else {
            cb(null, [])
        }
    }

    _maybeReady () {
        // this._debug('maybeReady pc %s channel %s', this._pcReady, this._channelReady)
        if (this._connected || this._connecting || !this._pcReady || !this._channelReady) return

        this._connecting = true

        // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339
        const findCandidatePair = () => {
            if (this.destroyed) return

            this.getStats((err, items) => {
                if (this.destroyed) return

                // Treat getStats error as non-fatal. It's not essential.
                if (err) items = []

                const remoteCandidates = {}
                const localCandidates = {}
                const candidatePairs = {}
                let foundSelectedCandidatePair = false

                items.forEach(item => {
                    // TODO: Once all browsers support the hyphenated stats report types, remove
                    // the non-hypenated ones
                    if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
                        remoteCandidates[item.id] = item
                    }
                    if (item.type === 'localcandidate' || item.type === 'local-candidate') {
                        localCandidates[item.id] = item
                    }
                    if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
                        candidatePairs[item.id] = item
                    }
                })

                const setSelectedCandidatePair = selectedCandidatePair => {
                    foundSelectedCandidatePair = true

                    let local = localCandidates[selectedCandidatePair.localCandidateId]

                    if (local && (local.ip || local.address)) {
                        // Spec
                        this.localAddress = local.ip || local.address
                        this.localPort = Number(local.port)
                    } else if (local && local.ipAddress) {
                        // Firefox
                        this.localAddress = local.ipAddress
                        this.localPort = Number(local.portNumber)
                    } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
                        // TODO: remove this once Chrome 58 is released
                        local = selectedCandidatePair.googLocalAddress.split(':')
                        this.localAddress = local[0]
                        this.localPort = Number(local[1])
                    }
                    if (this.localAddress) {
                        this.localFamily = this.localAddress.includes(':') ? 'IPv6' : 'IPv4'
                    }

                    let remote = remoteCandidates[selectedCandidatePair.remoteCandidateId]

                    if (remote && (remote.ip || remote.address)) {
                        // Spec
                        this.remoteAddress = remote.ip || remote.address
                        this.remotePort = Number(remote.port)
                    } else if (remote && remote.ipAddress) {
                        // Firefox
                        this.remoteAddress = remote.ipAddress
                        this.remotePort = Number(remote.portNumber)
                    } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
                        // TODO: remove this once Chrome 58 is released
                        remote = selectedCandidatePair.googRemoteAddress.split(':')
                        this.remoteAddress = remote[0]
                        this.remotePort = Number(remote[1])
                    }
                    if (this.remoteAddress) {
                        this.remoteFamily = this.remoteAddress.includes(':') ? 'IPv6' : 'IPv4'
                    }

                    // this._debug(
                    //     'connect local: %s:%s remote: %s:%s',
                    //     this.localAddress,
                    //     this.localPort,
                    //     this.remoteAddress,
                    //     this.remotePort
                    // )
                }

                items.forEach(item => {
                    // Spec-compliant
                    if (item.type === 'transport' && item.selectedCandidatePairId) {
                        setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId])
                    }

                    // Old implementations
                    if (
                        (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') ||
                        ((item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected)
                    ) {
                        setSelectedCandidatePair(item)
                    }
                })

                // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
                // But wait until at least 1 candidate pair is available
                if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
                    setTimeout(findCandidatePair, 100)
                    return
                } else {
                    this._connecting = false
                    this._connected = true
                }

                if (this._chunk) {
                    try {
                        this.send(this._chunk)
                    } catch (err) {
                        return this.destroy(err)
                    }
                    this._chunk = null
                    // this._debug('sent chunk from "write before connect"')

                    const cb = this._cb
                    this._cb = null
                    cb(null)
                }

                // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
                // fallback to using setInterval to implement backpressure.
                if (typeof this._channel.bufferedAmountLowThreshold !== 'number') {
                    this._interval = setInterval(() => this._onInterval(), 150)
                    if (this._interval.unref) this._interval.unref()
                }

                // this._debug('connect')
                this.emit('connect')
            })
        }
        findCandidatePair()
    }

    _onInterval () {
        if (!this._cb || !this._channel || this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
            return
        }
        this._onChannelBufferedAmountLow()
    }

    _onSignalingStateChange () {
        if (this.destroyed) return

        if (this._pc.signalingState === 'stable') {
            this._isNegotiating = false

            // HACK: Firefox doesn't yet support removing tracks when signalingState !== 'stable'
            // this._debug('flushing sender queue', this._sendersAwaitingStable)
            this._sendersAwaitingStable.forEach(sender => {
                this._pc.removeTrack(sender)
                this._queuedNegotiation = true
            })
            this._sendersAwaitingStable = []

            if (this._queuedNegotiation) {
                // this._debug('flushing negotiation queue')
                this._queuedNegotiation = false
                this._needsNegotiation() // negotiate again
            } else {
                // this._debug('negotiated')
                this.emit('negotiated')
            }
        }

        // this._debug('signalingStateChange %s', this._pc.signalingState)
        this.emit('signalingStateChange', this._pc.signalingState)
    }

    _onIceCandidate (event) {
        if (this.destroyed) return
        if (event.candidate && this.trickle) {
            this.emit('signal', {
                type: 'candidate',
                candidate: {
                    candidate: event.candidate.candidate,
                    sdpMLineIndex: event.candidate.sdpMLineIndex,
                    sdpMid: event.candidate.sdpMid
                }
            })
        } else if (!event.candidate && !this._iceComplete) {
            // 到这里说明没有新的candidate了
            // console.warn(`_onIceCandidate event ${event}`)
            this._iceComplete = true
            this.emit('_iceComplete')
        }
        // as soon as we've received one valid candidate start timeout
        if (event.candidate) {
            // console.warn(`_startIceCompleteTimeout ${new Date()}`)
            this._startIceCompleteTimeout()
        }
    }

    _onChannelMessage (event) {
        if (this.destroyed) return
        let data = event.data
        if (data instanceof ArrayBuffer) data = _utils_buffer__WEBPACK_IMPORTED_MODULE_3__.Buffer.from(data)
        this.emit('data', data)
    }

    _onChannelBufferedAmountLow () {
        if (this.destroyed || !this._cb) return
        // this._debug('ending backpressure: bufferedAmount %d', this._channel.bufferedAmount)
        const cb = this._cb
        this._cb = null
        cb(null)
    }

    _onChannelOpen () {
        if (this._connected || this.destroyed) return
        // this._debug('on channel open')
        this._channelReady = true
        this._maybeReady()
    }

    _onChannelClose () {
        if (this.destroyed) return
        // this._debug('on channel close')
        this.destroy()
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
}

// Peer.WEBRTC_SUPPORT = !!getBrowserRTC()

/**
 * Expose peer and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config or opts.channelConfig
 * when constructing a Peer.
 */
Peer.config = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:global.stun.twilio.com:3478',
                // 'stun:stun.cdnbye.com'
            ]
        }
    ],
    sdpSemantics: 'unified-plan'
}

Peer.channelConfig = {}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Peer);


/***/ }),

/***/ "./src/core/peer-manager.js":
/*!**********************************!*\
  !*** ./src/core/peer-manager.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class PeerManager {

    constructor() {
        this.peerMap = new Map();                 // remotePeerId -> dc
    }

    isEmpty() {
        return this.peerMap.size === 0;
    }

    size() {
        return this.peerMap.size;
    }

    clear() {
        this.peerMap.clear();
    }

    getPeers() {
        return [...this.peerMap.values()];
    }

    getPeerValues() {
        return this.peerMap.values();
    }

    hasPeer(peerId) {
        return this.peerMap.has(peerId)
    }

    addPeer(peerId, peer) {
        this.peerMap.set(peerId, peer);
}

    getPeerIds() {
        return [...this.peerMap.keys()];
    }

    removePeer(peerId) {
        this.peerMap.delete(peerId);
    }

    getPeersOrderByWeight() {

        const availablePeers = this.getAvailablePeers();
        // availablePeers.forEach(p => {
        //     console.warn(p.weight + "")
        // });
        availablePeers.sort((p1, p2) => {
            if (p2.weight === 0) {    // weight是0的节点排在前面
                return 1;
            } else if (p1.weight === 0) {    // weight是0的节点排在前面
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

    getPeer(peerId) {
        return this.peerMap.get(peerId);
    }

    getAvailablePeers() {
        return this.getPeers().filter(peer => peer.isAvailableUrgently);
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PeerManager);


/***/ }),

/***/ "./src/core/peer-pool.js":
/*!*******************************!*\
  !*** ./src/core/peer-pool.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PeerPool)
/* harmony export */ });
/* harmony import */ var $Peer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! $Peer */ "./src/core/peer.js");


class PeerPool {
    constructor(engine, config, poolSize = 15) {
        this.engine = engine;
        this.config = config;
        this.trickle = config.waitForPeer;
        this.poolSize = poolSize;
        this.pool = [];
        // console.warn(`create pool size ${poolSize}`);
        for (let i=0; i<poolSize; i++) {
            this.pool.push(this._createPeer());
        }
        this.timer = setTimeout(() => {
            this.destroy();
        }, 20000)
    }

    _createPeer() {
        return new $Peer__WEBPACK_IMPORTED_MODULE_0__["default"](this.engine, undefined, undefined, true, this.config, { trickle: this.trickle })
    }

    get size() {
        return this.pool.length
    }

    getPeer() {
        if (this.size === 0) {
            return this._createPeer()
        }
        return this.pool.shift()
    }

    destroy() {
        for (let dc of this.pool) {
            dc.destroy(true);
        }
        this.pool = [];
        clearTimeout(this.timer);
    }
}


/***/ }),

/***/ "./src/core/peer.js":
/*!**************************!*\
  !*** ./src/core/peer.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _peer_channel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./peer-channel */ "./src/core/peer-channel.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./events */ "./src/core/events.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _segment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./segment */ "./src/core/segment.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_utils_platform__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/buffer */ "./src/core/utils/buffer.js");






// import { pack, unpack } from './sdp/index'


const DC_TOLERANCE = 2;                   // 请求超时或错误多少次阻塞该peer
const ALPHA = 0.6;                        // weight平滑系数

class Peer extends (events__WEBPACK_IMPORTED_MODULE_1___default()) {

    static get defaultPacketSize() {
        return _utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_PACKET_SIZE
    }

    static get VERSION() {
        return "8"
    }

    constructor(engine, peerId, remotePeerId, isInitiator, config, options = {}) {
        super();
        // console.warn(`new datachannel`)
        this.channel = engine.fetcher.channelId;
        this.logger = engine.logger;
        this.config = config;
        this.isInitiator = isInitiator;
        this.options = options;
        this.intermediator = options.intermediator || null;
        this.signalMsgs = [];          // 暂时存放发送的信令信息
        // if (this.intermediator) this.logger.info(`${remotePeerId} intermediator is ${this.intermediator}`);
        this.assignPeerId(peerId, remotePeerId);
        this.platform = 'unknown';
        this.super = false                              // 是否超级节点
        this.mobile = false;                            // 是否移动端
        this.mobileWeb = false;                         // 是否移动web端
        this.mobileNet = false;
        this.connected = false;
        this.msgQueue = [];
        this.miss = 0;                            // 超时或者错误的次数
        // this.bitset;
        this.notifySet = new Set();
        this.bufArr = [];

        this.packetSize = _utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_PACKET_SIZE;    //每个数据包的大小

        // 下载控制
        this.sendReqQueue = [];                   // 发送的请求的队列    队列头部优先级最高 sn
        this.downloading = false;
        this.uploading = false;
        this.choked = false;
        this.streamListeners = [];
        this.pieceMsg = {};      // attachments, seg_id, sn, size, reverse

        // 上传控制
        this.uploadInterrupter = {
            targetSegId: undefined,
            currentSegId: undefined,
            canceled: false,
        };
        this.datasToSend = [];
        this.bytesUploaded = 0;
        this.dataWriting = false;

        // 统计
        this.timeSendRequest = 0;        // 发送request的时刻 毫秒    用于计算节点权重
        this.timeReceivePiece = 0;        // 接收到piece的时刻 毫秒    用于shouldWaitForRemain
        this.timeSendPiece = 0;          // 发送piece的时刻 毫秒
        this.weight = 0;                 // 平均速度 byte/ms
        this.peersConnected = 1;         // 已连接的节点数
        this.uploadSpeed = 0;            // 上行速度，byte/ms  用于订阅模式
        this.gotPeers = false;           // 是否向该peer请求过节点
        this.currentLevel = 0;           // 当前码率， 用于hls-de
        this.currentPos = 0;           // 当前播放位置
        this.useBackupSignal = false;

        // 如果指定了stun
        this.webRTCConfig = {};
        // console.warn(this.options.stuns)
        const { stuns } = this.options;
        if (stuns && stuns.length > 0) {
            const urls = [];
            stuns.forEach(url => {
                this.logger.info(`use stun ${url}`);
                urls.push({urls: url})
            });
            this.webRTCConfig.iceServers = urls;
        }
        if (this.config.webRTCConfig) {
            this.webRTCConfig = {
                ...this.config.webRTCConfig,
                ...this.webRTCConfig,
            }
        }

        // playlist
        this.playlistMap = new Map();                // url -> {data, seq} seq是m3u8最大的ts序号

        this._initPeerChannel();

        // this.downloadNum = 0;                       // 正在下载的请求个数
        this.notFatalClosed = false;

        this.startSN = Number.MAX_SAFE_INTEGER;            // 当前peer拥有的最小的SN
        this.endSN = -1;                                   // 当前peer拥有的最大的SN
        this._loadedBytes = 0;
        // this.testCount = 0;
    }

    assignPeerId(peerId, remotePeerId) {
        this.remotePeerId = remotePeerId;
        this.channelId = this.isInitiator ? `${peerId}-${remotePeerId}` : `${remotePeerId}-${peerId}`;                    //标识该channel
        if (remotePeerId) {
            this.timeJoin = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getCurrentTs)();      // 加入时间，用于get peers
            this.dataExchangeTs = this.timeJoin;                   // 最近发生数据交换的时间戳
            this.gotStatsTs = this.timeJoin;                   // 最近接收到stats的时间戳
            this._startTimer();
        }
        setTimeout(() => {
            for (let msg of this.signalMsgs) {
                // console.warn(`emit`)
                // console.warn(JSON.stringify(msg))
                this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_SIGNAL, msg, true);
            }
        }, 0)
    }

    _startTimer() {
        // P2P连接超时控制
        this.connTimeout = setTimeout(() => {
            this.logger.warn(`dc ${this.channelId} connection timeout`);
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_TIMEOUT);
        }, 20000);
    }

    get isAvailable() {
        return this.downloadNum < 2 && !this.choked;
    }

    get isAvailableUrgently() {
        return !this.downloading && !this.choked;
    }

    cancelDownload(sn, level, segId) {
        if (!segId || !this.downloading) return
        if (this.streamListeners.length > 0) return
        if (this.remainAttachments <= 2) return
        this.logger.info(`cancel download ${segId} remain packets ${this.remainAttachments}`);
        this.timeReceivePiece = 0;
        return this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_CANCEL,
            sn,
            level,
            seg_id: segId,
        })
    }

    addStreamListener(reverse, peerId, handler) {
        this.streamListeners.push({
            handler,
            peerId
        })
    }

    removeStreamListener(peerId) {
        this.streamListeners = this.streamListeners.filter(item => {
            if (item.peerId === peerId) {
                item.handler(undefined, undefined, true, 'aborted by cancel');
                return false
            }
            return true
        });
    }

    _initPeerChannel() {
        // const id = performance.now()+'';
        const datachannel = new _peer_channel__WEBPACK_IMPORTED_MODULE_0__["default"]({
            initiator: this.isInitiator,
            // channelName: this.channelId,
            trickle: this.options.trickle || false,
            config: this.webRTCConfig,
        });
        this._datachannel = datachannel;
        datachannel.on('error', (err) => {
            // logger.warn('datachannel error', err);
            let fatal = true;
            if (err.message === 'Ice connection failed.' && this.notFatalClosed) {
                fatal = false;
            }
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_ERROR, fatal);
        });
        // console.time(id)
        datachannel.on('signal', data => {
            // console.timeLog(id)
            // console.warn(JSON.stringify(data))
            this.signalMsgs.push(data);
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_SIGNAL, data);
        });

        const _onConnect = () => {

            this.logger.info(`datachannel CONNECTED to ${this.remotePeerId} from ${this.intermediator?'peer':'server'}`);
            this.connected = true;
            clearTimeout(this.connTimeout);
            this.signalMsgs = [];
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_OPEN);

            //发送消息队列中的消息
            while (this.msgQueue.length > 0) {
                let msg = this.msgQueue.shift();
                this.emit(msg.event, msg);
            }
            // if (!this.statser) {
            //     this.setupStats();
            // }
        };

        datachannel.on('connect', _onConnect);

        datachannel.on('data', data => {
            // console.warn(`dc ondata`)
            // console.warn(data)
            const { logger } = this;
            if (typeof data === 'string') {

                let msg = JSON.parse(data);
                if (!msg) {
                    logger.error(`dc received string is null`);
                    return
                }
                //如果还没连接，则先保存在消息队列中
                if (!this.connected) {
                    this.msgQueue.push(msg);
                    // _onConnect();
                    return;
                }
                let event = msg.event;

                let str;
                if (event !== _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAYLIST && event !== _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PEER_SIGNAL) {
                    str = `string: ${data}`;
                } else {
                    str = `event: ${event}`;
                }
                logger.debug(`datachannel receive ${str} from ${this.remotePeerId}`);

                switch (event) {
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_HAVE:
                        this.emit(msg.event, msg);
                        if (!msg.sn) return;
                        if (!this.config.live) {
                            if (msg.sn < this.startSN) {
                                this.startSN = msg.sn;
                                // console.warn(`this.startSN ${this.startSN}`);
                            }
                            if (msg.sn > this.endSN) {
                                this.endSN = msg.sn;
                            }
                        }
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE:
                        this.downloading = true;                     // 订阅
                        this.dataExchangeTs = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getCurrentTs)();
                        this.timeReceivePiece = performance.now();
                        this.pieceMsg = msg;
                        this._prepareForBinary(msg.attachments, msg.seg_id, msg.sn, msg.size);
                        this.emit(msg.event, msg);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_CANCEL:
                        this.uploadInterrupter.targetSegId = msg.seg_id;
                        this.emit(msg.event, msg);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_NOT_FOUND:
                        if (!this._sendNextReq()) {
                            this.downloading = false;
                        }
                        this.emit(msg.event, msg);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_REQUEST:
                        this._handleRequestMsg(msg);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_ACK:
                        if (!this.uploadInterrupter.canceled) {
                            this._handlePieceAck(msg.size, msg.miss);
                            this.emit(msg.event, msg);
                        }
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_STATS:
                        this._handleStats(msg);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAYLIST:
                        // console.warn(JSON.stringify(msg));
                        if (this.config.sharePlaylist) {
                            this._handlePlaylist(msg);
                        }
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_METADATA:          // bug 没收到
                        this._handleMetadata(msg);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_ABORT:
                        if (this.downloading) {
                            this._notifyDownloadListenersAbort('aborted by upstream peer');
                            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_ABORT, msg);
                        }
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_CHOKE:
                        logger.info(`choke peer ${this.remotePeerId}`);
                        this.choked = true;
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_UNCHOKE:
                        logger.info(`unchoke peer ${this.remotePeerId}`);
                        this.choked = false;
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_CLOSE:
                        this.emit(msg.event, msg.fatal || false);
                        break;
                    default:
                        this.emit(msg.event, msg);
                }
            } else {                                       //binary data
                if (!data) {
                    logger.error(`datachannel on data is undefined!`);
                    return  // TODO 验证
                }
                // console.warn(`datachannel receive binary data size ${data.byteLength}`);
                if (!this.downloading) {
                    logger.warn(`peer not downloading, data size ${data.byteLength} pieceMsg ${JSON.stringify(this.pieceMsg)}`);
                    return
                }
                // test
                // setTimeout(() => {
                //     this._handleBinaryMsg(data);
                // }, 3000);
                this._handleBinaryMsg(data);
            }
        });

        datachannel.once('close', () => {
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_CLOSE, false);
        });

        datachannel.on('iceStateChange', (iceConnectionState, iceGatheringState) => {
            if (iceConnectionState === 'disconnected') {
                this.logger.warn(`${this.remotePeerId} disconnected`);
                this.connected = false;
            }
        })
    }

    sendJson(json) {
        if (json.event !== _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAYLIST && json.event !== _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PEER_SIGNAL) {
            // if (true) {
            this.logger.debug(`dc bufferSize ${this._datachannel.bufferSize} send ${JSON.stringify(json)} to ${this.remotePeerId}`);
        } else {
            this.logger.debug(`dc send event ${json.event} to ${this.remotePeerId}`);
        }
        const str = JSON.stringify(json);
        if (str.length > _utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_PACKET_SIZE) {
            // 防止数据包过大
            this.logger.error(`string to send is too large`)
            return false
        }
        return this.send(str, false);
    }

    send(data, queued = true) {
        if (queued) {
            // if (this._checkIfNeedInterrupt()) return
            this.datasToSend.push(data);
            if (!this.dataWriting) {
                this._sendDataSync();
            }
            return true
        }
        return this.sendImmediately(data)
    }

    _checkIfNeedInterrupt() {
        const { targetSegId, currentSegId, canceled } = this.uploadInterrupter;
        if (canceled) {
            // this.logger.warn(`canceled segId ${targetSegId}, ignored`);
            return true
        }
        if (targetSegId && targetSegId === currentSegId) {
            this.logger.info(`cancel send data`);
            this.sendMsgPieceAbort(`${currentSegId} transfer canceled`);
            this.datasToSend = [];
            this.uploadInterrupter.canceled = true;
            this._handlePieceAck(this.bytesUploaded, 0);
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_ACK, {seg_id: currentSegId, size: this.bytesUploaded, canceled: true});
            return true
        }
        return false
    }

    _sendDataSync() {
        // 判断是否收到cancel
        if (this._checkIfNeedInterrupt() || this.datasToSend.length === 0) {
            this.dataWriting = false;
            return
        }
        this.dataWriting = true;
        const data = this.datasToSend.shift();
        if (!data) {
            this.logger.error(`sendDataSync data is undefined!`);
            return
        }
        this.bytesUploaded += data.byteLength;
        // console.warn(`datasToSend.shift() bufferSize ${this._datachannel.bufferSize}`)
        this._datachannel.write(data, (err) => {
            if (err) {
                this.dataWriting = false;
                this.logger.warn(err.message);
                this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_ERROR, false);
                return
            }
            this._sendDataSync();
        });
    }

    sendImmediately(data) {
        if (this._datachannel.connected) {
            try {
                this._datachannel.send(data);
                return true;
            } catch (e) {
                this.logger.warn(`datachannel ${this.channelId} send data failed, close it`);
                this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_ERROR, false);
            }
        }
        return false;
    }

    sendMsgHave(sn, segId, ext = {}) {
        const reverse = ext.reverse || undefined;
        delete ext.reverse;
        this.sendJson({
            event: reverse ? _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_HAVE_REVERSE : _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_HAVE,
            sn: sn,
            seg_id: segId,
            ...ext,
        })
    }

    sendPieceNotFound(sn, segId, ext = {}) {
        this.uploading = false;
        this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_NOT_FOUND,
            seg_id: segId,
            sn,
            ...ext,
        })
    }

    sendPeers(peers) {
        this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PEERS,
            peers,
        })
    }

    sendPeersRequest() {
        this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_GET_PEERS,
        })
    }

    sendMsgStats(totalConns, extra = {}) {
        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_STATS,
            total_conns: totalConns,
            ...extra,
        };
        this.sendJson(msg);
    }

    sendMsgPlaylist(url, data, seq) {
        const lastPlaylistInfo = this.playlistMap.get(url);
        if (lastPlaylistInfo && lastPlaylistInfo.seq >= seq) return
        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAYLIST,
            url,
            data,
            seq
        };
        this.playlistMap.set(url, {
            data,
            seq,
        });
        this.sendJson(msg);
    }

    sendMsgSignal(toPeerId, fromPeerId, data) {
        return this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PEER_SIGNAL,
            action: 'signal',
            to_peer_id: toPeerId,
            from_peer_id: fromPeerId,
            data,
        })
    }

    sendMsgSignalReject(toPeerId, fromPeerId, reason, fatal = false) {
        return this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PEER_SIGNAL,
            action: 'reject',
            to_peer_id: toPeerId,
            from_peer_id: fromPeerId,
            reason,
            fatal,
        })
    }

    sendMetaData(field, sequential, peers, mobileNet = false) {
        // 开始计时
        if (this.isInitiator) this.timeSendRequest = performance.now();

        this.sendJson({                                        //向peer发送bitfield
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_METADATA,
            field: field,
            platform: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_WEB,
            mobile: !!_utils_platform__WEBPACK_IMPORTED_MODULE_5___default().isMobile(),
            mobile_net: mobileNet,
            channel: this.channel,                      // 频道ID
            version: "2.8.11",                       // SDK版本号
            sequential,
            peers,
        });
    }

    // 目前可能还是反向状态
    sendPartialBuffer(pieceMsg, bufArr, ext = {}) {
        this.sendMsgPiece(pieceMsg, ext);
        for (let j = 0; j < bufArr.length; j++) {
            this.send(bufArr[j]);
        }
    }

    sendMsgPiece(msg, ext = {}) {
        const { targetSegId } = this.uploadInterrupter;
        if (targetSegId && targetSegId === msg.seg_id) {
            this.logger.info(`cancel send piece msg`);
            this.sendMsgPieceAbort(`${targetSegId} piece canceled`);
            this.uploadInterrupter.canceled = true;
            return
        }
        this.uploadInterrupter = {
            currentSegId: msg.seg_id,
            targetSegId: undefined,
            canceled: false,
        }
        this.datasToSend = [];
        this.bytesUploaded = 0;
        if (!msg.ext) msg.ext = {};
        if (msg.ext.from && ext.from) {
            ext.from = `${msg.ext.from}->${ext.from}`;
        }
        if (ext.incompletes && msg.ext.incompletes) {
            ext.incompletes += msg.ext.incompletes;
        }

        ext = Object.assign({}, msg.ext, ext);
        const msgToSend = {
            ...msg,
            ext,
        };
        // console.warn(`sendMsgPiece ${JSON.stringify(msg)}`);
        this.sendJson(msgToSend);
    }

    sendBuffer(sn, segId, payload, ext = {}) {
        const reverse = ext.reverse || undefined;
        delete ext.reverse;
        if (!payload) {
            this.logger.error(`sendBuffer payload is undefined!`);
            return
        }
        let dataSize = payload.byteLength,                                //二进制数据大小
            // packetSize = DEFAULT_PACKET_SIZE,                          //每个数据包的大小
            remainder = 0,                                                //最后一个包的大小
            attachments = 0;                                              //分多少个包发
        if (dataSize % this.packetSize === 0) {
            attachments = dataSize / this.packetSize;
        } else {
            attachments = Math.floor(dataSize / this.packetSize) + 1;
            remainder = dataSize % this.packetSize;
        }
        let response = {
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE,
            // ext,
            attachments,
            // attachments: 1,           // test
            seg_id: segId,
            sn,
            level: ext.level,
            size: dataSize,
            // size: 1000          // test
            reverse,
        };

        // test
        // this.sendPieceNotFound(sn, segId, { level: ext.level });
        // return

        delete ext.level;
        this.sendMsgPiece(response, ext);
        // console.warn(`send segment to ${this.remotePeerId} ${JSON.stringify(response)} packetSize ${this.packetSize}`);

        const bufArr = dividePayload(payload, this.packetSize, attachments, remainder);
        this._sendBufferArray(bufArr, reverse);

        this.uploading = false;

        // setTimeout(() => {
        //     this.send(bufArr[bufArr.length-1]);
        //     console.warn(`send buffer ${bufArr.length-1} of ${sn}`)
        // }, 2000)

        // test
        // this.send(new ArrayBuffer(1000))

        // 计时
        this.timeSendPiece = performance.now();
    }

    get downloadNum() {
        if (!this.downloading) return 0;
        return this.sendReqQueue.length + 1;
    }

    // cancelRequestById(segId) {
    //     this.sendReqQueue = this.sendReqQueue.filter(msg => msg.seg_id !== segId);
    // }
    //
    // cancelRequestBySN(sn) {
    //     this.sendReqQueue = this.sendReqQueue.filter(msg => msg.sn !== sn);
    // }

    requestDataById(segId, sn, urgent = false, ext = {}) {                                     //由于需要阻塞下载数据，因此request请求用新的API
        // this.logger.info(`requestDataById downloadNum ${this.downloadNum}`);

        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_REQUEST,
            seg_id: segId,
            sn,
            ...ext,
            urgent: urgent
        };
        if (this.downloading) {
            this.logger.info(`${this.remotePeerId} add req ${segId} in queue`);
            urgent ? this.sendReqQueue.unshift(msg) : this.sendReqQueue.push(msg);
        } else {
            this._realRequestData(msg);
        }
    }

    requestDataBySN(sn, urgent = false, ext = {}) {
        // console.warn(`requestDataBySN downloadNum ${this.downloadNum}`);

        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_REQUEST,
            sn,                                               //ts数据的播放序号
            ...ext,
            urgent: urgent                                        //是否紧急
        };
        if (this.downloading) {
            this.logger.info(`add req ${sn} in queue`);
            urgent ? this.sendReqQueue.unshift(msg) : this.sendReqQueue.push(msg);
        } else {
            this._realRequestData(msg);
        }
    }

    // test
    // _sendBufferArray(bufArr, reverse = false) {
    //     console.warn(`_sendBufferArray`);
    //     const totalTime = 20000;
    //     const duration = totalTime / bufArr.length;
    //     const _this = this;
    //     const arrToSend = reverse ? bufArr.reverse() : bufArr;
    //     const segId = this.uploadInterrupter.currentSegId;
    //     for (let i=0; i<bufArr.length; i++) {
    //         (function (j) {
    //             setTimeout(() => {
    //                 if (segId === _this.uploadInterrupter.currentSegId) {
    //                     console.warn(`send packet ${j}`);
    //                     _this.send(arrToSend[j]);
    //                 }
    //             }, (i+1)*duration)
    //         })(i)
    //     }
    //
    //     // if (++this.testCount === 15) {
    //     //     console.warn('--------------start test------------------')
    //     //     // test
    //     //     if (reverse) {
    //     //         for (let j = bufArr.length-1; j >= 2; j--) {
    //     //             this.send(bufArr[j]);
    //     //         }
    //     //         // this.send(bufArr[bufArr.length-1]);
    //     //         // return
    //     //     }
    //     //     else {
    //     //         for (let j = 0; j < bufArr.length-2; j++) {
    //     //             this.send(bufArr[j]);
    //     //         }
    //     //         // this.send(bufArr[0]);
    //     //     }
    //     //     // this.sendMsgPieceAbort('test abort');
    //     //     return
    //     // }
    // }

    _sendBufferArray(bufArr, reverse = false) {
        const arrToSend = reverse ? bufArr.reverse() : bufArr;
        for (let j = 0; j < arrToSend.length; j++) {
            this.send(arrToSend[j]);
        }
    }

    _realRequestData(msg) {
        // test
        // setTimeout(() => {
        //     this.sendJson(msg);
        // }, 3000);

        this.sendJson(msg);

        // 开始计时
        this.timeSendRequest = performance.now();
        this.downloading = true;
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_SEND_REQUEST);
    }

    // 如果下载速度大于剩余部分需要的最低下载速度，则继续等待
    // remainLoadTime: ms
    shouldWaitForRemain(remainLoadTime) {
        if (this.bufArrSize === 0) return false;
        if (this.timeReceivePiece === 0) return false;
        // this.logger.warn(`${this.bufArrSize} of ${this.pieceMsg.attachments} packets loaded`);
        // 计算下载速度 byte/ms = KB/s
        return this.currentLoadSpeed() >= this.minRequiredSpeed(remainLoadTime)
    }

    close(fatal) {
        if (!fatal) {
            this.notFatalClosed = true;
        }
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_CLOSE, fatal);
    }

    receiveSignal(data) {
        // console.warn(JSON.stringify(data));
        if (data) this._datachannel.signal(data);
    }

    _notifyDownloadListenersAbort(reason) {
        for (let item of this.streamListeners) {
            const { handler } = item;
            handler(undefined, undefined, true, reason);
        }
        this.streamListeners = [];
    }

    destroy(fatal = true) {
        this.logger.info(`destroy datachannel ${this.channelId}`);
        // self.clearTimeout(this.requestTimeout);                            //清除定时器
        if (this.chokeTimer) clearTimeout(this.chokeTimer);
        if (this.connTimeout) clearTimeout(this.connTimeout);
        if (this.uploading) this.sendMsgPieceAbort('peer is closing');
        // 通知其他peer abort
        this._notifyDownloadListenersAbort('upstream peer is closed');
        let msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_CLOSE,
            fatal,
        };
        this.sendJson(msg);
        this._datachannel.removeAllListeners();
        this.removeAllListeners();
        this._datachannel.destroy();
    }

    _handleBinaryMsg(data) {
        const { attachments, level, reverse } = this.pieceMsg
        if (this.listenerCount(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_RESPONSE) > 0) this.bufArr.push(data);     // 兼容
        this._loadedBytes += data.byteLength;
        this.remainAttachments--;
        let dataSn = reverse ? this.remainAttachments+1 : attachments-this.remainAttachments;
        const finished = this.remainAttachments === 0

        // test
        // if (this.remainAttachments === 3) {
        //     this.cancelDownload(this.bufSN, 0, this.segId)
        // }

        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_DATA, this.bufSN, this.segId, data, dataSn, finished, this.pieceMsg);

        // 通知其他peer已经有新的data
        if (this.streamListeners.length > 0) {
            for (let item of this.streamListeners) {
                const { handler } = item;
                // console.warn(`handler sn ${this.bufSN} length ${targetBuffer.byteLength}`);
                handler(this.bufSN, this.segId, false, data, finished);
            }
        }

        if (finished) {
            this.streamListeners = [];
            // 计算下载速度

            if (this.timeSendRequest > 0) {
                if (this.super) {
                    this.weight = 1;   // 保证是最后才用的
                } else {
                    const downloadSpeed = this.expectedSize / (performance.now() - this.timeSendRequest);
                    // console.warn(this.remotePeerId + " expectedSize " + this.expectedSize + " time " +
                    //     (performance.now() - this.timeSendRequest) +
                    //     " downloadSpeed " + downloadSpeed);
                    this.weight = this.weight>0 ? ALPHA*this.weight + (1-ALPHA)*(downloadSpeed) : downloadSpeed;       // 设置本节点的权重
                }
                // console.warn("weight " + this.weight);
            }

            // console.warn(`remainAttachments downloadNum ${this.downloadNum}`);

            this.sendJson({                                                      //发送给peer确认信息
                event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_ACK,
                sn: this.bufSN,
                seg_id: this.segId,
                level,
                size: this.expectedSize,
                miss: this.miss || undefined,
            });
            this.timeSendRequest = 0;
            this.timeReceivePiece = 0;
            // 从请求队列拿出一个msg
            if (!this._sendNextReq()) {
                this.downloading = false;
            }
            this._handleBinaryData(reverse);
        }
    }

    _sendNextReq() {
        if (this.sendReqQueue.length > 0) {
            const msg = this.sendReqQueue.shift();
            this.logger.info(`get msg from sendReqQueue ${JSON.stringify(msg)}`);
            this._realRequestData(msg);
            return true;
        }
        return false;
    }

    _handlePlaylist(msg) {
        const { url, data, seq } = msg;
        // console.warn(`this.playlistMap.set ${url} seq ${seq}`)
        this.playlistMap.set(url, {
            data,
            seq,
        })
    }

    getLatestPlaylist(url, lastSeq) {
        if (!this.playlistMap.has(url)) {
            // console.warn(`playlistMap no url ${url}`);
            return null;
        }
        const playlist = this.playlistMap.get(url);
        if (playlist.seq <= lastSeq || playlist.seq > lastSeq + 2) {
            // console.warn(`playlist.ts <= lastTs`);
            return null;
        }
        return playlist;
    }

    _handleMetadata(msg) {
        const { logger } = this;
        if (this.isInitiator) {
            const duration = performance.now() - this.timeSendRequest;
            if (duration > 0) {
                this.weight = 100000 / duration;
                logger.info(`handle Metadata from ${this.remotePeerId} initial weight ${this.weight}`);
            }
            this.timeSendRequest = 0;
        }
        // clearTimeout(this.connTimeout);    // TODO bug
        // 识别频道ID
        const channel = msg.channel;
        // console.warn(`channel ${this.channel} peer channel ${channel}`);
        if (this.channel !== channel) {
            logger.error(`peer channel ${channel} not matched!`);
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_ERROR, true);
            return;
        }
        // 识别super peer
        if (msg.super) {
            logger.info(`got super peer ${this.remotePeerId}`)
            this.super = true;
            // super peer需要同一个token TODO 验证
            const { token } = this.config;
            if (token && msg.token !== token) {
                logger.warn(`super peer token ${msg.token} not matched!`);
                this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_ERROR, true);
                return;
            }
        }
        // 识别platform
        const plat = msg.platform;
        switch (plat) {
            case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_ANDROID:
                this.platform = _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_ANDROID;
                break;
            case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_IOS:
                this.platform = _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_IOS;
                break;
            case _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_WEB:
                this.platform = _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_WEB;
                break;
        }
        // 识别mobile
        this.mobile = msg.mobile || false;
        this.mobileNet = msg.mobile_net || false;
        this.mobileWeb = (this.mobile && this.platform === _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PLAT_WEB) || false;
        this.sequential = msg.sequential;
        logger.info(`${this.remotePeerId} platform ${this.platform} sequential ${this.sequential}`);

        if (msg.peers) {
            this.peersConnected += msg.peers;
            logger.info(`${this.remotePeerId} now has ${this.peersConnected} peers`);
        }
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_METADATA, msg);

        if (!msg.field || this.config.live) return;
        // console.warn(`msg.field ${msg.field}`)
        if (msg.sequential) {
            const { field } = msg;
            if (Array.isArray(field)) {
                this._handleField(field)
            } else {
                for (let level in field) {
                    this._handleField(field[level])
                }
            }
            // console.warn(`startSN ${this.startSN} endSN ${this.endSN}`)
        }
    }

    _handleField(field) {
        field.forEach(value => {
            if (value >= 0) {
                if (value < this.startSN) {
                    this.startSN = value;
                }
                if (value > this.endSN) {
                    this.endSN = value;
                }
            }
        });
    }

    _handleStats(msg) {
        this.gotStatsTs = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getCurrentTs)();
        const totalConns = msg.total_conns;
        if (totalConns > 0 && this.peersConnected !== totalConns) {
            this.peersConnected = totalConns;
            this.logger.info(`${this.remotePeerId} now has ${this.peersConnected} peers`);
        }
        if (msg.level) {
            this.currentLevel = msg.level;
        }
        if (msg.pos) {
            this.currentPos = msg.pos;
        }
    }

    _handleRequestMsg(msg) {
        this.dataExchangeTs = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getCurrentTs)();
        if (this.uploading) {
            this.logger.warn(`${this.remotePeerId} is uploading when receive request`);
            this.sendPieceNotFound(msg.sn, msg.seg_id, {level: msg.level});
            return
        }

        // test
        // if (!msg.urgent) {
        //     console.warn(`!test`);
        //     return;
        // }

        this.uploading = true;
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_REQUEST, msg);
    }

    _handlePieceAck(size, miss) {
        // 计算上传速度  byte/ms = KB/s
        if (this.timeSendPiece !== 0) {
            this.uploadSpeed = Math.round(size/(performance.now()-this.timeSendPiece)*2);
            this.timeSendPiece = 0;
            this.logger.info(`${this.remotePeerId} uploadSpeed is ${this.uploadSpeed}`);
        }
        if (miss > 0) {
            this.logger.warn(`peer ${this.remotePeerId} miss ${miss}`);
        }
    }

    _prepareForBinary(attachments, segId, sn, expectedSize) {
        this.bufArr = [];
        this._loadedBytes = 0;
        this.remainAttachments = attachments;
        this.segId = segId;
        this.bufSN = sn;
        this.expectedSize = expectedSize;
    }

    _handleBinaryData(reverse = false) {
        // console.warn(`listenerCount ${this.listenerCount(Events.DC_RESPONSE)}`);
        if (this.listenerCount(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_RESPONSE) > 0) {
            // 有监听才执行
            if (reverse) {
                this.bufArr.reverse();
            }
            let payload = _utils_buffer__WEBPACK_IMPORTED_MODULE_6__.Buffer.concat(this.bufArr);
            // this.logger.debug(`expectedSize ${this.expectedSize}, byteLength ${payload.byteLength}`);
            const byteLength = payload.byteLength;
            if (byteLength === this.expectedSize) {     //校验数据
                // let arrayBuffer = new Uint8Array(payload).buffer;       // 将uint8array转为arraybuffer
                let arrayBuffer = payload.buffer;       // 将uint8array转为arraybuffer
                const segment = new _segment__WEBPACK_IMPORTED_MODULE_4__["default"](this.bufSN, this.segId, arrayBuffer, this.remotePeerId, this.pieceMsg.level);
                this.emit(_events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_RESPONSE, segment, this.weight);
            } else {
                this.logger.error(`${this.segId} expectedSize ${this.expectedSize} != byteLength ${byteLength}`);
            }
        }
        // this.logger.info(`datachannel finish downloading ${this.segId} from ${this.remotePeerId}`);
        this.segId = '';
        this.bufArr = [];
        // this._loadedBytes = 0;
        // this.expectedSize = -1;
    }

    checkIfNeedChoke(forced = false) {
        const { logger } = this;
        const duration = performance.now() - this.timeSendRequest;
        if (!forced && duration < 1500) {
            logger.info(`duration ${duration} no need choke`)
            return
        }
        this.miss ++;
        logger.info(`${this.remotePeerId} miss ${this.miss}`);
        if (this.miss > DC_TOLERANCE && !this.choked) {
            this.choked = true;
            const chokeDuration = this.miss * 30;
            // 一段时间后失效
            if (chokeDuration <= 150) {
                logger.warn(`datachannel ${this.channelId} is choked`);
                this.chokeTimer = setTimeout(() => {
                    this.choked = false;
                    logger.warn(`datachannel ${this.channelId} is unchoked`);
                }, chokeDuration * 1000)
            } else {
                logger.warn(`datachannel ${this.channelId} is choked permanently`);
            }
        }
    }

    get bufArrSize() {
        if (!this.downloading) return 0;
        return this.pieceMsg.attachments - this.remainAttachments;
    }

    //下载超时 外部调用 false => 已下载完成
    loadtimeout() {
        const { logger, pieceMsg } = this;
        logger.warn(`timeout while downloading from ${this.remotePeerId}, ${this.bufArrSize} of ${pieceMsg.attachments} packets loaded`);
        // this._notifyDownloadListenersAbort("timeout from upstream")
        this.checkIfNeedChoke();
        return true
    }

    // 发送中断下载消息
    sendMsgPieceAbort(reason) {
        if (!this.uploading && this.datasToSend.length === 0) return
        this.uploading = false;
        this.sendJson({
            event: _events__WEBPACK_IMPORTED_MODULE_2__["default"].DC_PIECE_ABORT,
            reason
        });
    }

    loadedBytes() {
        return this._loadedBytes
    }

    currentLoadSpeed() {
        if (this.timeReceivePiece === 0) return 0
        return this.loadedBytes() / (performance.now() - this.timeReceivePiece);
    }

    minRequiredSpeed(remainLoadTime) {
        return (this.pieceMsg.size - this.loadedBytes()) / remainLoadTime
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
}

function dividePayload(payload, packetSize, attachments, remainder) {
    let bufArr = [];
    if (remainder) {
        let packet;
        for (let i = 0; i < attachments - 1; i++) {
            packet = payload.slice(i * packetSize, (i + 1) * packetSize);
            bufArr.push(packet);
        }
        packet = payload.slice(payload.byteLength - remainder, payload.byteLength);
        bufArr.push(packet);
    } else {
        let packet;
        for (let i = 0; i < attachments; i++) {
            packet = payload.slice(i * packetSize, (i + 1) * packetSize);
            bufArr.push(packet);
        }
    }
    return bufArr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Peer);


/***/ }),

/***/ "./src/core/scheduler-base.js":
/*!************************************!*\
  !*** ./src/core/scheduler-base.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/core/events.js");
/* harmony import */ var _peer_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./peer-manager */ "./src/core/peer-manager.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _common_timer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/timer */ "./src/common/timer.js");






const CHECK_CONN_INTERVAL = 40;                   // 定时检查p2p连接 单位秒
const MAX_NO_EXCHANGE_TIME = 120;                 // 最大允许的无数据交换时间 单位秒

const _shareOnly = Symbol('shareOnly');           // 是否只上传不下载

// 所有engine的 scheduler 的共同基类
class SchedulerBase extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {

    constructor(engine, config) {
        super();

        this.engine = engine;
        this.config = config;
        this.logger = engine.logger;
        this.bufMgr = null;
        this.peerManager = new _peer_manager__WEBPACK_IMPORTED_MODULE_2__["default"]();

        if (this._setupEngine) this._setupEngine();

        // 定时检查连接，超过5分钟没有数据交换则断开
        this.startCheckConnsTimer();

        this.dcDownloadTimeout = config.dcDownloadTimeout;

        this[_shareOnly] = false;
        this.downloadOnly = false;
        this.loadedPeerNum = 0;                       // 上次下载的peer的数量
    }

    get isMobileNet() {
        return this.engine.isMobileNet
    }

    startCheckConnsTimer() {
        this.checkConnsTimer = setInterval(() => {
            this.logger.info(`start check conns`);
            const extraStats = this.getStatsForPeer();
            // const { level } = extraStats;
            let peerNum = this.peersNum;
            const currentTs = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getCurrentTs)();
            this.getPeers().forEach(peer => {
                if (peerNum > 4 &&
                    (currentTs - peer.dataExchangeTs > MAX_NO_EXCHANGE_TIME ||
                        currentTs - peer.gotStatsTs >= CHECK_CONN_INTERVAL*2+3)) {
                    // dead/different level peers淘汰
                    this.logger.warn(`close dead or different level peer ${peer.remotePeerId} level ${peer.currentLevel}`);
                    peer.close(false);
                    peerNum --;
                } else if (peer.connected) {
                    // 发送统计信息
                    peer.sendMsgStats(peerNum, extraStats);
                }
            });
        }, CHECK_CONN_INTERVAL*1000)
    }

    // abstract
    getStatsForPeer() {
        return {
            // children
            // level
            // pos
        }
    }

    // getNonactivePeers() {
    //     const currentTs = getCurrentTs();
    //     return this.getPeers().filter(peer => {
    //         return currentTs - peer.dataExchangeTs > MAX_NO_EXCHANGE_TIME
    //     }).sort((a, b) => a.dataExchangeTs - b.dataExchangeTs);
    // }

    // 从peer获取节点
    requestPeers() {
        this.logger.info(`request peers from peer`);
        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_GET_PEERS
        };
        for (let peer of this.getPeers()) {
            if (peer.mobileNet || peer.super) continue;
            peer.sendJson(msg);
        }
    }

    // 阻止其它peer的请求
    chokePeerRequest(dc) {
        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_CHOKE
        };
        if (dc) {
            dc.sendJson(msg)
        } else {
            this._broadcastToPeers(msg);
        }
    }

    // 允许其它peer的请求
    unchokePeerRequest(dc) {
        const msg = {
            event: _events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_UNCHOKE
        };
        if (dc) {
            dc.sendJson(msg)
        } else {
            this._broadcastToPeers(msg);
        }
    }

    // 暂停从其它peer请求数据
    stopRequestFromPeers() {
        for (let peer of this.getPeers()) {
            peer.choked = true;
        }
    }

    // 恢复从其它peer请求数据
    resumeRequestFromPeers() {
        for (let peer of this.getPeers()) {
            peer.choked = false;
        }
    }

    // 设置shareOnly
    setShareOnly() {
        this[_shareOnly] = true;
    }

    deletePeer(dc) {
        if (this.peerManager.hasPeer(dc.remotePeerId)) {
            this.peerManager.removePeer(dc.remotePeerId);
        }
        this._peersStats(this.peerManager.getPeerIds());
    }

    getPeers() {
        return [...this.peerManager.getPeerValues()];
    }

    addPeer(peer) {
        const { logger } = this;
        this.peerManager.addPeer(peer.remotePeerId, peer);

        if (this[_shareOnly]) {
            peer.choked = true;
        }

        const peerIds = this.peerManager.getPeerIds();
        this._peersStats(peerIds);
        logger.info(`add peer ${peer.remotePeerId}, now has ${peerIds.length} peers`);
        if (!peer.mobileNet && !this.waitForPeer && peer.isInitiator && this.peersNum <= 5 && peer.peersConnected > 1) {
            // 立即请求节点
            peer.sendPeersRequest();
        }
    }

    get hasPeers() {
        return this.peersNum > 0;
    }

    get peersNum() {
        return this.peerManager.size();
    }

    get hasIdlePeers() {
        const { logger } = this;
        const idles = this.getIdlePeer().length;
        logger.info(`peers: ${this.peersNum} idle peers: ${idles}`);
        if (idles < this.peersNum) {
            const peers = this.peerManager.getPeers();
            const loadingPeers = peers.filter(p=>p.downloading);
            logger.warn(`downloading: ${loadingPeers.length} choked: ${peers.filter(p=>p.choked).length}`);
            for (let peer of loadingPeers) {
                logger.warn(`${peer.remotePeerId} loading ${peer.segId} packets ${peer.bufArr.length} total ${peer.pieceMsg.attachments}`);
            }
        }
        return idles > 0;
    }

    getIdlePeer() {
        return this.peerManager.getAvailablePeers();
    }

    set bufferManager(bm) {
        this.bufMgr = bm;
        bm.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_LOST, ({sn, segId, next, level}) => {
            // this.logger.debug(`bufMgr lost ${sn} segId ${segId} next ${next}`);
            if (!this.config.live) {
                this._broadcastToPeers({                                //点播模式下向peers广播已经不缓存的sn
                    event: _events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_LOST,
                    sn: sn,
                    seg_id: segId,
                    level: level || undefined,
                });
            }
            this.onBufferManagerLost(sn, segId, next, level);
        })
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_SEG_ADDED, seg => {
                this.onBufferManagerSegAdded(seg);
            })
    }

    onBufferManagerSegAdded(seg) {

    }

    destroy() {
        const { logger } = this;
        if (this.peersNum > 0) {
            // for (let peer of this.peerMap.values()) {
            //     peer.destroy();
            //     peer = null;
            // }
            this.peerManager.clear();
        }
        this.removeAllListeners();

        clearInterval(this.checkConnsTimer);
        if (this.checkTimer) this.checkTimer.cancel();
        logger.warn(`destroy BtScheduler`);
    }

    notifyPeersLoaded(num) {
        // void
    }

    _setupDC(dc) {
        // console.warn(`bt scheduler _setupDC`);
        const { logger } = this;
        dc
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_ACK, msg => {
                if (msg.size) {
                    this.engine.fetcher.reportUploaded(msg.size);
                    logger.info(`uploaded ${msg.seg_id} size ${msg.size} to ${dc.remotePeerId}, canceled ${msg.canceled || false}`);
                }
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_ABORT, msg => {
                logger.warn(`peer ${dc.remotePeerId} download aborted, reason ${msg.reason}`);
                if (dc.downloading && this._handlePieceAborted) this._handlePieceAborted(dc.remotePeerId);
                dc.downloading = false;
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_REQUEST, () => {

            })
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_SEND_REQUEST, () => {

            })
    }

    _broadcastToPeers(msg) {
        for (let peer of this.getPeers()) {
            peer.sendJson(msg);
        }
    }

    _peersStats(peers) {
        this.engine.emit('peers', peers);
        const getPeersInfo = this.engine.config.getPeersInfo;
        if (getPeersInfo && typeof getPeersInfo === 'function') {
            getPeersInfo(peers)
        }
    }

    startCheckPeersTimer(checkDelay = 3000) {
        this.checkTimer = (0,_common_timer__WEBPACK_IMPORTED_MODULE_4__.createTimeoutGenerator)();
        this.checkTimer.start(next => {
            this.checkPeers();
            const nextDelay = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.calCheckPeersDelay)(this.loadedPeerNum) * 1000;
            this.logger.debug(`loaded peers ${this.loadedPeerNum} nextDelay ${nextDelay}`);
            this.loadedPeerNum = 0;                             // 重置
            next(nextDelay);
        }, checkDelay);
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SchedulerBase);


/***/ }),

/***/ "./src/core/segment.js":
/*!*****************************!*\
  !*** ./src/core/segment.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Segment)
/* harmony export */ });


class Segment {

    constructor(sn, segId, data, fromPeerId, level = 0) {

        this.sn = sn;
        this.segId = segId;
        this.data = data;    // 类型 ArrayBuffer
        this.fromPeerId = fromPeerId;
        this.level = level || 0;
    }

    static fromSegment(seg)  {
        const ret = new Segment(seg.sn, seg.segId, seg.data, seg.fromPeerId, seg.level);
        ret.from = seg.from;
        return ret
    }

    get size() {
        return this.data.byteLength;
    }

    get isSequential() {
        return this.sn >=  0;
    }
}


/***/ }),

/***/ "./src/core/server.js":
/*!****************************!*\
  !*** ./src/core/server.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_md5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/md5 */ "./src/core/utils/md5.js");
/* harmony import */ var _utils_md5__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utils_md5__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./events */ "./src/core/events.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_utils_platform__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_err_code__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/err-code */ "./src/core/utils/err-code.js");
/* harmony import */ var _utils_err_code__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils_err_code__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils_storage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/storage */ "./src/core/utils/storage.js");
/* harmony import */ var _utils_health_detector__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/health-detector */ "./src/core/utils/health-detector.js");










const MIN_CONNS = 8;       // 默认最低连接peers数
// 2/3G网络NAT超时时间5分钟
const BASE_REPORT_INTERVAL = 20;      // stats间隔

// const ANNOUNCE = 'aHR0cHMlM0EvL3RyYWNrZXIuY2RuYnllLmNvbS92MQ==';      // tracker服务器地址base64编码
// const BL_URL = 'aHR0cHMlM0EvL3AycGVuZ2luZS5uZXQlM0EyMzMzL2Js';     // 防破解接口地址base64编码

const IPAPI_TIMEOUT = 600;         // ms
const GEOIP_KEY = 'SW_GEOIP_KEY';
const GEOIP_EXPIRATION = 72*3600*1000;
// const GEOIP_EXPIRATION = 30*1000;      // test
const GEOIP_EXPIRATION_MOBILE = 12*3600*1000;
const TRACKER_EXPT = 'TRACKER_EXPT';
const IPAPI_ERROR = 'IPAPI_ERROR';
// https://pro.ip-api.com/json?fields=2181826&key=XOpiansRgYxGTho
const IPAPI_URL = 'aHR0cHM6Ly9wcm8uaXAtYXBpLmNvbS9qc29uP2ZpZWxkcz0yMTgxODI2JmtleT1YT3BpYW5zUmdZeEdUaG8=';

const URL_MAP = {
    'v': 'ZXU',             // cn 1
    '3': 'uY2R',           // cn 2
    'l': 'LmNv',           // cn 4
    'n': 'uYnll',          // cn 3
    '7': 'bQ==',       // cn 5
    'x': 'aGsuc3d',         // hk 1
    'kj': 'dHJhY',   //  us eu 1
    'a': '2tlci5',              // us eu 2
    // '+': 'oZHR2',        // us 3
    // '=': 'Y2xvdW',    // us 4
    // 'w': 'QuY29t',       // us 5
    // '{': '3ZWIz',      // eu 3
    // '?': 'LWxhY',       // eu 4
    // '$': 'i5jb20=',     // eu 5
    'o': 'hcm1j',        // hk 2
    'xo': 'bG91ZC',      // hk 3
    'sb': '5uZXQ=',     // hk 4
};

const _httpDownloaded = Symbol('httpDownloaded');
const _p2pDownloaded = Symbol('p2pDownloaded');
const _p2pUploaded = Symbol('p2pUploaded');

class Server extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(engine, key, channel, baseUrl, info) {
        super();
        let rawUrl;
        this.config = engine.config;
        let zone = this.config.announceLocation;
        if (this.config.trackerZone) {
            zone = this.config.trackerZone
        }
        switch (zone) {
            case 'cn':
            case 'eu':
                rawUrl = URL_MAP['v']+URL_MAP['3']+URL_MAP['n']+URL_MAP['l']+URL_MAP['7'];
                break;
            case 'hk':
                rawUrl = URL_MAP['x']+URL_MAP['o']+URL_MAP['xo']+URL_MAP['sb'];
                break;
            case 'us':
                rawUrl = 'dXMuaGR0dmNsb3VkLmNvbQ==';
                break;
            // case 'eu':
            //     rawUrl = URL_MAP['kj']+URL_MAP['a']+URL_MAP['{']+URL_MAP['?']+URL_MAP['$'];
            //     break;
        }

        this.engine = engine;
        this.key = key ? key : undefined;
        this.baseUrl = baseUrl ? baseUrl : `https://${self.atob(rawUrl)}/v1`;
        this.channelId = self.btoa(channel);
        this.timestamp = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getCurrentTs)();
        this.health = new _utils_health_detector__WEBPACK_IMPORTED_MODULE_8__["default"]();

        const netLoc = url_toolkit__WEBPACK_IMPORTED_MODULE_2___default().parseURL(this.baseUrl).netLoc;    //  //tracker.p2pengine.net:7067
        // vcode
        this.announce = netLoc.replace(/\/\//, "");
        // this.announce = 'tracker.cdnbye.com'     // test
        const vcode = genV(this.timestamp, "2.8.11", this.announce, this.channelId, info.type, this.key);

        // electron
        this.native = !!info.bundle;

        this.announceInfo = {
            ...info,
            channel: this.channelId,
            ts: this.timestamp,
            version: "2.8.11",
            v: vcode,
            announce: this.announce,
            // token: this.key,
            k: genK(this.key),
        };
        //-----------bt---------------------
        this.announceURL = `${this.baseUrl}/channel`;

        // 控制参数
        this.reportFails = 0;      // 上报服务器错误次数
        this.statsRequesting = false;

        this.forbidden = false;

        // 连接情况上报
        this.failConns = 0;                                             //连接失败的peer的增量

        // 流量上报(单位：KB)
        this.totalHTTPDownloaded = 0;         // HTTP下载累积量
        this.totalP2PDownloaded = 0;          // P2P下载累积量
        this.totalP2PUploaded = 0;            // P2P上传累积量
        this[_httpDownloaded] = 0;              // HTTP下载增量
        this[_p2pDownloaded] = 0;               // P2P下载增量
        this[_p2pUploaded] = 0;                 // P2P上传增量

        this.speed = 0;                       // KB/s
        this.offline = false;

        //播放情况上报
        this.errsBufStalled = 0;                                    //播放卡顿数
        this.mediaRequests = 0;
        this.errsInternalExpt = 0;                                 //插件内部错误
        // this.exptMsg = '';                                        // 内部错误原因

    }

    geoipRequest() {
        const {logger} = this.engine;
        return new Promise((resolve, reject) => {
            if ((0,_utils_storage__WEBPACK_IMPORTED_MODULE_7__.hasItemUnexpired)(GEOIP_KEY)) {
                const ipData = (0,_utils_storage__WEBPACK_IMPORTED_MODULE_7__.getItem)(GEOIP_KEY)
                logger.info(`found local geo data`);
                resolve(ipData)
            } else {
                fetch(self.atob(IPAPI_URL))
                    .then((resp)=>{
                        return resp.json();
                    }).then(data => {
                    if (data.status === 'success') {
                        const duration = data.mobile ? GEOIP_EXPIRATION_MOBILE : GEOIP_EXPIRATION;
                        (0,_utils_storage__WEBPACK_IMPORTED_MODULE_7__.setItemWithExpiration)(GEOIP_KEY, data, duration);
                        resolve(data)
                    } else {
                        const err = new Error(`preflight status ${data.status}`);
                        throw _utils_err_code__WEBPACK_IMPORTED_MODULE_6___default()(err, IPAPI_ERROR)
                    }
                }).catch(err => {
                    reject(err)
                })
            }
        })
    }

    btAnnouncePreflight() {
        const {logger} = this.engine;
        if (this.announceInfo.asn) {
            // retry请求
            return this.btAnnounce();
        }
        logger.info(`preflight ip-api`);
        return Promise.race([
            this.geoipRequest(),
            new Promise((resolve, reject) => {
                setTimeout(()=> {
                    reject(_utils_err_code__WEBPACK_IMPORTED_MODULE_6___default()(new Error('request timeout'), IPAPI_ERROR))
                }, IPAPI_TIMEOUT)
            })
        ]).then(json => {
                this._parseGeoResponse(json);
                return this.btAnnounce();
            }).catch((err)=>{
                // logger.error(`preflight error ${err}`);
                if (err.code !== TRACKER_EXPT) {
                    // geo request异常
                    const ipData = (0,_utils_storage__WEBPACK_IMPORTED_MODULE_7__.getItem)(GEOIP_KEY)
                    if (ipData) {
                        logger.info(`use expired ipData`);
                        this._parseGeoResponse(ipData);
                    }
                    return this.btAnnounce();
                } else {
                    // TRACKER_EXPT
                    throw err;
                }
            });
    }

    _parseGeoResponse(json) {
        const { lat, lon, isp, as, mobile, countryCode:country, continentCode } = json;
        if (mobile) {
            this.announceInfo.netType = 'cellular';
        }
        const asn  = as.split(' ')[0].substr(2);
        // if (!this.announceInfo.tag) this.announceInfo.tag = `${continentCode || ''}-${getBrowser()}${isHttps() ? 's' : ''}`;
        this.announceInfo = {
            ...this.announceInfo,
            lat,
            lon,
            isp,
            asn,
            country,
        }
    }

    btAnnounce() {
        // this.announceInfo.token = 'aCTdGjb7g'         // test
        const {logger} = this.engine;
        if (!this.announceInfo.tag) this.announceInfo.tag = `${(0,_utils_platform__WEBPACK_IMPORTED_MODULE_5__.getBrowser)()}${(0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.isHttps)() ? 's' : ''}`;
        return new Promise((resolve, reject) => {
            fetch(this.announceURL, {
                headers: this._requestHeader,
                method: 'POST',
                body: JSON.stringify(this.announceInfo)
            }).then(response => {
                if (!response.ok) {
                    const retry = response.status >= 500 && response.status < 600;
                    throw _utils_err_code__WEBPACK_IMPORTED_MODULE_6___default()(new Error(`server response code is ${response.status}`), TRACKER_EXPT, {retry})
                }
                return response.json()
            }).then(json => {
                if (!this.engine) {
                    throw _utils_err_code__WEBPACK_IMPORTED_MODULE_6___default()(new Error(`runtime error`), TRACKER_EXPT, {retry: false})
                }

                // throw new Error(`test`)       // test
                const data = json.data;

                // test
                // data.min_conns = 3;
                // data.share_only = true;
                // data.f = true;
                // data.signal = 'wss://signalcloud.cdnbye.com';
                // data.signal2 = 'wss://opensignal.cdnbye.com';
                // data.token = '6666666';
                // data.token2 = '77777777';
                // data.stun = ['stun:stun.cdnbye.com','stun:ye.com'];
                // data.debug = true;
                // data.rejected = true
                // data.fuse_rate = 1;
                // data.slogan = true;
                // data.peers.push(...[{id: '111111111'}, {id: '222222222'}])

                // 阻止正常播放
                if (data.f) {
                    this.forbidden = true;
                    // logger.warn('SDK is forbidden to use')
                }

                if (json.ret === -1) {
                    const { code, msg } = json.data
                    throw _utils_err_code__WEBPACK_IMPORTED_MODULE_6___default()(new Error(msg), TRACKER_EXPT, { retry: code >= 5000 })
                } else {

                    if (data.info) console.info(`${data.info}`);
                    if (data.warn) console.warn(`${data.warn}`);
                    if (!data.min_conns) data.min_conns = MIN_CONNS;

                    // 如果reject，不使用P2P  防御性检查
                    if ((!data.rejected || (data.rejected && data.share_only)) && data.id && data.report_interval && data.peers) {
                        this.peerId = this.id = data.id;                            // 保存peerId
                        if (data.report_interval < BASE_REPORT_INTERVAL) {
                            data.report_interval = BASE_REPORT_INTERVAL;
                        }
                        this.btStats(data.report_interval);                    // 周期性上报数据
                        // 初始化getPeersURL和statsURL
                        this.getPeersURL = `${this.baseUrl}/channel/${this.channelId}/node/${this.peerId}/peers`;
                        this.statsURL = `${this.baseUrl}/channel/${this.channelId}/node/${this.peerId}/stats`;

                        resolve(data);
                    } else {
                        if (this.engine) this.engine.p2pEnabled = false;
                        // reject的不重试
                        // throw errCode(new Error(`msg not valid`), TRACKER_EXPT, {retry: false})
                    }
                }

            }).catch(err => {
                logger.error(`btAnnounce error ${err}`);
                reject(_utils_err_code__WEBPACK_IMPORTED_MODULE_6___default()(err, err.code, {retry: err.retry}))
            })
        })
    }

    btStats(interval = 10) {
        // const {logger} = this.engine;
        this.heartbeater = setInterval(() => {
            this.postStats();

            // 防破解
            // _b(interval);

        }, interval * 1000)
    }

    postStatsWithBeacon() {
        if (this.offline) return
        this.offline = true;
        let body = {
            off: true,         // 已离线
        }
        if (!this.statsRequesting) {
            body = {
                ...body,
                ...this._makeStatsBody(),
            }
        }
        if (this.statsURL && navigator.sendBeacon) {
            navigator.sendBeacon(this.statsURL, JSON.stringify(body));
        }
    }

    postStats() {
        const {logger} = this.engine;
        this.statsRequesting = true;
        fetch(this.statsURL, {
            // headers: this._requestHeader,
            method: 'POST',
            body: JSON.stringify(this._makeStatsBody())
        }).then(response => {
            this.statsRequesting = false;
            this.reportFails = 0;
            return response.text()
        }).then(data => {
            let json;
            if (data) {
                json = JSON.parse(data)
            } else {
                json = {ret: 0, data: {}}
            }
            if (json.ret === -1) {
                // 停止上报
                clearInterval(this.heartbeater);
                logger.error(`${json.data.msg} code ${json.data.code}`);
                // 重启p2p
                this.engine.emit(_events__WEBPACK_IMPORTED_MODULE_3__["default"].RESTART_P2P);
            } else {
                // logger.debug(`sucessfully report stats`);
                const {
                    http = 0, p2p = 0, share = 0, failConns = 0,
                    rebuffers = 0, requests = 0, errsInternalExpt = 0
                } = (this.lastStats || {});
                if (this[_httpDownloaded] >= http) this[_httpDownloaded] -= http;
                if (this[_p2pDownloaded] >= p2p) this[_p2pDownloaded] -= p2p;
                if (this[_p2pUploaded] >= share) this[_p2pUploaded] -= share;
                // this.conns -= conns;
                if (this.failConns >= failConns) this.failConns -= failConns;
                if (this.errsBufStalled >= rebuffers) this.errsBufStalled -= rebuffers;
                if (this.mediaRequests >= requests) this.mediaRequests -= requests;
                if (this.errsInternalExpt >= errsInternalExpt) this.errsInternalExpt -= errsInternalExpt;
                if (this.exptMsg) this.exptMsg = undefined;
            }
        }).catch((err) => {
            logger.error(`btStats error ${err}`);
            this.statsRequesting = false;
            this.reportFails++;
            if (this.reportFails >= 3) {
                // 超过2次停止上报(expired node)
                clearInterval(this.heartbeater);
            }
        })
    }

    btGetPeers(exclusions, noPeers = false) {
        const { logger } = this.engine;
        const { asn, country } = this.announceInfo;
        let body = { exclusions, asn, country, ratio: this.health.healthRatio, urgent: noPeers || undefined };
        let extra = {};
        if (this.engine.getExtraForPeersRequest) extra = this.engine.getExtraForPeersRequest();
        body = Object.assign({}, body, extra);
        return new Promise((resolve, reject) => {
            if (this.reportFails >= 3) {
                reject(new Error('reportFails >= 3'))
            } else {
                fetch(this.getPeersURL, {
                    headers: this._requestHeader,
                    method: 'POST',
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then(json => {
                    if (json.ret === -1) {
                        reject(json.data.msg)
                    } else {
                        resolve(json.data);
                    }
                }).catch(err => {
                    logger.error(`btGetPeers error ${err}`);
                    reject(err)
                }).finally(() => {
                    this.health.resetTraffic();
                })
            }
        })
    }

    increFailConns() {
        this.failConns++;
    }

    increRebuffers() {
        this.errsBufStalled ++;
    }

    increMediaRequests() {
        this.mediaRequests ++;
    }

    reportFlow(traffic) {                    // 上报http流量
        const _traffic = Math.round(traffic / 1024);
        this[_httpDownloaded] += _traffic;
        this.totalHTTPDownloaded += _traffic;
        this.health.recordHttp(_traffic);
        this._emitStats();
        // this._checkFlowLimit();
        // log(`cdnDownloaded ${this.cdnDownloaded} p2pDownloaded ${this.p2pDownloaded}`)
    }

    reportDCTraffic(traffic, speed) {          // 上报p2p流量
        const _traffic = Math.round(traffic / 1024);
        this[_p2pDownloaded] += _traffic;
        this.totalP2PDownloaded += _traffic;
        this.health.recordP2p(_traffic);
        this.speed = Math.round(speed);
        this._emitStats();
    }

    // 上报上传的数据量
    reportUploaded(size = 0) {
        const _traffic = Math.round(size / 1024);
        this.totalP2PUploaded += _traffic;
        this.health.recordShare(_traffic);
        this[_p2pUploaded] += _traffic;
        this._emitStats();
    }

    destroy() {
        const {logger} = this.engine;
        logger.warn(`destroy fetcher`);
        this.removeAllListeners();
        clearInterval(this.heartbeater);
        // clearTimeout(this.bl);
    }

    _emitStats() {
        this.engine.emit('stats', {
            totalHTTPDownloaded: this.totalHTTPDownloaded,
            totalP2PDownloaded: this.totalP2PDownloaded,
            totalP2PUploaded: this.totalP2PUploaded,
            p2pDownloadSpeed: this.speed,
        });
        const getStats = this.config.getStats;
        if (getStats && typeof getStats === 'function') {
            getStats(this.totalP2PDownloaded, this.totalP2PUploaded, this.totalHTTPDownloaded, this.speed)
        }
    }

    _makeStatsBody() {
        const { asn, country } = this.announceInfo;
        let stats = {
            totalConns: this.engine.tracker.totalConns,
            failConns: this.failConns,
            rebuffers: this.errsBufStalled || undefined,
            requests: this.mediaRequests || undefined,
            errsInternalExpt: this.errsInternalExpt,
            http: Math.round(this[_httpDownloaded]) || 0,    //上报以KB为单位
            p2p: Math.round(this[_p2pDownloaded]) || 0,
            share: Math.round(this[_p2pUploaded]) || 0,
            asn,
            country,
        };

        // 上报current time
        let extra = {};
        if (this.engine.getExtraForStats) extra = this.engine.getExtraForStats();
        stats = Object.assign({}, stats, extra);

        this.lastStats = JSON.parse(JSON.stringify(stats));

        Object.keys(stats).forEach(key => {
            if (stats[key] === 0) {
                delete stats[key];
            }
        });

        // stats.device = this.announceInfo.device;

        if (this.exptMsg) stats.exptMsg = "2.8.11" + ' ' + this.exptMsg;

        return stats;
    }

    get _requestHeader() {
        let headerInfo = {
            // timestamp: Date.now()
        };
        if (this.native) {
            // electron
            // headerInfo.token = this.key;
            headerInfo = {
                ...headerInfo,
                // token: this.key,
                "X-SW-Key": genK(this.key),
                "User-Agent": 'electron',
                // appid: this.announceInfo.bundle,
                "X-SW-ID": this.announceInfo.bundle,
            }
        }

        // 跨域问题不生效
        // if (self.top !== self.self) {
        //     headerInfo["Top-Origin"] = self.top.location.origin;
        // }
        return headerInfo;
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Server);


function genV(timestamp, version, announce, channelId, type, token) {
    let domain = location.hostname;
    if (domain === 'localhost' && token) {
        domain = `${token}.${domain}`;
    }
    function ff(c1, c2, c3, c4, c5, ts) {
        const sign = _utils_md5__WEBPACK_IMPORTED_MODULE_1___default()(c1+c2+c3+c4+c5, ts);
        return sign;
    }
    const sign = ff(domain, version, announce, channelId, type, timestamp);
    const vcode = sign.substr(0, 8);
    return vcode;
}

function genK(message) {
    if (!message) return undefined
    const key = 'C@K<#q';
    let encryptedMessage = '';
    const keyLength = key.length;
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % keyLength);
        const encryptedCharCode = charCode ^ keyCharCode;
        const encryptedChar = String.fromCharCode(encryptedCharCode);
        encryptedMessage += encryptedChar;
    }
    // 使用Base64编码加密后的消息
    return self.btoa(encryptedMessage);
}





/***/ }),

/***/ "./src/core/signal-manager.js":
/*!************************************!*\
  !*** ./src/core/signal-manager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _websocket_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./websocket-client */ "./src/core/websocket-client.js");



const PING_INTERVAL = 270;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(logger, config, mainAddr, backupAddr) {
        super();

        this.logger = logger;
        this.config = config;
        this.mainAddr = mainAddr;
        this.backupAddr = backupAddr;
        this.mainWS = this._init(mainAddr);
        this.backupTimer = setTimeout(() => {
            if (this.destroyed) return
            this.backupWS = this._init(backupAddr, 'backup');
        }, 900);
        this._connected = false;
        this.destroyed = false;
    }

    _init(addr, name) {
        if (!addr) return null;
        // console.warn("signal manager init " + addr);
        let ws = new _websocket_client__WEBPACK_IMPORTED_MODULE_1__["default"](this.logger, this.config, addr, PING_INTERVAL, name);
        ws.onopen = () => {
            if (!this._connected && this.onopen) {
                this._connected = true;
                this.onopen();
            }
        };

        ws.onmessage = (msg) => {
            if (this.onmessage) this.onmessage(msg, ws.name);
        };
        ws.onclose = () => {
            if (this._connected) {
                if (!this.connected && this.onclose) {
                    this._connected = false;
                    this.onclose();
                }
            }
        };
        ws.onerror = (err) => {
            if (this.onerror) this.onerror(err);
        };
        return ws;
    }

    sendSignal(remotePeerId, data, name) {
        if (name) {
            const target = this._getWSByName(name);
            if (target) {
                target.sendSignal(remotePeerId, data);
            }
            return
        }
        if (this.mainConnected) {
            this.mainWS.sendSignal(remotePeerId, data);
        } else if (this.backupConnected) {
            this.backupWS.sendSignal(remotePeerId, data);
        } else {
            this.logger.warn(`no signal available`);
        }
    }

    sendReject(remotePeerId, reason, fatal, name) {
        if (name) {
            const target = this._getWSByName(name);
            if (target) {
                target.sendReject(remotePeerId, reason, fatal);
                return
            }
        }
        if (this.mainConnected) {
            this.mainWS.sendReject(remotePeerId, reason, fatal);
        } else if (this.backupConnected) {
            this.backupWS.sendReject(remotePeerId, reason, fatal);
        } else {
            this.logger.warn(`no signal available, send reject failed`);
        }
    }

    close() {
        if (this.mainWS) {
            this.mainWS.close();
        }
        if (this.backupWS) {
            this.backupWS.close();
        }
    }

    _getWSByName(name) {
        if (this.mainWS && this.mainWS.name === name) {
            return this.mainWS
        }
        if (this.backupWS && this.backupWS.name === name) {
            return this.backupWS
        }
        return null
    }

    reconnect() {
        if (this.mainWS) {
            this.mainWS.reconnect();
        }
        if (this.backupWS) {
            this.backupWS.reconnect();
        }
    }

    destroy() {
        this.close();
        clearTimeout(this.backupTimer);
        this.mainWS = null;
        this.backupWS = null;
        this.removeAllListeners();
        this.destroyed = true;
    }

    get connected() {
        return this.mainConnected || this.backupConnected
    }

    get mainConnected() {
        return this.mainWS && this.mainWS.connected
    }

    get backupConnected() {
        return this.backupWS && this.backupWS.connected
    }
});


/***/ }),

/***/ "./src/core/tracker-client.js":
/*!************************************!*\
  !*** ./src/core/tracker-client.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _websocket_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./websocket-client */ "./src/core/websocket-client.js");
/* harmony import */ var _signal_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./signal-manager */ "./src/core/signal-manager.js");
/* harmony import */ var _utils_err_code__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/err-code */ "./src/core/utils/err-code.js");
/* harmony import */ var _utils_err_code__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_utils_err_code__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./events */ "./src/core/events.js");
/* harmony import */ var _utils_getPeersThrottle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/getPeersThrottle */ "./src/core/utils/getPeersThrottle.js");
/* harmony import */ var $Peer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! $Peer */ "./src/core/peer.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _utils_platform__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_utils_platform__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _peer_pool__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./peer-pool */ "./src/core/peer-pool.js");











const MAX_PC_CONNS = 22;             // PC端最大p2p连接数(被动)
const MAX_MOBILE_CONNS = 13;         // 移动端最大p2p连接数(被动)
const MAX_PC_CONNS_ACTIVE = 12;             // PC端最大p2p连接数(主动)
const MAX_MOBILE_CONNS_ACTIVE = 8;         // 移动端最大p2p连接数(主动)
const MIN_PEER_SHARE_TIME = 50;      // 分享peers的最低加入时间间隔 秒
const MAX_PEER_SHARE_POS = 600;      // 分享peers的最大播放时间间隔 秒
// const MAX_TRY_CONNS = 8;             // GET_PEERS后一次最多尝试连接的peer数量
const MAX_TRY_CONNS_TRICKLE = 5;     // trickle模式下GET_PEERS后一次最多尝试连接的peer数量

class TrackerClient extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(engine, fetcher, scheduler, config) {
        super();

        this.engine = engine;
        this.logger = engine.logger;
        this.config = config;
        this.connected = false;                                // 与信令的连接状态
        this.scheduler = scheduler;
        this.sequential = this.scheduler.sequential;
        this.DCMap = new Map();                                  //{key: remotePeerId, value: DataChannnel} 目前已经建立连接或正在建立连接的dc
        this.failedDCSet= new Set();                            //{remotePeerId} 建立连接失败的dc
        this.notFoundDCSet= new Set();                            //{remotePeerId} not found的dc
        const isMobile = _utils_platform__WEBPACK_IMPORTED_MODULE_8___default().isMobile()
        this.peerPool = new _peer_pool__WEBPACK_IMPORTED_MODULE_9__["default"](engine, config, isMobile ? 10 : 15);
        // test
        // this.failedDCSet.add('1039idqPaiBVR')

        this.signalerWs = null;                                  //信令服务器ws
        //tracker request API
        this.fetcher = fetcher;
        /*
        peers: Array<Object{id:string}>
         */
        this.peers = [];
        this.minConns = 5;
        this.stuns = [];

        // 防止调用频率过高
        this.requestMorePeers = (0,_utils_getPeersThrottle__WEBPACK_IMPORTED_MODULE_6__["default"])(this._requestMorePeers, this);

        this.maxConns = isMobile ? MAX_MOBILE_CONNS : MAX_PC_CONNS;
        this.maxConnsActive = isMobile ? MAX_MOBILE_CONNS_ACTIVE : MAX_PC_CONNS_ACTIVE;

        // 统计
        this.peersIncrement = 0;                 // 每个getPeers周期获取的可连接节点数量
        this.gotPeersFromTracker = false;        // 上次是否从tracker获取节点

        // 断开信令
        this.fuseRate = -1;
        this.overloaded = false;
    }

    get totalConns() {
        return this.scheduler.peersNum + 1
    }

    resumeP2P() {
        if (!this.fetcher) return;
        const { engine, config, fetcher } = this;
        const { btAnnounce, btAnnouncePreflight } = fetcher;
        const { wsSignalerAddr, wifiOnly, geoIpPreflight, getPeerId } = config;
        const realAnnounce = geoIpPreflight ? btAnnouncePreflight : btAnnounce;
        realAnnounce.call(fetcher).then(json => {
            if (!this.scheduler) return;
            engine.peerId = this.peerId = json.id;
            this.minConns = json.min_conns;
            // if (json.share_only) this.scheduler.setShareOnly();
            const peers = json.peers;
            this.scheduler.notifyPeersLoaded(peers.length);
            // 是否只允许p2p下载
            // json.wifi_only = true;           // test
            engine.netType = fetcher.announceInfo.netType;
            if ((json.wifi_only || wifiOnly) && engine.isMobileNet) {
                this.scheduler.downloadOnly = true;
                this.logger.info('downloadOnly mode');
            }
            if (json.overload) {
                this.overloaded = true;
                this.logger.warn('server is overloaded, degrade');
            }
            // 优先使用下发的信令地址
            // console.warn(JSON.stringify(wsSignalerAddr))
            const signalMain = wsSignalerAddr.main;
            let signalBackup = wsSignalerAddr.backup;
            if (json.signal && !json.signal2) {
                signalBackup = undefined;
            }
            this.signalerWs = this._initSignalerWs(json.signal || signalMain, json.signal2 || signalBackup, json.token, json.token2);     //连上tracker后开始连接信令服务器
            if (peers.length === 0) {
                this.requestMorePeers();
            } else {
                this.peers = this._filterPeers(peers);
            }
            engine.emit('peerId', this.peerId);
            if (getPeerId && typeof getPeerId === 'function') {
                getPeerId(this.peerId)
            }
            // 优先使用下发的stun
            if (json.stun && json.stun.length > 0) {
                this.stuns = json.stun;
            }
            // 在线调试
            if (json.debug) {
                this.logger.enableDebug();
            }
            // 连接数足够了断开信令
            if (json.fuse_rate) {
                this.fuseRate = json.fuse_rate;
                // this.fuseRate = 2;        // test
            }
            this.logger.info(`announce request response ${JSON.stringify(json, null, 2)}`);
            // video slogan
            // if (engine.media && json.slogan) {
            //     appendSlogan(self.atob('U3RyZWFtIGFjY2VsZXJhdGVkIGJ5IENETkJ5ZSBQMlA='), getHomeUrl(), engine.media);
            // }
        }).catch(err => {
            if (!this.scheduler) return
            if (err.code === 'TRACKER_EXPT') {
                // this.logger.error(err.message);
                engine.emit(_events__WEBPACK_IMPORTED_MODULE_5__["default"].EXCEPTION, err);
            }
            this.scheduler.notifyPeersLoaded(0);
            // 随机时间后重试
            if (err.retry) {
                const delay = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.randomNum)(15000, 40000);
                this.logger.warn(`announce retry after ${delay}ms`);
                this.announceTimer = setTimeout(() => {
                    this.resumeP2P();
                }, delay)
            }
        })
    }

    stopP2P() {
        // 上报统计
        this.fetcher.postStatsWithBeacon();
        this.fetcher.destroy();
        this.fetcher = null;
        this.requestMorePeers(true);          // 清空里面的定时器
        this.scheduler.destroy();
        this.scheduler = null;
        if (this.signalerWs) {
            this.signalerWs.destroy();
            this.signalerWs = null;
        }
        this.peers = [];

        // 销毁所有datachannel
        for (let dc of this.DCMap.values()) {
            dc.destroy(true);
        }
        this.DCMap.clear();
        this.peerPool.destroy();
        this.peerPool = null;
        this.failedDCSet.clear();
        this.notFoundDCSet.clear();
        this.logger.warn(`tracker stop p2p`);
    }

    destroy() {
        this.stopP2P();
        this.removeAllListeners();
        clearTimeout(this.announceTimer);
        const { config } = this;
        config.getStats = config.getPeerId = config.getPeersInfo = null;
        // this.engine = null;
        // this.fetcher = null;
        this.logger.warn(`destroy tracker`);
    }

    //过滤掉已经连接的节点和连接失败的节点
    _filterPeers(peers) {
        const ret = [];
        const blockedPeerIds = [...this.DCMap.keys(), ...this.failedDCSet.keys(), this.peerId];
        const filteredPeers = peers.filter(node => {
            return !blockedPeerIds.includes(node.id);
        });
        filteredPeers.forEach(peer => {
            ret.push({
                id: peer.id,
                intermediator: peer.intermediator,
            })
        });
        return ret;
    }

    _tryConnectToAllPeers() {
        if (this.peers.length === 0) return;
        if (!this.signalerWs.connected) return;
        this.logger.info(`try connect to ${this.peers.length} peers`);
        while (this.peers.length > 0) {
            if (this.DCMap.size >= this.maxConnsActive) {
                break;
            }
            let peer = this.peers.shift();
            const intermediator = peer.intermediator;
            this.logger.debug(`new DataChannel ${peer.id} intermediator ${intermediator}`);
            this._createDatachannel(peer.id, true, intermediator);
        }
    }

    _setupDC(datachannel) {
        datachannel.on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_SIGNAL, (data, fromCache) => {
            // webrtc产生的sdp
            const remotePeerId = datachannel.remotePeerId;
            if (datachannel.intermediator) {
                const interPeer = this.DCMap.get(datachannel.intermediator);
                if (interPeer) {
                    // 通过中间peer中转
                    const isSuccess = interPeer.sendMsgSignal(remotePeerId, this.peerId, data);
                    if (isSuccess) return;
                    this.logger.warn(`intermediator ${datachannel.intermediator} relay failed`);
                }
            }
            this.signalerWs.sendSignal(remotePeerId, data, datachannel.signalName);
        })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_PEER_SIGNAL, data => {
                // 接收到peer传来的信令
                const toPeerId = data.to_peer_id;
                const fromPeerId = data.from_peer_id;
                const action = data.action;
                if (!toPeerId || !fromPeerId || !action) return;
                if (toPeerId !== this.peerId) {
                    // 本节点是中转者
                    this.logger.info(`relay signal for ${fromPeerId}`);
                    const targetPeer = this.DCMap.get(toPeerId);
                    if (targetPeer) {
                        if (action === 'signal') {
                            if (targetPeer.sendMsgSignal(toPeerId, fromPeerId, data.data)) return;
                        } else {
                            targetPeer.sendMsgSignalReject(toPeerId, fromPeerId, data.reason, data.fatal);
                            return;
                        }
                    }
                    // peer not found
                    datachannel.sendMsgSignal(fromPeerId, toPeerId)
                } else {
                    // 本节点是目标节点
                    // this.logger.info(`receive signal from ${fromPeerId}`);
                    if (action === 'signal') {
                        this._handleSignalMsg(fromPeerId, data, datachannel.remotePeerId);
                    } else {
                        this._handSignalRejected(fromPeerId, data);
                    }
                }
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_GET_PEERS, () => {
                // this.logger.info(`DC_GET_PEERS total peers ${this.scheduler.peersNum}`)
                // 排除连接满的节点和刚加入不久的节点
                const currentTs = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getCurrentTs)();
                const peers = this.scheduler.getPeers().filter(peer =>
                    peer.peersConnected < (peer.mobileWeb ? MAX_MOBILE_CONNS : MAX_PC_CONNS) && !peer.super);
                // this.logger.info(`DC_GET_PEERS filtered peers ${peers.length}`)
                if (peers && peers.length > 0) {
                    const peersToSent = [];
                    peers.forEach(peer => {
                        if (peer.remotePeerId === datachannel.remotePeerId || peer.remotePeerId === this.peerId) return;
                        // 排除播放位置太远的
                        if (!this.config.live
                            && (peer.currentPos-datachannel.currentPos > MAX_PEER_SHARE_POS || peer.currentPos < datachannel.currentPos)) {
                            // console.warn(`skip peer pos ${peer.currentPos} target ${datachannel.currentPos}`)
                            return
                        }
                        const joinDuration = currentTs - peer.timeJoin;
                        if (joinDuration > MIN_PEER_SHARE_TIME) {
                            peersToSent.push({ id: peer.remotePeerId });
                        }
                    });
                    this.logger.info(`send ${peersToSent.length} peers to ${datachannel.remotePeerId}`);
                    datachannel.sendPeers(peersToSent);
                }
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_PEERS, data => {
                datachannel.gotPeers = true;
                const peers = data.peers;
                if (peers && peers.length > 0 && this.scheduler.peersNum < 10) {
                    const limit = MAX_TRY_CONNS_TRICKLE;   // 最多发送sdp限制
                    this.logger.info(`receive ${peers.length} peers from ${datachannel.remotePeerId}`);
                    peers.forEach(peer => {
                        peer.intermediator = datachannel.remotePeerId;
                    });
                    this.peers = this._filterPeers(peers).slice(0, limit);
                    this._tryConnectToAllPeers();
                }
            })
            .once(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_ERROR, (fatal) => {
                this.logger.info(`datachannel ${datachannel.channelId} failed fatal ${fatal}`);
                if (!this.scheduler) return;
                this.scheduler.deletePeer(datachannel);
                this._destroyAndDeletePeer(datachannel.remotePeerId, fatal);
                this.requestMorePeers();
                //更新conns
                if (!this.fetcher) return;
                if (datachannel.connected) {                       //连接断开

                } else {                                           //连接失败
                    if (fatal) this.fetcher.increFailConns();
                }
                if (fatal) this.failedDCSet.add(datachannel.remotePeerId);                  //记录失败的连接
                this._doSignalFusing(this.scheduler.peersNum);
                this._tryConnectToAllPeers();
            })
            .once(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_TIMEOUT, () => {
                this.notFoundDCSet.add(datachannel.remotePeerId);
            })
            .once(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_CLOSE, (fatal) => {

                this.logger.info(`datachannel ${datachannel.channelId} closed fatal ${fatal}`);
                if (this.scheduler) {
                    this.scheduler.deletePeer(datachannel);
                    this._doSignalFusing(this.scheduler.peersNum);
                }
                this._destroyAndDeletePeer(datachannel.remotePeerId, fatal);
                if (fatal) this.failedDCSet.add(datachannel.remotePeerId);              //记录断开的连接
                this.requestMorePeers();
                this._tryConnectToAllPeers();
            })
            .once(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_OPEN, () => {
                if (datachannel.isInitiator) {
                    // 本节点主动发起者
                    this.scheduler.handshakePeer(datachannel);
                }
            })
            .once(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_METADATA, msg => {
                // console.warn(`tracker DC_METADATA`);
                const { scheduler } = this;
                if (!datachannel.isInitiator) {
                    // 本节点非主动发起者
                    scheduler.handshakePeer(datachannel);
                }
                scheduler.handleMetaData(datachannel, msg);
                //如果dc数量不够则继续尝试连接
                // const peerNum = scheduler.peersNum;
                // const cancel = peerNum >= this.minConns;
                const cancel = this.DCMap.size >= this.minConns + 3;
                this.requestMorePeers(cancel);
                this.peersIncrement ++;

                this._doSignalFusing(scheduler.peersNum+1);
            })
    }

    _doSignalFusing(conns) {
        if (this.fuseRate <= 0) return;
        const connected = this.signalerWs.connected;
        if (connected && conns >= this.fuseRate+2) {
            // 上报stats
            this.logger.warn(`reach fuseRate, report stats close signaler`);
            if (this.totalConns-1 > 0) this.fetcher.postStats();
            // 断开信令
            this.signalerWs.close();
        } else if (!connected && conns < this.fuseRate) {
            // 重连信令
            this.logger.warn(`low conns, reconnect signaler`);
            this.signalerWs.reconnect();
        }
    }

    _initSignalerWs(mainAddr, backupAddr, token, token2) {
        const formatUrl = (src, token) => {
            let signalUrl = `${src}?id=${this.peerId}&p=web&v=${"2.8.11"}`;
            if (token) {
                signalUrl = `${signalUrl}&token=${token}`;
            }
            return signalUrl
        }
        let websocket
        let signalUrl = formatUrl(mainAddr, token);
        if (!this.overloaded && backupAddr && backupAddr !== mainAddr) {
            let signalUrl2 = formatUrl(backupAddr, token2);
            // console.warn(`_initSignalerWs main ${signalUrl} token ${token} backup ${signalUrl2} token ${token2}`);
            websocket = new _signal_manager__WEBPACK_IMPORTED_MODULE_2__["default"](this.logger, this.config, signalUrl, signalUrl2);
        } else {
            websocket = new _websocket_client__WEBPACK_IMPORTED_MODULE_1__["default"](this.logger, this.config, signalUrl,270);
        }
        websocket.onopen = () => {
            // console.warn('onopen')
            this.connected = true;
            this.engine.emit('serverConnected', true);
            // 尝试与所有peers同时建立连接
            // setTimeout(() => {
            //     this._tryConnectToAllPeers();   // test
            // }, 2000);
            this._tryConnectToAllPeers();
        };

        websocket.onmessage = (msg, signalName) => {
            // let msg = JSON.parse(e.data);
            let action = msg.action;
            const fromPeerId = msg.from_peer_id || msg.from;
            if (!fromPeerId) {
                this.logger.warn(`fromPeerId is missed`);
                return
            }
            switch (action) {
                case 'signal':
                    this._handleSignalMsg(fromPeerId, msg, null, signalName);
                    break;
                case 'reject':
                    this._handSignalRejected(fromPeerId, msg);
                    break;
                default:
                    this.logger.warn(`Signal websocket unknown action ${action}`);

            }
        };
        websocket.onclose = () => {                                            //websocket断开时清除datachannel
            // console.warn('onclose')
            this.connected = false;
            this.engine.emit('serverConnected', false);
        };
        websocket.onerror = (err) => {
            // console.warn('onerror')
            err.message && this.engine.emit(_events__WEBPACK_IMPORTED_MODULE_5__["default"].EXCEPTION, _utils_err_code__WEBPACK_IMPORTED_MODULE_3___default()(err, 'SIGNAL_EXPT'));
        };
        return websocket;
    }

    _handSignalRejected(fromPeerId, msg) {
        this.logger.warn(`signaling ${fromPeerId} rejected, reason ${msg.reason}`);
        const datachannel = this.DCMap.get(fromPeerId);
        // 如果还没连上
        if (datachannel && !datachannel.connected)  {
            datachannel.destroy(msg.fatal);
            this.DCMap.delete(fromPeerId);
        }
        this.requestMorePeers();
        if (msg.fatal) this.failedDCSet.add(fromPeerId);              //记录reject的连接
        this._tryConnectToAllPeers();
    }

    _handleSignalMsg(fromPeerId, msg, intermediator, signalName) {
        if (!this.scheduler) return;
        const { logger } = this;
        if (!msg.data) {                                             //如果对等端已不在线
            const target = this.DCMap.get(fromPeerId);
            if (!target) return
            // 如果是main发送的，用backup重新尝试
            if (this.signalerWs.backupConnected && target && target.signalMsgs.length > 0
                && signalName === 'main' && !target.useBackupSignal) {
                target.useBackupSignal = true;
                target.signalName = 'backup';
                logger.warn(`${fromPeerId} not found from main, try backup signal`);
                for (let msg of target.signalMsgs) {
                    this.signalerWs.sendSignal(fromPeerId, msg, 'backup');
                }
                return
            }
            if (target.useBackupSignal) return
            this._destroyAndDeletePeer(fromPeerId);
            logger.info(`signaling ${fromPeerId} not found`);
            const { scheduler } = this;
            if (scheduler.waitForPeer) {
                scheduler.waitingPeers --;
                if (scheduler.waitingPeers === 0) scheduler.notifyPeersLoaded(0);
            }
            this.requestMorePeers();
            this._tryConnectToAllPeers();
            if (!intermediator) this.notFoundDCSet.add(fromPeerId);              //记录not found的连接
        } else {
            if (this.failedDCSet.has(fromPeerId)) {
                // 拒绝对方连接请求
                this._sendSignalReject(fromPeerId, `peer ${fromPeerId} in blocked list`, intermediator, signalName, true);
                return;
            }
            // logger.debug(`handle signal from ${fromPeerId}`);
            this._handleSignal(fromPeerId, msg.data, intermediator, signalName);
        }
    }

    _handleSignal(remotePeerId, data, intermediator, signalName) {
        const sdpType =  data.type;
        const { logger } = this;
        let datachannel = this.DCMap.get(remotePeerId);
        if (datachannel) {
            if (datachannel.connected) {
                logger.info(`datachannel had connected, signal ignored`);
                return
            } else if (sdpType === 'offer') {
                // 收到的一定是answer  可能产生碰撞
                if (this.peerId > remotePeerId) {
                    // peerId大的转成被动方
                    this._destroyAndDeletePeer(remotePeerId, false);
                    logger.warn(`signal type wrong ${sdpType}, convert to non initiator`);
                    datachannel = this._createDatachannel(remotePeerId, false, intermediator);
                } else {
                    // peerId小的忽略信令
                    logger.warn(`signal type wrong ${sdpType}, ignored`);
                    return;
                }
            }
        } else {
            // 收到节点连接请求
            // 收到的一定是offer
            if (sdpType === 'answer') {
                const errMsg = `signal type wrong ${sdpType}`;
                logger.warn(errMsg);
                // 拒绝对方连接请求
                this._sendSignalReject(remotePeerId, errMsg, intermediator, signalName);
                this._destroyAndDeletePeer(remotePeerId, false);
                return;
            }
            logger.debug(`receive node ${remotePeerId} connection request`);
            // 限制最大连接数
            if (this.DCMap.size >= this.maxConns) {
                const errMsg = `peers reach limit ${this.maxConns}`;
                logger.warn(errMsg);
                // 拒绝对方连接请求
                this._sendSignalReject(remotePeerId, errMsg, intermediator, signalName);
                return;
            }
            datachannel = this._createDatachannel(remotePeerId, false, intermediator);
        }
        if (!datachannel) return;
        if (signalName) {
            datachannel.signalName = signalName;
        }
        datachannel.receiveSignal(data);
    }

    _createDatachannel(remotePeerId, isInitiator, intermediator) {
        if (!this.engine.fetcher) return
        let datachannel;
        if (isInitiator && this.peerPool.size > 0) {
            datachannel = this.peerPool.getPeer();
            this.logger.info(`get peer from pool, signal size ${datachannel.signalMsgs.length}`);
            datachannel.intermediator = intermediator;
            datachannel.assignPeerId(this.peerId, remotePeerId);
        } else {
            let trickle = this.config.trickleICE;
            if (!intermediator) {
                if (this.overloaded) trickle = false;
            }
            datachannel = new $Peer__WEBPACK_IMPORTED_MODULE_7__["default"](this.engine, this.peerId, remotePeerId, isInitiator, this.config, {
                stuns: this.stuns,
                intermediator,
                trickle,
            });
        }
        this.DCMap.set(remotePeerId, datachannel);                                  //将对等端Id作为键
        this._setupDC(datachannel);
        return datachannel;
    }

    _sendSignalReject(remotePeerId, reason, intermediator, signalName, fatal) {
        if (intermediator) {
            const interPeer = this.DCMap.get(intermediator);
            if (interPeer) {
                // 通过中间peer中转
                if (interPeer.sendMsgSignalReject(remotePeerId, this.peerId, reason, fatal)) return;
            }
        }
        this.signalerWs.sendReject(remotePeerId, reason, fatal, signalName);
    }

    // 请求更多节点
    _requestMorePeers(delay) {
        if (!this.fetcher) return
        const { logger } = this;
        logger.info(`requestMorePeers after delay ${delay}`);
        const peersNum = this.scheduler.peersNum;
        const peersIncrement = this.peersIncrement;
        this.peersIncrement = 0;       // 重置
        // console.warn(`peersIncrement ${peersIncrement}`);
        if (peersNum >= this.minConns) return
        if (peersNum === 0 || (peersIncrement <= 3 && !this.gotPeersFromTracker && !this.overloaded)) { // 如果上次获取的节点过少并且不是向tracker请求，则这次向tracker请求
            // 限制 DCSet size
            if (this.failedDCSet.size > 50) {
                this.failedDCSet = new Set([...this.failedDCSet].slice(-50));
            }
            if (this.notFoundDCSet.size > 20) {
                this.notFoundDCSet = new Set([...this.notFoundDCSet].slice(-20));
            }
            // 从服务器获取节点
            this.fetcher.btGetPeers(
                [...this.DCMap.keys(), ...this.failedDCSet.keys(), ...this.notFoundDCSet.keys()], peersNum === 0
            ).then(json => {
                if (json && json.peers) {
                    logger.info(`requestMorePeers resp ${JSON.stringify(json, null, 2)}`);
                    this.peers = this._filterPeers(json.peers);
                    this._tryConnectToAllPeers();
                }
            }).catch(err => {
                logger.error(`requestMorePeers error ${err}`);
            });
            this.gotPeersFromTracker = true;
        } else {
            // 从邻居获取节点
            if (peersNum < this.maxConnsActive) {
                this.scheduler.requestPeers();
                this.gotPeersFromTracker = false;
            }
        }
    }

    _destroyAndDeletePeer(remotePeerId, fatal = true) {
        const datachannel = this.DCMap.get(remotePeerId);
        if (datachannel)  {
            datachannel.destroy(fatal);
            this.DCMap.delete(remotePeerId);
            return true;
        }
        return false;
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TrackerClient);


/***/ }),

/***/ "./src/core/utils/buffer.js":
/*!**********************************!*\
  !*** ./src/core/utils/buffer.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";



exports.Buffer = Buffer

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

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
// Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()
//
// if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
//     typeof console.error === 'function') {
//     console.error(
//         'This browser lacks typed array (Uint8Array) support which is required by ' +
//         '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
//     )
// }
//
// function typedArraySupport () {
//     // Can typed array instances can be augmented?
//     try {
//         var arr = new Uint8Array(1)
//         arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
//         return arr.foo() === 42
//     } catch (e) {
//         return false
//     }
// }

function createBuffer (length) {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"')
    }
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length)
    buf.__proto__ = Buffer.prototype
    return buf
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

function Buffer (arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new TypeError(
                'The "string" argument must be of type string. Received type number'
            )
        }
        return allocUnsafe(arg)
    }
    return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
    })
}

// Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
    if (typeof value === 'string') {
        return fromString(value, encodingOrOffset)
    }

    if (ArrayBuffer.isView(value)) {
        return fromArrayLike(value)
    }

    if (value == null) {
        throw TypeError(
            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
            'or Array-like Object. Received type ' + (typeof value)
        )
    }

    if (isInstance(value, ArrayBuffer) ||
        (value && isInstance(value.buffer, ArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length)
    }

    if (typeof value === 'number') {
        throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
        )
    }

    var valueOf = value.valueOf && value.valueOf()
    if (valueOf != null && valueOf !== value) {
        return Buffer.from(valueOf, encodingOrOffset, length)
    }

    var b = fromObject(value)
    if (b) return b

    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
        typeof value[Symbol.toPrimitive] === 'function') {
        return Buffer.from(
            value[Symbol.toPrimitive]('string'), encodingOrOffset, length
        )
    }

    throw new TypeError(
        'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
        'or Array-like Object. Received type ' + (typeof value)
    )
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
    return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number')
    } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
}

function alloc (size, fill, encoding) {
    assertSize(size)
    if (size <= 0) {
        return createBuffer(size)
    }
    if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string'
            ? createBuffer(size).fill(fill, encoding)
            : createBuffer(size).fill(fill)
    }
    return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
    return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
    assertSize(size)
    return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
    return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
// Buffer.allocUnsafeSlow = function (size) {
//     return allocUnsafe(size)
// }

function fromString (string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8'
    }

    if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
    }

    var length = byteLength(string, encoding) | 0
    var buf = createBuffer(length)

    var actual = buf.write(string, encoding)

    if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual)
    }

    return buf
}

function fromArrayLike (array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0
    var buf = createBuffer(length)
    for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255
    }
    return buf
}

function fromArrayBuffer (array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds')
    }

    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds')
    }

    var buf
    if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array)
    } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset)
    } else {
        buf = new Uint8Array(array, byteOffset, length)
    }

    // Return an augmented `Uint8Array` instance
    buf.__proto__ = Buffer.prototype
    return buf
}

function fromObject (obj) {
    if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0
        var buf = createBuffer(len)

        if (buf.length === 0) {
            return buf
        }

        obj.copy(buf, 0, 0, len)
        return buf
    }

    if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
            return createBuffer(0)
        }
        return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data)
    }
}

function checked (length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
            'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
    }
    return length | 0
}

Buffer.isBuffer = function isBuffer (b) {
    return b != null && b._isBuffer === true &&
        b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.isEncoding = function isEncoding (encoding) {
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
            return true
        default:
            return false
    }
}

Buffer.concat = function concat (list, length) {
    if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
    }

    if (list.length === 0) {
        return Buffer.alloc(0)
    }

    var i
    if (length === undefined) {
        length = 0
        for (i = 0; i < list.length; ++i) {
            length += list[i].length
        }
    }

    var buffer = Buffer.allocUnsafe(length)
    var pos = 0
    for (i = 0; i < list.length; ++i) {
        var buf = list[i]
        if (isInstance(buf, Uint8Array)) {
            buf = Buffer.from(buf)
        }
        if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers')
        }
        buf.copy(buffer, pos)
        pos += buf.length
    }
    return buffer
}

function byteLength (string, encoding) {
    if (Buffer.isBuffer(string)) {
        return string.length
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength
    }
    if (typeof string !== 'string') {
        throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
            'Received type ' + typeof string
        )
    }

    var len = string.length
    var mustMatch = (arguments.length > 2 && arguments[2] === true)
    if (!mustMatch && len === 0) return 0

    // Use a for loop to avoid recursion
    var loweredCase = false
    for (;;) {
        switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len
            case 'utf8':
            case 'utf-8':
                return utf8ToBytes(string).length
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2
            case 'hex':
                return len >>> 1
            default:
                if (loweredCase) {
                    return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
                }
                encoding = ('' + encoding).toLowerCase()
                loweredCase = true
        }
    }
}
Buffer.byteLength = byteLength

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

Buffer.prototype.copy = function copy (target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
    if (!start) start = 0
    if (!end && end !== 0) end = this.length
    if (targetStart >= target.length) targetStart = target.length
    if (!targetStart) targetStart = 0
    if (end > 0 && end < start) end = start

    // Copy 0 bytes; we're done
    if (end === start) return 0
    if (target.length === 0 || this.length === 0) return 0

    // Fatal error conditions
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
    if (end < 0) throw new RangeError('sourceEnd out of bounds')

    // Are we oob?
    if (end > this.length) end = this.length
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
    }

    var len = end - start

    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end)
    } else if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (var i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start]
        }
    } else {
        Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
        )
    }

    return len
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = 'utf8'
        length = this.length
        offset = 0
        // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset
        length = this.length
        offset = 0
        // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0
        if (isFinite(length)) {
            length = length >>> 0
            if (encoding === undefined) encoding = 'utf8'
        } else {
            encoding = length
            length = undefined
        }
    } else {
        throw new Error(
            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        )
    }

    const remaining = this.length - offset
    if (length === undefined || length > remaining) length = remaining

    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds')
    }

    if (!encoding) encoding = 'utf8'

    let loweredCase = false
    for (;;) {
        switch (encoding) {
            case 'hex':
                return hexWrite(this, string, offset, length)

            case 'utf8':
            case 'utf-8':
                return utf8Write(this, string, offset, length)

            case 'ascii':
            case 'latin1':
            case 'binary':
                return asciiWrite(this, string, offset, length)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return ucs2Write(this, string, offset, length)

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                encoding = ('' + encoding).toLowerCase()
                loweredCase = true
        }
    }
}

function hexWrite (buf, string, offset, length) {
    offset = Number(offset) || 0
    const remaining = buf.length - offset
    if (!length) {
        length = remaining
    } else {
        length = Number(length)
        if (length > remaining) {
            length = remaining
        }
    }

    const strLen = string.length

    if (length > strLen / 2) {
        length = strLen / 2
    }
    let i
    for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16)
        if (numberIsNaN(parsed)) return i
        buf[offset + i] = parsed
    }
    return i
}

function utf8Write (buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

function blitBuffer (src, dst, offset, length) {
    let i
    for (i = 0; i < length; ++i) {
        if ((i + offset >= dst.length) || (i >= src.length)) break
        dst[i + offset] = src[i]
    }
    return i
}

function utf16leToBytes (str, units) {
    let c, hi, lo
    const byteArray = []
    for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break

        c = str.charCodeAt(i)
        hi = c >> 8
        lo = c % 256
        byteArray.push(lo)
        byteArray.push(hi)
    }

    return byteArray
}

function asciiToBytes (str) {
    const byteArray = []
    for (let i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF)
    }
    return byteArray
}

function utf8ToBytes (string, units) {
    units = units || Infinity
    var codePoint
    var length = string.length
    var leadSurrogate = null
    var bytes = []

    for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i)

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                }

                // valid lead
                leadSurrogate = codePoint

                continue
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                leadSurrogate = codePoint
                continue
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
        } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        }

        leadSurrogate = null

        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break
            bytes.push(codePoint)
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break
            bytes.push(
                codePoint >> 0x6 | 0xC0,
                codePoint & 0x3F | 0x80
            )
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break
            bytes.push(
                codePoint >> 0xC | 0xE0,
                codePoint >> 0x6 & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
            )
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break
            bytes.push(
                codePoint >> 0x12 | 0xF0,
                codePoint >> 0xC & 0x3F | 0x80,
                codePoint >> 0x6 & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
            )
        } else {
            throw new Error('Invalid code point')
        }
    }

    return bytes
}


// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
    return obj instanceof type ||
        (obj != null && obj.constructor != null && obj.constructor.name != null &&
        obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
}




/***/ }),

/***/ "./src/core/utils/err-code.js":
/*!************************************!*\
  !*** ./src/core/utils/err-code.js ***!
  \************************************/
/***/ ((module) => {

"use strict";


function assign(obj, props) {
    for (const key in props) {
        Object.defineProperty(obj, key, {
            value: props[key],
            enumerable: true,
            configurable: true,
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

    if (typeof code === 'object') {
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

        const ErrClass = function () {};

        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));

        return assign(new ErrClass(), props);
    }
}

module.exports = createError;


/***/ }),

/***/ "./src/core/utils/getPeersThrottle.js":
/*!********************************************!*\
  !*** ./src/core/utils/getPeersThrottle.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/*
    函数节流
    baseInterval: 初始时间间隔
    factor: 增长指数
 */
function getPeersThrottle(method, context, baseInterval = 40) {
// function getPeersThrottle(method, context, baseInterval = 25) {
    var handler = null;
    var going = false;
    var factor = 1.1;
    var delay = baseInterval;
    return function (cancel = false) {
        if (cancel) {
            clearTimeout(handler);
            going = false;
            return;
        }
        if (going) return;
        going = true;
        handler = setTimeout(function(){
            method.call(context, delay);
            going = false;
            handler = null;
        }, delay*1000);
        delay *= factor;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getPeersThrottle);


/***/ }),

/***/ "./src/core/utils/health-detector.js":
/*!*******************************************!*\
  !*** ./src/core/utils/health-detector.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HealthDetector)
/* harmony export */ });

class HealthDetector {
    constructor() {
        this.p2p = 0;
        this.share = 0;
        this.http = 0;
    }

    recordP2p(p2p) {
        this.p2p += p2p;
    }

    recordShare(share) {
        this.share += share;
    }

    recordHttp(http) {
        this.http += http;
    }

    resetTraffic() {
        this.p2p = 0;
        this.share = 0;
        this.http = 0;
    }

    // 最大值是1000
    get healthRatio() {
        if (this.http === 0) return 1000;
        let ratio = Math.round((this.p2p + this.share) / this.http * 100);
        if (ratio <= 0) ratio = 1;
        return ratio
    }
}


/***/ }),

/***/ "./src/core/utils/http-polling.js":
/*!****************************************!*\
  !*** ./src/core/utils/http-polling.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HttpPolling)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);


const MAX_RETRY_COUNT = 3; // 最大重试次数

class HttpPolling extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {

    constructor(logger, addr) {
        super();
        this.logger = logger;
        if (addr.startsWith('wss')) {
            this.addr = addr.replace('wss', 'https')
        } else if (addr.startsWith('ws')) {
            this.addr = addr.replace('ws', 'http')
        }
        this.connected = false;
        this.retryCount = 0;
        this.closed = false;
        this.msgQueue = [];
        this.posting = false;
    }

    start() {
        this.closed = false;
        this._hello(() => {
            this._longPolling();
        });
    }

    _hello(cb) {
        fetch(this.addr + '&hello', {
            method: 'POST',
        }).then(response => {
            if (!response.ok) {
                throw new Error('hello response was not ok');
            }
            return response.json();
        }).then(data => {
            this.connected = true;
            cb();
            if (this.onopen) this.onopen(data.ver);
        }).catch(e => {
            this.closed = true;
            // this.logger.error(e);
            if (this.onerror) this.onerror(e);
        })
    }

    send(msg) {
        this.msgQueue.push(msg);
        if (this.posting) return
        this._realSend([...this.msgQueue])
    }

    _realSend(msg) {
        if (msg.length === 0) return
        this.posting = true;
        this.msgQueue = [];
        fetch(this.addr, {
            method: 'POST',
            body: JSON.stringify(msg)
        }).then(() => {
            this.posting = false;
            if (this.msgQueue.length > 0) {
                this._realSend([...this.msgQueue])
            }
        }).catch(e => {
            this.logger.error(e);
            this.posting = false;
            // if (this.onerror) this.onerror(e);
        })
    }

    close() {
        if (this.connected) {
            this.closed = true;
            this.connected = false;
            if (this.abortController) this.abortController.abort();
            if (this.onclose) this.onclose();
        }
    }

    destroy() {
        this.close();
        this.removeAllListeners();
    }

    _longPolling() {
        if (this.closed) return
        // const { logger } = this;
        this.abortController = new AbortController();
        const signal = this.abortController.signal;
        fetch(this.addr, { signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error('polling response was not ok');
                }
                return response.text()
            })
            .then(data => {
                // 接收到的data是数组
                if (data) {
                    if (this.onmessage) this.onmessage(JSON.parse(data));
                }
                this.retryCount = 0;
                // 递归调用进行下一次长轮询
                this._longPolling();
            })
            .catch(err => {
                // 处理错误
                // logger.error(err);
                if (this.connected) {
                    if (this.retryCount <= MAX_RETRY_COUNT) {
                        this.retryCount ++;
                        this._longPolling();
                    } else {
                        this.connected = false;
                        if (this.onerror) this.onerror(err);
                    }
                }
            });
    }

}


/***/ }),

/***/ "./src/core/utils/logger.js":
/*!**********************************!*\
  !*** ./src/core/utils/logger.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tool_funs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tool-funs */ "./src/core/utils/tool-funs.js");


const logMap = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
};

class Logger {
    constructor(logLevel) {
        this.logLevel = logLevel;
        this.onlineDebug = false;
        try {
            console.debug = console.log;
        } catch (e) {}

        if ((logLevel === 'debug' || logLevel === 'info') && false) {}

        if (logLevel === true) {
            this.logLevel = 'warn';
        } else if (logLevel === false) {
            this.logLevel = 'none';
        } else if (!(logLevel in logMap)) {
            this.logLevel = 'error';   // 默认error
        }
        this.resetLogger();
    }

    enableDebug() {
        this.onlineDebug = true;
        for (let key in logMap) {
            this[key] = console[key];
        }
    }

    resetLogger() {
        this.onlineDebug = false;
        for (let key in logMap) {
            if (logMap[key] < logMap[this.logLevel]) {
                this[key] = _tool_funs__WEBPACK_IMPORTED_MODULE_0__.noop;
            } else {
                this[key] = console[key];
            }
        }
    }

    get isDebugLevel() {
        return logMap[this.logLevel] <= 2 || this.onlineDebug;
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Logger);


/***/ }),

/***/ "./src/core/utils/md5.js":
/*!*******************************!*\
  !*** ./src/core/utils/md5.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
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
    'use strict'

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safeAdd (x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xffff)
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bitRotateLeft (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5cmn (q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }
    function md5ff (a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
    }
    function md5gg (a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
    }
    function md5hh (a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function md5ii (a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binlMD5 (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32)
        x[((len + 64) >>> 9 << 4) + 14] = len

        var i
        var olda
        var oldb
        var oldc
        var oldd
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (i = 0; i < x.length; i += 16) {
            olda = a
            oldb = b
            oldc = c
            oldd = d

            a = md5ff(a, b, c, d, x[i], 7, -680876936)
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5gg(b, c, d, a, x[i], 20, -373897302)
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5hh(d, a, b, c, x[i], 11, -358537222)
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5ii(a, b, c, d, x[i], 6, -198630844)
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safeAdd(a, olda)
            b = safeAdd(b, oldb)
            c = safeAdd(c, oldc)
            d = safeAdd(d, oldd)
        }
        return [a, b, c, d]
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr (input) {
        var i
        var output = ''
        var length32 = input.length * 32
        for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
        }
        return output
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl (input) {
        var i
        var output = []
        output[(input.length >> 2) - 1] = undefined
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0
        }
        var length8 = input.length * 8
        for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
        }
        return output
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstrMD5 (s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstrHMACMD5 (key, data) {
        var i
        var bkey = rstr2binl(key)
        var ipad = []
        var opad = []
        var hash
        ipad[15] = opad[15] = undefined
        if (bkey.length > 16) {
            bkey = binlMD5(bkey, key.length * 8)
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5c5c5c5c
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex (input) {
        var hexTab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i)
            output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
        }
        return output
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstrUTF8 (input) {
        return unescape(encodeURIComponent(input))
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function rawMD5 (s) {
        return rstrMD5(str2rstrUTF8(s))
    }
    function hexMD5 (s) {
        return rstr2hex(rawMD5(s))
    }
    function rawHMACMD5 (k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
    }
    function hexHMACMD5 (k, d) {
        return rstr2hex(rawHMACMD5(k, d))
    }

    function md5 (string, key, raw) {
        if (!key) {
            if (!raw) {
                return hexMD5(string)
            }
            return rawMD5(string)
        }
        if (!raw) {
            return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
    }

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return md5
        }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
    } else {}
})(this)


/***/ }),

/***/ "./src/core/utils/mse.js":
/*!*******************************!*\
  !*** ./src/core/utils/mse.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isMSESupported": () => (/* binding */ isMSESupported)
/* harmony export */ });

function getMediaSource () {
    if (typeof self === 'undefined') return undefined;
    return self.ManagedMediaSource || self.MediaSource || self.WebKitMediaSource;
}

function getSourceBuffer() {
    return self.SourceBuffer || self.WebKitSourceBuffer;
}

function isMSESupported () {
    const mediaSource = getMediaSource();
    if (!mediaSource) {
        return false;
    }

    // if SourceBuffer is exposed ensure its API is valid
    // Older browsers do not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
    const sourceBuffer = getSourceBuffer();
    return (
        !sourceBuffer ||
        (sourceBuffer.prototype &&
            typeof sourceBuffer.prototype.appendBuffer === 'function' &&
            typeof sourceBuffer.prototype.remove === 'function')
    );
}


/***/ }),

/***/ "./src/core/utils/platform.js":
/*!************************************!*\
  !*** ./src/core/utils/platform.js ***!
  \************************************/
/***/ ((module) => {


const device = {
    ANDROID_WEB: 'android-web',
    IOS_WEB: 'iOS-web',
    PC_NATIVE: 'PC-native',
    PC_WEB: 'PC-web'
};

var os = {
    //网络类型 wifi 4g 3g 2g unknown or '' non_network cellular
    getNetType: function () {
        let netType = ((new RegExp('nettype\\/(\\w*)').exec(_getUA()) || [, ''])[1]).toLowerCase();
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
            const type = navigator.connection.type;
            switch (type) {
                case 'ethernet':
                    netType = 'ethernet';
                    break;
                case 'cellular':
                    // netType = '4g';
                    netType = 'cellular';
                    break;
                default:
                    netType = 'wifi'
            }
        }
        return netType;
    },
    //获取设备类型
    getPlatform: function () {
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
    isX5: function () {
        return this.isAndroid() && /\s(TBS|X5Core)\/[\w\.\-]+/i.test(_getUA());
    },
    isPC: function () {
        return !_toNum(_platform('os ')) && !_toNum(_platform('android[/ ]'));
    },
    isIOS: function () {
        return _toNum(_platform('os '));
    },
    isAndroid: function () {
        return _toNum(_platform('android[/ ]'));
    },
    isIOSSafari: function () {
        return this.isIOS() && this.isSafari();
    },
    isElectron: function () {
        return /electron/i.test(_getUA());
    },
    isMobile: function () {
        return os.isAndroid() || os.isIOS();
    },
    isSafari: function () {
        return /^((?!chrome|android).)*safari/i.test(_getUA());
    },
    isFirefox: function() {
        return /firefox/i.test(_getUA());
    },
    isChrome: function() {
        return /chrome/i.test(_getUA());
    },
    isLocalHost: function() {
        return location.hostname === 'localhost';
    },

    device,

    getBrowser: function () {
        if (os.isX5()) {
            return 'X5'
        } else if (os.isChrome()) {
            return 'Chrome'
        } else if (os.isFirefox()) {
            return 'Firefox'
        } else if (os.isIOSSafari()) {
            return 'iOS-Safari'
        } else if (os.isSafari()) {
            return 'Mac-Safari'
        } else {
            return 'Unknown'
        }
    }
};

function _getUA() {
    return navigator.userAgent.toLowerCase();
}

function _platform(os) {
    var ver = ('' + (new RegExp(os + '(\\d+((\\.|_)\\d+)*)').exec(_getUA()) || [, 0])[1]);
    // undefined < 3 === false, but null < 3 === true
    return ver || undefined;
}

function _toNum(str) {
    return parseFloat((str || "").replace(/\_/g, '.')) || 0;
}

module.exports = os;


/***/ }),

/***/ "./src/core/utils/player-detector.js":
/*!*******************************************!*\
  !*** ./src/core/utils/player-detector.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

const players = {
    'DPlayer': 'dplayer',
    'CBPlayer': 'cbplayer',
    'jwplayer': 'jwplayer',
    'videojs': 'videojs',
    'Clappr': 'clappr',
    'ckplayer': 'ckplayer',
    'MediaElementPlayer': 'mediaelement',
    'MediaElement': 'mediaelement',
    'TcPlayer': 'tcplayer',
    'flowplayer': 'flowplayer',
    'Chimee': 'chimee',
    'ChimeePlayer': 'chimee',
    'HlsJsPlayer': 'xgplayer',
    'fluidPlayer': 'fluidplayer',
    'OpenPlayer': 'openplayer',
    'Plyr': 'plyr',
    'Playerjs': 'playerjs',
    'Aliplayer': 'aliplayer',
    'shaka': 'shakaplayer',
};

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
    let ret;
    for (let player in players) {
        if (self[player]) {
            ret = players[player];
            break;
        }
    }
    return ret;
}


/***/ }),

/***/ "./src/core/utils/queue-microtask.js":
/*!*******************************************!*\
  !*** ./src/core/utils/queue-microtask.js ***!
  \*******************************************/
/***/ ((module) => {

let promise

module.exports = typeof queueMicrotask === 'function'
    ? queueMicrotask.bind(globalThis)
    // reuse resolved promise, and allocate it lazily
    : cb => (promise || (promise = Promise.resolve()))
        .then(cb)
        .catch(err => setTimeout(() => { throw err }, 0))


/***/ }),

/***/ "./src/core/utils/storage.js":
/*!***********************************!*\
  !*** ./src/core/utils/storage.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getItem": () => (/* binding */ getItem),
/* harmony export */   "hasItemUnexpired": () => (/* binding */ hasItemUnexpired),
/* harmony export */   "removeAllItem": () => (/* binding */ removeAllItem),
/* harmony export */   "removeItem": () => (/* binding */ removeItem),
/* harmony export */   "setItem": () => (/* binding */ setItem),
/* harmony export */   "setItemWithExpiration": () => (/* binding */ setItemWithExpiration)
/* harmony export */ });
/**
 * 存储数据
 */
const setItem = (key, value) => {
    // 将数组、对象类型的数据转化为 JSON 字符串进行存储
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

/**
 * 是否有未过期数据
 */
const hasItemUnexpired = key => {
    const data = localStorage.getItem(key)
    try {
        const item = JSON.parse(data)
        if (item.duration && item.startTime) {
            let date = Date.now();
            // if (date - item.startTime >= item.duration) {
            //     console.warn(`ipdate expired`)
            // }
            return date - item.startTime < item.duration
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

/**
 * 获取数据
 */
const getItem = key => {
    const data = localStorage.getItem(key)
    try {
        const item = JSON.parse(data)
        if (item.value) {
            return item.value
        } else {
            return item;
        }
    } catch (err) {
        return data
    }
}

/**
 * 删除数据
 */
const removeItem = key => {
    localStorage.removeItem(key)
}

/**
 * 删除所有数据
 */
const removeAllItem = () => {
    localStorage.clear()
}

/**
 * 存储数据（带过期时间）ms
 */
const setItemWithExpiration = (key, value, duration) => {
    let obj = {
        value,
        duration,
        startTime: Date.now()//记录何时将值存入缓存，毫秒级
    }
    setItem(key, obj)
}


/***/ }),

/***/ "./src/core/utils/tool-funs.js":
/*!*************************************!*\
  !*** ./src/core/utils/tool-funs.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_PACKET_SIZE": () => (/* binding */ DEFAULT_PACKET_SIZE),
/* harmony export */   "HEADER_SW_PROXY": () => (/* binding */ HEADER_SW_PROXY),
/* harmony export */   "appendQueryParamOfUrl": () => (/* binding */ appendQueryParamOfUrl),
/* harmony export */   "calCheckPeersDelay": () => (/* binding */ calCheckPeersDelay),
/* harmony export */   "compareVersions": () => (/* binding */ compareVersions),
/* harmony export */   "copyBuffer": () => (/* binding */ copyBuffer),
/* harmony export */   "dontWaitFor": () => (/* binding */ dontWaitFor),
/* harmony export */   "getAndRemoveQueryParamOfUrl": () => (/* binding */ getAndRemoveQueryParamOfUrl),
/* harmony export */   "getAvailableMemory": () => (/* binding */ getAvailableMemory),
/* harmony export */   "getBrowserRTC": () => (/* binding */ getBrowserRTC),
/* harmony export */   "getCurrentTs": () => (/* binding */ getCurrentTs),
/* harmony export */   "getHomeUrl": () => (/* binding */ getHomeUrl),
/* harmony export */   "getMaxSequence": () => (/* binding */ getMaxSequence),
/* harmony export */   "getNetUrl": () => (/* binding */ getNetUrl),
/* harmony export */   "getQueryParam": () => (/* binding */ getQueryParam),
/* harmony export */   "getQueryParamOfUrl": () => (/* binding */ getQueryParamOfUrl),
/* harmony export */   "getRangeFromRangeStr": () => (/* binding */ getRangeFromRangeStr),
/* harmony export */   "isArrayBuffer": () => (/* binding */ isArrayBuffer),
/* harmony export */   "isConstructor": () => (/* binding */ isConstructor),
/* harmony export */   "isHttps": () => (/* binding */ isHttps),
/* harmony export */   "isInteger": () => (/* binding */ isInteger),
/* harmony export */   "navLang": () => (/* binding */ navLang),
/* harmony export */   "noop": () => (/* binding */ noop),
/* harmony export */   "performRangeRequest": () => (/* binding */ performRangeRequest),
/* harmony export */   "proxyKeepalive": () => (/* binding */ proxyKeepalive),
/* harmony export */   "randomNum": () => (/* binding */ randomNum),
/* harmony export */   "removeUrlParameter": () => (/* binding */ removeUrlParameter),
/* harmony export */   "splitBytes": () => (/* binding */ splitBytes),
/* harmony export */   "swRegisterPromise": () => (/* binding */ swRegisterPromise),
/* harmony export */   "timeout": () => (/* binding */ timeout),
/* harmony export */   "timeoutReject": () => (/* binding */ timeoutReject),
/* harmony export */   "trimMap": () => (/* binding */ trimMap),
/* harmony export */   "trimSet": () => (/* binding */ trimSet),
/* harmony export */   "updateQueryStringParam": () => (/* binding */ updateQueryStringParam)
/* harmony export */ });
/* harmony import */ var _buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer */ "./src/core/utils/buffer.js");
/* harmony import */ var _common_sw_sw_tool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/sw/sw-tool */ "./src/common/sw/sw-tool.js");



const HEADER_SW_PROXY = '__sw_proxy__';

const CHECK_PEERS_INTERVAL = 3;                   // 定时p2p下载的时间间隔 单位秒

const DEFAULT_PACKET_SIZE = 64 * 1000;

function noop() {
    return true;
}

// export function getQueryParam(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = location.search.substr(1).match(reg);
//     if (r != null && r[2] !== '') return r[2].toString();
//     return '';
// }

function getQueryParam(name) {
    return new URL(location.href).searchParams.get(name)
}

function getQueryParamOfUrl(url, name) {
    return new URL(url).searchParams.get(name)
}

function appendQueryParamOfUrl(url, name, value) {
    const _url = new URL(url);
    _url.searchParams.append(name, value);
    return _url.href
}

function removeUrlParameter(url, paramKey) {
    const r = new URL(url);
    r.searchParams.delete(paramKey);
    return r.href
}

function getAndRemoveQueryParamOfUrl(url, name) {
    const r = new URL(url);
    const exist = r.searchParams.get(name);
    if (exist) {
        r.searchParams.delete(name);
        return r.href
    }
    return ''
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
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

// 获取当前时间戳 秒
function getCurrentTs() {
    return Date.parse(new Date()) / 1000;
}

// 生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
}

// 计算check peers的delay
function calCheckPeersDelay(peerNum) {
    if (peerNum === 0) return CHECK_PEERS_INTERVAL;
    return 0.5*peerNum + 1.67;         // 假设最高下载peer数为10
}

function performRangeRequest(uri, range, xhrSetup, timeout = 2000, proxied = false) {
    const xhr = new XMLHttpRequest();
    let proxiedUrl = uri;
    if (proxied) {
        // xhr.setRequestHeader(HEADER_SW_PROXY, 'bypass');
        proxiedUrl = appendQueryParamOfUrl(uri, _common_sw_sw_tool__WEBPACK_IMPORTED_MODULE_1__.proxyIdentifier, true);
    }
    return new Promise(((resolve, reject) => {
        xhr.open('GET', proxiedUrl, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = timeout;
        xhr.onreadystatechange = (event) => {
            const readyState = xhr.readyState;
            if (readyState === 4) {
                const status = xhr.status;
                if (status === 206 || (status === 200 && range)) {
                    resolve(xhr.response)
                } else {
                    reject(`status ${status}`);
                }
            }
        }
        xhr.onerror = (event) => {
            reject(`request error`);
        };
        xhr.ontimeout = (event) => {
            reject('timeout');
        };
        xhr.setRequestHeader('Range', range || 'bytes=0-0');
        if (xhrSetup) {
            xhrSetup(xhr, uri);
        }
        xhr.send();
    }))
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
//     }).catch(e=>{});
// }

function navLang() {
    var lang = navigator.language || navigator.userLanguage //常规浏览器语言和IE浏览器
    // lang = lang.substr(0, 2) //截取lang前2位字符
    return lang === 'zh-CN' ? 'cn' : 'en'
}

function dontWaitFor(promise) {
    // Effective no-op.
    promise.then(() => {});
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeoutReject(ms, msg) {
    return new Promise((resolve, reject) => setTimeout(() => { reject(msg) }, ms));
}

function getBrowserRTC () {
    if (typeof self === 'undefined') return null
    var wrtc = {
        RTCPeerConnection: self.RTCPeerConnection || self.mozRTCPeerConnection ||
            self.webkitRTCPeerConnection,
        RTCSessionDescription: self.RTCSessionDescription ||
            self.mozRTCSessionDescription || self.webkitRTCSessionDescription,
        RTCIceCandidate: self.RTCIceCandidate || self.mozRTCIceCandidate ||
            self.webkitRTCIceCandidate
    }
    if (!wrtc.RTCPeerConnection) return null
    if (!wrtc.RTCPeerConnection.prototype) return null
    return wrtc
}

function copyBuffer(source) {
    const payloadBuf = _buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(source);
    const targetBuffer = new _buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer(source.byteLength);
    payloadBuf.copy(targetBuffer);
    return targetBuffer
}

function getMaxSequence(m3u8) {
    const lines = m3u8.split('\n');
    let start = 0;
    const tsTag = '#EXTINF';
    let count = 0;
    for (let line of lines) {
        const match = (/^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/).exec(line);
        if (match) {
            if (match[1]) {
                start = parseInt(match[1], 10);
                break
            }
        }
    }
    for (let line of lines) {
        if (line.startsWith(tsTag)) {
            count ++;
        }
    }
    return start+count-1
}

function isHttps() {
    return location.protocol.startsWith('https')
}

function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}

/*
display: block;
background-image: -webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%,
#ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
color: transparent;
-webkit-text-fill-color: transparent;
-webkit-background-clip: text;
background-size: 200% 100%;
animation: masked-animation 4s infinite linear;
 */
// export function appendSlogan(text, href, target) {
//     var div = document.createElement( "div" );
//     div.style.position = 'absolute'
//     div.style.top = '8px'
//     div.style.left = '8px'
//     div.style.zIndex = '999'
//     div.style.fontSize = '10px'
//     // var h4 = document.createElement( "h4" );
//     var a = document.createElement( "a" );
//     a.href= href
//     a.target="_blank"
//     a.innerText= text;
//     a.style.color = 'white'
//     a.style.textDecoration = 'none'
//     a.style.textShadow = '0 0 5px white,0 0 10px #00FFFF,0 0 15px #7FFF00,0 0 20px white'
//     // const s = h4.style
//     // s.display = 'block'
//     // s.backgroundImage = '-webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%, #ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db)'
//     // s.color = 'transparent'
//     // s.animation = 'masked-animation 4s infinite linear'
//     // s.backgroundSize = '200% 100%'
//     // s.webkitTextFillColor = 'transparent'
//     // s.backgroundClip = 'text'
//     var i = document.createElement( "i" )
//     i.style.width = '5px'
//     i.style.height = '5px'
//     i.style.borderRadius = '50%'
//     i.style.display = 'inline-block'
//     i.style.backgroundColor = '#67C23A'
//     i.style.marginBottom = '2px'
//     i.style.marginRight = '4px'
//     div.appendChild(i)
//     div.appendChild(a)
//     // insertAfter(div, target)
//     var parent = target.parentNode;
//     if (parent) {
//         parent.insertBefore(div, target)
//     }
// }

// function insertAfter(newElement, targetElement){
//     var parent = targetElement.parentNode
//     parent.style.position = 'relative'
//     if (parent.lastChild === targetElement) {
//         // 如果最后的节点是目标元素，则直接添加。因为默认是最后
//         parent.appendChild(newElement)
//     }
//     else {
//         parent.insertBefore(newElement, targetElement.nextSibling)
//         //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
//     }
// }

function getHomeUrl() {
    return self.atob('aHR0cHM6Ly9zd2FybWNsb3VkLm5ldA==')
}

// 从from开始将sink分成若干个，每个大小packetSize
function splitBytes(sink, from) {
    const dataSize = sink.byteLength - from;
    const bufList = [];
    let offset = from;
    let packetsCompleted = Math.floor(dataSize / DEFAULT_PACKET_SIZE);
    let remainder = dataSize % DEFAULT_PACKET_SIZE;
    for (let i=0; i < packetsCompleted; i++) {
        const buffer = (0,_buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer)(DEFAULT_PACKET_SIZE);
        sink.copy(buffer, 0, offset, offset + DEFAULT_PACKET_SIZE)
        bufList.push(buffer);
        offset += DEFAULT_PACKET_SIZE;
    }
    if (remainder > 0) {
        const buffer = (0,_buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer)(remainder);
        sink.copy(buffer, 0, offset, offset + remainder)
        bufList.push(buffer);
    }
    return bufList
}

// 获取可用的内存大小，不支持返回 -1
function getAvailableMemory() {
    const { memory} = performance
    if (!memory) return -1
    return memory.jsHeapSizeLimit - memory.usedJSHeapSize
}

// 淘汰map最旧的limit之外的key
function trimMap(map, limit) {
    if (map.size <= limit) return
    const keys = [...map.keys()];
    do {
        map.delete(keys.shift())
    } while(map.size > limit)
}

// 淘汰set最旧的limit之外的value
function trimSet(set, limit) {
    if (set.size <= limit) return
    const values = [...set.values()];
    do {
        set.delete(values.shift())
    } while(set.size > limit)
}

function isArrayBuffer(target) {
    return target instanceof ArrayBuffer && target.byteLength !== 0
}

function getRangeFromRangeStr(rangeStr) {
    if (!rangeStr) {
        return {}
    }
    rangeStr = rangeStr.substring(6)
    const arr = rangeStr.split('-')
    if (arr.length !== 2) {
        return {}
    }
    const start = Number(arr[0]);
    const end = arr[1] ? Number(arr[1]) : -1;
    return {
        rangeStart: start,
        rangeEnd: end >= 0 ? end + 1 : undefined,
    }
}

function compareVersions(version1, version2) {
    // 将版本号拆分成数字数组
    var arr1 = version1.split('.');
    var arr2 = version2.split('.');

    // 遍历数字数组进行逐段比较
    for (var i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        var num1 = parseInt(arr1[i] || 0); // 如果数组长度不够，则将缺失部分补0
        var num2 = parseInt(arr2[i] || 0);

        if (num1 < num2) {
            return -1; // 版本1小于版本2
        } else if (num1 > num2) {
            return 1; // 版本1大于版本2
        }
    }

    return 0; // 版本1等于版本2

}

function swRegisterPromise(reg) {
    return new Promise((resolve, reject) => {
        // console.warn(`statechange`);
        const swRegTmp = reg.installing || reg.waiting || reg.active;
        // console.warn(`swRegTmp.state ${swRegTmp.state}`)
        const fn = () => {
            if (swRegTmp.state === 'activated') {
                swRegTmp.removeEventListener('statechange', fn);
                resolve(reg)
                return true
            }
            return false
        }
        if (!fn()) {
            swRegTmp.addEventListener('statechange', fn);
        }
    })
}

function isConstructor(f) {
    try {
        new f();
    } catch (err) {
        return false;
    }
    return true;
}

function proxyKeepalive(pathname) {
    return new Promise((resolve, reject) => {
        fetch(`${pathname}/keepalive/`)
            .then(resp => {
                if (resp.ok) {
                    return resp.text();
                } else {
                    throw new Error("keepalive failed");
                }
            }).then(body => {
            if (body.trim() === "") {
                resolve()
            } else {
                reject(`not valid keepalive response`)
            }
            }).catch(e => {
                reject(e)
            })
    })
}

function getNetUrl(url) {
    return url.split('?')[0]
}




/***/ }),

/***/ "./src/core/websocket-client.js":
/*!**************************************!*\
  !*** ./src/core/websocket-client.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var reconnecting_websocket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reconnecting-websocket */ "./node_modules/_reconnecting-websocket@4.4.0@reconnecting-websocket/dist/reconnecting-websocket-mjs.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _utils_http_polling__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/http-polling */ "./src/core/utils/http-polling.js");





const PING_INTERVAL = 60;
const PONG_TIMEOUT = 15;

class WebsocketClient extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(logger, config, addr, interval, name='main') {
        super();
        this.logger = logger;
        this.config = config;
        // console.warn("SignalClient " + addr);
        this.wsAddr = addr;     // 已经加了查询参数
        // this.wsAddr = addr.replace("://", "://abc")       // test polling
        // this.wsAddr = addr.replace("ws://", "wss://")       // test local
        this.serverVersion = 0;
        this.pingInterval = interval || PING_INTERVAL;
        // this.pingInterval = 30;           // test
        this.name = name;
        // this.pollingClient = new HttpPolling(logger, addr.replace("://", "://abc"));   // test polling
        this.pollingClient = new _utils_http_polling__WEBPACK_IMPORTED_MODULE_3__["default"](logger, addr);
        try {
            this._ws = this._init();
        } catch (e) {
            // 不支持Websocket
            logger.error(e);
            this._startPolling();
        }
    }

    _init() {
        const wsOptions = {
            // debug: true,
            maxRetries: this.config.wsMaxRetries,
            minReconnectionDelay: (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.randomNum)(10000, 60000), // 生成15到40秒的随机数
            maxReconnectionDelay: 600*1000,
            maxEnqueuedMessages: 20,
        };
        // console.warn("ws init " + this.wsAddr + " minReconnectionDelay " + wsOptions.minReconnectionDelay);
        let ws = new reconnecting_websocket__WEBPACK_IMPORTED_MODULE_1__["default"](this.wsAddr, undefined, wsOptions);
        ws.addEventListener('open', () => {
            this.logger.info(`signal ${this.name} ${this.wsAddr} connection opened`);
            if (this.pollingClient.connected) {
                this.pollingClient.close();
            } else {
                if (this.onopen) this.onopen();
                this._startPing(this.pingInterval);    // 开始发送心跳包
            }
        })

        ws.push = ws.send;
        ws.send = msg => {
            // let msgStr = JSON.stringify(Object.assign({peer_id: id}, msg));
            let msgStr = JSON.stringify(msg);
            ws.push(msgStr);
            // this._resetPing();    // 重置心跳
        };
        ws.addEventListener('message', (e) => {
            let data = e.data;
            const msg = JSON.parse(data);

            const action = msg.action;
            if (action === 'pong') {
                clearTimeout(this.pongTimer);
                return
            } else if (action === 'ver') {
                this.serverVersion = msg.ver;
                return
            } else if (action === 'close') {
                this.logger.warn(`server close signal ${this.name} reason ${msg.reason}`);
                this.close();
                return;
            }

            if (this.onmessage) this.onmessage(msg, this.name)

        })

        ws.addEventListener('close', (e) => {
            this.logger.warn(`signal ${this.name} ${this.wsAddr} closed ${e.code} ${e.reason}`);
            if (e.code >= 5000 || e.code < 4000) {
                // 服务端限流或者其他错误
                if (this.onclose) this.onclose();
                this._stopPing();                      // 停止心跳
            } else {
                // 客户端错误
                this.close();
            }
            // if (e.code === 1000) {
            //     // 正常关闭
            //
            // } else {
            //     this.connecting = true;            // 防止调用reconnect
            // }
        })

        ws.addEventListener('error', (err) => {
            // this.logger.error(`signal ${this.name} ${this.wsAddr} error`);
            this._stopPing();                      // 停止心跳
            if (this.onerror) this.onerror(err);
            this._startPolling();
        })

        return ws;
    }

    _startPolling() {
        if (this.pollingClient.connected) return
        this.logger.info(`start polling`);
        this.pollingClient.start();
        this._setupPolling(this.pollingClient);
    }

    sendSignal(remotePeerId, data) {
        const msg = {
            action: 'signal',
            to_peer_id: remotePeerId,
            data: data
        };
        this._send(msg);
    }

    sendReject(remotePeerId, reason, fatal) {
        const msg = {
            action: 'reject',
            to_peer_id: remotePeerId,
            reason,
            fatal,
        };
        this._send(msg);
    }

    _send(msg) {
        if (this.pollingClient.connected) {
            this.pollingClient.send(msg)
        } else if (this._ws) {
            // this.logger.info(`${this.name} send ${JSON.stringify(msg)}`);
            this._ws.send(msg);
        }
    }

    _startPing(interval = 120) {
        if (this.connected) {
            this.pingTimer = setInterval(() => {
                const msg = {
                    action: 'ping',
                };
                if (this._ws) {
                    this._ws.send(msg);
                }
                // this._send(msg);
                if (this.serverVersion >= 22) {
                    this._waitForPong();
                }
            }, interval * 1000)
        }
    }

    _waitForPong() {
        this.pongTimer = setTimeout(() => {
            this.logger.warn(`signal ${this.name} wait for pong timeout, reconnect`);
            this.close();
            this.reconnect();
        }, PONG_TIMEOUT * 1000)
    }

    _resetPing() {
        this._stopPing();
        this._startPing(this.pingInterval);
    }

    _stopPing() {
        clearInterval(this.pingTimer);
        clearTimeout(this.pongTimer);
        this.pingTimer = null;
        this.pongTimer = null;
    }

    close() {
        const closeWs = () => {
            if (this._ws) this._ws.close(1000, 'normal close');
        }
        this.logger.info(`close signal ${this.name}`);
        this._stopPing();                           // 停止心跳
        closeWs();
        this.pollingClient.close();
    }

    reconnect() {
        if (!this._ws) return;
        this.logger.info(`reconnect signal ${this.name}`);
        this._ws.reconnect();
    }

    destroy() {
        this.close();
        this._ws = null;
        this.removeAllListeners();
        this.pollingClient.destroy();
        // this.logger.warn(`destroy ${this.name}`);
    }

    get connected() {
        if (this.pollingClient.connected) return true
        return this._connected
    }

    get _connected() {
        if (!this._ws) return false
        return this._ws.readyState === reconnecting_websocket__WEBPACK_IMPORTED_MODULE_1__["default"].OPEN
    }

    _setupPolling(client) {
        client.onopen = (ver) => {
            if (ver) {
                this.serverVersion = ver;
            }
            this.logger.info(`polling opened`);
            if (this.onopen) this.onopen();
        }
        client.onerror = (err) => {
            if (this._connected) return
            if (this.onerror) this.onerror(err);
        }
        client.onclose = () => {
            if (this._connected) return
            if (this.onclose) this.onclose();
        }
        client.onmessage = (msgs) => {
            if (this.onmessage) {
                for (let msg of msgs) {
                    this.onmessage(msg, this.name);
                }
            }
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebsocketClient);


/***/ }),

/***/ "./src/hls-next/common/bitcounts-manager.js":
/*!**************************************************!*\
  !*** ./src/hls-next/common/bitcounts-manager.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BitCountsManager)
/* harmony export */ });

class BitCountsManager {
    constructor() {
        this.levelMap = new Map();        // level -> bitCounts
    }

    totalLevels() {
        return this.levelMap.size
    }

    has(sn, level) {
        const bitCounts = this._createOrGetMap(level);
        return bitCounts.has(sn)
    }

    delete(sn, level) {
        const bitCounts = this._createOrGetMap(level);
        return bitCounts.delete(sn)
    }

    decre(sn, level) {
        const bitCounts = this._createOrGetMap(level);
        if (bitCounts.has(sn)) {
            let last = bitCounts.get(sn);
            if (last === 1) {
                bitCounts.delete(sn);
            } else {
                bitCounts.set(sn, last-1);
            }
        }
    }

    incre(sn, level) {
        const bitCounts = this._createOrGetMap(level);
        if (!bitCounts.has(sn)) {
            bitCounts.set(sn, 1);
        } else {
            let last = bitCounts.get(sn);
            bitCounts.set(sn, last+1);
        }
    }

    clear() {
        this.levelMap.forEach((bitCounts) => {
            bitCounts.clear()
        })
    }

    size(level) {
        const bitCounts = this._createOrGetMap(level);
        return bitCounts.size
    }

    _createOrGetMap(level) {
        // if (level === undefined) {
        //     console.error(`bitCounts level is undefined`)
        //     level = 0;
        // } else
        if (typeof level !== 'number') {
            // console.error(`bitCounts level is not number`)
            level = Number(level);
        }
        let bitCounts = this.levelMap.get(level);
        if (!bitCounts) {
            bitCounts = new Map();
            this.levelMap.set(level, bitCounts);
        }
        return bitCounts
    }

}


/***/ }),

/***/ "./src/hls-next/common/bitset-manager.js":
/*!***********************************************!*\
  !*** ./src/hls-next/common/bitset-manager.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BitsetManager)
/* harmony export */ });
/* harmony import */ var _segment_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./segment-state */ "./src/hls-next/common/segment-state.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");



const LIVE_SN_LIMIT = 20;                         // LIVE保存的最多SN数

class BitsetManager {

    constructor(isLive = false, map) {
        this.isLive = isLive;
        this.levelMap = new Map();        //  level -> map<sn, {state: SegmentState, segId}>
        for (let level in map) {
            const levelN = Number(level)
            if (levelN < 0) continue
            const bitmap = new Map()
            if (map[level]) {
                for (let sn of map[level]) {
                    // 状态都是 COMPLETE segId未知
                    bitmap.set(sn, {
                        state: _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.COMPLETE,
                        segId: undefined,
                    })
                }
            }
            this.levelMap.set(levelN, bitmap);
        }
    }

    totalLevels() {
        return this.levelMap.size
    }

    hasWithId(sn, level, segId, state = _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.ANY) {
        if (level < 0) return false
        const bitmap = this._createOrGetSet(level);
        const obj = bitmap.get(sn)
        if (!obj) return false
        if (segId && obj.segId && obj.segId !== segId) return false
        if (state === _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.ANY) return true
        return obj.state === state
    }

    has(sn, level, state = _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.ANY) {
        return this.hasWithId(sn, level, undefined, state)
    }

    hasCompleteOr(sn, level, state = _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.COMPLETE) {
        const bitmap = this._createOrGetSet(level);
        const obj = bitmap.get(sn)
        if (!obj) return false
        return obj.state === _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.COMPLETE || obj.state === state
    }

    getObj(sn, level) {
        const bitmap = this._createOrGetSet(level);
        let obj = bitmap.get(sn)
        if (!obj) obj = {};
        return obj
    }

    getSegId(sn, level) {
        return this.getObj(sn, level).segId
    }

    getState(sn, level) {
        return this.getObj(sn, level).state
    }

    delete(sn, level) {
        const bitmap = this._createOrGetSet(level);
        return bitmap.delete(sn)
    }

    add(sn, level, segId, state) {
        if (!(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__.isInteger)(sn)) return
        const bitmap = this._createOrGetSet(level);
        bitmap.set(sn, {
            state,
            segId,
        });
        if (this.isLive) {
            this._trimBitset(sn)
        }
    }

    array(level) {
        const bitmap = this._createOrGetSet(level);
        return this._keysForStateComplete(bitmap)
    }

    allArray() {
        let map = {}
        this.levelMap.forEach((bitmap, level) => {
            map[level] = this._keysForStateComplete(bitmap);
        })
        return map
    }

    clear() {
        this.levelMap.forEach(bitmap => {
            bitmap.clear()
        })
    }

    size(level) {
        const bitmap = this._createOrGetSet(level);
        return bitmap.size
    }

    _createOrGetSet(level) {
        if (typeof level !== 'number') {
            // console.error(`bitset level is not number`)
            level = Number(level);
        }
        let bitmap = this.levelMap.get(level);
        if (!bitmap) {
            bitmap = new Map();
            this.levelMap.set(level, bitmap);
        }
        return bitmap
    }

    _trimBitset(sn) {
        const oldest = sn - LIVE_SN_LIMIT;
        if (oldest > 0) {
            this.levelMap.forEach(bitmap => {
                bitmap.delete(oldest);
            })
            // logger.debug(`datachannel bitset delete ${oldest}`);
        }
    }

    _keysForStateComplete(bitmap) {
        const array = [];
        for (let [key, value] of bitmap) {
            if (value.state === _segment_state__WEBPACK_IMPORTED_MODULE_0__.SegmentState.COMPLETE) {
                array.push(key);
            }
        }
        return array
    }
}


/***/ }),

/***/ "./src/hls-next/common/coordinator.js":
/*!********************************************!*\
  !*** ./src/hls-next/common/coordinator.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Coordinator)
/* harmony export */ });

const ALPHA = 0.6;                        // 平滑系数

class Coordinator {
    constructor() {
        this.meanHttpSpeed = 0;
    }

    addHttpSpeed(speed) {
        this.meanHttpSpeed = (1.0 - ALPHA) * this.meanHttpSpeed + ALPHA * speed;
    }

    shouldSwitchToHttp(remainSize, deadline, p2pSpeed, packetSize, httpLoadTime) {
        // console.warn(`shouldSwitchToHttp remainSize ${remainSize} deadline ${deadline} p2pSpeed ${p2pSpeed} meanHttpSpeed ${this.meanHttpSpeed}`)
        if (this.meanHttpSpeed <= 0) return false
        if (p2pSpeed >= this.meanHttpSpeed) return false
        if (this.meanHttpSpeed * httpLoadTime >= remainSize) return false
        const duration = ((httpLoadTime + deadline - performance.now()) * this.meanHttpSpeed - remainSize) / (this.meanHttpSpeed - p2pSpeed);
        // console.warn(`shouldSwitchToHttp duration ${duration}`)
        return duration * p2pSpeed < packetSize
    }
}


/***/ }),

/***/ "./src/hls-next/common/engine.js":
/*!***************************************!*\
  !*** ./src/hls-next/common/engine.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Engine)
/* harmony export */ });
/* harmony import */ var _core_engine_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/engine-base */ "./src/core/engine-base.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_utils_platform__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./src/hls-next/config.js");
/* harmony import */ var _segment_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./segment-store */ "./src/hls-next/common/segment-store.js");
/* harmony import */ var _segment_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./segment-cache */ "./src/hls-next/common/segment-cache.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");







// import TsValidator from "../../common/hls/ts-validator";

class Engine extends _core_engine_base__WEBPACK_IMPORTED_MODULE_0__["default"] {

    constructor(p2pConfig = {}) {
        super(p2pConfig);
        if (!p2pConfig.validateSegment) {
            p2pConfig.validateSegment = function (segId, data) {
                // console.warn(`validate ${segId}`)
                // return TsValidator.validate(data)  // 目前不能确定加密ts能否通过验证
                return true
            }
        }
        this.config = Object.assign({}, _config__WEBPACK_IMPORTED_MODULE_3__["default"], p2pConfig);
        this.rangeTested = false;                         // 是否已经测试了range请求
        this.lastLevel = 0;
        this.multiBitrate = false;
    }

    setup() {
        let { token, channelId } = this.config;
        let channelIdMaker = (url) => {
            const streamParsed = url_toolkit__WEBPACK_IMPORTED_MODULE_1___default().parseURL(url);
            const streamId = streamParsed.netLoc.substr(2) + streamParsed.path.substring(0, streamParsed.path.lastIndexOf('.'));
            return `${streamId}`;
        };
        if (channelId) {
            channelIdMaker = this.makeChannelId(token, channelId);
        }
        const signalId = this.makeSignalId();
        // 浏览器信息
        const browserInfo = {
            ...this.commonBrowserInfo,
            tag: this.config.tag || undefined,
        };
        return {
            channelIdMaker,
            signalId,
            browserInfo
        }
    }

    setupElectron() {
        if (this.browserInfo.device === _core_utils_platform__WEBPACK_IMPORTED_MODULE_2__.device.PC_NATIVE) {
            this.browserInfo = {
                ...this.browserInfo,
                app: this.config.appName,
                bundle: this.config.appId,
            }
        }
    }

    getExtraForStats() {
        const json = super.getExtraForStats();
        if (!this.config.live && this.media) {
            json.pos = Math.round(this.media.currentTime);
        }
        if (this.multiBitrate && this.currentLevel !== this.lastLevel) {
            json.level = this.currentLevel + "";
            this.lastLevel = this.currentLevel;
        }
        return json;
    }

    getExtraForPeersRequest() {
        const json = super.getExtraForPeersRequest();
        if (this.multiBitrate) {
            json.level = this.currentLevel + "";
        }
        return json;
    }

    destroy() {
        super.destroy();
    }

    async initSegmentManager() {
        const { logger, config } = this;
        //实例化SegmentManager
        if (self.indexedDB && config.useDiskCache && !config.live) {
            const store = new _segment_store__WEBPACK_IMPORTED_MODULE_4__["default"](this, config);
            try {
                // throw new Error('test')
                await store.setupStore()
                this.bufMgr = store;
            } catch (e) {
                logger.warn(e);
                this.bufMgr = new _segment_cache__WEBPACK_IMPORTED_MODULE_5__["default"](this, config);
            }
        } else {
            this.bufMgr = new _segment_cache__WEBPACK_IMPORTED_MODULE_5__["default"](this, config);
        }
        // console.warn(`this.bufMgr.maxBufSize ${this.bufMgr.maxBufSize} name ${this.bufMgr.name}`)
        if (this.bufMgr.maxBufSize <= 0) {
            throw new Error('bufMgr state is invalid');
        }
    }

    getTagForVod() {
        const tag = `${(0,_core_utils_platform__WEBPACK_IMPORTED_MODULE_2__.getBrowser)()}${(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_6__.isHttps)() ? 's' : ''}`
        if (this.bufMgr) {
            return `${tag}_${this.bufMgr.name === 'SegmentStore' ? 'd' : 'm'}`
        }
        return tag
    }

    determineHttpLoadTime(fragments) {
        let httpLoadTime  = 2.5;
        if (fragments && fragments.length > 0) {
            const length = fragments.length;
            if (length <= 3) {
                httpLoadTime = 1.0;
            } else if (length <= 4) {
                httpLoadTime = 1.5;
            } else if (length <= 5) {
                httpLoadTime = 2.0;
            } else if (length <= 8) {
                httpLoadTime = 2.5;
            } else {
                httpLoadTime = 3.0;
            }
        }
        // console.warn(`real httpLoadTime ${httpLoadTime}`);
        return httpLoadTime;
    }

}


/***/ }),

/***/ "./src/hls-next/common/requesting-map.js":
/*!***********************************************!*\
  !*** ./src/hls-next/common/requesting-map.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RequestingMap)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);


class RequestingMap extends (events__WEBPACK_IMPORTED_MODULE_0___default()){

    constructor(eventName) {
        super();
        this.internalMap = new Map();                        // 正在p2p下载的SN   level-sn -> destroyer
        this.eventName = eventName;
    }

    has(sn, level) {
        return this.internalMap.has(this._generateId(sn, level))
    }

    set(sn, level, destroyer) {
        const id = this._generateId(sn, level);
        this.internalMap.set(id, destroyer);
        this.emit(`${this.eventName}${sn}-${level}`, destroyer);
    }

    get(sn, level) {
        return this.internalMap.get(this._generateId(sn, level));
    }

    delete(sn, level) {
        const id = this._generateId(sn, level);
        const destroyer = this.internalMap.get(id);
        if (destroyer) {
            destroyer.destroy();
            this.internalMap.delete(id);
            return true
        }
        return false
    }

    clear() {
        this.internalMap.clear()
        this.removeAllListeners();
    }

    _generateId(sn, level) {
        // if (level === undefined) {
        //     console.error(`RequestingMap level is undefined`)
        //     level = 0;
        // } else
        if (typeof level !== 'number') {
            // console.error(`RequestingMap level is not number`)
            level = Number(level);
        }
        return `${level}-${sn}`
    }
}


/***/ }),

/***/ "./src/hls-next/common/scheduler.js":
/*!******************************************!*\
  !*** ./src/hls-next/common/scheduler.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Scheduler)
/* harmony export */ });
/* harmony import */ var _bitset_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bitset-manager */ "./src/hls-next/common/bitset-manager.js");
/* harmony import */ var _bitcounts_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bitcounts-manager */ "./src/hls-next/common/bitcounts-manager.js");
/* harmony import */ var _core_scheduler_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/scheduler-base */ "./src/core/scheduler-base.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _requesting_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./requesting-map */ "./src/hls-next/common/requesting-map.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../events */ "./src/hls-next/events.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/hls-next/common/utils/tool-funs.js");
/* harmony import */ var _segment_state__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./segment-state */ "./src/hls-next/common/segment-state.js");
/* harmony import */ var _synthesizer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./synthesizer */ "./src/hls-next/common/synthesizer.js");
/* harmony import */ var _utils_error_code__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/error-code */ "./src/hls-next/common/utils/error-code.js");
/* harmony import */ var _coordinator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./coordinator */ "./src/hls-next/common/coordinator.js");












const MIN_P2P_LOAD_TIME = 1.5;                    // 保留给p2p下载的最小时间
const VOD_MAX_PREFETCH_COUNT = 150;               // VOD模式checkPeers遍历的次数
const Live_MAX_PREFETCH_COUNT = 10;               // LIVE模式checkPeers遍历的次数

class Scheduler extends _core_scheduler_base__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(engine, config) {
        super(engine, config);

        this.bitset = new _bitset_manager__WEBPACK_IMPORTED_MODULE_0__["default"](config.live || false);                  // 本节点的bitfield  sn
        this.bitCounts = new _bitcounts_manager__WEBPACK_IMPORTED_MODULE_1__["default"]();               // 记录peers的每个buffer的总和 index -> count
        this.requestingMap = new _requesting_map__WEBPACK_IMPORTED_MODULE_4__["default"](_events__WEBPACK_IMPORTED_MODULE_5__["default"].REQUESTING_MAP_HAVE);                        // 正在p2p下载的合成器   level-sn -> Synthesizer
        this.segmentBuilderMap = new _requesting_map__WEBPACK_IMPORTED_MODULE_4__["default"](_events__WEBPACK_IMPORTED_MODULE_5__["default"].BUILDER_MAP_HAVE);                // level-sn -> SegmentBuilder
        this.allowP2pLimit = config.httpLoadTime + MIN_P2P_LOAD_TIME;
        this.playlistInfo = new Map();           // url -> { seq, data }
        this.isUploader = false;
        this.isReceiver = false;
        this.targetPeers = {}                                  // { forwardPeer, reversePeer }
        this.mBufferedDuration = 0;                            // 防止重复计算
        this.sequential = true;
        this.httpTimeouts = 0;                                 // 记录syn的http补片请求超时次数
        this.httpRangeErrs = 0;
        this.coordinator = new _coordinator__WEBPACK_IMPORTED_MODULE_10__["default"]();

        // 传输控制
        this.loadingSegId = '';
        this.loadingSN = 0;
        this.currPlaySN = 0;
        this.currLostSN = -1;
        this.nextLostSN = -1;

        if (!this.config.live) {
            this.maxPrefetchCount = VOD_MAX_PREFETCH_COUNT;
            // 点播模式下开启定时器
            this.startCheckPeersTimer();
        } else {
            this.maxPrefetchCount = Live_MAX_PREFETCH_COUNT;
        }
    }

    get httpRangeSupported() {
        return this.config.httpRangeSupported
    }

    handshakePeer(dc) {
        this._setupDC(dc);
        dc.sendMetaData(this.bitset.allArray(), true, this.peersNum, this.isMobileNet)            //向peer发送bitfield
    }

    _receiveDCHave(sn, level, segId, peer) {
        if (!this.bitset.has(sn, level)) {              //防止重复下载
            this.bitCounts.incre(sn, level);
        }
        if (peer.isAvailableUrgently) {
            this.emit(_events__WEBPACK_IMPORTED_MODULE_5__["default"].SCH_DCHAVE, segId);
        }
    }

    _setupDC(dc) {
        super._setupDC(dc);
        dc.on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_HAVE, msg => {
            if (dc.bitset && msg.sn >= 0) {
                // logger.info('DC_HAVE ' + msg.sn);
                const { sn, level, complete, seg_id: segId } = msg;
                const state = complete ? _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE : _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_FORWARD
                dc.bitset.add(sn, level, segId, state);
                this._receiveDCHave(sn, level, segId, dc);
                if (dc.isAvailableUrgently) {
                    this._handleDCHave(dc, sn, level, segId, state);
                }
            }
        })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_HAVE_REVERSE, msg => {
                if (dc.bitset && msg.sn >= 0) {
                    // logger.info('DC_HAVE ' + msg.sn);
                    const { sn, level, seg_id: segId } = msg;
                    if (!dc.bitset.hasCompleteOr(sn, level, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE)) {
                        dc.bitset.add(sn, level, segId, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE);
                    }
                    this._receiveDCHave(sn, level, segId, dc);
                    if (dc.isAvailableUrgently) {
                        this._handleDCHave(dc, sn, level, segId, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE);
                    }
                }
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_LOST, msg => {
                if (!dc.bitset) return;
                const { sn, level } = msg;
                if (dc.bitset.has(sn, level)) {
                    dc.bitset.delete(sn, level);
                    this.bitCounts.decre(sn, level);
                }
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_PIECE, msg => {
                if (msg.ext && msg.ext.incompletes >= 7) return;            // 防止传输链过长
                this.notifyAllPeers(msg.sn, msg.level, msg.seg_id, msg.reverse ? _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE : _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_FORWARD);
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_PIECE_CANCEL, msg => {
                const { sn, level } = msg;
                // console.warn(`DC_PIECE_CANCEL ${sn}`)
                const synthesizer = this.requestingMap.get(sn, level);
                if (synthesizer) {
                    synthesizer.removeStreamListener(dc.remotePeerId);
                    return
                }
                const builder = this.segmentBuilderMap.get(sn, level);
                if (builder) {
                    builder.removeStreamListener(dc.remotePeerId);
                }
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_PIECE_NOT_FOUND, msg => {
                const { sn, level } = msg;
                dc.bitset.delete(sn, level);
                this.bitCounts.decre(sn, level);
                dc.checkIfNeedChoke(true);
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_5__["default"].DC_REQUEST, async msg => {
                // console.warn(`DC_REQUEST from ${dc.remotePeerId} msg ${JSON.stringify(msg)}`);
                const { logger } = this;
                const { sn, level, reverse } = msg;
                this.isUploader = true;

                let segId = msg.seg_id;
                if (!segId) {                                    //请求sn的request
                    segId = await this.bufMgr.getSegIdBySN(sn);
                }
                // console.warn(`msg.sn ${sn} requestingMap.has ${this.requestingMap.has(sn)}`);
                const synthesizer = this.requestingMap.get(sn, level);
                let listenUpStream = false;
                if (synthesizer && synthesizer.isDownloading()) {
                    listenUpStream = true;
                }
                const seg = await this.bufMgr.getSegById(segId);
                if (seg) {
                // if (false) {
                    // seg已经完成下载
                    logger.info(`found seg from bufMgr`);
                    if (seg.level === level) {
                        dc.sendBuffer(seg.sn, seg.segId, seg.data, {from: 'Cache', level: seg.level, reverse});
                    } else {
                        dc.sendPieceNotFound(sn, segId, { level })
                    }
                } else if (listenUpStream) {
                    // synthesizer已经下载了一部分
                    logger.info(`syn had ${synthesizer.loadedPackets()} packets, wait remain from upstream ${synthesizer.getFromPeerId()}`);
                    const pieceMsg = {
                        ...synthesizer.pieceMsg,
                        reverse,
                    };
                    const bufferList = reverse ? synthesizer.reverseBufList : synthesizer.forwardBufList;
                    dc.sendPartialBuffer(pieceMsg, bufferList,
                        {from: synthesizer.isFull() ? 'WaitPartialDouble' : 'WaitPartialSingle', incompletes: 1});
                    if (bufferList.length < pieceMsg.attachments) {
                        addStreamListener(synthesizer, dc, reverse);
                    } else {
                        dc.uploading = false;
                    }
                } else if (!reverse) {
                    const builder = this.segmentBuilderMap.get(sn, level);
                    if (builder) {
                        logger.info(`peer request ${sn} wait from builder, sent ${builder.bufferList.length}`);
                        streamFromBuilder(builder, dc);
                    } else if (sn >= this.loadingSN) {
                        let onBuilder;
                        const onBMLoaded = seg => {
                            this.segmentBuilderMap.off(`${_events__WEBPACK_IMPORTED_MODULE_5__["default"].BUILDER_MAP_HAVE}${sn}-${level}`, onBuilder);
                            if (seg && seg.level === level) {
                                logger.info(`peer request notify seg ${seg.sn}`);
                                dc.sendBuffer(seg.sn, seg.segId, seg.data, {from: 'NotifySegment', level: seg.level, reverse});
                            } else {
                                dc.sendPieceNotFound(sn, segId, { level });
                            }
                        }
                        onBuilder = builder => {
                            this.bufMgr.off(`${_events__WEBPACK_IMPORTED_MODULE_5__["default"].BM_ADDED_SN_}${sn}`, onBMLoaded);
                            streamFromBuilder(builder, dc);
                        }
                        logger.info(`peer request ${sn} wait from fragLoader`);
                        this.segmentBuilderMap.once(`${_events__WEBPACK_IMPORTED_MODULE_5__["default"].BUILDER_MAP_HAVE}${sn}-${level}`, onBuilder);
                        this.bufMgr.once(`${_events__WEBPACK_IMPORTED_MODULE_5__["default"].BM_ADDED_SN_}${sn}`, onBMLoaded);
                    } else {
                        dc.sendPieceNotFound(sn, segId, { level });
                    }
                } else {
                    dc.sendPieceNotFound(sn, segId, { level });
                }
                function streamFromBuilder(target, self) {
                    self.sendPartialBuffer(target.pieceMsg, target.bufferList, {from: target.source, incompletes: 1});
                    if (target.bufferList.length < target.pieceMsg.attachments) {
                        addStreamListener(target, self, false);
                    } else {
                        self.uploading = false;
                    }
                }
                function addStreamListener(target, self, reverse) {
                    target.addStreamListener(reverse, self.remotePeerId, (sn, segId, aborted, data, finished) => {
                        if (aborted) {
                            self.sendMsgPieceAbort(data);
                        } else {
                            // console.warn(`notify dc ${dc.remotePeerId} send ${data.byteLength}`);
                            self.send(data);
                        }
                        if (finished) {
                            // console.warn(`dc_request addStreamListener finished`)
                            self.uploading = false;
                        }
                    })
                }
            })
    }

    handleMetaData(dc, msg) {
        // console.warn(`bt DC_METADATA`);
        if (!msg.field) return;
        dc.bitset = new _bitset_manager__WEBPACK_IMPORTED_MODULE_0__["default"](this.config.live, msg.field)
        for (let key in msg.field) {
            const level = Number(key);
            if (level < 0) continue
            const array = msg.field[level];
            array.forEach(value => {
                if (!this.bitset.has(value, level)) {              //防止重复下载
                    this.bitCounts.incre(value, level)
                }
            });
        }
        this.addPeer(dc);                               //只有获取bitfield之后才加入peerMap
        if (this.downloadOnly) {
            // console.warn("choke peer");
            this.chokePeerRequest(dc);                  // 不分享
        }
    }

    peersHas(sn, level) {
        // console.warn(`bitCounts.has ${sn} ${this.bitCounts.has(sn, level)}`)
        return this.bitCounts.has(sn, level);
    }

    // override
    deletePeer(dc) {
        if (this.peerManager.hasPeer(dc.remotePeerId) && dc.bitset) {
            const field = dc.bitset.allArray();
            for (let key in field) {
                const level = Number(key);
                const array = field[level];
                if (array) {
                    array.forEach(value => {
                        this.bitCounts.decre(value, level)
                    });
                }
            }
        }
        this.cleanRequestingMap(dc.remotePeerId);
        super.deletePeer(dc);
    }

    hasAndSetTargetPeer(sn, level, segId, bufferedDuration) {
        // console.warn(`hasAndSetTargetPeer ${sn} ${level} ${segId}`)
        const { logger, config } = this;
        if (this.waitForPeer) {
            this.mBufferedDuration = bufferedDuration = config.waitForPeerTimeout + config.httpLoadTime
        }
        let remainLoadTime = (bufferedDuration - config.httpLoadTime)*1000;
        const allowP2pLimit = config.httpLoadTime + MIN_P2P_LOAD_TIME;
        logger.info(`bufferedDuration ${bufferedDuration * 1000} remainLoadTime ${remainLoadTime}`);
        // 如果buffer time小于allowP2pLimit，则用http请求
        if (bufferedDuration <= allowP2pLimit) {
            return false;
        }
        // 如果正在请求此sn
        if (this.requestingMap.has(sn, level)) {
            const synthesizer = this.requestingMap.get(sn, level);
            if (!synthesizer) return this._searchAvailablePeers(sn, level, segId);

            // 检查segId
            const synSegId = synthesizer.segId;
            if (synSegId && synSegId !== segId) {
                logger.warn(`syn segId ${synSegId} not match ${segId}`);
                this.requestingMap.delete(sn, level);
                return this._searchAvailablePeers(sn, level, segId);
            }

            if (!synthesizer.shouldWaitForRemain(remainLoadTime)) {
                logger.warn(`syn prefetch timeout at ${sn}`);
                if (synthesizer.isFull()) {
                    // logger.warn(`syn is full`);
                    return false
                }
                const peers = this.peerManager.getPeersOrderByWeight();
                const completeGroup = (0,_segment_state__WEBPACK_IMPORTED_MODULE_7__.findPeersWithState)(peers, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE, sn, level, segId);
                let forwardGroup = (0,_segment_state__WEBPACK_IMPORTED_MODULE_7__.findPeersWithState)(peers, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_FORWARD, sn, level, segId);
                let reverseGroup = (0,_segment_state__WEBPACK_IMPORTED_MODULE_7__.findPeersWithState)(peers, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE, sn, level, segId);
                if (synthesizer.hasReversePeer()) {
                    forwardGroup = completeGroup.concat(forwardGroup);
                    if (forwardGroup.length > 0) {
                        this.targetPeers.forwardPeer = forwardGroup[0];
                        return true
                    }
                } else if (synthesizer.hasForwardPeer()) {
                    reverseGroup = completeGroup.concat(reverseGroup);
                    if (reverseGroup.length > 0) {
                        this.targetPeers.reversePeer = reverseGroup[0];
                        return true
                    }
                } else if (completeGroup.length > 0) {
                    if (synthesizer.hasForwardBuffer()) {
                        this.targetPeers.reversePeer = completeGroup[0];
                    } else {
                        this.targetPeers.forwardPeer = completeGroup[0];
                    }
                    return true
                } else {
                    let flag = false
                    if (forwardGroup.length > 0) {
                        this.targetPeers.forwardPeer = forwardGroup[0];
                        flag = true;
                    }
                    if (reverseGroup.length > 0) {
                        this.targetPeers.reversePeer = reverseGroup[0];
                        flag = true;
                    }
                    if (flag) return true
                }
                return !synthesizer.isEmpty() && config.httpRangeSupported && (bufferedDuration > allowP2pLimit + 1.0)       // 如果支持range则继续等待
            }
            logger.info(`prefetch ${sn} wait for remain`);
            return true
        }
        return this._searchAvailablePeers(sn, level, segId);
    }

    _searchAvailablePeers(sn, level, segId) {
        // console.warn(`this.peersHas ${sn} ${this.peersHas(sn, level)}`)
        if (!(this.hasIdlePeers && this.peersHas(sn, level))) {
            return false;
        }
        const peers = this.peerManager.getPeersOrderByWeight();
        // this.logger.info(`searchAvailablePeers ${peers.length}`);
        const [forwardPeer, reversePeer] = (0,_segment_state__WEBPACK_IMPORTED_MODULE_7__.getBestPairForDownload)(peers, sn, level, segId);
        // console.warn([forwardPeer, reversePeer])
        this.targetPeers = {
            forwardPeer,
            reversePeer,
        }
        return [forwardPeer, reversePeer].some(peer => !!peer)
    }

    reportTraffic(http, p2p, speed) {
        const { fetcher } = this.engine;
        if (!fetcher) {
            // this.logger.error("DC report failed");
            return;
        }
        if (http > 0) fetcher.reportFlow(http);
        if (p2p > 0) fetcher.reportDCTraffic(p2p, speed);
    }

    notifyAllPeers(sn, level, segId, state = _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE) {
        // console.warn(`notifyAllPeers ${state}`);
        if (!segId) {
            this.logger.error("segId is required");
            return
        }
        if (this.downloadOnly) {
            return
        }
        const { live } = this.config;
        if (this.bitset.has(sn, level, state)) return                      // 防止重复广播
        const notifyId = (0,_segment_state__WEBPACK_IMPORTED_MODULE_7__.generateStateId)(sn, level, state);
        let complete;
        if (state !== _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE) {
            complete = state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE;
        }
        const synthesizer = this.requestingMap.get(sn, level);
        for (let peer of this.getPeers()) {
            if (synthesizer && synthesizer.hasPeer(peer)) {
                continue
            }
            if (!peer.notifySet.has(notifyId) && !peer.bitset.hasCompleteOr(sn, level, state) && !peer.uploading) {              // 对方没有并且没有notify过时才发送
                peer.sendMsgHave(sn, segId, { level, reverse: state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE, complete });
                peer.notifySet.add(notifyId);
                if (live) {
                    (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.trimSet)(peer.notifySet, 20);
                }
            }
        }
    }

    checkPeers() {
        // return;
        // const size = this.requestingMap.internalMap.size;
        // if (size >= 5) {
        //     this.logger.error(`requestingMap size ${this.requestingMap.internalMap.size}`)
        // }
        // if (this.waitForPeer) return;
        if (!this.hasPeers) {
            return;
        }
        const { logger, config, engine } = this;
        const isLive = config.live;
        const { currentLevel } = engine;
        logger.info(`currentLevel ${currentLevel}`);
        if (this.bitCounts.size(currentLevel) === 0) {
            return;
        }           // 已经下载完了

        // console.warn(`this.nextLostSN ${this.nextLostSN} this.currPlaySN ${this.currPlaySN}`)
        if (!isLive && this.nextLostSN >= 0 && this.nextLostSN >= this.currPlaySN - 10) {
            return;
        }
        if (this.mBufferedDuration < this.allowP2pLimit && (this.mBufferedDuration !== 0 || this.isHlsjs)) {
            logger.info(`low buffer time ${this.mBufferedDuration}, skip prefetch`);
            return;
        }
        const availablePeers = this.peerManager.getPeersOrderByWeight();

        if (availablePeers.length === 0) return;
        const requestedPeers = [];
        let { prefetchNum, endSN, startSN } = config;
        if (isLive) prefetchNum = 1;
        let prefetchCount = 0;
        let offset =  this.loadingSN + 1;
        if (!isLive) {
            // 排除endSN比offset小的peer，然后获取所有peer最小的startSN
            // console.warn(availablePeers.map(peer => peer.startSN));
            if (this.loadingSN >= endSN && !this.bufMgr.overflowed) {
                // 点播如果缓存没满，继续请求没有下载的sn
                offset = startSN;
            } else {
                const minStartSN = Math.min(...availablePeers
                    .filter(peer => peer.endSN >= offset)
                    .map(peer => peer ? peer.startSN : Infinity));
                // console.warn(`minStartSN ${minStartSN}`);
                if (!isFinite(minStartSN)) return;                   // 没有可以请求的SN
                // console.warn(`after minStartSN ${minStartSN}`);
                // if (this.currLostSN >= 0 && offset < minStartSN-30) return;
                if (offset < minStartSN) {
                    offset = minStartSN;
                }
            }

            // console.warn(`offset ${offset}`)
        }
        // console.warn(`overflowed ${this.bufMgr.overflowed} loadingSN ${this.loadingSN} endSN ${endSN} bitCounts ${this.bitCounts.size}`)
        while (requestedPeers.length < prefetchNum && requestedPeers.length < availablePeers.length && prefetchCount < this.maxPrefetchCount) {
            if (!isLive && offset > endSN) {
                return;
            } else if (isLive && offset > this.loadingSN + 2) {        // 直播一次最多预加载2个
                return;
            }
            if (this.bitset.has(offset, currentLevel)) {
                offset ++;
                continue;
            }
            // console.warn(`this.maxPrefetchCount ${this.maxPrefetchCount}`);
            if (offset !== this.loadingSN && this.bitCounts.has(offset, currentLevel) && !this.requestingMap.has(offset, currentLevel)) {                  //如果这个块没有缓存并且peers有并且没有在请求
                for (let peer of availablePeers) {                           //找到拥有这个块并且空闲的peer
                    if (!requestedPeers.includes(peer) && peer.bitset.has(offset, currentLevel)) {
                        const state = peer.bitset.getState(offset, currentLevel);
                        let reverse;
                        if (state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE) {
                            reverse = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.randomNum)(0, 1) === 0;
                        } else {
                            reverse = state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE
                        }
                        requestedPeers.push(peer);
                        // 获取segId
                        const segId = peer.bitset.getSegId(offset, currentLevel)  // 可能是undefined
                        const synthesizer = new _synthesizer__WEBPACK_IMPORTED_MODULE_8__["default"](this.coordinator, this.logger, offset, currentLevel, segId, config.httpRangeSupported);
                        this._setupSynthesizer(synthesizer);
                        if (reverse) {
                            synthesizer.setReversePeer(peer);
                        } else {
                            synthesizer.setForwardPeer(peer);
                        }
                        this.requestingMap.set(offset, currentLevel, synthesizer);        // 标记正在请求
                        peer.requestDataBySN(offset, false, { level: currentLevel, reverse });
                        logger.info(`request prefetch ${offset} level ${currentLevel} from peer ${peer.remotePeerId} downloadNum ${peer.downloadNum} reverse ${reverse}`);
                        break;
                    }
                }
            }
            // logger.info(`prefetchCount ${prefetchCount} offset ${offset} requestedPeers ${requestedPeers.length}`);
            prefetchCount ++;             // 遍历的segment数量
            offset ++;
        }
        this.loadedPeerNum = requestedPeers.length;
    }

    // override
    onBufferManagerLost(sn, segId, next, level) {
        // this.logger.debug(`onBufferManagerLost`);
        this.currLostSN = sn;
        if (next) this.nextLostSN = next;
        // 删除内存对应的SN
        this.bitset.delete(sn, level);
        this.bitCounts.delete(sn, level);
    }

    cleanRequestingMap(peerIdToDelete) {
        const peer = this.peerManager.getPeer(peerIdToDelete);
        if (!peer) return
        for (let [id, synthesizer] of this.requestingMap.internalMap) {
            const arr = id.split('-');
            const sn = Number(arr[1]);
            const level = Number(arr[0]);
            if (synthesizer.hasPeerId(peerIdToDelete)) {
                this.logger.info(`delete ${peerIdToDelete} in synthesizer`);
                synthesizer.deletePeer(peer)
                this.bitCounts.decre(sn, level);
                peer.bitset.delete(sn, level);
            }
        }
    }

    shouldWaitForNextSeg() {
        let flag;
        if (this.isUploader) {
            flag = false;
        } else {
            if (this.isReceiver) {
                flag = true;
            } else {
                // 都不是的话80%概率等
                flag = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.randomNum)(0, 100) > 20;
            }
        }
        this.isReceiver = this.isUploader = false;
        return flag;
    }

    updateLoaded(sn, level, segId) {
        if (this.bitset.hasCompleteOr(sn, level)) return;
        this.bitset.add(sn, level, segId, _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE);                      //在bitset中记录

        this.bitCounts.delete(sn, level)             //在bitCounts清除，防止重复下载
        // const { logger } = this;
        // logger.debug("updateLoadedSN " + sn);

    }

    // 广播playlist
    broadcastPlaylist(url, data) {
        if (!this.config.live) return;
        const seq = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getMaxSequence)(data);
        if (!this.isMobileNet) {
            for (let peer of this.getPeers()) {
                peer.sendMsgPlaylist(url, data, seq);
            }
        }
        // console.warn(`broadcastPlaylist seq ${seq}`)
        this.playlistInfo.set(url, {
            seq,
            data
        });
    }

    getPlaylistFromPeer(url) {
        if (!this.config.live) return null;
        const { seq, data } = this.playlistInfo.get(url);
        // console.warn(`getPlaylistFromPeer seq ${seq} loadingSN ${this.loadingSN}`);
        for (let peer of this.getPeers()) {
            const playlist = peer.getLatestPlaylist(url, seq);
            if (playlist) {
                // console.warn(`getPlaylistFromPeer url ${url} last ${seq} curr ${playlist.seq}`);
                this.playlistInfo.set(url, playlist);
                return playlist
            }
        }
        return null
    }

    // 可供p2p下载的时间
    getBufferedDuration() {
        let { media, currentSrc } = this.engine;
        // console.warn(`getBufferedDuration ${media && media.currentTime} currentSrc ${currentSrc}`)
        if (!media || (media.src !== currentSrc && media.currentTime === 0)) {
            this.logger.info(`try get video element`);
            media = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_6__.tryGetMediaElement)(this.config.mediaElem, currentSrc);
            if (!media) {
                return 5.0;
            }
            this.engine.media = media;
        }
        // console.warn(`media.src ${media && media.src}`)
        let duration = 0;
        let currentTime = media.currentTime;
        let buffered = media.buffered;
        for (let i=buffered.length-1; i>=0; i--) {
            // console.warn(`${i} start ${buffered.start(i)} end ${buffered.end(i)}`);
            if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
                duration = buffered.end(i) - currentTime;
                break;
            }
        }
        // this.logger.warn(`bufferedDuration ${duration}`);
        this.mBufferedDuration = duration;
        return duration > 0 ? duration : 0;
    }

    destroy() {
        super.destroy();
        this.requestingMap.clear();
        this.segmentBuilderMap.clear();
    }

    _handleSynOutput(http) {
        if (http > 0) {
            // 发生了range请求
            this.httpTimeouts ++;
        } else {
            if (this.httpTimeouts > 0) this.httpTimeouts --;
        }
    }

    _notifySynthesizer(peer, segId, sn, level, state, urgent = true) {
        const { logger } = this;
        const synthesizer = this.requestingMap.get(sn, level);
        if (!synthesizer) return
        // 检查segId
        const synSegId = synthesizer.segId;
        if (segId && synSegId && segId !== synSegId) {
            logger.warn(`notifySynthesizer segId ${segId} not match ${synSegId}`);
            return
        }
        if (synthesizer.isFull()) return
        if (synthesizer.isAlmostDeadline()) {
            logger.info(`almost deadline, ignored`);
            return
        }
        if (synthesizer.isEmpty()) {
            if (synthesizer.hasForwardBuffer() && reversible()) {
                synthesizer.setReversePeer(peer);
                request(true, urgent);
            } else if (synthesizer.hasReverseBuffer() && forwardable()) {
                synthesizer.setForwardPeer(peer);
                request(false, urgent);
            }
        } else if (!synthesizer.hasForwardPeer() && forwardable()) {
            synthesizer.setForwardPeer(peer);
            request(false, urgent);
        } else if (!synthesizer.hasReversePeer() && reversible()) {
            synthesizer.setReversePeer(peer);
            request(true, urgent);
        }
        function request(reverse, urgent) {
            if (urgent) {
                peer.requestDataById(segId, sn, true, { level, reverse });
            } else {
                logger.info(`notify syn prefetch ${sn}`);
                peer.requestDataBySN(sn, false, { level , reverse });
            }
        }
        function forwardable() {
            return state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_FORWARD || state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE
        }
        function reversible() {
            return state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_REVERSE || state === _segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.COMPLETE
        }
    }

    // override
    _setupEngine() {}

    // override
    getStatsForPeer() {
        const { currentLevel, media } = this.engine;
        const stats = {
            level: currentLevel,
        }
        if (media && !this.config.live) {
            const { currentTime } = media;
            stats.pos = Math.round(currentTime)
        }
        return stats
    }

    _handleSynError(code) {
        switch (code) {
            case _utils_error_code__WEBPACK_IMPORTED_MODULE_9__["default"].ERROR_SYN_RANGE_REQUEST:
                this.logger.warn(`ERROR_SYN_RANGE_REQUEST`)
                this.httpRangeErrs ++;
                break
            case _utils_error_code__WEBPACK_IMPORTED_MODULE_9__["default"].ERROR_SYN_HTTP_TIMEOUT:
                this.logger.warn(`ERROR_SYN_HTTP_TIMEOUT`)
                this.httpTimeouts += 3;
                break
        }
        if (this.httpRangeErrs >= 5) {
            if (this.config.httpLoadTime <= 4.5) this.config.httpLoadTime += 0.5;
            this.httpRangeErrs = 0;
        }
    }

}


/***/ }),

/***/ "./src/hls-next/common/segment-cache.js":
/*!**********************************************!*\
  !*** ./src/hls-next/common/segment-cache.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/events */ "./src/core/events.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_utils_platform__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");





const LIVE_MAX_BUFFER_SIZE = 1024*1024*30;          // 直播模式的最大缓存大小
// const LIVE_MAX_BUFFER_SIZE = 1024*1024*15;        // 直播模式的最大缓存大小       test

const MIN_SEGMENTS_KEEP = 5;                    // 最少保留多少个segment

class SegmentCache extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(engine, config) {
        super();
        this.name = 'SegmentCache';
        this.logger = config.logger;
        this.logger.info(`use SegmentCache`);
        const device = engine.browserInfo.device;
        this.maxBufSize = device === (_core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default().device.PC_WEB) || device === (_core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default().device.PC_NATIVE) ?
            config.memoryCacheLimit.pc
            : config.memoryCacheLimit.mobile;
        // console.warn(`this.maxBufSize ${this.maxBufSize}`)
        if (config.live) {
            this.maxBufSize = LIVE_MAX_BUFFER_SIZE;
        } else {
            if (this.maxBufSize === 0) {
                throw new Error('cannot use SegmentCache');
            }
            const available = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getAvailableMemory)();
            // console.warn(`available ${available} maxBufSize ${this.maxBufSize}`)
            if (available >= 0 && available < this.maxBufSize){
                this.maxBufSize = available - 30*1024*1024;
            }
        }
        /* segment
        sn: number
        segId: string
        data: Buffer
        size: string
        fromPeerId: string
         */
        this._segPool = new Map();             //存放seg的Map            segId (sn) -> [segment]
        this._currBufSize = 0;                 //目前的buffer总大小
        this.id2Sn = new Map();                //以segId查找sn             segId -> sn
        this.overflowed = false;               //缓存是否已满
        this.loadingSN = 0;
    }

    get currBufSize() {
        return this._currBufSize;
    }

    hasSegOfId(segId) {
        return new Promise((resolve, reject) => {
            const sn = this.id2Sn.get(segId);
            if (!this._segPool.has(sn)) {
                resolve(false)
                return
            }
            resolve(this._segPool.get(sn).some(seg => seg.segId === segId))
        })
    }

    getSegById(segId) {
        const sn = this.id2Sn.get(segId);
        return new Promise((resolve, reject) => {
            if (!this._segPool.has(sn)) {
                resolve(null)
                return
            }
            const segs = this._segPool.get(sn);
            // for (let seg of segs) {
            //     if (seg.segId === segId) {
            //         resolve(seg)
            //         return
            //     }
            // }
            resolve(segs.find(seg => seg.segId === segId))
        })

    }

    getSegIdBySN(sn) {
        return new Promise((resolve, reject) => {
            if (this._segPool.has(sn)) {
                const segs = this._segPool.get(sn)
                resolve(segs[0].segId)                 // 返回数组第一个segId
                return
            }
            resolve(null)
        })

    }

    _calSegPoolSize() {
        let totalSize = 0;
        this._segPool.forEach(segs => {
            segs.forEach(seg => {
                totalSize += seg.size;
            })
        });
        return totalSize;
    }

    putSeg(segment) {
        if (this._currBufSize >= this.maxBufSize*1.5) {
            this._currBufSize = this._calSegPoolSize();
            if (this._currBufSize >= this.maxBufSize*1.5) {
                this.clear();
                this.overflowed = false;
            }
        }
        if (!(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.isArrayBuffer)(segment.data)) {
            this.logger.error(`putSeg ${segment.sn} is not buffer`);
            return
        }
        this._addSeg(segment);
    }

    _addSeg(seg) {
        const { logger } = this;
        const { segId, sn, size } = seg;
        this.id2Sn.set(segId, sn);
        if (!this._segPool.has(sn)) {
            this._segPool.set(sn, [seg])
        } else {
            const segs = this._segPool.get(sn)
            segs.push(seg)
        }
        this._currBufSize += parseInt(size);

        const poolSize = this._segPool.size;
        // logger.info(`segment pool add seg ${sn} size ${size} currBufSize ${this._currBufSize} cacheLimit ${this.maxBufSize} poolSize ${poolSize}`);

        this.emit(`${_core_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_ADDED_SN_}${seg.sn}`, seg);
        this.emit(_core_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_SEG_ADDED, seg);

        if (this._currBufSize < this.maxBufSize || poolSize <= MIN_SEGMENTS_KEEP) return;

        // console.warn(Array.from(this._segPool.keys()).sort((a, b) => a-b));
        const sorted = Array.from(this._segPool.keys()).sort((a, b) => a-b);  // 从小到大排序
        let count = 0;
        do {
            if (count++ > 10) {
                console.error('too much loops in SegmentCache');
                break
            }
            // 释放溢出的buffer
            const oldestSN = sorted.shift();
            if (oldestSN === undefined) {
                logger.error(`lastSN not found`);
                continue;
            }
            const nextSN = sorted[0];
            const oldestSegs = this._segPool.get(oldestSN);
            if (!oldestSegs) {
                logger.error(`lastSeg not found`);
                continue;
            }
            let size = 0;
            oldestSegs.forEach(oldestSeg => {
                size += oldestSeg.size;
            })
            this._currBufSize -= parseInt(size);
            this._segPool.delete(oldestSN);
            oldestSegs.forEach(oldestSeg => {
                this.id2Sn.delete(oldestSeg.segId);
                // logger.info(`pop seg ${oldestSeg.segId} size ${oldestSeg.size}`);
                this.emit(_core_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_LOST, {sn: oldestSN, segId: oldestSeg.segId, next: nextSN, level: oldestSeg.level});
            })
            logger.info(`pop sn ${oldestSN} size ${size} currBufSize ${this._currBufSize}`);
            if (!this.overflowed) this.overflowed = true;
            // this.emit(Events.BM_LOST, oldestSN, oldestSeg.segId, nextSN);

        } while (this._currBufSize >= this.maxBufSize && this._segPool.size > MIN_SEGMENTS_KEEP)
    }

    clear() {
        this.logger.warn(`clear segment cache`);
        this._segPool.clear();
        this.id2Sn.clear();
        this._currBufSize = 0;
    }

    destroy() {
        this.clear();
        this.removeAllListeners();
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SegmentCache);


/***/ }),

/***/ "./src/hls-next/common/segment-state.js":
/*!**********************************************!*\
  !*** ./src/hls-next/common/segment-state.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SegmentState": () => (/* binding */ SegmentState),
/* harmony export */   "findPeersWithState": () => (/* binding */ findPeersWithState),
/* harmony export */   "generateStateId": () => (/* binding */ generateStateId),
/* harmony export */   "getBestPairForDownload": () => (/* binding */ getBestPairForDownload)
/* harmony export */ });
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");


const SegmentState = {
    ANY: 0,
    COMPLETE: 1,
    PARTIAL_FORWARD: 2,
    PARTIAL_REVERSE: 3,
}

const generateStateId = (sn, level, state) => {
    return `${sn}-${level}-${state}`
}

/*
    1. 优先寻找完整下载的peer，如果有2个直接返回
    2. 如果只有一个完整的，寻找是否有正向或者反向的，配对后返回；没有的话这个完整的给正向后返回
    3. 如果没有一个完整的，分别寻找正向和反向，配对后返回
 */
const getBestPairForDownload = (peers, sn, level, segId) => {
    const completeGroup = findPeersWithState(peers, SegmentState.COMPLETE, sn, level, segId);
    if (completeGroup.length >= 2) {
        return [completeGroup[0], completeGroup[1]]
    }
    if (completeGroup.length === 1) {
        const forwardGroup = findPeersWithState(peers, SegmentState.PARTIAL_FORWARD, sn, level, segId);
        if (forwardGroup.length >= 1) {
            return [forwardGroup[0], completeGroup[0]]
        }
        const reverseGroup = findPeersWithState(peers, SegmentState.PARTIAL_REVERSE, sn, level, segId);
        if (reverseGroup.length >= 1) {
            return [completeGroup[0], reverseGroup[0]]
        }
        return (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_0__.randomNum)(0, 1) === 0 ? [null, completeGroup[0]] : [completeGroup[0], null]
        // test
        // return 1 === 0 ? [null, completeGroup[0]] : [completeGroup[0], null]
    }
    const forwardGroup = findPeersWithState(peers, SegmentState.PARTIAL_FORWARD, sn, level, segId);
    if (forwardGroup.length >= 1) {
        return [forwardGroup[0], null]
    }
    const reverseGroup = findPeersWithState(peers, SegmentState.PARTIAL_REVERSE, sn, level, segId);
    if (reverseGroup.length >= 1) {
        return [null, reverseGroup[0]]
    }
    return [null, null]
}

const findPeersWithState = (peers, state, sn, level, segId) => {
    return peers.filter(peer => peer.bitset.hasWithId(sn, level, segId, state))
}




/***/ }),

/***/ "./src/hls-next/common/segment-store.js":
/*!**********************************************!*\
  !*** ./src/hls-next/common/segment-store.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/events */ "./src/core/events.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_utils_platform__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/idb-keyval/index */ "./src/common/idb-keyval/index.js");
/* harmony import */ var _core_segment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/segment */ "./src/core/segment.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");







const KEY_METADATA_SIZE = 'size';

class SegmentStore extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(engine, config) {
        super();
        this.name = 'SegmentStore';
        this.logger = config.logger;
        this.logger.info(`use SegmentStore`);
        this.channel = engine.channel;
        const device = engine.browserInfo.device;
        this.isPC = device === (_core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default().device.PC_WEB) || device === (_core_utils_platform__WEBPACK_IMPORTED_MODULE_2___default().device.PC_NATIVE)
        // 磁盘存储限制
        this.maxBufSize = this.isPC ? config.diskCacheLimit.pc : config.diskCacheLimit.mobile;
        /* segment
        sn: number
        segId: string
        data: Buffer
        size: string
        fromPeerId: string
         */
        // this.id2Sn = new Map();                //以segId查找sn             segId -> sn
        this.overflowed = false;               //缓存是否已满
        this.loadingSN = 0;
    }

    async setupStore() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate(),
                // calculate remaining storage in MB
                available = Math.floor((estimate.quota - estimate.usage));
            if (available < this.maxBufSize) {
                this.maxBufSize = available - 100*1024*1024;
            }
            // console.warn(`${ available } Byte remaining this.maxBufSize ${this.maxBufSize}`);
        }
        return new Promise(async (resolve, reject) => {
            if ((this.isPC && this.maxBufSize < 400*1024*1024) || (!this.isPC && this.maxBufSize < 100*1024*1024)) {
                reject(`disk storage not enough`)
                return
            }
            // const db = await diskCache.getStore(this.channel);
            const storeNames = ['segments', 'id2Sn', 'metadata'];
            let storeFuns;
            try {
                storeFuns = _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.createStores(this.channel, storeNames);
            } catch (e) {
                reject(e)
                return
            }
            this.segmentsStore = storeFuns[0];
            this.id2SnStore = storeFuns[1];
            this.metaStore = storeFuns[2];
            const timer = setTimeout(() => {
                reject('setupStore timeout')
            }, 500);
            this._initMetaStore().then(() => {
                clearTimeout(timer);
                resolve()
            }).catch(e => {
                reject(e)
            });
        })
    }

    _initMetaStore() {
        this.logger.info('init MetaStore size');
        return _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.set(KEY_METADATA_SIZE, 0, this.metaStore);
    }

    currBufSize() {
        return _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(KEY_METADATA_SIZE, this.metaStore);
    }

    async hasSegOfId(segId) {
        if (!segId) return Promise.resolve(false);
        const sn = await _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(segId, this.id2SnStore);
        return new Promise((resolve, reject) => {
            if (sn === undefined) {
                resolve(false);
                return
            }
            _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(sn, this.segmentsStore).then((segs) => {
                // console.warn(segs)
                if (segs && segs.length > 0 && segs.some(seg => seg.segId === segId)) {
                    // console.warn(`resolve(true)`)
                    resolve(true)
                } else {
                    // console.warn(`resolve(false)`)
                    resolve(false)
                }
            }).catch((e) => {
                this.logger.error(e)
                resolve(false)
            })
        })
    }

    async getSegById(segId) {
        if (!segId) return null;
        const sn = await _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(segId, this.id2SnStore);
        return new Promise((resolve, reject) => {
            if (sn === undefined) {
                resolve(null);
                return
            }
            _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(sn, this.segmentsStore).then((segs) => {
                if (segs && segs.length > 0) {
                    // const segment = segs[0];
                    const segment = segs.find(seg => seg.segId === segId);
                    if (!segment) {
                        resolve(null)
                        return
                    }
                    if (!(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.isArrayBuffer)(segment.data)) {
                        this.logger.error(`getSegById ${segment.sn} is not buffer`);
                        resolve(null)
                        return
                    }
                    resolve(_core_segment__WEBPACK_IMPORTED_MODULE_4__["default"].fromSegment(segment))
                } else {
                    resolve(null)
                }
            }).catch((e) => {
                this.logger.error(e)
                resolve(null)
            })
        })
    }

    getSegIdBySN(sn) {
        return new Promise((resolve, reject) => {
            _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(sn, this.segmentsStore).then((segs) => {
                if (segs && segs.length > 0) {
                    resolve(segs[0].segId)
                } else {
                    resolve(null)
                }
            }).catch((e) => {
                this.logger.error(e)
                resolve(null)
            })
        })
    }

    putSeg(segment) {
        const { logger } = this;
        if (!(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.isArrayBuffer)(segment.data)) {
            logger.error(`putSeg ${segment.sn} is not buffer`);
            return
        }
        this._addSeg(segment).then((seg) => {
            this.emit(`${_core_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_ADDED_SN_}${seg.sn}`, seg);
            this.emit(_core_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_SEG_ADDED, seg);
        }).catch(e => {
            if (!e) return
            logger.error(e);
            // 处理QuotaExceededError异常
            if ((e.name === 'QuotaExceededError') || (e.inner && e.inner.name === 'QuotaExceededError')) {
                this._trimDisk(true)
            }
        })
    }

    _addSeg(seg) {
        const { segId, sn } = seg;
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.set(segId, sn, this.id2SnStore);
        return new Promise((resolve, reject) => {
            _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(sn, this.segmentsStore).then((segs) => {
                if (segs) {
                    if (segs.filter(seg => seg.segId === segId).length === 0) {
                        segs.push(this._segmentToCache(seg))
                        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.set(sn, segs, this.segmentsStore).then(() => {
                            this._increaseBufSize(seg.data.byteLength);
                            resolve(seg)
                        }).catch((e) => {
                            reject(e)
                        })
                    }
                } else {
                    _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.set(sn, [this._segmentToCache(seg)], this.segmentsStore).then(() => {
                        this._increaseBufSize(seg.data.byteLength);
                        resolve(seg)
                    }).catch((e) => {
                        reject(e)
                    })
                }
            }).catch((e) => {
                reject(e)
            })
        })


    }

    async _trimDisk(forced = false) {
        let upBound = this.maxBufSize;
        const { logger } = this;
        // logger.warn(`trim disk`);
        let currentSize = await this.currBufSize();
        if (forced) {
            upBound = currentSize - 100*1024*1024;
            if (upBound < 0) upBound = 0;
        }
        // console.warn(`_trimDisk currentSize ${currentSize} loadingSN ${this.loadingSN}`)
        if (currentSize < upBound) return
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.keys(this.segmentsStore).then(async (keys) => {
            const sorted = keys.sort((a, b) => a-b);  // 从小到大排序
            let count = 0;
            do {
                if (count++ > 10) {
                    console.error('too much loops in SegmentStore');
                    break
                }
                // 释放溢出的buffer
                const oldestSN = sorted.shift();
                if (oldestSN === undefined) {
                    logger.error(`lastSN not found`);
                    continue;
                }
                // 防止demuxerWorker 异常
                if (oldestSN >= this.loadingSN) {
                    logger.warn(`trimDisk failed, loadingSN ${this.loadingSN}`);
                    break;
                }
                const nextSN = sorted[0];
                const oldestSegs = await _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(oldestSN, this.segmentsStore);
                if (!oldestSegs) {
                    logger.warn(`lastSeg not found`);
                    continue;
                }
                let size = 0;
                oldestSegs.forEach(oldestSeg => {
                    size += oldestSeg.data.byteLength;
                })
                _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.del(oldestSN, this.segmentsStore).then(() => {
                    this._decreaseBufSize(parseInt(size));
                });
                oldestSegs.forEach(oldestSeg => {
                    _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.del(oldestSeg.segId, this.id2SnStore);
                    logger.info(`pop seg ${oldestSeg.segId} size ${oldestSeg.data.byteLength}`);
                    this.emit(_core_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_LOST, {sn: oldestSN, segId: oldestSeg.segId, next: nextSN, level: oldestSeg.level});
                })
                currentSize -= size;
                logger.info(`pop sn ${oldestSN} size ${size} currBufSize ${currentSize}`);
                if (!this.overflowed) this.overflowed = true;
            } while (currentSize >= upBound)
        })
    }

    _decreaseBufSize(byteLength) {
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(KEY_METADATA_SIZE, this.metaStore).then(size => {
            if (size) {
                _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.set(KEY_METADATA_SIZE, size - byteLength, this.metaStore);
            }
        }).catch(e => {
            this.logger.error(e);
        })
    }

    _increaseBufSize(byteLength) {
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.get(KEY_METADATA_SIZE, this.metaStore).then(size => {
            _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.set(KEY_METADATA_SIZE, size + byteLength, this.metaStore);
            this._trimDisk();
        }).catch(e => {
            this.logger.error(e);
        })
    }

    _segmentToCache(seg) {
        return {
            data: seg.data,
            level: seg.level,
            segId: seg.segId,
            sn: seg.sn,
        }
    }

    clear() {
        this.logger.warn(`clear segment store`);
        try {
            this._clearDisk();
        } catch (e) {}
    }

    // 清空disk
    _clearDisk() {
        // console.warn(`_clearDisk`)
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.clear(this.segmentsStore);
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.clear(this.id2SnStore);
        _common_idb_keyval_index__WEBPACK_IMPORTED_MODULE_3__.clear(this.metaStore);
        // return diskCache.clearAll(excluded)
    }

    destroy() {
        this.clear();
        this.removeAllListeners();
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SegmentStore);


/***/ }),

/***/ "./src/hls-next/common/synthesizer.js":
/*!********************************************!*\
  !*** ./src/hls-next/common/synthesizer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Synthesizer)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../events */ "./src/hls-next/events.js");
/* harmony import */ var _core_utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/utils/buffer */ "./src/core/utils/buffer.js");
/* harmony import */ var _core_segment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/segment */ "./src/core/segment.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/hls-next/common/utils/tool-funs.js");
/* harmony import */ var _utils_error_code__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/error-code */ "./src/hls-next/common/utils/error-code.js");
/* harmony import */ var _hlsjs_utils_fetch_loader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hlsjs/utils/fetch-loader */ "./src/hls-next/hlsjs/utils/fetch-loader.js");









class Synthesizer extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(coordinator, logger, sn, level, segId, rangeSupported = false, ext) {
        super();
        this.coordinator = coordinator;
        this.logger = logger;
        this.rangeSupported = rangeSupported;
        // this.rangeSupported = true;   // test
        this.rangeStart = 0;
        this.rangeEnd = 0;                     // 不包含右区间
        this.httpLoadTime = 2000;              // ms
        this.proxied = false;
        this.pieceMsg = { event: _events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE, sn, level, seg_id: segId }      // attachments, seg_id, sn, level, size, reverse
        if (ext) this.setExtra(ext);
        this.forwardPeer = null;          // 负责正向下载
        this.reversePeer = null;          // 负责反向下载
        this.bufArr = [];
        this.forwardBufList = [];
        this.reverseBufList = [];
        this.forwardOffset = -1;    // 指向当前正向已填充的idx
        this.reverseOffset = 10000;    // 指向当前反向已填充的idx
        this.timeStart = 0;   // 开始的时刻 毫秒
        this.timeReceivePiece = 0;        // 接收到piece的时刻 毫秒    用于shouldWaitForRemain
        this.timer = undefined;
        this.destroyed = false;
        this.forwardStreamListeners = [];
        this.reverseStreamListeners = [];
        this.rangeRequesting = false;
        this.waitingRemain = false;
        this.httpLoaded = 0;
        this.p2pLoaded = 0;
        this.deadline = 0;      // setTimeout后预估的应该完成的时间
        this.p2pCanceled = false;
    }

    get segId() {
        return this.pieceMsg.seg_id
    }

    isDownloading() {
        return this.timeReceivePiece > 0
    }

    isAlmostDeadline() {
        // console.warn(`now ${performance.now()} deadline ${this.deadline}`)
        if (this.rangeRequesting) return true
        return this.deadline > 0 && this.deadline - performance.now() < 400
    }

    hasPeer(target) {
        if (!target) return false
        return target === this.forwardPeer || target === this.reversePeer
    }

    streamListeners() {
        return [...this.reverseStreamListeners, ...this.forwardStreamListeners].length
    }

    _notifyStreamListeners(reverse, data, idx) {
        const { sn, seg_id, attachments } = this.pieceMsg;
        const finished = (reverse && idx === 0) || (!reverse && idx === attachments-1)
        // console.warn(`_notifyStreamListeners sn ${sn} length ${data.byteLength} finished ${finished}`);
        const listeners = reverse ? this.reverseStreamListeners : this.forwardStreamListeners;
        if (reverse) {
            this.reverseBufList.push(data);
        } else {
            this.forwardBufList.push(data);
        }
        if (finished) {
            this.forwardBufList.push([...this.reverseBufList].reverse());
            this.reverseBufList.push([...this.forwardBufList].reverse());
        }
        for (let item of listeners) {
            const { handler } = item;
            handler(sn, seg_id, false, data, finished);
        }
        if (finished) {
            // console.warn(`_notifyStreamListeners finished`)
            listeners.length = 0;
        }
    }

    _notifyStreamListenersAbort() {
        const listeners = [...this.reverseStreamListeners, ...this.forwardStreamListeners];
        for (let item of listeners) {
            const { handler } = item;
            handler(undefined, undefined, true, 'aborted by synthesizer');
        }
        listeners.length = 0;
    }

    _notifyStreamListenersRemain() {
        // forward
        if (this.forwardStreamListeners.length > 0) {
            for (let i=this.forwardOffset+1; i<this.bufArr.length; i++) {
                this._notifyStreamListeners(false, this.bufArr[i], i)
                // console.warn(`notifyStreamListeners sn ${i} length ${this.bufArr[i].byteLength} finished ${i===this.bufArr.length-1}`);
            }
            this.forwardStreamListeners = [];
        }
        // reverse
        if (this.reverseStreamListeners.length > 0) {
            for (let i=this.reverseOffset-1; i>=0; i--) {
                this._notifyStreamListeners(true, this.bufArr[i], i)
                // console.warn(`notifyStreamListeners sn ${i} length ${this.bufArr[i].byteLength} finished ${i===0}`);
            }
            this.reverseStreamListeners = [];
        }
    }

    addStreamListener(reverse, peerId, handler) {
        const listeners = reverse ? this.reverseStreamListeners : this.forwardStreamListeners;
        listeners.push({ handler, peerId });
    }

    removeStreamListener(peerId) {
        const filter = (arr) => {
            return arr.filter(item => {
                if (item.peerId === peerId) {
                    item.handler(undefined, undefined, true, 'aborted by cancel');
                    return false
                }
                return true
            })
        }
        this.forwardStreamListeners = filter(this.forwardStreamListeners);
        this.reverseStreamListeners = filter(this.reverseStreamListeners);

    }

    setTimeout(timeout = 0) {
        const listeners = this.streamListeners()
        let now = performance.now()
        if (listeners > 2) {
            timeout /= 2;
            if (timeout < 2500) {
                if (this.timeReceivePiece > 0) {
                    // 已经接收到piece
                    const duration = now - this.timeReceivePiece;   // ms
                    timeout = 3000 - duration;
                } else {
                    timeout = 2500;
                }
            }
            this.logger.info(`stream listeners ${listeners}, set timeout ${timeout}`);
        }
        if (timeout <= 0) {
            setTimeout(() => {
                this._handleTimeout(false, false)
            }, 0)
            return
        }
        this.deadline = now + timeout;
        this._startTimer(timeout);
    }

    setExtra(ext = {}) {
        if (ext.url) this.url = ext.url;
        if (ext.rangeStart) this.rangeStart = ext.rangeStart;
        if (ext.rangeEnd) this.rangeEnd = ext.rangeEnd;
        if (ext.httpLoadTime) this.httpLoadTime = ext.httpLoadTime;
        if (ext.proxied) this.proxied = true;
        if (ext.xhrSetup) this.xhrSetup = ext.xhrSetup;
        if (ext.headers) this.headers = ext.headers;
        if (ext.segId && !this.pieceMsg.seg_id) this.pieceMsg.seg_id = ext.segId;
    }

    hasForwardPeer() {
        return !!this.forwardPeer
    }

    hasReversePeer() {
        return !!this.reversePeer
    }

    hasPeerId(peerId) {
        return (this.forwardPeer && this.forwardPeer.remotePeerId === peerId) || (this.reversePeer && this.reversePeer.remotePeerId === peerId)
    }

    isEmpty() {
        return this.forwardPeer === null && this.reversePeer === null
    }

    isFull() {
        return this.forwardPeer && this.reversePeer
    }

    setForwardPeer(target) {
        this.forwardPeer = target;
        if (this.reversePeer) this._print();
        this._setupPeer(target, false);
    }

    setReversePeer(target) {
        this.reversePeer = target;
        if (this.forwardPeer) this._print();
        this._setupPeer(target, true);
    }

    deletePeer(target, clean = false) {
        const reverse = target === this.reversePeer;
        this._detachPeer(target);
        if (reverse) {
            this.reversePeer = null;
            if (clean) {
                this.reverseOffset = this.pieceMsg.attachments || 10000;
            }
        } else {
            this.forwardPeer = null;
            if (clean) this.forwardOffset = -1;
        }
        if (this.isEmpty()) {
            this._handleTimeout(false, false);
        }
    }

    terminate() {
        this._handleTimeout(false, false);
    }

    hasPartialBuffer() {
        return this.hasForwardBuffer() || this.hasReverseBuffer()
    }

    hasForwardBuffer() {
        return this.forwardOffset >= 0
    }

    hasReverseBuffer() {
        return this.pieceMsg && this.reverseOffset < this.pieceMsg.attachments
    }

    // getPartialBuffer() {
    //     const bufferLeft = this.forwardOffset >= 0 ? Buffer.concat(this.bufArr.slice(0, this.forwardOffset+1)) : null;
    //     const bufferRight = (this.pieceMsg && this.reverseOffset < this.pieceMsg.attachments) ? Buffer.concat(this.bufArr.slice(this.reverseOffset)) : null;
    //     return [bufferLeft, bufferRight]
    // }

    _cancelP2p() {
        if (this.p2pCanceled) return
        this.p2pCanceled = true;
        const { seg_id, sn, level} = this.pieceMsg;
        [this.forwardPeer, this.reversePeer].filter(p => !!p).forEach(peer => {
            peer.cancelDownload(sn, level, seg_id);
        })
    }

    destroy() {
        this.logger.info(`destroy syn`);
        clearTimeout(this.timer);
        this._notifyStreamListenersAbort();
        // 发送cancel
        this._cancelP2p();
        this.removeAllListeners();
        this.destroyed = true;
        this._detachPeer(this.forwardPeer);
        this.forwardPeer = null;
        this.forwardOffset = -1;
        this._detachPeer(this.reversePeer);
        this.reversePeer = null;
        this.reverseOffset = 10000;
        this.bufArr = [];
        this.forwardStreamListeners = [];
        this.reverseStreamListeners = [];
    }

    _detachPeer(target) {
        if (!target) return
        // console.warn(`off peer ${this.pieceMsg.sn} ${target.remotePeerId}`)
        const reverse = target === this.reversePeer;
        const events = reverse ? this.reverseEvents : this.forwardEvents;
        if (events) {
            target
                .off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_DATA, events.onPieceData)
                .off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE, events.onPiece)
                .off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_NOT_FOUND, events.onPieceNotFound)
                .off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_ABORT, events.onPieceAbort)
        }
    }

    _receivePacket(reverse, dataSn, data, byP2p = true) {
        // console.warn(`_receivePacket reverse ${reverse} dataSn ${dataSn} byteLength ${data.byteLength} byP2p ${byP2p}`)
        const { seg_id: segId, sn, level, size } = this.pieceMsg;
        const idx = dataSn-1;
        if (this.bufArr[idx]) {
            this.logger.warn(`syn bufArr ${this.pieceMsg.sn} already has ${idx} size ${data.byteLength}`);
            return false
        }
        if (byP2p) {
            this.p2pLoaded += data.byteLength;
        } else {
            this.httpLoaded += data.byteLength;
        }
        // console.warn(`set ${idx} size ${data.byteLength} to bufArr ${sn} reverse ${reverse} from ${peer.remotePeerId}`)
        this.bufArr[idx] = data;
        if (reverse) {
            this.reverseOffset = idx;
        } else {
            this.forwardOffset = idx;
        }
        this._notifyStreamListeners(reverse, data, idx);

        // 检查完成条件是否满足
        if (this.forwardOffset !== this.reverseOffset - 1) return true

        if (this.forwardPeer) this.forwardPeer.miss = 0;
        if (this.reversePeer) this.reversePeer.miss = 0;
        // 清除定时器
        clearTimeout(this.timer);
        // stream listeners
        this._notifyStreamListenersRemain();
        // 计算速度
        const speed = size / (performance.now() - this.timeStart);
        let payload = _core_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.Buffer.concat(this.bufArr);
        // this.logger.debug(`expectedSize ${this.expectedSize}, byteLength ${payload.byteLength}`);
        const byteLength = payload.byteLength;
        if (byteLength === size) {     //校验数据
            // let arrayBuffer = new Uint8Array(payload).buffer;       // 将uint8array转为arraybuffer
            let arrayBuffer = payload.buffer;       // 将uint8array转为arraybuffer
            const segment = new _core_segment__WEBPACK_IMPORTED_MODULE_3__["default"](sn, segId, arrayBuffer, this.getFromPeerId(), level);
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_OUTPUT, segment, {
                speed,
                p2p: this.p2pLoaded,
                http: this.httpLoaded,
            });
        } else {
            this.logger.error(`${level}-${sn} expectedSize ${size} != byteLength ${byteLength} forward ${this.forwardOffset} reverse ${this.reverseOffset}`);
            for (let i=0;i<this.bufArr.length;i++) {
                this.logger.error(`piece ${i} size ${this.bufArr[i].byteLength}`);
            }
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, this.pieceMsg, _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_INTERNAL);
        }
    }

    _setupPeer(peer, reverse) {
        if (this.timeStart === 0) this.timeStart = performance.now();
        // let count = 0;     // test
        const onPieceData = (sn, segId, data, dataSn, finished, pieceMsg) => {
            if (this.destroyed) return
            if (!this._validateMsg(sn, pieceMsg.level, segId)) {
                this.logger.warn(`onPieceData ${pieceMsg.level}-${sn} not match ${JSON.stringify(this.pieceMsg)} from ${peer.remotePeerId}`);
                return
            }
            // 填充buffer array
            const { reverse } = pieceMsg;
            const success = this._receivePacket(reverse, dataSn, data);
            // 判断是否需要切换到http
            if (success && !this.waitingRemain && !this.rangeRequesting && this.deadline > 0 && this._shouldSwitch()) {
                this.logger.warn(`should switch to http`);
                clearTimeout(this.timer);
                this._handleTimeout(false, false);
            }
        }
        const onPiece = msg => {
            if (this.destroyed) return
            const { attachments, size, sn, level, seg_id } = msg;
            if (!size || !this._validateMsg(sn, level, seg_id)) {
                this.logger.warn(`onPiece ${JSON.stringify(msg)} not match ${JSON.stringify(this.pieceMsg)}`);
                this.deletePeer(peer);
                return
            }
            if (this.pieceMsg.size && size !== this.pieceMsg.size) {
                // size 不一致
                this.logger.warn(`onPiece ${msg.level}-${msg.sn} size not match`);
                this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, this.pieceMsg, _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_INTERNAL);
                return;
            }
            if (this.bufArr.length === 0) {
                this.pieceMsg = {
                    ...this.pieceMsg,
                    seg_id,
                    size,
                    attachments,
                }
                this.reverseOffset = attachments;
                this.bufArr = new Array(attachments);
                this.timeReceivePiece = performance.now();
            }
        }
        const onPieceNotFound = msg => {
            if (this.destroyed) return
            // const { sn, level, seg_id } = msg;
            // if (!this._validateMsg(sn, level, seg_id)) {
            //     this.logger.warn(`onPieceNotFound ${seg_id} not match ${JSON.stringify(this.pieceMsg)}`);
            // }
            // 将peer淘汰
            this.deletePeer(peer);
        }
        const onPieceAbort = () => {
            if (this.destroyed) return
            // 将peer淘汰
            this.deletePeer(peer);
        }
        const events = {
            onPieceData,
            onPiece,
            onPieceNotFound,
            onPieceAbort
        }
        if (reverse) {
            this.reverseEvents = events;
        }  else {
            this.forwardEvents =events;
        }
        peer
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_DATA, onPieceData)
            .once(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE, onPiece)
            .once(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_NOT_FOUND, onPieceNotFound)
            .once(_events__WEBPACK_IMPORTED_MODULE_1__["default"].DC_PIECE_ABORT, onPieceAbort)
    }

    _validateMsg(sn, level, segId) {
        if (this.pieceMsg.seg_id && segId !== this.pieceMsg.seg_id) return false
        return sn === this.pieceMsg.sn && level === this.pieceMsg.level

    }

    _shouldSwitch() {
        const packetSize = _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PACKET_SIZE;
        const remainSize = this.pieceMsg.size - packetSize * this.loadedPackets();
        return this.coordinator.shouldSwitchToHttp(
            remainSize,
            this.deadline,
            this.p2pSpeed,
            packetSize,
            this.httpLoadTime)
    }

    _startTimer(timeout, shouldWait = true) {
        this.timer = setTimeout(this._handleTimeout.bind(this, shouldWait), timeout)
    }

    loadedPackets() {
        return this.pieceMsg.attachments - (this.reverseOffset - this.forwardOffset-1);
    }

    _handleTimeout(shouldWait = false, shouldChoke = true) {
        if (this.destroyed) return
        const { level, sn, size, attachments } = this.pieceMsg;
        if (!size || this.timeReceivePiece === 0) {
            this.logger.warn(`syn load timeout ${level}-${sn} url ${this.url}`);
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, this.pieceMsg, _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_INTERNAL);
            return
        }
        if (shouldWait && this.timeReceivePiece > 0) {
            this.logger.warn(`syn ${this.loadedPackets()} of ${attachments} packets loaded`);
            // 计算下载速度 byte/ms = KB/s
            if (this.shouldWaitForRemain(this.httpLoadTime)) {
                const timeout = this.httpLoadTime;
                this.waitingRemain = true;
                this.logger.info(`syn wait for remain ${timeout}`);
                this._startTimer(timeout, false)
                return
            }
        }

        if (shouldChoke) {
            const badOne = [this.forwardPeer, this.reversePeer]
                .filter(p=>!!p).sort((a, b)=>a.currentLoadSpeed()-b.currentLoadSpeed())
                .shift()
            if (badOne) badOne.loadtimeout();
        }

        this._cancelP2p();
        if (this.rangeSupported && this.url) {
            return this._loadRemainBufferByHttp();
        }
        // abort
        this._notifyStreamListenersAbort();
        this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, this.pieceMsg, _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_ABORT);
    }

    shouldWaitForRemain(remainLoadTime) {
        if (remainLoadTime <= 0 || this.isEmpty() || this.streamListeners() > 0) return false
        const now = performance.now();
        const sinceStart = now - this.timeStart;
        if (sinceStart < 500 || (sinceStart < 1000 && this.timeReceivePiece > 0 && remainLoadTime > 3000)) return true     // 在1.0秒内收到piece
        return this.shouldWaitForRemainUrgent(remainLoadTime)
    }

    shouldWaitForRemainUrgent(remainLoadTime) {
        if (this.timeReceivePiece === 0 || remainLoadTime <= 0) return false
        const downloadSpeed = this.p2pSpeed;
        let loadedBytes = 0;
        [this.forwardPeer, this.reversePeer].forEach(peer => {
            if (peer) {
                loadedBytes += peer.loadedBytes();
            }
        })
        const minRequiredSpeed = (this.pieceMsg.size-loadedBytes) / remainLoadTime;
        this.logger.info(`syn remainTime ${remainLoadTime} speed ${downloadSpeed} required ${minRequiredSpeed}`);
        return downloadSpeed >= minRequiredSpeed
    }

    get p2pSpeed() {
        let downloadSpeed = 0;
        [this.forwardPeer, this.reversePeer].forEach(peer => {
            if (peer) {
                downloadSpeed += peer.currentLoadSpeed();
            }
        })
        return downloadSpeed
    }

    getFromPeerId() {
        const { forwardPeer, reversePeer } = this;
        if (this.isFull() && forwardPeer !== reversePeer) return `${forwardPeer.remotePeerId}:${reversePeer.remotePeerId}`;
        if (forwardPeer) return `${forwardPeer.remotePeerId}`;
        if (reversePeer) return `${reversePeer.remotePeerId}`;
        return ''
    }

    _loadRemainBufferByHttp() {
        if (this.rangeRequesting) return;
        const { size, sn, level } = this.pieceMsg;
        // 补片
        const rangeEnd = this.rangeEnd > 0 ? this.rangeEnd-1 : 0;
        // 计算range
        let currentForwardOffset = this.forwardOffset
        // let rangeObj = calRangeValueWithForwardReverseOffset(currentForwardOffset, this.reverseOffset, size, this.rangeStart, rangeEnd);
        const range = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.calRangeWithForwardReverseOffset)(currentForwardOffset, this.reverseOffset, size, this.rangeStart, rangeEnd);
        const tStart = performance.now();
        let timeout = this.deadline + this.httpLoadTime - tStart + 1000;
        if (timeout < 2000) {
            timeout = 2000;
        } else if (timeout > 6000) {
            timeout = 6000;
        }
        // 发起http请求
        this.logger.info(`continue download ${level}-${sn} from ${this.url} range: ${range} timeout ${timeout}`);
        this.rangeRequesting = true;
        // headers
        if (this.headers) {
            this.xhrSetup = (xhr) => {
                for (const key of Object.keys(this.headers)) {
                    xhr.setRequestHeader(key, this.headers[key]);
                }
            }
        }

        // ----------------------------------------------------------------
        (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.performRangeRequest)(this.url, range, this.xhrSetup, timeout, this.proxied).then(buffer => {
            if (this.destroyed) return
            this.rangeRequesting = false;
            if (!buffer) {
                this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, this.pieceMsg, _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_RANGE_REQUEST);
                return
            }
            let httpPayload = _core_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.Buffer.from(buffer);
            const speed = httpPayload.byteLength / (performance.now() - tStart);
            this.coordinator.addHttpSpeed(speed);
            if (httpPayload.byteLength === this.pieceMsg.size) {
                // 得到完整的ts文件 range 0- 返回206
                this.logger.warn(`syn range request ${sn} resp whole ts`);
                currentForwardOffset = -1;
            }
            const bufList = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.splitBytes)(httpPayload, 0);
            let fromIndex = currentForwardOffset + 1;
            for (let i=0; i < bufList.length; i++) {
                if (!this.bufArr[fromIndex]) {           // 防止在http请求期间已经下载
                    this._receivePacket(false, fromIndex+1, bufList[i], false);
                }
                fromIndex ++;
            }
        }).catch(err => {
            if (this.destroyed) return
            this.rangeRequesting = false;
            this.logger.error(`http partial download ${sn} error ${err}`);
            const code = err === 'timeout' ? _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_HTTP_TIMEOUT : _utils_error_code__WEBPACK_IMPORTED_MODULE_6__["default"].ERROR_SYN_RANGE_REQUEST;
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, this.pieceMsg, code);
        })
        // ----------------------------------------------------------------

        // if (!this.hasPartialBuffer()) {
        //     rangeObj = {}
        // }
        // // http streaming
        // const httpLoader = new FetchLoader({xhrSetup: this.xhrSetup})
        // let context = {
        //     url: this.url,
        //     ...rangeObj,
        // }
        // if (this.proxied) {
        //     context = {
        //         headers: {
        //             [HEADER_SW_PROXY]: 'bypass'
        //         },
        //         ...context,
        //     }
        // }
        // const config = {
        //     timeout
        // }
        // let totalSize;
        // let fromIndex = currentForwardOffset + 1;
        // const callbacks = {
        //     onUpdate: (buffer, done, aborted) => {
        //         if (this.destroyed) return
        //         if (aborted) {
        //             this.emit(Events.SYN_ERROR, this.pieceMsg, ErrCode.ERROR_SYN_RANGE_REQUEST);
        //             return
        //         }
        //         if (done) {
        //             this.rangeRequesting = false;
        //             const speed = totalSize / (performance.now() - tStart);
        //             this.coordinator.addHttpSpeed(speed);
        //         }
        //         // console.warn(`fromIndex ${fromIndex} size ${buffer.byteLength}`)
        //         if (!this.bufArr[fromIndex]) {           // 防止在http请求期间已经下载
        //             this._receivePacket(false, fromIndex+1, buffer, false);
        //         }
        //         fromIndex ++;
        //     },
        //     onBodyStart: (total) => {
        //         // console.warn(`onBodyStart total ${total}`)
        //         if (this.destroyed) return
        //         totalSize = total;
        //         if (total === this.pieceMsg.size && this.hasPartialBuffer()) {
        //             // 得到完整的ts文件 range 0- 返回206
        //             this.logger.warn(`syn range request ${sn} resp whole ts`);
        //             fromIndex = 0;
        //         }
        //     },
        //     onError: (error, context, networkDetails) => {
        //         if (this.destroyed) return
        //         this.rangeRequesting = false;
        //         this.logger.error(networkDetails)
        //         this.emit(Events.SYN_ERROR, this.pieceMsg, ErrCode.ERROR_SYN_RANGE_REQUEST);
        //     },
        //     onTimeout: () => {
        //         if (this.destroyed) return
        //         this.rangeRequesting = false;
        //         this.emit(Events.SYN_ERROR, this.pieceMsg, ErrCode.ERROR_SYN_HTTP_TIMEOUT);
        //     }
        // }
        // httpLoader.load(context, config, callbacks);
    }

    _print() {
        const { level, sn } = this.pieceMsg;
        this.logger.info(`syn parallel loading ${level}-${sn}`);
    }

}


/***/ }),

/***/ "./src/hls-next/common/utils/error-code.js":
/*!*************************************************!*\
  !*** ./src/hls-next/common/utils/error-code.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    ERROR_SYN_INTERNAL: 0,
    ERROR_SYN_RANGE_REQUEST: 1,
    ERROR_SYN_HTTP_TIMEOUT: 2,
    ERROR_SYN_ABORT: 3,
});


/***/ }),

/***/ "./src/hls-next/common/utils/segment-builder.js":
/*!******************************************************!*\
  !*** ./src/hls-next/common/utils/segment-builder.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SegmentBuilder)
/* harmony export */ });
/* harmony import */ var _core_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/events */ "./src/core/events.js");
/* harmony import */ var _core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/utils/buffer */ "./src/core/utils/buffer.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");




class SegmentBuilder {

    constructor(sn, level, segId, dataSize) {
        this.bufferList = [];           // 正向的
        this.streamListeners = [];
        this.finished = false;
        this.packetSize = _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_PACKET_SIZE;
        this.attachments = dataSize % this.packetSize === 0 ? dataSize / this.packetSize : Math.floor(dataSize / this.packetSize) + 1;
        this.pieceMsg = {
            event: _core_events__WEBPACK_IMPORTED_MODULE_0__["default"].DC_PIECE,
            attachments: this.attachments,
            seg_id: segId,
            sn,
            level,
            size: dataSize,
            reverse: false,
        }
        this.sink = (0,_core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer)(0);
        this.source = 'HttpStream'
    }

    receiveBytes(buffer, done) {
        if (!buffer.byteLength) return
        this.sink = _core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.concat([this.sink, buffer])
        this.bufferList.push(buffer);
        if (done) {
            this.finished = true;

        }
        this._notifyStreamListeners(buffer);
    }

    getCompleteBuffer() {
        return this.sink.buffer
    }

    destroy() {
        if (this.finished) return
        this._notifyStreamListenersAbort();
    }

    addStreamListener(reverse, peerId, handler) {
        this.streamListeners.push({ handler, peerId });
    }

    removeStreamListener(peerId) {
        this.streamListeners = this.streamListeners.filter(item => {
            if (item.peerId === peerId) {
                item.handler(undefined, undefined, true, 'aborted by cancel');
                return false
            }
            return true
        });
    }

    _notifyStreamListenersAbort() {
        for (let item of this.streamListeners) {
            const { handler } = item;
            handler(undefined, undefined, true, 'aborted by httpLoader');
        }
        this.streamListeners.length = 0;
    }

    _notifyStreamListeners(data) {
        const { sn, seg_id } = this.pieceMsg;
        for (let item of this.streamListeners) {
            const { handler } = item;
            // console.warn(`_notifyStreamListeners sn ${sn} length ${data.byteLength} finished ${this.finished}`);
            handler(sn, seg_id, false, data, this.finished);
        }
        if (this.finished) {
            // console.warn(`_notifyStreamListeners finished`)
            this.streamListeners.length = 0;
        }
    }
}


/***/ }),

/***/ "./src/hls-next/common/utils/tool-funs.js":
/*!************************************************!*\
  !*** ./src/hls-next/common/utils/tool-funs.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calRangeValueWithForwardReverseOffset": () => (/* binding */ calRangeValueWithForwardReverseOffset),
/* harmony export */   "calRangeWithForwardReverseOffset": () => (/* binding */ calRangeWithForwardReverseOffset),
/* harmony export */   "sequentialSegmentIdGenerator": () => (/* binding */ sequentialSegmentIdGenerator),
/* harmony export */   "strictSegmentIdGenerator": () => (/* binding */ strictSegmentIdGenerator),
/* harmony export */   "tryGetMediaElement": () => (/* binding */ tryGetMediaElement)
/* harmony export */ });
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");


/*
    先获取src相同的，没有则获取 currentTime>0 的
 */
function tryGetMediaElement(mediaElem, targetSrc) {
    // console.warn(`targetSrc ${targetSrc}`)
    let targetMedia;
    if (mediaElem) {
        if (typeof mediaElem === 'string') {
            targetMedia = document.querySelector(mediaElem);
        } else if (mediaElem instanceof HTMLMediaElement) {
            targetMedia = mediaElem;
        }
    }
    if (!targetMedia) {
        const medias = [...document.getElementsByTagName('video'), ...document.getElementsByTagName('audio')];
        if (medias.length === 1) {
            targetMedia = medias[0];
        } else {
            if (targetSrc) {
                targetMedia = medias.find(item => item.src === targetSrc);
            }
            if (!targetMedia) {
                targetMedia = medias.find(item => item.currentTime > 0);
            }
        }
    }
    // if (targetMedia) {
    //     console.warn(`tryGetMediaElement src ${targetMedia.src} currentTime ${targetMedia.currentTime}`)
    // }
    return targetMedia
}

function calRangeValueWithForwardReverseOffset(forwardOffset, reverseOffset, dataSize, rangeStart = 0, rangeEnd = 0) {
    const packetSize = _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_PACKET_SIZE;
    let byteStart = rangeStart;
    let byteEnd = rangeEnd || dataSize - 1;
    const packetsCompleted = Math.floor(dataSize / packetSize);
    const totalPackets = dataSize % packetSize > 0 ? packetsCompleted + 1 : packetsCompleted;
    if (forwardOffset >= 0) {
        byteStart += (forwardOffset+1) * packetSize;
    }
    if (reverseOffset >= 0 && reverseOffset < totalPackets) {
        const reversePackets = totalPackets - reverseOffset;
        byteEnd -= (dataSize % packetSize) + (reversePackets - 1) * packetSize;
    }
    return {
        rangeStart: byteStart,
        rangeEnd: byteEnd+1
    }
}

function calRangeWithForwardReverseOffset(forwardOffset, reverseOffset, dataSize, rangeStart = 0, rangeEnd = 0) {
    const  rangeObj = calRangeValueWithForwardReverseOffset(forwardOffset, reverseOffset, dataSize, rangeStart, rangeEnd)
    return `bytes=${rangeObj.rangeStart}-${rangeObj.rangeEnd-1}`;
}

function sequentialSegmentIdGenerator(streamId, sn) {
    return `${streamId}-${sn}`
}

function strictSegmentIdGenerator(streamId, sn, segmentUrl, range) {
    let netUrl = segmentUrl.split('?')[0];
    if (netUrl.startsWith('http')) {
        netUrl = netUrl.split('://')[1];
    }
    if (range) {
        return `${netUrl}|${range}`
    }
    return `${netUrl}`
}



/***/ }),

/***/ "./src/hls-next/config.js":
/*!********************************!*\
  !*** ./src/hls-next/config.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/config */ "./src/core/config.js");


//时间单位统一为秒
let defaultP2PConfig = {

    ..._core_config__WEBPACK_IMPORTED_MODULE_0__["default"],
    httpLoadTime: 0,                 // 需要保留给http下载的时间
    sharePlaylist: false,
    useHttpRange: true,

    // hlsjs
    hlsjsInstance: null,
    proxyOnly: false,
    p2pBlackList: ['vtt', 'webvtt', 'key'],                // 不参与P2P的文件类型，防止报错
    live: true,

    // hls-sw
    swFile: './sw.js',      // service worker文件路径
    swScope: './',        // service worker作用范围
    swAutoRegister: true,
    mediaElem: undefined,
    httpStreamEnabled: true,
    diskCacheLimit: {
        pc: 2500 * 1024 * 1024,
        mobile: 1500 * 1024 * 1024,
    },
    useDiskCache: true,
    waitForPeer: false,                // 是否等待peer加载首片
    waitForPeerTimeout: 4.0,           // 等待peer超时时间 秒
    strictSegmentId: false,

    // 越南代理
    // announce: "https://ping.ecocdn.net:8443/v1",
    // showSlogan: false,
    // wsSignalerAddr: {
    //     main: 'wss://sg.web3-lab.com:7078',
    //     backup: 'wss://signalcloud.web3-lab.com:7078',
    // },

    // byetv
    // announce: "https://p2pengine.net:7068/v1",
    // segmentId: function (streamId, sn, segmentUrl, range) {
    //     let netUrl = segmentUrl.split('?')[0];
    //     if (netUrl.startsWith('http')) {
    //         netUrl = netUrl.split('://')[1];
    //     }
    //     if (range) {
    //         return `${netUrl}|${range}`
    //     }
    //     return `${netUrl}`
    // },
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaultP2PConfig);


/***/ }),

/***/ "./src/hls-next/events.js":
/*!********************************!*\
  !*** ./src/hls-next/events.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/events */ "./src/core/events.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    ..._core_events__WEBPACK_IMPORTED_MODULE_0__["default"],

    SCH_DCHAVE: 'SCH_DCHAVE',
    SCH_WAIT_PEER: 'SCH_WAIT_PEER',

    SW_PLAYLIST: 'SW_PLAYLIST',
    SW_GET_PLAYLIST: 'SW_GET_PLAYLIST',
    SW_GET_MEDIA: 'SW_GET_MEDIA',

    LEVEL_LOADED: 'LEVEL_LOADED',
    MANIFEST_PARSED: 'MANIFEST_PARSED',
});



/***/ }),

/***/ "./src/hls-next/hls-sw.p2pengine.js":
/*!******************************************!*\
  !*** ./src/hls-next/hls-sw.p2pengine.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_engine_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/engine-base */ "./src/core/engine-base.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/hls-next/events.js");
/* harmony import */ var _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/utils/tool-funs */ "./src/hls-next/common/utils/tool-funs.js");
/* harmony import */ var _core_peer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/peer */ "./src/core/peer.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _common_engine__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/engine */ "./src/hls-next/common/engine.js");
/* harmony import */ var _common_hls_m3u8_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/hls/m3u8-parser */ "./src/common/hls/m3u8-parser/index.js");
/* harmony import */ var _core_server__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/server */ "./src/core/server.js");
/* harmony import */ var _hls_sw_scheduler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hls-sw/scheduler */ "./src/hls-next/hls-sw/scheduler.js");
/* harmony import */ var _core_tracker_client__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../core/tracker-client */ "./src/core/tracker-client.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _common_media_util_func__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../common/media/util-func */ "./src/common/media/util-func.js");
/* harmony import */ var _common_sw_sw_tool__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../common/sw/sw-tool */ "./src/common/sw/sw-tool.js");
/* harmony import */ var _index_engine__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./index.engine */ "./src/hls-next/index.engine.js");















const MIN_SW_VERSION_REQUIRE = '2.7.10'

class HlsSwP2pEngine extends _common_engine__WEBPACK_IMPORTED_MODULE_5__["default"] {
    static get name() {
        return 'HlsSwP2pEngine'
    }

    static isServiceWorkerSupported() {
        return ('serviceWorker' in navigator)
    }

    constructor(p2pConfig = {}) {
        super(p2pConfig);
        this.swSupported = self.isSecureContext;
        this.levels = [];
        this.bypassLevels = [];
        this.currentLevelIndex = 0;
        this.currentSrc = '';
        this.swVersion = '';
        this.media = (0,_common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.tryGetMediaElement)(this.config.mediaElem)
        this.workerKeepAliveInterval = null;
        this.fragMap = new Map();                 // url -> {duration, sn, baseurl }

        if (!HlsSwP2pEngine.isServiceWorkerSupported()) {
            this.swSupported = false;
            console.warn('service worker is not supported');
            // this.p2pEnabled = false;
        }

        const { channelIdMaker, signalId, browserInfo } = this.setup();

        this.onLevelLoaded = (level) => {
            // console.warn(level)
            const { config } = this;
            const isLive = level.live;
            config.live = isLive;
            // console.warn(JSON.stringify(level, null, 2));
            this.targetDuration = level.averagetargetduration;
            // 浏览器信息
            this.browserInfo = {
                ...browserInfo,
                live: isLive,
                abr: this.multiBitrate || undefined,
                type: 'hls_sw',
            };

            this.channel = `${channelIdMaker(this.currentSrc)}|${signalId}[${_core_peer__WEBPACK_IMPORTED_MODULE_3__["default"].VERSION}]`;

            // electron
            this.setupElectron();

            const logger = this.initLogger();
            logger.info(`use HlsSwP2pEngine`);
            logger.info(`engine version: ${_core_engine_base__WEBPACK_IMPORTED_MODULE_0__["default"].version} hls-proxy version: ${this.swVersion}`);
            logger.info(`channel ${this.channel}`);
            if (!isLive) {
                config.startSN = level.startSN;
                config.endSN = level.endSN;
                logger.info(`startSN ${level.startSN} endSN ${level.endSN}`);
            }
            this._init(this.channel, this.browserInfo);
            this.off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].LEVEL_LOADED, this.onLevelLoaded);
        }

        if (this.config.httpLoadTime === 0) {
            if (this.config.live) {
                this.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].LEVEL_LOADED, (level) => {
                    this.config.httpLoadTime = this.determineHttpLoadTime(level.fragments);
                });
            } else {
                this.config.httpLoadTime = 2.5;
            }
        }

        this.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].LEVEL_LOADED, this.onLevelLoaded);

        this.onManifestParsed = (levels, url) => {
            // console.warn(`onManifestParsed`)
            // console.warn(levels)
            // console.warn(url)
            this.multiBitrate = levels.length > 1;
            this.currentSrc = url;
            this.off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].MANIFEST_PARSED, this.onManifestParsed);
        };

        this.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].MANIFEST_PARSED, this.onManifestParsed);

        this.onFragLoaded = ({ url }) => {
            const { config } = this;
            // 发起Range请求
            if (!this.rangeTested && this.config.useHttpRange) {
                (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.performRangeRequest)(url, null, null, 2000, false).then((buf) => {
                    config.httpRangeSupported = true;
                    config.logger.info(`http range is supported`);
                }).catch(err => {
                    config.httpRangeSupported = false;
                    config.logger.warn(`http range is not supported, ${err}`);
                });
                this.rangeTested = true;
            }
            this.off(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, this.onFragLoaded);
        }

        this.once(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, this.onFragLoaded);

        if (this.swSupported) {
            const { serviceWorker } = navigator;
            serviceWorker.onmessage = (event) => {
                const { action, data } = event.data;
                const sender = event.ports[0];
                if (this.logger) this.logger.info(`engine onmessage action ${action}`);
                sender.postMessage({
                    action,
                    pong: true,
                })
                if (!this.p2pEnabled || !data) {
                    return sender.postMessage({
                        action,
                    })
                }
                switch (action) {
                    case _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_PLAYLIST:
                        this.handlePlaylist(data, sender);
                        break;
                    case _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_PLAYLIST:
                        this.handleGetPlaylist(data, sender);
                        break;
                    default:
                        if (this.config.scheduler) {
                            this.config.scheduler.notifySWMessage(action, data, sender);
                        } else {
                            return sender.postMessage({
                                action,
                            })
                        }
                }
            };
        }

        if (this.config.swAutoRegister) {
            this.registerServiceWorker().then(function (registration) {
                // console.info('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch((err) => {
                console.warn('ServiceWorker registration failed ', err)
            })
        }
    }

    get currentLevel() {
        return this.currentLevelIndex
    }

    watchRebuffering(media) {
        this.offEventRebuffer = (0,_common_media_util_func__WEBPACK_IMPORTED_MODULE_11__.listenMediaRebuffer)(media, () => {
            if (this.fetcher) this.fetcher.increRebuffers();
        })
    }

    handlePlaylist(data, sender) {
        // console.warn(`currentLevelIndex ${this.currentLevelIndex}`);
        const { config, logger } = this;
        const { url, redirectedUrl, text, ver } = data;
        // console.warn(ver)
        this.swVersion = ver;
        if ((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.compareVersions)(ver, MIN_SW_VERSION_REQUIRE) === -1) {
            console.warn(`hls-proxy.js version should >= ${MIN_SW_VERSION_REQUIRE}`);
            return sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_PLAYLIST,
            })
        }
        if (text.indexOf('#EXTM3U') !== 0 || this.bypassLevels.indexOf((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(url)) >= 0) {
            if (logger) logger.warn('no EXTM3U delimiter or bypass audio track');
            return sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_PLAYLIST,
            })
        }
        sender.postMessage({
            action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_PLAYLIST,
            data: {
                active: true,
                debug: logger && logger.isDebugLevel,
                sharePlaylist: !!config.sharePlaylist,
            }
        })
        // console.warn(`handlePlaylist ${url}`)
        this._parsePlaylist(text, (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(url), redirectedUrl);
        // keepalive
        if (!this.workerKeepAliveInterval) {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (!config.live && reg && reg.active && reg.active.state === 'activated') {
                    const scope = new URL(reg.scope);
                    this.pathname = scope.pathname + _common_sw_sw_tool__WEBPACK_IMPORTED_MODULE_12__.proxyIdentifier;
                    const clear = () => {
                        clearInterval(this.workerKeepAliveInterval);
                        this.workerKeepAliveInterval = null;
                    }
                    this.workerKeepAliveInterval = setInterval(
                        () =>
                            (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.proxyKeepalive)(this.pathname).catch(e => { console.error(e); clear();}), 20000)
                }
            })
        }
    }

    _parsePlaylist(text, url, redirectedUrl, reused = false) {
        // console.warn(`url ${url} redirectedUrl ${redirectedUrl}`)
        const originalUrl = url;
        if (redirectedUrl) url = redirectedUrl;
        const { config, logger } = this;
        // Check if chunk-list or master. handle empty chunk list case (first EXTINF not signaled, but TARGETDURATION present)
        if (text.indexOf('#EXTINF:') > 0 || text.indexOf('#EXT-X-TARGETDURATION:') > 0) {
            let playlistLevel = 0;
            const level = _common_hls_m3u8_parser__WEBPACK_IMPORTED_MODULE_6__["default"].parseLevelPlaylist(text, url);
            // console.warn(this.levels.length)
            if (this.levels.length > 1) {
                // console.warn(getNetUrl(level.url))
                playlistLevel = this.levels.indexOf((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(level.url));
                // console.warn(`playlistLevel ${playlistLevel}`);
                if (playlistLevel === -1) {
                    this.restartP2p();
                    this.currentSrc = originalUrl;
                    playlistLevel = 0;
                } else {
                    this.currentLevelIndex = playlistLevel;
                }
            } else {
                // console.warn(`currentSrc ${this.currentSrc} originalUrl ${originalUrl}`);
                // 播放的是单码率
                if (this.currentSrc !== '' && originalUrl !== this.currentSrc) {
                    this.restartP2p();
                }
                this.currentSrc = originalUrl;
                this.levels = [(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(url)];
            }
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].LEVEL_LOADED, level);
            // const { fragMap } = config.scheduler;
            if (config.live) {
                (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.trimMap)(this.fragMap, 200);
            }
            level.fragments.forEach(frag => {
                frag.level = playlistLevel;
                // console.warn(JSON.stringify(frag))
                let url = url_toolkit__WEBPACK_IMPORTED_MODULE_10___default().buildAbsoluteURL(frag.baseurl, frag.relurl, { alwaysNormalize: true });
                const byteRange = frag.byteRange;
                if (byteRange.length === 2) {
                    url = `${url}|bytes=${byteRange[0]}-${byteRange[1]-1}`;
                }
                // console.warn(`fragMap.set ${url}`);
                this.fragMap.set(url, frag);
            });
            if (!reused && config.sharePlaylist && config.scheduler && !config.scheduler.isMobileNet) {
                config.scheduler.broadcastPlaylist((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(url), text);
            }
            // console.warn(fragMap.keys())
        } else {
            const levels = _common_hls_m3u8_parser__WEBPACK_IMPORTED_MODULE_6__["default"].parseMasterPlaylist(text, url)
            // console.warn(JSON.stringify(levels, null, 2))
            if (this.currentSrc !== '') {
                this.restartP2p();
            }
            if (levels.length > 0) {
                // sort level on bitrate
                levels.sort((a, b) => a.bitrate - b.bitrate);
                this.levels = levels.map(level => (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(level.url));
                // console.warn(JSON.stringify(this.levels))
                let audioTracks = [];
                ['AUDIO', 'SUBTITLES', 'CLOSED-CAPTIONS'].forEach(item => {
                    const tracks = _common_hls_m3u8_parser__WEBPACK_IMPORTED_MODULE_6__["default"].parseMasterPlaylistMedia(text, url, item);
                    if (item === 'AUDIO') {
                        audioTracks = tracks;
                    }
                    tracks.forEach(track => {
                        if (track.url) {
                            // console.warn(getNetUrl(track.url))
                            this.bypassLevels.push((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(track.url));
                        }
                    });
                })
                // console.warn(audioTracks)
                if (audioTracks.length > 0) {
                    if (config.segmentId === _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.sequentialSegmentIdGenerator || !config.segmentId) {
                        // console.warn(`audio track detected, use strict hlsSegmentIdGenerator`);
                        config.segmentId = _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.strictSegmentIdGenerator;
                    }
                }
            }
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].MANIFEST_PARSED, levels, originalUrl);
        }
        if (!config.segmentId) {
            this.config.segmentId = config.strictSegmentId ? _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.strictSegmentIdGenerator : _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.sequentialSegmentIdGenerator;
        }
        // console.warn(config.segmentId)
    }

    handleGetPlaylist(data, sender) {
        const { config, logger } = this;
        if (!logger) {
            return sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_PLAYLIST,
            })
        }
        const { scheduler } = config;
        if (!scheduler) {
            logger.warn(`scheduler not found`);
            return
        }
        const { url } = data;
        const netUrl = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(url);
        if (scheduler.playlistInfo.has(netUrl)) {
            const playlist = scheduler.getPlaylistFromPeer(netUrl);
            if (playlist && playlist.data) {
                const { data, seq } = playlist;
                logger.info(`got playlist from peer seq ${seq}`);
                sender.postMessage({
                    action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_PLAYLIST,
                    data: {
                        text: data,
                    }
                })
                this._parsePlaylist(data, (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.getNetUrl)(url), undefined, true);
                return
            }
        }
        return sender.postMessage({
            action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_PLAYLIST,
        })
    }

    async registerServiceWorker() {
        const { logger, config } = this;
        if (!this.swSupported) {
            let msg = `sw is not supported`;
            if (!_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_4__.isHttps) {
                msg = `https is required when using ServiceWorker`
                console.warn(msg)
            }
            return Promise.reject(msg);
        }
        this.media = (0,_common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.tryGetMediaElement)(config.mediaElem);
        if (!this.media) {
            if (logger) logger.warn(`no video element found`);
        }
        return _index_engine__WEBPACK_IMPORTED_MODULE_13__["default"].registerServiceWorker(config)
    }

    async unregisterServiceWorker() {
        clearInterval(this.workerKeepAliveInterval);
        this.workerKeepAliveInterval = null;
        const msg = 'serviceWorker is not registered';
        return new Promise((resolve, reject) => {
            const { serviceWorker } = navigator;
            if (!serviceWorker) reject(msg);
            serviceWorker.getRegistration().then(reg => {
                if (reg) {
                    reg.unregister().then(() => {
                        resolve();
                    }).catch(e => {
                        reject(e)
                    })
                } else {
                    reject(msg)
                }
            });
        })
    }

    async _init(channel, browserInfo) {
        // console.warn(`_init`)
        if (!this.p2pEnabled || typeof self === 'undefined') return
        const { logger } = this;
        try {
            await this.initSegmentManager();
        } catch (e) {
            if (logger) logger.warn(e);
            return
        }
        if (!browserInfo.live) {
            // config.trickleICE = true;
            browserInfo.tag = this.getTagForVod();
            if (this.media) browserInfo.pos = Math.round(this.media.currentTime);
        }

        //实例化Fetcher
        let fetcher = new _core_server__WEBPACK_IMPORTED_MODULE_7__["default"](this, this.config.token, encodeURIComponent(channel), this.config.announce || '', browserInfo);
        this.fetcher = fetcher;
        this.config.fetcher = fetcher;

        const mediaTimer = setInterval(() => {
            if (this.media) {
                clearInterval(mediaTimer);
                this.watchRebuffering(this.media);
            } else {
                this.media = (0,_common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.tryGetMediaElement)(this.config.mediaElem);
            }
        }, 3000)

        let scheduler = new _hls_sw_scheduler__WEBPACK_IMPORTED_MODULE_8__["default"](this, this.config);
        scheduler.bufferManager = this.bufMgr;
        scheduler.fragMap = this.fragMap;
        //实例化tracker服务器
        this.tracker = new _core_tracker_client__WEBPACK_IMPORTED_MODULE_9__["default"](this, fetcher, scheduler, this.config);

        this.config.scheduler = this.tracker.scheduler;

        // 连接tracker
        if (this.p2pEnabled && !this.tracker.connected) {
            this.tracker.resumeP2P();
        }

        this.setupWindowListeners();
    }

    restartP2p() {
        if (this.logger) this.logger.warn(`restart P2P`);
        this.disableP2P();
        this.enableP2P();
        if (!this.config.strictSegmentId && this.config.segmentId === _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.strictSegmentIdGenerator) {
            if (this.logger) this.logger.warn("reset hlsSegmentIdGenerator")
            this.config.segmentId = null;
        }
        this.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].LEVEL_LOADED, this.onLevelLoaded);
        this.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].MANIFEST_PARSED, this.onManifestParsed);
        this.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, this.onFragLoaded);
    }

    // override
    enableP2P() {
        if (!this.p2pEnabled) {
            if (this.logger) this.logger.info(`enable P2P`);
            this.config.p2pEnabled = this.p2pEnabled = true;
            return this;
        }
        return null;
    }

    disableP2P() {
        if (this.logger) this.logger.warn(`disable P2P`);       // 防止在未初始化时就调用
        if (this.offEventRebuffer) this.offEventRebuffer();
        // console.warn(`this.p2pEnabled ${this.p2pEnabled}`)
        if (this.p2pEnabled) {
            this.config.p2pEnabled = this.p2pEnabled = false;
            if (this.tracker && this.tracker instanceof _core_tracker_client__WEBPACK_IMPORTED_MODULE_9__["default"]) {
                // console.warn('this.tracker.stopP2P')
                this.tracker.stopP2P();
                this.tracker = {};
                this.fetcher = null;
                this.bufMgr.destroy();
                this.bufMgr = null;
            }
        }
        this.levels = [];
        // this.bypassLevels = [];
        this.currentLevelIndex = 0;
        this.lastLevel = 0;
        this.multiBitrate = false;
        this.rangeTested = false;
        this.currentSrc = '';
        this.media = undefined;
        this.config.live = false;
        this.removeAllListeners(_events__WEBPACK_IMPORTED_MODULE_1__["default"].MANIFEST_PARSED);
        this.removeAllListeners(_events__WEBPACK_IMPORTED_MODULE_1__["default"].LEVEL_LOADED);
        clearInterval(this.workerKeepAliveInterval);
        this.workerKeepAliveInterval = null;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HlsSwP2pEngine);


/***/ }),

/***/ "./src/hls-next/hls-sw/scheduler.js":
/*!******************************************!*\
  !*** ./src/hls-next/hls-sw/scheduler.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/scheduler */ "./src/hls-next/common/scheduler.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! .././events */ "./src/hls-next/events.js");
/* harmony import */ var _core_segment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/segment */ "./src/core/segment.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/utils/queue-microtask */ "./src/core/utils/queue-microtask.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_synthesizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/synthesizer */ "./src/hls-next/common/synthesizer.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _common_utils_segment_builder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/utils/segment-builder */ "./src/hls-next/common/utils/segment-builder.js");
/* harmony import */ var _common_segment_state__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/segment-state */ "./src/hls-next/common/segment-state.js");
/* harmony import */ var _common_utils_error_code__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/utils/error-code */ "./src/hls-next/common/utils/error-code.js");
/* harmony import */ var _hlsjs_utils_fetch_loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../hlsjs/utils/fetch-loader */ "./src/hls-next/hlsjs/utils/fetch-loader.js");
/* harmony import */ var _common_sw_sw_tool__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../common/sw/sw-tool */ "./src/common/sw/sw-tool.js");












const SW_BUFFER_DURATION = 6.8;    // 6.8不能随便改！！！

class HlsSwScheduler extends _common_scheduler__WEBPACK_IMPORTED_MODULE_0__["default"] {

    constructor(engine, config) {
        super(engine, config);
        this.server = config.fetcher;
        this.p2pEnabled = engine.p2pEnabled;

        // 传输控制
        this.resolveMap = new Map();                           // sn -> promise
        this.dcDownloadTimeout = config.live ? 5 : 9;

        // this.fragMap = new Map();                 // url -> {duration, sn, baseurl }
        this.segmentId = config.segmentId;
        this.segmentBypass = typeof config.segmentBypass === 'function' ? config.segmentBypass : () => false;
        if (this.config.httpStreamEnabled === true) {
            this.streamEnabled = (0,_hlsjs_utils_fetch_loader__WEBPACK_IMPORTED_MODULE_9__.fetchSupported)();
        } else {
            this.streamEnabled = false;
        }

    }

    async handleGetMediaData(data, sender) {
        const { logger, engine } = this;
        let { url, range } = data;
        const frag = this._getFrag(url, range);
        if (!frag) {
            logger.warn(`cannot get frag ${url}`);
            return sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
            })
        }
        if (this.segmentBypass(url, frag.tagList)) {
            logger.info(`bypass frag ${url}`);
            return sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
            })
        }
        engine.currentLevelIndex = frag.level;
        const { sn, level } = frag;
        // console.warn(`frag request url ${url} sn ${sn} range ${range}`);
        const segId = this.segmentId(String(level), sn, url, range);
        const duplicateRequest = segId === this.loadingSegId;
        if (duplicateRequest) logger.warn(`duplicate request ${segId}`);
        this.loadingSN = sn;
        if (engine.bufMgr) engine.bufMgr.loadingSN = sn;
        this.loadingSegId = segId;
        const seg = await this.bufMgr.getSegById(segId);
        if (seg) {
            logger.info(`bufMgr found seg sn ${sn} segId ${segId}`);
            frag.loaded = seg.data.byteLength;
            frag.fromPeerId = seg.fromPeerId;
            engine.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, {
                url,
                sn,
                level,
                segId,
                loaded: frag.loaded,
                duration: frag.duration,
                byP2p: true,
                fromPeerId: seg.fromPeerId,
            });
            this._onFragLoaded(url, frag);
            return sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA,
                data: {
                    url,
                    buffer: seg.data,
                }
            })
        }
        let bufferedDuration = this.getBufferedDuration();
        if (bufferedDuration > SW_BUFFER_DURATION) {
            bufferedDuration = SW_BUFFER_DURATION
        }
        logger.info(`handleGetMediaData sn ${sn} bufferedDuration ${bufferedDuration}`);
        let timeout = (bufferedDuration - this.config.httpLoadTime) * 1000;
        if (timeout < 0) timeout = 0;
        if (this.resolveMap.has(sn) || duplicateRequest) {
            // 触发syn返回下载的部分数据
            let synthesizer = this.requestingMap.get(sn, level);
            if (synthesizer || duplicateRequest) {
                if (synthesizer) {
                    logger.warn(`${sn} is requesting, terminate syn wait for seg`);
                    synthesizer.terminate();
                }
                let timer = setTimeout(() => {
                    logger.info(`notify seg ${sn} timeout`);
                    timer = -1;
                    sender.postMessage({
                        action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
                    })
                }, timeout)
                this.bufMgr.once(`${_events__WEBPACK_IMPORTED_MODULE_1__["default"].BM_ADDED_SN_}${sn}`, seg => {
                    if (timer < 0) return
                    if (seg && seg.level === level) {
                        clearTimeout(timer);
                        logger.info(`notify seg ${seg.sn}`);
                        sender.postMessage({
                            action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA,
                            data: {
                                url,
                                buffer: seg.data,
                            }
                        })
                    }
                });
            } else {
                // http download
                logger.warn(`${sn} is requesting, fallback`)
                sender.postMessage({
                    action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
                })
            }
            return
        }
        if (this.hasAndSetTargetPeer(sn, level, segId, bufferedDuration)) {
            // if (false) {
            const loaded = await this._loadFragByP2p(frag, sender, sn, segId, url, level, range, timeout);
            if (!loaded) {
                // http download
                sender.postMessage({
                    action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
                })
            }
        } else {
            // console.warn(`live ${config.live} this.hasIdlePeers ${this.hasIdlePeers} bufferedDuration ${bufferedDuration}`)
            const synthesizer = this.requestingMap.get(sn, level);
            if (this.httpRangeSupported && synthesizer && synthesizer.segId === segId && synthesizer.hasPartialBuffer()) {
                // 如果syn有一部分，只需补片
                logger.warn(`syn has partial buffer for ${segId}`);
                // synthesizer.terminate();
                synthesizer.setTimeout(timeout);
            } else {
                // http download
                this._loadFragByHttp(frag, sender, sn, segId, url, level, range, SW_BUFFER_DURATION * 1000)
            }
        }
    }

    _loadFragByHttp(frag, sender, sn, segId, url, level, range, timeout) {
        // console.warn(`loadFragByHttp ${segId}`)
        const proxiedUrl = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.appendQueryParamOfUrl)(url, _common_sw_sw_tool__WEBPACK_IMPORTED_MODULE_10__.proxyIdentifier, true);
        const httpLoader = new _hlsjs_utils_fetch_loader__WEBPACK_IMPORTED_MODULE_9__.FetchLoader({})
        let context = {
            url: proxiedUrl,
            ...(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.getRangeFromRangeStr)(range),
        }
        const config = {
            timeout    // todo 验证
        }
        const callbacks = {
            onError: (error, context, networkDetails) => {
                this.logger.error(networkDetails);
                sender.postMessage({
                    action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
                })
            },
            onTimeout: () => {
                this.logger.warn(`http load timeout`);
                sender.postMessage({
                    action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA
                })
            },
            onSuccess: async (response) => {
                this.notifyAllPeers(sn, level, segId);
                const { data } = response
                if (!await this.bufMgr.hasSegOfId(segId)) {
                    // console.warn(`byteLength ${data.byteLength}`)
                    // console.warn(response)
                    const targetBuffer = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.copyBuffer)(data).buffer;
                    const segment = new _core_segment__WEBPACK_IMPORTED_MODULE_2__["default"](sn, segId, targetBuffer, '', level);
                    this.bufMgr.putSeg(segment);
                    // 上报流量
                    this.reportTraffic(data.byteLength, 0, 0);
                }
                this.segmentBuilderMap.delete(sn, level);
                frag.segId = segId;
                frag.loaded = data.byteLength;
                this.engine.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, {
                    url,
                    sn,
                    level,
                    segId,
                    loaded: frag.loaded,
                    duration: frag.duration,
                    byP2p: false,
                });
                this._onFragLoaded(url, frag);
                sender.postMessage({
                    action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA,
                    data: {
                        url,
                        buffer: data,
                    }
                })
            }
        }
        if (this.streamEnabled) {
            // http streaming
            if (!this.isMobileNet) {
                this.notifyAllPeers(sn, level, segId, _common_segment_state__WEBPACK_IMPORTED_MODULE_7__.SegmentState.PARTIAL_FORWARD);
            }
            let segmentBuilder;
            callbacks.onBodyStart = (total) => {
                // console.warn(`onBodyStart total ${total}`)
                if (!segmentBuilder && total > 0) {
                    segmentBuilder = new _common_utils_segment_builder__WEBPACK_IMPORTED_MODULE_6__["default"](sn, level, segId, total);
                    if (!this.segmentBuilderMap.has(sn, level)) {
                        this.segmentBuilderMap.set(sn, level, segmentBuilder);
                    }
                }
            }
            callbacks.onUpdate = (buffer, done, aborted) => {
                if (aborted) {
                    this.segmentBuilderMap.delete(sn, level);
                    return
                }
                if (segmentBuilder) segmentBuilder.receiveBytes(buffer, done);
            }
        }
        httpLoader.load(context, config, callbacks);
    }

    async _loadFragByP2p(frag, sender, sn, segId, url, level, range, timeout) {
        const { logger } = this;
        logger.info(`p2p load sn ${sn} segId ${segId} level ${level}`);
        const resp = await this.load(sn, segId, level, url, range, timeout);
        if (resp && resp.data) {
            // 下载完整的才缓存
            const { data, fromPeerId, size } = resp;
            logger.info(`p2p loaded segId ${segId} level ${level} size ${data.byteLength}`);
            if (!await this.bufMgr.hasSegOfId(segId)) {
                const segment = new _core_segment__WEBPACK_IMPORTED_MODULE_2__["default"](sn, segId, data, fromPeerId, level);
                logger.info(`bufMgr putSeg ${sn} level ${level}`);
                this.bufMgr.putSeg(segment);
            }
            frag.loaded = data.byteLength;
            frag.fromPeerId = fromPeerId;
            this.engine.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, {
                url,
                sn,
                level,
                segId,
                loaded: frag.loaded,
                duration: frag.duration,
                byP2p: true,
                fromPeerId,
            });
            this._onFragLoaded(url, frag);
            sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA,
                data: {
                    url,
                    buffer: data,
                    size,
                }
            })
            return true
        }
        // p2p下载超时
        logger.warn(`P2P timeout load segId ${segId}`);
        const seg = await this.bufMgr.getSegById(segId);
        if (seg) {
            // 已经下载过了 复用
            logger.info(`already loaded seg sn ${sn} segId ${segId}`);
            // const seg = this.bufMgr.getSegById(segId);
            sender.postMessage({
                action: _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA,
                data: {
                    url: url,
                    buffer: seg.data,
                }
            })
            return true
        }
        return false
    }

    notifySWMessage(action, data, sender) {
        switch (action) {
            case _events__WEBPACK_IMPORTED_MODULE_1__["default"].SW_GET_MEDIA:
                this.server.increMediaRequests();
                this.handleGetMediaData(data, sender);
                break;
            default:
                this.logger.warn(`unknown action ${action}`);
        }
    }

    _getFrag(url, range) {
        if (range) {
            url = `${url}|${range}`;
        }
        // console.warn(`get frag ${url}`)
        return this.fragMap.get(url);
    }

    // override
    destroy() {
        super.destroy();
        this.logger.warn(`destroy HlsSwScheduler`);
    }

    _onFragLoaded(url, frag) {
        this.updateLoaded(frag.sn, frag.level, frag.segId);
        // update play sn
        if (!this.engine) return
        const { media, targetDuration } = this.engine;
        if (!this.config.live && media && targetDuration) {
            this.currPlaySN = Math.ceil(media.currentTime/targetDuration);
            // console.warn(`currPlaySN ${this.currPlaySN}`)
        }
    }

    load(sn, segId, level, url, range, loadTimeout) {
        const { logger, config } = this;
        this.isReceiver = true;
        const {forwardPeer, reversePeer} = this.targetPeers;
        if (!forwardPeer && !reversePeer) {
            loadTimeout -= 1.0
        }
        let synthesizer = this.requestingMap.get(sn, level);
        let ext = {
            ...(0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.getRangeFromRangeStr)(range),
            proxied: true,
            url,
            segId,
            httpLoadTime: config.httpLoadTime * 1000,
        }
        if (!synthesizer) {
            synthesizer = new _common_synthesizer__WEBPACK_IMPORTED_MODULE_4__["default"](this.coordinator, this.logger, sn, level, segId, this.httpRangeSupported, ext);
            this._setupSynthesizer(synthesizer);
            this.requestingMap.set(sn, level, synthesizer);
        } else {
            synthesizer.setExtra(ext)
        }
        if (forwardPeer) {
            synthesizer.setForwardPeer(forwardPeer);
            forwardPeer.requestDataById(segId, sn, true, { level });
        }
        if (reversePeer) {
            synthesizer.setReversePeer(reversePeer);
            reversePeer.requestDataById(segId, sn, true, { level, reverse: true });
        }
        if (synthesizer.isEmpty()) {
            loadTimeout = 0;
        }
        logger.info(`syn setTimeout ${loadTimeout}`);
        synthesizer.setTimeout(loadTimeout);
        const promise = new Promise((resolve => {
            const promise = {
                resolve,
                sn,
                level,
                segId,
            };
            this.resolveMap.set(sn, promise);
        }));
        this.targetPeers = {};          // 重置
        return promise;
    }

    _setupSynthesizer(synthesizer) {
        synthesizer.on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_OUTPUT, (segment, info) => {
            const { config, logger } = this;
            const { segId, sn, data, level } = segment;
            // console.warn(`SYN_OUTPUT ${level}-${sn}`)
            const { speed, http, p2p } = info;
            this._handleSynOutput(http);
            const isCritical = this.resolveMap.has(sn);
            const verified = config.validateSegment(segId, new Uint8Array(data));    // 对数据进行校验，防止节点作恶
            if (verified) {
                this.notifyAllPeers(sn, level, segId);
                if (!this.bitset.has(sn, level)) {
                    // 上报流量
                    this.reportTraffic(http, p2p, speed);
                }
                const fromPeerId = synthesizer.getFromPeerId();
                if (isCritical) {
                    logger.info(`receive criticalSeg seg_id ${segId}`);
                    const promise = this.resolveMap.get(sn);
                    this.resolveMap.delete(sn);
                    promise.resolve({ data, fromPeerId: fromPeerId });
                } else {
                    // 判断是否已经存储过了
                    if (!this.bitset.has(sn, level)) {
                        this.bufMgr.putSeg(segment);
                        this.updateLoaded(sn, level, segId);                                // 只有预加载请求需要
                    }
                }
            } else {
                logger.error(`segment ${segId} validate failed`);
                if (isCritical) {
                    const promise = this.resolveMap.get(sn);
                    this.resolveMap.delete(sn);
                    promise.resolve();
                }
            }
            this.requestingMap.delete(sn, level);
        })
            .on(_events__WEBPACK_IMPORTED_MODULE_1__["default"].SYN_ERROR, (pieceMsg, code) => {
                const { logger } = this;
                const { sn, level } = pieceMsg;
                console.warn(`SYN_ERROR ${level}-${sn}`)
                if (this.resolveMap.has(sn)) {
                    const promise = this.resolveMap.get(sn);
                    this.resolveMap.delete(sn);
                    promise.resolve();
                }
                if (code === _common_utils_error_code__WEBPACK_IMPORTED_MODULE_8__["default"].ERROR_SYN_ABORT && synthesizer.hasPartialBuffer()) {
                    logger.warn(`syn abort with partial buffer`);
                } else {
                    this.requestingMap.delete(sn, level);
                    this._handleSynError(code);
                }
            })
    }

    _handleDCHave(peer, sn, level, segId, state) {
        const isCritical = this.resolveMap.size !== 0;
        this._notifySynthesizer(peer, segId, sn, level, state);
        if (this.config.live && !isCritical) {
            _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3___default()(() => {                                                   //必须是异步回调
                this.checkPeers();
            })
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HlsSwScheduler);


/***/ }),

/***/ "./src/hls-next/hlsjs.p2pengine.js":
/*!*****************************************!*\
  !*** ./src/hls-next/hlsjs.p2pengine.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/engine */ "./src/hls-next/common/engine.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/hls-next/events.js");
/* harmony import */ var _core_peer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/peer */ "./src/core/peer.js");
/* harmony import */ var _core_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/server */ "./src/core/server.js");
/* harmony import */ var _core_tracker_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/tracker-client */ "./src/core/tracker-client.js");
/* harmony import */ var _hlsjs_frag_loader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hlsjs/frag-loader */ "./src/hls-next/hlsjs/frag-loader.js");
/* harmony import */ var _hlsjs_playlist_loader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hlsjs/playlist-loader */ "./src/hls-next/hlsjs/playlist-loader.js");
/* harmony import */ var _hlsjs_utils_tool_funs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hlsjs/utils/tool-funs */ "./src/hls-next/hlsjs/utils/tool-funs.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _core_utils_err_code__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../core/utils/err-code */ "./src/core/utils/err-code.js");
/* harmony import */ var _core_utils_err_code__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_utils_err_code__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _hlsjs_scheduler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./hlsjs/scheduler */ "./src/hls-next/hlsjs/scheduler.js");
/* harmony import */ var _hlsjs_utils_fetch_loader__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hlsjs/utils/fetch-loader */ "./src/hls-next/hlsjs/utils/fetch-loader.js");
/* harmony import */ var _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./common/utils/tool-funs */ "./src/hls-next/common/utils/tool-funs.js");














class HlsjsP2pEngine extends _common_engine__WEBPACK_IMPORTED_MODULE_0__["default"] {
    static get name() {
        return 'HlsjsP2pEngine'
    }
    constructor(hlsjs, p2pConfig = {}) {
        super(p2pConfig);
        if (!hlsjs) {
            throw new TypeError('hlsjs instance is null')
        }
        this.hlsjs = hlsjs;
        this.HLSEvents = hlsjs.constructor.Events;
        const version = hlsjs.constructor.version;
        this.config.isHlsV0 = version && version.split('.')[0] === '0';
        // console.warn(`isHlsV0 ${this.config.isHlsV0}`);
        this.config.xhrSetup = hlsjs.config.xhrSetup;
        // console.warn(`this.config.streamEnabled ${this.config.streamEnabled}`);
        if (this.config.httpStreamEnabled === true) {
            hlsjs.config.streamEnabled = (0,_hlsjs_utils_fetch_loader__WEBPACK_IMPORTED_MODULE_11__.fetchSupported)();
        }
        const { channelIdMaker, signalId, browserInfo } = this.setup();

        // hlsjs.config.segmentId = this.config.segmentId;

        if (this.config.waitForPeer && this.config.sourceUrl) {
            this.config.trickleICE = true;
            this.config.httpRangeSupported = true;
            this._startEngine(this.config.sourceUrl, this.config.live, browserInfo, channelIdMaker, signalId);
        } else {
            this.config.waitForPeer = false
        }

        const onLevelLoaded = (event, data) => {
            // console.warn(`onLevelLoaded`)
            if (!data) return
            const { config } = this;
            const details = data.details;
            const isLive = details.live;
            if (!this.config.waitForPeer) {
                this._startEngine(this.hlsjs.url, isLive, browserInfo, channelIdMaker, signalId, details);
            } else {
                if (this.tracker) this.tracker.scheduler.startWaitPeerTimer();
            }

            // logger.info(JSON.stringify(details));
            if (config.waitForPeer) {
                this.logger.info(`waitForPeer mode`)
            }

            hlsjs.off(this.HLSEvents.LEVEL_LOADED, onLevelLoaded);

        };

        hlsjs.on(this.HLSEvents.LEVEL_LOADED, onLevelLoaded);

        const onLevelLoaded2 = (event, data) => {
            if (!data) return
            // console.warn(`onLevelLoaded2`)
            // console.warn(data.details.fragments.length)
            const { config } = this;
            const { fragments } = data.details;
            config.httpLoadTime = this.determineHttpLoadTime(fragments);
            // console.warn(config.httpLoadTime)
        }

        if (this.config.httpLoadTime === 0) {
            if (this.config.live) {
                hlsjs.on(this.HLSEvents.LEVEL_LOADED, onLevelLoaded2);
            } else {
                this.config.httpLoadTime = 2.5;
            }
        }

        const onManifestParsed = (event, data) => {
            // console.warn(`onManifestParsed`)
            // console.warn(data)
            const { config } = this;
            if (data.audioTracks && data.audioTracks.length > 0) {
                // has audio track
                // console.warn(`audio track detected, use strict hlsSegmentIdGenerator`);
                if (!config.strictSegmentId && !config.segmentId) {
                    config.segmentId = _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_12__.strictSegmentIdGenerator;
                }
            }
            if (!config.segmentId) {
                this.config.segmentId = config.strictSegmentId ? _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_12__.strictSegmentIdGenerator : _common_utils_tool_funs__WEBPACK_IMPORTED_MODULE_12__.sequentialSegmentIdGenerator;
            }
            // console.warn(config.segmentId)
            const levels = data.levels.length;
            this.multiBitrate = levels > 1;

            hlsjs.off(this.HLSEvents.MANIFEST_PARSED, onManifestParsed);
        };

        hlsjs.on(this.HLSEvents.MANIFEST_PARSED, onManifestParsed);

        hlsjs.on(this.HLSEvents.DESTROYING, () => {
            // console.warn('destroying hlsjs');
            hlsjs.off(this.HLSEvents.LEVEL_LOADED, onLevelLoaded2);
            this.destroy();
        });
    }

    _startEngine(url, isLive, browserInfo, channelIdMaker, signalId, details = {}) {
        const { config } = this;
        config.live = this.hlsjs.config.live = isLive;
        // 浏览器信息
        this.browserInfo = {
            ...browserInfo,
            live: isLive,
            abr: this.multiBitrate || undefined,
            type: 'hls',
        };

        // test 分布式信令
        // this.channel = `${channelIdMaker(url, this.browserInfo)}[${Peer.VERSION}]`;
        this.channel = `${channelIdMaker(url)}|${signalId}[${_core_peer__WEBPACK_IMPORTED_MODULE_2__["default"].VERSION}]`;

        // electron
        this.setupElectron();

        //初始化logger
        const logger = this.initLogger();
        logger.info(`use HlsjsP2pEngine`);
        this.logger = this.hlsjs.config.logger = logger;
        logger.info(`channel ${this.channel}`);
        if (!isLive) {
            config.startSN = details.startSN;
            config.endSN = details.endSN;
            logger.info(`startSN ${details.startSN} endSN ${details.endSN}`);
        }
        this.eventListened = false;

        this._init(this.channel, this.browserInfo);
    }

    async _init(channel, browserInfo) {
        const { logger, config } = this;
        if (!this.p2pEnabled || typeof self === 'undefined') return

        this.hlsjs.config.p2pEnabled = this.p2pEnabled;
        this.hlsjs.config.sharePlaylist = config.sharePlaylist;

        try {
            await this.initSegmentManager();
        } catch (e) {
            logger.warn(e);
            return
        }

        // 获取media
        this.media = this.hlsjs.media;
        if (this.media) {
            this.currentSrc = this.media.src;
        }

        if (!browserInfo.live) {
            // config.trickleICE = true;
            browserInfo.tag = this.getTagForVod();
            if (this.media) browserInfo.pos = Math.round(this.media.currentTime);
        }

        //实例化Fetcher TODO 协议升级时去掉encodeURIComponent
        let fetcher = new _core_server__WEBPACK_IMPORTED_MODULE_3__["default"](this, config.token, encodeURIComponent(channel), config.announce || '', browserInfo);
        this.fetcher = fetcher;

        const scheduler = new _hlsjs_scheduler__WEBPACK_IMPORTED_MODULE_10__["default"](this, config);

        // 实例化tracker服务器
        this.tracker = new _core_tracker_client__WEBPACK_IMPORTED_MODULE_4__["default"](this, fetcher, scheduler, config);
        this.hlsjs.config.bufMgr = this.bufMgr;
        scheduler.bufferManager = this.bufMgr;
        // 替换fLoader
        this.hlsjs.config.segmentId = this.config.segmentId;
        this.hlsjs.config.fLoader = (0,_hlsjs_frag_loader__WEBPACK_IMPORTED_MODULE_5__["default"])(scheduler, fetcher, config.p2pBlackList, config.isHlsV0, config.segmentBypass);
        // 替换pLoader
        if (config.sharePlaylist) {
            this.hlsjs.config.pLoader = (0,_hlsjs_playlist_loader__WEBPACK_IMPORTED_MODULE_6__["default"])(scheduler);
        }

        this.trackerTried = false;                                                   //防止重复连接ws

        if (!this.eventListened) {
            this.hlsjs.on(this.HLSEvents.FRAG_LOADING, this._onFragLoading.bind(this));

            this.hlsjs.on(this.HLSEvents.FRAG_LOADED, this._onFragLoaded.bind(this));

            this.hlsjs.on(this.HLSEvents.FRAG_CHANGED, this._onFragChanged.bind(this));

            this.hlsjs.on(this.HLSEvents.ERROR, this._onHlsError.bind(this));

            this.eventListened = true;
        }

        this.setupWindowListeners();

        if (!this.trackerTried && !this.tracker.connected && config.p2pEnabled) {

            this.tracker.resumeP2P();
            this.trackerTried = true;
        }
    }

    _onFragLoading(id, data) {
        // console.warn(data.frag.type);
        // console.warn(`FRAG_LOADING: ${data.frag.sn} loadByHTTP ${data.frag.loadByHTTP}`);
        // console.warn(this.hlsjs.config.lowLatencyMode)
        // console.warn(JSON.stringify(data, null, 2));
        // console.warn(this.hlsjs.config);
        const frag = data.frag;
        let {sn, level, segId} = frag;
        if (!(0,_hlsjs_utils_tool_funs__WEBPACK_IMPORTED_MODULE_7__.isBlockType)(frag.url, this.config.p2pBlackList, frag.type)) {
            this.logger.debug('loading frag ' + sn);
            if (this.bufMgr) this.bufMgr.loadingSN = sn;
            if (!segId) {
                let range;
                if (frag._byteRange) {
                    range = 'bytes=' + frag._byteRange[0] + '-' + frag._byteRange[1];
                }
                let segmentUrl = frag.url;
                // if (true) {
                // if (data.part) {
                //     console.warn(data.part.relurl)
                //     segmentUrl = frag.type + data.part.relurl;
                // }
                segId = frag.segId = this.config.segmentId(String(level), frag.sn, segmentUrl, range);
            }
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADING, {
                sn,
                segId,
                byHttp: frag.loadByHTTP,
                level,
            });
        }
    }

    _onFragLoaded(id, data) {
        // console.warn(`FRAG_LOADED: ${data.frag.sn} loadByHTTP ${data.frag.loadByHTTP}`);
        // console.warn('FRAG_LOADED: '+ data.frag.sn);
        // console.warn(JSON.stringify(data.frag, null, 2));
        const { frag } = data;
        const { sn, segId, loaded, duration, level, fromPeerId, loadByP2P, url } = frag;
        const { config, logger } = this;
        if (!(0,_hlsjs_utils_tool_funs__WEBPACK_IMPORTED_MODULE_7__.isBlockType)(frag.url, config.p2pBlackList, frag.type)) {
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_LOADED, {
                url,
                sn,
                level,
                segId,
                loaded,
                duration,
                byP2p: !!loadByP2P,
                fromPeerId,
            });
            // 发起Range请求
            if (!this.rangeTested && config.useHttpRange) {
                // console.warn(frag.url)
                (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_8__.performRangeRequest)(frag.url, undefined, config.xhrSetup).then(() => {
                    config.httpRangeSupported = true;
                    logger.info(`http range is supported`);
                    // config.httpLoadTime -= 1.5;
                    // if (config.httpLoadTime < 1.5) {
                    //     config.httpLoadTime = 1.5;
                    // }
                    // console.warn(`config.httpLoadTime ${config.httpLoadTime}`)
                }).catch(err => {
                    config.httpRangeSupported = false;
                    logger.warn(`http range is not supported, ${err}`);
                });
                this.rangeTested = true;
            }
        }
    }

    _onFragChanged(id, data) {
        const { frag } = data;
        if (!(0,_hlsjs_utils_tool_funs__WEBPACK_IMPORTED_MODULE_7__.isBlockType)(frag.url, this.config.p2pBlackList, frag.type)) {
            this.logger.debug('frag changed: ' + frag.sn);
            const {sn, duration} = frag;
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].FRAG_CHANGED, {sn, duration});
        }
    }

    _onHlsError(event, data) {
        if (!data) return
        const { logger } = this;
        const msg = `${data.type} details ${data.details} reason ${data.reason}`;
        if (data.fatal) {
            logger.error(msg);
        } else {
            logger.warn(msg);
        }
        // this.fetcher.exptMsg = data.details;                         // test
        const errDetails = this.hlsjs.constructor.ErrorDetails;
        switch (data.details) {
            case errDetails.BUFFER_STALLED_ERROR:
                if (this.fetcher) this.fetcher.increRebuffers();
                break;
            case errDetails.INTERNAL_EXCEPTION:
                if (data.event !== 'demuxerWorker') {
                    if (!data.error) data.error = {};
                    // console.warn(JSON.stringify(data))
                    if (this.fetcher && data.err) {
                        this.fetcher.errsInternalExpt++;
                        this.fetcher.exptMsg = `${data.error.message} event ${data.event} ua ${navigator.userAgent}`;
                    }
                    logger.error(`INTERNAL_EXCEPTION event ${data.event} err ${data.error.message}`);
                    this.emit(_events__WEBPACK_IMPORTED_MODULE_1__["default"].EXCEPTION, _core_utils_err_code__WEBPACK_IMPORTED_MODULE_9___default()(data.error, 'HLSJS_EXPT'));
                }
                break;
            default:
                // console.error(event)
                // console.error(data)
        }
    }

    get currentLevel() {
        const { currentLevel } = this.hlsjs;
        return currentLevel >= 0 ? currentLevel : 0
    }

    disableP2P() {                                              //停止p2p
        if (this.logger) this.logger.warn(`disable P2P`);       // 防止在未初始化时就调用
        // this.removeAllListeners();
        // console.warn(`this.p2pEnabled ${this.p2pEnabled}`)
        if (this.p2pEnabled) {
            this.p2pEnabled = false;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.tracker) {
                // console.warn('this.tracker.stopP2P')
                this.tracker.stopP2P();
                this.tracker = {};
                this.fetcher = null;
                this.bufMgr.destroy();
                this.bufMgr = null;
                this.hlsjs.config.fLoader = this.hlsjs.config.pLoader =  this.hlsjs.constructor.DefaultConfig.loader;
            }
        }
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HlsjsP2pEngine);


/***/ }),

/***/ "./src/hls-next/hlsjs/frag-loader.js":
/*!*******************************************!*\
  !*** ./src/hls-next/hlsjs/frag-loader.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/hls-next/hlsjs/utils/tool-funs.js");
/* harmony import */ var _core_segment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/segment */ "./src/core/segment.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/utils/queue-microtask */ "./src/core/utils/queue-microtask.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../events */ "./src/hls-next/events.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _utils_fetch_loader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/fetch-loader */ "./src/hls-next/hlsjs/utils/fetch-loader.js");
/* harmony import */ var _common_utils_segment_builder__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/utils/segment-builder */ "./src/hls-next/common/utils/segment-builder.js");
/* harmony import */ var _common_segment_state__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/segment-state */ "./src/hls-next/common/segment-state.js");











// const sha1 = require('simple-sha1');
const MIN_TIME_FOR_LOAD = 7.0;          // 留给scheduler下载的最少时间
const MAX_TIME_FOR_WAIT = 4.5;          // 等待have信号的最大时间

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(scheduler, fetcher, p2pBlackList, isHlsV0, segmentBypass) {
    return class FragLoader extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
        constructor(config) {
            super();
            this.logger = config.logger;
            //denoted by sn

            this.isHlsV0 = isHlsV0;
            this.bufMgr = config.bufMgr;
            this.streamEnabled = config.streamEnabled;
            this.httpLoader = this.streamEnabled ? new _utils_fetch_loader__WEBPACK_IMPORTED_MODULE_6__.FetchLoader(config) : new config.loader(config);
            this.p2pEnabled = config.p2pEnabled;
            this.isLive = config.live;
            this.scheduler = scheduler;
            this.fetcher = fetcher;
            this.segmentId = config.segmentId;
            this.blockTypes = p2pBlackList;
            this.forbidden = fetcher.forbidden;
            this.stats = this.httpLoader.stats || (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__.createLoadStats)();
            this.enableWorker = config.enableWorker;
            this.segmentBypass = typeof segmentBypass === 'function' ? segmentBypass : () => false
        }

        destroy() {
            this.httpLoader.destroy();
        }

        abort() {
            // console.warn(`abort`)
            this.httpLoader.abort();
        }

        /*
         首先从缓存中寻找请求的seg，如果缓存中找不到则用http请求。
         */
        async load(context, config, callbacks) {
            const { logger, scheduler } = this;
            const frag = context.frag;
            // console.warn('FRAG_LOAD: ' + context.url);
            // console.warn(frag);
            // console.warn(context);
            if (!this.isHlsV0) {
                // v1.x
                frag.stats = this.stats;
            }
            // console.warn(`frag.duration: ${frag.duration}`);
            // frag.loadByP2P = false;                //初始化flag
            // frag.loadByHTTP = false;
            // console.warn(frag.baseurl);

            let segId = context.frag.segId;
            if (!segId) {
                let range;
                if (context.rangeEnd) {
                    range = 'bytes=' + context.rangeStart + '-' + (context.rangeEnd - 1);
                }
                segId = context.frag.segId = this.segmentId(String(frag.level), frag.sn, frag.url, range);
            }

            // 音频等非ts文件不使用P2P
            // console.warn(frag.type)
            if (!frag.url || (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__.isBlockType)(frag.url, this.blockTypes, frag.type) || this.segmentBypass(frag.url, frag.tagList)) {
                logger.info(`HTTP load blockType ${frag.url}`);
                context.frag.loadByHTTP = true;
                return this.httpLoader.load(context, config, callbacks);
            }

            // 检查是否禁用SDK
            if (this.forbidden) return;

            this.fetcher.increMediaRequests();

            config.maxRetry = 2;        // TODO 验证
            const bufferedDuration = scheduler.getBufferedDuration();

            // console.warn(`load segId ${segId} hasSegOfId ${await this.bufMgr.hasSegOfId(segId)}`);
            const seg = await this.bufMgr.getSegById(segId);
            if (this.p2pEnabled && seg) {                                     //如果命中缓存
                // if (false) {                                     //如果命中缓存
                logger.info(`bufMgr found seg sn ${frag.sn} segId ${segId} level ${frag.level}`);
                const targetBuffer = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.copyBuffer)(seg.data);
                // let arrayBuffer = new Uint8Array(targetBuffer).buffer;           // 将uint8array转为arraybuffer
                let arrayBuffer = targetBuffer.buffer;           // 将uint8array转为arraybuffer
                let response = { url : context.url, data : arrayBuffer };
                (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__.updateLoadStats)(this.stats, seg.size);
                frag.loaded = seg.size;
                frag.loadByP2P = true;
                context.frag.fromPeerId = seg.fromPeerId;
                // logger.debug(`bufMgr loaded ${frag.relurl} at ${frag.sn}`);
                _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_3___default()(() => {                                                   //必须是异步回调
                    // sha1(response.data, hash => {
                    //     console.warn(`${segId} ${hash}`)
                    // })
                    if (!this.isHlsV0 && callbacks.onProgress) callbacks.onProgress(this.stats, context, response.data);
                    callbacks.onSuccess(response, this.stats, context);
                })
                return
            }

            if (this.p2pEnabled && scheduler.hasAndSetTargetPeer(frag.sn, frag.level, frag.segId, bufferedDuration)) {  //如果在peers的bitmap中找到
                // console.warn(`loadFragByP2p ${frag.sn}`)
                this.loadFragByP2p(context, config, callbacks, segId);
                return
            }

            if (scheduler.waitForPeer) {
                logger.warn(`waitPeerNotifier start`)
                scheduler.waitingSeg = {
                    sn: frag.sn,
                    level: frag.level,
                }
                await scheduler.waitPeerNotifier();
                logger.warn(`waitPeerNotifier end`)
                if (this.p2pEnabled && scheduler.hasAndSetTargetPeer(frag.sn, frag.level, frag.segId, bufferedDuration)) {  //如果在peers的bitmap中找到
                    // console.warn(`loadFragByP2p ${frag.sn}`)
                    this.loadFragByP2p(context, config, callbacks, segId);
                    return
                }
            }

            logger.info(`fragLoader load ${segId} at ${frag.sn} level ${frag.level} buffered ${bufferedDuration*1000}`);
            if (this.isLive && scheduler.hasPeers && bufferedDuration > MIN_TIME_FOR_LOAD && scheduler.shouldWaitForNextSeg()) {
                // if (bufferedDuration > MIN_TIME_FOR_LOAD) {     // test
                let waitFor = bufferedDuration - MIN_TIME_FOR_LOAD;
                if (waitFor > MAX_TIME_FOR_WAIT) waitFor = MAX_TIME_FOR_WAIT;
                const onPeerHave = segIdHave => {
                    // console.warn(`SCH_DCHAVE ${segIdHave}`);
                    if (segIdHave === segId) {
                        scheduler.off(_events__WEBPACK_IMPORTED_MODULE_4__["default"].SCH_DCHAVE, onPeerHave);    // 防止重复触发
                        clearTimeout(this.waitTimer);
                        if (scheduler.hasAndSetTargetPeer(frag.sn, frag.level, frag.segId, bufferedDuration)) {
                            this.loadFragByP2p(context, config, callbacks, segId);
                        } else {
                            this.loadFragByHttp(context, config, callbacks, segId);
                        }
                    }
                };
                logger.info(`wait peer have for ${waitFor}s`);
                scheduler.on(_events__WEBPACK_IMPORTED_MODULE_4__["default"].SCH_DCHAVE, onPeerHave);
                this.waitTimer = setTimeout(() => {
                    this.loadFragByHttp(context, config, callbacks, segId);
                    scheduler.off(_events__WEBPACK_IMPORTED_MODULE_4__["default"].SCH_DCHAVE, onPeerHave);
                }, waitFor*1000);
            }
            else {
                const synthesizer = scheduler.requestingMap.get(frag.sn, frag.level);
                if (scheduler.httpRangeSupported && synthesizer && synthesizer.segId === frag.segId && synthesizer.hasPartialBuffer()) {
                    // 如果syn有一部分，只需补片
                    logger.warn(`syn has partial buffer for ${frag.segId}`);
                    this.loadFragByP2p(context, config, callbacks, segId);
                } else {
                    this.loadFragByHttp(context, config, callbacks, segId);
                }
            }
        }

        loadFragByHttp(context, config, callbacks, segId) {
            const { logger, scheduler } = this;
            const { segmentBuilderMap } = scheduler;
            scheduler.isReceiver = false;
            const frag = context.frag;
            const { sn, level } = frag;
            if (this.streamEnabled) {
                if (!scheduler.isMobileNet) {
                    scheduler.notifyAllPeers(sn, level, segId, _common_segment_state__WEBPACK_IMPORTED_MODULE_8__.SegmentState.PARTIAL_FORWARD);
                }
                let segmentBuilder;
                callbacks.onUpdate = (buffer, done, aborted) => {
                    if (aborted) {
                        segmentBuilderMap.delete(sn, level);
                        return
                    }
                    if (segmentBuilder) segmentBuilder.receiveBytes(buffer, done);
                    // console.warn(`onUpdate segId ${segId} size ${buffer.byteLength} done ${done}`)
                }
                callbacks.onBodyStart = (total) => {
                    // console.warn(`onBodyStart ${total}`)
                    if (!segmentBuilder && total > 0) {
                        // if (!scheduler.isMobileNet) {
                        //     scheduler.notifyAllPeers(sn, level, segId, SegmentState.PARTIAL_FORWARD);
                        // }
                        segmentBuilder = new _common_utils_segment_builder__WEBPACK_IMPORTED_MODULE_7__["default"](sn, level, segId, total);
                        if (!segmentBuilderMap.has(sn, level)) {
                            segmentBuilderMap.set(sn, level, segmentBuilder);
                        }
                    }
                }
            }

            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = async (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                if (!await this.bufMgr.hasSegOfId(segId)) {
                    // console.warn(`byteLength ${response.data.byteLength}`)
                    // console.warn(response.data)
                    const targetBuffer = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.copyBuffer)(response.data).buffer;
                    const segment = new _core_segment__WEBPACK_IMPORTED_MODULE_2__["default"](sn, segId, targetBuffer, this.fetcher.peerId, level);
                    this.bufMgr.putSeg(segment);

                    // test  wait/notify
                    // setTimeout(() => {
                    //     this.bufMgr.putSeg(segment);
                    // }, 3000)
                }
                segmentBuilderMap.delete(sn, level);
                // console.warn(`stats.retry ${stats.retry} config.maxRetry ${config.maxRetry} config.retryDelay ${config.retryDelay}`);
                this.fetcher.reportFlow(stats.total);
                // console.warn(`this.isHlsV0 ${this.isHlsV0}`)
                let tTotal = stats.tload - stats.trequest;
                logger.info(`HTTP loaded ${segId} time ${tTotal}`);
                scheduler.notifyAllPeers(sn, level, segId);
                // sha1(response.data, hash => {
                //     console.warn(`${segId} ${hash}`)
                // })
                onSuccess(response, stats, context);
            };

            const onProgress = callbacks.onProgress;
            callbacks.onProgress = (stats, context, data) => {
                // console.warn(`onProgress ${context.url} ${stats.loaded}`)
                // callbacks.onProgress = onProgress;
                frag.loaded = stats.total;
                onProgress(stats, context, data && this.enableWorker ? (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.copyBuffer)(data).buffer : data);
            };

            context.frag.loadByHTTP = true;
            this.httpLoader.load(context, config, callbacks);
        }

        loadFragByP2p(context, config, callbacks, segId) {
            const { logger } = this;
            const frag = context.frag;
            this.scheduler.load(context, config, callbacks);
            const onSuccess = callbacks.onSuccess;
            const onTimeout = callbacks.onTimeout;
            callbacks.onTimeout = (stats, context) => {                             //如果P2P下载超时则立即切换到xhr下载
                logger.warn(`P2P timeout switched to HTTP load ${frag.relurl} at ${frag.sn}`);
                // frag.loadByP2P = false;
                // frag.loadByHTTP = true;

                callbacks.onSuccess = onSuccess;
                this.loadFragByHttp(context, config, callbacks, segId);

                callbacks.onTimeout = onTimeout;
            };
            callbacks.onSuccess = async (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                // callbacks.onSuccess = () => {
                //     logger.warn(`p2p loaded ${frag.sn}, http ignore`);
                // };
                if (!await this.bufMgr.hasSegOfId(segId)) {
                    const targetBuffer = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.copyBuffer)(response.data).buffer;
                    const segment = new _core_segment__WEBPACK_IMPORTED_MODULE_2__["default"](frag.sn, segId, targetBuffer, frag.fromPeerId || this.fetcher.peerId, frag.level);
                    this.bufMgr.putSeg(segment);
                }
                if (!frag.loadByP2P) this.fetcher.reportFlow(stats.total);
                frag.loaded = stats.loaded;
                logger.info(`${frag.loadByP2P ? 'P2P' : 'HTTP'} loaded segment id ${segId}`);
                // v1必须
                if (!this.isHlsV0 && callbacks.onProgress) callbacks.onProgress(stats, context, response.data);

                // console.warn('p2p onSuccess: ' + frag.sn);
                // console.warn(JSON.stringify(stats, null, 2));
                // console.warn(response);
                // console.warn(context);

                onSuccess(response, stats, context);
            };
        }
    }
}


/***/ }),

/***/ "./src/hls-next/hlsjs/playlist-loader.js":
/*!***********************************************!*\
  !*** ./src/hls-next/hlsjs/playlist-loader.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/utils/queue-microtask */ "./src/core/utils/queue-microtask.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/hls-next/hlsjs/utils/tool-funs.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");





/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(scheduler) {
    return class PlaylistLoader extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
        constructor(config) {
            super();
            this.logger = config.logger;
            this.xhrLoader = new config.loader(config);
            this.p2pEnabled = config.p2pEnabled;
            this.scheduler = scheduler;
            this.stats = this.xhrLoader.stats || (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.createLoadStats)();
        }

        destroy() {
            this.xhrLoader.destroy();
        }

        abort() {
            // console.warn(`abort`)
            this.xhrLoader.abort();
        }

        /*
         首先从peers中寻找请求的m3u8，如果找不到则用http请求。
         */
        load(context, config, callbacks) {
            const { logger } = this;
            // console.warn('load playlist: ' + context.url);
            // console.warn("context");
            // console.warn(context);

            const { url } = context;

            // console.warn(`url: ${url}`);
            const netUrl = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.getNetUrl)(url);
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {
                // console.warn(`response size ${response.data.length}`);
                // console.warn(JSON.stringify(response.data));
                if (this.scheduler && !context.loadedByPeer) this.scheduler.broadcastPlaylist(netUrl, response.data);
                onSuccess(response, stats, context);
            };
            if (this.scheduler && this.scheduler.playlistInfo.has(netUrl)) {
                const playlist = this.scheduler.getPlaylistFromPeer(netUrl);
                if (playlist && playlist.data) {
                    const { data, seq } = playlist;
                    // console.warn(`got playlist from peer ${data}`);
                    logger.info(`got playlist from peer seq ${seq}`);
                    (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_2__.updateLoadStats)(this.stats, data.length);
                    let response = { url, data };
                    context.loadedByPeer = true;
                    _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_1___default()(() => {                                                   //必须是异步回调
                        callbacks.onSuccess(response, this.stats, context);
                    });
                    return
                }
            }

            this.xhrLoader.load(context, config, callbacks);

        }

    }
}




/***/ }),

/***/ "./src/hls-next/hlsjs/scheduler.js":
/*!*****************************************!*\
  !*** ./src/hls-next/hlsjs/scheduler.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .././events */ "./src/hls-next/events.js");
/* harmony import */ var _utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/tool-funs */ "./src/hls-next/hlsjs/utils/tool-funs.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/utils/queue-microtask */ "./src/core/utils/queue-microtask.js");
/* harmony import */ var _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_scheduler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/scheduler */ "./src/hls-next/common/scheduler.js");
/* harmony import */ var _common_synthesizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/synthesizer */ "./src/hls-next/common/synthesizer.js");
/* harmony import */ var _common_utils_error_code__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/utils/error-code */ "./src/hls-next/common/utils/error-code.js");







class HlsjsScheduler extends _common_scheduler__WEBPACK_IMPORTED_MODULE_3__["default"] {

    constructor(engine, config) {
        super(engine, config);
        this.isHlsjs = true;
        // p2p优先模式
        this.waitForPeer = config.waitForPeer || false;
        this.waitForPeerTimeout = config.waitForPeerTimeout;
        this.waitingPeers = 0;
        this.waitingSeg = {};
    }

    startWaitPeerTimer() {
        if (!this.waitForPeer) return
        this.waitForPeerTimer = setTimeout(() => {
            // console.warn(`end startWaitPeerTimer`)
            if (!this.waitForPeer) return
            this.waitForPeer = false;
            this.emit(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SCH_WAIT_PEER);
        }, (this.waitForPeerTimeout+0)*1000)
    }

    updatePlaySN(sn) {
        // const { logger } = this;
        // logger.info(`updatePlaySN ${sn}`);
        this.currPlaySN = sn;
    }

    load(context, config, callbacks) {
        this.isReceiver = true;
        const { logger, config: p2pConfig } = this;
        this.context = context;
        const { rangeStart, rangeEnd, url } = context;
        const frag = context.frag;
        const { segId, sn, level } = frag;
        this.callbacks = callbacks;
        this.stats = (0,_utils_tool_funs__WEBPACK_IMPORTED_MODULE_1__.createLoadStats)();
        this.criticalSeg = { sn, level, segId };
        // console.warn(`this.mBufferedDuration ${this.mBufferedDuration}`)
        let loadTimeout = this.mBufferedDuration - p2pConfig.httpLoadTime;   // second
        if (loadTimeout > this.dcDownloadTimeout) {
            loadTimeout = this.dcDownloadTimeout;
        }
        const {forwardPeer, reversePeer} = this.targetPeers;
        if (!forwardPeer && !reversePeer) {
            loadTimeout -= 1.0
        }
        let synthesizer = this.requestingMap.get(sn, level);
        const ext = {
            rangeStart: Number(rangeStart),
            rangeEnd: Number(rangeEnd),
            url,
            httpLoadTime: p2pConfig.httpLoadTime*1000 - 500,
            xhrSetup: p2pConfig.xhrSetup,
            segId,
            headers: Object.keys(context.headers || {}).length > 0 ? context.headers : undefined,
        }
        if (!synthesizer) {
            synthesizer = new _common_synthesizer__WEBPACK_IMPORTED_MODULE_4__["default"](this.coordinator, this.logger, sn, level, segId, this.httpRangeSupported, ext);
            this._setupSynthesizer(synthesizer);
            this.requestingMap.set(sn, level, synthesizer);
        } else {
            synthesizer.setExtra(ext);
        }
        if (forwardPeer) {
            synthesizer.setForwardPeer(forwardPeer);
            forwardPeer.requestDataById(segId, sn, true, { level });
        }
        if (reversePeer) {
            synthesizer.setReversePeer(reversePeer);
            reversePeer.requestDataById(segId, sn, true, { level, reverse: true });
        }
        if (synthesizer.isEmpty()) {
            loadTimeout = 0;
        }
        logger.info(`syn setTimeout ${loadTimeout}`);
        synthesizer.setTimeout(loadTimeout * 1000);
        this.targetPeers = {};    // 重置
        // console.warn(`!test ${JSON.stringify(this.criticalSeg)}`);
    }

    waitPeerNotifier() {
        return new Promise((resolve) => {
            if (!this.waitForPeer) resolve()
            setTimeout(resolve, this.waitForPeerTimeout*1000);
            this.once(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SCH_WAIT_PEER, resolve)
        });
    }

    addPeer(peer) {
        super.addPeer(peer);
        // p2p优先模式
        if (this.waitForPeer) {
            const { level, sn } = this.waitingSeg
            const remoteId = peer.remotePeerId;
            if (peer.bitset.has(sn, level)) {
                this.logger.info(`found initial seg ${level}-${sn} from peer ${remoteId}`);
                this.emit(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SCH_WAIT_PEER);
            } else if (this.waitingPeers === this.peersNum) {   // 已经是最后一个peer但还是没有sn
                // this.waitForPeer = false;
                this.emit(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SCH_WAIT_PEER);
            }
        }
    }

    // override
    notifyPeersLoaded(num) {
        this.logger.info(`notifyPeersLoaded ${num}`);
        if (this.waitForPeer) {
            if (num === 0) {
                this.waitForPeer = false;
                this.emit(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SCH_WAIT_PEER);
            } else {
                this.waitingPeers = num;
            }
        }
    }

    // override
    destroy() {
        super.destroy();
        this.logger.warn(`destroy HlsjsScheduler`);
        clearTimeout(this.waitForPeerTimer)
    }

    // override
    _setupDC(dc) {
        // console.warn(`sn scheduler _setupDC`);
        super._setupDC(dc);
    }

    _setupSynthesizer(synthesizer) {
        const notifyAndCheckPeers = ()=> {
            if (this.bitCounts.has(this.loadingSN, this.engine.currentLevel)) {
                this.emit(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SCH_DCHAVE, this.loadingSegId);    // TODO 验证!
            }
            if (!this.criticalSeg) this.checkPeers();
        }
        synthesizer.on(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SYN_OUTPUT, (segment, info) => {
            // console.warn(`p2p ${info.p2p} http ${info.http}`)
            const { config, logger } = this;
            const { segId, sn, data, level } = segment;
            const { speed, http, p2p } = info;
            this._handleSynOutput(http);
            const isCritical = this.criticalSeg && this.criticalSeg.segId === segId;
            const verified = config.validateSegment(segId, new Uint8Array(data));    // 对数据进行校验，防止节点作恶
            if (verified) {
                this.notifyAllPeers(sn, level, segId);
                if (!this.bitset.has(sn, level)) {
                    // 上报流量
                    this.reportTraffic(http, p2p, speed);
                }
                const fromPeerId = synthesizer.getFromPeerId();
                if (isCritical) {
                    logger.info(`receive criticalSeg seg_id ${segId}`);
                    let stats = this.stats;
                    stats.tfirst = stats.loading.first = Math.max(stats.trequest, performance.now());
                    stats.tload = stats.loading.end = stats.tfirst;
                    stats.loaded = stats.total = data.byteLength;
                    this.criticalSeg = null;
                    const { frag } = this.context;
                    frag.fromPeerId = fromPeerId;
                    frag.loadByP2P = true;
                    this.callbacks.onSuccess({ data, url: this.context.url }, stats, this.context);
                } else {
                    // 判断是否已经存储过了
                    if (!this.bitset.has(sn, level)) {
                        this.bufMgr.putSeg(segment);
                        this.updateLoaded(sn, level, segId);        // 只有预加载请求需要
                    }
                }
            } else {
                logger.error(`segment ${segId} validate failed`);
                if (isCritical) {
                    this.callbacks.onTimeout(this.stats, this.context, null);
                }
            }
            this.requestingMap.delete(sn, level);
            if (config.live) {
                notifyAndCheckPeers();
            }
        })
        .on(_events__WEBPACK_IMPORTED_MODULE_0__["default"].SYN_ERROR, (pieceMsg, code) => {
            const { config, logger } = this;
            const { sn, level } = pieceMsg;
            logger.warn(`SYN_ERROR loading ${sn} code ${code}`);
            if (this.criticalSeg && this.criticalSeg.sn === sn) {             //接收到critical未找到的响应
                this.criticalSeg = null;                                           //触发超时，由xhr下载
                this.callbacks.onTimeout(this.stats, this.context, null);
            }
            if (code === _common_utils_error_code__WEBPACK_IMPORTED_MODULE_5__["default"].ERROR_SYN_ABORT && synthesizer.hasPartialBuffer()) {
                logger.warn(`syn abort with partial buffer`);
            } else {
                this.requestingMap.delete(sn, level);
                this._handleSynError(code);
            }
            if (config.live) {
                notifyAndCheckPeers();
            }
        })
    }

    _setupEngine(){
        super._setupEngine();
        this.engine.on(_events__WEBPACK_IMPORTED_MODULE_0__["default"].FRAG_LOADING, ({sn, segId, byHttp, level}) => {
            // console.warn(`FRAG_LOADING ${sn}`)
            this.loadingSN = sn;
            this.loadingSegId = segId;
        })
            // 只有waitForPeer模式第一片才能缓存
            .on(_events__WEBPACK_IMPORTED_MODULE_0__["default"].FRAG_LOADED, ({sn, segId, byP2p, level}) => {
                // console.warn(`sch FRAG_LOADED ${sn} byHttp ${byHttp}`)
                this.requestingMap.delete(sn, level);
                this.updateLoaded(sn, level, segId);
            })
            .on(_events__WEBPACK_IMPORTED_MODULE_0__["default"].FRAG_CHANGED, ({sn}) => {
                this.updatePlaySN(sn);
            })
    }

    _handleDCHave(peer, sn, level, segId, state) {
        // if (this.criticalSeg && this.criticalSeg.sn === sn && this.criticalSeg.level === level) {
        //     this._notifySynthesizer(peer, segId, sn, level, state);
        // } else {
        //     this._notifySynthesizer(peer, segId, sn, level, state, false);
        // }
        this._notifySynthesizer(peer, segId, sn, level, state);

        if (this.config.live && !this.criticalSeg) {
            _core_utils_queue_microtask__WEBPACK_IMPORTED_MODULE_2___default()(() => {                                                   //必须是异步回调
                this.checkPeers();
            })
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HlsjsScheduler);


/***/ }),

/***/ "./src/hls-next/hlsjs/utils/fake-xhr.js":
/*!**********************************************!*\
  !*** ./src/hls-next/hlsjs/utils/fake-xhr.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FakeXhr)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/_events@3.3.0@events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);


class FakeXhr extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {

    constructor() {
        super();

        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;

        this.timeout = 0;
        this.withCredentials = false;
        this.status = 0;
        this.readyState = this.UNSENT;
        this.headers = new Map();
        this.responseHeaders = null;
        this.on('load', (e)  => {
            if (this.onload) this.onload(e)
        })
        this.on('abort', (e)  => {
            if (this.onabort) this.onabort(e)
        })
        this.on('error', (e)  => {
            if (this.onerror) this.onerror(e)
        })
        this.on('loadstart', (e)  => {
            if (this.onloadstart) this.onloadstart(e)
        })
        this.on('progress', (e)  => {
            if (this.onprogress) this.onprogress(e)
        })
        this.on('timeout', (e)  => {
            if (this.ontimeout) this.ontimeout(e)
        })
        this.on('loadend', (e)  => {
            if (this.onloadend) this.onloadend(e)
        })
        this.on('readystatechange', () => {
            if (this.onreadystatechange) this.onreadystatechange()
        })
    }

    setRequestHeader(name, value) {
        this.headers.set(name, value)
    }

    addEventListener(type, listener) {
        this.addListener(type, listener)
    }

    removeEventListener(type, listener) {
        this.removeListener(type, listener)
    }

    overrideMimeType() {}
    getAllResponseHeaders() {
        if (!this.responseHeaders) return null
        let ret = '';
        this.responseHeaders.forEach((value, key)  => {
            ret += `${key}: ${value}
`
        });
        return ret
    }
    getResponseHeader(key) {
        if (!this.responseHeaders) return null
        return this.responseHeaders.get(key)
    }
    open() {
        this.readyState = this.OPENED;
        this.emit('loadstart')
    }
    abort() {
        this.readyState = this.DONE;
        this.status = 0;
    }
    send() {}

    _emitEvent(type) {
        this.emit(type, new ProgressEvent(type));
    }
}


/***/ }),

/***/ "./src/hls-next/hlsjs/utils/fetch-loader.js":
/*!**************************************************!*\
  !*** ./src/hls-next/hlsjs/utils/fetch-loader.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FetchLoader": () => (/* binding */ FetchLoader),
/* harmony export */   "fetchSupported": () => (/* binding */ fetchSupported)
/* harmony export */ });
/* harmony import */ var _tool_funs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tool-funs */ "./src/hls-next/hlsjs/utils/tool-funs.js");
/* harmony import */ var _core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/utils/buffer */ "./src/core/utils/buffer.js");
/* harmony import */ var _fake_xhr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fake-xhr */ "./src/hls-next/hlsjs/utils/fake-xhr.js");
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");





// TODO 当 progressive 默认打开后重新同步代码
function fetchSupported() {
    if (
        self.fetch &&
        self.AbortController &&
        self.ReadableStream &&
        self.Request
    ) {
        try {
            new self.ReadableStream({});
            return true;
        } catch (e) {
            /* noop */
        }
    }
    return false;
}

class FetchLoader {
    constructor(config /* HlsConfig */) {
        // console.warn(`using FetchLoader`)
        this.fetchSetup = config.fetchSetup || getRequest;
        this.xhrSetup = config.xhrSetup;
        if ((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.isConstructor)(self.AbortController)) {
            this.controller = new self.AbortController();
        }
        this.stats = (0,_tool_funs__WEBPACK_IMPORTED_MODULE_0__.createLoadStats)();
        this.packetSize = _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_PACKET_SIZE;
        this.fakeXhr = new _fake_xhr__WEBPACK_IMPORTED_MODULE_2__["default"]();
    }

    destroy() {
        this.loader = this.callbacks = null;
        this.abortInternal();
    }

    abortInternal() {
        // console.warn(`abort`)
        const response = this.response;
        if (!response || !response.ok) {
            this.stats.aborted = true;
            if (this.callbacks && this.callbacks.onUpdate) this.callbacks.onUpdate(undefined, false, true);
            if (this.controller) this.controller.abort();
        }
    }

    abort() {
        this.abortInternal();
        if (this.callbacks && this.callbacks.onAbort) {
            this.callbacks.onAbort(this.stats, this.context, this.response);
        }
    }

    load(
        context,
        config,
        callbacks
    ) {
        const stats = this.stats;
        // if (stats.loading.start) {
        //     throw new Error('Loader can only be used once.');
        // }
        stats.trequest = stats.loading.start = performance.now();

        let initParams = getRequestParameters(context, this.controller ? this.controller.signal : undefined);
        const isArrayBuffer = context.responseType === 'arraybuffer';
        const LENGTH = isArrayBuffer ? 'byteLength' : 'length';
        const onUpdate = callbacks.onUpdate;
        const onBodyStart = callbacks.onBodyStart;
        this.context = context;
        this.config = config;
        this.callbacks = callbacks;
        // 合并 fake xhr
        if (this.xhrSetup) {
            this.xhrSetup(this.fakeXhr, context.url)
            initParams = mergeXhrSetup(this.fakeXhr, initParams);
        }
        this.request = this.fetchSetup(context, initParams);
        clearTimeout(this.requestTimeout);
        this.requestTimeout = setTimeout(() => {
            this.abortInternal();
            this.fakeXhr._emitEvent('timeout');
            this.fakeXhr._emitEvent('loadend');
            if (callbacks.onTimeout) callbacks.onTimeout(stats, context, this.response);
        }, this.fakeXhr.timeout || config.timeout);

        const { fakeXhr } = this;
        fakeXhr.readyState = fakeXhr.OPENED
        fakeXhr.emit('readystatechange');
        fakeXhr._emitEvent('loadstart');
        fetch(this.request)
            .then((response) => {
            this.response = this.loader = response;

            if (!response.ok) {
                const { status, statusText } = response;
                if (onUpdate) onUpdate(undefined, false, true);
                throw new FetchError(
                    statusText || 'fetch, bad network response',
                    status,
                    response
                );
            }
            stats.tfirst = stats.loading.first = Math.max(performance.now(), stats.loading.start);
            stats.total = parseInt(response.headers.get('Content-Length') || '0');

            const { fakeXhr } = this;
            fakeXhr.readyState = fakeXhr.HEADERS_RECEIVED;
            fakeXhr.responseHeaders = response.headers;
            fakeXhr.emit('readystatechange');

            if (onUpdate && stats.total !== '0') {

                if (onBodyStart) onBodyStart(stats.total);

                return this.loadProgressively(
                    response,
                    stats,
                    context,
                    onUpdate,
                );
            } else {
                fakeXhr.emit('progress', new ProgressEvent('progress', { lengthComputable: false }));
            }

            if (isArrayBuffer) {
                return response.arrayBuffer();
            }
            return response.text();
        })
    .then((responseData) => {
            const { response } = this;
            clearTimeout(this.requestTimeout);
            stats.tload = stats.loading.end = Math.max(
                performance.now(),
                stats.loading.first
            );
            stats.loaded = stats.total = responseData[LENGTH];

            const loaderResponse = {
                url: response.url,
                data: responseData,
            };

            if (callbacks.onProgress) callbacks.onProgress(stats, context, responseData, response);
            if (callbacks.onSuccess) callbacks.onSuccess(loaderResponse, stats, context, response);

        })
            .catch((error) => {
                clearTimeout(this.requestTimeout);
                if (stats.aborted) {
                    return;
                }
                if (onUpdate) onUpdate(undefined, false, true);
                // CORS errors result in an undefined code. Set it to 0 here to align with XHR's behavior
                // when destroying, 'error' itself can be undefined
                const code = !error ? 0 : error.code || 0;
                const text = !error ? null : error.message;
                if (callbacks.onError) callbacks.onError(
                    { code, text },
                    context,
                    error ? error.details : null
                );
            });
    }

    loadProgressively(
        response,
        stats,
        context,
        onUpdate
    ) {
        const reader = response.body.getReader();
        let bytesReadIncrement = 0;
        let sentCount = 0;
        let sink = (0,_core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer)(0);

        const pump = () => {
            return reader
                .read()
                .then(({ value, done }) => {
                    // console.warn(value.length)

                    const { fakeXhr } = this;
                    if (fakeXhr.readyState !== fakeXhr.LOADING) {
                        fakeXhr.readyState = fakeXhr.LOADING
                        fakeXhr.emit('readystatechange');
                    }

                    if (value) {
                        bytesReadIncrement += value.length;
                    }
                    if (done) {
                        if (sink.byteLength > 0) {
                            if (bytesReadIncrement <= this.packetSize) {
                                const buffer = (0,_core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer)(bytesReadIncrement);
                                sink.copy(buffer, 0, sentCount*this.packetSize, sink.byteLength)
                                onUpdate(buffer, true);
                            } else {
                                const bufferList = (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_3__.splitBytes)(sink, sentCount*this.packetSize);
                                for (let i=0; i<bufferList.length; i++) {
                                    onUpdate(bufferList[i], i === bufferList.length-1);
                                }
                            }
                        }
                        // const buffer = new Uint8Array(sink).buffer;
                        const buffer = sink.buffer;
                        // console.warn(`loadProgressively resolve data ${buffer.byteLength}`)
                        const { fakeXhr } = this;
                        const { status, statusText, url } = response
                        fakeXhr.readyState = fakeXhr.DONE
                        fakeXhr.responseText = status;
                        fakeXhr.status = statusText;
                        fakeXhr.responseURL = url;
                        fakeXhr.responseType = 'arraybuffer';
                        fakeXhr.response = buffer;
                        fakeXhr.emit('readystatechange');
                        fakeXhr._emitEvent('load');
                        fakeXhr._emitEvent('loadend');

                        return Promise.resolve(buffer);
                    }
                    // const chunk = Buffer.from(value);
                    // const len = chunk.byteLength;
                    stats.loaded += value.length;
                    fakeXhr.emit('progress', new ProgressEvent('progress', {
                        lengthComputable: true,
                        loaded: stats.loaded,
                        total: stats.total,
                    }));
                    // console.warn(`pump len ${value.length} chunk byteLength ${chunk.byteLength}`);
                    sink = _core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.concat([sink, value])
                    if (bytesReadIncrement >= this.packetSize) {
                        bytesReadIncrement -= this.packetSize;
                        // arraybuffer
                        const buffer = (0,_core_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer)(this.packetSize);
                        sink.copy(buffer, 0, sentCount * this.packetSize, (sentCount + 1) * this.packetSize)
                        sentCount ++;
                        onUpdate(buffer, false);
                    }
                    return pump();
                })
                .catch(() => {
                    /* aborted */
                    this.fakeXhr._emitEvent('abort');
                    this.fakeXhr._emitEvent('loadend');
                    return Promise.reject();
                });
        };

        return pump();
    }
}

function getRequestParameters(context, signal) {
    const initParams = {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        signal,
        headers: new self.Headers(Object.assign({}, context.headers)),
    };

    if (context.rangeEnd) {
        initParams.headers.set(
            'Range',
            'bytes=' + context.rangeStart + '-' + String(context.rangeEnd - 1)
        );
    }

    return initParams;
}

function getRequest(context, initParams) {
    return new self.Request(context.url, initParams);
}

function mergeXhrSetup(xhr, initParams) {
    if (xhr.withCredentials) {
        initParams.credentials = 'include';
    }
    for (let [key, value] of xhr.headers) {
        initParams.headers.set(key, value)
    }
    return initParams
}

class FetchError extends Error {
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
    }
}


/***/ }),

/***/ "./src/hls-next/hlsjs/utils/tool-funs.js":
/*!***********************************************!*\
  !*** ./src/hls-next/hlsjs/utils/tool-funs.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createLoadStats": () => (/* binding */ createLoadStats),
/* harmony export */   "isBlockType": () => (/* binding */ isBlockType),
/* harmony export */   "updateLoadStats": () => (/* binding */ updateLoadStats)
/* harmony export */ });
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-toolkit */ "./node_modules/_url-toolkit@2.2.5@url-toolkit/src/url-toolkit.js");
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__);


function isBlockType(url, blackList, fragType = 'main') {
    // const urlObj = URLToolkit.parseURL(url);
    // const mediaType = urlObj.path.substring(urlObj.path.lastIndexOf('.')+1);
    // console.warn(`mediaType ${mediaType}`);
    // const extname = path.extname(url).toLowerCase();
    // return blackList.indexOf(mediaType) !== -1 || fragType !== 'main';    // TODO
    return fragType !== 'main' && fragType !== 'audio';
    // return blackList.indexOf(mediaType) !== -1;

}

function createLoadStats() {
    const now = performance.now();
    return {
        // compat with HLS < 1.0.0
        trequest: now,
        tfirst: 0,
        tload: 0,

        aborted: false,
        loaded: 0,
        retry: 0,
        total: 0,
        chunkCount: 0,
        bwEstimate: 0,
        loading: { start: now, first: 0, end: 0 },
        parsing: { start: 0, end: 0 },
        buffering: { start: 0, first: 0, end: 0 }
    }
}

function updateLoadStats(stats, size) {
    let trequest, tfirst, tload, loaded, total;
    const now = performance.now();
    trequest = now - 300;
    tfirst = now - 200;
    tload = now;
    stats.trequest = trequest;
    stats.tfirst = tfirst;
    stats.tload = tload;
    stats.loading = {
        first: trequest,
        start: tfirst,
        end: tload
    };
    loaded = total = size;
    stats.loaded = loaded;
    stats.total = total;
}


/***/ }),

/***/ "./src/hls-next/index.engine.js":
/*!**************************************!*\
  !*** ./src/hls-next/index.engine.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/hls-next/events.js");
/* harmony import */ var _core_engine_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/engine-base */ "./src/core/engine-base.js");
/* harmony import */ var _core_peer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/peer */ "./src/core/peer.js");
/* harmony import */ var _core_utils_mse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/utils/mse */ "./src/core/utils/mse.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/utils/platform */ "./src/core/utils/platform.js");
/* harmony import */ var _core_utils_platform__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_utils_platform__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/utils/tool-funs */ "./src/core/utils/tool-funs.js");
/* harmony import */ var _hls_sw_p2pengine__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hls-sw.p2pengine */ "./src/hls-next/hls-sw.p2pengine.js");
/* harmony import */ var _hlsjs_p2pengine__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hlsjs.p2pengine */ "./src/hls-next/hlsjs.p2pengine.js");










class P2pEngine {

    static get Events() {
        return _events__WEBPACK_IMPORTED_MODULE_0__["default"];
    }

    static get TrackerZone() {
        return _core_engine_base__WEBPACK_IMPORTED_MODULE_1__["default"].TrackerZone
    }

    static isSupported() {
        return _core_engine_base__WEBPACK_IMPORTED_MODULE_1__["default"].isSupported() && ((0,_core_utils_mse__WEBPACK_IMPORTED_MODULE_3__.isMSESupported)() || _hls_sw_p2pengine__WEBPACK_IMPORTED_MODULE_6__["default"].isServiceWorkerSupported())
    }

    static isServiceWorkerSupported() {
        return _hls_sw_p2pengine__WEBPACK_IMPORTED_MODULE_6__["default"].isServiceWorkerSupported()
    }

    static isMSESupported() {
        return (0,_core_utils_mse__WEBPACK_IMPORTED_MODULE_3__.isMSESupported)()
    }

    static getBrowser() {
        return _core_utils_platform__WEBPACK_IMPORTED_MODULE_4___default().getBrowser()
    }

    static get ServiceWorkerEngine() {
        return _hls_sw_p2pengine__WEBPACK_IMPORTED_MODULE_6__["default"]
    }

    static get HlsjsEngine() {
        return _hlsjs_p2pengine__WEBPACK_IMPORTED_MODULE_7__["default"]
    }

    static async tryRegisterServiceWorker({swFile = './sw.js', swScope = './'} = {}) {
        return P2pEngine.registerServiceWorker({swFile, swScope})
    }

    static async registerServiceWorker({swFile = './sw.js', swScope = './', hlsjsInstance} = {}) {
        const { serviceWorker } = navigator;
        // private mode
        if (!serviceWorker || hlsjsInstance) return Promise.resolve();
        return serviceWorker.getRegistration().then(reg => {
            return reg || Promise.race([serviceWorker.register(swFile, { scope: swScope })
                    .then((reg) => {
                        return (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.swRegisterPromise)(reg)
                    }), (0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.timeout)(300)])
            }).catch(() => {
                Promise.resolve()
            });
    }

    constructor(p2pConfig = {}) {
        const { hlsjsInstance } = p2pConfig;
        delete p2pConfig.hlsjsInstance;

        if ((0,_core_utils_tool_funs__WEBPACK_IMPORTED_MODULE_5__.getQueryParam)('_ios') === '1') {
            this._realEngine = new _hls_sw_p2pengine__WEBPACK_IMPORTED_MODULE_6__["default"](p2pConfig)
            return
        }
        if (!p2pConfig.proxyOnly && hlsjsInstance && (0,_core_utils_mse__WEBPACK_IMPORTED_MODULE_3__.isMSESupported)()) {
            this._realEngine = new _hlsjs_p2pengine__WEBPACK_IMPORTED_MODULE_7__["default"](hlsjsInstance, p2pConfig)
        } else {
            this._realEngine = new _hls_sw_p2pengine__WEBPACK_IMPORTED_MODULE_6__["default"](p2pConfig)
        }
    }

    get realEngine() {
        return this._realEngine
    }

    get engineName() {
        return this._realEngine.constructor.name
    }

    once(name, handler) {
        return this._realEngine.once(name, handler)
    }

    on(name, handler) {
        return this._realEngine.on(name, handler)
    }

    off(name, handler) {
        return this._realEngine.off(name, handler)
    }

    removeListener(name, handler) {
        return this._realEngine.removeListener(name, handler)
    }

    removeAllListeners(name) {
        return this._realEngine.removeAllListeners(name)
    }

    set p2pEnabled(bool) {
        this._realEngine.p2pEnabled = bool
    }

    get p2pEnabled() {
        return this._realEngine.p2pEnabled
    }

    enableP2P() {
        this._realEngine.enableP2P()
    }

    disableP2P() {
        this._realEngine.disableP2P()
    }

    destroy() {
        this._realEngine.destroy()
    }

    async registerServiceWorker() {
        if (typeof this._realEngine['registerServiceWorker'] === 'function') {
            return this._realEngine.registerServiceWorker()
        }
        return Promise.reject("Not supported by this engine")
    }

    async unregisterServiceWorker() {
        if (typeof this._realEngine['unregisterServiceWorker'] === 'function') {
            return this._realEngine.unregisterServiceWorker()
        }
        return Promise.reject("Not supported by this engine")
    }

    get version() {
        return _core_engine_base__WEBPACK_IMPORTED_MODULE_1__["default"].version;
    }

}

P2pEngine.version = _core_engine_base__WEBPACK_IMPORTED_MODULE_1__["default"].version;

P2pEngine.protocolVersion = _core_peer__WEBPACK_IMPORTED_MODULE_2__["default"].VERSION;

if (typeof self !== 'undefined') {
    self.P2PEngineHls = P2pEngine;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (P2pEngine);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/hls-next/index.engine.js");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=p2p-engine.js.map
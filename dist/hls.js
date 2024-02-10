(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hls"] = factory();
	else
		root["Hls"] = factory();
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

/***/ "./node_modules/_hls.js@1.5.1@hls.js/dist/hls.min.js":
/*!***********************************************************!*\
  !*** ./node_modules/_hls.js@1.5.1@hls.js/dist/hls.min.js ***!
  \***********************************************************/
/***/ ((module) => {

!function t(e){var r,i;r=this,i=function(){"use strict";function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,i)}return r}function i(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?r(Object(i),!0).forEach((function(e){var r,a,s;r=t,a=e,s=i[e],(a=n(a))in r?Object.defineProperty(r,a,{value:s,enumerable:!0,configurable:!0,writable:!0}):r[a]=s})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function n(t){var e=function(t,e){if("object"!=typeof t||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var i=r.call(t,e||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==typeof e?e:String(e)}function a(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,n(i.key),i)}}function s(t,e,r){return e&&a(t.prototype,e),r&&a(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function o(){return o=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},o.apply(this,arguments)}function l(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,h(t,e)}function u(t){return u=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},u(t)}function h(t,e){return h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},h(t,e)}function d(t,e,r){return d=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}()?Reflect.construct.bind():function(t,e,r){var i=[null];i.push.apply(i,e);var n=new(Function.bind.apply(t,i));return r&&h(n,r.prototype),n},d.apply(null,arguments)}function c(t){var e="function"==typeof Map?new Map:void 0;return c=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return d(t,arguments,u(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),h(r,t)},c(t)}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,i=new Array(e);r<e;r++)i[r]=t[r];return i}function g(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return(r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return f(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var i=0;return function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function v(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var m={exports:{}};!function(t,e){var r,i,n,a,s;r=/^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/,i=/^(?=([^\/?#]*))\1([^]*)$/,n=/(?:\/|^)\.(?=\/)/g,a=/(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g,s={buildAbsoluteURL:function(t,e,r){if(r=r||{},t=t.trim(),!(e=e.trim())){if(!r.alwaysNormalize)return t;var n=s.parseURL(t);if(!n)throw new Error("Error trying to parse base URL.");return n.path=s.normalizePath(n.path),s.buildURLFromParts(n)}var a=s.parseURL(e);if(!a)throw new Error("Error trying to parse relative URL.");if(a.scheme)return r.alwaysNormalize?(a.path=s.normalizePath(a.path),s.buildURLFromParts(a)):e;var o=s.parseURL(t);if(!o)throw new Error("Error trying to parse base URL.");if(!o.netLoc&&o.path&&"/"!==o.path[0]){var l=i.exec(o.path);o.netLoc=l[1],o.path=l[2]}o.netLoc&&!o.path&&(o.path="/");var u={scheme:o.scheme,netLoc:a.netLoc,path:null,params:a.params,query:a.query,fragment:a.fragment};if(!a.netLoc&&(u.netLoc=o.netLoc,"/"!==a.path[0]))if(a.path){var h=o.path,d=h.substring(0,h.lastIndexOf("/")+1)+a.path;u.path=s.normalizePath(d)}else u.path=o.path,a.params||(u.params=o.params,a.query||(u.query=o.query));return null===u.path&&(u.path=r.alwaysNormalize?s.normalizePath(a.path):a.path),s.buildURLFromParts(u)},parseURL:function(t){var e=r.exec(t);return e?{scheme:e[1]||"",netLoc:e[2]||"",path:e[3]||"",params:e[4]||"",query:e[5]||"",fragment:e[6]||""}:null},normalizePath:function(t){for(t=t.split("").reverse().join("").replace(n,"");t.length!==(t=t.replace(a,"")).length;);return t.split("").reverse().join("")},buildURLFromParts:function(t){return t.scheme+t.netLoc+t.path+t.params+t.query+t.fragment}},t.exports=s}(m);var p=m.exports,y=Number.isFinite||function(t){return"number"==typeof t&&isFinite(t)},E=Number.isSafeInteger||function(t){return"number"==typeof t&&Math.abs(t)<=T},T=Number.MAX_SAFE_INTEGER||9007199254740991,S=function(t){return t.MEDIA_ATTACHING="hlsMediaAttaching",t.MEDIA_ATTACHED="hlsMediaAttached",t.MEDIA_DETACHING="hlsMediaDetaching",t.MEDIA_DETACHED="hlsMediaDetached",t.BUFFER_RESET="hlsBufferReset",t.BUFFER_CODECS="hlsBufferCodecs",t.BUFFER_CREATED="hlsBufferCreated",t.BUFFER_APPENDING="hlsBufferAppending",t.BUFFER_APPENDED="hlsBufferAppended",t.BUFFER_EOS="hlsBufferEos",t.BUFFER_FLUSHING="hlsBufferFlushing",t.BUFFER_FLUSHED="hlsBufferFlushed",t.MANIFEST_LOADING="hlsManifestLoading",t.MANIFEST_LOADED="hlsManifestLoaded",t.MANIFEST_PARSED="hlsManifestParsed",t.LEVEL_SWITCHING="hlsLevelSwitching",t.LEVEL_SWITCHED="hlsLevelSwitched",t.LEVEL_LOADING="hlsLevelLoading",t.LEVEL_LOADED="hlsLevelLoaded",t.LEVEL_UPDATED="hlsLevelUpdated",t.LEVEL_PTS_UPDATED="hlsLevelPtsUpdated",t.LEVELS_UPDATED="hlsLevelsUpdated",t.AUDIO_TRACKS_UPDATED="hlsAudioTracksUpdated",t.AUDIO_TRACK_SWITCHING="hlsAudioTrackSwitching",t.AUDIO_TRACK_SWITCHED="hlsAudioTrackSwitched",t.AUDIO_TRACK_LOADING="hlsAudioTrackLoading",t.AUDIO_TRACK_LOADED="hlsAudioTrackLoaded",t.SUBTITLE_TRACKS_UPDATED="hlsSubtitleTracksUpdated",t.SUBTITLE_TRACKS_CLEARED="hlsSubtitleTracksCleared",t.SUBTITLE_TRACK_SWITCH="hlsSubtitleTrackSwitch",t.SUBTITLE_TRACK_LOADING="hlsSubtitleTrackLoading",t.SUBTITLE_TRACK_LOADED="hlsSubtitleTrackLoaded",t.SUBTITLE_FRAG_PROCESSED="hlsSubtitleFragProcessed",t.CUES_PARSED="hlsCuesParsed",t.NON_NATIVE_TEXT_TRACKS_FOUND="hlsNonNativeTextTracksFound",t.INIT_PTS_FOUND="hlsInitPtsFound",t.FRAG_LOADING="hlsFragLoading",t.FRAG_LOAD_EMERGENCY_ABORTED="hlsFragLoadEmergencyAborted",t.FRAG_LOADED="hlsFragLoaded",t.FRAG_DECRYPTED="hlsFragDecrypted",t.FRAG_PARSING_INIT_SEGMENT="hlsFragParsingInitSegment",t.FRAG_PARSING_USERDATA="hlsFragParsingUserdata",t.FRAG_PARSING_METADATA="hlsFragParsingMetadata",t.FRAG_PARSED="hlsFragParsed",t.FRAG_BUFFERED="hlsFragBuffered",t.FRAG_CHANGED="hlsFragChanged",t.FPS_DROP="hlsFpsDrop",t.FPS_DROP_LEVEL_CAPPING="hlsFpsDropLevelCapping",t.MAX_AUTO_LEVEL_UPDATED="hlsMaxAutoLevelUpdated",t.ERROR="hlsError",t.DESTROYING="hlsDestroying",t.KEY_LOADING="hlsKeyLoading",t.KEY_LOADED="hlsKeyLoaded",t.LIVE_BACK_BUFFER_REACHED="hlsLiveBackBufferReached",t.BACK_BUFFER_REACHED="hlsBackBufferReached",t.STEERING_MANIFEST_LOADED="hlsSteeringManifestLoaded",t}({}),L=function(t){return t.NETWORK_ERROR="networkError",t.MEDIA_ERROR="mediaError",t.KEY_SYSTEM_ERROR="keySystemError",t.MUX_ERROR="muxError",t.OTHER_ERROR="otherError",t}({}),A=function(t){return t.KEY_SYSTEM_NO_KEYS="keySystemNoKeys",t.KEY_SYSTEM_NO_ACCESS="keySystemNoAccess",t.KEY_SYSTEM_NO_SESSION="keySystemNoSession",t.KEY_SYSTEM_NO_CONFIGURED_LICENSE="keySystemNoConfiguredLicense",t.KEY_SYSTEM_LICENSE_REQUEST_FAILED="keySystemLicenseRequestFailed",t.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED="keySystemServerCertificateRequestFailed",t.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED="keySystemServerCertificateUpdateFailed",t.KEY_SYSTEM_SESSION_UPDATE_FAILED="keySystemSessionUpdateFailed",t.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED="keySystemStatusOutputRestricted",t.KEY_SYSTEM_STATUS_INTERNAL_ERROR="keySystemStatusInternalError",t.MANIFEST_LOAD_ERROR="manifestLoadError",t.MANIFEST_LOAD_TIMEOUT="manifestLoadTimeOut",t.MANIFEST_PARSING_ERROR="manifestParsingError",t.MANIFEST_INCOMPATIBLE_CODECS_ERROR="manifestIncompatibleCodecsError",t.LEVEL_EMPTY_ERROR="levelEmptyError",t.LEVEL_LOAD_ERROR="levelLoadError",t.LEVEL_LOAD_TIMEOUT="levelLoadTimeOut",t.LEVEL_PARSING_ERROR="levelParsingError",t.LEVEL_SWITCH_ERROR="levelSwitchError",t.AUDIO_TRACK_LOAD_ERROR="audioTrackLoadError",t.AUDIO_TRACK_LOAD_TIMEOUT="audioTrackLoadTimeOut",t.SUBTITLE_LOAD_ERROR="subtitleTrackLoadError",t.SUBTITLE_TRACK_LOAD_TIMEOUT="subtitleTrackLoadTimeOut",t.FRAG_LOAD_ERROR="fragLoadError",t.FRAG_LOAD_TIMEOUT="fragLoadTimeOut",t.FRAG_DECRYPT_ERROR="fragDecryptError",t.FRAG_PARSING_ERROR="fragParsingError",t.FRAG_GAP="fragGap",t.REMUX_ALLOC_ERROR="remuxAllocError",t.KEY_LOAD_ERROR="keyLoadError",t.KEY_LOAD_TIMEOUT="keyLoadTimeOut",t.BUFFER_ADD_CODEC_ERROR="bufferAddCodecError",t.BUFFER_INCOMPATIBLE_CODECS_ERROR="bufferIncompatibleCodecsError",t.BUFFER_APPEND_ERROR="bufferAppendError",t.BUFFER_APPENDING_ERROR="bufferAppendingError",t.BUFFER_STALLED_ERROR="bufferStalledError",t.BUFFER_FULL_ERROR="bufferFullError",t.BUFFER_SEEK_OVER_HOLE="bufferSeekOverHole",t.BUFFER_NUDGE_ON_STALL="bufferNudgeOnStall",t.INTERNAL_EXCEPTION="internalException",t.INTERNAL_ABORTED="aborted",t.UNKNOWN="unknown",t}({}),R=function(){},k={trace:R,debug:R,log:R,warn:R,info:R,error:R},b=k;function D(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];r.forEach((function(e){b[e]=t[e]?t[e].bind(t):function(t){var e=self.console[t];return e?e.bind(self.console,"["+t+"] >"):R}(e)}))}function I(t,e){if("object"==typeof console&&!0===t||"object"==typeof t){D(t,"debug","log","info","warn","error");try{b.log('Debug logs enabled for "'+e+'" in hls.js version 1.5.1')}catch(t){b=k}}else b=k}var w=b,C=/^(\d+)x(\d+)$/,_=/(.+?)=(".*?"|.*?)(?:,|$)/g,x=function(){function t(e){"string"==typeof e&&(e=t.parseAttrList(e)),o(this,e)}var e=t.prototype;return e.decimalInteger=function(t){var e=parseInt(this[t],10);return e>Number.MAX_SAFE_INTEGER?1/0:e},e.hexadecimalInteger=function(t){if(this[t]){var e=(this[t]||"0x").slice(2);e=(1&e.length?"0":"")+e;for(var r=new Uint8Array(e.length/2),i=0;i<e.length/2;i++)r[i]=parseInt(e.slice(2*i,2*i+2),16);return r}return null},e.hexadecimalIntegerAsNumber=function(t){var e=parseInt(this[t],16);return e>Number.MAX_SAFE_INTEGER?1/0:e},e.decimalFloatingPoint=function(t){return parseFloat(this[t])},e.optionalFloat=function(t,e){var r=this[t];return r?parseFloat(r):e},e.enumeratedString=function(t){return this[t]},e.bool=function(t){return"YES"===this[t]},e.decimalResolution=function(t){var e=C.exec(this[t]);if(null!==e)return{width:parseInt(e[1],10),height:parseInt(e[2],10)}},t.parseAttrList=function(t){var e,r={};for(_.lastIndex=0;null!==(e=_.exec(t));){var i=e[2];0===i.indexOf('"')&&i.lastIndexOf('"')===i.length-1&&(i=i.slice(1,-1)),r[e[1].trim()]=i}return r},s(t,[{key:"clientAttrs",get:function(){return Object.keys(this).filter((function(t){return"X-"===t.substring(0,2)}))}}]),t}();function P(t){return"SCTE35-OUT"===t||"SCTE35-IN"===t}var F=function(){function t(t,e){if(this.attr=void 0,this._startDate=void 0,this._endDate=void 0,this._badValueForSameId=void 0,e){var r=e.attr;for(var i in r)if(Object.prototype.hasOwnProperty.call(t,i)&&t[i]!==r[i]){w.warn('DATERANGE tag attribute: "'+i+'" does not match for tags with ID: "'+t.ID+'"'),this._badValueForSameId=i;break}t=o(new x({}),r,t)}if(this.attr=t,this._startDate=new Date(t["START-DATE"]),"END-DATE"in this.attr){var n=new Date(this.attr["END-DATE"]);y(n.getTime())&&(this._endDate=n)}}return s(t,[{key:"id",get:function(){return this.attr.ID}},{key:"class",get:function(){return this.attr.CLASS}},{key:"startDate",get:function(){return this._startDate}},{key:"endDate",get:function(){if(this._endDate)return this._endDate;var t=this.duration;return null!==t?new Date(this._startDate.getTime()+1e3*t):null}},{key:"duration",get:function(){if("DURATION"in this.attr){var t=this.attr.decimalFloatingPoint("DURATION");if(y(t))return t}else if(this._endDate)return(this._endDate.getTime()-this._startDate.getTime())/1e3;return null}},{key:"plannedDuration",get:function(){return"PLANNED-DURATION"in this.attr?this.attr.decimalFloatingPoint("PLANNED-DURATION"):null}},{key:"endOnNext",get:function(){return this.attr.bool("END-ON-NEXT")}},{key:"isValid",get:function(){return!!this.id&&!this._badValueForSameId&&y(this.startDate.getTime())&&(null===this.duration||this.duration>=0)&&(!this.endOnNext||!!this.class)}}]),t}(),M=function(){this.aborted=!1,this.loaded=0,this.retry=0,this.total=0,this.chunkCount=0,this.bwEstimate=0,this.loading={start:0,first:0,end:0},this.parsing={start:0,end:0},this.buffering={start:0,first:0,end:0}},O="audio",N="video",U="audiovideo",B=function(){function t(t){var e;this._byteRange=null,this._url=null,this.baseurl=void 0,this.relurl=void 0,this.elementaryStreams=((e={})[O]=null,e[N]=null,e[U]=null,e),this.baseurl=t}return t.prototype.setByteRange=function(t,e){var r,i=t.split("@",2);r=1===i.length?(null==e?void 0:e.byteRangeEndOffset)||0:parseInt(i[1]),this._byteRange=[r,parseInt(i[0])+r]},s(t,[{key:"byteRange",get:function(){return this._byteRange?this._byteRange:[]}},{key:"byteRangeStartOffset",get:function(){return this.byteRange[0]}},{key:"byteRangeEndOffset",get:function(){return this.byteRange[1]}},{key:"url",get:function(){return!this._url&&this.baseurl&&this.relurl&&(this._url=p.buildAbsoluteURL(this.baseurl,this.relurl,{alwaysNormalize:!0})),this._url||""},set:function(t){this._url=t}}]),t}(),G=function(t){function e(e,r){var i;return(i=t.call(this,r)||this)._decryptdata=null,i.rawProgramDateTime=null,i.programDateTime=null,i.tagList=[],i.duration=0,i.sn=0,i.levelkeys=void 0,i.type=void 0,i.loader=null,i.keyLoader=null,i.level=-1,i.cc=0,i.startPTS=void 0,i.endPTS=void 0,i.startDTS=void 0,i.endDTS=void 0,i.start=0,i.deltaPTS=void 0,i.maxStartPTS=void 0,i.minEndPTS=void 0,i.stats=new M,i.data=void 0,i.bitrateTest=!1,i.title=null,i.initSegment=null,i.endList=void 0,i.gap=void 0,i.urlId=0,i.type=e,i}l(e,t);var r=e.prototype;return r.setKeyFormat=function(t){if(this.levelkeys){var e=this.levelkeys[t];e&&!this._decryptdata&&(this._decryptdata=e.getDecryptData(this.sn))}},r.abortRequests=function(){var t,e;null==(t=this.loader)||t.abort(),null==(e=this.keyLoader)||e.abort()},r.setElementaryStreamInfo=function(t,e,r,i,n,a){void 0===a&&(a=!1);var s=this.elementaryStreams,o=s[t];o?(o.startPTS=Math.min(o.startPTS,e),o.endPTS=Math.max(o.endPTS,r),o.startDTS=Math.min(o.startDTS,i),o.endDTS=Math.max(o.endDTS,n)):s[t]={startPTS:e,endPTS:r,startDTS:i,endDTS:n,partial:a}},r.clearElementaryStreamInfo=function(){var t=this.elementaryStreams;t[O]=null,t[N]=null,t[U]=null},s(e,[{key:"decryptdata",get:function(){if(!this.levelkeys&&!this._decryptdata)return null;if(!this._decryptdata&&this.levelkeys&&!this.levelkeys.NONE){var t=this.levelkeys.identity;if(t)this._decryptdata=t.getDecryptData(this.sn);else{var e=Object.keys(this.levelkeys);if(1===e.length)return this._decryptdata=this.levelkeys[e[0]].getDecryptData(this.sn)}}return this._decryptdata}},{key:"end",get:function(){return this.start+this.duration}},{key:"endProgramDateTime",get:function(){if(null===this.programDateTime)return null;if(!y(this.programDateTime))return null;var t=y(this.duration)?this.duration:0;return this.programDateTime+1e3*t}},{key:"encrypted",get:function(){var t;if(null!=(t=this._decryptdata)&&t.encrypted)return!0;if(this.levelkeys){var e=Object.keys(this.levelkeys),r=e.length;if(r>1||1===r&&this.levelkeys[e[0]].encrypted)return!0}return!1}}]),e}(B),K=function(t){function e(e,r,i,n,a){var s;(s=t.call(this,i)||this).fragOffset=0,s.duration=0,s.gap=!1,s.independent=!1,s.relurl=void 0,s.fragment=void 0,s.index=void 0,s.stats=new M,s.duration=e.decimalFloatingPoint("DURATION"),s.gap=e.bool("GAP"),s.independent=e.bool("INDEPENDENT"),s.relurl=e.enumeratedString("URI"),s.fragment=r,s.index=n;var o=e.enumeratedString("BYTERANGE");return o&&s.setByteRange(o,a),a&&(s.fragOffset=a.fragOffset+a.duration),s}return l(e,t),s(e,[{key:"start",get:function(){return this.fragment.start+this.fragOffset}},{key:"end",get:function(){return this.start+this.duration}},{key:"loaded",get:function(){var t=this.elementaryStreams;return!!(t.audio||t.video||t.audiovideo)}}]),e}(B),H=function(){function t(t){this.PTSKnown=!1,this.alignedSliding=!1,this.averagetargetduration=void 0,this.endCC=0,this.endSN=0,this.fragments=void 0,this.fragmentHint=void 0,this.partList=null,this.dateRanges=void 0,this.live=!0,this.ageHeader=0,this.advancedDateTime=void 0,this.updated=!0,this.advanced=!0,this.availabilityDelay=void 0,this.misses=0,this.startCC=0,this.startSN=0,this.startTimeOffset=null,this.targetduration=0,this.totalduration=0,this.type=null,this.url=void 0,this.m3u8="",this.version=null,this.canBlockReload=!1,this.canSkipUntil=0,this.canSkipDateRanges=!1,this.skippedSegments=0,this.recentlyRemovedDateranges=void 0,this.partHoldBack=0,this.holdBack=0,this.partTarget=0,this.preloadHint=void 0,this.renditionReports=void 0,this.tuneInGoal=0,this.deltaUpdateFailed=void 0,this.driftStartTime=0,this.driftEndTime=0,this.driftStart=0,this.driftEnd=0,this.encryptedFragments=void 0,this.playlistParsingError=null,this.variableList=null,this.hasVariableRefs=!1,this.fragments=[],this.encryptedFragments=[],this.dateRanges={},this.url=t}return t.prototype.reloaded=function(t){if(!t)return this.advanced=!0,void(this.updated=!0);var e=this.lastPartSn-t.lastPartSn,r=this.lastPartIndex-t.lastPartIndex;this.updated=this.endSN!==t.endSN||!!r||!!e||!this.live,this.advanced=this.endSN>t.endSN||e>0||0===e&&r>0,this.updated||this.advanced?this.misses=Math.floor(.6*t.misses):this.misses=t.misses+1,this.availabilityDelay=t.availabilityDelay},s(t,[{key:"hasProgramDateTime",get:function(){return!!this.fragments.length&&y(this.fragments[this.fragments.length-1].programDateTime)}},{key:"levelTargetDuration",get:function(){return this.averagetargetduration||this.targetduration||10}},{key:"drift",get:function(){var t=this.driftEndTime-this.driftStartTime;return t>0?1e3*(this.driftEnd-this.driftStart)/t:1}},{key:"edge",get:function(){return this.partEnd||this.fragmentEnd}},{key:"partEnd",get:function(){var t;return null!=(t=this.partList)&&t.length?this.partList[this.partList.length-1].end:this.fragmentEnd}},{key:"fragmentEnd",get:function(){var t;return null!=(t=this.fragments)&&t.length?this.fragments[this.fragments.length-1].end:0}},{key:"age",get:function(){return this.advancedDateTime?Math.max(Date.now()-this.advancedDateTime,0)/1e3:0}},{key:"lastPartIndex",get:function(){var t;return null!=(t=this.partList)&&t.length?this.partList[this.partList.length-1].index:-1}},{key:"lastPartSn",get:function(){var t;return null!=(t=this.partList)&&t.length?this.partList[this.partList.length-1].fragment.sn:this.endSN}}]),t}();function V(t){return Uint8Array.from(atob(t),(function(t){return t.charCodeAt(0)}))}function Y(t){var e,r,i=t.split(":"),n=null;if("data"===i[0]&&2===i.length){var a=i[1].split(";"),s=a[a.length-1].split(",");if(2===s.length){var o="base64"===s[0],l=s[1];o?(a.splice(-1,1),n=V(l)):(e=W(l).subarray(0,16),(r=new Uint8Array(16)).set(e,16-e.length),n=r)}}return n}function W(t){return Uint8Array.from(unescape(encodeURIComponent(t)),(function(t){return t.charCodeAt(0)}))}var j="undefined"!=typeof self?self:void 0,q={CLEARKEY:"org.w3.clearkey",FAIRPLAY:"com.apple.fps",PLAYREADY:"com.microsoft.playready",WIDEVINE:"com.widevine.alpha"},X="org.w3.clearkey",z="com.apple.streamingkeydelivery",Q="com.microsoft.playready",J="urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed";function $(t){switch(t){case z:return q.FAIRPLAY;case Q:return q.PLAYREADY;case J:return q.WIDEVINE;case X:return q.CLEARKEY}}var Z="edef8ba979d64acea3c827dcd51d21ed";function tt(t){switch(t){case q.FAIRPLAY:return z;case q.PLAYREADY:return Q;case q.WIDEVINE:return J;case q.CLEARKEY:return X}}function et(t){var e=t.drmSystems,r=t.widevineLicenseUrl,i=e?[q.FAIRPLAY,q.WIDEVINE,q.PLAYREADY,q.CLEARKEY].filter((function(t){return!!e[t]})):[];return!i[q.WIDEVINE]&&r&&i.push(q.WIDEVINE),i}var rt,it=null!=j&&null!=(rt=j.navigator)&&rt.requestMediaKeySystemAccess?self.navigator.requestMediaKeySystemAccess.bind(self.navigator):null;function nt(t,e,r){return Uint8Array.prototype.slice?t.slice(e,r):new Uint8Array(Array.prototype.slice.call(t,e,r))}var at,st=function(t,e){return e+10<=t.length&&73===t[e]&&68===t[e+1]&&51===t[e+2]&&t[e+3]<255&&t[e+4]<255&&t[e+6]<128&&t[e+7]<128&&t[e+8]<128&&t[e+9]<128},ot=function(t,e){return e+10<=t.length&&51===t[e]&&68===t[e+1]&&73===t[e+2]&&t[e+3]<255&&t[e+4]<255&&t[e+6]<128&&t[e+7]<128&&t[e+8]<128&&t[e+9]<128},lt=function(t,e){for(var r=e,i=0;st(t,e);)i+=10,i+=ut(t,e+6),ot(t,e+10)&&(i+=10),e+=i;if(i>0)return t.subarray(r,r+i)},ut=function(t,e){var r=0;return r=(127&t[e])<<21,r|=(127&t[e+1])<<14,r|=(127&t[e+2])<<7,r|=127&t[e+3]},ht=function(t,e){return st(t,e)&&ut(t,e+6)+10<=t.length-e},dt=function(t){for(var e=gt(t),r=0;r<e.length;r++){var i=e[r];if(ct(i))return Et(i)}},ct=function(t){return t&&"PRIV"===t.key&&"com.apple.streaming.transportStreamTimestamp"===t.info},ft=function(t){var e=String.fromCharCode(t[0],t[1],t[2],t[3]),r=ut(t,4);return{type:e,size:r,data:t.subarray(10,10+r)}},gt=function(t){for(var e=0,r=[];st(t,e);){for(var i=ut(t,e+6),n=(e+=10)+i;e+8<n;){var a=ft(t.subarray(e)),s=vt(a);s&&r.push(s),e+=a.size+10}ot(t,e)&&(e+=10)}return r},vt=function(t){return"PRIV"===t.type?mt(t):"W"===t.type[0]?yt(t):pt(t)},mt=function(t){if(!(t.size<2)){var e=Tt(t.data,!0),r=new Uint8Array(t.data.subarray(e.length+1));return{key:t.type,info:e,data:r.buffer}}},pt=function(t){if(!(t.size<2)){if("TXXX"===t.type){var e=1,r=Tt(t.data.subarray(e),!0);e+=r.length+1;var i=Tt(t.data.subarray(e));return{key:t.type,info:r,data:i}}var n=Tt(t.data.subarray(1));return{key:t.type,data:n}}},yt=function(t){if("WXXX"===t.type){if(t.size<2)return;var e=1,r=Tt(t.data.subarray(e),!0);e+=r.length+1;var i=Tt(t.data.subarray(e));return{key:t.type,info:r,data:i}}var n=Tt(t.data);return{key:t.type,data:n}},Et=function(t){if(8===t.data.byteLength){var e=new Uint8Array(t.data),r=1&e[3],i=(e[4]<<23)+(e[5]<<15)+(e[6]<<7)+e[7];return i/=45,r&&(i+=47721858.84),Math.round(i)}},Tt=function(t,e){void 0===e&&(e=!1);var r=St();if(r){var i=r.decode(t);if(e){var n=i.indexOf("\0");return-1!==n?i.substring(0,n):i}return i.replace(/\0/g,"")}for(var a,s,o,l=t.length,u="",h=0;h<l;){if(0===(a=t[h++])&&e)return u;if(0!==a&&3!==a)switch(a>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:u+=String.fromCharCode(a);break;case 12:case 13:s=t[h++],u+=String.fromCharCode((31&a)<<6|63&s);break;case 14:s=t[h++],o=t[h++],u+=String.fromCharCode((15&a)<<12|(63&s)<<6|(63&o)<<0)}}return u};function St(){if(!navigator.userAgent.includes("PlayStation 4"))return at||void 0===self.TextDecoder||(at=new self.TextDecoder("utf-8")),at}var Lt=function(t){for(var e="",r=0;r<t.length;r++){var i=t[r].toString(16);i.length<2&&(i="0"+i),e+=i}return e},At=Math.pow(2,32)-1,Rt=[].push,kt={video:1,audio:2,id3:3,text:4};function bt(t){return String.fromCharCode.apply(null,t)}function Dt(t,e){var r=t[e]<<8|t[e+1];return r<0?65536+r:r}function It(t,e){var r=wt(t,e);return r<0?4294967296+r:r}function wt(t,e){return t[e]<<24|t[e+1]<<16|t[e+2]<<8|t[e+3]}function Ct(t,e,r){t[e]=r>>24,t[e+1]=r>>16&255,t[e+2]=r>>8&255,t[e+3]=255&r}function _t(t,e){var r=[];if(!e.length)return r;for(var i=t.byteLength,n=0;n<i;){var a=It(t,n),s=a>1?n+a:i;if(bt(t.subarray(n+4,n+8))===e[0])if(1===e.length)r.push(t.subarray(n+8,s));else{var o=_t(t.subarray(n+8,s),e.slice(1));o.length&&Rt.apply(r,o)}n=s}return r}function xt(t){var e=[],r=t[0],i=8,n=It(t,i);i+=4,i+=0===r?8:16,i+=2;var a=t.length+0,s=Dt(t,i);i+=2;for(var o=0;o<s;o++){var l=i,u=It(t,l);l+=4;var h=2147483647&u;if(1==(2147483648&u)>>>31)return w.warn("SIDX has hierarchical references (not supported)"),null;var d=It(t,l);l+=4,e.push({referenceSize:h,subsegmentDuration:d,info:{duration:d/n,start:a,end:a+h-1}}),a+=h,i=l+=4}return{earliestPresentationTime:0,timescale:n,version:r,referencesCount:s,references:e}}function Pt(t){for(var e=[],r=_t(t,["moov","trak"]),n=0;n<r.length;n++){var a=r[n],s=_t(a,["tkhd"])[0];if(s){var o=s[0],l=It(s,0===o?12:20),u=_t(a,["mdia","mdhd"])[0];if(u){var h=It(u,0===(o=u[0])?12:20),d=_t(a,["mdia","hdlr"])[0];if(d){var c=bt(d.subarray(8,12)),f={soun:O,vide:N}[c];if(f){var g=Ft(_t(a,["mdia","minf","stbl","stsd"])[0]);e[l]={timescale:h,type:f},e[f]=i({timescale:h,id:l},g)}}}}}return _t(t,["moov","mvex","trex"]).forEach((function(t){var r=It(t,4),i=e[r];i&&(i.default={duration:It(t,12),flags:It(t,20)})})),e}function Ft(t){var e=t.subarray(8),r=e.subarray(86),i=bt(e.subarray(4,8)),n=i,a="enca"===i||"encv"===i;if(a){var s=_t(e,[i])[0];_t(s.subarray("enca"===i?28:78),["sinf"]).forEach((function(t){var e=_t(t,["schm"])[0];if(e){var r=bt(e.subarray(4,8));if("cbcs"===r||"cenc"===r){var i=_t(t,["frma"])[0];i&&(n=bt(i))}}}))}switch(n){case"avc1":case"avc2":case"avc3":case"avc4":var o=_t(r,["avcC"])[0];n+="."+Ot(o[1])+Ot(o[2])+Ot(o[3]);break;case"mp4a":var l=_t(e,[i])[0],u=_t(l.subarray(28),["esds"])[0];if(u&&u.length>12){var h=4;if(3!==u[h++])break;h=Mt(u,h),h+=2;var d=u[h++];if(128&d&&(h+=2),64&d&&(h+=u[h++]),4!==u[h++])break;h=Mt(u,h);var c=u[h++];if(64!==c)break;if(n+="."+Ot(c),h+=12,5!==u[h++])break;h=Mt(u,h);var f=u[h++],g=(248&f)>>3;31===g&&(g+=1+((7&f)<<3)+((224&u[h])>>5)),n+="."+g}break;case"hvc1":case"hev1":var v=_t(r,["hvcC"])[0],m=v[1],p=["","A","B","C"][m>>6],y=31&m,E=It(v,2),T=(32&m)>>5?"H":"L",S=v[12],L=v.subarray(6,12);n+="."+p+y,n+="."+E.toString(16).toUpperCase(),n+="."+T+S;for(var A="",R=L.length;R--;){var k=L[R];(k||A)&&(A="."+k.toString(16).toUpperCase()+A)}n+=A;break;case"dvh1":case"dvhe":var b=_t(r,["dvcC"])[0],D=b[2]>>1&127,I=b[2]<<5&32|b[3]>>3&31;n+="."+Nt(D)+"."+Nt(I);break;case"vp09":var w=_t(r,["vpcC"])[0],C=w[4],_=w[5],x=w[6]>>4&15;n+="."+Nt(C)+"."+Nt(_)+"."+Nt(x);break;case"av01":var P=_t(r,["av1C"])[0],F=P[1]>>>5,M=31&P[1],O=P[2]>>>7?"H":"M",N=(64&P[2])>>6,U=(32&P[2])>>5,B=2===F&&N?U?12:10:N?10:8,G=(16&P[2])>>4,K=(8&P[2])>>3,H=(4&P[2])>>2,V=3&P[2];n+="."+F+"."+Nt(M)+O+"."+Nt(B)+"."+G+"."+K+H+V+"."+Nt(1)+"."+Nt(1)+"."+Nt(1)+".0"}return{codec:n,encrypted:a}}function Mt(t,e){for(var r=e+5;128&t[e++]&&e<r;);return e}function Ot(t){return("0"+t.toString(16).toUpperCase()).slice(-2)}function Nt(t){return(t<10?"0":"")+t}function Ut(t){var e=_t(t,["schm"])[0];if(e){var r=bt(e.subarray(4,8));if("cbcs"===r||"cenc"===r)return _t(t,["schi","tenc"])[0]}return w.error("[eme] missing 'schm' box"),null}function Bt(t){var e=It(t,0),r=8;1&e&&(r+=4),4&e&&(r+=4);for(var i=0,n=It(t,4),a=0;a<n;a++)256&e&&(i+=It(t,r),r+=4),512&e&&(r+=4),1024&e&&(r+=4),2048&e&&(r+=4);return i}function Gt(t,e){var r=new Uint8Array(t.length+e.length);return r.set(t),r.set(e,t.length),r}function Kt(t,e){var r=[],i=e.samples,n=e.timescale,a=e.id,s=!1;return _t(i,["moof"]).map((function(o){var l=o.byteOffset-8;_t(o,["traf"]).map((function(o){var u=_t(o,["tfdt"]).map((function(t){var e=t[0],r=It(t,4);return 1===e&&(r*=Math.pow(2,32),r+=It(t,8)),r/n}))[0];return void 0!==u&&(t=u),_t(o,["tfhd"]).map((function(u){var h=It(u,4),d=16777215&It(u,0),c=0,f=0!=(16&d),g=0,v=0!=(32&d),m=8;h===a&&(0!=(1&d)&&(m+=8),0!=(2&d)&&(m+=4),0!=(8&d)&&(c=It(u,m),m+=4),f&&(g=It(u,m),m+=4),v&&(m+=4),"video"===e.type&&(s=function(t){if(!t)return!1;var e=t.indexOf("."),r=e<0?t:t.substring(0,e);return"hvc1"===r||"hev1"===r||"dvh1"===r||"dvhe"===r}(e.codec)),_t(o,["trun"]).map((function(a){var o=a[0],u=16777215&It(a,0),h=0!=(1&u),d=0,f=0!=(4&u),v=0!=(256&u),m=0,p=0!=(512&u),y=0,E=0!=(1024&u),T=0!=(2048&u),S=0,L=It(a,4),A=8;h&&(d=It(a,A),A+=4),f&&(A+=4);for(var R=d+l,k=0;k<L;k++){if(v?(m=It(a,A),A+=4):m=c,p?(y=It(a,A),A+=4):y=g,E&&(A+=4),T&&(S=0===o?It(a,A):wt(a,A),A+=4),e.type===N)for(var b=0;b<y;){var D=It(i,R);Ht(s,i[R+=4])&&Vt(i.subarray(R,R+D),s?2:1,t+S/n,r),R+=D,b+=D+4}t+=m/n}})))}))}))})),r}function Ht(t,e){if(t){var r=e>>1&63;return 39===r||40===r}return 6==(31&e)}function Vt(t,e,r,i){var n=Yt(t),a=0;a+=e;for(var s=0,o=0,l=0;a<n.length;){s=0;do{if(a>=n.length)break;s+=l=n[a++]}while(255===l);o=0;do{if(a>=n.length)break;o+=l=n[a++]}while(255===l);var u=n.length-a,h=a;if(o<u)a+=o;else if(o>u){w.error("Malformed SEI payload. "+o+" is too small, only "+u+" bytes left to parse.");break}if(4===s){if(181===n[h++]){var d=Dt(n,h);if(h+=2,49===d){var c=It(n,h);if(h+=4,1195456820===c){var f=n[h++];if(3===f){var g=n[h++],v=64&g,m=v?2+3*(31&g):0,p=new Uint8Array(m);if(v){p[0]=g;for(var y=1;y<m;y++)p[y]=n[h++]}i.push({type:f,payloadType:s,pts:r,bytes:p})}}}}}else if(5===s&&o>16){for(var E=[],T=0;T<16;T++){var S=n[h++].toString(16);E.push(1==S.length?"0"+S:S),3!==T&&5!==T&&7!==T&&9!==T||E.push("-")}for(var L=o-16,A=new Uint8Array(L),R=0;R<L;R++)A[R]=n[h++];i.push({payloadType:s,pts:r,uuid:E.join(""),userData:Tt(A),userDataBytes:A})}}}function Yt(t){for(var e=t.byteLength,r=[],i=1;i<e-2;)0===t[i]&&0===t[i+1]&&3===t[i+2]?(r.push(i+2),i+=2):i++;if(0===r.length)return t;var n=e-r.length,a=new Uint8Array(n),s=0;for(i=0;i<n;s++,i++)s===r[0]&&(s++,r.shift()),a[i]=t[s];return a}function Wt(t,e,r){if(16!==t.byteLength)throw new RangeError("Invalid system id");var i,n,a;if(e){i=1,n=new Uint8Array(16*e.length);for(var s=0;s<e.length;s++){var o=e[s];if(16!==o.byteLength)throw new RangeError("Invalid key");n.set(o,16*s)}}else i=0,n=new Uint8Array;i>0?(a=new Uint8Array(4),e.length>0&&new DataView(a.buffer).setUint32(0,e.length,!1)):a=new Uint8Array;var l=new Uint8Array(4);return r&&r.byteLength>0&&new DataView(l.buffer).setUint32(0,r.byteLength,!1),function(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];for(var n=r.length,a=8,s=n;s--;)a+=r[s].byteLength;var o=new Uint8Array(a);for(o[0]=a>>24&255,o[1]=a>>16&255,o[2]=a>>8&255,o[3]=255&a,o.set(t,4),s=0,a=8;s<n;s++)o.set(r[s],a),a+=r[s].byteLength;return o}([112,115,115,104],new Uint8Array([i,0,0,0]),t,a,n,l,r||new Uint8Array)}var jt={},qt=function(){function t(t,e,r,i,n){void 0===i&&(i=[1]),void 0===n&&(n=null),this.uri=void 0,this.method=void 0,this.keyFormat=void 0,this.keyFormatVersions=void 0,this.encrypted=void 0,this.isCommonEncryption=void 0,this.iv=null,this.key=null,this.keyId=null,this.pssh=null,this.method=t,this.uri=e,this.keyFormat=r,this.keyFormatVersions=i,this.iv=n,this.encrypted=!!t&&"NONE"!==t,this.isCommonEncryption=this.encrypted&&"AES-128"!==t}t.clearKeyUriToKeyIdMap=function(){jt={}};var e=t.prototype;return e.isSupported=function(){if(this.method){if("AES-128"===this.method||"NONE"===this.method)return!0;if("identity"===this.keyFormat)return"SAMPLE-AES"===this.method;switch(this.keyFormat){case z:case J:case Q:case X:return-1!==["ISO-23001-7","SAMPLE-AES","SAMPLE-AES-CENC","SAMPLE-AES-CTR"].indexOf(this.method)}}return!1},e.getDecryptData=function(e){if(!this.encrypted||!this.uri)return null;if("AES-128"===this.method&&this.uri&&!this.iv){"number"!=typeof e&&("AES-128"!==this.method||this.iv||w.warn('missing IV for initialization segment with method="'+this.method+'" - compliance issue'),e=0);var r=function(t){for(var e=new Uint8Array(16),r=12;r<16;r++)e[r]=t>>8*(15-r)&255;return e}(e);return new t(this.method,this.uri,"identity",this.keyFormatVersions,r)}var i=Y(this.uri);if(i)switch(this.keyFormat){case J:this.pssh=i,i.length>=22&&(this.keyId=i.subarray(i.length-22,i.length-6));break;case Q:var n=new Uint8Array([154,4,240,121,152,64,66,134,171,146,230,91,224,136,95,149]);this.pssh=Wt(n,null,i);var a=new Uint16Array(i.buffer,i.byteOffset,i.byteLength/2),s=String.fromCharCode.apply(null,Array.from(a)),o=s.substring(s.indexOf("<"),s.length),l=(new DOMParser).parseFromString(o,"text/xml").getElementsByTagName("KID")[0];if(l){var u=l.childNodes[0]?l.childNodes[0].nodeValue:l.getAttribute("VALUE");if(u){var h=V(u).subarray(0,16);!function(t){var e=function(t,e,r){var i=t[e];t[e]=t[r],t[r]=i};e(t,0,3),e(t,1,2),e(t,4,5),e(t,6,7)}(h),this.keyId=h}}break;default:var d=i.subarray(0,16);if(16!==d.length){var c=new Uint8Array(16);c.set(d,16-d.length),d=c}this.keyId=d}if(!this.keyId||16!==this.keyId.byteLength){var f=jt[this.uri];if(!f){var g=Object.keys(jt).length%Number.MAX_SAFE_INTEGER;f=new Uint8Array(16),new DataView(f.buffer,12,4).setUint32(0,g),jt[this.uri]=f}this.keyId=f}return this},t}(),Xt=/\{\$([a-zA-Z0-9-_]+)\}/g;function zt(t){return Xt.test(t)}function Qt(t,e,r){if(null!==t.variableList||t.hasVariableRefs)for(var i=r.length;i--;){var n=r[i],a=e[n];a&&(e[n]=Jt(t,a))}}function Jt(t,e){if(null!==t.variableList||t.hasVariableRefs){var r=t.variableList;return e.replace(Xt,(function(e){var i=e.substring(2,e.length-1),n=null==r?void 0:r[i];return void 0===n?(t.playlistParsingError||(t.playlistParsingError=new Error('Missing preceding EXT-X-DEFINE tag for Variable Reference: "'+i+'"')),e):n}))}return e}function $t(t,e,r){var i,n,a=t.variableList;if(a||(t.variableList=a={}),"QUERYPARAM"in e){i=e.QUERYPARAM;try{var s=new self.URL(r).searchParams;if(!s.has(i))throw new Error('"'+i+'" does not match any query parameter in URI: "'+r+'"');n=s.get(i)}catch(e){t.playlistParsingError||(t.playlistParsingError=new Error("EXT-X-DEFINE QUERYPARAM: "+e.message))}}else i=e.NAME,n=e.VALUE;i in a?t.playlistParsingError||(t.playlistParsingError=new Error('EXT-X-DEFINE duplicate Variable Name declarations: "'+i+'"')):a[i]=n||""}function Zt(t,e,r){var i=e.IMPORT;if(r&&i in r){var n=t.variableList;n||(t.variableList=n={}),n[i]=r[i]}else t.playlistParsingError||(t.playlistParsingError=new Error('EXT-X-DEFINE IMPORT attribute not found in Multivariant Playlist: "'+i+'"'))}function te(t){if(void 0===t&&(t=!0),"undefined"!=typeof self)return(t||!self.MediaSource)&&self.ManagedMediaSource||self.MediaSource||self.WebKitMediaSource}var ee={audio:{a3ds:1,"ac-3":.95,"ac-4":1,alac:.9,alaw:1,dra1:1,"dts+":1,"dts-":1,dtsc:1,dtse:1,dtsh:1,"ec-3":.9,enca:1,fLaC:.9,flac:.9,FLAC:.9,g719:1,g726:1,m4ae:1,mha1:1,mha2:1,mhm1:1,mhm2:1,mlpa:1,mp4a:1,"raw ":1,Opus:1,opus:1,samr:1,sawb:1,sawp:1,sevc:1,sqcp:1,ssmv:1,twos:1,ulaw:1},video:{avc1:1,avc2:1,avc3:1,avc4:1,avcp:1,av01:.8,drac:1,dva1:1,dvav:1,dvh1:.7,dvhe:.7,encv:1,hev1:.75,hvc1:.75,mjp2:1,mp4v:1,mvc1:1,mvc2:1,mvc3:1,mvc4:1,resv:1,rv60:1,s263:1,svc1:1,svc2:1,"vc-1":1,vp08:1,vp09:.9},text:{stpp:1,wvtt:1}};function re(t,e,r){return void 0===r&&(r=!0),!t.split(",").some((function(t){return!ie(t,e,r)}))}function ie(t,e,r){var i;void 0===r&&(r=!0);var n=te(r);return null!=(i=null==n?void 0:n.isTypeSupported(ne(t,e)))&&i}function ne(t,e){return e+'/mp4;codecs="'+t+'"'}function ae(t){if(t){var e=t.substring(0,4);return ee.video[e]}return 2}function se(t){return t.split(",").reduce((function(t,e){var r=ee.video[e];return r?(2*r+t)/(t?3:2):(ee.audio[e]+t)/(t?2:1)}),0)}var oe={},le=/flac|opus/i;function ue(t,e){return void 0===e&&(e=!0),t.replace(le,(function(t){return function(t,e){if(void 0===e&&(e=!0),oe[t])return oe[t];for(var r={flac:["flac","fLaC","FLAC"],opus:["opus","Opus"]}[t],i=0;i<r.length;i++)if(ie(r[i],"audio",e))return oe[t]=r[i],r[i];return t}(t.toLowerCase(),e)}))}function he(t,e){return t&&"mp4a"!==t?t:e}var de=/#EXT-X-STREAM-INF:([^\r\n]*)(?:[\r\n](?:#[^\r\n]*)?)*([^\r\n]+)|#EXT-X-(SESSION-DATA|SESSION-KEY|DEFINE|CONTENT-STEERING|START):([^\r\n]*)[\r\n]+/g,ce=/#EXT-X-MEDIA:(.*)/g,fe=/^#EXT(?:INF|-X-TARGETDURATION):/m,ge=new RegExp([/#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source,/(?!#) *(\S[\S ]*)/.source,/#EXT-X-BYTERANGE:*(.+)/.source,/#EXT-X-PROGRAM-DATE-TIME:(.+)/.source,/#.*/.source].join("|"),"g"),ve=new RegExp([/#(EXTM3U)/.source,/#EXT-X-(DATERANGE|DEFINE|KEY|MAP|PART|PART-INF|PLAYLIST-TYPE|PRELOAD-HINT|RENDITION-REPORT|SERVER-CONTROL|SKIP|START):(.+)/.source,/#EXT-X-(BITRATE|DISCONTINUITY-SEQUENCE|MEDIA-SEQUENCE|TARGETDURATION|VERSION): *(\d+)/.source,/#EXT-X-(DISCONTINUITY|ENDLIST|GAP|INDEPENDENT-SEGMENTS)/.source,/(#)([^:]*):(.*)/.source,/(#)(.*)(?:.*)\r?\n?/.source].join("|")),me=function(){function t(){}return t.findGroup=function(t,e){for(var r=0;r<t.length;r++){var i=t[r];if(i.id===e)return i}},t.resolve=function(t,e){return p.buildAbsoluteURL(e,t,{alwaysNormalize:!0})},t.isMediaPlaylist=function(t){return fe.test(t)},t.parseMasterPlaylist=function(e,r){var i,n={contentSteering:null,levels:[],playlistParsingError:null,sessionData:null,sessionKeys:null,startTimeOffset:null,variableList:null,hasVariableRefs:zt(e)},a=[];for(de.lastIndex=0;null!=(i=de.exec(e));)if(i[1]){var s,o=new x(i[1]);Qt(n,o,["CODECS","SUPPLEMENTAL-CODECS","ALLOWED-CPC","PATHWAY-ID","STABLE-VARIANT-ID","AUDIO","VIDEO","SUBTITLES","CLOSED-CAPTIONS","NAME"]);var l=Jt(n,i[2]),u={attrs:o,bitrate:o.decimalInteger("BANDWIDTH")||o.decimalInteger("AVERAGE-BANDWIDTH"),name:o.NAME,url:t.resolve(l,r)},h=o.decimalResolution("RESOLUTION");h&&(u.width=h.width,u.height=h.height),Ee(o.CODECS,u),null!=(s=u.unknownCodecs)&&s.length||a.push(u),n.levels.push(u)}else if(i[3]){var d=i[3],c=i[4];switch(d){case"SESSION-DATA":var f=new x(c);Qt(n,f,["DATA-ID","LANGUAGE","VALUE","URI"]);var g=f["DATA-ID"];g&&(null===n.sessionData&&(n.sessionData={}),n.sessionData[g]=f);break;case"SESSION-KEY":var v=pe(c,r,n);v.encrypted&&v.isSupported()?(null===n.sessionKeys&&(n.sessionKeys=[]),n.sessionKeys.push(v)):w.warn('[Keys] Ignoring invalid EXT-X-SESSION-KEY tag: "'+c+'"');break;case"DEFINE":var m=new x(c);Qt(n,m,["NAME","VALUE","QUERYPARAM"]),$t(n,m,r);break;case"CONTENT-STEERING":var p=new x(c);Qt(n,p,["SERVER-URI","PATHWAY-ID"]),n.contentSteering={uri:t.resolve(p["SERVER-URI"],r),pathwayId:p["PATHWAY-ID"]||"."};break;case"START":n.startTimeOffset=ye(c)}}var y=a.length>0&&a.length<n.levels.length;return n.levels=y?a:n.levels,0===n.levels.length&&(n.playlistParsingError=new Error("no levels found in manifest")),n},t.parseMasterPlaylistMedia=function(e,r,i){var n,a={},s=i.levels,o={AUDIO:s.map((function(t){return{id:t.attrs.AUDIO,audioCodec:t.audioCodec}})),SUBTITLES:s.map((function(t){return{id:t.attrs.SUBTITLES,textCodec:t.textCodec}})),"CLOSED-CAPTIONS":[]},l=0;for(ce.lastIndex=0;null!==(n=ce.exec(e));){var u=new x(n[1]),h=u.TYPE;if(h){var d=o[h],c=a[h]||[];a[h]=c,Qt(i,u,["URI","GROUP-ID","LANGUAGE","ASSOC-LANGUAGE","STABLE-RENDITION-ID","NAME","INSTREAM-ID","CHARACTERISTICS","CHANNELS"]);var f=u.LANGUAGE,g=u["ASSOC-LANGUAGE"],v=u.CHANNELS,m=u.CHARACTERISTICS,p=u["INSTREAM-ID"],y={attrs:u,bitrate:0,id:l++,groupId:u["GROUP-ID"]||"",name:u.NAME||f||"",type:h,default:u.bool("DEFAULT"),autoselect:u.bool("AUTOSELECT"),forced:u.bool("FORCED"),lang:f,url:u.URI?t.resolve(u.URI,r):""};if(g&&(y.assocLang=g),v&&(y.channels=v),m&&(y.characteristics=m),p&&(y.instreamId=p),null!=d&&d.length){var E=t.findGroup(d,y.groupId)||d[0];Te(y,E,"audioCodec"),Te(y,E,"textCodec")}c.push(y)}}return a},t.parseLevelPlaylist=function(t,e,r,i,n,a){var s,l,u,h=new H(e),d=h.fragments,c=null,f=0,g=0,v=0,m=0,p=null,E=new G(i,e),T=-1,S=!1,L=null;for(ge.lastIndex=0,h.m3u8=t,h.hasVariableRefs=zt(t);null!==(s=ge.exec(t));){S&&(S=!1,(E=new G(i,e)).start=v,E.sn=f,E.cc=m,E.level=r,c&&(E.initSegment=c,E.rawProgramDateTime=c.rawProgramDateTime,c.rawProgramDateTime=null,L&&(E.setByteRange(L),L=null)));var A=s[1];if(A){E.duration=parseFloat(A);var R=(" "+s[2]).slice(1);E.title=R||null,E.tagList.push(R?["INF",A,R]:["INF",A])}else if(s[3]){if(y(E.duration)){E.start=v,u&&Ae(E,u,h),E.sn=f,E.level=r,E.cc=m,d.push(E);var k=(" "+s[3]).slice(1);E.relurl=Jt(h,k),Se(E,p),p=E,v+=E.duration,f++,g=0,S=!0}}else if(s[4]){var b=(" "+s[4]).slice(1);p?E.setByteRange(b,p):E.setByteRange(b)}else if(s[5])E.rawProgramDateTime=(" "+s[5]).slice(1),E.tagList.push(["PROGRAM-DATE-TIME",E.rawProgramDateTime]),-1===T&&(T=d.length);else{if(!(s=s[0].match(ve))){w.warn("No matches on slow regex match for level playlist!");continue}for(l=1;l<s.length&&void 0===s[l];l++);var D=(" "+s[l]).slice(1),I=(" "+s[l+1]).slice(1),C=s[l+2]?(" "+s[l+2]).slice(1):"";switch(D){case"PLAYLIST-TYPE":h.type=I.toUpperCase();break;case"MEDIA-SEQUENCE":f=h.startSN=parseInt(I);break;case"SKIP":var _=new x(I);Qt(h,_,["RECENTLY-REMOVED-DATERANGES"]);var P=_.decimalInteger("SKIPPED-SEGMENTS");if(y(P)){h.skippedSegments=P;for(var M=P;M--;)d.unshift(null);f+=P}var O=_.enumeratedString("RECENTLY-REMOVED-DATERANGES");O&&(h.recentlyRemovedDateranges=O.split("\t"));break;case"TARGETDURATION":h.targetduration=Math.max(parseInt(I),1);break;case"VERSION":h.version=parseInt(I);break;case"INDEPENDENT-SEGMENTS":case"EXTM3U":break;case"ENDLIST":h.live=!1;break;case"#":(I||C)&&E.tagList.push(C?[I,C]:[I]);break;case"DISCONTINUITY":m++,E.tagList.push(["DIS"]);break;case"GAP":E.gap=!0,E.tagList.push([D]);break;case"BITRATE":E.tagList.push([D,I]);break;case"DATERANGE":var N=new x(I);Qt(h,N,["ID","CLASS","START-DATE","END-DATE","SCTE35-CMD","SCTE35-OUT","SCTE35-IN"]),Qt(h,N,N.clientAttrs);var U=new F(N,h.dateRanges[N.ID]);U.isValid||h.skippedSegments?h.dateRanges[U.id]=U:w.warn('Ignoring invalid DATERANGE tag: "'+I+'"'),E.tagList.push(["EXT-X-DATERANGE",I]);break;case"DEFINE":var B=new x(I);Qt(h,B,["NAME","VALUE","IMPORT","QUERYPARAM"]),"IMPORT"in B?Zt(h,B,a):$t(h,B,e);break;case"DISCONTINUITY-SEQUENCE":m=parseInt(I);break;case"KEY":var V=pe(I,e,h);if(V.isSupported()){if("NONE"===V.method){u=void 0;break}u||(u={}),u[V.keyFormat]&&(u=o({},u)),u[V.keyFormat]=V}else w.warn('[Keys] Ignoring invalid EXT-X-KEY tag: "'+I+'"');break;case"START":h.startTimeOffset=ye(I);break;case"MAP":var Y=new x(I);if(Qt(h,Y,["BYTERANGE","URI"]),E.duration){var W=new G(i,e);Le(W,Y,r,u),c=W,E.initSegment=c,c.rawProgramDateTime&&!E.rawProgramDateTime&&(E.rawProgramDateTime=c.rawProgramDateTime)}else{var j=E.byteRangeEndOffset;if(j){var q=E.byteRangeStartOffset;L=j-q+"@"+q}else L=null;Le(E,Y,r,u),c=E,S=!0}break;case"SERVER-CONTROL":var X=new x(I);h.canBlockReload=X.bool("CAN-BLOCK-RELOAD"),h.canSkipUntil=X.optionalFloat("CAN-SKIP-UNTIL",0),h.canSkipDateRanges=h.canSkipUntil>0&&X.bool("CAN-SKIP-DATERANGES"),h.partHoldBack=X.optionalFloat("PART-HOLD-BACK",0),h.holdBack=X.optionalFloat("HOLD-BACK",0);break;case"PART-INF":var z=new x(I);h.partTarget=z.decimalFloatingPoint("PART-TARGET");break;case"PART":var Q=h.partList;Q||(Q=h.partList=[]);var J=g>0?Q[Q.length-1]:void 0,$=g++,Z=new x(I);Qt(h,Z,["BYTERANGE","URI"]);var tt=new K(Z,E,e,$,J);Q.push(tt),E.duration+=tt.duration;break;case"PRELOAD-HINT":var et=new x(I);Qt(h,et,["URI"]),h.preloadHint=et;break;case"RENDITION-REPORT":var rt=new x(I);Qt(h,rt,["URI"]),h.renditionReports=h.renditionReports||[],h.renditionReports.push(rt);break;default:w.warn("line parsed but not handled: "+s)}}}p&&!p.relurl?(d.pop(),v-=p.duration,h.partList&&(h.fragmentHint=p)):h.partList&&(Se(E,p),E.cc=m,h.fragmentHint=E,u&&Ae(E,u,h));var it=d.length,nt=d[0],at=d[it-1];if((v+=h.skippedSegments*h.targetduration)>0&&it&&at){h.averagetargetduration=v/it;var st=at.sn;h.endSN="initSegment"!==st?st:0,h.live||(at.endList=!0),nt&&(h.startCC=nt.cc)}else h.endSN=0,h.startCC=0;return h.fragmentHint&&(v+=h.fragmentHint.duration),h.totalduration=v,h.endCC=m,T>0&&function(t,e){for(var r=t[e],i=e;i--;){var n=t[i];if(!n)return;n.programDateTime=r.programDateTime-1e3*n.duration,r=n}}(d,T),h},t}();function pe(t,e,r){var i,n,a=new x(t);Qt(r,a,["KEYFORMAT","KEYFORMATVERSIONS","URI","IV","URI"]);var s=null!=(i=a.METHOD)?i:"",o=a.URI,l=a.hexadecimalInteger("IV"),u=a.KEYFORMATVERSIONS,h=null!=(n=a.KEYFORMAT)?n:"identity";o&&a.IV&&!l&&w.error("Invalid IV: "+a.IV);var d=o?me.resolve(o,e):"",c=(u||"1").split("/").map(Number).filter(Number.isFinite);return new qt(s,d,h,c,l)}function ye(t){var e=new x(t).decimalFloatingPoint("TIME-OFFSET");return y(e)?e:null}function Ee(t,e){var r=(t||"").split(/[ ,]+/).filter((function(t){return t}));["video","audio","text"].forEach((function(t){var i=r.filter((function(e){return function(t,e){var r=ee[e];return!!r&&!!r[t.slice(0,4)]}(e,t)}));i.length&&(e[t+"Codec"]=i.join(","),r=r.filter((function(t){return-1===i.indexOf(t)})))})),e.unknownCodecs=r}function Te(t,e,r){var i=e[r];i&&(t[r]=i)}function Se(t,e){t.rawProgramDateTime?t.programDateTime=Date.parse(t.rawProgramDateTime):null!=e&&e.programDateTime&&(t.programDateTime=e.endProgramDateTime),y(t.programDateTime)||(t.programDateTime=null,t.rawProgramDateTime=null)}function Le(t,e,r,i){t.relurl=e.URI,e.BYTERANGE&&t.setByteRange(e.BYTERANGE),t.level=r,t.sn="initSegment",i&&(t.levelkeys=i),t.initSegment=null}function Ae(t,e,r){t.levelkeys=e;var i=r.encryptedFragments;i.length&&i[i.length-1].levelkeys===e||!Object.keys(e).some((function(t){return e[t].isCommonEncryption}))||i.push(t)}var Re="manifest",ke="level",be="audioTrack",De="subtitleTrack",Ie="main",we="audio",Ce="subtitle";function _e(t){switch(t.type){case be:return we;case De:return Ce;default:return Ie}}function xe(t,e){var r=t.url;return void 0!==r&&0!==r.indexOf("data:")||(r=e.url),r}var Pe=function(){function t(t){this.hls=void 0,this.loaders=Object.create(null),this.variableList=null,this.hls=t,this.registerListeners()}var e=t.prototype;return e.startLoad=function(t){},e.stopLoad=function(){this.destroyInternalLoaders()},e.registerListeners=function(){var t=this.hls;t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.LEVEL_LOADING,this.onLevelLoading,this),t.on(S.AUDIO_TRACK_LOADING,this.onAudioTrackLoading,this),t.on(S.SUBTITLE_TRACK_LOADING,this.onSubtitleTrackLoading,this)},e.unregisterListeners=function(){var t=this.hls;t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.LEVEL_LOADING,this.onLevelLoading,this),t.off(S.AUDIO_TRACK_LOADING,this.onAudioTrackLoading,this),t.off(S.SUBTITLE_TRACK_LOADING,this.onSubtitleTrackLoading,this)},e.createInternalLoader=function(t){var e=this.hls.config,r=e.pLoader,i=e.loader,n=new(r||i)(e);return this.loaders[t.type]=n,n},e.getInternalLoader=function(t){return this.loaders[t.type]},e.resetInternalLoader=function(t){this.loaders[t]&&delete this.loaders[t]},e.destroyInternalLoaders=function(){for(var t in this.loaders){var e=this.loaders[t];e&&e.destroy(),this.resetInternalLoader(t)}},e.destroy=function(){this.variableList=null,this.unregisterListeners(),this.destroyInternalLoaders()},e.onManifestLoading=function(t,e){var r=e.url;this.variableList=null,this.load({id:null,level:0,responseType:"text",type:Re,url:r,deliveryDirectives:null})},e.onLevelLoading=function(t,e){var r=e.id,i=e.level,n=e.pathwayId,a=e.url,s=e.deliveryDirectives;this.load({id:r,level:i,pathwayId:n,responseType:"text",type:ke,url:a,deliveryDirectives:s})},e.onAudioTrackLoading=function(t,e){var r=e.id,i=e.groupId,n=e.url,a=e.deliveryDirectives;this.load({id:r,groupId:i,level:null,responseType:"text",type:be,url:n,deliveryDirectives:a})},e.onSubtitleTrackLoading=function(t,e){var r=e.id,i=e.groupId,n=e.url,a=e.deliveryDirectives;this.load({id:r,groupId:i,level:null,responseType:"text",type:De,url:n,deliveryDirectives:a})},e.load=function(t){var e,r,i,n=this,a=this.hls.config,s=this.getInternalLoader(t);if(s){var l=s.context;if(l&&l.url===t.url&&l.level===t.level)return void w.trace("[playlist-loader]: playlist request ongoing");w.log("[playlist-loader]: aborting previous loader for type: "+t.type),s.abort()}if(r=t.type===Re?a.manifestLoadPolicy.default:o({},a.playlistLoadPolicy.default,{timeoutRetry:null,errorRetry:null}),s=this.createInternalLoader(t),y(null==(e=t.deliveryDirectives)?void 0:e.part)&&(t.type===ke&&null!==t.level?i=this.hls.levels[t.level].details:t.type===be&&null!==t.id?i=this.hls.audioTracks[t.id].details:t.type===De&&null!==t.id&&(i=this.hls.subtitleTracks[t.id].details),i)){var u=i.partTarget,h=i.targetduration;if(u&&h){var d=1e3*Math.max(3*u,.8*h);r=o({},r,{maxTimeToFirstByteMs:Math.min(d,r.maxTimeToFirstByteMs),maxLoadTimeMs:Math.min(d,r.maxTimeToFirstByteMs)})}}var c=r.errorRetry||r.timeoutRetry||{},f={loadPolicy:r,timeout:r.maxLoadTimeMs,maxRetry:c.maxNumRetry||0,retryDelay:c.retryDelayMs||0,maxRetryDelay:c.maxRetryDelayMs||0},g={onSuccess:function(t,e,r,i){var a=n.getInternalLoader(r);n.resetInternalLoader(r.type);var s=t.data;0===s.indexOf("#EXTM3U")?(e.parsing.start=performance.now(),me.isMediaPlaylist(s)?n.handleTrackOrLevelPlaylist(t,e,r,i||null,a):n.handleMasterPlaylist(t,e,r,i)):n.handleManifestParsingError(t,r,new Error("no EXTM3U delimiter"),i||null,e)},onError:function(t,e,r,i){n.handleNetworkError(e,r,!1,t,i)},onTimeout:function(t,e,r){n.handleNetworkError(e,r,!0,void 0,t)}};s.load(t,f,g)},e.handleMasterPlaylist=function(t,e,r,i){var n=this.hls,a=t.data,s=xe(t,r),o=me.parseMasterPlaylist(a,s);if(o.playlistParsingError)this.handleManifestParsingError(t,r,o.playlistParsingError,i,e);else{var l=o.contentSteering,u=o.levels,h=o.sessionData,d=o.sessionKeys,c=o.startTimeOffset,f=o.variableList;this.variableList=f;var g=me.parseMasterPlaylistMedia(a,s,o),v=g.AUDIO,m=void 0===v?[]:v,p=g.SUBTITLES,y=g["CLOSED-CAPTIONS"];m.length&&(m.some((function(t){return!t.url}))||!u[0].audioCodec||u[0].attrs.AUDIO||(w.log("[playlist-loader]: audio codec signaled in quality level, but no embedded audio track signaled, create one"),m.unshift({type:"main",name:"main",groupId:"main",default:!1,autoselect:!1,forced:!1,id:-1,attrs:new x({}),bitrate:0,url:""}))),n.trigger(S.MANIFEST_LOADED,{levels:u,audioTracks:m,subtitles:p,captions:y,contentSteering:l,url:s,stats:e,networkDetails:i,sessionData:h,sessionKeys:d,startTimeOffset:c,variableList:f})}},e.handleTrackOrLevelPlaylist=function(t,e,r,i,n){var a=this.hls,s=r.id,o=r.level,l=r.type,u=xe(t,r),h=y(o)?o:y(s)?s:0,d=_e(r),c=me.parseLevelPlaylist(t.data,u,h,d,0,this.variableList);if(l===Re){var f={attrs:new x({}),bitrate:0,details:c,name:"",url:u};a.trigger(S.MANIFEST_LOADED,{levels:[f],audioTracks:[],url:u,stats:e,networkDetails:i,sessionData:null,sessionKeys:null,contentSteering:null,startTimeOffset:null,variableList:null})}e.parsing.end=performance.now(),r.levelDetails=c,this.handlePlaylistLoaded(c,t,e,r,i,n)},e.handleManifestParsingError=function(t,e,r,i,n){this.hls.trigger(S.ERROR,{type:L.NETWORK_ERROR,details:A.MANIFEST_PARSING_ERROR,fatal:e.type===Re,url:t.url,err:r,error:r,reason:r.message,response:t,context:e,networkDetails:i,stats:n})},e.handleNetworkError=function(t,e,r,n,a){void 0===r&&(r=!1);var s="A network "+(r?"timeout":"error"+(n?" (status "+n.code+")":""))+" occurred while loading "+t.type;t.type===ke?s+=": "+t.level+" id: "+t.id:t.type!==be&&t.type!==De||(s+=" id: "+t.id+' group-id: "'+t.groupId+'"');var o=new Error(s);w.warn("[playlist-loader]: "+s);var l=A.UNKNOWN,u=!1,h=this.getInternalLoader(t);switch(t.type){case Re:l=r?A.MANIFEST_LOAD_TIMEOUT:A.MANIFEST_LOAD_ERROR,u=!0;break;case ke:l=r?A.LEVEL_LOAD_TIMEOUT:A.LEVEL_LOAD_ERROR,u=!1;break;case be:l=r?A.AUDIO_TRACK_LOAD_TIMEOUT:A.AUDIO_TRACK_LOAD_ERROR,u=!1;break;case De:l=r?A.SUBTITLE_TRACK_LOAD_TIMEOUT:A.SUBTITLE_LOAD_ERROR,u=!1}h&&this.resetInternalLoader(t.type);var d={type:L.NETWORK_ERROR,details:l,fatal:u,url:t.url,loader:h,context:t,error:o,networkDetails:e,stats:a};if(n){var c=(null==e?void 0:e.url)||t.url;d.response=i({url:c,data:void 0},n)}this.hls.trigger(S.ERROR,d)},e.handlePlaylistLoaded=function(t,e,r,i,n,a){var s=this.hls,o=i.type,l=i.level,u=i.id,h=i.groupId,d=i.deliveryDirectives,c=xe(e,i),f=_e(i),g="number"==typeof i.level&&f===Ie?l:void 0;if(t.fragments.length){t.targetduration||(t.playlistParsingError=new Error("Missing Target Duration"));var v=t.playlistParsingError;if(v)s.trigger(S.ERROR,{type:L.NETWORK_ERROR,details:A.LEVEL_PARSING_ERROR,fatal:!1,url:c,error:v,reason:v.message,response:e,context:i,level:g,parent:f,networkDetails:n,stats:r});else switch(t.live&&a&&(a.getCacheAge&&(t.ageHeader=a.getCacheAge()||0),a.getCacheAge&&!isNaN(t.ageHeader)||(t.ageHeader=0)),o){case Re:case ke:s.trigger(S.LEVEL_LOADED,{details:t,level:g||0,id:u||0,stats:r,networkDetails:n,deliveryDirectives:d});break;case be:s.trigger(S.AUDIO_TRACK_LOADED,{details:t,id:u||0,groupId:h||"",stats:r,networkDetails:n,deliveryDirectives:d});break;case De:s.trigger(S.SUBTITLE_TRACK_LOADED,{details:t,id:u||0,groupId:h||"",stats:r,networkDetails:n,deliveryDirectives:d})}}else{var m=new Error("No Segments found in Playlist");s.trigger(S.ERROR,{type:L.NETWORK_ERROR,details:A.LEVEL_EMPTY_ERROR,fatal:!1,url:c,error:m,reason:m.message,response:e,context:i,level:g,parent:f,networkDetails:n,stats:r})}},t}();function Fe(t,e){var r;try{r=new Event("addtrack")}catch(t){(r=document.createEvent("Event")).initEvent("addtrack",!1,!1)}r.track=t,e.dispatchEvent(r)}function Me(t,e){var r=t.mode;if("disabled"===r&&(t.mode="hidden"),t.cues&&!t.cues.getCueById(e.id))try{if(t.addCue(e),!t.cues.getCueById(e.id))throw new Error("addCue is failed for: "+e)}catch(r){w.debug("[texttrack-utils]: "+r);try{var i=new self.TextTrackCue(e.startTime,e.endTime,e.text);i.id=e.id,t.addCue(i)}catch(t){w.debug("[texttrack-utils]: Legacy TextTrackCue fallback failed: "+t)}}"disabled"===r&&(t.mode=r)}function Oe(t){var e=t.mode;if("disabled"===e&&(t.mode="hidden"),t.cues)for(var r=t.cues.length;r--;)t.removeCue(t.cues[r]);"disabled"===e&&(t.mode=e)}function Ne(t,e,r,i){var n=t.mode;if("disabled"===n&&(t.mode="hidden"),t.cues&&t.cues.length>0)for(var a=function(t,e,r){var i=[],n=function(t,e){if(e<t[0].startTime)return 0;var r=t.length-1;if(e>t[r].endTime)return-1;for(var i=0,n=r;i<=n;){var a=Math.floor((n+i)/2);if(e<t[a].startTime)n=a-1;else{if(!(e>t[a].startTime&&i<r))return a;i=a+1}}return t[i].startTime-e<e-t[n].startTime?i:n}(t,e);if(n>-1)for(var a=n,s=t.length;a<s;a++){var o=t[a];if(o.startTime>=e&&o.endTime<=r)i.push(o);else if(o.startTime>r)return i}return i}(t.cues,e,r),s=0;s<a.length;s++)i&&!i(a[s])||t.removeCue(a[s]);"disabled"===n&&(t.mode=n)}function Ue(t){for(var e=[],r=0;r<t.length;r++){var i=t[r];"subtitles"!==i.kind&&"captions"!==i.kind||!i.label||e.push(t[r])}return e}var Be="org.id3",Ge="com.apple.quicktime.HLS",Ke="https://aomedia.org/emsg/ID3";function He(){if("undefined"!=typeof self)return self.VTTCue||self.TextTrackCue}function Ve(t,e,r,n,a){var s=new t(e,r,"");try{s.value=n,a&&(s.type=a)}catch(o){s=new t(e,r,JSON.stringify(a?i({type:a},n):n))}return s}var Ye=function(){var t=He();try{t&&new t(0,Number.POSITIVE_INFINITY,"")}catch(t){return Number.MAX_VALUE}return Number.POSITIVE_INFINITY}();function We(t,e){return t.getTime()/1e3-e}var je=function(){function t(t){this.hls=void 0,this.id3Track=null,this.media=null,this.dateRangeCuesAppended={},this.hls=t,this._registerListeners()}var e=t.prototype;return e.destroy=function(){this._unregisterListeners(),this.id3Track=null,this.media=null,this.dateRangeCuesAppended={},this.hls=null},e._registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.FRAG_PARSING_METADATA,this.onFragParsingMetadata,this),t.on(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.on(S.LEVEL_UPDATED,this.onLevelUpdated,this)},e._unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.FRAG_PARSING_METADATA,this.onFragParsingMetadata,this),t.off(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.off(S.LEVEL_UPDATED,this.onLevelUpdated,this)},e.onMediaAttached=function(t,e){this.media=e.media},e.onMediaDetaching=function(){this.id3Track&&(Oe(this.id3Track),this.id3Track=null,this.media=null,this.dateRangeCuesAppended={})},e.onManifestLoading=function(){this.dateRangeCuesAppended={}},e.createTrack=function(t){var e=this.getID3Track(t.textTracks);return e.mode="hidden",e},e.getID3Track=function(t){if(this.media){for(var e=0;e<t.length;e++){var r=t[e];if("metadata"===r.kind&&"id3"===r.label)return Fe(r,this.media),r}return this.media.addTextTrack("metadata","id3")}},e.onFragParsingMetadata=function(t,e){if(this.media){var r=this.hls.config,i=r.enableEmsgMetadataCues,n=r.enableID3MetadataCues;if(i||n){var a=e.samples;this.id3Track||(this.id3Track=this.createTrack(this.media));var s=He();if(s)for(var o=0;o<a.length;o++){var l=a[o].type;if((l!==Ke||i)&&n){var u=gt(a[o].data);if(u){var h=a[o].pts,d=h+a[o].duration;d>Ye&&(d=Ye),d-h<=0&&(d=h+.25);for(var c=0;c<u.length;c++){var f=u[c];if(!ct(f)){this.updateId3CueEnds(h,l);var g=Ve(s,h,d,f,l);g&&this.id3Track.addCue(g)}}}}}}}},e.updateId3CueEnds=function(t,e){var r,i=null==(r=this.id3Track)?void 0:r.cues;if(i)for(var n=i.length;n--;){var a=i[n];a.type===e&&a.startTime<t&&a.endTime===Ye&&(a.endTime=t)}},e.onBufferFlushing=function(t,e){var r=e.startOffset,i=e.endOffset,n=e.type,a=this.id3Track,s=this.hls;if(s){var o=s.config,l=o.enableEmsgMetadataCues,u=o.enableID3MetadataCues;a&&(l||u)&&Ne(a,r,i,"audio"===n?function(t){return t.type===Be&&u}:"video"===n?function(t){return t.type===Ke&&l}:function(t){return t.type===Be&&u||t.type===Ke&&l})}},e.onLevelUpdated=function(t,e){var r=this,i=e.details;if(this.media&&i.hasProgramDateTime&&this.hls.config.enableDateRangeMetadataCues){var n=this.dateRangeCuesAppended,a=this.id3Track,s=i.dateRanges,o=Object.keys(s);if(a)for(var l=Object.keys(n).filter((function(t){return!o.includes(t)})),u=function(){var t=l[h];Object.keys(n[t].cues).forEach((function(e){a.removeCue(n[t].cues[e])})),delete n[t]},h=l.length;h--;)u();var d=i.fragments[i.fragments.length-1];if(0!==o.length&&y(null==d?void 0:d.programDateTime)){this.id3Track||(this.id3Track=this.createTrack(this.media));for(var c=d.programDateTime/1e3-d.start,f=He(),g=function(){var t=o[v],e=s[t],i=We(e.startDate,c),a=n[t],l=(null==a?void 0:a.cues)||{},u=(null==a?void 0:a.durationKnown)||!1,h=Ye,d=e.endDate;if(d)h=We(d,c),u=!0;else if(e.endOnNext&&!u){var g=o.reduce((function(t,r){if(r!==e.id){var i=s[r];if(i.class===e.class&&i.startDate>e.startDate&&(!t||e.startDate<t.startDate))return i}return t}),null);g&&(h=We(g.startDate,c),u=!0)}for(var m,p,y=Object.keys(e.attr),E=0;E<y.length;E++){var T=y[E];if("ID"!==(p=T)&&"CLASS"!==p&&"START-DATE"!==p&&"DURATION"!==p&&"END-DATE"!==p&&"END-ON-NEXT"!==p){var S=l[T];if(S)u&&!a.durationKnown&&(S.endTime=h);else if(f){var L=e.attr[T];P(T)&&(m=L,L=Uint8Array.from(m.replace(/^0x/,"").replace(/([\da-fA-F]{2}) ?/g,"0x$1 ").replace(/ +$/,"").split(" ")).buffer);var A=Ve(f,i,h,{key:T,data:L},Ge);A&&(A.id=t,r.id3Track.addCue(A),l[T]=A)}}}n[t]={cues:l,dateRange:e,durationKnown:u}},v=0;v<o.length;v++)g()}}},t}(),qe=function(){function t(t){var e=this;this.hls=void 0,this.config=void 0,this.media=null,this.levelDetails=null,this.currentTime=0,this.stallCount=0,this._latency=null,this.timeupdateHandler=function(){return e.timeupdate()},this.hls=t,this.config=t.config,this.registerListeners()}var e=t.prototype;return e.destroy=function(){this.unregisterListeners(),this.onMediaDetaching(),this.levelDetails=null,this.hls=this.timeupdateHandler=null},e.registerListeners=function(){this.hls.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),this.hls.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),this.hls.on(S.MANIFEST_LOADING,this.onManifestLoading,this),this.hls.on(S.LEVEL_UPDATED,this.onLevelUpdated,this),this.hls.on(S.ERROR,this.onError,this)},e.unregisterListeners=function(){this.hls.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),this.hls.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),this.hls.off(S.MANIFEST_LOADING,this.onManifestLoading,this),this.hls.off(S.LEVEL_UPDATED,this.onLevelUpdated,this),this.hls.off(S.ERROR,this.onError,this)},e.onMediaAttached=function(t,e){this.media=e.media,this.media.addEventListener("timeupdate",this.timeupdateHandler)},e.onMediaDetaching=function(){this.media&&(this.media.removeEventListener("timeupdate",this.timeupdateHandler),this.media=null)},e.onManifestLoading=function(){this.levelDetails=null,this._latency=null,this.stallCount=0},e.onLevelUpdated=function(t,e){var r=e.details;this.levelDetails=r,r.advanced&&this.timeupdate(),!r.live&&this.media&&this.media.removeEventListener("timeupdate",this.timeupdateHandler)},e.onError=function(t,e){var r;e.details===A.BUFFER_STALLED_ERROR&&(this.stallCount++,null!=(r=this.levelDetails)&&r.live&&w.warn("[playback-rate-controller]: Stall detected, adjusting target latency"))},e.timeupdate=function(){var t=this.media,e=this.levelDetails;if(t&&e){this.currentTime=t.currentTime;var r=this.computeLatency();if(null!==r){this._latency=r;var i=this.config,n=i.lowLatencyMode,a=i.maxLiveSyncPlaybackRate;if(n&&1!==a&&e.live){var s=this.targetLatency;if(null!==s){var o=r-s;if(o<Math.min(this.maxLatency,s+e.targetduration)&&o>.05&&this.forwardBufferLength>1){var l=Math.min(2,Math.max(1,a)),u=Math.round(2/(1+Math.exp(-.75*o-this.edgeStalled))*20)/20;t.playbackRate=Math.min(l,Math.max(1,u))}else 1!==t.playbackRate&&0!==t.playbackRate&&(t.playbackRate=1)}}}}},e.estimateLiveEdge=function(){var t=this.levelDetails;return null===t?null:t.edge+t.age},e.computeLatency=function(){var t=this.estimateLiveEdge();return null===t?null:t-this.currentTime},s(t,[{key:"latency",get:function(){return this._latency||0}},{key:"maxLatency",get:function(){var t=this.config,e=this.levelDetails;return void 0!==t.liveMaxLatencyDuration?t.liveMaxLatencyDuration:e?t.liveMaxLatencyDurationCount*e.targetduration:0}},{key:"targetLatency",get:function(){var t=this.levelDetails;if(null===t)return null;var e=t.holdBack,r=t.partHoldBack,i=t.targetduration,n=this.config,a=n.liveSyncDuration,s=n.liveSyncDurationCount,o=n.lowLatencyMode,l=this.hls.userConfig,u=o&&r||e;(l.liveSyncDuration||l.liveSyncDurationCount||0===u)&&(u=void 0!==a?a:s*i);var h=i;return u+Math.min(1*this.stallCount,h)}},{key:"liveSyncPosition",get:function(){var t=this.estimateLiveEdge(),e=this.targetLatency,r=this.levelDetails;if(null===t||null===e||null===r)return null;var i=r.edge,n=t-e-this.edgeStalled,a=i-r.totalduration,s=i-(this.config.lowLatencyMode&&r.partTarget||r.targetduration);return Math.min(Math.max(a,n),s)}},{key:"drift",get:function(){var t=this.levelDetails;return null===t?1:t.drift}},{key:"edgeStalled",get:function(){var t=this.levelDetails;if(null===t)return 0;var e=3*(this.config.lowLatencyMode&&t.partTarget||t.targetduration);return Math.max(t.age-e,0)}},{key:"forwardBufferLength",get:function(){var t=this.media,e=this.levelDetails;if(!t||!e)return 0;var r=t.buffered.length;return(r?t.buffered.end(r-1):e.edge)-this.currentTime}}]),t}(),Xe=["NONE","TYPE-0","TYPE-1",null],ze=["SDR","PQ","HLG"],Qe="",Je="YES",$e="v2",Ze=function(){function t(t,e,r){this.msn=void 0,this.part=void 0,this.skip=void 0,this.msn=t,this.part=e,this.skip=r}return t.prototype.addDirectives=function(t){var e=new self.URL(t);return void 0!==this.msn&&e.searchParams.set("_HLS_msn",this.msn.toString()),void 0!==this.part&&e.searchParams.set("_HLS_part",this.part.toString()),this.skip&&e.searchParams.set("_HLS_skip",this.skip),e.href},t}(),tr=function(){function t(t){this._attrs=void 0,this.audioCodec=void 0,this.bitrate=void 0,this.codecSet=void 0,this.url=void 0,this.frameRate=void 0,this.height=void 0,this.id=void 0,this.name=void 0,this.videoCodec=void 0,this.width=void 0,this.details=void 0,this.fragmentError=0,this.loadError=0,this.loaded=void 0,this.realBitrate=0,this.supportedPromise=void 0,this.supportedResult=void 0,this._avgBitrate=0,this._audioGroups=void 0,this._subtitleGroups=void 0,this._urlId=0,this.url=[t.url],this._attrs=[t.attrs],this.bitrate=t.bitrate,t.details&&(this.details=t.details),this.id=t.id||0,this.name=t.name,this.width=t.width||0,this.height=t.height||0,this.frameRate=t.attrs.optionalFloat("FRAME-RATE",0),this._avgBitrate=t.attrs.decimalInteger("AVERAGE-BANDWIDTH"),this.audioCodec=t.audioCodec,this.videoCodec=t.videoCodec,this.codecSet=[t.videoCodec,t.audioCodec].filter((function(t){return!!t})).map((function(t){return t.substring(0,4)})).join(","),this.addGroupId("audio",t.attrs.AUDIO),this.addGroupId("text",t.attrs.SUBTITLES)}var e=t.prototype;return e.hasAudioGroup=function(t){return er(this._audioGroups,t)},e.hasSubtitleGroup=function(t){return er(this._subtitleGroups,t)},e.addGroupId=function(t,e){if(e)if("audio"===t){var r=this._audioGroups;r||(r=this._audioGroups=[]),-1===r.indexOf(e)&&r.push(e)}else if("text"===t){var i=this._subtitleGroups;i||(i=this._subtitleGroups=[]),-1===i.indexOf(e)&&i.push(e)}},e.addFallback=function(){},s(t,[{key:"maxBitrate",get:function(){return Math.max(this.realBitrate,this.bitrate)}},{key:"averageBitrate",get:function(){return this._avgBitrate||this.realBitrate||this.bitrate}},{key:"attrs",get:function(){return this._attrs[0]}},{key:"codecs",get:function(){return this.attrs.CODECS||""}},{key:"pathwayId",get:function(){return this.attrs["PATHWAY-ID"]||"."}},{key:"videoRange",get:function(){return this.attrs["VIDEO-RANGE"]||"SDR"}},{key:"score",get:function(){return this.attrs.optionalFloat("SCORE",0)}},{key:"uri",get:function(){return this.url[0]||""}},{key:"audioGroups",get:function(){return this._audioGroups}},{key:"subtitleGroups",get:function(){return this._subtitleGroups}},{key:"urlId",get:function(){return 0},set:function(t){}},{key:"audioGroupIds",get:function(){return this.audioGroups?[this.audioGroupId]:void 0}},{key:"textGroupIds",get:function(){return this.subtitleGroups?[this.textGroupId]:void 0}},{key:"audioGroupId",get:function(){var t;return null==(t=this.audioGroups)?void 0:t[0]}},{key:"textGroupId",get:function(){var t;return null==(t=this.subtitleGroups)?void 0:t[0]}}]),t}();function er(t,e){return!(!e||!t)&&-1!==t.indexOf(e)}function rr(t,e){var r=e.startPTS;if(y(r)){var i,n=0;e.sn>t.sn?(n=r-t.start,i=t):(n=t.start-r,i=e),i.duration!==n&&(i.duration=n)}else e.sn>t.sn?t.cc===e.cc&&t.minEndPTS?e.start=t.start+(t.minEndPTS-t.start):e.start=t.start+t.duration:e.start=Math.max(t.start-e.duration,0)}function ir(t,e,r,i,n,a){i-r<=0&&(w.warn("Fragment should have a positive duration",e),i=r+e.duration,a=n+e.duration);var s=r,o=i,l=e.startPTS,u=e.endPTS;if(y(l)){var h=Math.abs(l-r);y(e.deltaPTS)?e.deltaPTS=Math.max(h,e.deltaPTS):e.deltaPTS=h,s=Math.max(r,l),r=Math.min(r,l),n=Math.min(n,e.startDTS),o=Math.min(i,u),i=Math.max(i,u),a=Math.max(a,e.endDTS)}var d=r-e.start;0!==e.start&&(e.start=r),e.duration=i-e.start,e.startPTS=r,e.maxStartPTS=s,e.startDTS=n,e.endPTS=i,e.minEndPTS=o,e.endDTS=a;var c,f=e.sn;if(!t||f<t.startSN||f>t.endSN)return 0;var g=f-t.startSN,v=t.fragments;for(v[g]=e,c=g;c>0;c--)rr(v[c],v[c-1]);for(c=g;c<v.length-1;c++)rr(v[c],v[c+1]);return t.fragmentHint&&rr(v[v.length-1],t.fragmentHint),t.PTSKnown=t.alignedSliding=!0,d}function nr(t,e){for(var r=null,i=t.fragments,n=i.length-1;n>=0;n--){var a=i[n].initSegment;if(a){r=a;break}}t.fragmentHint&&delete t.fragmentHint.endPTS;var s,l,u,h,d,c=0;if(function(t,e,r){for(var i=e.skippedSegments,n=Math.max(t.startSN,e.startSN)-e.startSN,a=(t.fragmentHint?1:0)+(i?e.endSN:Math.min(t.endSN,e.endSN))-e.startSN,s=e.startSN-t.startSN,o=e.fragmentHint?e.fragments.concat(e.fragmentHint):e.fragments,l=t.fragmentHint?t.fragments.concat(t.fragmentHint):t.fragments,u=n;u<=a;u++){var h=l[s+u],d=o[u];i&&!d&&u<i&&(d=e.fragments[u]=h),h&&d&&r(h,d)}}(t,e,(function(t,i){t.relurl&&(c=t.cc-i.cc),y(t.startPTS)&&y(t.endPTS)&&(i.start=i.startPTS=t.startPTS,i.startDTS=t.startDTS,i.maxStartPTS=t.maxStartPTS,i.endPTS=t.endPTS,i.endDTS=t.endDTS,i.minEndPTS=t.minEndPTS,i.duration=t.endPTS-t.startPTS,i.duration&&(s=i),e.PTSKnown=e.alignedSliding=!0),i.elementaryStreams=t.elementaryStreams,i.loader=t.loader,i.stats=t.stats,t.initSegment&&(i.initSegment=t.initSegment,r=t.initSegment)})),r&&(e.fragmentHint?e.fragments.concat(e.fragmentHint):e.fragments).forEach((function(t){var e;!t||t.initSegment&&t.initSegment.relurl!==(null==(e=r)?void 0:e.relurl)||(t.initSegment=r)})),e.skippedSegments)if(e.deltaUpdateFailed=e.fragments.some((function(t){return!t})),e.deltaUpdateFailed){w.warn("[level-helper] Previous playlist missing segments skipped in delta playlist");for(var f=e.skippedSegments;f--;)e.fragments.shift();e.startSN=e.fragments[0].sn,e.startCC=e.fragments[0].cc}else e.canSkipDateRanges&&(e.dateRanges=(l=t.dateRanges,u=e.dateRanges,h=e.recentlyRemovedDateranges,d=o({},l),h&&h.forEach((function(t){delete d[t]})),Object.keys(u).forEach((function(t){var e=new F(u[t].attr,d[t]);e.isValid?d[t]=e:w.warn('Ignoring invalid Playlist Delta Update DATERANGE tag: "'+JSON.stringify(u[t].attr)+'"')})),d));var g=e.fragments;if(c){w.warn("discontinuity sliding from playlist, take drift into account");for(var v=0;v<g.length;v++)g[v].cc+=c}e.skippedSegments&&(e.startCC=e.fragments[0].cc),function(t,e,r){if(t&&e)for(var i=0,n=0,a=t.length;n<=a;n++){var s=t[n],o=e[n+i];s&&o&&s.index===o.index&&s.fragment.sn===o.fragment.sn?r(s,o):i--}}(t.partList,e.partList,(function(t,e){e.elementaryStreams=t.elementaryStreams,e.stats=t.stats})),s?ir(e,s,s.startPTS,s.endPTS,s.startDTS,s.endDTS):ar(t,e),g.length&&(e.totalduration=e.edge-g[0].start),e.driftStartTime=t.driftStartTime,e.driftStart=t.driftStart;var m=e.advancedDateTime;if(e.advanced&&m){var p=e.edge;e.driftStart||(e.driftStartTime=m,e.driftStart=p),e.driftEndTime=m,e.driftEnd=p}else e.driftEndTime=t.driftEndTime,e.driftEnd=t.driftEnd,e.advancedDateTime=t.advancedDateTime}function ar(t,e){var r=e.startSN+e.skippedSegments-t.startSN,i=t.fragments;r<0||r>=i.length||sr(e,i[r].start)}function sr(t,e){if(e){for(var r=t.fragments,i=t.skippedSegments;i<r.length;i++)r[i].start+=e;t.fragmentHint&&(t.fragmentHint.start+=e)}}function or(t,e,r){var i;return null!=t&&t.details?lr(null==(i=t.details)?void 0:i.partList,e,r):null}function lr(t,e,r){if(t)for(var i=t.length;i--;){var n=t[i];if(n.index===r&&n.fragment.sn===e)return n}return null}function ur(t){t.forEach((function(t,e){var r=t.details;null!=r&&r.fragments&&r.fragments.forEach((function(t){t.level=e}))}))}function hr(t){switch(t.details){case A.FRAG_LOAD_TIMEOUT:case A.KEY_LOAD_TIMEOUT:case A.LEVEL_LOAD_TIMEOUT:case A.MANIFEST_LOAD_TIMEOUT:return!0}return!1}function dr(t,e){var r=hr(e);return t.default[(r?"timeout":"error")+"Retry"]}function cr(t,e){var r="linear"===t.backoff?1:Math.pow(2,e);return Math.min(r*t.retryDelayMs,t.maxRetryDelayMs)}function fr(t){return i(i({},t),{errorRetry:null,timeoutRetry:null})}function gr(t,e,r,i){if(!t)return!1;var n=null==i?void 0:i.code,a=e<t.maxNumRetry&&(function(t){return 0===t&&!1===navigator.onLine||!!t&&(t<400||t>499)}(n)||!!r);return t.shouldRetry?t.shouldRetry(t,e,r,i,a):a}var vr=function(t,e){for(var r=0,i=t.length-1,n=null,a=null;r<=i;){var s=e(a=t[n=(r+i)/2|0]);if(s>0)r=n+1;else{if(!(s<0))return a;i=n-1}}return null};function mr(t,e,r,i){void 0===r&&(r=0),void 0===i&&(i=0);var n=null;if(t){n=e[t.sn-e[0].sn+1]||null;var a=t.endDTS-r;a>0&&a<15e-7&&(r+=15e-7)}else 0===r&&0===e[0].start&&(n=e[0]);if(n&&(!t||t.level===n.level)&&0===pr(r,i,n))return n;var s=vr(e,pr.bind(null,r,i));return!s||s===t&&n?n:s}function pr(t,e,r){if(void 0===t&&(t=0),void 0===e&&(e=0),r.start<=t&&r.start+r.duration>t)return 0;var i=Math.min(e,r.duration+(r.deltaPTS?r.deltaPTS:0));return r.start+r.duration-i<=t?1:r.start-i>t&&r.start?-1:0}function yr(t,e,r){var i=1e3*Math.min(e,r.duration+(r.deltaPTS?r.deltaPTS:0));return(r.endProgramDateTime||0)-i>t}var Er=0,Tr=2,Sr=3,Lr=5,Ar=0,Rr=1,kr=2,br=function(){function t(t){this.hls=void 0,this.playlistError=0,this.penalizedRenditions={},this.log=void 0,this.warn=void 0,this.error=void 0,this.hls=t,this.log=w.log.bind(w,"[info]:"),this.warn=w.warn.bind(w,"[warning]:"),this.error=w.error.bind(w,"[error]:"),this.registerListeners()}var e=t.prototype;return e.registerListeners=function(){var t=this.hls;t.on(S.ERROR,this.onError,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.LEVEL_UPDATED,this.onLevelUpdated,this)},e.unregisterListeners=function(){var t=this.hls;t&&(t.off(S.ERROR,this.onError,this),t.off(S.ERROR,this.onErrorOut,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.LEVEL_UPDATED,this.onLevelUpdated,this))},e.destroy=function(){this.unregisterListeners(),this.hls=null,this.penalizedRenditions={}},e.startLoad=function(t){},e.stopLoad=function(){this.playlistError=0},e.getVariantLevelIndex=function(t){return(null==t?void 0:t.type)===Ie?t.level:this.hls.loadLevel},e.onManifestLoading=function(){this.playlistError=0,this.penalizedRenditions={}},e.onLevelUpdated=function(){this.playlistError=0},e.onError=function(t,e){var r,i;if(!e.fatal){var n=this.hls,a=e.context;switch(e.details){case A.FRAG_LOAD_ERROR:case A.FRAG_LOAD_TIMEOUT:case A.KEY_LOAD_ERROR:case A.KEY_LOAD_TIMEOUT:return void(e.errorAction=this.getFragRetryOrSwitchAction(e));case A.FRAG_PARSING_ERROR:if(null!=(r=e.frag)&&r.gap)return void(e.errorAction={action:Er,flags:Ar});case A.FRAG_GAP:case A.FRAG_DECRYPT_ERROR:return e.errorAction=this.getFragRetryOrSwitchAction(e),void(e.errorAction.action=Tr);case A.LEVEL_EMPTY_ERROR:case A.LEVEL_PARSING_ERROR:var s,o,l=e.parent===Ie?e.level:n.loadLevel;return void(e.details===A.LEVEL_EMPTY_ERROR&&null!=(s=e.context)&&null!=(o=s.levelDetails)&&o.live?e.errorAction=this.getPlaylistRetryOrSwitchAction(e,l):(e.levelRetry=!1,e.errorAction=this.getLevelSwitchAction(e,l)));case A.LEVEL_LOAD_ERROR:case A.LEVEL_LOAD_TIMEOUT:return void("number"==typeof(null==a?void 0:a.level)&&(e.errorAction=this.getPlaylistRetryOrSwitchAction(e,a.level)));case A.AUDIO_TRACK_LOAD_ERROR:case A.AUDIO_TRACK_LOAD_TIMEOUT:case A.SUBTITLE_LOAD_ERROR:case A.SUBTITLE_TRACK_LOAD_TIMEOUT:if(a){var u=n.levels[n.loadLevel];if(u&&(a.type===be&&u.hasAudioGroup(a.groupId)||a.type===De&&u.hasSubtitleGroup(a.groupId)))return e.errorAction=this.getPlaylistRetryOrSwitchAction(e,n.loadLevel),e.errorAction.action=Tr,void(e.errorAction.flags=Rr)}return;case A.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED:var h=n.levels[n.loadLevel],d=null==h?void 0:h.attrs["HDCP-LEVEL"];return void(d?e.errorAction={action:Tr,flags:kr,hdcpLevel:d}:this.keySystemError(e));case A.BUFFER_ADD_CODEC_ERROR:case A.REMUX_ALLOC_ERROR:case A.BUFFER_APPEND_ERROR:return void(e.errorAction=this.getLevelSwitchAction(e,null!=(i=e.level)?i:n.loadLevel));case A.INTERNAL_EXCEPTION:case A.BUFFER_APPENDING_ERROR:case A.BUFFER_FULL_ERROR:case A.LEVEL_SWITCH_ERROR:case A.BUFFER_STALLED_ERROR:case A.BUFFER_SEEK_OVER_HOLE:case A.BUFFER_NUDGE_ON_STALL:return void(e.errorAction={action:Er,flags:Ar})}e.type===L.KEY_SYSTEM_ERROR&&this.keySystemError(e)}},e.keySystemError=function(t){var e=this.getVariantLevelIndex(t.frag);t.levelRetry=!1,t.errorAction=this.getLevelSwitchAction(t,e)},e.getPlaylistRetryOrSwitchAction=function(t,e){var r=dr(this.hls.config.playlistLoadPolicy,t),i=this.playlistError++;if(gr(r,i,hr(t),t.response))return{action:Lr,flags:Ar,retryConfig:r,retryCount:i};var n=this.getLevelSwitchAction(t,e);return r&&(n.retryConfig=r,n.retryCount=i),n},e.getFragRetryOrSwitchAction=function(t){var e=this.hls,r=this.getVariantLevelIndex(t.frag),i=e.levels[r],n=e.config,a=n.fragLoadPolicy,s=n.keyLoadPolicy,o=dr(t.details.startsWith("key")?s:a,t),l=e.levels.reduce((function(t,e){return t+e.fragmentError}),0);if(i&&(t.details!==A.FRAG_GAP&&i.fragmentError++,gr(o,l,hr(t),t.response)))return{action:Lr,flags:Ar,retryConfig:o,retryCount:l};var u=this.getLevelSwitchAction(t,r);return o&&(u.retryConfig=o,u.retryCount=l),u},e.getLevelSwitchAction=function(t,e){var r=this.hls;null==e&&(e=r.loadLevel);var i=this.hls.levels[e];if(i){var n,a,s=t.details;i.loadError++,s===A.BUFFER_APPEND_ERROR&&i.fragmentError++;var o=-1,l=r.levels,u=r.loadLevel,h=r.minAutoLevel,d=r.maxAutoLevel;r.autoLevelEnabled||(r.loadLevel=-1);for(var c,f=null==(n=t.frag)?void 0:n.type,g=(f===we&&s===A.FRAG_PARSING_ERROR||"audio"===t.sourceBufferName&&(s===A.BUFFER_ADD_CODEC_ERROR||s===A.BUFFER_APPEND_ERROR))&&l.some((function(t){var e=t.audioCodec;return i.audioCodec!==e})),v="video"===t.sourceBufferName&&(s===A.BUFFER_ADD_CODEC_ERROR||s===A.BUFFER_APPEND_ERROR)&&l.some((function(t){var e=t.codecSet,r=t.audioCodec;return i.codecSet!==e&&i.audioCodec===r})),m=null!=(a=t.context)?a:{},p=m.type,y=m.groupId,E=function(){var e=(T+u)%l.length;if(e!==u&&e>=h&&e<=d&&0===l[e].loadError){var r,n,a=l[e];if(s===A.FRAG_GAP&&t.frag){var c=l[e].details;if(c){var m=mr(t.frag,c.fragments,t.frag.start);if(null!=m&&m.gap)return 0}}else{if(p===be&&a.hasAudioGroup(y)||p===De&&a.hasSubtitleGroup(y))return 0;if(f===we&&null!=(r=i.audioGroups)&&r.some((function(t){return a.hasAudioGroup(t)}))||f===Ce&&null!=(n=i.subtitleGroups)&&n.some((function(t){return a.hasSubtitleGroup(t)}))||g&&i.audioCodec===a.audioCodec||!g&&i.audioCodec!==a.audioCodec||v&&i.codecSet===a.codecSet)return 0}return o=e,1}},T=l.length;T--&&(0===(c=E())||1!==c););if(o>-1&&r.loadLevel!==o)return t.levelRetry=!0,this.playlistError=0,{action:Tr,flags:Ar,nextAutoLevel:o}}return{action:Tr,flags:Rr}},e.onErrorOut=function(t,e){var r;switch(null==(r=e.errorAction)?void 0:r.action){case Er:break;case Tr:this.sendAlternateToPenaltyBox(e),e.errorAction.resolved||e.details===A.FRAG_GAP?/MediaSource readyState: ended/.test(e.error.message)&&(this.warn('MediaSource ended after "'+e.sourceBufferName+'" sourceBuffer append error. Attempting to recover from media error.'),this.hls.recoverMediaError()):e.fatal=!0}e.fatal&&this.hls.stopLoad()},e.sendAlternateToPenaltyBox=function(t){var e=this.hls,r=t.errorAction;if(r){var i=r.flags,n=r.hdcpLevel,a=r.nextAutoLevel;switch(i){case Ar:this.switchLevel(t,a);break;case kr:n&&(e.maxHdcpLevel=Xe[Xe.indexOf(n)-1],r.resolved=!0),this.warn('Restricting playback to HDCP-LEVEL of "'+e.maxHdcpLevel+'" or lower')}r.resolved||this.switchLevel(t,a)}},e.switchLevel=function(t,e){void 0!==e&&t.errorAction&&(this.warn("switching to level "+e+" after "+t.details),this.hls.nextAutoLevel=e,t.errorAction.resolved=!0,this.hls.nextLoadLevel=this.hls.nextAutoLevel)},t}(),Dr=function(){function t(t,e){this.hls=void 0,this.timer=-1,this.requestScheduled=-1,this.canLoad=!1,this.log=void 0,this.warn=void 0,this.log=w.log.bind(w,e+":"),this.warn=w.warn.bind(w,e+":"),this.hls=t}var e=t.prototype;return e.destroy=function(){this.clearTimer(),this.hls=this.log=this.warn=null},e.clearTimer=function(){-1!==this.timer&&(self.clearTimeout(this.timer),this.timer=-1)},e.startLoad=function(){this.canLoad=!0,this.requestScheduled=-1,this.loadPlaylist()},e.stopLoad=function(){this.canLoad=!1,this.clearTimer()},e.switchParams=function(t,e){var r=null==e?void 0:e.renditionReports;if(r){for(var i=-1,n=0;n<r.length;n++){var a=r[n],s=void 0;try{s=new self.URL(a.URI,e.url).href}catch(t){w.warn("Could not construct new URL for Rendition Report: "+t),s=a.URI||""}if(s===t){i=n;break}s===t.substring(0,s.length)&&(i=n)}if(-1!==i){var o=r[i],l=parseInt(o["LAST-MSN"])||(null==e?void 0:e.lastPartSn),u=parseInt(o["LAST-PART"])||(null==e?void 0:e.lastPartIndex);if(this.hls.config.lowLatencyMode){var h=Math.min(e.age-e.partTarget,e.targetduration);u>=0&&h>e.partTarget&&(u+=1)}return new Ze(l,u>=0?u:void 0,Qe)}}},e.loadPlaylist=function(t){-1===this.requestScheduled&&(this.requestScheduled=self.performance.now())},e.shouldLoadPlaylist=function(t){return this.canLoad&&!!t&&!!t.url&&(!t.details||t.details.live)},e.shouldReloadPlaylist=function(t){return-1===this.timer&&-1===this.requestScheduled&&this.shouldLoadPlaylist(t)},e.playlistLoaded=function(t,e,r){var i=this,n=e.details,a=e.stats,s=self.performance.now(),o=a.loading.first?Math.max(0,s-a.loading.first):0;if(n.advancedDateTime=Date.now()-o,n.live||null!=r&&r.live){if(n.reloaded(r),r&&this.log("live playlist "+t+" "+(n.advanced?"REFRESHED "+n.lastPartSn+"-"+n.lastPartIndex:n.updated?"UPDATED":"MISSED")),r&&n.fragments.length>0&&nr(r,n),!this.canLoad||!n.live)return;var l,u=void 0,h=void 0;if(n.canBlockReload&&n.endSN&&n.advanced){var d=this.hls.config.lowLatencyMode,c=n.lastPartSn,f=n.endSN,g=n.lastPartIndex,v=c===f;-1!==g?(u=v?f+1:c,h=v?d?0:g:g+1):u=f+1;var m=n.age,p=m+n.ageHeader,y=Math.min(p-n.partTarget,1.5*n.targetduration);if(y>0){if(r&&y>r.tuneInGoal)this.warn("CDN Tune-in goal increased from: "+r.tuneInGoal+" to: "+y+" with playlist age: "+n.age),y=0;else{var E=Math.floor(y/n.targetduration);u+=E,void 0!==h&&(h+=Math.round(y%n.targetduration/n.partTarget)),this.log("CDN Tune-in age: "+n.ageHeader+"s last advanced "+m.toFixed(2)+"s goal: "+y+" skip sn "+E+" to part "+h)}n.tuneInGoal=y}if(l=this.getDeliveryDirectives(n,e.deliveryDirectives,u,h),d||!v)return void this.loadPlaylist(l)}else(n.canBlockReload||n.canSkipUntil)&&(l=this.getDeliveryDirectives(n,e.deliveryDirectives,u,h));var T=this.hls.mainForwardBufferInfo,S=T?T.end-T.len:0,L=function(t,e){void 0===e&&(e=1/0);var r=1e3*t.targetduration;if(t.updated){var i=t.fragments;if(i.length&&4*r>e){var n=1e3*i[i.length-1].duration;n<r&&(r=n)}}else r/=2;return Math.round(r)}(n,1e3*(n.edge-S));n.updated&&s>this.requestScheduled+L&&(this.requestScheduled=a.loading.start),void 0!==u&&n.canBlockReload?this.requestScheduled=a.loading.first+L-(1e3*n.partTarget||1e3):-1===this.requestScheduled||this.requestScheduled+L<s?this.requestScheduled=s:this.requestScheduled-s<=0&&(this.requestScheduled+=L);var A=this.requestScheduled-s;A=Math.max(0,A),this.log("reload live playlist "+t+" in "+Math.round(A)+" ms"),this.timer=self.setTimeout((function(){return i.loadPlaylist(l)}),A)}else this.clearTimer()},e.getDeliveryDirectives=function(t,e,r,i){var n=function(t,e){var r=t.canSkipUntil,i=t.canSkipDateRanges,n=t.endSN;return r&&(void 0!==e?e-n:0)<r?i?$e:Je:Qe}(t,r);return null!=e&&e.skip&&t.deltaUpdateFailed&&(r=e.msn,i=e.part,n=Qe),new Ze(r,i,n)},e.checkRetry=function(t){var e=this,r=t.details,i=hr(t),n=t.errorAction,a=n||{},s=a.action,o=a.retryCount,l=void 0===o?0:o,u=a.retryConfig,h=!!n&&!!u&&(s===Lr||!n.resolved&&s===Tr);if(h){var d;if(this.requestScheduled=-1,l>=u.maxNumRetry)return!1;if(i&&null!=(d=t.context)&&d.deliveryDirectives)this.warn("Retrying playlist loading "+(l+1)+"/"+u.maxNumRetry+' after "'+r+'" without delivery-directives'),this.loadPlaylist();else{var c=cr(u,l);this.timer=self.setTimeout((function(){return e.loadPlaylist()}),c),this.warn("Retrying playlist loading "+(l+1)+"/"+u.maxNumRetry+' after "'+r+'" in '+c+"ms")}t.levelRetry=!0,n.resolved=!0}return h},t}(),Ir=function(){function t(t,e,r){void 0===e&&(e=0),void 0===r&&(r=0),this.halfLife=void 0,this.alpha_=void 0,this.estimate_=void 0,this.totalWeight_=void 0,this.halfLife=t,this.alpha_=t?Math.exp(Math.log(.5)/t):0,this.estimate_=e,this.totalWeight_=r}var e=t.prototype;return e.sample=function(t,e){var r=Math.pow(this.alpha_,t);this.estimate_=e*(1-r)+r*this.estimate_,this.totalWeight_+=t},e.getTotalWeight=function(){return this.totalWeight_},e.getEstimate=function(){if(this.alpha_){var t=1-Math.pow(this.alpha_,this.totalWeight_);if(t)return this.estimate_/t}return this.estimate_},t}(),wr=function(){function t(t,e,r,i){void 0===i&&(i=100),this.defaultEstimate_=void 0,this.minWeight_=void 0,this.minDelayMs_=void 0,this.slow_=void 0,this.fast_=void 0,this.defaultTTFB_=void 0,this.ttfb_=void 0,this.defaultEstimate_=r,this.minWeight_=.001,this.minDelayMs_=50,this.slow_=new Ir(t),this.fast_=new Ir(e),this.defaultTTFB_=i,this.ttfb_=new Ir(t)}var e=t.prototype;return e.update=function(t,e){var r=this.slow_,i=this.fast_,n=this.ttfb_;r.halfLife!==t&&(this.slow_=new Ir(t,r.getEstimate(),r.getTotalWeight())),i.halfLife!==e&&(this.fast_=new Ir(e,i.getEstimate(),i.getTotalWeight())),n.halfLife!==t&&(this.ttfb_=new Ir(t,n.getEstimate(),n.getTotalWeight()))},e.sample=function(t,e){var r=(t=Math.max(t,this.minDelayMs_))/1e3,i=8*e/r;this.fast_.sample(r,i),this.slow_.sample(r,i)},e.sampleTTFB=function(t){var e=t/1e3,r=Math.sqrt(2)*Math.exp(-Math.pow(e,2)/2);this.ttfb_.sample(r,Math.max(t,5))},e.canEstimate=function(){return this.fast_.getTotalWeight()>=this.minWeight_},e.getEstimate=function(){return this.canEstimate()?Math.min(this.fast_.getEstimate(),this.slow_.getEstimate()):this.defaultEstimate_},e.getEstimateTTFB=function(){return this.ttfb_.getTotalWeight()>=this.minWeight_?this.ttfb_.getEstimate():this.defaultTTFB_},e.destroy=function(){},t}(),Cr={supported:!0,configurations:[],decodingInfoResults:[{supported:!0,powerEfficient:!0,smooth:!0}]},_r={};function xr(t,e,r){var n=t.videoCodec,a=t.audioCodec;if(!n||!a||!r)return Promise.resolve(Cr);var s={width:t.width,height:t.height,bitrate:Math.ceil(Math.max(.9*t.bitrate,t.averageBitrate)),framerate:t.frameRate||30},o=t.videoRange;"SDR"!==o&&(s.transferFunction=o.toLowerCase());var l=n.split(",").map((function(t){return{type:"media-source",video:i(i({},s),{},{contentType:ne(t,"video")})}}));return a&&t.audioGroups&&t.audioGroups.forEach((function(t){var r;t&&(null==(r=e.groups[t])||r.tracks.forEach((function(e){if(e.groupId===t){var r=e.channels||"",i=parseFloat(r);y(i)&&i>2&&l.push.apply(l,a.split(",").map((function(t){return{type:"media-source",audio:{contentType:ne(t,"audio"),channels:""+i}}})))}})))})),Promise.all(l.map((function(t){var e=function(t){var e=t.audio,r=t.video,i=r||e;if(i){var n=i.contentType.split('"')[1];if(r)return"r"+r.height+"x"+r.width+"f"+Math.ceil(r.framerate)+(r.transferFunction||"sd")+"_"+n+"_"+Math.ceil(r.bitrate/1e5);if(e)return"c"+e.channels+(e.spatialRendering?"s":"n")+"_"+n}return""}(t);return _r[e]||(_r[e]=r.decodingInfo(t))}))).then((function(t){return{supported:!t.some((function(t){return!t.supported})),configurations:l,decodingInfoResults:t}})).catch((function(t){return{supported:!1,configurations:l,decodingInfoResults:[],error:t}}))}function Pr(t,e){var r=!1,i=[];return t&&(r="SDR"!==t,i=[t]),e&&(i=e.allowedVideoRanges||ze.slice(0),i=(r=void 0!==e.preferHDR?e.preferHDR:function(){if("function"==typeof matchMedia){var t=matchMedia("(dynamic-range: high)"),e=matchMedia("bad query");if(t.media!==e.media)return!0===t.matches}return!1}())?i.filter((function(t){return"SDR"!==t})):["SDR"]),{preferHDR:r,allowedVideoRanges:i}}function Fr(t,e){w.log('[abr] start candidates with "'+t+'" ignored because '+e)}function Mr(t,e,r){if("attrs"in t){var i=e.indexOf(t);if(-1!==i)return i}for(var n=0;n<e.length;n++)if(Or(t,e[n],r))return n;return-1}function Or(t,e,r){var i=t.groupId,n=t.name,a=t.lang,s=t.assocLang,o=t.characteristics,l=t.default,u=t.forced;return(void 0===i||e.groupId===i)&&(void 0===n||e.name===n)&&(void 0===a||e.lang===a)&&(void 0===a||e.assocLang===s)&&(void 0===l||e.default===l)&&(void 0===u||e.forced===u)&&(void 0===o||function(t,e){void 0===e&&(e="");var r=t.split(","),i=e.split(",");return r.length===i.length&&!r.some((function(t){return-1===i.indexOf(t)}))}(o,e.characteristics))&&(void 0===r||r(t,e))}function Nr(t,e){var r=t.audioCodec,i=t.channels;return!(void 0!==r&&(e.audioCodec||"").substring(0,4)!==r.substring(0,4)||void 0!==i&&i!==(e.channels||"2"))}function Ur(t,e,r){for(var i=e;i;i--)if(r(t[i]))return i;for(var n=e+1;n<t.length;n++)if(r(t[n]))return n;return-1}var Br=function(){function t(t){var e=this;this.hls=void 0,this.lastLevelLoadSec=0,this.lastLoadedFragLevel=-1,this.firstSelection=-1,this._nextAutoLevel=-1,this.nextAutoLevelKey="",this.audioTracksByGroup=null,this.codecTiers=null,this.timer=-1,this.fragCurrent=null,this.partCurrent=null,this.bitrateTestDelay=0,this.bwEstimator=void 0,this._abandonRulesCheck=function(){var t=e.fragCurrent,r=e.partCurrent,i=e.hls,n=i.autoLevelEnabled,a=i.media;if(t&&a){var s=performance.now(),o=r?r.stats:t.stats,l=r?r.duration:t.duration,u=s-o.loading.start,h=i.minAutoLevel;if(o.aborted||o.loaded&&o.loaded===o.total||t.level<=h)return e.clearTimer(),void(e._nextAutoLevel=-1);if(n&&!a.paused&&a.playbackRate&&a.readyState){var d=i.mainForwardBufferInfo;if(null!==d){var c=e.bwEstimator.getEstimateTTFB(),f=Math.abs(a.playbackRate);if(!(u<=Math.max(c,l/(2*f)*1e3))){var g=d.len/f,v=o.loading.first?o.loading.first-o.loading.start:-1,m=o.loaded&&v>-1,p=e.getBwEstimate(),E=i.levels,T=E[t.level],L=o.total||Math.max(o.loaded,Math.round(l*T.maxBitrate/8)),A=m?u-v:u;A<1&&m&&(A=Math.min(u,8*o.loaded/p));var R=m?1e3*o.loaded/A:0,k=R?(L-o.loaded)/R:8*L/p+c/1e3;if(!(k<=g)){var b,D=R?8*R:p,I=Number.POSITIVE_INFINITY;for(b=t.level-1;b>h;b--){var C=E[b].maxBitrate;if((I=e.getTimeToLoadFrag(c/1e3,D,l*C,!E[b].details))<g)break}if(!(I>=k||I>10*l)){i.nextLoadLevel=i.nextAutoLevel=b,m?e.bwEstimator.sample(u-Math.min(c,v),o.loaded):e.bwEstimator.sampleTTFB(u);var _=E[b].bitrate;e.getBwEstimate()*e.hls.config.abrBandWidthUpFactor>_&&e.resetEstimator(_),e.clearTimer(),w.warn("[abr] Fragment "+t.sn+(r?" part "+r.index:"")+" of level "+t.level+" is loading too slowly;\n      Time to underbuffer: "+g.toFixed(3)+" s\n      Estimated load time for current fragment: "+k.toFixed(3)+" s\n      Estimated load time for down switch fragment: "+I.toFixed(3)+" s\n      TTFB estimate: "+(0|v)+" ms\n      Current BW estimate: "+(y(p)?0|p:"Unknown")+" bps\n      New BW estimate: "+(0|e.getBwEstimate())+" bps\n      Switching to level "+b+" @ "+(0|_)+" bps"),i.trigger(S.FRAG_LOAD_EMERGENCY_ABORTED,{frag:t,part:r,stats:o})}}}}}}},this.hls=t,this.bwEstimator=this.initEstimator(),this.registerListeners()}var e=t.prototype;return e.resetEstimator=function(t){t&&(w.log("setting initial bwe to "+t),this.hls.config.abrEwmaDefaultEstimate=t),this.firstSelection=-1,this.bwEstimator=this.initEstimator()},e.initEstimator=function(){var t=this.hls.config;return new wr(t.abrEwmaSlowVoD,t.abrEwmaFastVoD,t.abrEwmaDefaultEstimate)},e.registerListeners=function(){var t=this.hls;t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.FRAG_LOADING,this.onFragLoading,this),t.on(S.FRAG_LOADED,this.onFragLoaded,this),t.on(S.FRAG_BUFFERED,this.onFragBuffered,this),t.on(S.LEVEL_SWITCHING,this.onLevelSwitching,this),t.on(S.LEVEL_LOADED,this.onLevelLoaded,this),t.on(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.on(S.MAX_AUTO_LEVEL_UPDATED,this.onMaxAutoLevelUpdated,this),t.on(S.ERROR,this.onError,this)},e.unregisterListeners=function(){var t=this.hls;t&&(t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.FRAG_LOADING,this.onFragLoading,this),t.off(S.FRAG_LOADED,this.onFragLoaded,this),t.off(S.FRAG_BUFFERED,this.onFragBuffered,this),t.off(S.LEVEL_SWITCHING,this.onLevelSwitching,this),t.off(S.LEVEL_LOADED,this.onLevelLoaded,this),t.off(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.off(S.MAX_AUTO_LEVEL_UPDATED,this.onMaxAutoLevelUpdated,this),t.off(S.ERROR,this.onError,this))},e.destroy=function(){this.unregisterListeners(),this.clearTimer(),this.hls=this._abandonRulesCheck=null,this.fragCurrent=this.partCurrent=null},e.onManifestLoading=function(t,e){this.lastLoadedFragLevel=-1,this.firstSelection=-1,this.lastLevelLoadSec=0,this.fragCurrent=this.partCurrent=null,this.onLevelsUpdated(),this.clearTimer()},e.onLevelsUpdated=function(){this.lastLoadedFragLevel>-1&&this.fragCurrent&&(this.lastLoadedFragLevel=this.fragCurrent.level),this._nextAutoLevel=-1,this.onMaxAutoLevelUpdated(),this.codecTiers=null,this.audioTracksByGroup=null},e.onMaxAutoLevelUpdated=function(){this.firstSelection=-1,this.nextAutoLevelKey=""},e.onFragLoading=function(t,e){var r,i=e.frag;this.ignoreFragment(i)||(i.bitrateTest||(this.fragCurrent=i,this.partCurrent=null!=(r=e.part)?r:null),this.clearTimer(),this.timer=self.setInterval(this._abandonRulesCheck,100))},e.onLevelSwitching=function(t,e){this.clearTimer()},e.onError=function(t,e){if(!e.fatal)switch(e.details){case A.BUFFER_ADD_CODEC_ERROR:case A.BUFFER_APPEND_ERROR:this.lastLoadedFragLevel=-1,this.firstSelection=-1;break;case A.FRAG_LOAD_TIMEOUT:var r=e.frag,i=this.fragCurrent,n=this.partCurrent;if(r&&i&&r.sn===i.sn&&r.level===i.level){var a=performance.now(),s=n?n.stats:r.stats,o=a-s.loading.start,l=s.loading.first?s.loading.first-s.loading.start:-1;if(s.loaded&&l>-1){var u=this.bwEstimator.getEstimateTTFB();this.bwEstimator.sample(o-Math.min(u,l),s.loaded)}else this.bwEstimator.sampleTTFB(o)}}},e.getTimeToLoadFrag=function(t,e,r,i){return t+r/e+(i?this.lastLevelLoadSec:0)},e.onLevelLoaded=function(t,e){var r=this.hls.config,i=e.stats.loading,n=i.end-i.start;y(n)&&(this.lastLevelLoadSec=n/1e3),e.details.live?this.bwEstimator.update(r.abrEwmaSlowLive,r.abrEwmaFastLive):this.bwEstimator.update(r.abrEwmaSlowVoD,r.abrEwmaFastVoD)},e.onFragLoaded=function(t,e){var r=e.frag,i=e.part,n=i?i.stats:r.stats;if(r.type===Ie&&this.bwEstimator.sampleTTFB(n.loading.first-n.loading.start),!this.ignoreFragment(r)){if(this.clearTimer(),r.level===this._nextAutoLevel&&(this._nextAutoLevel=-1),this.firstSelection=-1,this.hls.config.abrMaxWithRealBitrate){var a=i?i.duration:r.duration,s=this.hls.levels[r.level],o=(s.loaded?s.loaded.bytes:0)+n.loaded,l=(s.loaded?s.loaded.duration:0)+a;s.loaded={bytes:o,duration:l},s.realBitrate=Math.round(8*o/l)}if(r.bitrateTest){var u={stats:n,frag:r,part:i,id:r.type};this.onFragBuffered(S.FRAG_BUFFERED,u),r.bitrateTest=!1}else this.lastLoadedFragLevel=r.level}},e.onFragBuffered=function(t,e){var r=e.frag,i=e.part,n=null!=i&&i.stats.loaded?i.stats:r.stats;if(!n.aborted&&!this.ignoreFragment(r)){var a=n.parsing.end-n.loading.start-Math.min(n.loading.first-n.loading.start,this.bwEstimator.getEstimateTTFB());this.bwEstimator.sample(a,n.loaded),n.bwEstimate=this.getBwEstimate(),r.bitrateTest?this.bitrateTestDelay=a/1e3:this.bitrateTestDelay=0}},e.ignoreFragment=function(t){return t.type!==Ie||"initSegment"===t.sn},e.clearTimer=function(){this.timer>-1&&(self.clearInterval(this.timer),this.timer=-1)},e.getAutoLevelKey=function(){var t;return this.getBwEstimate()+"_"+(null==(t=this.hls.mainForwardBufferInfo)?void 0:t.len)},e.getNextABRAutoLevel=function(){var t=this.fragCurrent,e=this.partCurrent,r=this.hls,i=r.maxAutoLevel,n=r.config,a=r.minAutoLevel,s=r.media,o=e?e.duration:t?t.duration:0,l=s&&0!==s.playbackRate?Math.abs(s.playbackRate):1,u=this.getBwEstimate(),h=r.mainForwardBufferInfo,d=(h?h.len:0)/l,c=n.abrBandWidthFactor,f=n.abrBandWidthUpFactor;if(d){var g=this.findBestLevel(u,a,i,d,0,c,f);if(g>=0)return g}var v=o?Math.min(o,n.maxStarvationDelay):n.maxStarvationDelay;if(!d){var m=this.bitrateTestDelay;m&&(v=(o?Math.min(o,n.maxLoadingDelay):n.maxLoadingDelay)-m,w.info("[abr] bitrate test took "+Math.round(1e3*m)+"ms, set first fragment max fetchDuration to "+Math.round(1e3*v)+" ms"),c=f=1)}var p=this.findBestLevel(u,a,i,d,v,c,f);if(w.info("[abr] "+(d?"rebuffering expected":"buffer is empty")+", optimal quality level "+p),p>-1)return p;var y=r.levels[a],E=r.levels[r.loadLevel];return(null==y?void 0:y.bitrate)<(null==E?void 0:E.bitrate)?a:r.loadLevel},e.getBwEstimate=function(){return this.bwEstimator.canEstimate()?this.bwEstimator.getEstimate():this.hls.config.abrEwmaDefaultEstimate},e.findBestLevel=function(t,e,r,i,n,a,s){var o,l=this,u=i+n,h=this.lastLoadedFragLevel,d=-1===h?this.hls.firstLevel:h,c=this.fragCurrent,f=this.partCurrent,g=this.hls,v=g.levels,m=g.allAudioTracks,p=g.loadLevel,E=g.config;if(1===v.length)return 0;var T,S=v[d],L=!(null==S||null==(o=S.details)||!o.live),A=-1===p||-1===h,R="SDR",k=(null==S?void 0:S.frameRate)||0,b=E.audioPreference,D=E.videoPreference,I=this.audioTracksByGroup||(this.audioTracksByGroup=function(t){return t.reduce((function(t,e){var r=t.groups[e.groupId];r||(r=t.groups[e.groupId]={tracks:[],channels:{2:0},hasDefault:!1,hasAutoSelect:!1}),r.tracks.push(e);var i=e.channels||"2";return r.channels[i]=(r.channels[i]||0)+1,r.hasDefault=r.hasDefault||e.default,r.hasAutoSelect=r.hasAutoSelect||e.autoselect,r.hasDefault&&(t.hasDefaultAudio=!0),r.hasAutoSelect&&(t.hasAutoSelectAudio=!0),t}),{hasDefaultAudio:!1,hasAutoSelectAudio:!1,groups:{}})}(m));if(A){if(-1!==this.firstSelection)return this.firstSelection;var C=this.codecTiers||(this.codecTiers=function(t,e,r,i){return t.slice(r,i+1).reduce((function(t,r){if(!r.codecSet)return t;var i=r.audioGroups,n=t[r.codecSet];n||(t[r.codecSet]=n={minBitrate:1/0,minHeight:1/0,minFramerate:1/0,maxScore:0,videoRanges:{SDR:0},channels:{2:0},hasDefaultAudio:!i,fragmentError:0}),n.minBitrate=Math.min(n.minBitrate,r.bitrate);var a=Math.min(r.height,r.width);return n.minHeight=Math.min(n.minHeight,a),n.minFramerate=Math.min(n.minFramerate,r.frameRate),n.maxScore=Math.max(n.maxScore,r.score),n.fragmentError+=r.fragmentError,n.videoRanges[r.videoRange]=(n.videoRanges[r.videoRange]||0)+1,i&&i.forEach((function(t){if(t){var r=e.groups[t];n.hasDefaultAudio=n.hasDefaultAudio||e.hasDefaultAudio?r.hasDefault:r.hasAutoSelect||!e.hasDefaultAudio&&!e.hasAutoSelectAudio,Object.keys(r.channels).forEach((function(t){n.channels[t]=(n.channels[t]||0)+r.channels[t]}))}})),t}),{})}(v,I,e,r)),_=function(t,e,r,i,n){for(var a=Object.keys(t),s=null==i?void 0:i.channels,o=null==i?void 0:i.audioCodec,l=s&&2===parseInt(s),u=!0,h=!1,d=1/0,c=1/0,f=1/0,g=0,v=[],m=Pr(e,n),p=m.preferHDR,E=m.allowedVideoRanges,T=function(){var e=t[a[S]];u=e.channels[2]>0,d=Math.min(d,e.minHeight),c=Math.min(c,e.minFramerate),f=Math.min(f,e.minBitrate);var r=E.filter((function(t){return e.videoRanges[t]>0}));r.length>0&&(h=!0,v=r)},S=a.length;S--;)T();d=y(d)?d:0,c=y(c)?c:0;var L=Math.max(1080,d),A=Math.max(30,c);return f=y(f)?f:r,r=Math.max(f,r),h||(e=void 0,v=[]),{codecSet:a.reduce((function(e,i){var n=t[i];if(i===e)return e;if(n.minBitrate>r)return Fr(i,"min bitrate of "+n.minBitrate+" > current estimate of "+r),e;if(!n.hasDefaultAudio)return Fr(i,"no renditions with default or auto-select sound found"),e;if(o&&i.indexOf(o.substring(0,4))%5!=0)return Fr(i,'audio codec preference "'+o+'" not found'),e;if(s&&!l){if(!n.channels[s])return Fr(i,"no renditions with "+s+" channel sound found (channels options: "+Object.keys(n.channels)+")"),e}else if((!o||l)&&u&&0===n.channels[2])return Fr(i,"no renditions with stereo sound found"),e;return n.minHeight>L?(Fr(i,"min resolution of "+n.minHeight+" > maximum of "+L),e):n.minFramerate>A?(Fr(i,"min framerate of "+n.minFramerate+" > maximum of "+A),e):v.some((function(t){return n.videoRanges[t]>0}))?n.maxScore<g?(Fr(i,"max score of "+n.maxScore+" < selected max of "+g),e):e&&(se(i)>=se(e)||n.fragmentError>t[e].fragmentError)?e:(g=n.maxScore,i):(Fr(i,"no variants with VIDEO-RANGE of "+JSON.stringify(v)+" found"),e)}),void 0),videoRanges:v,preferHDR:p,minFramerate:c,minBitrate:f}}(C,R,t,b,D),x=_.codecSet,P=_.videoRanges,F=_.minFramerate,M=_.minBitrate,O=_.preferHDR;T=x,R=O?P[P.length-1]:P[0],k=F,t=Math.max(t,M),w.log("[abr] picked start tier "+JSON.stringify(_))}else T=null==S?void 0:S.codecSet,R=null==S?void 0:S.videoRange;for(var N,U=f?f.duration:c?c.duration:0,B=this.bwEstimator.getEstimateTTFB()/1e3,G=[],K=function(){var e,o,c=v[H],g=H>d;if(!c)return 0;if(E.useMediaCapabilities&&!c.supportedResult&&!c.supportedPromise){var m=navigator.mediaCapabilities;"function"==typeof(null==m?void 0:m.decodingInfo)&&function(t,e,r,i,n,a){var s=t.audioCodec?t.audioGroups:null,o=null==a?void 0:a.audioCodec,l=null==a?void 0:a.channels,u=l?parseInt(l):o?1/0:2,h=null;if(null!=s&&s.length)try{h=1===s.length&&s[0]?e.groups[s[0]].channels:s.reduce((function(t,r){if(r){var i=e.groups[r];if(!i)throw new Error("Audio track group "+r+" not found");Object.keys(i.channels).forEach((function(e){t[e]=(t[e]||0)+i.channels[e]}))}return t}),{2:0})}catch(t){return!0}return void 0!==t.videoCodec&&(t.width>1920&&t.height>1088||t.height>1920&&t.width>1088||t.frameRate>Math.max(i,30)||"SDR"!==t.videoRange&&t.videoRange!==r||t.bitrate>Math.max(n,8e6))||!!h&&y(u)&&Object.keys(h).some((function(t){return parseInt(t)>u}))}(c,I,R,k,t,b)?(c.supportedPromise=xr(c,I,m),c.supportedPromise.then((function(t){c.supportedResult=t;var e=l.hls.levels,r=e.indexOf(c);t.error?w.warn('[abr] MediaCapabilities decodingInfo error: "'+t.error+'" for level '+r+" "+JSON.stringify(t)):t.supported||(w.warn("[abr] Unsupported MediaCapabilities decodingInfo result for level "+r+" "+JSON.stringify(t)),r>-1&&e.length>1&&(w.log("[abr] Removing unsupported level "+r),l.hls.removeLevel(r)))}))):c.supportedResult=Cr}if(T&&c.codecSet!==T||R&&c.videoRange!==R||g&&k>c.frameRate||!g&&k>0&&k<c.frameRate||null==(e=c.supportedResult)||null==(o=e.decodingInfoResults)||!o[0].smooth)return G.push(H),0;var D,C=c.details,_=(f?null==C?void 0:C.partTarget:null==C?void 0:C.averagetargetduration)||U;D=g?s*t:a*t;var x=U&&i>=2*U&&0===n?v[H].averageBitrate:v[H].maxBitrate,P=l.getTimeToLoadFrag(B,D,x*_,void 0===C);if(D>=x&&(H===h||0===c.loadError&&0===c.fragmentError)&&(P<=B||!y(P)||L&&!l.bitrateTestDelay||P<u)){var F=l.forcedAutoLevel;return H===p||-1!==F&&F===p||(G.length&&w.trace("[abr] Skipped level(s) "+G.join(",")+" of "+r+' max with CODECS and VIDEO-RANGE:"'+v[G[0]].codecs+'" '+v[G[0]].videoRange+'; not compatible with "'+S.codecs+'" '+R),w.info("[abr] switch candidate:"+d+"->"+H+" adjustedbw("+Math.round(D)+")-bitrate="+Math.round(D-x)+" ttfb:"+B.toFixed(1)+" avgDuration:"+_.toFixed(1)+" maxFetchDuration:"+u.toFixed(1)+" fetchDuration:"+P.toFixed(1)+" firstSelection:"+A+" codecSet:"+T+" videoRange:"+R+" hls.loadLevel:"+p)),A&&(l.firstSelection=H),{v:H}}},H=r;H>=e;H--)if(0!==(N=K())&&N)return N.v;return-1},s(t,[{key:"firstAutoLevel",get:function(){var t=this.hls,e=t.maxAutoLevel,r=t.minAutoLevel,i=this.getBwEstimate(),n=this.hls.config.maxStarvationDelay,a=this.findBestLevel(i,r,e,0,n,1,1);if(a>-1)return a;var s=this.hls.firstLevel,o=Math.min(Math.max(s,r),e);return w.warn("[abr] Could not find best starting auto level. Defaulting to first in playlist "+s+" clamped to "+o),o}},{key:"forcedAutoLevel",get:function(){return this.nextAutoLevelKey?-1:this._nextAutoLevel}},{key:"nextAutoLevel",get:function(){var t=this.forcedAutoLevel,e=this.bwEstimator.canEstimate(),r=this.lastLoadedFragLevel>-1;if(!(-1===t||e&&r&&this.nextAutoLevelKey!==this.getAutoLevelKey()))return t;var i=e&&r?this.getNextABRAutoLevel():this.firstAutoLevel;if(-1!==t){var n=this.hls.levels;if(n.length>Math.max(t,i)&&n[t].loadError<=n[i].loadError)return t}return this._nextAutoLevel=i,this.nextAutoLevelKey=this.getAutoLevelKey(),i},set:function(t){var e=Math.max(this.hls.minAutoLevel,t);this._nextAutoLevel!=e&&(this.nextAutoLevelKey="",this._nextAutoLevel=e)}}]),t}(),Gr=function(){function t(){this._boundTick=void 0,this._tickTimer=null,this._tickInterval=null,this._tickCallCount=0,this._boundTick=this.tick.bind(this)}var e=t.prototype;return e.destroy=function(){this.onHandlerDestroying(),this.onHandlerDestroyed()},e.onHandlerDestroying=function(){this.clearNextTick(),this.clearInterval()},e.onHandlerDestroyed=function(){},e.hasInterval=function(){return!!this._tickInterval},e.hasNextTick=function(){return!!this._tickTimer},e.setInterval=function(t){return!this._tickInterval&&(this._tickCallCount=0,this._tickInterval=self.setInterval(this._boundTick,t),!0)},e.clearInterval=function(){return!!this._tickInterval&&(self.clearInterval(this._tickInterval),this._tickInterval=null,!0)},e.clearNextTick=function(){return!!this._tickTimer&&(self.clearTimeout(this._tickTimer),this._tickTimer=null,!0)},e.tick=function(){this._tickCallCount++,1===this._tickCallCount&&(this.doTick(),this._tickCallCount>1&&this.tickImmediate(),this._tickCallCount=0)},e.tickImmediate=function(){this.clearNextTick(),this._tickTimer=self.setTimeout(this._boundTick,0)},e.doTick=function(){},t}(),Kr="NOT_LOADED",Hr="APPENDING",Vr="PARTIAL",Yr="OK",Wr=function(){function t(t){this.activePartLists=Object.create(null),this.endListFragments=Object.create(null),this.fragments=Object.create(null),this.timeRanges=Object.create(null),this.bufferPadding=.2,this.hls=void 0,this.hasGaps=!1,this.hls=t,this._registerListeners()}var e=t.prototype;return e._registerListeners=function(){var t=this.hls;t.on(S.BUFFER_APPENDED,this.onBufferAppended,this),t.on(S.FRAG_BUFFERED,this.onFragBuffered,this),t.on(S.FRAG_LOADED,this.onFragLoaded,this)},e._unregisterListeners=function(){var t=this.hls;t.off(S.BUFFER_APPENDED,this.onBufferAppended,this),t.off(S.FRAG_BUFFERED,this.onFragBuffered,this),t.off(S.FRAG_LOADED,this.onFragLoaded,this)},e.destroy=function(){this._unregisterListeners(),this.fragments=this.activePartLists=this.endListFragments=this.timeRanges=null},e.getAppendedFrag=function(t,e){var r=this.activePartLists[e];if(r)for(var i=r.length;i--;){var n=r[i];if(!n)break;var a=n.end;if(n.start<=t&&null!==a&&t<=a)return n}return this.getBufferedFrag(t,e)},e.getBufferedFrag=function(t,e){for(var r=this.fragments,i=Object.keys(r),n=i.length;n--;){var a=r[i[n]];if((null==a?void 0:a.body.type)===e&&a.buffered){var s=a.body;if(s.start<=t&&t<=s.end)return s}}return null},e.detectEvictedFragments=function(t,e,r,i){var n=this;this.timeRanges&&(this.timeRanges[t]=e);var a=(null==i?void 0:i.fragment.sn)||-1;Object.keys(this.fragments).forEach((function(i){var s=n.fragments[i];if(s&&!(a>=s.body.sn))if(s.buffered||s.loaded){var o=s.range[t];o&&o.time.some((function(t){var r=!n.isTimeBuffered(t.startPTS,t.endPTS,e);return r&&n.removeFragment(s.body),r}))}else s.body.type===r&&n.removeFragment(s.body)}))},e.detectPartialFragments=function(t){var e=this,r=this.timeRanges,i=t.frag,n=t.part;if(r&&"initSegment"!==i.sn){var a=qr(i),s=this.fragments[a];if(!(!s||s.buffered&&i.gap)){var o=!i.relurl;Object.keys(r).forEach((function(t){var a=i.elementaryStreams[t];if(a){var l=r[t],u=o||!0===a.partial;s.range[t]=e.getBufferedTimes(i,n,u,l)}})),s.loaded=null,Object.keys(s.range).length?(s.buffered=!0,(s.body.endList=i.endList||s.body.endList)&&(this.endListFragments[s.body.type]=s),jr(s)||this.removeParts(i.sn-1,i.type)):this.removeFragment(s.body)}}},e.removeParts=function(t,e){var r=this.activePartLists[e];r&&(this.activePartLists[e]=r.filter((function(e){return e.fragment.sn>=t})))},e.fragBuffered=function(t,e){var r=qr(t),i=this.fragments[r];!i&&e&&(i=this.fragments[r]={body:t,appendedPTS:null,loaded:null,buffered:!1,range:Object.create(null)},t.gap&&(this.hasGaps=!0)),i&&(i.loaded=null,i.buffered=!0)},e.getBufferedTimes=function(t,e,r,i){for(var n={time:[],partial:r},a=t.start,s=t.end,o=t.minEndPTS||s,l=t.maxStartPTS||a,u=0;u<i.length;u++){var h=i.start(u)-this.bufferPadding,d=i.end(u)+this.bufferPadding;if(l>=h&&o<=d){n.time.push({startPTS:Math.max(a,i.start(u)),endPTS:Math.min(s,i.end(u))});break}if(a<d&&s>h){var c=Math.max(a,i.start(u)),f=Math.min(s,i.end(u));f>c&&(n.partial=!0,n.time.push({startPTS:c,endPTS:f}))}else if(s<=h)break}return n},e.getPartialFragment=function(t){var e,r,i,n=null,a=0,s=this.bufferPadding,o=this.fragments;return Object.keys(o).forEach((function(l){var u=o[l];u&&jr(u)&&(r=u.body.start-s,i=u.body.end+s,t>=r&&t<=i&&(e=Math.min(t-r,i-t),a<=e&&(n=u.body,a=e)))})),n},e.isEndListAppended=function(t){var e=this.endListFragments[t];return void 0!==e&&(e.buffered||jr(e))},e.getState=function(t){var e=qr(t),r=this.fragments[e];return r?r.buffered?jr(r)?Vr:Yr:Hr:Kr},e.isTimeBuffered=function(t,e,r){for(var i,n,a=0;a<r.length;a++){if(i=r.start(a)-this.bufferPadding,n=r.end(a)+this.bufferPadding,t>=i&&e<=n)return!0;if(e<=i)return!1}return!1},e.onFragLoaded=function(t,e){var r=e.frag,i=e.part;if("initSegment"!==r.sn&&!r.bitrateTest){var n=i?null:e,a=qr(r);this.fragments[a]={body:r,appendedPTS:null,loaded:n,buffered:!1,range:Object.create(null)}}},e.onBufferAppended=function(t,e){var r=this,i=e.frag,n=e.part,a=e.timeRanges;if("initSegment"!==i.sn){var s=i.type;if(n){var o=this.activePartLists[s];o||(this.activePartLists[s]=o=[]),o.push(n)}this.timeRanges=a,Object.keys(a).forEach((function(t){var e=a[t];r.detectEvictedFragments(t,e,s,n)}))}},e.onFragBuffered=function(t,e){this.detectPartialFragments(e)},e.hasFragment=function(t){var e=qr(t);return!!this.fragments[e]},e.hasParts=function(t){var e;return!(null==(e=this.activePartLists[t])||!e.length)},e.removeFragmentsInRange=function(t,e,r,i,n){var a=this;i&&!this.hasGaps||Object.keys(this.fragments).forEach((function(s){var o=a.fragments[s];if(o){var l=o.body;l.type!==r||i&&!l.gap||l.start<e&&l.end>t&&(o.buffered||n)&&a.removeFragment(l)}}))},e.removeFragment=function(t){var e=qr(t);t.stats.loaded=0,t.clearElementaryStreamInfo();var r=this.activePartLists[t.type];if(r){var i=t.sn;this.activePartLists[t.type]=r.filter((function(t){return t.fragment.sn!==i}))}delete this.fragments[e],t.endList&&delete this.endListFragments[t.type]},e.removeAllFragments=function(){this.fragments=Object.create(null),this.endListFragments=Object.create(null),this.activePartLists=Object.create(null),this.hasGaps=!1},t}();function jr(t){var e,r,i;return t.buffered&&(t.body.gap||(null==(e=t.range.video)?void 0:e.partial)||(null==(r=t.range.audio)?void 0:r.partial)||(null==(i=t.range.audiovideo)?void 0:i.partial))}function qr(t){return t.type+"_"+t.level+"_"+t.sn}var Xr={length:0,start:function(){return 0},end:function(){return 0}},zr=function(){function t(){}return t.isBuffered=function(e,r){try{if(e)for(var i=t.getBuffered(e),n=0;n<i.length;n++)if(r>=i.start(n)&&r<=i.end(n))return!0}catch(t){}return!1},t.bufferInfo=function(e,r,i){try{if(e){var n,a=t.getBuffered(e),s=[];for(n=0;n<a.length;n++)s.push({start:a.start(n),end:a.end(n)});return this.bufferedInfo(s,r,i)}}catch(t){}return{len:0,start:r,end:r,nextStart:void 0}},t.bufferedInfo=function(t,e,r){e=Math.max(0,e),t.sort((function(t,e){var r=t.start-e.start;return r||e.end-t.end}));var i=[];if(r)for(var n=0;n<t.length;n++){var a=i.length;if(a){var s=i[a-1].end;t[n].start-s<r?t[n].end>s&&(i[a-1].end=t[n].end):i.push(t[n])}else i.push(t[n])}else i=t;for(var o,l=0,u=e,h=e,d=0;d<i.length;d++){var c=i[d].start,f=i[d].end;if(e+r>=c&&e<f)u=c,l=(h=f)-e;else if(e+r<c){o=c;break}}return{len:l,start:u||0,end:h||0,nextStart:o}},t.getBuffered=function(t){try{return t.buffered}catch(t){return w.log("failed to get media.buffered",t),Xr}},t}(),Qr=function(t,e,r,i,n,a){void 0===i&&(i=0),void 0===n&&(n=-1),void 0===a&&(a=!1),this.level=void 0,this.sn=void 0,this.part=void 0,this.id=void 0,this.size=void 0,this.partial=void 0,this.transmuxing={start:0,executeStart:0,executeEnd:0,end:0},this.buffering={audio:{start:0,executeStart:0,executeEnd:0,end:0},video:{start:0,executeStart:0,executeEnd:0,end:0},audiovideo:{start:0,executeStart:0,executeEnd:0,end:0}},this.level=t,this.sn=e,this.id=r,this.size=i,this.part=n,this.partial=a};function Jr(t,e){for(var r=0,i=t.length;r<i;r++){var n;if((null==(n=t[r])?void 0:n.cc)===e)return t[r]}return null}function $r(t,e){if(t){var r=t.start+e;t.start=t.startPTS=r,t.endPTS=r+t.duration}}function Zr(t,e){for(var r=e.fragments,i=0,n=r.length;i<n;i++)$r(r[i],t);e.fragmentHint&&$r(e.fragmentHint,t),e.alignedSliding=!0}function ti(t,e,r){e&&(function(t,e,r){if(function(t,e,r){return!(!e||!(r.endCC>r.startCC||t&&t.cc<r.startCC))}(t,r,e)){var i=function(t,e){var r=t.fragments,i=e.fragments;if(i.length&&r.length){var n=Jr(r,i[0].cc);if(n&&(!n||n.startPTS))return n;w.log("No frag in previous level to align on")}else w.log("No fragments to align")}(r,e);i&&y(i.start)&&(w.log("Adjusting PTS using last level due to CC increase within current level "+e.url),Zr(i.start,e))}}(t,r,e),!r.alignedSliding&&e&&ei(r,e),r.alignedSliding||!e||r.skippedSegments||ar(e,r))}function ei(t,e){if(t.hasProgramDateTime&&e.hasProgramDateTime){var r=t.fragments,i=e.fragments;if(r.length&&i.length){var n,a,s=Math.min(e.endCC,t.endCC);e.startCC<s&&t.startCC<s&&(n=Jr(i,s),a=Jr(r,s)),n&&a||(a=Jr(r,(n=i[Math.floor(i.length/2)]).cc)||r[Math.floor(r.length/2)]);var o=n.programDateTime,l=a.programDateTime;o&&l&&Zr((l-o)/1e3-(a.start-n.start),t)}}}var ri=Math.pow(2,17),ii=function(){function t(t){this.config=void 0,this.loader=null,this.partLoadTimeout=-1,this.config=t}var e=t.prototype;return e.destroy=function(){this.loader&&(this.loader.destroy(),this.loader=null)},e.abort=function(){this.loader&&this.loader.abort()},e.load=function(t,e){var r=this,n=t.url;if(!n)return Promise.reject(new si({type:L.NETWORK_ERROR,details:A.FRAG_LOAD_ERROR,fatal:!1,frag:t,error:new Error("Fragment does not have a "+(n?"part list":"url")),networkDetails:null}));this.abort();var a=this.config,s=a.fLoader,o=a.loader;return new Promise((function(l,u){if(r.loader&&r.loader.destroy(),t.gap){if(t.tagList.some((function(t){return"GAP"===t[0]})))return void u(ai(t));t.gap=!1}var h=r.loader=t.loader=s?new s(a):new o(a),d=ni(t),c=fr(a.fragLoadPolicy.default),f={loadPolicy:c,timeout:c.maxLoadTimeMs,maxRetry:0,retryDelay:0,maxRetryDelay:0,highWaterMark:"initSegment"===t.sn?1/0:ri};t.stats=h.stats,h.load(d,f,{onSuccess:function(e,i,n,a){r.resetLoader(t,h);var s=e.data;n.resetIV&&t.decryptdata&&(t.decryptdata.iv=new Uint8Array(s.slice(0,16)),s=s.slice(16)),l({frag:t,part:null,payload:s,networkDetails:a})},onError:function(e,a,s,o){r.resetLoader(t,h),u(new si({type:L.NETWORK_ERROR,details:A.FRAG_LOAD_ERROR,fatal:!1,frag:t,response:i({url:n,data:void 0},e),error:new Error("HTTP Error "+e.code+" "+e.text),networkDetails:s,stats:o}))},onAbort:function(e,i,n){r.resetLoader(t,h),u(new si({type:L.NETWORK_ERROR,details:A.INTERNAL_ABORTED,fatal:!1,frag:t,error:new Error("Aborted"),networkDetails:n,stats:e}))},onTimeout:function(e,i,n){r.resetLoader(t,h),u(new si({type:L.NETWORK_ERROR,details:A.FRAG_LOAD_TIMEOUT,fatal:!1,frag:t,error:new Error("Timeout after "+f.timeout+"ms"),networkDetails:n,stats:e}))},onProgress:function(r,i,n,a){e&&e({frag:t,part:null,payload:n,networkDetails:a})}})}))},e.loadPart=function(t,e,r){var n=this;this.abort();var a=this.config,s=a.fLoader,o=a.loader;return new Promise((function(l,u){if(n.loader&&n.loader.destroy(),t.gap||e.gap)u(ai(t,e));else{var h=n.loader=t.loader=s?new s(a):new o(a),d=ni(t,e),c=fr(a.fragLoadPolicy.default),f={loadPolicy:c,timeout:c.maxLoadTimeMs,maxRetry:0,retryDelay:0,maxRetryDelay:0,highWaterMark:ri};e.stats=h.stats,h.load(d,f,{onSuccess:function(i,a,s,o){n.resetLoader(t,h),n.updateStatsFromPart(t,e);var u={frag:t,part:e,payload:i.data,networkDetails:o};r(u),l(u)},onError:function(r,a,s,o){n.resetLoader(t,h),u(new si({type:L.NETWORK_ERROR,details:A.FRAG_LOAD_ERROR,fatal:!1,frag:t,part:e,response:i({url:d.url,data:void 0},r),error:new Error("HTTP Error "+r.code+" "+r.text),networkDetails:s,stats:o}))},onAbort:function(r,i,a){t.stats.aborted=e.stats.aborted,n.resetLoader(t,h),u(new si({type:L.NETWORK_ERROR,details:A.INTERNAL_ABORTED,fatal:!1,frag:t,part:e,error:new Error("Aborted"),networkDetails:a,stats:r}))},onTimeout:function(r,i,a){n.resetLoader(t,h),u(new si({type:L.NETWORK_ERROR,details:A.FRAG_LOAD_TIMEOUT,fatal:!1,frag:t,part:e,error:new Error("Timeout after "+f.timeout+"ms"),networkDetails:a,stats:r}))}})}}))},e.updateStatsFromPart=function(t,e){var r=t.stats,i=e.stats,n=i.total;if(r.loaded+=i.loaded,n){var a=Math.round(t.duration/e.duration),s=Math.min(Math.round(r.loaded/n),a),o=(a-s)*Math.round(r.loaded/s);r.total=r.loaded+o}else r.total=Math.max(r.loaded,r.total);var l=r.loading,u=i.loading;l.start?l.first+=u.first-u.start:(l.start=u.start,l.first=u.first),l.end=u.end},e.resetLoader=function(t,e){t.loader=null,this.loader===e&&(self.clearTimeout(this.partLoadTimeout),this.loader=null),e.destroy()},t}();function ni(t,e){void 0===e&&(e=null);var r=e||t,i={frag:t,part:e,responseType:"arraybuffer",url:r.url,headers:{},rangeStart:0,rangeEnd:0},n=r.byteRangeStartOffset,a=r.byteRangeEndOffset;if(y(n)&&y(a)){var s,o=n,l=a;if("initSegment"===t.sn&&"AES-128"===(null==(s=t.decryptdata)?void 0:s.method)){var u=a-n;u%16&&(l=a+(16-u%16)),0!==n&&(i.resetIV=!0,o=n-16)}i.rangeStart=o,i.rangeEnd=l}return i}function ai(t,e){var r=new Error("GAP "+(t.gap?"tag":"attribute")+" found"),i={type:L.MEDIA_ERROR,details:A.FRAG_GAP,fatal:!1,frag:t,error:r,networkDetails:null};return e&&(i.part=e),(e||t).stats.aborted=!0,new si(i)}var si=function(t){function e(e){var r;return(r=t.call(this,e.error.message)||this).data=void 0,r.data=e,r}return l(e,t),e}(c(Error)),oi=function(){function t(t,e){this.subtle=void 0,this.aesIV=void 0,this.subtle=t,this.aesIV=e}return t.prototype.decrypt=function(t,e){return this.subtle.decrypt({name:"AES-CBC",iv:this.aesIV},e,t)},t}(),li=function(){function t(t,e){this.subtle=void 0,this.key=void 0,this.subtle=t,this.key=e}return t.prototype.expandKey=function(){return this.subtle.importKey("raw",this.key,{name:"AES-CBC"},!1,["encrypt","decrypt"])},t}(),ui=function(){function t(){this.rcon=[0,1,2,4,8,16,32,64,128,27,54],this.subMix=[new Uint32Array(256),new Uint32Array(256),new Uint32Array(256),new Uint32Array(256)],this.invSubMix=[new Uint32Array(256),new Uint32Array(256),new Uint32Array(256),new Uint32Array(256)],this.sBox=new Uint32Array(256),this.invSBox=new Uint32Array(256),this.key=new Uint32Array(0),this.ksRows=0,this.keySize=0,this.keySchedule=void 0,this.invKeySchedule=void 0,this.initTable()}var e=t.prototype;return e.uint8ArrayToUint32Array_=function(t){for(var e=new DataView(t),r=new Uint32Array(4),i=0;i<4;i++)r[i]=e.getUint32(4*i);return r},e.initTable=function(){var t=this.sBox,e=this.invSBox,r=this.subMix,i=r[0],n=r[1],a=r[2],s=r[3],o=this.invSubMix,l=o[0],u=o[1],h=o[2],d=o[3],c=new Uint32Array(256),f=0,g=0,v=0;for(v=0;v<256;v++)c[v]=v<128?v<<1:v<<1^283;for(v=0;v<256;v++){var m=g^g<<1^g<<2^g<<3^g<<4;m=m>>>8^255&m^99,t[f]=m,e[m]=f;var p=c[f],y=c[p],E=c[y],T=257*c[m]^16843008*m;i[f]=T<<24|T>>>8,n[f]=T<<16|T>>>16,a[f]=T<<8|T>>>24,s[f]=T,T=16843009*E^65537*y^257*p^16843008*f,l[m]=T<<24|T>>>8,u[m]=T<<16|T>>>16,h[m]=T<<8|T>>>24,d[m]=T,f?(f=p^c[c[c[E^p]]],g^=c[c[g]]):f=g=1}},e.expandKey=function(t){for(var e=this.uint8ArrayToUint32Array_(t),r=!0,i=0;i<e.length&&r;)r=e[i]===this.key[i],i++;if(!r){this.key=e;var n=this.keySize=e.length;if(4!==n&&6!==n&&8!==n)throw new Error("Invalid aes key size="+n);var a,s,o,l,u=this.ksRows=4*(n+6+1),h=this.keySchedule=new Uint32Array(u),d=this.invKeySchedule=new Uint32Array(u),c=this.sBox,f=this.rcon,g=this.invSubMix,v=g[0],m=g[1],p=g[2],y=g[3];for(a=0;a<u;a++)a<n?o=h[a]=e[a]:(l=o,a%n==0?(l=c[(l=l<<8|l>>>24)>>>24]<<24|c[l>>>16&255]<<16|c[l>>>8&255]<<8|c[255&l],l^=f[a/n|0]<<24):n>6&&a%n==4&&(l=c[l>>>24]<<24|c[l>>>16&255]<<16|c[l>>>8&255]<<8|c[255&l]),h[a]=o=(h[a-n]^l)>>>0);for(s=0;s<u;s++)a=u-s,l=3&s?h[a]:h[a-4],d[s]=s<4||a<=4?l:v[c[l>>>24]]^m[c[l>>>16&255]]^p[c[l>>>8&255]]^y[c[255&l]],d[s]=d[s]>>>0}},e.networkToHostOrderSwap=function(t){return t<<24|(65280&t)<<8|(16711680&t)>>8|t>>>24},e.decrypt=function(t,e,r){for(var i,n,a,s,o,l,u,h,d,c,f,g,v,m,p=this.keySize+6,y=this.invKeySchedule,E=this.invSBox,T=this.invSubMix,S=T[0],L=T[1],A=T[2],R=T[3],k=this.uint8ArrayToUint32Array_(r),b=k[0],D=k[1],I=k[2],w=k[3],C=new Int32Array(t),_=new Int32Array(C.length),x=this.networkToHostOrderSwap;e<C.length;){for(d=x(C[e]),c=x(C[e+1]),f=x(C[e+2]),g=x(C[e+3]),o=d^y[0],l=g^y[1],u=f^y[2],h=c^y[3],v=4,m=1;m<p;m++)i=S[o>>>24]^L[l>>16&255]^A[u>>8&255]^R[255&h]^y[v],n=S[l>>>24]^L[u>>16&255]^A[h>>8&255]^R[255&o]^y[v+1],a=S[u>>>24]^L[h>>16&255]^A[o>>8&255]^R[255&l]^y[v+2],s=S[h>>>24]^L[o>>16&255]^A[l>>8&255]^R[255&u]^y[v+3],o=i,l=n,u=a,h=s,v+=4;i=E[o>>>24]<<24^E[l>>16&255]<<16^E[u>>8&255]<<8^E[255&h]^y[v],n=E[l>>>24]<<24^E[u>>16&255]<<16^E[h>>8&255]<<8^E[255&o]^y[v+1],a=E[u>>>24]<<24^E[h>>16&255]<<16^E[o>>8&255]<<8^E[255&l]^y[v+2],s=E[h>>>24]<<24^E[o>>16&255]<<16^E[l>>8&255]<<8^E[255&u]^y[v+3],_[e]=x(i^b),_[e+1]=x(s^D),_[e+2]=x(a^I),_[e+3]=x(n^w),b=d,D=c,I=f,w=g,e+=4}return _.buffer},t}(),hi=function(){function t(t,e){var r=(void 0===e?{}:e).removePKCS7Padding,i=void 0===r||r;if(this.logEnabled=!0,this.removePKCS7Padding=void 0,this.subtle=null,this.softwareDecrypter=null,this.key=null,this.fastAesKey=null,this.remainderData=null,this.currentIV=null,this.currentResult=null,this.useSoftware=void 0,this.useSoftware=t.enableSoftwareAES,this.removePKCS7Padding=i,i)try{var n=self.crypto;n&&(this.subtle=n.subtle||n.webkitSubtle)}catch(t){}null===this.subtle&&(this.useSoftware=!0)}var e=t.prototype;return e.destroy=function(){this.subtle=null,this.softwareDecrypter=null,this.key=null,this.fastAesKey=null,this.remainderData=null,this.currentIV=null,this.currentResult=null},e.isSync=function(){return this.useSoftware},e.flush=function(){var t=this.currentResult,e=this.remainderData;if(!t||e)return this.reset(),null;var r,i,n,a=new Uint8Array(t);return this.reset(),this.removePKCS7Padding?(i=(r=a).byteLength,(n=i&&new DataView(r.buffer).getUint8(i-1))?nt(r,0,i-n):r):a},e.reset=function(){this.currentResult=null,this.currentIV=null,this.remainderData=null,this.softwareDecrypter&&(this.softwareDecrypter=null)},e.decrypt=function(t,e,r){var i=this;return this.useSoftware?new Promise((function(n,a){i.softwareDecrypt(new Uint8Array(t),e,r);var s=i.flush();s?n(s.buffer):a(new Error("[softwareDecrypt] Failed to decrypt data"))})):this.webCryptoDecrypt(new Uint8Array(t),e,r)},e.softwareDecrypt=function(t,e,r){var i=this.currentIV,n=this.currentResult,a=this.remainderData;this.logOnce("JS AES decrypt"),a&&(t=Gt(a,t),this.remainderData=null);var s=this.getValidChunk(t);if(!s.length)return null;i&&(r=i);var o=this.softwareDecrypter;o||(o=this.softwareDecrypter=new ui),o.expandKey(e);var l=n;return this.currentResult=o.decrypt(s.buffer,0,r),this.currentIV=nt(s,-16).buffer,l||null},e.webCryptoDecrypt=function(t,e,r){var i=this,n=this.subtle;return this.key===e&&this.fastAesKey||(this.key=e,this.fastAesKey=new li(n,e)),this.fastAesKey.expandKey().then((function(e){return n?(i.logOnce("WebCrypto AES decrypt"),new oi(n,new Uint8Array(r)).decrypt(t.buffer,e)):Promise.reject(new Error("web crypto not initialized"))})).catch((function(n){return w.warn("[decrypter]: WebCrypto Error, disable WebCrypto API, "+n.name+": "+n.message),i.onWebCryptoError(t,e,r)}))},e.onWebCryptoError=function(t,e,r){this.useSoftware=!0,this.logEnabled=!0,this.softwareDecrypt(t,e,r);var i=this.flush();if(i)return i.buffer;throw new Error("WebCrypto and softwareDecrypt: failed to decrypt data")},e.getValidChunk=function(t){var e=t,r=t.length-t.length%16;return r!==t.length&&(e=nt(t,0,r),this.remainderData=nt(t,r)),e},e.logOnce=function(t){this.logEnabled&&(w.log("[decrypter]: "+t),this.logEnabled=!1)},t}(),di=function(t){for(var e="",r=t.length,i=0;i<r;i++)e+="["+t.start(i).toFixed(3)+"-"+t.end(i).toFixed(3)+"]";return e},ci="STOPPED",fi="IDLE",gi="KEY_LOADING",vi="FRAG_LOADING",mi="FRAG_LOADING_WAITING_RETRY",pi="WAITING_TRACK",yi="PARSING",Ei="PARSED",Ti="ENDED",Si="ERROR",Li="WAITING_INIT_PTS",Ai="WAITING_LEVEL",Ri=function(t){function e(e,r,i,n,a){var s;return(s=t.call(this)||this).hls=void 0,s.fragPrevious=null,s.fragCurrent=null,s.fragmentTracker=void 0,s.transmuxer=null,s._state=ci,s.playlistType=void 0,s.media=null,s.mediaBuffer=null,s.config=void 0,s.bitrateTest=!1,s.lastCurrentTime=0,s.nextLoadPosition=0,s.startPosition=0,s.startTimeOffset=null,s.loadedmetadata=!1,s.retryDate=0,s.levels=null,s.fragmentLoader=void 0,s.keyLoader=void 0,s.levelLastLoaded=null,s.startFragRequested=!1,s.decrypter=void 0,s.initPTS=[],s.onvseeking=null,s.onvended=null,s.logPrefix="",s.log=void 0,s.warn=void 0,s.playlistType=a,s.logPrefix=n,s.log=w.log.bind(w,n+":"),s.warn=w.warn.bind(w,n+":"),s.hls=e,s.fragmentLoader=new ii(e.config),s.keyLoader=i,s.fragmentTracker=r,s.config=e.config,s.decrypter=new hi(e.config),e.on(S.MANIFEST_LOADED,s.onManifestLoaded,function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(s)),s}l(e,t);var r=e.prototype;return r.doTick=function(){this.onTickEnd()},r.onTickEnd=function(){},r.startLoad=function(t){},r.stopLoad=function(){this.fragmentLoader.abort(),this.keyLoader.abort(this.playlistType);var t=this.fragCurrent;null!=t&&t.loader&&(t.abortRequests(),this.fragmentTracker.removeFragment(t)),this.resetTransmuxer(),this.fragCurrent=null,this.fragPrevious=null,this.clearInterval(),this.clearNextTick(),this.state=ci},r._streamEnded=function(t,e){if(e.live||t.nextStart||!t.end||!this.media)return!1;var r=e.partList;if(null!=r&&r.length){var i=r[r.length-1];return zr.isBuffered(this.media,i.start+i.duration/2)}var n=e.fragments[e.fragments.length-1].type;return this.fragmentTracker.isEndListAppended(n)},r.getLevelDetails=function(){var t;if(this.levels&&null!==this.levelLastLoaded)return null==(t=this.levelLastLoaded)?void 0:t.details},r.onMediaAttached=function(t,e){var r=this.media=this.mediaBuffer=e.media;this.onvseeking=this.onMediaSeeking.bind(this),this.onvended=this.onMediaEnded.bind(this),r.addEventListener("seeking",this.onvseeking),r.addEventListener("ended",this.onvended);var i=this.config;this.levels&&i.autoStartLoad&&this.state===ci&&this.startLoad(i.startPosition)},r.onMediaDetaching=function(){var t=this.media;null!=t&&t.ended&&(this.log("MSE detaching and video ended, reset startPosition"),this.startPosition=this.lastCurrentTime=0),t&&this.onvseeking&&this.onvended&&(t.removeEventListener("seeking",this.onvseeking),t.removeEventListener("ended",this.onvended),this.onvseeking=this.onvended=null),this.keyLoader&&this.keyLoader.detach(),this.media=this.mediaBuffer=null,this.loadedmetadata=!1,this.fragmentTracker.removeAllFragments(),this.stopLoad()},r.onMediaSeeking=function(){var t=this.config,e=this.fragCurrent,r=this.media,i=this.mediaBuffer,n=this.state,a=r?r.currentTime:0,s=zr.bufferInfo(i||r,a,t.maxBufferHole);if(this.log("media seeking to "+(y(a)?a.toFixed(3):a)+", state: "+n),this.state===Ti)this.resetLoadingState();else if(e){var o=t.maxFragLookUpTolerance,l=e.start-o,u=e.start+e.duration+o;if(!s.len||u<s.start||l>s.end){var h=a>u;(a<l||h)&&(h&&e.loader&&(this.log("seeking outside of buffer while fragment load in progress, cancel fragment load"),e.abortRequests(),this.resetLoadingState()),this.fragPrevious=null)}}r&&(this.fragmentTracker.removeFragmentsInRange(a,1/0,this.playlistType,!0),this.lastCurrentTime=a),this.loadedmetadata||s.len||(this.nextLoadPosition=this.startPosition=a),this.tickImmediate()},r.onMediaEnded=function(){this.startPosition=this.lastCurrentTime=0},r.onManifestLoaded=function(t,e){this.startTimeOffset=e.startTimeOffset,this.initPTS=[]},r.onHandlerDestroying=function(){this.hls.off(S.MANIFEST_LOADED,this.onManifestLoaded,this),this.stopLoad(),t.prototype.onHandlerDestroying.call(this),this.hls=null},r.onHandlerDestroyed=function(){this.state=ci,this.fragmentLoader&&this.fragmentLoader.destroy(),this.keyLoader&&this.keyLoader.destroy(),this.decrypter&&this.decrypter.destroy(),this.hls=this.log=this.warn=this.decrypter=this.keyLoader=this.fragmentLoader=this.fragmentTracker=null,t.prototype.onHandlerDestroyed.call(this)},r.loadFragment=function(t,e,r){this._loadFragForPlayback(t,e,r)},r._loadFragForPlayback=function(t,e,r){var i=this;this._doFragLoad(t,e,r,(function(e){if(i.fragContextChanged(t))return i.warn("Fragment "+t.sn+(e.part?" p: "+e.part.index:"")+" of level "+t.level+" was dropped during download."),void i.fragmentTracker.removeFragment(t);t.stats.chunkCount++,i._handleFragmentLoadProgress(e)})).then((function(e){if(e){var r=i.state;i.fragContextChanged(t)?(r===vi||!i.fragCurrent&&r===yi)&&(i.fragmentTracker.removeFragment(t),i.state=fi):("payload"in e&&(i.log("Loaded fragment "+t.sn+" of level "+t.level),i.hls.trigger(S.FRAG_LOADED,e)),i._handleFragmentLoadComplete(e))}})).catch((function(e){i.state!==ci&&i.state!==Si&&(i.warn(e),i.resetFragmentLoading(t))}))},r.clearTrackerIfNeeded=function(t){var e,r=this.fragmentTracker;if(r.getState(t)===Hr){var i=t.type,n=this.getFwdBufferInfo(this.mediaBuffer,i),a=Math.max(t.duration,n?n.len:this.config.maxBufferLength);this.reduceMaxBufferLength(a)&&r.removeFragment(t)}else 0===(null==(e=this.mediaBuffer)?void 0:e.buffered.length)?r.removeAllFragments():r.hasParts(t.type)&&(r.detectPartialFragments({frag:t,part:null,stats:t.stats,id:t.type}),r.getState(t)===Vr&&r.removeFragment(t))},r.checkLiveUpdate=function(t){if(t.updated&&!t.live){var e=t.fragments[t.fragments.length-1];this.fragmentTracker.detectPartialFragments({frag:e,part:null,stats:e.stats,id:e.type})}t.fragments[0]||(t.deltaUpdateFailed=!0)},r.flushMainBuffer=function(t,e,r){if(void 0===r&&(r=null),t-e){var i={startOffset:t,endOffset:e,type:r};this.hls.trigger(S.BUFFER_FLUSHING,i)}},r._loadInitSegment=function(t,e){var r=this;this._doFragLoad(t,e).then((function(e){if(!e||r.fragContextChanged(t)||!r.levels)throw new Error("init load aborted");return e})).then((function(e){var i=r.hls,n=e.payload,a=t.decryptdata;if(n&&n.byteLength>0&&null!=a&&a.key&&a.iv&&"AES-128"===a.method){var s=self.performance.now();return r.decrypter.decrypt(new Uint8Array(n),a.key.buffer,a.iv.buffer).catch((function(e){throw i.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_DECRYPT_ERROR,fatal:!1,error:e,reason:e.message,frag:t}),e})).then((function(n){var a=self.performance.now();return i.trigger(S.FRAG_DECRYPTED,{frag:t,payload:n,stats:{tstart:s,tdecrypt:a}}),e.payload=n,r.completeInitSegmentLoad(e)}))}return r.completeInitSegmentLoad(e)})).catch((function(e){r.state!==ci&&r.state!==Si&&(r.warn(e),r.resetFragmentLoading(t))}))},r.completeInitSegmentLoad=function(t){if(!this.levels)throw new Error("init load aborted, missing levels");var e=t.frag.stats;this.state=fi,t.frag.data=new Uint8Array(t.payload),e.parsing.start=e.buffering.start=self.performance.now(),e.parsing.end=e.buffering.end=self.performance.now(),this.tick()},r.fragContextChanged=function(t){var e=this.fragCurrent;return!t||!e||t.sn!==e.sn||t.level!==e.level},r.fragBufferedComplete=function(t,e){var r,i,n,a,s=this.mediaBuffer?this.mediaBuffer:this.media;if(this.log("Buffered "+t.type+" sn: "+t.sn+(e?" part: "+e.index:"")+" of "+(this.playlistType===Ie?"level":"track")+" "+t.level+" (frag:["+(null!=(r=t.startPTS)?r:NaN).toFixed(3)+"-"+(null!=(i=t.endPTS)?i:NaN).toFixed(3)+"] > buffer:"+(s?di(zr.getBuffered(s)):"(detached)")+")"),"initSegment"!==t.sn){var o;if(t.type!==Ce){var l=t.elementaryStreams;if(!Object.keys(l).some((function(t){return!!l[t]})))return void(this.state=fi)}var u=null==(o=this.levels)?void 0:o[t.level];null!=u&&u.fragmentError&&(this.log("Resetting level fragment error count of "+u.fragmentError+" on frag buffered"),u.fragmentError=0)}this.state=fi,s&&(!this.loadedmetadata&&t.type==Ie&&s.buffered.length&&(null==(n=this.fragCurrent)?void 0:n.sn)===(null==(a=this.fragPrevious)?void 0:a.sn)&&(this.loadedmetadata=!0,this.seekToStartPos()),this.tick())},r.seekToStartPos=function(){},r._handleFragmentLoadComplete=function(t){var e=this.transmuxer;if(e){var r=t.frag,i=t.part,n=t.partsLoaded,a=!n||0===n.length||n.some((function(t){return!t})),s=new Qr(r.level,r.sn,r.stats.chunkCount+1,0,i?i.index:-1,!a);e.flush(s)}},r._handleFragmentLoadProgress=function(t){},r._doFragLoad=function(t,e,r,i){var n,a=this;void 0===r&&(r=null);var s=null==e?void 0:e.details;if(!this.levels||!s)throw new Error("frag load aborted, missing level"+(s?"":" detail")+"s");var o=null;if(!t.encrypted||null!=(n=t.decryptdata)&&n.key?!t.encrypted&&s.encryptedFragments.length&&this.keyLoader.loadClear(t,s.encryptedFragments):(this.log("Loading key for "+t.sn+" of ["+s.startSN+"-"+s.endSN+"], "+("[stream-controller]"===this.logPrefix?"level":"track")+" "+t.level),this.state=gi,this.fragCurrent=t,o=this.keyLoader.load(t).then((function(t){if(!a.fragContextChanged(t.frag))return a.hls.trigger(S.KEY_LOADED,t),a.state===gi&&(a.state=fi),t})),this.hls.trigger(S.KEY_LOADING,{frag:t}),null===this.fragCurrent&&(o=Promise.reject(new Error("frag load aborted, context changed in KEY_LOADING")))),r=Math.max(t.start,r||0),this.config.lowLatencyMode&&"initSegment"!==t.sn){var l=s.partList;if(l&&i){r>t.end&&s.fragmentHint&&(t=s.fragmentHint);var u=this.getNextPart(l,t,r);if(u>-1){var h,d=l[u];return this.log("Loading part sn: "+t.sn+" p: "+d.index+" cc: "+t.cc+" of playlist ["+s.startSN+"-"+s.endSN+"] parts [0-"+u+"-"+(l.length-1)+"] "+("[stream-controller]"===this.logPrefix?"level":"track")+": "+t.level+", target: "+parseFloat(r.toFixed(3))),this.nextLoadPosition=d.start+d.duration,this.state=vi,h=o?o.then((function(r){return!r||a.fragContextChanged(r.frag)?null:a.doFragPartsLoad(t,d,e,i)})).catch((function(t){return a.handleFragLoadError(t)})):this.doFragPartsLoad(t,d,e,i).catch((function(t){return a.handleFragLoadError(t)})),this.hls.trigger(S.FRAG_LOADING,{frag:t,part:d,targetBufferTime:r}),null===this.fragCurrent?Promise.reject(new Error("frag load aborted, context changed in FRAG_LOADING parts")):h}if(!t.url||this.loadedEndOfParts(l,r))return Promise.resolve(null)}}this.log("Loading fragment "+t.sn+" cc: "+t.cc+" "+(s?"of ["+s.startSN+"-"+s.endSN+"] ":"")+("[stream-controller]"===this.logPrefix?"level":"track")+": "+t.level+", target: "+parseFloat(r.toFixed(3))),y(t.sn)&&!this.bitrateTest&&(this.nextLoadPosition=t.start+t.duration),this.state=vi;var c,f=this.config.progressive;return c=f&&o?o.then((function(e){return!e||a.fragContextChanged(null==e?void 0:e.frag)?null:a.fragmentLoader.load(t,i)})).catch((function(t){return a.handleFragLoadError(t)})):Promise.all([this.fragmentLoader.load(t,f?i:void 0),o]).then((function(t){var e=t[0];return!f&&e&&i&&i(e),e})).catch((function(t){return a.handleFragLoadError(t)})),this.hls.trigger(S.FRAG_LOADING,{frag:t,targetBufferTime:r}),null===this.fragCurrent?Promise.reject(new Error("frag load aborted, context changed in FRAG_LOADING")):c},r.doFragPartsLoad=function(t,e,r,i){var n=this;return new Promise((function(a,s){var o,l=[],u=null==(o=r.details)?void 0:o.partList;!function e(o){n.fragmentLoader.loadPart(t,o,i).then((function(i){l[o.index]=i;var s=i.part;n.hls.trigger(S.FRAG_LOADED,i);var h=or(r,t.sn,o.index+1)||lr(u,t.sn,o.index+1);if(!h)return a({frag:t,part:s,partsLoaded:l});e(h)})).catch(s)}(e)}))},r.handleFragLoadError=function(t){if("data"in t){var e=t.data;t.data&&e.details===A.INTERNAL_ABORTED?this.handleFragLoadAborted(e.frag,e.part):this.hls.trigger(S.ERROR,e)}else this.hls.trigger(S.ERROR,{type:L.OTHER_ERROR,details:A.INTERNAL_EXCEPTION,err:t,error:t,fatal:!0});return null},r._handleTransmuxerFlush=function(t){var e=this.getCurrentContext(t);if(e&&this.state===yi){var r=e.frag,i=e.part,n=e.level,a=self.performance.now();r.stats.parsing.end=a,i&&(i.stats.parsing.end=a),this.updateLevelTiming(r,i,n,t.partial)}else this.fragCurrent||this.state===ci||this.state===Si||(this.state=fi)},r.getCurrentContext=function(t){var e=this.levels,r=this.fragCurrent,i=t.level,n=t.sn,a=t.part;if(null==e||!e[i])return this.warn("Levels object was unset while buffering fragment "+n+" of level "+i+". The current chunk will not be buffered."),null;var s=e[i],o=a>-1?or(s,n,a):null,l=o?o.fragment:function(t,e,r){if(null==t||!t.details)return null;var i=t.details,n=i.fragments[e-i.startSN];return n||((n=i.fragmentHint)&&n.sn===e?n:e<i.startSN&&r&&r.sn===e?r:null)}(s,n,r);return l?(r&&r!==l&&(l.stats=r.stats),{frag:l,part:o,level:s}):null},r.bufferFragmentData=function(t,e,r,i,n){var a;if(t&&this.state===yi){var s=t.data1,o=t.data2,l=s;if(s&&o&&(l=Gt(s,o)),null!=(a=l)&&a.length){var u={type:t.type,frag:e,part:r,chunkMeta:i,parent:e.type,data:l};if(this.hls.trigger(S.BUFFER_APPENDING,u),t.dropped&&t.independent&&!r){if(n)return;this.flushBufferGap(e)}}}},r.flushBufferGap=function(t){var e=this.media;if(e)if(zr.isBuffered(e,e.currentTime)){var r=e.currentTime,i=zr.bufferInfo(e,r,0),n=t.duration,a=Math.min(2*this.config.maxFragLookUpTolerance,.25*n),s=Math.max(Math.min(t.start-a,i.end-a),r+a);t.start-s>a&&this.flushMainBuffer(s,t.start)}else this.flushMainBuffer(0,t.start)},r.getFwdBufferInfo=function(t,e){var r=this.getLoadPosition();return y(r)?this.getFwdBufferInfoAtPos(t,r,e):null},r.getFwdBufferInfoAtPos=function(t,e,r){var i=this.config.maxBufferHole,n=zr.bufferInfo(t,e,i);if(0===n.len&&void 0!==n.nextStart){var a=this.fragmentTracker.getBufferedFrag(e,r);if(a&&n.nextStart<a.end)return zr.bufferInfo(t,e,Math.max(n.nextStart,i))}return n},r.getMaxBufferLength=function(t){var e,r=this.config;return e=t?Math.max(8*r.maxBufferSize/t,r.maxBufferLength):r.maxBufferLength,Math.min(e,r.maxMaxBufferLength)},r.reduceMaxBufferLength=function(t){var e=this.config,r=t||e.maxBufferLength;return e.maxMaxBufferLength>=r&&(e.maxMaxBufferLength/=2,this.warn("Reduce max buffer length to "+e.maxMaxBufferLength+"s"),!0)},r.getAppendedFrag=function(t,e){var r=this.fragmentTracker.getAppendedFrag(t,Ie);return r&&"fragment"in r?r.fragment:r},r.getNextFragment=function(t,e){var r=e.fragments,i=r.length;if(!i)return null;var n,a=this.config,s=r[0].start;if(e.live){var o=a.initialLiveManifestSize;if(i<o)return this.warn("Not enough fragments to start playback (have: "+i+", need: "+o+")"),null;(!e.PTSKnown&&!this.startFragRequested&&-1===this.startPosition||t<s)&&(n=this.getInitialLiveFragment(e,r),this.startPosition=this.nextLoadPosition=n?this.hls.liveSyncPosition||n.start:t)}else t<=s&&(n=r[0]);if(!n){var l=a.lowLatencyMode?e.partEnd:e.fragmentEnd;n=this.getFragmentAtPosition(t,l,e)}return this.mapToInitFragWhenRequired(n)},r.isLoopLoading=function(t,e){var r=this.fragmentTracker.getState(t);return(r===Yr||r===Vr&&!!t.gap)&&this.nextLoadPosition>e},r.getNextFragmentLoopLoading=function(t,e,r,i,n){var a=t.gap,s=this.getNextFragment(this.nextLoadPosition,e);if(null===s)return s;if(t=s,a&&t&&!t.gap&&r.nextStart){var o=this.getFwdBufferInfoAtPos(this.mediaBuffer?this.mediaBuffer:this.media,r.nextStart,i);if(null!==o&&r.len+o.len>=n)return this.log('buffer full after gaps in "'+i+'" playlist starting at sn: '+t.sn),null}return t},r.mapToInitFragWhenRequired=function(t){return null==t||!t.initSegment||null!=t&&t.initSegment.data||this.bitrateTest?t:t.initSegment},r.getNextPart=function(t,e,r){for(var i=-1,n=!1,a=!0,s=0,o=t.length;s<o;s++){var l=t[s];if(a=a&&!l.independent,i>-1&&r<l.start)break;var u=l.loaded;u?i=-1:(n||l.independent||a)&&l.fragment===e&&(i=s),n=u}return i},r.loadedEndOfParts=function(t,e){var r=t[t.length-1];return r&&e>r.start&&r.loaded},r.getInitialLiveFragment=function(t,e){var r=this.fragPrevious,i=null;if(r){if(t.hasProgramDateTime&&(this.log("Live playlist, switching playlist, load frag with same PDT: "+r.programDateTime),i=function(t,e,r){if(null===e||!Array.isArray(t)||!t.length||!y(e))return null;if(e<(t[0].programDateTime||0))return null;if(e>=(t[t.length-1].endProgramDateTime||0))return null;r=r||0;for(var i=0;i<t.length;++i){var n=t[i];if(yr(e,r,n))return n}return null}(e,r.endProgramDateTime,this.config.maxFragLookUpTolerance)),!i){var n=r.sn+1;if(n>=t.startSN&&n<=t.endSN){var a=e[n-t.startSN];r.cc===a.cc&&(i=a,this.log("Live playlist, switching playlist, load frag with next SN: "+i.sn))}i||(i=function(t,e){return vr(t,(function(t){return t.cc<e?1:t.cc>e?-1:0}))}(e,r.cc),i&&this.log("Live playlist, switching playlist, load frag with same CC: "+i.sn))}}else{var s=this.hls.liveSyncPosition;null!==s&&(i=this.getFragmentAtPosition(s,this.bitrateTest?t.fragmentEnd:t.edge,t))}return i},r.getFragmentAtPosition=function(t,e,r){var i,n=this.config,a=this.fragPrevious,s=r.fragments,o=r.endSN,l=r.fragmentHint,u=n.maxFragLookUpTolerance,h=r.partList,d=!!(n.lowLatencyMode&&null!=h&&h.length&&l);if(d&&l&&!this.bitrateTest&&(s=s.concat(l),o=l.sn),i=t<e?mr(a,s,t,t>e-u?0:u):s[s.length-1]){var c=i.sn-r.startSN,f=this.fragmentTracker.getState(i);if((f===Yr||f===Vr&&i.gap)&&(a=i),a&&i.sn===a.sn&&(!d||h[0].fragment.sn>i.sn)&&a&&i.level===a.level){var g=s[c+1];i=i.sn<o&&this.fragmentTracker.getState(g)!==Yr?g:null}}return i},r.synchronizeToLiveEdge=function(t){var e=this.config,r=this.media;if(r){var i=this.hls.liveSyncPosition,n=r.currentTime,a=t.fragments[0].start,s=t.edge,o=n>=a-e.maxFragLookUpTolerance&&n<=s;if(null!==i&&r.duration>i&&(n<i||!o)){var l=void 0!==e.liveMaxLatencyDuration?e.liveMaxLatencyDuration:e.liveMaxLatencyDurationCount*t.targetduration;(!o&&r.readyState<4||n<s-l)&&(this.loadedmetadata||(this.nextLoadPosition=i),r.readyState&&(this.warn("Playback: "+n.toFixed(3)+" is located too far from the end of live sliding playlist: "+s+", reset currentTime to : "+i.toFixed(3)),r.currentTime=i))}}},r.alignPlaylists=function(t,e,r){var i=t.fragments.length;if(!i)return this.warn("No fragments in live playlist"),0;var n=t.fragments[0].start,a=!e,s=t.alignedSliding&&y(n);if(a||!s&&!n){var o=this.fragPrevious;ti(o,r,t);var l=t.fragments[0].start;return this.log("Live playlist sliding: "+l.toFixed(2)+" start-sn: "+(e?e.startSN:"na")+"->"+t.startSN+" prev-sn: "+(o?o.sn:"na")+" fragments: "+i),l}return n},r.waitForCdnTuneIn=function(t){return t.live&&t.canBlockReload&&t.partTarget&&t.tuneInGoal>Math.max(t.partHoldBack,3*t.partTarget)},r.setStartPosition=function(t,e){var r=this.startPosition;if(r<e&&(r=-1),-1===r||-1===this.lastCurrentTime){var i=null!==this.startTimeOffset,n=i?this.startTimeOffset:t.startTimeOffset;null!==n&&y(n)?(r=e+n,n<0&&(r+=t.totalduration),r=Math.min(Math.max(e,r),e+t.totalduration),this.log("Start time offset "+n+" found in "+(i?"multivariant":"media")+" playlist, adjust startPosition to "+r),this.startPosition=r):t.live?r=this.hls.liveSyncPosition||e:this.startPosition=r=0,this.lastCurrentTime=r}this.nextLoadPosition=r},r.getLoadPosition=function(){var t=this.media,e=0;return this.loadedmetadata&&t?e=t.currentTime:this.nextLoadPosition&&(e=this.nextLoadPosition),e},r.handleFragLoadAborted=function(t,e){this.transmuxer&&"initSegment"!==t.sn&&t.stats.aborted&&(this.warn("Fragment "+t.sn+(e?" part "+e.index:"")+" of level "+t.level+" was aborted"),this.resetFragmentLoading(t))},r.resetFragmentLoading=function(t){this.fragCurrent&&(this.fragContextChanged(t)||this.state===mi)||(this.state=fi)},r.onFragmentOrKeyLoadError=function(t,e){if(e.chunkMeta&&!e.frag){var r=this.getCurrentContext(e.chunkMeta);r&&(e.frag=r.frag)}var i=e.frag;if(i&&i.type===t&&this.levels)if(this.fragContextChanged(i)){var n;this.warn("Frag load error must match current frag to retry "+i.url+" > "+(null==(n=this.fragCurrent)?void 0:n.url))}else{var a=e.details===A.FRAG_GAP;a&&this.fragmentTracker.fragBuffered(i,!0);var s=e.errorAction,o=s||{},l=o.action,u=o.retryCount,h=void 0===u?0:u,d=o.retryConfig;if(s&&l===Lr&&d){this.resetStartWhenNotLoaded(this.levelLastLoaded);var c=cr(d,h);this.warn("Fragment "+i.sn+" of "+t+" "+i.level+" errored with "+e.details+", retrying loading "+(h+1)+"/"+d.maxNumRetry+" in "+c+"ms"),s.resolved=!0,this.retryDate=self.performance.now()+c,this.state=mi}else if(d&&s){if(this.resetFragmentErrors(t),!(h<d.maxNumRetry))return void w.warn(e.details+" reached or exceeded max retry ("+h+")");a||l===Sr||(s.resolved=!0)}else(null==s?void 0:s.action)===Tr?this.state=Ai:this.state=Si;this.tickImmediate()}},r.reduceLengthAndFlushBuffer=function(t){if(this.state===yi||this.state===Ei){var e=t.parent,r=this.getFwdBufferInfo(this.mediaBuffer,e),i=r&&r.len>.5;i&&this.reduceMaxBufferLength(r.len);var n=!i;return n&&this.warn("Buffer full error while media.currentTime is not buffered, flush "+e+" buffer"),t.frag&&(this.fragmentTracker.removeFragment(t.frag),this.nextLoadPosition=t.frag.start),this.resetLoadingState(),n}return!1},r.resetFragmentErrors=function(t){t===we&&(this.fragCurrent=null),this.loadedmetadata||(this.startFragRequested=!1),this.state!==ci&&(this.state=fi)},r.afterBufferFlushed=function(t,e,r){if(t){var i=zr.getBuffered(t);this.fragmentTracker.detectEvictedFragments(e,i,r),this.state===Ti&&this.resetLoadingState()}},r.resetLoadingState=function(){this.log("Reset loading state"),this.fragCurrent=null,this.fragPrevious=null,this.state=fi},r.resetStartWhenNotLoaded=function(t){if(!this.loadedmetadata){this.startFragRequested=!1;var e=t?t.details:null;null!=e&&e.live?(this.startPosition=-1,this.setStartPosition(e,0),this.resetLoadingState()):this.nextLoadPosition=this.startPosition}},r.resetWhenMissingContext=function(t){this.warn("The loading context changed while buffering fragment "+t.sn+" of level "+t.level+". This chunk will not be buffered."),this.removeUnbufferedFrags(),this.resetStartWhenNotLoaded(this.levelLastLoaded),this.resetLoadingState()},r.removeUnbufferedFrags=function(t){void 0===t&&(t=0),this.fragmentTracker.removeFragmentsInRange(t,1/0,this.playlistType,!1,!0)},r.updateLevelTiming=function(t,e,r,i){var n,a=this,s=r.details;if(s){if(!Object.keys(t.elementaryStreams).reduce((function(e,n){var o=t.elementaryStreams[n];if(o){var l=o.endPTS-o.startPTS;if(l<=0)return a.warn("Could not parse fragment "+t.sn+" "+n+" duration reliably ("+l+")"),e||!1;var u=i?0:ir(s,t,o.startPTS,o.endPTS,o.startDTS,o.endDTS);return a.hls.trigger(S.LEVEL_PTS_UPDATED,{details:s,level:r,drift:u,type:n,frag:t,start:o.startPTS,end:o.endPTS}),!0}return e}),!1)&&null===(null==(n=this.transmuxer)?void 0:n.error)){var o=new Error("Found no media in fragment "+t.sn+" of level "+t.level+" resetting transmuxer to fallback to playlist timing");if(0===r.fragmentError&&(r.fragmentError++,t.gap=!0,this.fragmentTracker.removeFragment(t),this.fragmentTracker.fragBuffered(t,!0)),this.warn(o.message),this.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,fatal:!1,error:o,frag:t,reason:"Found no media in msn "+t.sn+' of level "'+r.url+'"'}),!this.hls)return;this.resetTransmuxer()}this.state=Ei,this.hls.trigger(S.FRAG_PARSED,{frag:t,part:e})}else this.warn("level.details undefined")},r.resetTransmuxer=function(){this.transmuxer&&(this.transmuxer.destroy(),this.transmuxer=null)},r.recoverWorkerError=function(t){"demuxerWorker"===t.event&&(this.fragmentTracker.removeAllFragments(),this.resetTransmuxer(),this.resetStartWhenNotLoaded(this.levelLastLoaded),this.resetLoadingState())},s(e,[{key:"state",get:function(){return this._state},set:function(t){var e=this._state;e!==t&&(this._state=t,this.log(e+"->"+t))}}]),e}(Gr),ki=function(){function t(){this.chunks=[],this.dataLength=0}var e=t.prototype;return e.push=function(t){this.chunks.push(t),this.dataLength+=t.length},e.flush=function(){var t,e=this.chunks,r=this.dataLength;return e.length?(t=1===e.length?e[0]:function(t,e){for(var r=new Uint8Array(e),i=0,n=0;n<t.length;n++){var a=t[n];r.set(a,i),i+=a.length}return r}(e,r),this.reset(),t):new Uint8Array(0)},e.reset=function(){this.chunks.length=0,this.dataLength=0},t}();function bi(t,e){return void 0===t&&(t=""),void 0===e&&(e=9e4),{type:t,id:-1,pid:-1,inputTimeScale:e,sequenceNumber:-1,samples:[],dropped:0}}var Di=function(){function t(){this._audioTrack=void 0,this._id3Track=void 0,this.frameIndex=0,this.cachedData=null,this.basePTS=null,this.initPTS=null,this.lastPTS=null}var e=t.prototype;return e.resetInitSegment=function(t,e,r,i){this._id3Track={type:"id3",id:3,pid:-1,inputTimeScale:9e4,sequenceNumber:0,samples:[],dropped:0}},e.resetTimeStamp=function(t){this.initPTS=t,this.resetContiguity()},e.resetContiguity=function(){this.basePTS=null,this.lastPTS=null,this.frameIndex=0},e.canParse=function(t,e){return!1},e.appendFrame=function(t,e,r){},e.demux=function(t,e){this.cachedData&&(t=Gt(this.cachedData,t),this.cachedData=null);var r,i=lt(t,0),n=i?i.length:0,a=this._audioTrack,s=this._id3Track,o=i?dt(i):void 0,l=t.length;for((null===this.basePTS||0===this.frameIndex&&y(o))&&(this.basePTS=Ii(o,e,this.initPTS),this.lastPTS=this.basePTS),null===this.lastPTS&&(this.lastPTS=this.basePTS),i&&i.length>0&&s.samples.push({pts:this.lastPTS,dts:this.lastPTS,data:i,type:Be,duration:Number.POSITIVE_INFINITY});n<l;){if(this.canParse(t,n)){var u=this.appendFrame(a,t,n);u?(this.frameIndex++,this.lastPTS=u.sample.pts,r=n+=u.length):n=l}else ht(t,n)?(i=lt(t,n),s.samples.push({pts:this.lastPTS,dts:this.lastPTS,data:i,type:Be,duration:Number.POSITIVE_INFINITY}),r=n+=i.length):n++;if(n===l&&r!==l){var h=nt(t,r);this.cachedData?this.cachedData=Gt(this.cachedData,h):this.cachedData=h}}return{audioTrack:a,videoTrack:bi(),id3Track:s,textTrack:bi()}},e.demuxSampleAes=function(t,e,r){return Promise.reject(new Error("["+this+"] This demuxer does not support Sample-AES decryption"))},e.flush=function(t){var e=this.cachedData;return e&&(this.cachedData=null,this.demux(e,0)),{audioTrack:this._audioTrack,videoTrack:bi(),id3Track:this._id3Track,textTrack:bi()}},e.destroy=function(){},t}(),Ii=function(t,e,r){return y(t)?90*t:9e4*e+(r?9e4*r.baseTime/r.timescale:0)};function wi(t,e){return 255===t[e]&&240==(246&t[e+1])}function Ci(t,e){return 1&t[e+1]?7:9}function _i(t,e){return(3&t[e+3])<<11|t[e+4]<<3|(224&t[e+5])>>>5}function xi(t,e){return e+1<t.length&&wi(t,e)}function Pi(t,e){if(xi(t,e)){var r=Ci(t,e);if(e+r>=t.length)return!1;var i=_i(t,e);if(i<=r)return!1;var n=e+i;return n===t.length||xi(t,n)}return!1}function Fi(t,e,r,i,n){if(!t.samplerate){var a=function(t,e,r,i){var n,a,s,o,l=navigator.userAgent.toLowerCase(),u=i,h=[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350];n=1+((192&e[r+2])>>>6);var d=(60&e[r+2])>>>2;if(!(d>h.length-1))return s=(1&e[r+2])<<2,s|=(192&e[r+3])>>>6,w.log("manifest codec:"+i+", ADTS type:"+n+", samplingIndex:"+d),/firefox/i.test(l)?d>=6?(n=5,o=new Array(4),a=d-3):(n=2,o=new Array(2),a=d):-1!==l.indexOf("android")?(n=2,o=new Array(2),a=d):(n=5,o=new Array(4),i&&(-1!==i.indexOf("mp4a.40.29")||-1!==i.indexOf("mp4a.40.5"))||!i&&d>=6?a=d-3:((i&&-1!==i.indexOf("mp4a.40.2")&&(d>=6&&1===s||/vivaldi/i.test(l))||!i&&1===s)&&(n=2,o=new Array(2)),a=d)),o[0]=n<<3,o[0]|=(14&d)>>1,o[1]|=(1&d)<<7,o[1]|=s<<3,5===n&&(o[1]|=(14&a)>>1,o[2]=(1&a)<<7,o[2]|=8,o[3]=0),{config:o,samplerate:h[d],channelCount:s,codec:"mp4a.40."+n,manifestCodec:u};var c=new Error("invalid ADTS sampling index:"+d);t.emit(S.ERROR,S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,fatal:!0,error:c,reason:c.message})}(e,r,i,n);if(!a)return;t.config=a.config,t.samplerate=a.samplerate,t.channelCount=a.channelCount,t.codec=a.codec,t.manifestCodec=a.manifestCodec,w.log("parsed codec:"+t.codec+", rate:"+a.samplerate+", channels:"+a.channelCount)}}function Mi(t){return 9216e4/t}function Oi(t,e,r,i,n){var a,s=i+n*Mi(t.samplerate),o=function(t,e){var r=Ci(t,e);if(e+r<=t.length){var i=_i(t,e)-r;if(i>0)return{headerLength:r,frameLength:i}}}(e,r);if(o){var l=o.frameLength,u=o.headerLength,h=u+l,d=Math.max(0,r+h-e.length);d?(a=new Uint8Array(h-u)).set(e.subarray(r+u,e.length),0):a=e.subarray(r+u,r+h);var c={unit:a,pts:s};return d||t.samples.push(c),{sample:c,length:h,missing:d}}var f=e.length-r;return(a=new Uint8Array(f)).set(e.subarray(r,e.length),0),{sample:{unit:a,pts:s},length:f,missing:-1}}var Ni=null,Ui=[32,64,96,128,160,192,224,256,288,320,352,384,416,448,32,48,56,64,80,96,112,128,160,192,224,256,320,384,32,40,48,56,64,80,96,112,128,160,192,224,256,320,32,48,56,64,80,96,112,128,144,160,176,192,224,256,8,16,24,32,40,48,56,64,80,96,112,128,144,160],Bi=[44100,48e3,32e3,22050,24e3,16e3,11025,12e3,8e3],Gi=[[0,72,144,12],[0,0,0,0],[0,72,144,12],[0,144,144,12]],Ki=[0,1,1,4];function Hi(t,e,r,i,n){if(!(r+24>e.length)){var a=Vi(e,r);if(a&&r+a.frameLength<=e.length){var s=i+n*(9e4*a.samplesPerFrame/a.sampleRate),o={unit:e.subarray(r,r+a.frameLength),pts:s,dts:s};return t.config=[],t.channelCount=a.channelCount,t.samplerate=a.sampleRate,t.samples.push(o),{sample:o,length:a.frameLength,missing:0}}}}function Vi(t,e){var r=t[e+1]>>3&3,i=t[e+1]>>1&3,n=t[e+2]>>4&15,a=t[e+2]>>2&3;if(1!==r&&0!==n&&15!==n&&3!==a){var s=t[e+2]>>1&1,o=t[e+3]>>6,l=1e3*Ui[14*(3===r?3-i:3===i?3:4)+n-1],u=Bi[3*(3===r?0:2===r?1:2)+a],h=3===o?1:2,d=Gi[r][i],c=Ki[i],f=8*d*c,g=Math.floor(d*l/u+s)*c;if(null===Ni){var v=(navigator.userAgent||"").match(/Chrome\/(\d+)/i);Ni=v?parseInt(v[1]):0}return!!Ni&&Ni<=87&&2===i&&l>=224e3&&0===o&&(t[e+3]=128|t[e+3]),{sampleRate:u,channelCount:h,frameLength:g,samplesPerFrame:f}}}function Yi(t,e){return 255===t[e]&&224==(224&t[e+1])&&0!=(6&t[e+1])}function Wi(t,e){return e+1<t.length&&Yi(t,e)}function ji(t,e){if(e+1<t.length&&Yi(t,e)){var r=Vi(t,e),i=4;null!=r&&r.frameLength&&(i=r.frameLength);var n=e+i;return n===t.length||Wi(t,n)}return!1}var qi=function(t){function e(e,r){var i;return(i=t.call(this)||this).observer=void 0,i.config=void 0,i.observer=e,i.config=r,i}l(e,t);var r=e.prototype;return r.resetInitSegment=function(e,r,i,n){t.prototype.resetInitSegment.call(this,e,r,i,n),this._audioTrack={container:"audio/adts",type:"audio",id:2,pid:-1,sequenceNumber:0,segmentCodec:"aac",samples:[],manifestCodec:r,duration:n,inputTimeScale:9e4,dropped:0}},e.probe=function(t){if(!t)return!1;var e=lt(t,0),r=(null==e?void 0:e.length)||0;if(ji(t,r))return!1;for(var i=t.length;r<i;r++)if(Pi(t,r))return w.log("ADTS sync word found !"),!0;return!1},r.canParse=function(t,e){return function(t,e){return function(t,e){return e+5<t.length}(t,e)&&wi(t,e)&&_i(t,e)<=t.length-e}(t,e)},r.appendFrame=function(t,e,r){Fi(t,this.observer,e,r,t.manifestCodec);var i=Oi(t,e,r,this.basePTS,this.frameIndex);if(i&&0===i.missing)return i},e}(Di),Xi=/\/emsg[-/]ID3/i,zi=function(){function t(t,e){this.remainderData=null,this.timeOffset=0,this.config=void 0,this.videoTrack=void 0,this.audioTrack=void 0,this.id3Track=void 0,this.txtTrack=void 0,this.config=e}var e=t.prototype;return e.resetTimeStamp=function(){},e.resetInitSegment=function(t,e,r,i){var n=this.videoTrack=bi("video",1),a=this.audioTrack=bi("audio",1),s=this.txtTrack=bi("text",1);if(this.id3Track=bi("id3",1),this.timeOffset=0,null!=t&&t.byteLength){var o=Pt(t);if(o.video){var l=o.video,u=l.id,h=l.timescale,d=l.codec;n.id=u,n.timescale=s.timescale=h,n.codec=d}if(o.audio){var c=o.audio,f=c.id,g=c.timescale,v=c.codec;a.id=f,a.timescale=g,a.codec=v}s.id=kt.text,n.sampleDuration=0,n.duration=a.duration=i}},e.resetContiguity=function(){this.remainderData=null},t.probe=function(t){return function(t){for(var e=t.byteLength,r=0;r<e;){var i=It(t,r);if(i>8&&109===t[r+4]&&111===t[r+5]&&111===t[r+6]&&102===t[r+7])return!0;r=i>1?r+i:e}return!1}(t)},e.demux=function(t,e){this.timeOffset=e;var r=t,i=this.videoTrack,n=this.txtTrack;if(this.config.progressive){this.remainderData&&(r=Gt(this.remainderData,t));var a=function(t){var e={valid:null,remainder:null},r=_t(t,["moof"]);if(r.length<2)return e.remainder=t,e;var i=r[r.length-1];return e.valid=nt(t,0,i.byteOffset-8),e.remainder=nt(t,i.byteOffset-8),e}(r);this.remainderData=a.remainder,i.samples=a.valid||new Uint8Array}else i.samples=r;var s=this.extractID3Track(i,e);return n.samples=Kt(e,i),{videoTrack:i,audioTrack:this.audioTrack,id3Track:s,textTrack:this.txtTrack}},e.flush=function(){var t=this.timeOffset,e=this.videoTrack,r=this.txtTrack;e.samples=this.remainderData||new Uint8Array,this.remainderData=null;var i=this.extractID3Track(e,this.timeOffset);return r.samples=Kt(t,e),{videoTrack:e,audioTrack:bi(),id3Track:i,textTrack:bi()}},e.extractID3Track=function(t,e){var r=this.id3Track;if(t.samples.length){var i=_t(t.samples,["emsg"]);i&&i.forEach((function(t){var i=function(t){var e=t[0],r="",i="",n=0,a=0,s=0,o=0,l=0,u=0;if(0===e){for(;"\0"!==bt(t.subarray(u,u+1));)r+=bt(t.subarray(u,u+1)),u+=1;for(r+=bt(t.subarray(u,u+1)),u+=1;"\0"!==bt(t.subarray(u,u+1));)i+=bt(t.subarray(u,u+1)),u+=1;i+=bt(t.subarray(u,u+1)),u+=1,n=It(t,12),a=It(t,16),o=It(t,20),l=It(t,24),u=28}else if(1===e){n=It(t,u+=4);var h=It(t,u+=4),d=It(t,u+=4);for(u+=4,s=Math.pow(2,32)*h+d,E(s)||(s=Number.MAX_SAFE_INTEGER,w.warn("Presentation time exceeds safe integer limit and wrapped to max safe integer in parsing emsg box")),o=It(t,u),l=It(t,u+=4),u+=4;"\0"!==bt(t.subarray(u,u+1));)r+=bt(t.subarray(u,u+1)),u+=1;for(r+=bt(t.subarray(u,u+1)),u+=1;"\0"!==bt(t.subarray(u,u+1));)i+=bt(t.subarray(u,u+1)),u+=1;i+=bt(t.subarray(u,u+1)),u+=1}return{schemeIdUri:r,value:i,timeScale:n,presentationTime:s,presentationTimeDelta:a,eventDuration:o,id:l,payload:t.subarray(u,t.byteLength)}}(t);if(Xi.test(i.schemeIdUri)){var n=y(i.presentationTime)?i.presentationTime/i.timeScale:e+i.presentationTimeDelta/i.timeScale,a=4294967295===i.eventDuration?Number.POSITIVE_INFINITY:i.eventDuration/i.timeScale;a<=.001&&(a=Number.POSITIVE_INFINITY);var s=i.payload;r.samples.push({data:s,len:s.byteLength,dts:n,pts:n,type:Ke,duration:a})}}))}return r},e.demuxSampleAes=function(t,e,r){return Promise.reject(new Error("The MP4 demuxer does not support SAMPLE-AES decryption"))},e.destroy=function(){},t}(),Qi=function(t,e){var r=0,i=5;e+=i;for(var n=new Uint32Array(1),a=new Uint32Array(1),s=new Uint8Array(1);i>0;){s[0]=t[e];var o=Math.min(i,8),l=8-o;a[0]=4278190080>>>24+l<<l,n[0]=(s[0]&a[0])>>l,r=r?r<<o|n[0]:n[0],e+=1,i-=o}return r},Ji=function(t){function e(e){var r;return(r=t.call(this)||this).observer=void 0,r.observer=e,r}l(e,t);var r=e.prototype;return r.resetInitSegment=function(e,r,i,n){t.prototype.resetInitSegment.call(this,e,r,i,n),this._audioTrack={container:"audio/ac-3",type:"audio",id:2,pid:-1,sequenceNumber:0,segmentCodec:"ac3",samples:[],manifestCodec:r,duration:n,inputTimeScale:9e4,dropped:0}},r.canParse=function(t,e){return e+64<t.length},r.appendFrame=function(t,e,r){var i=$i(t,e,r,this.basePTS,this.frameIndex);if(-1!==i)return{sample:t.samples[t.samples.length-1],length:i,missing:0}},e.probe=function(t){if(!t)return!1;var e=lt(t,0);if(!e)return!1;var r=e.length;return 11===t[r]&&119===t[r+1]&&void 0!==dt(e)&&Qi(t,r)<16},e}(Di);function $i(t,e,r,i,n){if(r+8>e.length)return-1;if(11!==e[r]||119!==e[r+1])return-1;var a=e[r+4]>>6;if(a>=3)return-1;var s=[48e3,44100,32e3][a],o=63&e[r+4],l=2*[64,69,96,64,70,96,80,87,120,80,88,120,96,104,144,96,105,144,112,121,168,112,122,168,128,139,192,128,140,192,160,174,240,160,175,240,192,208,288,192,209,288,224,243,336,224,244,336,256,278,384,256,279,384,320,348,480,320,349,480,384,417,576,384,418,576,448,487,672,448,488,672,512,557,768,512,558,768,640,696,960,640,697,960,768,835,1152,768,836,1152,896,975,1344,896,976,1344,1024,1114,1536,1024,1115,1536,1152,1253,1728,1152,1254,1728,1280,1393,1920,1280,1394,1920][3*o+a];if(r+l>e.length)return-1;var u=e[r+6]>>5,h=0;2===u?h+=2:(1&u&&1!==u&&(h+=2),4&u&&(h+=2));var d=(e[r+6]<<8|e[r+7])>>12-h&1,c=[2,1,2,3,3,4,4,5][u]+d,f=e[r+5]>>3,g=7&e[r+5],v=new Uint8Array([a<<6|f<<1|g>>2,(3&g)<<6|u<<3|d<<2|o>>4,o<<4&224]),m=i+n*(1536/s*9e4),p=e.subarray(r,r+l);return t.config=v,t.channelCount=c,t.samplerate=s,t.samples.push({unit:p,pts:m}),l}var Zi=function(){function t(){this.VideoSample=null}var e=t.prototype;return e.createVideoSample=function(t,e,r,i){return{key:t,frame:!1,pts:e,dts:r,units:[],debug:i,length:0}},e.getLastNalUnit=function(t){var e,r,i=this.VideoSample;if(i&&0!==i.units.length||(i=t[t.length-1]),null!=(e=i)&&e.units){var n=i.units;r=n[n.length-1]}return r},e.pushAccessUnit=function(t,e){if(t.units.length&&t.frame){if(void 0===t.pts){var r=e.samples,i=r.length;if(!i)return void e.dropped++;var n=r[i-1];t.pts=n.pts,t.dts=n.dts}e.samples.push(t)}t.debug.length&&w.log(t.pts+"/"+t.dts+":"+t.debug)},t}(),tn=function(){function t(t){this.data=void 0,this.bytesAvailable=void 0,this.word=void 0,this.bitsAvailable=void 0,this.data=t,this.bytesAvailable=t.byteLength,this.word=0,this.bitsAvailable=0}var e=t.prototype;return e.loadWord=function(){var t=this.data,e=this.bytesAvailable,r=t.byteLength-e,i=new Uint8Array(4),n=Math.min(4,e);if(0===n)throw new Error("no bytes available");i.set(t.subarray(r,r+n)),this.word=new DataView(i.buffer).getUint32(0),this.bitsAvailable=8*n,this.bytesAvailable-=n},e.skipBits=function(t){var e;t=Math.min(t,8*this.bytesAvailable+this.bitsAvailable),this.bitsAvailable>t?(this.word<<=t,this.bitsAvailable-=t):(t-=this.bitsAvailable,t-=(e=t>>3)<<3,this.bytesAvailable-=e,this.loadWord(),this.word<<=t,this.bitsAvailable-=t)},e.readBits=function(t){var e=Math.min(this.bitsAvailable,t),r=this.word>>>32-e;if(t>32&&w.error("Cannot read more than 32 bits at a time"),this.bitsAvailable-=e,this.bitsAvailable>0)this.word<<=e;else{if(!(this.bytesAvailable>0))throw new Error("no bits available");this.loadWord()}return(e=t-e)>0&&this.bitsAvailable?r<<e|this.readBits(e):r},e.skipLZ=function(){var t;for(t=0;t<this.bitsAvailable;++t)if(0!=(this.word&2147483648>>>t))return this.word<<=t,this.bitsAvailable-=t,t;return this.loadWord(),t+this.skipLZ()},e.skipUEG=function(){this.skipBits(1+this.skipLZ())},e.skipEG=function(){this.skipBits(1+this.skipLZ())},e.readUEG=function(){var t=this.skipLZ();return this.readBits(t+1)-1},e.readEG=function(){var t=this.readUEG();return 1&t?1+t>>>1:-1*(t>>>1)},e.readBoolean=function(){return 1===this.readBits(1)},e.readUByte=function(){return this.readBits(8)},e.readUShort=function(){return this.readBits(16)},e.readUInt=function(){return this.readBits(32)},e.skipScalingList=function(t){for(var e=8,r=8,i=0;i<t;i++)0!==r&&(r=(e+this.readEG()+256)%256),e=0===r?e:r},e.readSPS=function(){var t,e,r,i=0,n=0,a=0,s=0,o=this.readUByte.bind(this),l=this.readBits.bind(this),u=this.readUEG.bind(this),h=this.readBoolean.bind(this),d=this.skipBits.bind(this),c=this.skipEG.bind(this),f=this.skipUEG.bind(this),g=this.skipScalingList.bind(this);o();var v=o();if(l(5),d(3),o(),f(),100===v||110===v||122===v||244===v||44===v||83===v||86===v||118===v||128===v){var m=u();if(3===m&&d(1),f(),f(),d(1),h())for(e=3!==m?8:12,r=0;r<e;r++)h()&&g(r<6?16:64)}f();var p=u();if(0===p)u();else if(1===p)for(d(1),c(),c(),t=u(),r=0;r<t;r++)c();f(),d(1);var y=u(),E=u(),T=l(1);0===T&&d(1),d(1),h()&&(i=u(),n=u(),a=u(),s=u());var S=[1,1];if(h()&&h())switch(o()){case 1:S=[1,1];break;case 2:S=[12,11];break;case 3:S=[10,11];break;case 4:S=[16,11];break;case 5:S=[40,33];break;case 6:S=[24,11];break;case 7:S=[20,11];break;case 8:S=[32,11];break;case 9:S=[80,33];break;case 10:S=[18,11];break;case 11:S=[15,11];break;case 12:S=[64,33];break;case 13:S=[160,99];break;case 14:S=[4,3];break;case 15:S=[3,2];break;case 16:S=[2,1];break;case 255:S=[o()<<8|o(),o()<<8|o()]}return{width:Math.ceil(16*(y+1)-2*i-2*n),height:(2-T)*(E+1)*16-(T?2:4)*(a+s),pixelRatio:S}},e.readSliceType=function(){return this.readUByte(),this.readUEG(),this.readUEG()},t}(),en=function(t){function e(){return t.apply(this,arguments)||this}l(e,t);var r=e.prototype;return r.parseAVCPES=function(t,e,r,i,n){var a,s=this,o=this.parseAVCNALu(t,r.data),l=this.VideoSample,u=!1;r.data=null,l&&o.length&&!t.audFound&&(this.pushAccessUnit(l,t),l=this.VideoSample=this.createVideoSample(!1,r.pts,r.dts,"")),o.forEach((function(i){var o;switch(i.type){case 1:var h=!1;a=!0;var d,c=i.data;if(u&&c.length>4){var f=new tn(c).readSliceType();2!==f&&4!==f&&7!==f&&9!==f||(h=!0)}h&&null!=(d=l)&&d.frame&&!l.key&&(s.pushAccessUnit(l,t),l=s.VideoSample=null),l||(l=s.VideoSample=s.createVideoSample(!0,r.pts,r.dts,"")),l.frame=!0,l.key=h;break;case 5:a=!0,null!=(o=l)&&o.frame&&!l.key&&(s.pushAccessUnit(l,t),l=s.VideoSample=null),l||(l=s.VideoSample=s.createVideoSample(!0,r.pts,r.dts,"")),l.key=!0,l.frame=!0;break;case 6:a=!0,Vt(i.data,1,r.pts,e.samples);break;case 7:var g,v;a=!0,u=!0;var m=i.data,p=new tn(m).readSPS();if(!t.sps||t.width!==p.width||t.height!==p.height||(null==(g=t.pixelRatio)?void 0:g[0])!==p.pixelRatio[0]||(null==(v=t.pixelRatio)?void 0:v[1])!==p.pixelRatio[1]){t.width=p.width,t.height=p.height,t.pixelRatio=p.pixelRatio,t.sps=[m],t.duration=n;for(var y=m.subarray(1,4),E="avc1.",T=0;T<3;T++){var S=y[T].toString(16);S.length<2&&(S="0"+S),E+=S}t.codec=E}break;case 8:a=!0,t.pps=[i.data];break;case 9:a=!0,t.audFound=!0,l&&s.pushAccessUnit(l,t),l=s.VideoSample=s.createVideoSample(!1,r.pts,r.dts,"");break;case 12:a=!0;break;default:a=!1,l&&(l.debug+="unknown NAL "+i.type+" ")}l&&a&&l.units.push(i)})),i&&l&&(this.pushAccessUnit(l,t),this.VideoSample=null)},r.parseAVCNALu=function(t,e){var r,i,n=e.byteLength,a=t.naluState||0,s=a,o=[],l=0,u=-1,h=0;for(-1===a&&(u=0,h=31&e[0],a=0,l=1);l<n;)if(r=e[l++],a)if(1!==a)if(r)if(1===r){if(i=l-a-1,u>=0){var d={data:e.subarray(u,i),type:h};o.push(d)}else{var c=this.getLastNalUnit(t.samples);c&&(s&&l<=4-s&&c.state&&(c.data=c.data.subarray(0,c.data.byteLength-s)),i>0&&(c.data=Gt(c.data,e.subarray(0,i)),c.state=0))}l<n?(u=l,h=31&e[l],a=0):a=-1}else a=0;else a=3;else a=r?0:2;else a=r?0:1;if(u>=0&&a>=0){var f={data:e.subarray(u,n),type:h,state:a};o.push(f)}if(0===o.length){var g=this.getLastNalUnit(t.samples);g&&(g.data=Gt(g.data,e))}return t.naluState=a,o},e}(Zi),rn=function(){function t(t,e,r){this.keyData=void 0,this.decrypter=void 0,this.keyData=r,this.decrypter=new hi(e,{removePKCS7Padding:!1})}var e=t.prototype;return e.decryptBuffer=function(t){return this.decrypter.decrypt(t,this.keyData.key.buffer,this.keyData.iv.buffer)},e.decryptAacSample=function(t,e,r){var i=this,n=t[e].unit;if(!(n.length<=16)){var a=n.subarray(16,n.length-n.length%16),s=a.buffer.slice(a.byteOffset,a.byteOffset+a.length);this.decryptBuffer(s).then((function(a){var s=new Uint8Array(a);n.set(s,16),i.decrypter.isSync()||i.decryptAacSamples(t,e+1,r)}))}},e.decryptAacSamples=function(t,e,r){for(;;e++){if(e>=t.length)return void r();if(!(t[e].unit.length<32||(this.decryptAacSample(t,e,r),this.decrypter.isSync())))return}},e.getAvcEncryptedData=function(t){for(var e=16*Math.floor((t.length-48)/160)+16,r=new Int8Array(e),i=0,n=32;n<t.length-16;n+=160,i+=16)r.set(t.subarray(n,n+16),i);return r},e.getAvcDecryptedUnit=function(t,e){for(var r=new Uint8Array(e),i=0,n=32;n<t.length-16;n+=160,i+=16)t.set(r.subarray(i,i+16),n);return t},e.decryptAvcSample=function(t,e,r,i,n){var a=this,s=Yt(n.data),o=this.getAvcEncryptedData(s);this.decryptBuffer(o.buffer).then((function(o){n.data=a.getAvcDecryptedUnit(s,o),a.decrypter.isSync()||a.decryptAvcSamples(t,e,r+1,i)}))},e.decryptAvcSamples=function(t,e,r,i){if(t instanceof Uint8Array)throw new Error("Cannot decrypt samples of type Uint8Array");for(;;e++,r=0){if(e>=t.length)return void i();for(var n=t[e].units;!(r>=n.length);r++){var a=n[r];if(!(a.data.length<=48||1!==a.type&&5!==a.type||(this.decryptAvcSample(t,e,r,i,a),this.decrypter.isSync())))return}}},t}(),nn=188,an=function(){function t(t,e,r){this.observer=void 0,this.config=void 0,this.typeSupported=void 0,this.sampleAes=null,this.pmtParsed=!1,this.audioCodec=void 0,this.videoCodec=void 0,this._duration=0,this._pmtId=-1,this._videoTrack=void 0,this._audioTrack=void 0,this._id3Track=void 0,this._txtTrack=void 0,this.aacOverFlow=null,this.remainderData=null,this.videoParser=void 0,this.observer=t,this.config=e,this.typeSupported=r,this.videoParser=new en}t.probe=function(e){var r=t.syncOffset(e);return r>0&&w.warn("MPEG2-TS detected but first sync word found @ offset "+r),-1!==r},t.syncOffset=function(t){for(var e=t.length,r=Math.min(940,e-nn)+1,i=0;i<r;){for(var n=!1,a=-1,s=0,o=i;o<e;o+=nn){if(71!==t[o]||e-o!==nn&&71!==t[o+nn]){if(s)return-1;break}if(s++,-1===a&&0!==(a=o)&&(r=Math.min(a+18612,t.length-nn)+1),n||(n=0===sn(t,o)),n&&s>1&&(0===a&&s>2||o+nn>r))return a}i++}return-1},t.createTrack=function(t,e){return{container:"video"===t||"audio"===t?"video/mp2t":void 0,type:t,id:kt[t],pid:-1,inputTimeScale:9e4,sequenceNumber:0,samples:[],dropped:0,duration:"audio"===t?e:void 0}};var e=t.prototype;return e.resetInitSegment=function(e,r,i,n){this.pmtParsed=!1,this._pmtId=-1,this._videoTrack=t.createTrack("video"),this._audioTrack=t.createTrack("audio",n),this._id3Track=t.createTrack("id3"),this._txtTrack=t.createTrack("text"),this._audioTrack.segmentCodec="aac",this.aacOverFlow=null,this.remainderData=null,this.audioCodec=r,this.videoCodec=i,this._duration=n},e.resetTimeStamp=function(){},e.resetContiguity=function(){var t=this._audioTrack,e=this._videoTrack,r=this._id3Track;t&&(t.pesData=null),e&&(e.pesData=null),r&&(r.pesData=null),this.aacOverFlow=null,this.remainderData=null},e.demux=function(e,r,i,n){var a;void 0===i&&(i=!1),void 0===n&&(n=!1),i||(this.sampleAes=null);var s=this._videoTrack,o=this._audioTrack,l=this._id3Track,u=this._txtTrack,h=s.pid,d=s.pesData,c=o.pid,f=l.pid,g=o.pesData,v=l.pesData,m=null,p=this.pmtParsed,y=this._pmtId,E=e.length;if(this.remainderData&&(E=(e=Gt(this.remainderData,e)).length,this.remainderData=null),E<nn&&!n)return this.remainderData=e,{audioTrack:o,videoTrack:s,id3Track:l,textTrack:u};var T=Math.max(0,t.syncOffset(e));(E-=(E-T)%nn)<e.byteLength&&!n&&(this.remainderData=new Uint8Array(e.buffer,E,e.buffer.byteLength-E));for(var R=0,k=T;k<E;k+=nn)if(71===e[k]){var b=!!(64&e[k+1]),D=sn(e,k),I=void 0;if((48&e[k+3])>>4>1){if((I=k+5+e[k+4])===k+nn)continue}else I=k+4;switch(D){case h:b&&(d&&(a=hn(d))&&this.videoParser.parseAVCPES(s,u,a,!1,this._duration),d={data:[],size:0}),d&&(d.data.push(e.subarray(I,k+nn)),d.size+=k+nn-I);break;case c:if(b){if(g&&(a=hn(g)))switch(o.segmentCodec){case"aac":this.parseAACPES(o,a);break;case"mp3":this.parseMPEGPES(o,a);break;case"ac3":this.parseAC3PES(o,a)}g={data:[],size:0}}g&&(g.data.push(e.subarray(I,k+nn)),g.size+=k+nn-I);break;case f:b&&(v&&(a=hn(v))&&this.parseID3PES(l,a),v={data:[],size:0}),v&&(v.data.push(e.subarray(I,k+nn)),v.size+=k+nn-I);break;case 0:b&&(I+=e[I]+1),y=this._pmtId=on(e,I);break;case y:b&&(I+=e[I]+1);var C=ln(e,I,this.typeSupported,i);(h=C.videoPid)>0&&(s.pid=h,s.segmentCodec=C.segmentVideoCodec),(c=C.audioPid)>0&&(o.pid=c,o.segmentCodec=C.segmentAudioCodec),(f=C.id3Pid)>0&&(l.pid=f),null===m||p||(w.warn("MPEG-TS PMT found at "+k+" after unknown PID '"+m+"'. Backtracking to sync byte @"+T+" to parse all TS packets."),m=null,k=T-188),p=this.pmtParsed=!0;break;case 17:case 8191:break;default:m=D}}else R++;if(R>0){var _=new Error("Found "+R+" TS packet/s that do not start with 0x47");this.observer.emit(S.ERROR,S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,fatal:!1,error:_,reason:_.message})}s.pesData=d,o.pesData=g,l.pesData=v;var x={audioTrack:o,videoTrack:s,id3Track:l,textTrack:u};return n&&this.extractRemainingSamples(x),x},e.flush=function(){var t,e=this.remainderData;return this.remainderData=null,t=e?this.demux(e,-1,!1,!0):{videoTrack:this._videoTrack,audioTrack:this._audioTrack,id3Track:this._id3Track,textTrack:this._txtTrack},this.extractRemainingSamples(t),this.sampleAes?this.decrypt(t,this.sampleAes):t},e.extractRemainingSamples=function(t){var e,r=t.audioTrack,i=t.videoTrack,n=t.id3Track,a=t.textTrack,s=i.pesData,o=r.pesData,l=n.pesData;if(s&&(e=hn(s))?(this.videoParser.parseAVCPES(i,a,e,!0,this._duration),i.pesData=null):i.pesData=s,o&&(e=hn(o))){switch(r.segmentCodec){case"aac":this.parseAACPES(r,e);break;case"mp3":this.parseMPEGPES(r,e);break;case"ac3":this.parseAC3PES(r,e)}r.pesData=null}else null!=o&&o.size&&w.log("last AAC PES packet truncated,might overlap between fragments"),r.pesData=o;l&&(e=hn(l))?(this.parseID3PES(n,e),n.pesData=null):n.pesData=l},e.demuxSampleAes=function(t,e,r){var i=this.demux(t,r,!0,!this.config.progressive),n=this.sampleAes=new rn(this.observer,this.config,e);return this.decrypt(i,n)},e.decrypt=function(t,e){return new Promise((function(r){var i=t.audioTrack,n=t.videoTrack;i.samples&&"aac"===i.segmentCodec?e.decryptAacSamples(i.samples,0,(function(){n.samples?e.decryptAvcSamples(n.samples,0,0,(function(){r(t)})):r(t)})):n.samples&&e.decryptAvcSamples(n.samples,0,0,(function(){r(t)}))}))},e.destroy=function(){this._duration=0},e.parseAACPES=function(t,e){var r,i,n,a=0,s=this.aacOverFlow,o=e.data;if(s){this.aacOverFlow=null;var l=s.missing,u=s.sample.unit.byteLength;if(-1===l)o=Gt(s.sample.unit,o);else{var h=u-l;s.sample.unit.set(o.subarray(0,l),h),t.samples.push(s.sample),a=s.missing}}for(r=a,i=o.length;r<i-1&&!xi(o,r);r++);if(r!==a){var d,c=r<i-1;d=c?"AAC PES did not start with ADTS header,offset:"+r:"No ADTS header found in AAC PES";var f=new Error(d);if(w.warn("parsing error: "+d),this.observer.emit(S.ERROR,S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,fatal:!1,levelRetry:c,error:f,reason:d}),!c)return}if(Fi(t,this.observer,o,r,this.audioCodec),void 0!==e.pts)n=e.pts;else{if(!s)return void w.warn("[tsdemuxer]: AAC PES unknown PTS");var g=Mi(t.samplerate);n=s.sample.pts+g}for(var v,m=0;r<i;){if(r+=(v=Oi(t,o,r,n,m)).length,v.missing){this.aacOverFlow=v;break}for(m++;r<i-1&&!xi(o,r);r++);}},e.parseMPEGPES=function(t,e){var r=e.data,i=r.length,n=0,a=0,s=e.pts;if(void 0!==s)for(;a<i;)if(Wi(r,a)){var o=Hi(t,r,a,s,n);if(!o)break;a+=o.length,n++}else a++;else w.warn("[tsdemuxer]: MPEG PES unknown PTS")},e.parseAC3PES=function(t,e){var r=e.data,i=e.pts;if(void 0!==i)for(var n,a=r.length,s=0,o=0;o<a&&(n=$i(t,r,o,i,s++))>0;)o+=n;else w.warn("[tsdemuxer]: AC3 PES unknown PTS")},e.parseID3PES=function(t,e){if(void 0!==e.pts){var r=o({},e,{type:this._videoTrack?Ke:Be,duration:Number.POSITIVE_INFINITY});t.samples.push(r)}else w.warn("[tsdemuxer]: ID3 PES unknown PTS")},t}();function sn(t,e){return((31&t[e+1])<<8)+t[e+2]}function on(t,e){return(31&t[e+10])<<8|t[e+11]}function ln(t,e,r,i){var n={audioPid:-1,videoPid:-1,id3Pid:-1,segmentVideoCodec:"avc",segmentAudioCodec:"aac"},a=e+3+((15&t[e+1])<<8|t[e+2])-4;for(e+=12+((15&t[e+10])<<8|t[e+11]);e<a;){var s=sn(t,e),o=(15&t[e+3])<<8|t[e+4];switch(t[e]){case 207:if(!i){un("ADTS AAC");break}case 15:-1===n.audioPid&&(n.audioPid=s);break;case 21:-1===n.id3Pid&&(n.id3Pid=s);break;case 219:if(!i){un("H.264");break}case 27:-1===n.videoPid&&(n.videoPid=s,n.segmentVideoCodec="avc");break;case 3:case 4:r.mpeg||r.mp3?-1===n.audioPid&&(n.audioPid=s,n.segmentAudioCodec="mp3"):w.log("MPEG audio found, not supported in this browser");break;case 193:if(!i){un("AC-3");break}case 129:r.ac3?-1===n.audioPid&&(n.audioPid=s,n.segmentAudioCodec="ac3"):w.log("AC-3 audio found, not supported in this browser");break;case 6:if(-1===n.audioPid&&o>0)for(var l=e+5,u=o;u>2;){106===t[l]&&(!0!==r.ac3?w.log("AC-3 audio found, not supported in this browser for now"):(n.audioPid=s,n.segmentAudioCodec="ac3"));var h=t[l+1]+2;l+=h,u-=h}break;case 194:case 135:w.warn("Unsupported EC-3 in M2TS found");break;case 36:w.warn("Unsupported HEVC in M2TS found")}e+=o+5}return n}function un(t){w.log(t+" with AES-128-CBC encryption found in unencrypted stream")}function hn(t){var e,r,i,n,a,s=0,o=t.data;if(!t||0===t.size)return null;for(;o[0].length<19&&o.length>1;)o[0]=Gt(o[0],o[1]),o.splice(1,1);if(1===((e=o[0])[0]<<16)+(e[1]<<8)+e[2]){if((r=(e[4]<<8)+e[5])&&r>t.size-6)return null;var l=e[7];192&l&&(n=536870912*(14&e[9])+4194304*(255&e[10])+16384*(254&e[11])+128*(255&e[12])+(254&e[13])/2,64&l?n-(a=536870912*(14&e[14])+4194304*(255&e[15])+16384*(254&e[16])+128*(255&e[17])+(254&e[18])/2)>54e5&&(w.warn(Math.round((n-a)/9e4)+"s delta between PTS and DTS, align them"),n=a):a=n);var u=(i=e[8])+9;if(t.size<=u)return null;t.size-=u;for(var h=new Uint8Array(t.size),d=0,c=o.length;d<c;d++){var f=(e=o[d]).byteLength;if(u){if(u>f){u-=f;continue}e=e.subarray(u),f-=u,u=0}h.set(e,s),s+=f}return r&&(r-=i+3),{data:h,pts:n,dts:a,len:r}}return null}var dn=function(t){function e(){return t.apply(this,arguments)||this}l(e,t);var r=e.prototype;return r.resetInitSegment=function(e,r,i,n){t.prototype.resetInitSegment.call(this,e,r,i,n),this._audioTrack={container:"audio/mpeg",type:"audio",id:2,pid:-1,sequenceNumber:0,segmentCodec:"mp3",samples:[],manifestCodec:r,duration:n,inputTimeScale:9e4,dropped:0}},e.probe=function(t){if(!t)return!1;var e=lt(t,0),r=(null==e?void 0:e.length)||0;if(e&&11===t[r]&&119===t[r+1]&&void 0!==dt(e)&&Qi(t,r)<=16)return!1;for(var i=t.length;r<i;r++)if(ji(t,r))return w.log("MPEG Audio sync word found !"),!0;return!1},r.canParse=function(t,e){return function(t,e){return Yi(t,e)&&4<=t.length-e}(t,e)},r.appendFrame=function(t,e,r){if(null!==this.basePTS)return Hi(t,e,r,this.basePTS,this.frameIndex)},e}(Di),cn=function(){function t(){}return t.getSilentFrame=function(t,e){if("mp4a.40.2"===t){if(1===e)return new Uint8Array([0,200,0,128,35,128]);if(2===e)return new Uint8Array([33,0,73,144,2,25,0,35,128]);if(3===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,142]);if(4===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,128,44,128,8,2,56]);if(5===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,130,48,4,153,0,33,144,2,56]);if(6===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,130,48,4,153,0,33,144,2,0,178,0,32,8,224])}else{if(1===e)return new Uint8Array([1,64,34,128,163,78,230,128,186,8,0,0,0,28,6,241,193,10,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,94]);if(2===e)return new Uint8Array([1,64,34,128,163,94,230,128,186,8,0,0,0,0,149,0,6,241,161,10,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,94]);if(3===e)return new Uint8Array([1,64,34,128,163,94,230,128,186,8,0,0,0,0,149,0,6,241,161,10,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,94])}},t}(),fn=Math.pow(2,32)-1,gn=function(){function t(){}return t.init=function(){var e;for(e in t.types={avc1:[],avcC:[],btrt:[],dinf:[],dref:[],esds:[],ftyp:[],hdlr:[],mdat:[],mdhd:[],mdia:[],mfhd:[],minf:[],moof:[],moov:[],mp4a:[],".mp3":[],dac3:[],"ac-3":[],mvex:[],mvhd:[],pasp:[],sdtp:[],stbl:[],stco:[],stsc:[],stsd:[],stsz:[],stts:[],tfdt:[],tfhd:[],traf:[],trak:[],trun:[],trex:[],tkhd:[],vmhd:[],smhd:[]},t.types)t.types.hasOwnProperty(e)&&(t.types[e]=[e.charCodeAt(0),e.charCodeAt(1),e.charCodeAt(2),e.charCodeAt(3)]);var r=new Uint8Array([0,0,0,0,0,0,0,0,118,105,100,101,0,0,0,0,0,0,0,0,0,0,0,0,86,105,100,101,111,72,97,110,100,108,101,114,0]),i=new Uint8Array([0,0,0,0,0,0,0,0,115,111,117,110,0,0,0,0,0,0,0,0,0,0,0,0,83,111,117,110,100,72,97,110,100,108,101,114,0]);t.HDLR_TYPES={video:r,audio:i};var n=new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,12,117,114,108,32,0,0,0,1]),a=new Uint8Array([0,0,0,0,0,0,0,0]);t.STTS=t.STSC=t.STCO=a,t.STSZ=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0]),t.VMHD=new Uint8Array([0,0,0,1,0,0,0,0,0,0,0,0]),t.SMHD=new Uint8Array([0,0,0,0,0,0,0,0]),t.STSD=new Uint8Array([0,0,0,0,0,0,0,1]);var s=new Uint8Array([105,115,111,109]),o=new Uint8Array([97,118,99,49]),l=new Uint8Array([0,0,0,1]);t.FTYP=t.box(t.types.ftyp,s,l,s,o),t.DINF=t.box(t.types.dinf,t.box(t.types.dref,n))},t.box=function(t){for(var e=8,r=arguments.length,i=new Array(r>1?r-1:0),n=1;n<r;n++)i[n-1]=arguments[n];for(var a=i.length,s=a;a--;)e+=i[a].byteLength;var o=new Uint8Array(e);for(o[0]=e>>24&255,o[1]=e>>16&255,o[2]=e>>8&255,o[3]=255&e,o.set(t,4),a=0,e=8;a<s;a++)o.set(i[a],e),e+=i[a].byteLength;return o},t.hdlr=function(e){return t.box(t.types.hdlr,t.HDLR_TYPES[e])},t.mdat=function(e){return t.box(t.types.mdat,e)},t.mdhd=function(e,r){r*=e;var i=Math.floor(r/(fn+1)),n=Math.floor(r%(fn+1));return t.box(t.types.mdhd,new Uint8Array([1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,e>>24&255,e>>16&255,e>>8&255,255&e,i>>24,i>>16&255,i>>8&255,255&i,n>>24,n>>16&255,n>>8&255,255&n,85,196,0,0]))},t.mdia=function(e){return t.box(t.types.mdia,t.mdhd(e.timescale,e.duration),t.hdlr(e.type),t.minf(e))},t.mfhd=function(e){return t.box(t.types.mfhd,new Uint8Array([0,0,0,0,e>>24,e>>16&255,e>>8&255,255&e]))},t.minf=function(e){return"audio"===e.type?t.box(t.types.minf,t.box(t.types.smhd,t.SMHD),t.DINF,t.stbl(e)):t.box(t.types.minf,t.box(t.types.vmhd,t.VMHD),t.DINF,t.stbl(e))},t.moof=function(e,r,i){return t.box(t.types.moof,t.mfhd(e),t.traf(i,r))},t.moov=function(e){for(var r=e.length,i=[];r--;)i[r]=t.trak(e[r]);return t.box.apply(null,[t.types.moov,t.mvhd(e[0].timescale,e[0].duration)].concat(i).concat(t.mvex(e)))},t.mvex=function(e){for(var r=e.length,i=[];r--;)i[r]=t.trex(e[r]);return t.box.apply(null,[t.types.mvex].concat(i))},t.mvhd=function(e,r){r*=e;var i=Math.floor(r/(fn+1)),n=Math.floor(r%(fn+1)),a=new Uint8Array([1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,e>>24&255,e>>16&255,e>>8&255,255&e,i>>24,i>>16&255,i>>8&255,255&i,n>>24,n>>16&255,n>>8&255,255&n,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255]);return t.box(t.types.mvhd,a)},t.sdtp=function(e){var r,i,n=e.samples||[],a=new Uint8Array(4+n.length);for(r=0;r<n.length;r++)i=n[r].flags,a[r+4]=i.dependsOn<<4|i.isDependedOn<<2|i.hasRedundancy;return t.box(t.types.sdtp,a)},t.stbl=function(e){return t.box(t.types.stbl,t.stsd(e),t.box(t.types.stts,t.STTS),t.box(t.types.stsc,t.STSC),t.box(t.types.stsz,t.STSZ),t.box(t.types.stco,t.STCO))},t.avc1=function(e){var r,i,n,a=[],s=[];for(r=0;r<e.sps.length;r++)n=(i=e.sps[r]).byteLength,a.push(n>>>8&255),a.push(255&n),a=a.concat(Array.prototype.slice.call(i));for(r=0;r<e.pps.length;r++)n=(i=e.pps[r]).byteLength,s.push(n>>>8&255),s.push(255&n),s=s.concat(Array.prototype.slice.call(i));var o=t.box(t.types.avcC,new Uint8Array([1,a[3],a[4],a[5],255,224|e.sps.length].concat(a).concat([e.pps.length]).concat(s))),l=e.width,u=e.height,h=e.pixelRatio[0],d=e.pixelRatio[1];return t.box(t.types.avc1,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,l>>8&255,255&l,u>>8&255,255&u,0,72,0,0,0,72,0,0,0,0,0,0,0,1,18,100,97,105,108,121,109,111,116,105,111,110,47,104,108,115,46,106,115,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,17,17]),o,t.box(t.types.btrt,new Uint8Array([0,28,156,128,0,45,198,192,0,45,198,192])),t.box(t.types.pasp,new Uint8Array([h>>24,h>>16&255,h>>8&255,255&h,d>>24,d>>16&255,d>>8&255,255&d])))},t.esds=function(t){var e=t.config.length;return new Uint8Array([0,0,0,0,3,23+e,0,1,0,4,15+e,64,21,0,0,0,0,0,0,0,0,0,0,0,5].concat([e]).concat(t.config).concat([6,1,2]))},t.audioStsd=function(t){var e=t.samplerate;return new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,t.channelCount,0,16,0,0,0,0,e>>8&255,255&e,0,0])},t.mp4a=function(e){return t.box(t.types.mp4a,t.audioStsd(e),t.box(t.types.esds,t.esds(e)))},t.mp3=function(e){return t.box(t.types[".mp3"],t.audioStsd(e))},t.ac3=function(e){return t.box(t.types["ac-3"],t.audioStsd(e),t.box(t.types.dac3,e.config))},t.stsd=function(e){return"audio"===e.type?"mp3"===e.segmentCodec&&"mp3"===e.codec?t.box(t.types.stsd,t.STSD,t.mp3(e)):"ac3"===e.segmentCodec?t.box(t.types.stsd,t.STSD,t.ac3(e)):t.box(t.types.stsd,t.STSD,t.mp4a(e)):t.box(t.types.stsd,t.STSD,t.avc1(e))},t.tkhd=function(e){var r=e.id,i=e.duration*e.timescale,n=e.width,a=e.height,s=Math.floor(i/(fn+1)),o=Math.floor(i%(fn+1));return t.box(t.types.tkhd,new Uint8Array([1,0,0,7,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,r>>24&255,r>>16&255,r>>8&255,255&r,0,0,0,0,s>>24,s>>16&255,s>>8&255,255&s,o>>24,o>>16&255,o>>8&255,255&o,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,n>>8&255,255&n,0,0,a>>8&255,255&a,0,0]))},t.traf=function(e,r){var i=t.sdtp(e),n=e.id,a=Math.floor(r/(fn+1)),s=Math.floor(r%(fn+1));return t.box(t.types.traf,t.box(t.types.tfhd,new Uint8Array([0,0,0,0,n>>24,n>>16&255,n>>8&255,255&n])),t.box(t.types.tfdt,new Uint8Array([1,0,0,0,a>>24,a>>16&255,a>>8&255,255&a,s>>24,s>>16&255,s>>8&255,255&s])),t.trun(e,i.length+16+20+8+16+8+8),i)},t.trak=function(e){return e.duration=e.duration||4294967295,t.box(t.types.trak,t.tkhd(e),t.mdia(e))},t.trex=function(e){var r=e.id;return t.box(t.types.trex,new Uint8Array([0,0,0,0,r>>24,r>>16&255,r>>8&255,255&r,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1]))},t.trun=function(e,r){var i,n,a,s,o,l,u=e.samples||[],h=u.length,d=12+16*h,c=new Uint8Array(d);for(r+=8+d,c.set(["video"===e.type?1:0,0,15,1,h>>>24&255,h>>>16&255,h>>>8&255,255&h,r>>>24&255,r>>>16&255,r>>>8&255,255&r],0),i=0;i<h;i++)a=(n=u[i]).duration,s=n.size,o=n.flags,l=n.cts,c.set([a>>>24&255,a>>>16&255,a>>>8&255,255&a,s>>>24&255,s>>>16&255,s>>>8&255,255&s,o.isLeading<<2|o.dependsOn,o.isDependedOn<<6|o.hasRedundancy<<4|o.paddingValue<<1|o.isNonSync,61440&o.degradPrio,15&o.degradPrio,l>>>24&255,l>>>16&255,l>>>8&255,255&l],12+16*i);return t.box(t.types.trun,c)},t.initSegment=function(e){t.types||t.init();var r=t.moov(e);return Gt(t.FTYP,r)},t}();gn.types=void 0,gn.HDLR_TYPES=void 0,gn.STTS=void 0,gn.STSC=void 0,gn.STCO=void 0,gn.STSZ=void 0,gn.VMHD=void 0,gn.SMHD=void 0,gn.STSD=void 0,gn.FTYP=void 0,gn.DINF=void 0;var vn=9e4;function mn(t,e,r,i){void 0===r&&(r=1),void 0===i&&(i=!1);var n=t*e*r;return i?Math.round(n):n}function pn(t,e){return void 0===e&&(e=!1),mn(t,1e3,1/vn,e)}var yn=null,En=null,Tn=function(){function t(t,e,r,i){if(this.observer=void 0,this.config=void 0,this.typeSupported=void 0,this.ISGenerated=!1,this._initPTS=null,this._initDTS=null,this.nextAvcDts=null,this.nextAudioPts=null,this.videoSampleDuration=null,this.isAudioContiguous=!1,this.isVideoContiguous=!1,this.videoTrackConfig=void 0,this.observer=t,this.config=e,this.typeSupported=r,this.ISGenerated=!1,null===yn){var n=(navigator.userAgent||"").match(/Chrome\/(\d+)/i);yn=n?parseInt(n[1]):0}if(null===En){var a=navigator.userAgent.match(/Safari\/(\d+)/i);En=a?parseInt(a[1]):0}}var e=t.prototype;return e.destroy=function(){this.config=this.videoTrackConfig=this._initPTS=this._initDTS=null},e.resetTimeStamp=function(t){w.log("[mp4-remuxer]: initPTS & initDTS reset"),this._initPTS=this._initDTS=t},e.resetNextTimestamp=function(){w.log("[mp4-remuxer]: reset next timestamp"),this.isVideoContiguous=!1,this.isAudioContiguous=!1},e.resetInitSegment=function(){w.log("[mp4-remuxer]: ISGenerated flag reset"),this.ISGenerated=!1,this.videoTrackConfig=void 0},e.getVideoStartPts=function(t){var e=!1,r=t.reduce((function(t,r){var i=r.pts-t;return i<-4294967296?(e=!0,Sn(t,r.pts)):i>0?t:r.pts}),t[0].pts);return e&&w.debug("PTS rollover detected"),r},e.remux=function(t,e,r,i,n,a,s,o){var l,u,h,d,c,f,g=n,v=n,m=t.pid>-1,p=e.pid>-1,y=e.samples.length,E=t.samples.length>0,T=s&&y>0||y>1;if((!m||E)&&(!p||T)||this.ISGenerated||s){if(this.ISGenerated){var S,L,A,R,k=this.videoTrackConfig;!k||e.width===k.width&&e.height===k.height&&(null==(S=e.pixelRatio)?void 0:S[0])===(null==(L=k.pixelRatio)?void 0:L[0])&&(null==(A=e.pixelRatio)?void 0:A[1])===(null==(R=k.pixelRatio)?void 0:R[1])||this.resetInitSegment()}else h=this.generateIS(t,e,n,a);var b,D=this.isVideoContiguous,I=-1;if(T&&(I=function(t){for(var e=0;e<t.length;e++)if(t[e].key)return e;return-1}(e.samples),!D&&this.config.forceKeyFrameOnDiscontinuity))if(f=!0,I>0){w.warn("[mp4-remuxer]: Dropped "+I+" out of "+y+" video samples due to a missing keyframe");var C=this.getVideoStartPts(e.samples);e.samples=e.samples.slice(I),e.dropped+=I,b=v+=(e.samples[0].pts-C)/e.inputTimeScale}else-1===I&&(w.warn("[mp4-remuxer]: No keyframe found out of "+y+" video samples"),f=!1);if(this.ISGenerated){if(E&&T){var _=this.getVideoStartPts(e.samples),x=(Sn(t.samples[0].pts,_)-_)/e.inputTimeScale;g+=Math.max(0,x),v+=Math.max(0,-x)}if(E){if(t.samplerate||(w.warn("[mp4-remuxer]: regenerate InitSegment as audio detected"),h=this.generateIS(t,e,n,a)),u=this.remuxAudio(t,g,this.isAudioContiguous,a,p||T||o===we?v:void 0),T){var P=u?u.endPTS-u.startPTS:0;e.inputTimeScale||(w.warn("[mp4-remuxer]: regenerate InitSegment as video detected"),h=this.generateIS(t,e,n,a)),l=this.remuxVideo(e,v,D,P)}}else T&&(l=this.remuxVideo(e,v,D,0));l&&(l.firstKeyFrame=I,l.independent=-1!==I,l.firstKeyFramePTS=b)}}return this.ISGenerated&&this._initPTS&&this._initDTS&&(r.samples.length&&(c=Ln(r,n,this._initPTS,this._initDTS)),i.samples.length&&(d=An(i,n,this._initPTS))),{audio:u,video:l,initSegment:h,independent:f,text:d,id3:c}},e.generateIS=function(t,e,r,i){var n,a,s,o=t.samples,l=e.samples,u=this.typeSupported,h={},d=this._initPTS,c=!d||i,f="audio/mp4";if(c&&(n=a=1/0),t.config&&o.length){switch(t.timescale=t.samplerate,t.segmentCodec){case"mp3":u.mpeg?(f="audio/mpeg",t.codec=""):u.mp3&&(t.codec="mp3");break;case"ac3":t.codec="ac-3"}h.audio={id:"audio",container:f,codec:t.codec,initSegment:"mp3"===t.segmentCodec&&u.mpeg?new Uint8Array(0):gn.initSegment([t]),metadata:{channelCount:t.channelCount}},c&&(s=t.inputTimeScale,d&&s===d.timescale?c=!1:n=a=o[0].pts-Math.round(s*r))}if(e.sps&&e.pps&&l.length){if(e.timescale=e.inputTimeScale,h.video={id:"main",container:"video/mp4",codec:e.codec,initSegment:gn.initSegment([e]),metadata:{width:e.width,height:e.height}},c)if(s=e.inputTimeScale,d&&s===d.timescale)c=!1;else{var g=this.getVideoStartPts(l),v=Math.round(s*r);a=Math.min(a,Sn(l[0].dts,g)-v),n=Math.min(n,g-v)}this.videoTrackConfig={width:e.width,height:e.height,pixelRatio:e.pixelRatio}}if(Object.keys(h).length)return this.ISGenerated=!0,c?(this._initPTS={baseTime:n,timescale:s},this._initDTS={baseTime:a,timescale:s}):n=s=void 0,{tracks:h,initPTS:n,timescale:s}},e.remuxVideo=function(t,e,r,i){var n,a,s=t.inputTimeScale,l=t.samples,u=[],h=l.length,d=this._initPTS,c=this.nextAvcDts,f=8,g=this.videoSampleDuration,v=Number.POSITIVE_INFINITY,m=Number.NEGATIVE_INFINITY,p=!1;if(!r||null===c){var y=e*s,E=l[0].pts-Sn(l[0].dts,l[0].pts);yn&&null!==c&&Math.abs(y-E-c)<15e3?r=!0:c=y-E}for(var T=d.baseTime*s/d.timescale,R=0;R<h;R++){var k=l[R];k.pts=Sn(k.pts-T,c),k.dts=Sn(k.dts-T,c),k.dts<l[R>0?R-1:R].dts&&(p=!0)}p&&l.sort((function(t,e){var r=t.dts-e.dts,i=t.pts-e.pts;return r||i})),n=l[0].dts;var b=(a=l[l.length-1].dts)-n,D=b?Math.round(b/(h-1)):g||t.inputTimeScale/30;if(r){var I=n-c,C=I>D,_=I<-1;if((C||_)&&(C?w.warn("AVC: "+pn(I,!0)+" ms ("+I+"dts) hole between fragments detected at "+e.toFixed(3)):w.warn("AVC: "+pn(-I,!0)+" ms ("+I+"dts) overlapping between fragments detected at "+e.toFixed(3)),!_||c>=l[0].pts||yn)){n=c;var x=l[0].pts-I;if(C)l[0].dts=n,l[0].pts=x;else for(var P=0;P<l.length&&!(l[P].dts>x);P++)l[P].dts-=I,l[P].pts-=I;w.log("Video: Initial PTS/DTS adjusted: "+pn(x,!0)+"/"+pn(n,!0)+", delta: "+pn(I,!0)+" ms")}}for(var F=0,M=0,O=n=Math.max(0,n),N=0;N<h;N++){for(var U=l[N],B=U.units,G=B.length,K=0,H=0;H<G;H++)K+=B[H].data.length;M+=K,F+=G,U.length=K,U.dts<O?(U.dts=O,O+=D/4|0||1):O=U.dts,v=Math.min(U.pts,v),m=Math.max(U.pts,m)}a=l[h-1].dts;var V,Y=M+4*F+8;try{V=new Uint8Array(Y)}catch(t){return void this.observer.emit(S.ERROR,S.ERROR,{type:L.MUX_ERROR,details:A.REMUX_ALLOC_ERROR,fatal:!1,error:t,bytes:Y,reason:"fail allocating video mdat "+Y})}var W=new DataView(V.buffer);W.setUint32(0,Y),V.set(gn.types.mdat,4);for(var j=!1,q=Number.POSITIVE_INFINITY,X=Number.POSITIVE_INFINITY,z=Number.NEGATIVE_INFINITY,Q=Number.NEGATIVE_INFINITY,J=0;J<h;J++){for(var $=l[J],Z=$.units,tt=0,et=0,rt=Z.length;et<rt;et++){var it=Z[et],nt=it.data,at=it.data.byteLength;W.setUint32(f,at),f+=4,V.set(nt,f),f+=at,tt+=4+at}var st=void 0;if(J<h-1)g=l[J+1].dts-$.dts,st=l[J+1].pts-$.pts;else{var ot=this.config,lt=J>0?$.dts-l[J-1].dts:D;if(st=J>0?$.pts-l[J-1].pts:D,ot.stretchShortVideoTrack&&null!==this.nextAudioPts){var ut=Math.floor(ot.maxBufferHole*s),ht=(i?v+i*s:this.nextAudioPts)-$.pts;ht>ut?((g=ht-lt)<0?g=lt:j=!0,w.log("[mp4-remuxer]: It is approximately "+ht/90+" ms to the next segment; using duration "+g/90+" ms for the last video frame.")):g=lt}else g=lt}var dt=Math.round($.pts-$.dts);q=Math.min(q,g),z=Math.max(z,g),X=Math.min(X,st),Q=Math.max(Q,st),u.push(new kn($.key,g,tt,dt))}if(u.length)if(yn){if(yn<70){var ct=u[0].flags;ct.dependsOn=2,ct.isNonSync=0}}else if(En&&Q-X<z-q&&D/z<.025&&0===u[0].cts){w.warn("Found irregular gaps in sample duration. Using PTS instead of DTS to determine MP4 sample duration.");for(var ft=n,gt=0,vt=u.length;gt<vt;gt++){var mt=ft+u[gt].duration,pt=ft+u[gt].cts;if(gt<vt-1){var yt=mt+u[gt+1].cts;u[gt].duration=yt-pt}else u[gt].duration=gt?u[gt-1].duration:D;u[gt].cts=0,ft=mt}}g=j||!g?D:g,this.nextAvcDts=c=a+g,this.videoSampleDuration=g,this.isVideoContiguous=!0;var Et={data1:gn.moof(t.sequenceNumber++,n,o({},t,{samples:u})),data2:V,startPTS:v/s,endPTS:(m+g)/s,startDTS:n/s,endDTS:c/s,type:"video",hasAudio:!1,hasVideo:!0,nb:u.length,dropped:t.dropped};return t.samples=[],t.dropped=0,Et},e.getSamplesPerFrame=function(t){switch(t.segmentCodec){case"mp3":return 1152;case"ac3":return 1536;default:return 1024}},e.remuxAudio=function(t,e,r,i,n){var a=t.inputTimeScale,s=a/(t.samplerate?t.samplerate:a),l=this.getSamplesPerFrame(t),u=l*s,h=this._initPTS,d="mp3"===t.segmentCodec&&this.typeSupported.mpeg,c=[],f=void 0!==n,g=t.samples,v=d?0:8,m=this.nextAudioPts||-1,p=e*a,y=h.baseTime*a/h.timescale;if(this.isAudioContiguous=r=r||g.length&&m>0&&(i&&Math.abs(p-m)<9e3||Math.abs(Sn(g[0].pts-y,p)-m)<20*u),g.forEach((function(t){t.pts=Sn(t.pts-y,p)})),!r||m<0){if(g=g.filter((function(t){return t.pts>=0})),!g.length)return;m=0===n?0:i&&!f?Math.max(0,p):g[0].pts}if("aac"===t.segmentCodec)for(var E=this.config.maxAudioFramesDrift,T=0,R=m;T<g.length;T++){var k=g[T],b=k.pts,D=b-R,I=Math.abs(1e3*D/a);if(D<=-E*u&&f)0===T&&(w.warn("Audio frame @ "+(b/a).toFixed(3)+"s overlaps nextAudioPts by "+Math.round(1e3*D/a)+" ms."),this.nextAudioPts=m=R=b);else if(D>=E*u&&I<1e4&&f){var C=Math.round(D/u);(R=b-C*u)<0&&(C--,R+=u),0===T&&(this.nextAudioPts=m=R),w.warn("[mp4-remuxer]: Injecting "+C+" audio frame @ "+(R/a).toFixed(3)+"s due to "+Math.round(1e3*D/a)+" ms gap.");for(var _=0;_<C;_++){var x=Math.max(R,0),P=cn.getSilentFrame(t.manifestCodec||t.codec,t.channelCount);P||(w.log("[mp4-remuxer]: Unable to get silent frame for given audio codec; duplicating last frame instead."),P=k.unit.subarray()),g.splice(T,0,{unit:P,pts:x}),R+=u,T++}}k.pts=R,R+=u}for(var F,M=null,O=null,N=0,U=g.length;U--;)N+=g[U].unit.byteLength;for(var B=0,G=g.length;B<G;B++){var K=g[B],H=K.unit,V=K.pts;if(null!==O)c[B-1].duration=Math.round((V-O)/s);else{if(r&&"aac"===t.segmentCodec&&(V=m),M=V,!(N>0))return;N+=v;try{F=new Uint8Array(N)}catch(t){return void this.observer.emit(S.ERROR,S.ERROR,{type:L.MUX_ERROR,details:A.REMUX_ALLOC_ERROR,fatal:!1,error:t,bytes:N,reason:"fail allocating audio mdat "+N})}d||(new DataView(F.buffer).setUint32(0,N),F.set(gn.types.mdat,4))}F.set(H,v);var Y=H.byteLength;v+=Y,c.push(new kn(!0,l,Y,0)),O=V}var W=c.length;if(W){var j=c[c.length-1];this.nextAudioPts=m=O+s*j.duration;var q=d?new Uint8Array(0):gn.moof(t.sequenceNumber++,M/s,o({},t,{samples:c}));t.samples=[];var X=M/a,z=m/a,Q={data1:q,data2:F,startPTS:X,endPTS:z,startDTS:X,endDTS:z,type:"audio",hasAudio:!0,hasVideo:!1,nb:W};return this.isAudioContiguous=!0,Q}},e.remuxEmptyAudio=function(t,e,r,i){var n=t.inputTimeScale,a=n/(t.samplerate?t.samplerate:n),s=this.nextAudioPts,o=this._initDTS,l=9e4*o.baseTime/o.timescale,u=(null!==s?s:i.startDTS*n)+l,h=i.endDTS*n+l,d=1024*a,c=Math.ceil((h-u)/d),f=cn.getSilentFrame(t.manifestCodec||t.codec,t.channelCount);if(w.warn("[mp4-remuxer]: remux empty Audio"),f){for(var g=[],v=0;v<c;v++){var m=u+v*d;g.push({unit:f,pts:m,dts:m})}return t.samples=g,this.remuxAudio(t,e,r,!1)}w.trace("[mp4-remuxer]: Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec")},t}();function Sn(t,e){var r;if(null===e)return t;for(r=e<t?-8589934592:8589934592;Math.abs(t-e)>4294967296;)t+=r;return t}function Ln(t,e,r,i){var n=t.samples.length;if(n){for(var a=t.inputTimeScale,s=0;s<n;s++){var o=t.samples[s];o.pts=Sn(o.pts-r.baseTime*a/r.timescale,e*a)/a,o.dts=Sn(o.dts-i.baseTime*a/i.timescale,e*a)/a}var l=t.samples;return t.samples=[],{samples:l}}}function An(t,e,r){var i=t.samples.length;if(i){for(var n=t.inputTimeScale,a=0;a<i;a++){var s=t.samples[a];s.pts=Sn(s.pts-r.baseTime*n/r.timescale,e*n)/n}t.samples.sort((function(t,e){return t.pts-e.pts}));var o=t.samples;return t.samples=[],{samples:o}}}var Rn,kn=function(t,e,r,i){this.size=void 0,this.duration=void 0,this.cts=void 0,this.flags=void 0,this.duration=e,this.size=r,this.cts=i,this.flags={isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,dependsOn:t?2:1,isNonSync:t?0:1}},bn=function(){function t(){this.emitInitSegment=!1,this.audioCodec=void 0,this.videoCodec=void 0,this.initData=void 0,this.initPTS=null,this.initTracks=void 0,this.lastEndTime=null}var e=t.prototype;return e.destroy=function(){},e.resetTimeStamp=function(t){this.initPTS=t,this.lastEndTime=null},e.resetNextTimestamp=function(){this.lastEndTime=null},e.resetInitSegment=function(t,e,r,i){this.audioCodec=e,this.videoCodec=r,this.generateInitSegment(function(t,e){if(!t||!e)return t;var r=e.keyId;return r&&e.isCommonEncryption&&_t(t,["moov","trak"]).forEach((function(t){var e=_t(t,["mdia","minf","stbl","stsd"])[0].subarray(8),i=_t(e,["enca"]),n=i.length>0;n||(i=_t(e,["encv"])),i.forEach((function(t){_t(n?t.subarray(28):t.subarray(78),["sinf"]).forEach((function(t){var e=Ut(t);if(e){var i=e.subarray(8,24);i.some((function(t){return 0!==t}))||(w.log("[eme] Patching keyId in 'enc"+(n?"a":"v")+">sinf>>tenc' box: "+Lt(i)+" -> "+Lt(r)),e.set(r,8))}}))}))})),t}(t,i)),this.emitInitSegment=!0},e.generateInitSegment=function(t){var e=this.audioCodec,r=this.videoCodec;if(null==t||!t.byteLength)return this.initTracks=void 0,void(this.initData=void 0);var i=this.initData=Pt(t);i.audio&&(e=Dn(i.audio,O)),i.video&&(r=Dn(i.video,N));var n={};i.audio&&i.video?n.audiovideo={container:"video/mp4",codec:e+","+r,initSegment:t,id:"main"}:i.audio?n.audio={container:"audio/mp4",codec:e,initSegment:t,id:"audio"}:i.video?n.video={container:"video/mp4",codec:r,initSegment:t,id:"main"}:w.warn("[passthrough-remuxer.ts]: initSegment does not contain moov or trak boxes."),this.initTracks=n},e.remux=function(t,e,r,i,n,a){var s,o,l=this.initPTS,u=this.lastEndTime,h={audio:void 0,video:void 0,text:i,id3:r,initSegment:void 0};y(u)||(u=this.lastEndTime=n||0);var d=e.samples;if(null==d||!d.length)return h;var c={initPTS:void 0,timescale:1},f=this.initData;if(null!=(s=f)&&s.length||(this.generateInitSegment(d),f=this.initData),null==(o=f)||!o.length)return w.warn("[passthrough-remuxer.ts]: Failed to generate initSegment."),h;this.emitInitSegment&&(c.tracks=this.initTracks,this.emitInitSegment=!1);var g=function(t,e){for(var r=0,i=0,n=0,a=_t(t,["moof","traf"]),s=0;s<a.length;s++){var o=a[s],l=_t(o,["tfhd"])[0],u=e[It(l,4)];if(u){var h=u.default,d=It(l,0)|(null==h?void 0:h.flags),c=null==h?void 0:h.duration;8&d&&(c=It(l,2&d?12:8));for(var f=u.timescale||9e4,g=_t(o,["trun"]),v=0;v<g.length;v++)!(r=Bt(g[v]))&&c&&(r=c*It(g[v],4)),u.type===N?i+=r/f:u.type===O&&(n+=r/f)}}if(0===i&&0===n){for(var m=0,p=_t(t,["sidx"]),y=0;y<p.length;y++){var E=xt(p[y]);null!=E&&E.references&&(m+=E.references.reduce((function(t,e){return t+e.info.duration||0}),0))}return m}return i||n}(d,f),v=function(t,e){return _t(e,["moof","traf"]).reduce((function(e,r){var i=_t(r,["tfdt"])[0],n=i[0],a=_t(r,["tfhd"]).reduce((function(e,r){var a=It(r,4),s=t[a];if(s){var o=It(i,4);if(1===n){if(o===At)return w.warn("[mp4-demuxer]: Ignoring assumed invalid signed 64-bit track fragment decode time"),e;o*=At+1,o+=It(i,8)}var l=o/(s.timescale||9e4);if(y(l)&&(null===e||l<e))return l}return e}),null);return null!==a&&y(a)&&(null===e||a<e)?a:e}),null)}(f,d),m=null===v?n:v;(function(t,e,r,i){if(null===t)return!0;var n=Math.max(i,1),a=e-t.baseTime/t.timescale;return Math.abs(a-r)>n}(l,m,n,g)||c.timescale!==l.timescale&&a)&&(c.initPTS=m-n,l&&1===l.timescale&&w.warn("Adjusting initPTS by "+(c.initPTS-l.baseTime)),this.initPTS=l={baseTime:c.initPTS,timescale:1});var p=t?m-l.baseTime/l.timescale:u,E=p+g;!function(t,e,r){_t(e,["moof","traf"]).forEach((function(e){_t(e,["tfhd"]).forEach((function(i){var n=It(i,4),a=t[n];if(a){var s=a.timescale||9e4;_t(e,["tfdt"]).forEach((function(t){var e=t[0],i=r*s;if(i){var n=It(t,4);if(0===e)n-=i,Ct(t,4,n=Math.max(n,0));else{n*=Math.pow(2,32),n+=It(t,8),n-=i,n=Math.max(n,0);var a=Math.floor(n/(At+1)),o=Math.floor(n%(At+1));Ct(t,4,a),Ct(t,8,o)}}}))}}))}))}(f,d,l.baseTime/l.timescale),g>0?this.lastEndTime=E:(w.warn("Duration parsed from mp4 should be greater than zero"),this.resetNextTimestamp());var T=!!f.audio,S=!!f.video,L="";T&&(L+="audio"),S&&(L+="video");var A={data1:d,startPTS:p,startDTS:p,endPTS:E,endDTS:E,type:L,hasAudio:T,hasVideo:S,nb:1,dropped:0};return h.audio="audio"===A.type?A:void 0,h.video="audio"!==A.type?A:void 0,h.initSegment=c,h.id3=Ln(r,n,l,l),i.samples.length&&(h.text=An(i,n,l)),h},t}();function Dn(t,e){var r=null==t?void 0:t.codec;if(r&&r.length>4)return r;if(e===O){if("ec-3"===r||"ac-3"===r||"alac"===r)return r;if("fLaC"===r||"Opus"===r)return ue(r,!1);var i="mp4a.40.5";return w.info('Parsed audio codec "'+r+'" or audio object type not handled. Using "'+i+'"'),i}return w.warn('Unhandled video codec "'+r+'"'),"hvc1"===r||"hev1"===r?"hvc1.1.6.L120.90":"av01"===r?"av01.0.04M.08":"avc1.42e01e"}try{Rn=self.performance.now.bind(self.performance)}catch(t){w.debug("Unable to use Performance API on this environment"),Rn=null==j?void 0:j.Date.now}var In=[{demux:zi,remux:bn},{demux:an,remux:Tn},{demux:qi,remux:Tn},{demux:dn,remux:Tn}];In.splice(2,0,{demux:Ji,remux:Tn});var wn=function(){function t(t,e,r,i,n){this.async=!1,this.observer=void 0,this.typeSupported=void 0,this.config=void 0,this.vendor=void 0,this.id=void 0,this.demuxer=void 0,this.remuxer=void 0,this.decrypter=void 0,this.probe=void 0,this.decryptionPromise=null,this.transmuxConfig=void 0,this.currentTransmuxState=void 0,this.observer=t,this.typeSupported=e,this.config=r,this.vendor=i,this.id=n}var e=t.prototype;return e.configure=function(t){this.transmuxConfig=t,this.decrypter&&this.decrypter.reset()},e.push=function(t,e,r,i){var n=this,a=r.transmuxing;a.executeStart=Rn();var s=new Uint8Array(t),o=this.currentTransmuxState,l=this.transmuxConfig;i&&(this.currentTransmuxState=i);var u=i||o,h=u.contiguous,d=u.discontinuity,c=u.trackSwitch,f=u.accurateTimeOffset,g=u.timeOffset,v=u.initSegmentChange,m=l.audioCodec,p=l.videoCodec,y=l.defaultInitPts,E=l.duration,T=l.initSegmentData,R=function(t,e){var r=null;return t.byteLength>0&&null!=(null==e?void 0:e.key)&&null!==e.iv&&null!=e.method&&(r=e),r}(s,e);if(R&&"AES-128"===R.method){var k=this.getDecrypter();if(!k.isSync())return this.decryptionPromise=k.webCryptoDecrypt(s,R.key.buffer,R.iv.buffer).then((function(t){var e=n.push(t,null,r);return n.decryptionPromise=null,e})),this.decryptionPromise;var b=k.softwareDecrypt(s,R.key.buffer,R.iv.buffer);if(r.part>-1&&(b=k.flush()),!b)return a.executeEnd=Rn(),Cn(r);s=new Uint8Array(b)}var D=this.needsProbing(d,c);if(D){var I=this.configureTransmuxer(s);if(I)return w.warn("[transmuxer] "+I.message),this.observer.emit(S.ERROR,S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,fatal:!1,error:I,reason:I.message}),a.executeEnd=Rn(),Cn(r)}(d||c||v||D)&&this.resetInitSegment(T,m,p,E,e),(d||v||D)&&this.resetInitialTimestamp(y),h||this.resetContiguity();var C=this.transmux(s,R,g,f,r),_=this.currentTransmuxState;return _.contiguous=!0,_.discontinuity=!1,_.trackSwitch=!1,a.executeEnd=Rn(),C},e.flush=function(t){var e=this,r=t.transmuxing;r.executeStart=Rn();var i=this.decrypter,n=this.currentTransmuxState,a=this.decryptionPromise;if(a)return a.then((function(){return e.flush(t)}));var s=[],o=n.timeOffset;if(i){var l=i.flush();l&&s.push(this.push(l,null,t))}var u=this.demuxer,h=this.remuxer;if(!u||!h)return r.executeEnd=Rn(),[Cn(t)];var d=u.flush(o);return _n(d)?d.then((function(r){return e.flushRemux(s,r,t),s})):(this.flushRemux(s,d,t),s)},e.flushRemux=function(t,e,r){var i=e.audioTrack,n=e.videoTrack,a=e.id3Track,s=e.textTrack,o=this.currentTransmuxState,l=o.accurateTimeOffset,u=o.timeOffset;w.log("[transmuxer.ts]: Flushed fragment "+r.sn+(r.part>-1?" p: "+r.part:"")+" of level "+r.level);var h=this.remuxer.remux(i,n,a,s,u,l,!0,this.id);t.push({remuxResult:h,chunkMeta:r}),r.transmuxing.executeEnd=Rn()},e.resetInitialTimestamp=function(t){var e=this.demuxer,r=this.remuxer;e&&r&&(e.resetTimeStamp(t),r.resetTimeStamp(t))},e.resetContiguity=function(){var t=this.demuxer,e=this.remuxer;t&&e&&(t.resetContiguity(),e.resetNextTimestamp())},e.resetInitSegment=function(t,e,r,i,n){var a=this.demuxer,s=this.remuxer;a&&s&&(a.resetInitSegment(t,e,r,i),s.resetInitSegment(t,e,r,n))},e.destroy=function(){this.demuxer&&(this.demuxer.destroy(),this.demuxer=void 0),this.remuxer&&(this.remuxer.destroy(),this.remuxer=void 0)},e.transmux=function(t,e,r,i,n){return e&&"SAMPLE-AES"===e.method?this.transmuxSampleAes(t,e,r,i,n):this.transmuxUnencrypted(t,r,i,n)},e.transmuxUnencrypted=function(t,e,r,i){var n=this.demuxer.demux(t,e,!1,!this.config.progressive),a=n.audioTrack,s=n.videoTrack,o=n.id3Track,l=n.textTrack;return{remuxResult:this.remuxer.remux(a,s,o,l,e,r,!1,this.id),chunkMeta:i}},e.transmuxSampleAes=function(t,e,r,i,n){var a=this;return this.demuxer.demuxSampleAes(t,e,r).then((function(t){return{remuxResult:a.remuxer.remux(t.audioTrack,t.videoTrack,t.id3Track,t.textTrack,r,i,!1,a.id),chunkMeta:n}}))},e.configureTransmuxer=function(t){for(var e,r=this.config,i=this.observer,n=this.typeSupported,a=this.vendor,s=0,o=In.length;s<o;s++){var l;if(null!=(l=In[s].demux)&&l.probe(t)){e=In[s];break}}if(!e)return new Error("Failed to find demuxer by probing fragment data");var u=this.demuxer,h=this.remuxer,d=e.remux,c=e.demux;h&&h instanceof d||(this.remuxer=new d(i,r,n,a)),u&&u instanceof c||(this.demuxer=new c(i,r,n),this.probe=c.probe)},e.needsProbing=function(t,e){return!this.demuxer||!this.remuxer||t||e},e.getDecrypter=function(){var t=this.decrypter;return t||(t=this.decrypter=new hi(this.config)),t},t}(),Cn=function(t){return{remuxResult:{},chunkMeta:t}};function _n(t){return"then"in t&&t.then instanceof Function}var xn=function(t,e,r,i,n){this.audioCodec=void 0,this.videoCodec=void 0,this.initSegmentData=void 0,this.duration=void 0,this.defaultInitPts=void 0,this.audioCodec=t,this.videoCodec=e,this.initSegmentData=r,this.duration=i,this.defaultInitPts=n||null},Pn=function(t,e,r,i,n,a){this.discontinuity=void 0,this.contiguous=void 0,this.accurateTimeOffset=void 0,this.trackSwitch=void 0,this.timeOffset=void 0,this.initSegmentChange=void 0,this.discontinuity=t,this.contiguous=e,this.accurateTimeOffset=r,this.trackSwitch=i,this.timeOffset=n,this.initSegmentChange=a},Fn={exports:{}};!function(t){var e=Object.prototype.hasOwnProperty,r="~";function i(){}function n(t,e,r){this.fn=t,this.context=e,this.once=r||!1}function a(t,e,i,a,s){if("function"!=typeof i)throw new TypeError("The listener must be a function");var o=new n(i,a||t,s),l=r?r+e:e;return t._events[l]?t._events[l].fn?t._events[l]=[t._events[l],o]:t._events[l].push(o):(t._events[l]=o,t._eventsCount++),t}function s(t,e){0==--t._eventsCount?t._events=new i:delete t._events[e]}function o(){this._events=new i,this._eventsCount=0}Object.create&&(i.prototype=Object.create(null),(new i).__proto__||(r=!1)),o.prototype.eventNames=function(){var t,i,n=[];if(0===this._eventsCount)return n;for(i in t=this._events)e.call(t,i)&&n.push(r?i.slice(1):i);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(t)):n},o.prototype.listeners=function(t){var e=r?r+t:t,i=this._events[e];if(!i)return[];if(i.fn)return[i.fn];for(var n=0,a=i.length,s=new Array(a);n<a;n++)s[n]=i[n].fn;return s},o.prototype.listenerCount=function(t){var e=r?r+t:t,i=this._events[e];return i?i.fn?1:i.length:0},o.prototype.emit=function(t,e,i,n,a,s){var o=r?r+t:t;if(!this._events[o])return!1;var l,u,h=this._events[o],d=arguments.length;if(h.fn){switch(h.once&&this.removeListener(t,h.fn,void 0,!0),d){case 1:return h.fn.call(h.context),!0;case 2:return h.fn.call(h.context,e),!0;case 3:return h.fn.call(h.context,e,i),!0;case 4:return h.fn.call(h.context,e,i,n),!0;case 5:return h.fn.call(h.context,e,i,n,a),!0;case 6:return h.fn.call(h.context,e,i,n,a,s),!0}for(u=1,l=new Array(d-1);u<d;u++)l[u-1]=arguments[u];h.fn.apply(h.context,l)}else{var c,f=h.length;for(u=0;u<f;u++)switch(h[u].once&&this.removeListener(t,h[u].fn,void 0,!0),d){case 1:h[u].fn.call(h[u].context);break;case 2:h[u].fn.call(h[u].context,e);break;case 3:h[u].fn.call(h[u].context,e,i);break;case 4:h[u].fn.call(h[u].context,e,i,n);break;default:if(!l)for(c=1,l=new Array(d-1);c<d;c++)l[c-1]=arguments[c];h[u].fn.apply(h[u].context,l)}}return!0},o.prototype.on=function(t,e,r){return a(this,t,e,r,!1)},o.prototype.once=function(t,e,r){return a(this,t,e,r,!0)},o.prototype.removeListener=function(t,e,i,n){var a=r?r+t:t;if(!this._events[a])return this;if(!e)return s(this,a),this;var o=this._events[a];if(o.fn)o.fn!==e||n&&!o.once||i&&o.context!==i||s(this,a);else{for(var l=0,u=[],h=o.length;l<h;l++)(o[l].fn!==e||n&&!o[l].once||i&&o[l].context!==i)&&u.push(o[l]);u.length?this._events[a]=1===u.length?u[0]:u:s(this,a)}return this},o.prototype.removeAllListeners=function(t){var e;return t?(e=r?r+t:t,this._events[e]&&s(this,e)):(this._events=new i,this._eventsCount=0),this},o.prototype.off=o.prototype.removeListener,o.prototype.addListener=o.prototype.on,o.prefixed=r,o.EventEmitter=o,t.exports=o}(Fn);var Mn=v(Fn.exports);function On(t,e){if(!((r=e.remuxResult).audio||r.video||r.text||r.id3||r.initSegment))return!1;var r,i=[],n=e.remuxResult,a=n.audio,s=n.video;return a&&Nn(i,a),s&&Nn(i,s),t.postMessage({event:"transmuxComplete",data:e},i),!0}function Nn(t,e){e.data1&&t.push(e.data1.buffer),e.data2&&t.push(e.data2.buffer)}function Un(t,e,r){e.reduce((function(e,r){return On(t,r)||e}),!1)||t.postMessage({event:"transmuxComplete",data:e[0]}),t.postMessage({event:"flush",data:r})}void 0!==e&&e&&function(t){var e=new Mn,r=function(e,r){t.postMessage({event:e,data:r})};e.on(S.FRAG_DECRYPTED,r),e.on(S.ERROR,r);var i=function(){var t=function(t){var e=function(e){r("workerLog",{logType:t,message:e})};w[t]=e};for(var e in w)t(e)};t.addEventListener("message",(function(n){var a=n.data;switch(a.cmd){case"init":var s=JSON.parse(a.config);t.transmuxer=new wn(e,a.typeSupported,s,a.vendor,a.id),I(s.debug,a.id),i(),r("init",null);break;case"configure":t.transmuxer.configure(a.config);break;case"demux":var o=t.transmuxer.push(a.data,a.decryptdata,a.chunkMeta,a.state);_n(o)?(t.transmuxer.async=!0,o.then((function(e){On(t,e)})).catch((function(t){r(S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,chunkMeta:a.chunkMeta,fatal:!1,error:t,err:t,reason:"transmuxer-worker push error"})}))):(t.transmuxer.async=!1,On(t,o));break;case"flush":var l=a.chunkMeta,u=t.transmuxer.flush(l);_n(u)||t.transmuxer.async?(_n(u)||(u=Promise.resolve(u)),u.then((function(e){Un(t,e,l)})).catch((function(t){r(S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,chunkMeta:a.chunkMeta,fatal:!1,error:t,err:t,reason:"transmuxer-worker flush error"})}))):Un(t,u,l)}}))}(self);var Bn=function(){function e(e,r,i,n){var a=this;this.error=null,this.hls=void 0,this.id=void 0,this.observer=void 0,this.frag=null,this.part=null,this.useWorker=void 0,this.workerContext=null,this.onwmsg=void 0,this.transmuxer=null,this.onTransmuxComplete=void 0,this.onFlush=void 0;var s=e.config;this.hls=e,this.id=r,this.useWorker=!!s.enableWorker,this.onTransmuxComplete=i,this.onFlush=n;var o=function(t,e){(e=e||{}).frag=a.frag,e.id=a.id,t===S.ERROR&&(a.error=e.error),a.hls.trigger(t,e)};this.observer=new Mn,this.observer.on(S.FRAG_DECRYPTED,o),this.observer.on(S.ERROR,o);var l,u,h,d,c=te(s.preferManagedMediaSource)||{isTypeSupported:function(){return!1}},f={mpeg:c.isTypeSupported("audio/mpeg"),mp3:c.isTypeSupported('audio/mp4; codecs="mp3"'),ac3:c.isTypeSupported('audio/mp4; codecs="ac-3"')},g=navigator.vendor;if(!this.useWorker||"undefined"==typeof Worker||(s.workerPath,0))this.transmuxer=new wn(this.observer,f,s,g,r);else try{s.workerPath?(w.log("loading Web Worker "+s.workerPath+' for "'+r+'"'),this.workerContext=(h=s.workerPath,d=new self.URL(h,self.location.href).href,{worker:new self.Worker(d),scriptURL:d})):(w.log('injecting Web Worker for "'+r+'"'),this.workerContext=(l=new self.Blob(["var exports={};var module={exports:exports};function define(f){f()};define.amd=true;("+t.toString()+")(true);"],{type:"text/javascript"}),u=self.URL.createObjectURL(l),{worker:new self.Worker(u),objectURL:u})),this.onwmsg=function(t){return a.onWorkerMessage(t)};var v=this.workerContext.worker;v.addEventListener("message",this.onwmsg),v.onerror=function(t){var e=new Error(t.message+"  ("+t.filename+":"+t.lineno+")");s.enableWorker=!1,w.warn('Error in "'+r+'" Web Worker, fallback to inline'),a.hls.trigger(S.ERROR,{type:L.OTHER_ERROR,details:A.INTERNAL_EXCEPTION,fatal:!1,event:"demuxerWorker",error:e})},v.postMessage({cmd:"init",typeSupported:f,vendor:g,id:r,config:JSON.stringify(s)})}catch(t){w.warn('Error setting up "'+r+'" Web Worker, fallback to inline',t),this.resetWorker(),this.error=null,this.transmuxer=new wn(this.observer,f,s,g,r)}}var r=e.prototype;return r.resetWorker=function(){if(this.workerContext){var t=this.workerContext,e=t.worker,r=t.objectURL;r&&self.URL.revokeObjectURL(r),e.removeEventListener("message",this.onwmsg),e.onerror=null,e.terminate(),this.workerContext=null}},r.destroy=function(){if(this.workerContext)this.resetWorker(),this.onwmsg=void 0;else{var t=this.transmuxer;t&&(t.destroy(),this.transmuxer=null)}var e=this.observer;e&&e.removeAllListeners(),this.frag=null,this.observer=null,this.hls=null},r.push=function(t,e,r,i,n,a,s,o,l,u){var h,d,c=this;l.transmuxing.start=self.performance.now();var f=this.transmuxer,g=a?a.start:n.start,v=n.decryptdata,m=this.frag,p=!(m&&n.cc===m.cc),y=!(m&&l.level===m.level),E=m?l.sn-m.sn:-1,T=this.part?l.part-this.part.index:-1,S=0===E&&l.id>1&&l.id===(null==m?void 0:m.stats.chunkCount),L=!y&&(1===E||0===E&&(1===T||S&&T<=0)),A=self.performance.now();(y||E||0===n.stats.parsing.start)&&(n.stats.parsing.start=A),!a||!T&&L||(a.stats.parsing.start=A);var R=!(m&&(null==(h=n.initSegment)?void 0:h.url)===(null==(d=m.initSegment)?void 0:d.url)),k=new Pn(p,L,o,y,g,R);if(!L||p||R){w.log("[transmuxer-interface, "+n.type+"]: Starting new transmux session for sn: "+l.sn+" p: "+l.part+" level: "+l.level+" id: "+l.id+"\n        discontinuity: "+p+"\n        trackSwitch: "+y+"\n        contiguous: "+L+"\n        accurateTimeOffset: "+o+"\n        timeOffset: "+g+"\n        initSegmentChange: "+R);var b=new xn(r,i,e,s,u);this.configureTransmuxer(b)}if(this.frag=n,this.part=a,this.workerContext)this.workerContext.worker.postMessage({cmd:"demux",data:t,decryptdata:v,chunkMeta:l,state:k},t instanceof ArrayBuffer?[t]:[]);else if(f){var D=f.push(t,v,l,k);_n(D)?(f.async=!0,D.then((function(t){c.handleTransmuxComplete(t)})).catch((function(t){c.transmuxerError(t,l,"transmuxer-interface push error")}))):(f.async=!1,this.handleTransmuxComplete(D))}},r.flush=function(t){var e=this;t.transmuxing.start=self.performance.now();var r=this.transmuxer;if(this.workerContext)this.workerContext.worker.postMessage({cmd:"flush",chunkMeta:t});else if(r){var i=r.flush(t);_n(i)||r.async?(_n(i)||(i=Promise.resolve(i)),i.then((function(r){e.handleFlushResult(r,t)})).catch((function(r){e.transmuxerError(r,t,"transmuxer-interface flush error")}))):this.handleFlushResult(i,t)}},r.transmuxerError=function(t,e,r){this.hls&&(this.error=t,this.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_PARSING_ERROR,chunkMeta:e,fatal:!1,error:t,err:t,reason:r}))},r.handleFlushResult=function(t,e){var r=this;t.forEach((function(t){r.handleTransmuxComplete(t)})),this.onFlush(e)},r.onWorkerMessage=function(t){var e=t.data,r=this.hls;switch(e.event){case"init":var i,n=null==(i=this.workerContext)?void 0:i.objectURL;n&&self.URL.revokeObjectURL(n);break;case"transmuxComplete":this.handleTransmuxComplete(e.data);break;case"flush":this.onFlush(e.data);break;case"workerLog":w[e.data.logType]&&w[e.data.logType](e.data.message);break;default:e.data=e.data||{},e.data.frag=this.frag,e.data.id=this.id,r.trigger(e.event,e.data)}},r.configureTransmuxer=function(t){var e=this.transmuxer;this.workerContext?this.workerContext.worker.postMessage({cmd:"configure",config:t}):e&&e.configure(t)},r.handleTransmuxComplete=function(t){t.chunkMeta.transmuxing.end=self.performance.now(),this.onTransmuxComplete(t)},e}();function Gn(t,e){if(t.length!==e.length)return!1;for(var r=0;r<t.length;r++)if(!Kn(t[r].attrs,e[r].attrs))return!1;return!0}function Kn(t,e,r){var i=t["STABLE-RENDITION-ID"];return i&&!r?i===e["STABLE-RENDITION-ID"]:!(r||["LANGUAGE","NAME","CHARACTERISTICS","AUTOSELECT","DEFAULT","FORCED","ASSOC-LANGUAGE"]).some((function(r){return t[r]!==e[r]}))}function Hn(t,e){return e.label.toLowerCase()===t.name.toLowerCase()&&(!e.language||e.language.toLowerCase()===(t.lang||"").toLowerCase())}var Vn=function(t){function e(e,r,i){var n;return(n=t.call(this,e,r,i,"[audio-stream-controller]",we)||this).videoBuffer=null,n.videoTrackCC=-1,n.waitingVideoCC=-1,n.bufferedTrack=null,n.switchingTrack=null,n.trackId=-1,n.waitingData=null,n.mainDetails=null,n.flushing=!1,n.bufferFlushed=!1,n.cachedTrackLoadedData=null,n._registerListeners(),n}l(e,t);var r=e.prototype;return r.onHandlerDestroying=function(){this._unregisterListeners(),t.prototype.onHandlerDestroying.call(this),this.mainDetails=null,this.bufferedTrack=null,this.switchingTrack=null},r._registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.LEVEL_LOADED,this.onLevelLoaded,this),t.on(S.AUDIO_TRACKS_UPDATED,this.onAudioTracksUpdated,this),t.on(S.AUDIO_TRACK_SWITCHING,this.onAudioTrackSwitching,this),t.on(S.AUDIO_TRACK_LOADED,this.onAudioTrackLoaded,this),t.on(S.ERROR,this.onError,this),t.on(S.BUFFER_RESET,this.onBufferReset,this),t.on(S.BUFFER_CREATED,this.onBufferCreated,this),t.on(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.on(S.BUFFER_FLUSHED,this.onBufferFlushed,this),t.on(S.INIT_PTS_FOUND,this.onInitPtsFound,this),t.on(S.FRAG_BUFFERED,this.onFragBuffered,this)},r._unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.LEVEL_LOADED,this.onLevelLoaded,this),t.off(S.AUDIO_TRACKS_UPDATED,this.onAudioTracksUpdated,this),t.off(S.AUDIO_TRACK_SWITCHING,this.onAudioTrackSwitching,this),t.off(S.AUDIO_TRACK_LOADED,this.onAudioTrackLoaded,this),t.off(S.ERROR,this.onError,this),t.off(S.BUFFER_RESET,this.onBufferReset,this),t.off(S.BUFFER_CREATED,this.onBufferCreated,this),t.off(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.off(S.BUFFER_FLUSHED,this.onBufferFlushed,this),t.off(S.INIT_PTS_FOUND,this.onInitPtsFound,this),t.off(S.FRAG_BUFFERED,this.onFragBuffered,this)},r.onInitPtsFound=function(t,e){var r=e.frag,i=e.id,n=e.initPTS,a=e.timescale;if("main"===i){var s=r.cc;this.initPTS[r.cc]={baseTime:n,timescale:a},this.log("InitPTS for cc: "+s+" found from main: "+n),this.videoTrackCC=s,this.state===Li&&this.tick()}},r.startLoad=function(t){if(!this.levels)return this.startPosition=t,void(this.state=ci);var e=this.lastCurrentTime;this.stopLoad(),this.setInterval(100),e>0&&-1===t?(this.log("Override startPosition with lastCurrentTime @"+e.toFixed(3)),t=e,this.state=fi):(this.loadedmetadata=!1,this.state=pi),this.nextLoadPosition=this.startPosition=this.lastCurrentTime=t,this.tick()},r.doTick=function(){switch(this.state){case fi:this.doTickIdle();break;case pi:var e,r=this.levels,i=this.trackId,n=null==r||null==(e=r[i])?void 0:e.details;if(n){if(this.waitForCdnTuneIn(n))break;this.state=Li}break;case mi:var a,s=performance.now(),o=this.retryDate;if(!o||s>=o||null!=(a=this.media)&&a.seeking){var l=this.levels,u=this.trackId;this.log("RetryDate reached, switch back to IDLE state"),this.resetStartWhenNotLoaded((null==l?void 0:l[u])||null),this.state=fi}break;case Li:var h=this.waitingData;if(h){var d=h.frag,c=h.part,f=h.cache,g=h.complete;if(void 0!==this.initPTS[d.cc]){this.waitingData=null,this.waitingVideoCC=-1,this.state=vi;var v={frag:d,part:c,payload:f.flush(),networkDetails:null};this._handleFragmentLoadProgress(v),g&&t.prototype._handleFragmentLoadComplete.call(this,v)}else if(this.videoTrackCC!==this.waitingVideoCC)this.log("Waiting fragment cc ("+d.cc+") cancelled because video is at cc "+this.videoTrackCC),this.clearWaitingFragment();else{var m=this.getLoadPosition(),p=zr.bufferInfo(this.mediaBuffer,m,this.config.maxBufferHole);pr(p.end,this.config.maxFragLookUpTolerance,d)<0&&(this.log("Waiting fragment cc ("+d.cc+") @ "+d.start+" cancelled because another fragment at "+p.end+" is needed"),this.clearWaitingFragment())}}else this.state=fi}this.onTickEnd()},r.clearWaitingFragment=function(){var t=this.waitingData;t&&(this.fragmentTracker.removeFragment(t.frag),this.waitingData=null,this.waitingVideoCC=-1,this.state=fi)},r.resetLoadingState=function(){this.clearWaitingFragment(),t.prototype.resetLoadingState.call(this)},r.onTickEnd=function(){var t=this.media;null!=t&&t.readyState&&(this.lastCurrentTime=t.currentTime)},r.doTickIdle=function(){var t=this.hls,e=this.levels,r=this.media,i=this.trackId,n=t.config;if((r||!this.startFragRequested&&n.startFragPrefetch)&&null!=e&&e[i]){var a=e[i],s=a.details;if(!s||s.live&&this.levelLastLoaded!==a||this.waitForCdnTuneIn(s))this.state=pi;else{var o=this.mediaBuffer?this.mediaBuffer:this.media;this.bufferFlushed&&o&&(this.bufferFlushed=!1,this.afterBufferFlushed(o,O,we));var l=this.getFwdBufferInfo(o,we);if(null!==l){var u=this.bufferedTrack,h=this.switchingTrack;if(!h&&this._streamEnded(l,s))return t.trigger(S.BUFFER_EOS,{type:"audio"}),void(this.state=Ti);var d=this.getFwdBufferInfo(this.videoBuffer?this.videoBuffer:this.media,Ie),c=l.len,f=this.getMaxBufferLength(null==d?void 0:d.len),g=s.fragments,v=g[0].start,m=this.flushing?this.getLoadPosition():l.end;if(h&&r){var p=this.getLoadPosition();u&&!Kn(h.attrs,u.attrs)&&(m=p),s.PTSKnown&&p<v&&(l.end>v||l.nextStart)&&(this.log("Alt audio track ahead of main track, seek to start of alt audio track"),r.currentTime=v+.05)}if(!(c>=f&&!h&&m<g[g.length-1].start)){var y=this.getNextFragment(m,s),E=!1;if(y&&this.isLoopLoading(y,m)&&(E=!!y.gap,y=this.getNextFragmentLoopLoading(y,s,l,Ie,f)),y){var T=d&&y.start>d.end+s.targetduration;if(T||(null==d||!d.len)&&l.len){var L=this.getAppendedFrag(y.start,Ie);if(null===L)return;if(E||(E=!!L.gap||!!T&&0===d.len),T&&!E||E&&l.nextStart&&l.nextStart<L.end)return}this.loadFragment(y,a,m)}else this.bufferFlushed=!0}}}}},r.getMaxBufferLength=function(e){var r=t.prototype.getMaxBufferLength.call(this);return e?Math.min(Math.max(r,e),this.config.maxMaxBufferLength):r},r.onMediaDetaching=function(){this.videoBuffer=null,this.bufferFlushed=this.flushing=!1,t.prototype.onMediaDetaching.call(this)},r.onAudioTracksUpdated=function(t,e){var r=e.audioTracks;this.resetTransmuxer(),this.levels=r.map((function(t){return new tr(t)}))},r.onAudioTrackSwitching=function(t,e){var r=!!e.url;this.trackId=e.id;var i=this.fragCurrent;i&&(i.abortRequests(),this.removeUnbufferedFrags(i.start)),this.resetLoadingState(),r?this.setInterval(100):this.resetTransmuxer(),r?(this.switchingTrack=e,this.state=fi,this.flushAudioIfNeeded(e)):(this.switchingTrack=null,this.bufferedTrack=e,this.state=ci),this.tick()},r.onManifestLoading=function(){this.fragmentTracker.removeAllFragments(),this.startPosition=this.lastCurrentTime=0,this.bufferFlushed=this.flushing=!1,this.levels=this.mainDetails=this.waitingData=this.bufferedTrack=this.cachedTrackLoadedData=this.switchingTrack=null,this.startFragRequested=!1,this.trackId=this.videoTrackCC=this.waitingVideoCC=-1},r.onLevelLoaded=function(t,e){this.mainDetails=e.details,null!==this.cachedTrackLoadedData&&(this.hls.trigger(S.AUDIO_TRACK_LOADED,this.cachedTrackLoadedData),this.cachedTrackLoadedData=null)},r.onAudioTrackLoaded=function(t,e){var r;if(null!=this.mainDetails){var i=this.levels,n=e.details,a=e.id;if(i){this.log("Audio track "+a+" loaded ["+n.startSN+","+n.endSN+"]"+(n.lastPartSn?"[part-"+n.lastPartSn+"-"+n.lastPartIndex+"]":"")+",duration:"+n.totalduration);var s=i[a],o=0;if(n.live||null!=(r=s.details)&&r.live){this.checkLiveUpdate(n);var l,u=this.mainDetails;if(n.deltaUpdateFailed||!u)return;!s.details&&n.hasProgramDateTime&&u.hasProgramDateTime?(ei(n,u),o=n.fragments[0].start):o=this.alignPlaylists(n,s.details,null==(l=this.levelLastLoaded)?void 0:l.details)}s.details=n,this.levelLastLoaded=s,this.startFragRequested||!this.mainDetails&&n.live||this.setStartPosition(s.details,o),this.state!==pi||this.waitForCdnTuneIn(n)||(this.state=fi),this.tick()}else this.warn("Audio tracks were reset while loading level "+a)}else this.cachedTrackLoadedData=e},r._handleFragmentLoadProgress=function(t){var e,r=t.frag,i=t.part,n=t.payload,a=this.config,s=this.trackId,o=this.levels;if(o){var l=o[s];if(l){var u=l.details;if(!u)return this.warn("Audio track details undefined on fragment load progress"),void this.removeUnbufferedFrags(r.start);var h=a.defaultAudioCodec||l.audioCodec||"mp4a.40.2",d=this.transmuxer;d||(d=this.transmuxer=new Bn(this.hls,we,this._handleTransmuxComplete.bind(this),this._handleTransmuxerFlush.bind(this)));var c=this.initPTS[r.cc],f=null==(e=r.initSegment)?void 0:e.data;if(void 0!==c){var g=i?i.index:-1,v=-1!==g,m=new Qr(r.level,r.sn,r.stats.chunkCount,n.byteLength,g,v);d.push(n,f,h,"",r,i,u.totalduration,!1,m,c)}else this.log("Unknown video PTS for cc "+r.cc+", waiting for video PTS before demuxing audio frag "+r.sn+" of ["+u.startSN+" ,"+u.endSN+"],track "+s),(this.waitingData=this.waitingData||{frag:r,part:i,cache:new ki,complete:!1}).cache.push(new Uint8Array(n)),this.waitingVideoCC=this.videoTrackCC,this.state=Li}else this.warn("Audio track is undefined on fragment load progress")}else this.warn("Audio tracks were reset while fragment load was in progress. Fragment "+r.sn+" of level "+r.level+" will not be buffered")},r._handleFragmentLoadComplete=function(e){this.waitingData?this.waitingData.complete=!0:t.prototype._handleFragmentLoadComplete.call(this,e)},r.onBufferReset=function(){this.mediaBuffer=this.videoBuffer=null,this.loadedmetadata=!1},r.onBufferCreated=function(t,e){var r=e.tracks.audio;r&&(this.mediaBuffer=r.buffer||null),e.tracks.video&&(this.videoBuffer=e.tracks.video.buffer||null)},r.onFragBuffered=function(t,e){var r=e.frag,n=e.part;if(r.type===we)if(this.fragContextChanged(r))this.warn("Fragment "+r.sn+(n?" p: "+n.index:"")+" of level "+r.level+" finished buffering, but was aborted. state: "+this.state+", audioSwitch: "+(this.switchingTrack?this.switchingTrack.name:"false"));else{if("initSegment"!==r.sn){this.fragPrevious=r;var a=this.switchingTrack;a&&(this.bufferedTrack=a,this.switchingTrack=null,this.hls.trigger(S.AUDIO_TRACK_SWITCHED,i({},a)))}this.fragBufferedComplete(r,n)}else if(!this.loadedmetadata&&r.type===Ie){var s=this.videoBuffer||this.media;s&&zr.getBuffered(s).length&&(this.loadedmetadata=!0)}},r.onError=function(e,r){var i;if(r.fatal)this.state=Si;else switch(r.details){case A.FRAG_GAP:case A.FRAG_PARSING_ERROR:case A.FRAG_DECRYPT_ERROR:case A.FRAG_LOAD_ERROR:case A.FRAG_LOAD_TIMEOUT:case A.KEY_LOAD_ERROR:case A.KEY_LOAD_TIMEOUT:this.onFragmentOrKeyLoadError(we,r);break;case A.AUDIO_TRACK_LOAD_ERROR:case A.AUDIO_TRACK_LOAD_TIMEOUT:case A.LEVEL_PARSING_ERROR:r.levelRetry||this.state!==pi||(null==(i=r.context)?void 0:i.type)!==be||(this.state=fi);break;case A.BUFFER_APPEND_ERROR:case A.BUFFER_FULL_ERROR:if(!r.parent||"audio"!==r.parent)return;if(r.details===A.BUFFER_APPEND_ERROR)return void this.resetLoadingState();this.reduceLengthAndFlushBuffer(r)&&(this.bufferedTrack=null,t.prototype.flushMainBuffer.call(this,0,Number.POSITIVE_INFINITY,"audio"));break;case A.INTERNAL_EXCEPTION:this.recoverWorkerError(r)}},r.onBufferFlushing=function(t,e){e.type!==N&&(this.flushing=!0)},r.onBufferFlushed=function(t,e){var r=e.type;if(r!==N){this.flushing=!1,this.bufferFlushed=!0,this.state===Ti&&(this.state=fi);var i=this.mediaBuffer||this.media;i&&(this.afterBufferFlushed(i,r,we),this.tick())}},r._handleTransmuxComplete=function(t){var e,r="audio",i=this.hls,n=t.remuxResult,a=t.chunkMeta,s=this.getCurrentContext(a);if(s){var l=s.frag,u=s.part,h=s.level,d=h.details,c=n.audio,f=n.text,g=n.id3,v=n.initSegment;if(!this.fragContextChanged(l)&&d){if(this.state=yi,this.switchingTrack&&c&&this.completeAudioSwitch(this.switchingTrack),null!=v&&v.tracks){var m=l.initSegment||l;this._bufferInitSegment(h,v.tracks,m,a),i.trigger(S.FRAG_PARSING_INIT_SEGMENT,{frag:m,id:r,tracks:v.tracks})}if(c){var p=c.startPTS,y=c.endPTS,E=c.startDTS,T=c.endDTS;u&&(u.elementaryStreams[O]={startPTS:p,endPTS:y,startDTS:E,endDTS:T}),l.setElementaryStreamInfo(O,p,y,E,T),this.bufferFragmentData(c,l,u,a)}if(null!=g&&null!=(e=g.samples)&&e.length){var L=o({id:r,frag:l,details:d},g);i.trigger(S.FRAG_PARSING_METADATA,L)}if(f){var A=o({id:r,frag:l,details:d},f);i.trigger(S.FRAG_PARSING_USERDATA,A)}}else this.fragmentTracker.removeFragment(l)}else this.resetWhenMissingContext(a)},r._bufferInitSegment=function(t,e,r,i){if(this.state===yi){e.video&&delete e.video;var n=e.audio;if(n){n.id="audio";var a=t.audioCodec;this.log("Init audio buffer, container:"+n.container+", codecs[level/parsed]=["+a+"/"+n.codec+"]"),a&&1===a.split(",").length&&(n.levelCodec=a),this.hls.trigger(S.BUFFER_CODECS,e);var s=n.initSegment;if(null!=s&&s.byteLength){var o={type:"audio",frag:r,part:null,chunkMeta:i,parent:r.type,data:s};this.hls.trigger(S.BUFFER_APPENDING,o)}this.tickImmediate()}}},r.loadFragment=function(e,r,i){var n,a=this.fragmentTracker.getState(e);if(this.fragCurrent=e,this.switchingTrack||a===Kr||a===Vr)if("initSegment"===e.sn)this._loadInitSegment(e,r);else if(null!=(n=r.details)&&n.live&&!this.initPTS[e.cc]){this.log("Waiting for video PTS in continuity counter "+e.cc+" of live stream before loading audio fragment "+e.sn+" of level "+this.trackId),this.state=Li;var s=this.mainDetails;s&&s.fragments[0].start!==r.details.fragments[0].start&&ei(r.details,s)}else this.startFragRequested=!0,t.prototype.loadFragment.call(this,e,r,i);else this.clearTrackerIfNeeded(e)},r.flushAudioIfNeeded=function(e){var r=this.media,i=this.bufferedTrack,n=null==i?void 0:i.attrs,a=e.attrs;r&&n&&(n.CHANNELS!==a.CHANNELS||i.name!==e.name||i.lang!==e.lang)&&(this.log("Switching audio track : flushing all audio"),t.prototype.flushMainBuffer.call(this,0,Number.POSITIVE_INFINITY,"audio"),this.bufferedTrack=null)},r.completeAudioSwitch=function(t){var e=this.hls;this.flushAudioIfNeeded(t),this.bufferedTrack=t,this.switchingTrack=null,e.trigger(S.AUDIO_TRACK_SWITCHED,i({},t))},e}(Ri),Yn=function(t){function e(e){var r;return(r=t.call(this,e,"[audio-track-controller]")||this).tracks=[],r.groupIds=null,r.tracksInGroup=[],r.trackId=-1,r.currentTrack=null,r.selectDefaultTrack=!0,r.registerListeners(),r}l(e,t);var r=e.prototype;return r.registerListeners=function(){var t=this.hls;t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_PARSED,this.onManifestParsed,this),t.on(S.LEVEL_LOADING,this.onLevelLoading,this),t.on(S.LEVEL_SWITCHING,this.onLevelSwitching,this),t.on(S.AUDIO_TRACK_LOADED,this.onAudioTrackLoaded,this),t.on(S.ERROR,this.onError,this)},r.unregisterListeners=function(){var t=this.hls;t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_PARSED,this.onManifestParsed,this),t.off(S.LEVEL_LOADING,this.onLevelLoading,this),t.off(S.LEVEL_SWITCHING,this.onLevelSwitching,this),t.off(S.AUDIO_TRACK_LOADED,this.onAudioTrackLoaded,this),t.off(S.ERROR,this.onError,this)},r.destroy=function(){this.unregisterListeners(),this.tracks.length=0,this.tracksInGroup.length=0,this.currentTrack=null,t.prototype.destroy.call(this)},r.onManifestLoading=function(){this.tracks=[],this.tracksInGroup=[],this.groupIds=null,this.currentTrack=null,this.trackId=-1,this.selectDefaultTrack=!0},r.onManifestParsed=function(t,e){this.tracks=e.audioTracks||[]},r.onAudioTrackLoaded=function(t,e){var r=e.id,i=e.groupId,n=e.details,a=this.tracksInGroup[r];if(a&&a.groupId===i){var s=a.details;a.details=e.details,this.log("Audio track "+r+' "'+a.name+'" lang:'+a.lang+" group:"+i+" loaded ["+n.startSN+"-"+n.endSN+"]"),r===this.trackId&&this.playlistLoaded(r,e,s)}else this.warn("Audio track with id:"+r+" and group:"+i+" not found in active group "+(null==a?void 0:a.groupId))},r.onLevelLoading=function(t,e){this.switchLevel(e.level)},r.onLevelSwitching=function(t,e){this.switchLevel(e.level)},r.switchLevel=function(t){var e=this.hls.levels[t];if(e){var r=e.audioGroups||null,i=this.groupIds,n=this.currentTrack;if(!r||(null==i?void 0:i.length)!==(null==r?void 0:r.length)||null!=r&&r.some((function(t){return-1===(null==i?void 0:i.indexOf(t))}))){this.groupIds=r,this.trackId=-1,this.currentTrack=null;var a=this.tracks.filter((function(t){return!r||-1!==r.indexOf(t.groupId)}));if(a.length)this.selectDefaultTrack&&!a.some((function(t){return t.default}))&&(this.selectDefaultTrack=!1),a.forEach((function(t,e){t.id=e}));else if(!n&&!this.tracksInGroup.length)return;this.tracksInGroup=a;var s=this.hls.config.audioPreference;if(!n&&s){var o=Mr(s,a,Nr);if(o>-1)n=a[o];else{var l=Mr(s,this.tracks);n=this.tracks[l]}}var u=this.findTrackId(n);-1===u&&n&&(u=this.findTrackId(null));var h={audioTracks:a};this.log("Updating audio tracks, "+a.length+" track(s) found in group(s): "+(null==r?void 0:r.join(","))),this.hls.trigger(S.AUDIO_TRACKS_UPDATED,h);var d=this.trackId;if(-1!==u&&-1===d)this.setAudioTrack(u);else if(a.length&&-1===d){var c,f=new Error("No audio track selected for current audio group-ID(s): "+(null==(c=this.groupIds)?void 0:c.join(","))+" track count: "+a.length);this.warn(f.message),this.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.AUDIO_TRACK_LOAD_ERROR,fatal:!0,error:f})}}else this.shouldReloadPlaylist(n)&&this.setAudioTrack(this.trackId)}},r.onError=function(t,e){!e.fatal&&e.context&&(e.context.type!==be||e.context.id!==this.trackId||this.groupIds&&-1===this.groupIds.indexOf(e.context.groupId)||(this.requestScheduled=-1,this.checkRetry(e)))},r.setAudioOption=function(t){var e=this.hls;if(e.config.audioPreference=t,t){var r=this.allAudioTracks;if(this.selectDefaultTrack=!1,r.length){var i=this.currentTrack;if(i&&Or(t,i,Nr))return i;var n=Mr(t,this.tracksInGroup,Nr);if(n>-1){var a=this.tracksInGroup[n];return this.setAudioTrack(n),a}if(i){var s=e.loadLevel;-1===s&&(s=e.firstAutoLevel);var o=function(t,e,r,i,n){var a=e[i],s=e.reduce((function(t,e,r){var i=e.uri;return(t[i]||(t[i]=[])).push(r),t}),{})[a.uri];s.length>1&&(i=Math.max.apply(Math,s));var o=a.videoRange,l=a.frameRate,u=a.codecSet.substring(0,4),h=Ur(e,i,(function(e){if(e.videoRange!==o||e.frameRate!==l||e.codecSet.substring(0,4)!==u)return!1;var i=e.audioGroups,a=r.filter((function(t){return!i||-1!==i.indexOf(t.groupId)}));return Mr(t,a,n)>-1}));return h>-1?h:Ur(e,i,(function(e){var i=e.audioGroups,a=r.filter((function(t){return!i||-1!==i.indexOf(t.groupId)}));return Mr(t,a,n)>-1}))}(t,e.levels,r,s,Nr);if(-1===o)return null;e.nextLoadLevel=o}if(t.channels||t.audioCodec){var l=Mr(t,r);if(l>-1)return r[l]}}}return null},r.setAudioTrack=function(t){var e=this.tracksInGroup;if(t<0||t>=e.length)this.warn("Invalid audio track id: "+t);else{this.clearTimer(),this.selectDefaultTrack=!1;var r=this.currentTrack,n=e[t],a=n.details&&!n.details.live;if(!(t===this.trackId&&n===r&&a||(this.log("Switching to audio-track "+t+' "'+n.name+'" lang:'+n.lang+" group:"+n.groupId+" channels:"+n.channels),this.trackId=t,this.currentTrack=n,this.hls.trigger(S.AUDIO_TRACK_SWITCHING,i({},n)),a))){var s=this.switchParams(n.url,null==r?void 0:r.details);this.loadPlaylist(s)}}},r.findTrackId=function(t){for(var e=this.tracksInGroup,r=0;r<e.length;r++){var i=e[r];if((!this.selectDefaultTrack||i.default)&&(!t||Or(t,i,Nr)))return r}if(t){for(var n=t.name,a=t.lang,s=t.assocLang,o=t.characteristics,l=t.audioCodec,u=t.channels,h=0;h<e.length;h++)if(Or({name:n,lang:a,assocLang:s,characteristics:o,audioCodec:l,channels:u},e[h],Nr))return h;for(var d=0;d<e.length;d++){var c=e[d];if(Kn(t.attrs,c.attrs,["LANGUAGE","ASSOC-LANGUAGE","CHARACTERISTICS"]))return d}for(var f=0;f<e.length;f++){var g=e[f];if(Kn(t.attrs,g.attrs,["LANGUAGE"]))return f}}return-1},r.loadPlaylist=function(e){var r=this.currentTrack;if(this.shouldLoadPlaylist(r)&&r){t.prototype.loadPlaylist.call(this);var i=r.id,n=r.groupId,a=r.url;if(e)try{a=e.addDirectives(a)}catch(t){this.warn("Could not construct new URL with HLS Delivery Directives: "+t)}this.log("loading audio-track playlist "+i+' "'+r.name+'" lang:'+r.lang+" group:"+n),this.clearTimer(),this.hls.trigger(S.AUDIO_TRACK_LOADING,{url:a,id:i,groupId:n,deliveryDirectives:e||null})}},s(e,[{key:"allAudioTracks",get:function(){return this.tracks}},{key:"audioTracks",get:function(){return this.tracksInGroup}},{key:"audioTrack",get:function(){return this.trackId},set:function(t){this.selectDefaultTrack=!1,this.setAudioTrack(t)}}]),e}(Dr),Wn=function(t){function e(e,r,i){var n;return(n=t.call(this,e,r,i,"[subtitle-stream-controller]",Ce)||this).currentTrackId=-1,n.tracksBuffered=[],n.mainDetails=null,n._registerListeners(),n}l(e,t);var r=e.prototype;return r.onHandlerDestroying=function(){this._unregisterListeners(),t.prototype.onHandlerDestroying.call(this),this.mainDetails=null},r._registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.LEVEL_LOADED,this.onLevelLoaded,this),t.on(S.ERROR,this.onError,this),t.on(S.SUBTITLE_TRACKS_UPDATED,this.onSubtitleTracksUpdated,this),t.on(S.SUBTITLE_TRACK_SWITCH,this.onSubtitleTrackSwitch,this),t.on(S.SUBTITLE_TRACK_LOADED,this.onSubtitleTrackLoaded,this),t.on(S.SUBTITLE_FRAG_PROCESSED,this.onSubtitleFragProcessed,this),t.on(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.on(S.FRAG_BUFFERED,this.onFragBuffered,this)},r._unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.LEVEL_LOADED,this.onLevelLoaded,this),t.off(S.ERROR,this.onError,this),t.off(S.SUBTITLE_TRACKS_UPDATED,this.onSubtitleTracksUpdated,this),t.off(S.SUBTITLE_TRACK_SWITCH,this.onSubtitleTrackSwitch,this),t.off(S.SUBTITLE_TRACK_LOADED,this.onSubtitleTrackLoaded,this),t.off(S.SUBTITLE_FRAG_PROCESSED,this.onSubtitleFragProcessed,this),t.off(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.off(S.FRAG_BUFFERED,this.onFragBuffered,this)},r.startLoad=function(t){this.stopLoad(),this.state=fi,this.setInterval(500),this.nextLoadPosition=this.startPosition=this.lastCurrentTime=t,this.tick()},r.onManifestLoading=function(){this.mainDetails=null,this.fragmentTracker.removeAllFragments()},r.onMediaDetaching=function(){this.tracksBuffered=[],t.prototype.onMediaDetaching.call(this)},r.onLevelLoaded=function(t,e){this.mainDetails=e.details},r.onSubtitleFragProcessed=function(t,e){var r=e.frag,i=e.success;if(this.fragPrevious=r,this.state=fi,i){var n=this.tracksBuffered[this.currentTrackId];if(n){for(var a,s=r.start,o=0;o<n.length;o++)if(s>=n[o].start&&s<=n[o].end){a=n[o];break}var l=r.start+r.duration;a?a.end=l:(a={start:s,end:l},n.push(a)),this.fragmentTracker.fragBuffered(r),this.fragBufferedComplete(r,null)}}},r.onBufferFlushing=function(t,e){var r=e.startOffset,i=e.endOffset;if(0===r&&i!==Number.POSITIVE_INFINITY){var n=i-1;if(n<=0)return;e.endOffsetSubtitles=Math.max(0,n),this.tracksBuffered.forEach((function(t){for(var e=0;e<t.length;)if(t[e].end<=n)t.shift();else{if(!(t[e].start<n))break;t[e].start=n,e++}})),this.fragmentTracker.removeFragmentsInRange(r,n,Ce)}},r.onFragBuffered=function(t,e){var r;this.loadedmetadata||e.frag.type!==Ie||null!=(r=this.media)&&r.buffered.length&&(this.loadedmetadata=!0)},r.onError=function(t,e){var r=e.frag;(null==r?void 0:r.type)===Ce&&(this.fragCurrent&&this.fragCurrent.abortRequests(),this.state!==ci&&(this.state=fi))},r.onSubtitleTracksUpdated=function(t,e){var r=this,i=e.subtitleTracks;this.levels&&!Gn(this.levels,i)?(this.tracksBuffered=[],this.levels=i.map((function(t){var e=new tr(t);return r.tracksBuffered[e.id]=[],e})),this.fragmentTracker.removeFragmentsInRange(0,Number.POSITIVE_INFINITY,Ce),this.fragPrevious=null,this.mediaBuffer=null):this.levels=i.map((function(t){return new tr(t)}))},r.onSubtitleTrackSwitch=function(t,e){var r;if(this.currentTrackId=e.id,null!=(r=this.levels)&&r.length&&-1!==this.currentTrackId){var i=this.levels[this.currentTrackId];null!=i&&i.details?this.mediaBuffer=this.mediaBufferTimeRanges:this.mediaBuffer=null,i&&this.setInterval(500)}else this.clearInterval()},r.onSubtitleTrackLoaded=function(t,e){var r,i=this.currentTrackId,n=this.levels,a=e.details,s=e.id;if(n){var o=n[i];if(!(s>=n.length||s!==i)&&o){this.log("Subtitle track "+s+" loaded ["+a.startSN+","+a.endSN+"]"+(a.lastPartSn?"[part-"+a.lastPartSn+"-"+a.lastPartIndex+"]":"")+",duration:"+a.totalduration),this.mediaBuffer=this.mediaBufferTimeRanges;var l=0;if(a.live||null!=(r=o.details)&&r.live){var u=this.mainDetails;if(a.deltaUpdateFailed||!u)return;var h,d=u.fragments[0];o.details?0===(l=this.alignPlaylists(a,o.details,null==(h=this.levelLastLoaded)?void 0:h.details))&&d&&sr(a,l=d.start):a.hasProgramDateTime&&u.hasProgramDateTime?(ei(a,u),l=a.fragments[0].start):d&&sr(a,l=d.start)}o.details=a,this.levelLastLoaded=o,this.startFragRequested||!this.mainDetails&&a.live||this.setStartPosition(o.details,l),this.tick(),a.live&&!this.fragCurrent&&this.media&&this.state===fi&&(mr(null,a.fragments,this.media.currentTime,0)||(this.warn("Subtitle playlist not aligned with playback"),o.details=void 0))}}else this.warn("Subtitle tracks were reset while loading level "+s)},r._handleFragmentLoadComplete=function(t){var e=this,r=t.frag,i=t.payload,n=r.decryptdata,a=this.hls;if(!this.fragContextChanged(r)&&i&&i.byteLength>0&&null!=n&&n.key&&n.iv&&"AES-128"===n.method){var s=performance.now();this.decrypter.decrypt(new Uint8Array(i),n.key.buffer,n.iv.buffer).catch((function(t){throw a.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.FRAG_DECRYPT_ERROR,fatal:!1,error:t,reason:t.message,frag:r}),t})).then((function(t){var e=performance.now();a.trigger(S.FRAG_DECRYPTED,{frag:r,payload:t,stats:{tstart:s,tdecrypt:e}})})).catch((function(t){e.warn(t.name+": "+t.message),e.state=fi}))}},r.doTick=function(){if(this.media){if(this.state===fi){var t=this.currentTrackId,e=this.levels,r=null==e?void 0:e[t];if(!r||!e.length||!r.details)return;var i=this.config,n=this.getLoadPosition(),a=zr.bufferedInfo(this.tracksBuffered[this.currentTrackId]||[],n,i.maxBufferHole),s=a.end,o=a.len,l=this.getFwdBufferInfo(this.media,Ie),u=r.details;if(o>this.getMaxBufferLength(null==l?void 0:l.len)+u.levelTargetDuration)return;var h=u.fragments,d=h.length,c=u.edge,f=null,g=this.fragPrevious;if(s<c){var v=i.maxFragLookUpTolerance,m=s>c-v?0:v;!(f=mr(g,h,Math.max(h[0].start,s),m))&&g&&g.start<h[0].start&&(f=h[0])}else f=h[d-1];if(!f)return;if("initSegment"!==(f=this.mapToInitFragWhenRequired(f)).sn){var p=h[f.sn-u.startSN-1];p&&p.cc===f.cc&&this.fragmentTracker.getState(p)===Kr&&(f=p)}this.fragmentTracker.getState(f)===Kr&&this.loadFragment(f,r,s)}}else this.state=fi},r.getMaxBufferLength=function(e){var r=t.prototype.getMaxBufferLength.call(this);return e?Math.max(r,e):r},r.loadFragment=function(e,r,i){this.fragCurrent=e,"initSegment"===e.sn?this._loadInitSegment(e,r):(this.startFragRequested=!0,t.prototype.loadFragment.call(this,e,r,i))},s(e,[{key:"mediaBufferTimeRanges",get:function(){return new jn(this.tracksBuffered[this.currentTrackId]||[])}}]),e}(Ri),jn=function(t){this.buffered=void 0;var e=function(e,r,i){if((r>>>=0)>i-1)throw new DOMException("Failed to execute '"+e+"' on 'TimeRanges': The index provided ("+r+") is greater than the maximum bound ("+i+")");return t[r][e]};this.buffered={get length(){return t.length},end:function(r){return e("end",r,t.length)},start:function(r){return e("start",r,t.length)}}},qn=function(t){function e(e){var r;return(r=t.call(this,e,"[subtitle-track-controller]")||this).media=null,r.tracks=[],r.groupIds=null,r.tracksInGroup=[],r.trackId=-1,r.currentTrack=null,r.selectDefaultTrack=!0,r.queuedDefaultTrack=-1,r.asyncPollTrackChange=function(){return r.pollTrackChange(0)},r.useTextTrackPolling=!1,r.subtitlePollingInterval=-1,r._subtitleDisplay=!0,r.onTextTracksChanged=function(){if(r.useTextTrackPolling||self.clearInterval(r.subtitlePollingInterval),r.media&&r.hls.config.renderTextTracksNatively){for(var t=null,e=Ue(r.media.textTracks),i=0;i<e.length;i++)if("hidden"===e[i].mode)t=e[i];else if("showing"===e[i].mode){t=e[i];break}var n=r.findTrackForTextTrack(t);r.subtitleTrack!==n&&r.setSubtitleTrack(n)}},r.registerListeners(),r}l(e,t);var r=e.prototype;return r.destroy=function(){this.unregisterListeners(),this.tracks.length=0,this.tracksInGroup.length=0,this.currentTrack=null,this.onTextTracksChanged=this.asyncPollTrackChange=null,t.prototype.destroy.call(this)},r.registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_PARSED,this.onManifestParsed,this),t.on(S.LEVEL_LOADING,this.onLevelLoading,this),t.on(S.LEVEL_SWITCHING,this.onLevelSwitching,this),t.on(S.SUBTITLE_TRACK_LOADED,this.onSubtitleTrackLoaded,this),t.on(S.ERROR,this.onError,this)},r.unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_PARSED,this.onManifestParsed,this),t.off(S.LEVEL_LOADING,this.onLevelLoading,this),t.off(S.LEVEL_SWITCHING,this.onLevelSwitching,this),t.off(S.SUBTITLE_TRACK_LOADED,this.onSubtitleTrackLoaded,this),t.off(S.ERROR,this.onError,this)},r.onMediaAttached=function(t,e){this.media=e.media,this.media&&(this.queuedDefaultTrack>-1&&(this.subtitleTrack=this.queuedDefaultTrack,this.queuedDefaultTrack=-1),this.useTextTrackPolling=!(this.media.textTracks&&"onchange"in this.media.textTracks),this.useTextTrackPolling?this.pollTrackChange(500):this.media.textTracks.addEventListener("change",this.asyncPollTrackChange))},r.pollTrackChange=function(t){self.clearInterval(this.subtitlePollingInterval),this.subtitlePollingInterval=self.setInterval(this.onTextTracksChanged,t)},r.onMediaDetaching=function(){this.media&&(self.clearInterval(this.subtitlePollingInterval),this.useTextTrackPolling||this.media.textTracks.removeEventListener("change",this.asyncPollTrackChange),this.trackId>-1&&(this.queuedDefaultTrack=this.trackId),Ue(this.media.textTracks).forEach((function(t){Oe(t)})),this.subtitleTrack=-1,this.media=null)},r.onManifestLoading=function(){this.tracks=[],this.groupIds=null,this.tracksInGroup=[],this.trackId=-1,this.currentTrack=null,this.selectDefaultTrack=!0},r.onManifestParsed=function(t,e){this.tracks=e.subtitleTracks},r.onSubtitleTrackLoaded=function(t,e){var r=e.id,i=e.groupId,n=e.details,a=this.tracksInGroup[r];if(a&&a.groupId===i){var s=a.details;a.details=e.details,this.log("Subtitle track "+r+' "'+a.name+'" lang:'+a.lang+" group:"+i+" loaded ["+n.startSN+"-"+n.endSN+"]"),r===this.trackId&&this.playlistLoaded(r,e,s)}else this.warn("Subtitle track with id:"+r+" and group:"+i+" not found in active group "+(null==a?void 0:a.groupId))},r.onLevelLoading=function(t,e){this.switchLevel(e.level)},r.onLevelSwitching=function(t,e){this.switchLevel(e.level)},r.switchLevel=function(t){var e=this.hls.levels[t];if(e){var r=e.subtitleGroups||null,i=this.groupIds,n=this.currentTrack;if(!r||(null==i?void 0:i.length)!==(null==r?void 0:r.length)||null!=r&&r.some((function(t){return-1===(null==i?void 0:i.indexOf(t))}))){this.groupIds=r,this.trackId=-1,this.currentTrack=null;var a=this.tracks.filter((function(t){return!r||-1!==r.indexOf(t.groupId)}));if(a.length)this.selectDefaultTrack&&!a.some((function(t){return t.default}))&&(this.selectDefaultTrack=!1),a.forEach((function(t,e){t.id=e}));else if(!n&&!this.tracksInGroup.length)return;this.tracksInGroup=a;var s=this.hls.config.subtitlePreference;if(!n&&s){this.selectDefaultTrack=!1;var o=Mr(s,a);if(o>-1)n=a[o];else{var l=Mr(s,this.tracks);n=this.tracks[l]}}var u=this.findTrackId(n);-1===u&&n&&(u=this.findTrackId(null));var h={subtitleTracks:a};this.log("Updating subtitle tracks, "+a.length+' track(s) found in "'+(null==r?void 0:r.join(","))+'" group-id'),this.hls.trigger(S.SUBTITLE_TRACKS_UPDATED,h),-1!==u&&-1===this.trackId&&this.setSubtitleTrack(u)}else this.shouldReloadPlaylist(n)&&this.setSubtitleTrack(this.trackId)}},r.findTrackId=function(t){for(var e=this.tracksInGroup,r=this.selectDefaultTrack,i=0;i<e.length;i++){var n=e[i];if((!r||n.default)&&(r||t)&&(!t||Or(n,t)))return i}if(t){for(var a=0;a<e.length;a++){var s=e[a];if(Kn(t.attrs,s.attrs,["LANGUAGE","ASSOC-LANGUAGE","CHARACTERISTICS"]))return a}for(var o=0;o<e.length;o++){var l=e[o];if(Kn(t.attrs,l.attrs,["LANGUAGE"]))return o}}return-1},r.findTrackForTextTrack=function(t){if(t)for(var e=this.tracksInGroup,r=0;r<e.length;r++)if(Hn(e[r],t))return r;return-1},r.onError=function(t,e){!e.fatal&&e.context&&(e.context.type!==De||e.context.id!==this.trackId||this.groupIds&&-1===this.groupIds.indexOf(e.context.groupId)||this.checkRetry(e))},r.setSubtitleOption=function(t){if(this.hls.config.subtitlePreference=t,t){var e=this.allSubtitleTracks;if(this.selectDefaultTrack=!1,e.length){var r=this.currentTrack;if(r&&Or(t,r))return r;var i=Mr(t,this.tracksInGroup);if(i>-1){var n=this.tracksInGroup[i];return this.setSubtitleTrack(i),n}if(r)return null;var a=Mr(t,e);if(a>-1)return e[a]}}return null},r.loadPlaylist=function(e){t.prototype.loadPlaylist.call(this);var r=this.currentTrack;if(this.shouldLoadPlaylist(r)&&r){var i=r.id,n=r.groupId,a=r.url;if(e)try{a=e.addDirectives(a)}catch(t){this.warn("Could not construct new URL with HLS Delivery Directives: "+t)}this.log("Loading subtitle playlist for id "+i),this.hls.trigger(S.SUBTITLE_TRACK_LOADING,{url:a,id:i,groupId:n,deliveryDirectives:e||null})}},r.toggleTrackModes=function(){var t=this.media;if(t){var e,r=Ue(t.textTracks),i=this.currentTrack;if(i&&((e=r.filter((function(t){return Hn(i,t)}))[0])||this.warn('Unable to find subtitle TextTrack with name "'+i.name+'" and language "'+i.lang+'"')),[].slice.call(r).forEach((function(t){"disabled"!==t.mode&&t!==e&&(t.mode="disabled")})),e){var n=this.subtitleDisplay?"showing":"hidden";e.mode!==n&&(e.mode=n)}}},r.setSubtitleTrack=function(t){var e=this.tracksInGroup;if(this.media)if(t<-1||t>=e.length||!y(t))this.warn("Invalid subtitle track id: "+t);else{this.clearTimer(),this.selectDefaultTrack=!1;var r=this.currentTrack,i=e[t]||null;if(this.trackId=t,this.currentTrack=i,this.toggleTrackModes(),i){var n=!!i.details&&!i.details.live;if(t!==this.trackId||i!==r||!n){this.log("Switching to subtitle-track "+t+(i?' "'+i.name+'" lang:'+i.lang+" group:"+i.groupId:""));var a=i.id,s=i.groupId,o=void 0===s?"":s,l=i.name,u=i.type,h=i.url;this.hls.trigger(S.SUBTITLE_TRACK_SWITCH,{id:a,groupId:o,name:l,type:u,url:h});var d=this.switchParams(i.url,null==r?void 0:r.details);this.loadPlaylist(d)}}else this.hls.trigger(S.SUBTITLE_TRACK_SWITCH,{id:t})}else this.queuedDefaultTrack=t},s(e,[{key:"subtitleDisplay",get:function(){return this._subtitleDisplay},set:function(t){this._subtitleDisplay=t,this.trackId>-1&&this.toggleTrackModes()}},{key:"allSubtitleTracks",get:function(){return this.tracks}},{key:"subtitleTracks",get:function(){return this.tracksInGroup}},{key:"subtitleTrack",get:function(){return this.trackId},set:function(t){this.selectDefaultTrack=!1,this.setSubtitleTrack(t)}}]),e}(Dr),Xn=function(){function t(t){this.buffers=void 0,this.queues={video:[],audio:[],audiovideo:[]},this.buffers=t}var e=t.prototype;return e.append=function(t,e,r){var i=this.queues[e];i.push(t),1!==i.length||r||this.executeNext(e)},e.insertAbort=function(t,e){this.queues[e].unshift(t),this.executeNext(e)},e.appendBlocker=function(t){var e,r=new Promise((function(t){e=t})),i={execute:e,onStart:function(){},onComplete:function(){},onError:function(){}};return this.append(i,t),r},e.executeNext=function(t){var e=this.queues[t];if(e.length){var r=e[0];try{r.execute()}catch(e){w.warn('[buffer-operation-queue]: Exception executing "'+t+'" SourceBuffer operation: '+e),r.onError(e);var i=this.buffers[t];null!=i&&i.updating||this.shiftAndExecuteNext(t)}}},e.shiftAndExecuteNext=function(t){this.queues[t].shift(),this.executeNext(t)},e.current=function(t){return this.queues[t][0]},t}(),zn=/(avc[1234]|hvc1|hev1|dvh[1e]|vp09|av01)(?:\.[^.,]+)+/,Qn=function(){function t(t){var e=this;this.details=null,this._objectUrl=null,this.operationQueue=void 0,this.listeners=void 0,this.hls=void 0,this.bufferCodecEventsExpected=0,this._bufferCodecEventsTotal=0,this.media=null,this.mediaSource=null,this.lastMpegAudioChunk=null,this.appendSource=void 0,this.appendErrors={audio:0,video:0,audiovideo:0},this.tracks={},this.pendingTracks={},this.sourceBuffer=void 0,this.log=void 0,this.warn=void 0,this.error=void 0,this._onEndStreaming=function(t){e.hls&&e.hls.pauseBuffering()},this._onStartStreaming=function(t){e.hls&&e.hls.resumeBuffering()},this._onMediaSourceOpen=function(){var t=e.media,r=e.mediaSource;e.log("Media source opened"),t&&(t.removeEventListener("emptied",e._onMediaEmptied),e.updateMediaElementDuration(),e.hls.trigger(S.MEDIA_ATTACHED,{media:t,mediaSource:r})),r&&r.removeEventListener("sourceopen",e._onMediaSourceOpen),e.checkPendingTracks()},this._onMediaSourceClose=function(){e.log("Media source closed")},this._onMediaSourceEnded=function(){e.log("Media source ended")},this._onMediaEmptied=function(){var t=e.mediaSrc,r=e._objectUrl;t!==r&&w.error("Media element src was set while attaching MediaSource ("+r+" > "+t+")")},this.hls=t;var r="[buffer-controller]";this.appendSource=t.config.preferManagedMediaSource,this.log=w.log.bind(w,r),this.warn=w.warn.bind(w,r),this.error=w.error.bind(w,r),this._initSourceBuffer(),this.registerListeners()}var e=t.prototype;return e.hasSourceTypes=function(){return this.getSourceBufferTypes().length>0||Object.keys(this.pendingTracks).length>0},e.destroy=function(){this.unregisterListeners(),this.details=null,this.lastMpegAudioChunk=null,this.hls=null},e.registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHING,this.onMediaAttaching,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_PARSED,this.onManifestParsed,this),t.on(S.BUFFER_RESET,this.onBufferReset,this),t.on(S.BUFFER_APPENDING,this.onBufferAppending,this),t.on(S.BUFFER_CODECS,this.onBufferCodecs,this),t.on(S.BUFFER_EOS,this.onBufferEos,this),t.on(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.on(S.LEVEL_UPDATED,this.onLevelUpdated,this),t.on(S.FRAG_PARSED,this.onFragParsed,this),t.on(S.FRAG_CHANGED,this.onFragChanged,this)},e.unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHING,this.onMediaAttaching,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_PARSED,this.onManifestParsed,this),t.off(S.BUFFER_RESET,this.onBufferReset,this),t.off(S.BUFFER_APPENDING,this.onBufferAppending,this),t.off(S.BUFFER_CODECS,this.onBufferCodecs,this),t.off(S.BUFFER_EOS,this.onBufferEos,this),t.off(S.BUFFER_FLUSHING,this.onBufferFlushing,this),t.off(S.LEVEL_UPDATED,this.onLevelUpdated,this),t.off(S.FRAG_PARSED,this.onFragParsed,this),t.off(S.FRAG_CHANGED,this.onFragChanged,this)},e._initSourceBuffer=function(){this.sourceBuffer={},this.operationQueue=new Xn(this.sourceBuffer),this.listeners={audio:[],video:[],audiovideo:[]},this.appendErrors={audio:0,video:0,audiovideo:0},this.lastMpegAudioChunk=null},e.onManifestLoading=function(){this.bufferCodecEventsExpected=this._bufferCodecEventsTotal=0,this.details=null},e.onManifestParsed=function(t,e){var r=2;(e.audio&&!e.video||!e.altAudio)&&(r=1),this.bufferCodecEventsExpected=this._bufferCodecEventsTotal=r,this.log(this.bufferCodecEventsExpected+" bufferCodec event(s) expected")},e.onMediaAttaching=function(t,e){var r=this.media=e.media,i=te(this.appendSource);if(r&&i){var n,a=this.mediaSource=new i;this.log("created media source: "+(null==(n=a.constructor)?void 0:n.name)),a.addEventListener("sourceopen",this._onMediaSourceOpen),a.addEventListener("sourceended",this._onMediaSourceEnded),a.addEventListener("sourceclose",this._onMediaSourceClose),a.addEventListener("startstreaming",this._onStartStreaming),a.addEventListener("endstreaming",this._onEndStreaming);var s=this._objectUrl=self.URL.createObjectURL(a);if(this.appendSource)try{r.removeAttribute("src");var o=self.ManagedMediaSource;r.disableRemotePlayback=r.disableRemotePlayback||o&&a instanceof o,Jn(r),function(t,e){var r=self.document.createElement("source");r.type="video/mp4",r.src=e,t.appendChild(r)}(r,s),r.load()}catch(t){r.src=s}else r.src=s;r.addEventListener("emptied",this._onMediaEmptied)}},e.onMediaDetaching=function(){var t=this.media,e=this.mediaSource,r=this._objectUrl;if(e){if(this.log("media source detaching"),"open"===e.readyState)try{e.endOfStream()}catch(t){this.warn("onMediaDetaching: "+t.message+" while calling endOfStream")}this.onBufferReset(),e.removeEventListener("sourceopen",this._onMediaSourceOpen),e.removeEventListener("sourceended",this._onMediaSourceEnded),e.removeEventListener("sourceclose",this._onMediaSourceClose),e.removeEventListener("startstreaming",this._onStartStreaming),e.removeEventListener("endstreaming",this._onEndStreaming),t&&(t.removeEventListener("emptied",this._onMediaEmptied),r&&self.URL.revokeObjectURL(r),this.mediaSrc===r?(t.removeAttribute("src"),this.appendSource&&Jn(t),t.load()):this.warn("media|source.src was changed by a third party - skip cleanup")),this.mediaSource=null,this.media=null,this._objectUrl=null,this.bufferCodecEventsExpected=this._bufferCodecEventsTotal,this.pendingTracks={},this.tracks={}}this.hls.trigger(S.MEDIA_DETACHED,void 0)},e.onBufferReset=function(){var t=this;this.getSourceBufferTypes().forEach((function(e){t.resetBuffer(e)})),this._initSourceBuffer()},e.resetBuffer=function(t){var e=this.sourceBuffer[t];try{var r;e&&(this.removeBufferListeners(t),this.sourceBuffer[t]=void 0,null!=(r=this.mediaSource)&&r.sourceBuffers.length&&this.mediaSource.removeSourceBuffer(e))}catch(e){this.warn("onBufferReset "+t,e)}},e.onBufferCodecs=function(t,e){var r=this,i=this.getSourceBufferTypes().length,n=Object.keys(e);if(n.forEach((function(t){if(i){var n=r.tracks[t];if(n&&"function"==typeof n.buffer.changeType){var a,s=e[t],o=s.id,l=s.codec,u=s.levelCodec,h=s.container,d=s.metadata,c=he(n.codec,n.levelCodec),f=null==c?void 0:c.replace(zn,"$1"),g=he(l,u),v=null==(a=g)?void 0:a.replace(zn,"$1");if(g&&f!==v){"audio"===t.slice(0,5)&&(g=ue(g,r.hls.config.preferManagedMediaSource));var m=h+";codecs="+g;r.appendChangeType(t,m),r.log("switching codec "+c+" to "+g),r.tracks[t]={buffer:n.buffer,codec:l,container:h,levelCodec:u,metadata:d,id:o}}}}else r.pendingTracks[t]=e[t]})),!i){var a=Math.max(this.bufferCodecEventsExpected-1,0);this.bufferCodecEventsExpected!==a&&(this.log(a+" bufferCodec event(s) expected "+n.join(",")),this.bufferCodecEventsExpected=a),this.mediaSource&&"open"===this.mediaSource.readyState&&this.checkPendingTracks()}},e.appendChangeType=function(t,e){var r=this,i=this.operationQueue,n={execute:function(){var n=r.sourceBuffer[t];n&&(r.log("changing "+t+" sourceBuffer type to "+e),n.changeType(e)),i.shiftAndExecuteNext(t)},onStart:function(){},onComplete:function(){},onError:function(e){r.warn("Failed to change "+t+" SourceBuffer type",e)}};i.append(n,t,!!this.pendingTracks[t])},e.onBufferAppending=function(t,e){var r=this,i=this.hls,n=this.operationQueue,a=this.tracks,s=e.data,o=e.type,l=e.frag,u=e.part,h=e.chunkMeta,d=h.buffering[o],c=self.performance.now();d.start=c;var f=l.stats.buffering,g=u?u.stats.buffering:null;0===f.start&&(f.start=c),g&&0===g.start&&(g.start=c);var v=a.audio,m=!1;"audio"===o&&"audio/mpeg"===(null==v?void 0:v.container)&&(m=!this.lastMpegAudioChunk||1===h.id||this.lastMpegAudioChunk.sn!==h.sn,this.lastMpegAudioChunk=h);var p=l.start,y={execute:function(){if(d.executeStart=self.performance.now(),m){var t=r.sourceBuffer[o];if(t){var e=p-t.timestampOffset;Math.abs(e)>=.1&&(r.log("Updating audio SourceBuffer timestampOffset to "+p+" (delta: "+e+") sn: "+l.sn+")"),t.timestampOffset=p)}}r.appendExecutor(s,o)},onStart:function(){},onComplete:function(){var t=self.performance.now();d.executeEnd=d.end=t,0===f.first&&(f.first=t),g&&0===g.first&&(g.first=t);var e=r.sourceBuffer,i={};for(var n in e)i[n]=zr.getBuffered(e[n]);r.appendErrors[o]=0,"audio"===o||"video"===o?r.appendErrors.audiovideo=0:(r.appendErrors.audio=0,r.appendErrors.video=0),r.hls.trigger(S.BUFFER_APPENDED,{type:o,frag:l,part:u,chunkMeta:h,parent:l.type,timeRanges:i})},onError:function(t){var e={type:L.MEDIA_ERROR,parent:l.type,details:A.BUFFER_APPEND_ERROR,sourceBufferName:o,frag:l,part:u,chunkMeta:h,error:t,err:t,fatal:!1};if(t.code===DOMException.QUOTA_EXCEEDED_ERR)e.details=A.BUFFER_FULL_ERROR;else{var n=++r.appendErrors[o];e.details=A.BUFFER_APPEND_ERROR,r.warn("Failed "+n+"/"+i.config.appendErrorMaxRetry+' times to append segment in "'+o+'" sourceBuffer'),n>=i.config.appendErrorMaxRetry&&(e.fatal=!0)}i.trigger(S.ERROR,e)}};n.append(y,o,!!this.pendingTracks[o])},e.onBufferFlushing=function(t,e){var r=this,i=this.operationQueue,n=function(t){return{execute:r.removeExecutor.bind(r,t,e.startOffset,e.endOffset),onStart:function(){},onComplete:function(){r.hls.trigger(S.BUFFER_FLUSHED,{type:t})},onError:function(e){r.warn("Failed to remove from "+t+" SourceBuffer",e)}}};e.type?i.append(n(e.type),e.type):this.getSourceBufferTypes().forEach((function(t){i.append(n(t),t)}))},e.onFragParsed=function(t,e){var r=this,i=e.frag,n=e.part,a=[],s=n?n.elementaryStreams:i.elementaryStreams;s[U]?a.push("audiovideo"):(s[O]&&a.push("audio"),s[N]&&a.push("video")),0===a.length&&this.warn("Fragments must have at least one ElementaryStreamType set. type: "+i.type+" level: "+i.level+" sn: "+i.sn),this.blockBuffers((function(){var t=self.performance.now();i.stats.buffering.end=t,n&&(n.stats.buffering.end=t);var e=n?n.stats:i.stats;r.hls.trigger(S.FRAG_BUFFERED,{frag:i,part:n,stats:e,id:i.type})}),a)},e.onFragChanged=function(t,e){this.trimBuffers()},e.onBufferEos=function(t,e){var r=this;this.getSourceBufferTypes().reduce((function(t,i){var n=r.sourceBuffer[i];return!n||e.type&&e.type!==i||(n.ending=!0,n.ended||(n.ended=!0,r.log(i+" sourceBuffer now EOS"))),t&&!(n&&!n.ended)}),!0)&&(this.log("Queueing mediaSource.endOfStream()"),this.blockBuffers((function(){r.getSourceBufferTypes().forEach((function(t){var e=r.sourceBuffer[t];e&&(e.ending=!1)}));var t=r.mediaSource;t&&"open"===t.readyState?(r.log("Calling mediaSource.endOfStream()"),t.endOfStream()):t&&r.log("Could not call mediaSource.endOfStream(). mediaSource.readyState: "+t.readyState)})))},e.onLevelUpdated=function(t,e){var r=e.details;r.fragments.length&&(this.details=r,this.getSourceBufferTypes().length?this.blockBuffers(this.updateMediaElementDuration.bind(this)):this.updateMediaElementDuration())},e.trimBuffers=function(){var t=this.hls,e=this.details,r=this.media;if(r&&null!==e&&this.getSourceBufferTypes().length){var i=t.config,n=r.currentTime,a=e.levelTargetDuration,s=e.live&&null!==i.liveBackBufferLength?i.liveBackBufferLength:i.backBufferLength;if(y(s)&&s>0){var o=Math.max(s,a),l=Math.floor(n/a)*a-o;this.flushBackBuffer(n,a,l)}if(y(i.frontBufferFlushThreshold)&&i.frontBufferFlushThreshold>0){var u=Math.max(i.maxBufferLength,i.frontBufferFlushThreshold),h=Math.max(u,a),d=Math.floor(n/a)*a+h;this.flushFrontBuffer(n,a,d)}}},e.flushBackBuffer=function(t,e,r){var i=this,n=this.details,a=this.sourceBuffer;this.getSourceBufferTypes().forEach((function(s){var o=a[s];if(o){var l=zr.getBuffered(o);if(l.length>0&&r>l.start(0)){if(i.hls.trigger(S.BACK_BUFFER_REACHED,{bufferEnd:r}),null!=n&&n.live)i.hls.trigger(S.LIVE_BACK_BUFFER_REACHED,{bufferEnd:r});else if(o.ended&&l.end(l.length-1)-t<2*e)return void i.log("Cannot flush "+s+" back buffer while SourceBuffer is in ended state");i.hls.trigger(S.BUFFER_FLUSHING,{startOffset:0,endOffset:r,type:s})}}}))},e.flushFrontBuffer=function(t,e,r){var i=this,n=this.sourceBuffer;this.getSourceBufferTypes().forEach((function(a){var s=n[a];if(s){var o=zr.getBuffered(s),l=o.length;if(l<2)return;var u=o.start(l-1),h=o.end(l-1);if(r>u||t>=u&&t<=h)return;if(s.ended&&t-h<2*e)return void i.log("Cannot flush "+a+" front buffer while SourceBuffer is in ended state");i.hls.trigger(S.BUFFER_FLUSHING,{startOffset:u,endOffset:1/0,type:a})}}))},e.updateMediaElementDuration=function(){if(this.details&&this.media&&this.mediaSource&&"open"===this.mediaSource.readyState){var t=this.details,e=this.hls,r=this.media,i=this.mediaSource,n=t.fragments[0].start+t.totalduration,a=r.duration,s=y(i.duration)?i.duration:0;t.live&&e.config.liveDurationInfinity?(i.duration=1/0,this.updateSeekableRange(t)):(n>s&&n>a||!y(a))&&(this.log("Updating Media Source duration to "+n.toFixed(3)),i.duration=n)}},e.updateSeekableRange=function(t){var e=this.mediaSource,r=t.fragments;if(r.length&&t.live&&null!=e&&e.setLiveSeekableRange){var i=Math.max(0,r[0].start),n=Math.max(i,i+t.totalduration);this.log("Media Source duration is set to "+e.duration+". Setting seekable range to "+i+"-"+n+"."),e.setLiveSeekableRange(i,n)}},e.checkPendingTracks=function(){var t=this.bufferCodecEventsExpected,e=this.operationQueue,r=this.pendingTracks,i=Object.keys(r).length;if(i&&(!t||2===i||"audiovideo"in r)){this.createSourceBuffers(r),this.pendingTracks={};var n=this.getSourceBufferTypes();if(n.length)this.hls.trigger(S.BUFFER_CREATED,{tracks:this.tracks}),n.forEach((function(t){e.executeNext(t)}));else{var a=new Error("could not create source buffer for media codec(s)");this.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_INCOMPATIBLE_CODECS_ERROR,fatal:!0,error:a,reason:a.message})}}},e.createSourceBuffers=function(t){var e=this,r=this.sourceBuffer,i=this.mediaSource;if(!i)throw Error("createSourceBuffers called when mediaSource was null");var n=function(n){if(!r[n]){var a=t[n];if(!a)throw Error("source buffer exists for track "+n+", however track does not");var s=a.levelCodec||a.codec;s&&"audio"===n.slice(0,5)&&(s=ue(s,e.hls.config.preferManagedMediaSource));var o=a.container+";codecs="+s;e.log("creating sourceBuffer("+o+")");try{var l=r[n]=i.addSourceBuffer(o),u=n;e.addBufferListener(u,"updatestart",e._onSBUpdateStart),e.addBufferListener(u,"updateend",e._onSBUpdateEnd),e.addBufferListener(u,"error",e._onSBUpdateError),e.addBufferListener(u,"bufferedchange",(function(t,r){var i=r.removedRanges;null!=i&&i.length&&e.hls.trigger(S.BUFFER_FLUSHED,{type:n})})),e.tracks[n]={buffer:l,codec:s,container:a.container,levelCodec:a.levelCodec,metadata:a.metadata,id:a.id}}catch(t){e.error("error while trying to add sourceBuffer: "+t.message),e.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_ADD_CODEC_ERROR,fatal:!1,error:t,sourceBufferName:n,mimeType:o})}}};for(var a in t)n(a)},e._onSBUpdateStart=function(t){this.operationQueue.current(t).onStart()},e._onSBUpdateEnd=function(t){var e;if("closed"!==(null==(e=this.mediaSource)?void 0:e.readyState)){var r=this.operationQueue;r.current(t).onComplete(),r.shiftAndExecuteNext(t)}else this.resetBuffer(t)},e._onSBUpdateError=function(t,e){var r,i=new Error(t+" SourceBuffer error. MediaSource readyState: "+(null==(r=this.mediaSource)?void 0:r.readyState));this.error(""+i,e),this.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_APPENDING_ERROR,sourceBufferName:t,error:i,fatal:!1});var n=this.operationQueue.current(t);n&&n.onError(i)},e.removeExecutor=function(t,e,r){var i=this.media,n=this.mediaSource,a=this.operationQueue,s=this.sourceBuffer[t];if(!i||!n||!s)return this.warn("Attempting to remove from the "+t+" SourceBuffer, but it does not exist"),void a.shiftAndExecuteNext(t);var o=y(i.duration)?i.duration:1/0,l=y(n.duration)?n.duration:1/0,u=Math.max(0,e),h=Math.min(r,o,l);h>u&&(!s.ending||s.ended)?(s.ended=!1,this.log("Removing ["+u+","+h+"] from the "+t+" SourceBuffer"),s.remove(u,h)):a.shiftAndExecuteNext(t)},e.appendExecutor=function(t,e){var r=this.sourceBuffer[e];if(r)r.ended=!1,r.appendBuffer(t);else if(!this.pendingTracks[e])throw new Error("Attempting to append to the "+e+" SourceBuffer, but it does not exist")},e.blockBuffers=function(t,e){var r=this;if(void 0===e&&(e=this.getSourceBufferTypes()),!e.length)return this.log("Blocking operation requested, but no SourceBuffers exist"),void Promise.resolve().then(t);var i=this.operationQueue,n=e.map((function(t){return i.appendBlocker(t)}));Promise.all(n).then((function(){t(),e.forEach((function(t){var e=r.sourceBuffer[t];null!=e&&e.updating||i.shiftAndExecuteNext(t)}))}))},e.getSourceBufferTypes=function(){return Object.keys(this.sourceBuffer)},e.addBufferListener=function(t,e,r){var i=this.sourceBuffer[t];if(i){var n=r.bind(this,t);this.listeners[t].push({event:e,listener:n}),i.addEventListener(e,n)}},e.removeBufferListeners=function(t){var e=this.sourceBuffer[t];e&&this.listeners[t].forEach((function(t){e.removeEventListener(t.event,t.listener)}))},s(t,[{key:"mediaSrc",get:function(){var t,e=(null==(t=this.media)?void 0:t.firstChild)||this.media;return null==e?void 0:e.src}}]),t}();function Jn(t){var e=t.querySelectorAll("source");[].slice.call(e).forEach((function(e){t.removeChild(e)}))}var $n={42:225,92:233,94:237,95:243,96:250,123:231,124:247,125:209,126:241,127:9608,128:174,129:176,130:189,131:191,132:8482,133:162,134:163,135:9834,136:224,137:32,138:232,139:226,140:234,141:238,142:244,143:251,144:193,145:201,146:211,147:218,148:220,149:252,150:8216,151:161,152:42,153:8217,154:9473,155:169,156:8480,157:8226,158:8220,159:8221,160:192,161:194,162:199,163:200,164:202,165:203,166:235,167:206,168:207,169:239,170:212,171:217,172:249,173:219,174:171,175:187,176:195,177:227,178:205,179:204,180:236,181:210,182:242,183:213,184:245,185:123,186:125,187:92,188:94,189:95,190:124,191:8764,192:196,193:228,194:214,195:246,196:223,197:165,198:164,199:9475,200:197,201:229,202:216,203:248,204:9487,205:9491,206:9495,207:9499},Zn=function(t){var e=t;return $n.hasOwnProperty(t)&&(e=$n[t]),String.fromCharCode(e)},ta=15,ea=100,ra={17:1,18:3,21:5,22:7,23:9,16:11,19:12,20:14},ia={17:2,18:4,21:6,22:8,23:10,19:13,20:15},na={25:1,26:3,29:5,30:7,31:9,24:11,27:12,28:14},aa={25:2,26:4,29:6,30:8,31:10,27:13,28:15},sa=["white","green","blue","cyan","red","yellow","magenta","black","transparent"],oa=function(){function t(){this.time=null,this.verboseLevel=0}return t.prototype.log=function(t,e){if(this.verboseLevel>=t){var r="function"==typeof e?e():e;w.log(this.time+" ["+t+"] "+r)}},t}(),la=function(t){for(var e=[],r=0;r<t.length;r++)e.push(t[r].toString(16));return e},ua=function(){function t(){this.foreground="white",this.underline=!1,this.italics=!1,this.background="black",this.flash=!1}var e=t.prototype;return e.reset=function(){this.foreground="white",this.underline=!1,this.italics=!1,this.background="black",this.flash=!1},e.setStyles=function(t){for(var e=["foreground","underline","italics","background","flash"],r=0;r<e.length;r++){var i=e[r];t.hasOwnProperty(i)&&(this[i]=t[i])}},e.isDefault=function(){return"white"===this.foreground&&!this.underline&&!this.italics&&"black"===this.background&&!this.flash},e.equals=function(t){return this.foreground===t.foreground&&this.underline===t.underline&&this.italics===t.italics&&this.background===t.background&&this.flash===t.flash},e.copy=function(t){this.foreground=t.foreground,this.underline=t.underline,this.italics=t.italics,this.background=t.background,this.flash=t.flash},e.toString=function(){return"color="+this.foreground+", underline="+this.underline+", italics="+this.italics+", background="+this.background+", flash="+this.flash},t}(),ha=function(){function t(){this.uchar=" ",this.penState=new ua}var e=t.prototype;return e.reset=function(){this.uchar=" ",this.penState.reset()},e.setChar=function(t,e){this.uchar=t,this.penState.copy(e)},e.setPenState=function(t){this.penState.copy(t)},e.equals=function(t){return this.uchar===t.uchar&&this.penState.equals(t.penState)},e.copy=function(t){this.uchar=t.uchar,this.penState.copy(t.penState)},e.isEmpty=function(){return" "===this.uchar&&this.penState.isDefault()},t}(),da=function(){function t(t){this.chars=[],this.pos=0,this.currPenState=new ua,this.cueStartTime=null,this.logger=void 0;for(var e=0;e<ea;e++)this.chars.push(new ha);this.logger=t}var e=t.prototype;return e.equals=function(t){for(var e=0;e<ea;e++)if(!this.chars[e].equals(t.chars[e]))return!1;return!0},e.copy=function(t){for(var e=0;e<ea;e++)this.chars[e].copy(t.chars[e])},e.isEmpty=function(){for(var t=!0,e=0;e<ea;e++)if(!this.chars[e].isEmpty()){t=!1;break}return t},e.setCursor=function(t){this.pos!==t&&(this.pos=t),this.pos<0?(this.logger.log(3,"Negative cursor position "+this.pos),this.pos=0):this.pos>ea&&(this.logger.log(3,"Too large cursor position "+this.pos),this.pos=ea)},e.moveCursor=function(t){var e=this.pos+t;if(t>1)for(var r=this.pos+1;r<e+1;r++)this.chars[r].setPenState(this.currPenState);this.setCursor(e)},e.backSpace=function(){this.moveCursor(-1),this.chars[this.pos].setChar(" ",this.currPenState)},e.insertChar=function(t){var e=this;t>=144&&this.backSpace();var r=Zn(t);this.pos>=ea?this.logger.log(0,(function(){return"Cannot insert "+t.toString(16)+" ("+r+") at position "+e.pos+". Skipping it!"})):(this.chars[this.pos].setChar(r,this.currPenState),this.moveCursor(1))},e.clearFromPos=function(t){var e;for(e=t;e<ea;e++)this.chars[e].reset()},e.clear=function(){this.clearFromPos(0),this.pos=0,this.currPenState.reset()},e.clearToEndOfRow=function(){this.clearFromPos(this.pos)},e.getTextString=function(){for(var t=[],e=!0,r=0;r<ea;r++){var i=this.chars[r].uchar;" "!==i&&(e=!1),t.push(i)}return e?"":t.join("")},e.setPenStyles=function(t){this.currPenState.setStyles(t),this.chars[this.pos].setPenState(this.currPenState)},t}(),ca=function(){function t(t){this.rows=[],this.currRow=14,this.nrRollUpRows=null,this.lastOutputScreen=null,this.logger=void 0;for(var e=0;e<ta;e++)this.rows.push(new da(t));this.logger=t}var e=t.prototype;return e.reset=function(){for(var t=0;t<ta;t++)this.rows[t].clear();this.currRow=14},e.equals=function(t){for(var e=!0,r=0;r<ta;r++)if(!this.rows[r].equals(t.rows[r])){e=!1;break}return e},e.copy=function(t){for(var e=0;e<ta;e++)this.rows[e].copy(t.rows[e])},e.isEmpty=function(){for(var t=!0,e=0;e<ta;e++)if(!this.rows[e].isEmpty()){t=!1;break}return t},e.backSpace=function(){this.rows[this.currRow].backSpace()},e.clearToEndOfRow=function(){this.rows[this.currRow].clearToEndOfRow()},e.insertChar=function(t){this.rows[this.currRow].insertChar(t)},e.setPen=function(t){this.rows[this.currRow].setPenStyles(t)},e.moveCursor=function(t){this.rows[this.currRow].moveCursor(t)},e.setCursor=function(t){this.logger.log(2,"setCursor: "+t),this.rows[this.currRow].setCursor(t)},e.setPAC=function(t){this.logger.log(2,(function(){return"pacData = "+JSON.stringify(t)}));var e=t.row-1;if(this.nrRollUpRows&&e<this.nrRollUpRows-1&&(e=this.nrRollUpRows-1),this.nrRollUpRows&&this.currRow!==e){for(var r=0;r<ta;r++)this.rows[r].clear();var i=this.currRow+1-this.nrRollUpRows,n=this.lastOutputScreen;if(n){var a=n.rows[i].cueStartTime,s=this.logger.time;if(null!==a&&null!==s&&a<s)for(var o=0;o<this.nrRollUpRows;o++)this.rows[e-this.nrRollUpRows+o+1].copy(n.rows[i+o])}}this.currRow=e;var l=this.rows[this.currRow];if(null!==t.indent){var u=t.indent,h=Math.max(u-1,0);l.setCursor(t.indent),t.color=l.chars[h].penState.foreground}var d={foreground:t.color,underline:t.underline,italics:t.italics,background:"black",flash:!1};this.setPen(d)},e.setBkgData=function(t){this.logger.log(2,(function(){return"bkgData = "+JSON.stringify(t)})),this.backSpace(),this.setPen(t),this.insertChar(32)},e.setRollUpRows=function(t){this.nrRollUpRows=t},e.rollUp=function(){var t=this;if(null!==this.nrRollUpRows){this.logger.log(1,(function(){return t.getDisplayText()}));var e=this.currRow+1-this.nrRollUpRows,r=this.rows.splice(e,1)[0];r.clear(),this.rows.splice(this.currRow,0,r),this.logger.log(2,"Rolling up")}else this.logger.log(3,"roll_up but nrRollUpRows not set yet")},e.getDisplayText=function(t){t=t||!1;for(var e=[],r="",i=-1,n=0;n<ta;n++){var a=this.rows[n].getTextString();a&&(i=n+1,t?e.push("Row "+i+": '"+a+"'"):e.push(a.trim()))}return e.length>0&&(r=t?"["+e.join(" | ")+"]":e.join("\n")),r},e.getTextAndFormat=function(){return this.rows},t}(),fa=function(){function t(t,e,r){this.chNr=void 0,this.outputFilter=void 0,this.mode=void 0,this.verbose=void 0,this.displayedMemory=void 0,this.nonDisplayedMemory=void 0,this.lastOutputScreen=void 0,this.currRollUpRow=void 0,this.writeScreen=void 0,this.cueStartTime=void 0,this.logger=void 0,this.chNr=t,this.outputFilter=e,this.mode=null,this.verbose=0,this.displayedMemory=new ca(r),this.nonDisplayedMemory=new ca(r),this.lastOutputScreen=new ca(r),this.currRollUpRow=this.displayedMemory.rows[14],this.writeScreen=this.displayedMemory,this.mode=null,this.cueStartTime=null,this.logger=r}var e=t.prototype;return e.reset=function(){this.mode=null,this.displayedMemory.reset(),this.nonDisplayedMemory.reset(),this.lastOutputScreen.reset(),this.outputFilter.reset(),this.currRollUpRow=this.displayedMemory.rows[14],this.writeScreen=this.displayedMemory,this.mode=null,this.cueStartTime=null},e.getHandler=function(){return this.outputFilter},e.setHandler=function(t){this.outputFilter=t},e.setPAC=function(t){this.writeScreen.setPAC(t)},e.setBkgData=function(t){this.writeScreen.setBkgData(t)},e.setMode=function(t){t!==this.mode&&(this.mode=t,this.logger.log(2,(function(){return"MODE="+t})),"MODE_POP-ON"===this.mode?this.writeScreen=this.nonDisplayedMemory:(this.writeScreen=this.displayedMemory,this.writeScreen.reset()),"MODE_ROLL-UP"!==this.mode&&(this.displayedMemory.nrRollUpRows=null,this.nonDisplayedMemory.nrRollUpRows=null),this.mode=t)},e.insertChars=function(t){for(var e=this,r=0;r<t.length;r++)this.writeScreen.insertChar(t[r]);var i=this.writeScreen===this.displayedMemory?"DISP":"NON_DISP";this.logger.log(2,(function(){return i+": "+e.writeScreen.getDisplayText(!0)})),"MODE_PAINT-ON"!==this.mode&&"MODE_ROLL-UP"!==this.mode||(this.logger.log(1,(function(){return"DISPLAYED: "+e.displayedMemory.getDisplayText(!0)})),this.outputDataUpdate())},e.ccRCL=function(){this.logger.log(2,"RCL - Resume Caption Loading"),this.setMode("MODE_POP-ON")},e.ccBS=function(){this.logger.log(2,"BS - BackSpace"),"MODE_TEXT"!==this.mode&&(this.writeScreen.backSpace(),this.writeScreen===this.displayedMemory&&this.outputDataUpdate())},e.ccAOF=function(){},e.ccAON=function(){},e.ccDER=function(){this.logger.log(2,"DER- Delete to End of Row"),this.writeScreen.clearToEndOfRow(),this.outputDataUpdate()},e.ccRU=function(t){this.logger.log(2,"RU("+t+") - Roll Up"),this.writeScreen=this.displayedMemory,this.setMode("MODE_ROLL-UP"),this.writeScreen.setRollUpRows(t)},e.ccFON=function(){this.logger.log(2,"FON - Flash On"),this.writeScreen.setPen({flash:!0})},e.ccRDC=function(){this.logger.log(2,"RDC - Resume Direct Captioning"),this.setMode("MODE_PAINT-ON")},e.ccTR=function(){this.logger.log(2,"TR"),this.setMode("MODE_TEXT")},e.ccRTD=function(){this.logger.log(2,"RTD"),this.setMode("MODE_TEXT")},e.ccEDM=function(){this.logger.log(2,"EDM - Erase Displayed Memory"),this.displayedMemory.reset(),this.outputDataUpdate(!0)},e.ccCR=function(){this.logger.log(2,"CR - Carriage Return"),this.writeScreen.rollUp(),this.outputDataUpdate(!0)},e.ccENM=function(){this.logger.log(2,"ENM - Erase Non-displayed Memory"),this.nonDisplayedMemory.reset()},e.ccEOC=function(){var t=this;if(this.logger.log(2,"EOC - End Of Caption"),"MODE_POP-ON"===this.mode){var e=this.displayedMemory;this.displayedMemory=this.nonDisplayedMemory,this.nonDisplayedMemory=e,this.writeScreen=this.nonDisplayedMemory,this.logger.log(1,(function(){return"DISP: "+t.displayedMemory.getDisplayText()}))}this.outputDataUpdate(!0)},e.ccTO=function(t){this.logger.log(2,"TO("+t+") - Tab Offset"),this.writeScreen.moveCursor(t)},e.ccMIDROW=function(t){var e={flash:!1};if(e.underline=t%2==1,e.italics=t>=46,e.italics)e.foreground="white";else{var r=Math.floor(t/2)-16;e.foreground=["white","green","blue","cyan","red","yellow","magenta"][r]}this.logger.log(2,"MIDROW: "+JSON.stringify(e)),this.writeScreen.setPen(e)},e.outputDataUpdate=function(t){void 0===t&&(t=!1);var e=this.logger.time;null!==e&&this.outputFilter&&(null!==this.cueStartTime||this.displayedMemory.isEmpty()?this.displayedMemory.equals(this.lastOutputScreen)||(this.outputFilter.newCue(this.cueStartTime,e,this.lastOutputScreen),t&&this.outputFilter.dispatchCue&&this.outputFilter.dispatchCue(),this.cueStartTime=this.displayedMemory.isEmpty()?null:e):this.cueStartTime=e,this.lastOutputScreen.copy(this.displayedMemory))},e.cueSplitAtTime=function(t){this.outputFilter&&(this.displayedMemory.isEmpty()||(this.outputFilter.newCue&&this.outputFilter.newCue(this.cueStartTime,t,this.displayedMemory),this.cueStartTime=t))},t}(),ga=function(){function t(t,e,r){this.channels=void 0,this.currentChannel=0,this.cmdHistory={a:null,b:null},this.logger=void 0;var i=this.logger=new oa;this.channels=[null,new fa(t,e,i),new fa(t+1,r,i)]}var e=t.prototype;return e.getHandler=function(t){return this.channels[t].getHandler()},e.setHandler=function(t,e){this.channels[t].setHandler(e)},e.addData=function(t,e){var r,i,n,a=!1;this.logger.time=t;for(var s=0;s<e.length;s+=2)if(i=127&e[s],n=127&e[s+1],0!==i||0!==n){if(this.logger.log(3,"["+la([e[s],e[s+1]])+"] -> ("+la([i,n])+")"),(r=this.parseCmd(i,n))||(r=this.parseMidrow(i,n)),r||(r=this.parsePAC(i,n)),r||(r=this.parseBackgroundAttributes(i,n)),!r&&(a=this.parseChars(i,n))){var o=this.currentChannel;o&&o>0?this.channels[o].insertChars(a):this.logger.log(2,"No channel found yet. TEXT-MODE?")}r||a||this.logger.log(2,"Couldn't parse cleaned data "+la([i,n])+" orig: "+la([e[s],e[s+1]]))}},e.parseCmd=function(t,e){var r=this.cmdHistory;if(!((20===t||28===t||21===t||29===t)&&e>=32&&e<=47||(23===t||31===t)&&e>=33&&e<=35))return!1;if(ma(t,e,r))return va(null,null,r),this.logger.log(3,"Repeated command ("+la([t,e])+") is dropped"),!0;var i=20===t||21===t||23===t?1:2,n=this.channels[i];return 20===t||21===t||28===t||29===t?32===e?n.ccRCL():33===e?n.ccBS():34===e?n.ccAOF():35===e?n.ccAON():36===e?n.ccDER():37===e?n.ccRU(2):38===e?n.ccRU(3):39===e?n.ccRU(4):40===e?n.ccFON():41===e?n.ccRDC():42===e?n.ccTR():43===e?n.ccRTD():44===e?n.ccEDM():45===e?n.ccCR():46===e?n.ccENM():47===e&&n.ccEOC():n.ccTO(e-32),va(t,e,r),this.currentChannel=i,!0},e.parseMidrow=function(t,e){var r=0;if((17===t||25===t)&&e>=32&&e<=47){if((r=17===t?1:2)!==this.currentChannel)return this.logger.log(0,"Mismatch channel in midrow parsing"),!1;var i=this.channels[r];return!!i&&(i.ccMIDROW(e),this.logger.log(3,"MIDROW ("+la([t,e])+")"),!0)}return!1},e.parsePAC=function(t,e){var r,i=this.cmdHistory;if(!((t>=17&&t<=23||t>=25&&t<=31)&&e>=64&&e<=127||(16===t||24===t)&&e>=64&&e<=95))return!1;if(ma(t,e,i))return va(null,null,i),!0;var n=t<=23?1:2;r=e>=64&&e<=95?1===n?ra[t]:na[t]:1===n?ia[t]:aa[t];var a=this.channels[n];return!!a&&(a.setPAC(this.interpretPAC(r,e)),va(t,e,i),this.currentChannel=n,!0)},e.interpretPAC=function(t,e){var r,i={color:null,italics:!1,indent:null,underline:!1,row:t};return r=e>95?e-96:e-64,i.underline=1==(1&r),r<=13?i.color=["white","green","blue","cyan","red","yellow","magenta","white"][Math.floor(r/2)]:r<=15?(i.italics=!0,i.color="white"):i.indent=4*Math.floor((r-16)/2),i},e.parseChars=function(t,e){var r,i,n=null,a=null;if(t>=25?(r=2,a=t-8):(r=1,a=t),a>=17&&a<=19?(i=17===a?e+80:18===a?e+112:e+144,this.logger.log(2,"Special char '"+Zn(i)+"' in channel "+r),n=[i]):t>=32&&t<=127&&(n=0===e?[t]:[t,e]),n){var s=la(n);this.logger.log(3,"Char codes =  "+s.join(",")),va(t,e,this.cmdHistory)}return n},e.parseBackgroundAttributes=function(t,e){var r;if(!((16===t||24===t)&&e>=32&&e<=47||(23===t||31===t)&&e>=45&&e<=47))return!1;var i={};16===t||24===t?(r=Math.floor((e-32)/2),i.background=sa[r],e%2==1&&(i.background=i.background+"_semi")):45===e?i.background="transparent":(i.foreground="black",47===e&&(i.underline=!0));var n=t<=23?1:2;return this.channels[n].setBkgData(i),va(t,e,this.cmdHistory),!0},e.reset=function(){for(var t=0;t<Object.keys(this.channels).length;t++){var e=this.channels[t];e&&e.reset()}this.cmdHistory={a:null,b:null}},e.cueSplitAtTime=function(t){for(var e=0;e<this.channels.length;e++){var r=this.channels[e];r&&r.cueSplitAtTime(t)}},t}();function va(t,e,r){r.a=t,r.b=e}function ma(t,e,r){return r.a===t&&r.b===e}var pa=function(){function t(t,e){this.timelineController=void 0,this.cueRanges=[],this.trackName=void 0,this.startTime=null,this.endTime=null,this.screen=null,this.timelineController=t,this.trackName=e}var e=t.prototype;return e.dispatchCue=function(){null!==this.startTime&&(this.timelineController.addCues(this.trackName,this.startTime,this.endTime,this.screen,this.cueRanges),this.startTime=null)},e.newCue=function(t,e,r){(null===this.startTime||this.startTime>t)&&(this.startTime=t),this.endTime=e,this.screen=r,this.timelineController.createCaptionsTrack(this.trackName)},e.reset=function(){this.cueRanges=[],this.startTime=null},t}(),ya=function(){if(null!=j&&j.VTTCue)return self.VTTCue;var t=["","lr","rl"],e=["start","middle","end","left","right"];function r(t,e){if("string"!=typeof e)return!1;if(!Array.isArray(t))return!1;var r=e.toLowerCase();return!!~t.indexOf(r)&&r}function i(t){return r(e,t)}function n(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var s in a)t[s]=a[s]}return t}function a(e,a,s){var o=this,l={enumerable:!0};o.hasBeenReset=!1;var u="",h=!1,d=e,c=a,f=s,g=null,v="",m=!0,p="auto",y="start",E=50,T="middle",S=50,L="middle";Object.defineProperty(o,"id",n({},l,{get:function(){return u},set:function(t){u=""+t}})),Object.defineProperty(o,"pauseOnExit",n({},l,{get:function(){return h},set:function(t){h=!!t}})),Object.defineProperty(o,"startTime",n({},l,{get:function(){return d},set:function(t){if("number"!=typeof t)throw new TypeError("Start time must be set to a number.");d=t,this.hasBeenReset=!0}})),Object.defineProperty(o,"endTime",n({},l,{get:function(){return c},set:function(t){if("number"!=typeof t)throw new TypeError("End time must be set to a number.");c=t,this.hasBeenReset=!0}})),Object.defineProperty(o,"text",n({},l,{get:function(){return f},set:function(t){f=""+t,this.hasBeenReset=!0}})),Object.defineProperty(o,"region",n({},l,{get:function(){return g},set:function(t){g=t,this.hasBeenReset=!0}})),Object.defineProperty(o,"vertical",n({},l,{get:function(){return v},set:function(e){var i=function(e){return r(t,e)}(e);if(!1===i)throw new SyntaxError("An invalid or illegal string was specified.");v=i,this.hasBeenReset=!0}})),Object.defineProperty(o,"snapToLines",n({},l,{get:function(){return m},set:function(t){m=!!t,this.hasBeenReset=!0}})),Object.defineProperty(o,"line",n({},l,{get:function(){return p},set:function(t){if("number"!=typeof t&&"auto"!==t)throw new SyntaxError("An invalid number or illegal string was specified.");p=t,this.hasBeenReset=!0}})),Object.defineProperty(o,"lineAlign",n({},l,{get:function(){return y},set:function(t){var e=i(t);if(!e)throw new SyntaxError("An invalid or illegal string was specified.");y=e,this.hasBeenReset=!0}})),Object.defineProperty(o,"position",n({},l,{get:function(){return E},set:function(t){if(t<0||t>100)throw new Error("Position must be between 0 and 100.");E=t,this.hasBeenReset=!0}})),Object.defineProperty(o,"positionAlign",n({},l,{get:function(){return T},set:function(t){var e=i(t);if(!e)throw new SyntaxError("An invalid or illegal string was specified.");T=e,this.hasBeenReset=!0}})),Object.defineProperty(o,"size",n({},l,{get:function(){return S},set:function(t){if(t<0||t>100)throw new Error("Size must be between 0 and 100.");S=t,this.hasBeenReset=!0}})),Object.defineProperty(o,"align",n({},l,{get:function(){return L},set:function(t){var e=i(t);if(!e)throw new SyntaxError("An invalid or illegal string was specified.");L=e,this.hasBeenReset=!0}})),o.displayState=void 0}return a.prototype.getCueAsHTML=function(){return self.WebVTT.convertCueToDOMTree(self,this.text)},a}(),Ea=function(){function t(){}return t.prototype.decode=function(t,e){if(!t)return"";if("string"!=typeof t)throw new Error("Error - expected string data.");return decodeURIComponent(encodeURIComponent(t))},t}();function Ta(t){function e(t,e,r,i){return 3600*(0|t)+60*(0|e)+(0|r)+parseFloat(i||0)}var r=t.match(/^(?:(\d+):)?(\d{2}):(\d{2})(\.\d+)?/);return r?parseFloat(r[2])>59?e(r[2],r[3],0,r[4]):e(r[1],r[2],r[3],r[4]):null}var Sa=function(){function t(){this.values=Object.create(null)}var e=t.prototype;return e.set=function(t,e){this.get(t)||""===e||(this.values[t]=e)},e.get=function(t,e,r){return r?this.has(t)?this.values[t]:e[r]:this.has(t)?this.values[t]:e},e.has=function(t){return t in this.values},e.alt=function(t,e,r){for(var i=0;i<r.length;++i)if(e===r[i]){this.set(t,e);break}},e.integer=function(t,e){/^-?\d+$/.test(e)&&this.set(t,parseInt(e,10))},e.percent=function(t,e){if(/^([\d]{1,3})(\.[\d]*)?%$/.test(e)){var r=parseFloat(e);if(r>=0&&r<=100)return this.set(t,r),!0}return!1},t}();function La(t,e,r,i){var n=i?t.split(i):[t];for(var a in n)if("string"==typeof n[a]){var s=n[a].split(r);2===s.length&&e(s[0],s[1])}}var Aa=new ya(0,0,""),Ra="middle"===Aa.align?"middle":"center";function ka(t,e,r){var i=t;function n(){var e=Ta(t);if(null===e)throw new Error("Malformed timestamp: "+i);return t=t.replace(/^[^\sa-zA-Z-]+/,""),e}function a(){t=t.replace(/^\s+/,"")}if(a(),e.startTime=n(),a(),"--\x3e"!==t.slice(0,3))throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): "+i);t=t.slice(3),a(),e.endTime=n(),a(),function(t,e){var i=new Sa;La(t,(function(t,e){var n;switch(t){case"region":for(var a=r.length-1;a>=0;a--)if(r[a].id===e){i.set(t,r[a].region);break}break;case"vertical":i.alt(t,e,["rl","lr"]);break;case"line":n=e.split(","),i.integer(t,n[0]),i.percent(t,n[0])&&i.set("snapToLines",!1),i.alt(t,n[0],["auto"]),2===n.length&&i.alt("lineAlign",n[1],["start",Ra,"end"]);break;case"position":n=e.split(","),i.percent(t,n[0]),2===n.length&&i.alt("positionAlign",n[1],["start",Ra,"end","line-left","line-right","auto"]);break;case"size":i.percent(t,e);break;case"align":i.alt(t,e,["start",Ra,"end","left","right"])}}),/:/,/\s/),e.region=i.get("region",null),e.vertical=i.get("vertical","");var n=i.get("line","auto");"auto"===n&&-1===Aa.line&&(n=-1),e.line=n,e.lineAlign=i.get("lineAlign","start"),e.snapToLines=i.get("snapToLines",!0),e.size=i.get("size",100),e.align=i.get("align",Ra);var a=i.get("position","auto");"auto"===a&&50===Aa.position&&(a="start"===e.align||"left"===e.align?0:"end"===e.align||"right"===e.align?100:50),e.position=a}(t,e)}function ba(t){return t.replace(/<br(?: \/)?>/gi,"\n")}var Da=function(){function t(){this.state="INITIAL",this.buffer="",this.decoder=new Ea,this.regionList=[],this.cue=null,this.oncue=void 0,this.onparsingerror=void 0,this.onflush=void 0}var e=t.prototype;return e.parse=function(t){var e=this;function r(){var t=e.buffer,r=0;for(t=ba(t);r<t.length&&"\r"!==t[r]&&"\n"!==t[r];)++r;var i=t.slice(0,r);return"\r"===t[r]&&++r,"\n"===t[r]&&++r,e.buffer=t.slice(r),i}t&&(e.buffer+=e.decoder.decode(t,{stream:!0}));try{var i="";if("INITIAL"===e.state){if(!/\r\n|\n/.test(e.buffer))return this;var n=(i=r()).match(/^(ï»¿)?WEBVTT([ \t].*)?$/);if(null==n||!n[0])throw new Error("Malformed WebVTT signature.");e.state="HEADER"}for(var a=!1;e.buffer;){if(!/\r\n|\n/.test(e.buffer))return this;switch(a?a=!1:i=r(),e.state){case"HEADER":/:/.test(i)?La(i,(function(t,e){}),/:/):i||(e.state="ID");continue;case"NOTE":i||(e.state="ID");continue;case"ID":if(/^NOTE($|[ \t])/.test(i)){e.state="NOTE";break}if(!i)continue;if(e.cue=new ya(0,0,""),e.state="CUE",-1===i.indexOf("--\x3e")){e.cue.id=i;continue}case"CUE":if(!e.cue){e.state="BADCUE";continue}try{ka(i,e.cue,e.regionList)}catch(t){e.cue=null,e.state="BADCUE";continue}e.state="CUETEXT";continue;case"CUETEXT":var s=-1!==i.indexOf("--\x3e");if(!i||s&&(a=!0)){e.oncue&&e.cue&&e.oncue(e.cue),e.cue=null,e.state="ID";continue}if(null===e.cue)continue;e.cue.text&&(e.cue.text+="\n"),e.cue.text+=i;continue;case"BADCUE":i||(e.state="ID")}}}catch(t){"CUETEXT"===e.state&&e.cue&&e.oncue&&e.oncue(e.cue),e.cue=null,e.state="INITIAL"===e.state?"BADWEBVTT":"BADCUE"}return this},e.flush=function(){var t=this;try{if((t.cue||"HEADER"===t.state)&&(t.buffer+="\n\n",t.parse()),"INITIAL"===t.state||"BADWEBVTT"===t.state)throw new Error("Malformed WebVTT signature.")}catch(e){t.onparsingerror&&t.onparsingerror(e)}return t.onflush&&t.onflush(),this},t}(),Ia=/\r\n|\n\r|\n|\r/g,wa=function(t,e,r){return void 0===r&&(r=0),t.slice(r,r+e.length)===e},Ca=function(t){for(var e=5381,r=t.length;r;)e=33*e^t.charCodeAt(--r);return(e>>>0).toString()};function _a(t,e,r){return Ca(t.toString())+Ca(e.toString())+Ca(r)}function xa(t,e,r,i,n,a,s){var o,l,u,h=new Da,d=Tt(new Uint8Array(t)).trim().replace(Ia,"\n").split("\n"),c=[],f=e?(o=e.baseTime,void 0===(l=e.timescale)&&(l=1),mn(o,vn,1/l)):0,g="00:00.000",v=0,m=0,p=!0;h.oncue=function(t){var a=r[i],s=r.ccOffset,o=(v-f)/9e4;if(null!=a&&a.new&&(void 0!==m?s=r.ccOffset=a.start:function(t,e,r){var i=t[e],n=t[i.prevCC];if(!n||!n.new&&i.new)return t.ccOffset=t.presentationOffset=i.start,void(i.new=!1);for(;null!=(a=n)&&a.new;){var a;t.ccOffset+=i.start-n.start,i.new=!1,n=t[(i=n).prevCC]}t.presentationOffset=r}(r,i,o)),o){if(!e)return void(u=new Error("Missing initPTS for VTT MPEGTS"));s=o-r.presentationOffset}var l=t.endTime-t.startTime,h=Sn(9e4*(t.startTime+s-m),9e4*n)/9e4;t.startTime=Math.max(h,0),t.endTime=Math.max(h+l,0);var d=t.text.trim();t.text=decodeURIComponent(encodeURIComponent(d)),t.id||(t.id=_a(t.startTime,t.endTime,d)),t.endTime>0&&c.push(t)},h.onparsingerror=function(t){u=t},h.onflush=function(){u?s(u):a(c)},d.forEach((function(t){if(p){if(wa(t,"X-TIMESTAMP-MAP=")){p=!1,t.slice(16).split(",").forEach((function(t){wa(t,"LOCAL:")?g=t.slice(6):wa(t,"MPEGTS:")&&(v=parseInt(t.slice(7)))}));try{m=function(t){var e=parseInt(t.slice(-3)),r=parseInt(t.slice(-6,-4)),i=parseInt(t.slice(-9,-7)),n=t.length>9?parseInt(t.substring(0,t.indexOf(":"))):0;if(!(y(e)&&y(r)&&y(i)&&y(n)))throw Error("Malformed X-TIMESTAMP-MAP: Local:"+t);return e+=1e3*r,(e+=6e4*i)+36e5*n}(g)/1e3}catch(t){u=t}return}""===t&&(p=!1)}h.parse(t+"\n")})),h.flush()}var Pa="stpp.ttml.im1t",Fa=/^(\d{2,}):(\d{2}):(\d{2}):(\d{2})\.?(\d+)?$/,Ma=/^(\d*(?:\.\d*)?)(h|m|s|ms|f|t)$/,Oa={left:"start",center:"center",right:"end",start:"start",end:"end"};function Na(t,e,r,i){var n=_t(new Uint8Array(t),["mdat"]);if(0!==n.length){var a,s,l,u,h=n.map((function(t){return Tt(t)})),d=(a=e.baseTime,s=1,void 0===(l=e.timescale)&&(l=1),void 0===u&&(u=!1),mn(a,s,1/l,u));try{h.forEach((function(t){return r(function(t,e){var r=(new DOMParser).parseFromString(t,"text/xml"),i=r.getElementsByTagName("tt")[0];if(!i)throw new Error("Invalid ttml");var n={frameRate:30,subFrameRate:1,frameRateMultiplier:0,tickRate:0},a=Object.keys(n).reduce((function(t,e){return t[e]=i.getAttribute("ttp:"+e)||n[e],t}),{}),s="preserve"!==i.getAttribute("xml:space"),l=Ba(Ua(i,"styling","style")),u=Ba(Ua(i,"layout","region")),h=Ua(i,"body","[begin]");return[].map.call(h,(function(t){var r=Ga(t,s);if(!r||!t.hasAttribute("begin"))return null;var i=Va(t.getAttribute("begin"),a),n=Va(t.getAttribute("dur"),a),h=Va(t.getAttribute("end"),a);if(null===i)throw Ha(t);if(null===h){if(null===n)throw Ha(t);h=i+n}var d=new ya(i-e,h-e,r);d.id=_a(d.startTime,d.endTime,d.text);var c=function(t,e,r){var i="http://www.w3.org/ns/ttml#styling",n=null,a=["displayAlign","textAlign","color","backgroundColor","fontSize","fontFamily"],s=null!=t&&t.hasAttribute("style")?t.getAttribute("style"):null;return s&&r.hasOwnProperty(s)&&(n=r[s]),a.reduce((function(r,a){var s=Ka(e,i,a)||Ka(t,i,a)||Ka(n,i,a);return s&&(r[a]=s),r}),{})}(u[t.getAttribute("region")],l[t.getAttribute("style")],l),f=c.textAlign;if(f){var g=Oa[f];g&&(d.lineAlign=g),d.align=f}return o(d,c),d})).filter((function(t){return null!==t}))}(t,d))}))}catch(t){i(t)}}else i(new Error("Could not parse IMSC1 mdat"))}function Ua(t,e,r){var i=t.getElementsByTagName(e)[0];return i?[].slice.call(i.querySelectorAll(r)):[]}function Ba(t){return t.reduce((function(t,e){var r=e.getAttribute("xml:id");return r&&(t[r]=e),t}),{})}function Ga(t,e){return[].slice.call(t.childNodes).reduce((function(t,r,i){var n;return"br"===r.nodeName&&i?t+"\n":null!=(n=r.childNodes)&&n.length?Ga(r,e):e?t+r.textContent.trim().replace(/\s+/g," "):t+r.textContent}),"")}function Ka(t,e,r){return t&&t.hasAttributeNS(e,r)?t.getAttributeNS(e,r):null}function Ha(t){return new Error("Could not parse ttml timestamp "+t)}function Va(t,e){if(!t)return null;var r=Ta(t);return null===r&&(Fa.test(t)?r=function(t,e){var r=Fa.exec(t),i=(0|r[4])+(0|r[5])/e.subFrameRate;return 3600*(0|r[1])+60*(0|r[2])+(0|r[3])+i/e.frameRate}(t,e):Ma.test(t)&&(r=function(t,e){var r=Ma.exec(t),i=Number(r[1]);switch(r[2]){case"h":return 3600*i;case"m":return 60*i;case"ms":return 1e3*i;case"f":return i/e.frameRate;case"t":return i/e.tickRate}return i}(t,e))),r}var Ya=function(){function t(t){this.hls=void 0,this.media=null,this.config=void 0,this.enabled=!0,this.Cues=void 0,this.textTracks=[],this.tracks=[],this.initPTS=[],this.unparsedVttFrags=[],this.captionsTracks={},this.nonNativeCaptionsTracks={},this.cea608Parser1=void 0,this.cea608Parser2=void 0,this.lastCc=-1,this.lastSn=-1,this.lastPartIndex=-1,this.prevCC=-1,this.vttCCs={ccOffset:0,presentationOffset:0,0:{start:0,prevCC:-1,new:!0}},this.captionsProperties=void 0,this.hls=t,this.config=t.config,this.Cues=t.config.cueHandler,this.captionsProperties={textTrack1:{label:this.config.captionsTextTrack1Label,languageCode:this.config.captionsTextTrack1LanguageCode},textTrack2:{label:this.config.captionsTextTrack2Label,languageCode:this.config.captionsTextTrack2LanguageCode},textTrack3:{label:this.config.captionsTextTrack3Label,languageCode:this.config.captionsTextTrack3LanguageCode},textTrack4:{label:this.config.captionsTextTrack4Label,languageCode:this.config.captionsTextTrack4LanguageCode}},t.on(S.MEDIA_ATTACHING,this.onMediaAttaching,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_LOADED,this.onManifestLoaded,this),t.on(S.SUBTITLE_TRACKS_UPDATED,this.onSubtitleTracksUpdated,this),t.on(S.FRAG_LOADING,this.onFragLoading,this),t.on(S.FRAG_LOADED,this.onFragLoaded,this),t.on(S.FRAG_PARSING_USERDATA,this.onFragParsingUserdata,this),t.on(S.FRAG_DECRYPTED,this.onFragDecrypted,this),t.on(S.INIT_PTS_FOUND,this.onInitPtsFound,this),t.on(S.SUBTITLE_TRACKS_CLEARED,this.onSubtitleTracksCleared,this),t.on(S.BUFFER_FLUSHING,this.onBufferFlushing,this)}var e=t.prototype;return e.destroy=function(){var t=this.hls;t.off(S.MEDIA_ATTACHING,this.onMediaAttaching,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_LOADED,this.onManifestLoaded,this),t.off(S.SUBTITLE_TRACKS_UPDATED,this.onSubtitleTracksUpdated,this),t.off(S.FRAG_LOADING,this.onFragLoading,this),t.off(S.FRAG_LOADED,this.onFragLoaded,this),t.off(S.FRAG_PARSING_USERDATA,this.onFragParsingUserdata,this),t.off(S.FRAG_DECRYPTED,this.onFragDecrypted,this),t.off(S.INIT_PTS_FOUND,this.onInitPtsFound,this),t.off(S.SUBTITLE_TRACKS_CLEARED,this.onSubtitleTracksCleared,this),t.off(S.BUFFER_FLUSHING,this.onBufferFlushing,this),this.hls=this.config=null,this.cea608Parser1=this.cea608Parser2=void 0},e.initCea608Parsers=function(){if(this.config.enableCEA708Captions&&(!this.cea608Parser1||!this.cea608Parser2)){var t=new pa(this,"textTrack1"),e=new pa(this,"textTrack2"),r=new pa(this,"textTrack3"),i=new pa(this,"textTrack4");this.cea608Parser1=new ga(1,t,e),this.cea608Parser2=new ga(3,r,i)}},e.addCues=function(t,e,r,i,n){for(var a,s,o,l,u=!1,h=n.length;h--;){var d=n[h],c=(a=d[0],s=d[1],o=e,l=r,Math.min(s,l)-Math.max(a,o));if(c>=0&&(d[0]=Math.min(d[0],e),d[1]=Math.max(d[1],r),u=!0,c/(r-e)>.5))return}if(u||n.push([e,r]),this.config.renderTextTracksNatively){var f=this.captionsTracks[t];this.Cues.newCue(f,e,r,i)}else{var g=this.Cues.newCue(null,e,r,i);this.hls.trigger(S.CUES_PARSED,{type:"captions",cues:g,track:t})}},e.onInitPtsFound=function(t,e){var r=this,i=e.frag,n=e.id,a=e.initPTS,s=e.timescale,o=this.unparsedVttFrags;"main"===n&&(this.initPTS[i.cc]={baseTime:a,timescale:s}),o.length&&(this.unparsedVttFrags=[],o.forEach((function(t){r.onFragLoaded(S.FRAG_LOADED,t)})))},e.getExistingTrack=function(t,e){var r=this.media;if(r)for(var i=0;i<r.textTracks.length;i++){var n=r.textTracks[i];if(ja(n,{name:t,lang:e,attrs:{}}))return n}return null},e.createCaptionsTrack=function(t){this.config.renderTextTracksNatively?this.createNativeTrack(t):this.createNonNativeTrack(t)},e.createNativeTrack=function(t){if(!this.captionsTracks[t]){var e=this.captionsProperties,r=this.captionsTracks,i=this.media,n=e[t],a=n.label,s=n.languageCode,o=this.getExistingTrack(a,s);if(o)r[t]=o,Oe(r[t]),Fe(r[t],i);else{var l=this.createTextTrack("captions",a,s);l&&(l[t]=!0,r[t]=l)}}},e.createNonNativeTrack=function(t){if(!this.nonNativeCaptionsTracks[t]){var e=this.captionsProperties[t];if(e){var r={_id:t,label:e.label,kind:"captions",default:!!e.media&&!!e.media.default,closedCaptions:e.media};this.nonNativeCaptionsTracks[t]=r,this.hls.trigger(S.NON_NATIVE_TEXT_TRACKS_FOUND,{tracks:[r]})}}},e.createTextTrack=function(t,e,r){var i=this.media;if(i)return i.addTextTrack(t,e,r)},e.onMediaAttaching=function(t,e){this.media=e.media,this._cleanTracks()},e.onMediaDetaching=function(){var t=this.captionsTracks;Object.keys(t).forEach((function(e){Oe(t[e]),delete t[e]})),this.nonNativeCaptionsTracks={}},e.onManifestLoading=function(){this.lastCc=-1,this.lastSn=-1,this.lastPartIndex=-1,this.prevCC=-1,this.vttCCs={ccOffset:0,presentationOffset:0,0:{start:0,prevCC:-1,new:!0}},this._cleanTracks(),this.tracks=[],this.captionsTracks={},this.nonNativeCaptionsTracks={},this.textTracks=[],this.unparsedVttFrags=[],this.initPTS=[],this.cea608Parser1&&this.cea608Parser2&&(this.cea608Parser1.reset(),this.cea608Parser2.reset())},e._cleanTracks=function(){var t=this.media;if(t){var e=t.textTracks;if(e)for(var r=0;r<e.length;r++)Oe(e[r])}},e.onSubtitleTracksUpdated=function(t,e){var r=this,i=e.subtitleTracks||[],n=i.some((function(t){return t.textCodec===Pa}));if(this.config.enableWebVTT||n&&this.config.enableIMSC1){if(Gn(this.tracks,i))return void(this.tracks=i);if(this.textTracks=[],this.tracks=i,this.config.renderTextTracksNatively){var a=this.media,s=a?Ue(a.textTracks):null;if(this.tracks.forEach((function(t,e){var i;if(s){for(var n=null,a=0;a<s.length;a++)if(s[a]&&ja(s[a],t)){n=s[a],s[a]=null;break}n&&(i=n)}if(i)Oe(i);else{var o=Wa(t);(i=r.createTextTrack(o,t.name,t.lang))&&(i.mode="disabled")}i&&r.textTracks.push(i)})),null!=s&&s.length){var o=s.filter((function(t){return null!==t})).map((function(t){return t.label}));o.length&&w.warn("Media element contains unused subtitle tracks: "+o.join(", ")+". Replace media element for each source to clear TextTracks and captions menu.")}}else if(this.tracks.length){var l=this.tracks.map((function(t){return{label:t.name,kind:t.type.toLowerCase(),default:t.default,subtitleTrack:t}}));this.hls.trigger(S.NON_NATIVE_TEXT_TRACKS_FOUND,{tracks:l})}}},e.onManifestLoaded=function(t,e){var r=this;this.config.enableCEA708Captions&&e.captions&&e.captions.forEach((function(t){var e=/(?:CC|SERVICE)([1-4])/.exec(t.instreamId);if(e){var i="textTrack"+e[1],n=r.captionsProperties[i];n&&(n.label=t.name,t.lang&&(n.languageCode=t.lang),n.media=t)}}))},e.closedCaptionsForLevel=function(t){var e=this.hls.levels[t.level];return null==e?void 0:e.attrs["CLOSED-CAPTIONS"]},e.onFragLoading=function(t,e){this.initCea608Parsers();var r=this.cea608Parser1,i=this.cea608Parser2,n=this.lastCc,a=this.lastSn,s=this.lastPartIndex;if(this.enabled&&r&&i&&e.frag.type===Ie){var o,l,u=e.frag,h=u.cc,d=u.sn,c=null!=(o=null==e||null==(l=e.part)?void 0:l.index)?o:-1;d===a+1||d===a&&c===s+1||h===n||(r.reset(),i.reset()),this.lastCc=h,this.lastSn=d,this.lastPartIndex=c}},e.onFragLoaded=function(t,e){var r=e.frag,i=e.payload;if(r.type===Ce)if(i.byteLength){var n=r.decryptdata,a="stats"in e;if(null==n||!n.encrypted||a){var s=this.tracks[r.level],o=this.vttCCs;o[r.cc]||(o[r.cc]={start:r.start,prevCC:this.prevCC,new:!0},this.prevCC=r.cc),s&&s.textCodec===Pa?this._parseIMSC1(r,i):this._parseVTTs(e)}}else this.hls.trigger(S.SUBTITLE_FRAG_PROCESSED,{success:!1,frag:r,error:new Error("Empty subtitle payload")})},e._parseIMSC1=function(t,e){var r=this,i=this.hls;Na(e,this.initPTS[t.cc],(function(e){r._appendCues(e,t.level),i.trigger(S.SUBTITLE_FRAG_PROCESSED,{success:!0,frag:t})}),(function(e){w.log("Failed to parse IMSC1: "+e),i.trigger(S.SUBTITLE_FRAG_PROCESSED,{success:!1,frag:t,error:e})}))},e._parseVTTs=function(t){var e,r=this,i=t.frag,n=t.payload,a=this.initPTS,s=this.unparsedVttFrags,o=a.length-1;if(a[i.cc]||-1!==o){var l=this.hls;xa(null!=(e=i.initSegment)&&e.data?Gt(i.initSegment.data,new Uint8Array(n)):n,this.initPTS[i.cc],this.vttCCs,i.cc,i.start,(function(t){r._appendCues(t,i.level),l.trigger(S.SUBTITLE_FRAG_PROCESSED,{success:!0,frag:i})}),(function(e){var a="Missing initPTS for VTT MPEGTS"===e.message;a?s.push(t):r._fallbackToIMSC1(i,n),w.log("Failed to parse VTT cue: "+e),a&&o>i.cc||l.trigger(S.SUBTITLE_FRAG_PROCESSED,{success:!1,frag:i,error:e})}))}else s.push(t)},e._fallbackToIMSC1=function(t,e){var r=this,i=this.tracks[t.level];i.textCodec||Na(e,this.initPTS[t.cc],(function(){i.textCodec=Pa,r._parseIMSC1(t,e)}),(function(){i.textCodec="wvtt"}))},e._appendCues=function(t,e){var r=this.hls;if(this.config.renderTextTracksNatively){var i=this.textTracks[e];if(!i||"disabled"===i.mode)return;t.forEach((function(t){return Me(i,t)}))}else{var n=this.tracks[e];if(!n)return;var a=n.default?"default":"subtitles"+e;r.trigger(S.CUES_PARSED,{type:"subtitles",cues:t,track:a})}},e.onFragDecrypted=function(t,e){e.frag.type===Ce&&this.onFragLoaded(S.FRAG_LOADED,e)},e.onSubtitleTracksCleared=function(){this.tracks=[],this.captionsTracks={}},e.onFragParsingUserdata=function(t,e){this.initCea608Parsers();var r=this.cea608Parser1,i=this.cea608Parser2;if(this.enabled&&r&&i){var n=e.frag,a=e.samples;if(n.type!==Ie||"NONE"!==this.closedCaptionsForLevel(n))for(var s=0;s<a.length;s++){var o=a[s].bytes;if(o){var l=this.extractCea608Data(o);r.addData(a[s].pts,l[0]),i.addData(a[s].pts,l[1])}}}},e.onBufferFlushing=function(t,e){var r=e.startOffset,i=e.endOffset,n=e.endOffsetSubtitles,a=e.type,s=this.media;if(s&&!(s.currentTime<i)){if(!a||"video"===a){var o=this.captionsTracks;Object.keys(o).forEach((function(t){return Ne(o[t],r,i)}))}if(this.config.renderTextTracksNatively&&0===r&&void 0!==n){var l=this.textTracks;Object.keys(l).forEach((function(t){return Ne(l[t],r,n)}))}}},e.extractCea608Data=function(t){for(var e=[[],[]],r=31&t[0],i=2,n=0;n<r;n++){var a=t[i++],s=127&t[i++],o=127&t[i++];if((0!==s||0!==o)&&0!=(4&a)){var l=3&a;0!==l&&1!==l||(e[l].push(s),e[l].push(o))}}return e},t}();function Wa(t){return t.characteristics&&/transcribes-spoken-dialog/gi.test(t.characteristics)&&/describes-music-and-sound/gi.test(t.characteristics)?"captions":"subtitles"}function ja(t,e){return!!t&&t.kind===Wa(e)&&Hn(e,t)}var qa=function(){function t(t){this.hls=void 0,this.autoLevelCapping=void 0,this.firstLevel=void 0,this.media=void 0,this.restrictedLevels=void 0,this.timer=void 0,this.clientRect=void 0,this.streamController=void 0,this.hls=t,this.autoLevelCapping=Number.POSITIVE_INFINITY,this.firstLevel=-1,this.media=null,this.restrictedLevels=[],this.timer=void 0,this.clientRect=null,this.registerListeners()}var e=t.prototype;return e.setStreamController=function(t){this.streamController=t},e.destroy=function(){this.hls&&this.unregisterListener(),this.timer&&this.stopCapping(),this.media=null,this.clientRect=null,this.hls=this.streamController=null},e.registerListeners=function(){var t=this.hls;t.on(S.FPS_DROP_LEVEL_CAPPING,this.onFpsDropLevelCapping,this),t.on(S.MEDIA_ATTACHING,this.onMediaAttaching,this),t.on(S.MANIFEST_PARSED,this.onManifestParsed,this),t.on(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.on(S.BUFFER_CODECS,this.onBufferCodecs,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this)},e.unregisterListener=function(){var t=this.hls;t.off(S.FPS_DROP_LEVEL_CAPPING,this.onFpsDropLevelCapping,this),t.off(S.MEDIA_ATTACHING,this.onMediaAttaching,this),t.off(S.MANIFEST_PARSED,this.onManifestParsed,this),t.off(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.off(S.BUFFER_CODECS,this.onBufferCodecs,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this)},e.onFpsDropLevelCapping=function(t,e){var r=this.hls.levels[e.droppedLevel];this.isLevelAllowed(r)&&this.restrictedLevels.push({bitrate:r.bitrate,height:r.height,width:r.width})},e.onMediaAttaching=function(t,e){this.media=e.media instanceof HTMLVideoElement?e.media:null,this.clientRect=null,this.timer&&this.hls.levels.length&&this.detectPlayerSize()},e.onManifestParsed=function(t,e){var r=this.hls;this.restrictedLevels=[],this.firstLevel=e.firstLevel,r.config.capLevelToPlayerSize&&e.video&&this.startCapping()},e.onLevelsUpdated=function(t,e){this.timer&&y(this.autoLevelCapping)&&this.detectPlayerSize()},e.onBufferCodecs=function(t,e){this.hls.config.capLevelToPlayerSize&&e.video&&this.startCapping()},e.onMediaDetaching=function(){this.stopCapping()},e.detectPlayerSize=function(){if(this.media){if(this.mediaHeight<=0||this.mediaWidth<=0)return void(this.clientRect=null);var t=this.hls.levels;if(t.length){var e=this.hls,r=this.getMaxLevel(t.length-1);r!==this.autoLevelCapping&&w.log("Setting autoLevelCapping to "+r+": "+t[r].height+"p@"+t[r].bitrate+" for media "+this.mediaWidth+"x"+this.mediaHeight),e.autoLevelCapping=r,e.autoLevelCapping>this.autoLevelCapping&&this.streamController&&this.streamController.nextLevelSwitch(),this.autoLevelCapping=e.autoLevelCapping}}},e.getMaxLevel=function(e){var r=this,i=this.hls.levels;if(!i.length)return-1;var n=i.filter((function(t,i){return r.isLevelAllowed(t)&&i<=e}));return this.clientRect=null,t.getMaxLevelByMediaSize(n,this.mediaWidth,this.mediaHeight)},e.startCapping=function(){this.timer||(this.autoLevelCapping=Number.POSITIVE_INFINITY,self.clearInterval(this.timer),this.timer=self.setInterval(this.detectPlayerSize.bind(this),1e3),this.detectPlayerSize())},e.stopCapping=function(){this.restrictedLevels=[],this.firstLevel=-1,this.autoLevelCapping=Number.POSITIVE_INFINITY,this.timer&&(self.clearInterval(this.timer),this.timer=void 0)},e.getDimensions=function(){if(this.clientRect)return this.clientRect;var t=this.media,e={width:0,height:0};if(t){var r=t.getBoundingClientRect();e.width=r.width,e.height=r.height,e.width||e.height||(e.width=r.right-r.left||t.width||0,e.height=r.bottom-r.top||t.height||0)}return this.clientRect=e,e},e.isLevelAllowed=function(t){return!this.restrictedLevels.some((function(e){return t.bitrate===e.bitrate&&t.width===e.width&&t.height===e.height}))},t.getMaxLevelByMediaSize=function(t,e,r){if(null==t||!t.length)return-1;for(var i,n,a=t.length-1,s=Math.max(e,r),o=0;o<t.length;o+=1){var l=t[o];if((l.width>=s||l.height>=s)&&(i=l,!(n=t[o+1])||i.width!==n.width||i.height!==n.height)){a=o;break}}return a},s(t,[{key:"mediaWidth",get:function(){return this.getDimensions().width*this.contentScaleFactor}},{key:"mediaHeight",get:function(){return this.getDimensions().height*this.contentScaleFactor}},{key:"contentScaleFactor",get:function(){var t=1;if(!this.hls.config.ignoreDevicePixelRatio)try{t=self.devicePixelRatio}catch(t){}return t}}]),t}(),Xa=function(){function t(t){this.hls=void 0,this.isVideoPlaybackQualityAvailable=!1,this.timer=void 0,this.media=null,this.lastTime=void 0,this.lastDroppedFrames=0,this.lastDecodedFrames=0,this.streamController=void 0,this.hls=t,this.registerListeners()}var e=t.prototype;return e.setStreamController=function(t){this.streamController=t},e.registerListeners=function(){this.hls.on(S.MEDIA_ATTACHING,this.onMediaAttaching,this)},e.unregisterListeners=function(){this.hls.off(S.MEDIA_ATTACHING,this.onMediaAttaching,this)},e.destroy=function(){this.timer&&clearInterval(this.timer),this.unregisterListeners(),this.isVideoPlaybackQualityAvailable=!1,this.media=null},e.onMediaAttaching=function(t,e){var r=this.hls.config;if(r.capLevelOnFPSDrop){var i=e.media instanceof self.HTMLVideoElement?e.media:null;this.media=i,i&&"function"==typeof i.getVideoPlaybackQuality&&(this.isVideoPlaybackQualityAvailable=!0),self.clearInterval(this.timer),this.timer=self.setInterval(this.checkFPSInterval.bind(this),r.fpsDroppedMonitoringPeriod)}},e.checkFPS=function(t,e,r){var i=performance.now();if(e){if(this.lastTime){var n=i-this.lastTime,a=r-this.lastDroppedFrames,s=e-this.lastDecodedFrames,o=1e3*a/n,l=this.hls;if(l.trigger(S.FPS_DROP,{currentDropped:a,currentDecoded:s,totalDroppedFrames:r}),o>0&&a>l.config.fpsDroppedMonitoringThreshold*s){var u=l.currentLevel;w.warn("drop FPS ratio greater than max allowed value for currentLevel: "+u),u>0&&(-1===l.autoLevelCapping||l.autoLevelCapping>=u)&&(u-=1,l.trigger(S.FPS_DROP_LEVEL_CAPPING,{level:u,droppedLevel:l.currentLevel}),l.autoLevelCapping=u,this.streamController.nextLevelSwitch())}}this.lastTime=i,this.lastDroppedFrames=r,this.lastDecodedFrames=e}},e.checkFPSInterval=function(){var t=this.media;if(t)if(this.isVideoPlaybackQualityAvailable){var e=t.getVideoPlaybackQuality();this.checkFPS(t,e.totalVideoFrames,e.droppedVideoFrames)}else this.checkFPS(t,t.webkitDecodedFrameCount,t.webkitDroppedFrameCount)},t}(),za="[eme]",Qa=function(){function t(e){this.hls=void 0,this.config=void 0,this.media=null,this.keyFormatPromise=null,this.keySystemAccessPromises={},this._requestLicenseFailureCount=0,this.mediaKeySessions=[],this.keyIdToKeySessionPromise={},this.setMediaKeysQueue=t.CDMCleanupPromise?[t.CDMCleanupPromise]:[],this.onMediaEncrypted=this._onMediaEncrypted.bind(this),this.onWaitingForKey=this._onWaitingForKey.bind(this),this.debug=w.debug.bind(w,za),this.log=w.log.bind(w,za),this.warn=w.warn.bind(w,za),this.error=w.error.bind(w,za),this.hls=e,this.config=e.config,this.registerListeners()}var e=t.prototype;return e.destroy=function(){this.unregisterListeners(),this.onMediaDetached();var t=this.config;t.requestMediaKeySystemAccessFunc=null,t.licenseXhrSetup=t.licenseResponseCallback=void 0,t.drmSystems=t.drmSystemOptions={},this.hls=this.onMediaEncrypted=this.onWaitingForKey=this.keyIdToKeySessionPromise=null,this.config=null},e.registerListeners=function(){this.hls.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),this.hls.on(S.MEDIA_DETACHED,this.onMediaDetached,this),this.hls.on(S.MANIFEST_LOADING,this.onManifestLoading,this),this.hls.on(S.MANIFEST_LOADED,this.onManifestLoaded,this)},e.unregisterListeners=function(){this.hls.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),this.hls.off(S.MEDIA_DETACHED,this.onMediaDetached,this),this.hls.off(S.MANIFEST_LOADING,this.onManifestLoading,this),this.hls.off(S.MANIFEST_LOADED,this.onManifestLoaded,this)},e.getLicenseServerUrl=function(t){var e=this.config,r=e.drmSystems,i=e.widevineLicenseUrl,n=r[t];if(n)return n.licenseUrl;if(t===q.WIDEVINE&&i)return i;throw new Error('no license server URL configured for key-system "'+t+'"')},e.getServerCertificateUrl=function(t){var e=this.config.drmSystems[t];if(e)return e.serverCertificateUrl;this.log('No Server Certificate in config.drmSystems["'+t+'"]')},e.attemptKeySystemAccess=function(t){var e=this,r=this.hls.levels,i=function(t,e,r){return!!t&&r.indexOf(t)===e},n=r.map((function(t){return t.audioCodec})).filter(i),a=r.map((function(t){return t.videoCodec})).filter(i);return n.length+a.length===0&&a.push("avc1.42e01e"),new Promise((function(r,i){!function t(s){var o=s.shift();e.getMediaKeysPromise(o,n,a).then((function(t){return r({keySystem:o,mediaKeys:t})})).catch((function(e){s.length?t(s):i(e instanceof es?e:new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_NO_ACCESS,error:e,fatal:!0},e.message))}))}(t)}))},e.requestMediaKeySystemAccess=function(t,e){var r=this.config.requestMediaKeySystemAccessFunc;if("function"!=typeof r){var i="Configured requestMediaKeySystemAccess is not a function "+r;return null===it&&"http:"===self.location.protocol&&(i="navigator.requestMediaKeySystemAccess is not available over insecure protocol "+location.protocol),Promise.reject(new Error(i))}return r(t,e)},e.getMediaKeysPromise=function(t,e,r){var i=this,n=function(t,e,r,i){var n;switch(t){case q.FAIRPLAY:n=["cenc","sinf"];break;case q.WIDEVINE:case q.PLAYREADY:n=["cenc"];break;case q.CLEARKEY:n=["cenc","keyids"];break;default:throw new Error("Unknown key-system: "+t)}return function(t,e,r,i){return[{initDataTypes:t,persistentState:i.persistentState||"optional",distinctiveIdentifier:i.distinctiveIdentifier||"optional",sessionTypes:i.sessionTypes||[i.sessionType||"temporary"],audioCapabilities:e.map((function(t){return{contentType:'audio/mp4; codecs="'+t+'"',robustness:i.audioRobustness||"",encryptionScheme:i.audioEncryptionScheme||null}})),videoCapabilities:r.map((function(t){return{contentType:'video/mp4; codecs="'+t+'"',robustness:i.videoRobustness||"",encryptionScheme:i.videoEncryptionScheme||null}}))}]}(n,e,r,i)}(t,e,r,this.config.drmSystemOptions),a=this.keySystemAccessPromises[t],s=null==a?void 0:a.keySystemAccess;if(!s){this.log('Requesting encrypted media "'+t+'" key-system access with config: '+JSON.stringify(n)),s=this.requestMediaKeySystemAccess(t,n);var o=this.keySystemAccessPromises[t]={keySystemAccess:s};return s.catch((function(e){i.log('Failed to obtain access to key-system "'+t+'": '+e)})),s.then((function(e){i.log('Access for key-system "'+e.keySystem+'" obtained');var r=i.fetchServerCertificate(t);return i.log('Create media-keys for "'+t+'"'),o.mediaKeys=e.createMediaKeys().then((function(e){return i.log('Media-keys created for "'+t+'"'),r.then((function(r){return r?i.setMediaKeysServerCertificate(e,t,r):e}))})),o.mediaKeys.catch((function(e){i.error('Failed to create media-keys for "'+t+'"}: '+e)})),o.mediaKeys}))}return s.then((function(){return a.mediaKeys}))},e.createMediaKeySessionContext=function(t){var e=t.decryptdata,r=t.keySystem,i=t.mediaKeys;this.log('Creating key-system session "'+r+'" keyId: '+Lt(e.keyId||[]));var n=i.createSession(),a={decryptdata:e,keySystem:r,mediaKeys:i,mediaKeysSession:n,keyStatus:"status-pending"};return this.mediaKeySessions.push(a),a},e.renewKeySession=function(t){var e=t.decryptdata;if(e.pssh){var r=this.createMediaKeySessionContext(t),i=this.getKeyIdString(e);this.keyIdToKeySessionPromise[i]=this.generateRequestWithPreferredKeySession(r,"cenc",e.pssh,"expired")}else this.warn("Could not renew expired session. Missing pssh initData.");this.removeSession(t)},e.getKeyIdString=function(t){if(!t)throw new Error("Could not read keyId of undefined decryptdata");if(null===t.keyId)throw new Error("keyId is null");return Lt(t.keyId)},e.updateKeySession=function(t,e){var r,i=t.mediaKeysSession;return this.log('Updating key-session "'+i.sessionId+'" for keyID '+Lt((null==(r=t.decryptdata)?void 0:r.keyId)||[])+"\n      } (data length: "+(e?e.byteLength:e)+")"),i.update(e)},e.selectKeySystemFormat=function(t){var e=Object.keys(t.levelkeys||{});return this.keyFormatPromise||(this.log("Selecting key-system from fragment (sn: "+t.sn+" "+t.type+": "+t.level+") key formats "+e.join(", ")),this.keyFormatPromise=this.getKeyFormatPromise(e)),this.keyFormatPromise},e.getKeyFormatPromise=function(t){var e=this;return new Promise((function(r,i){var n=et(e.config),a=t.map($).filter((function(t){return!!t&&-1!==n.indexOf(t)}));return e.getKeySystemSelectionPromise(a).then((function(t){var e=t.keySystem,n=tt(e);n?r(n):i(new Error('Unable to find format for key-system "'+e+'"'))})).catch(i)}))},e.loadKey=function(t){var e=this,r=t.keyInfo.decryptdata,i=this.getKeyIdString(r),n="(keyId: "+i+' format: "'+r.keyFormat+'" method: '+r.method+" uri: "+r.uri+")";this.log("Starting session for key "+n);var a=this.keyIdToKeySessionPromise[i];return a||(a=this.keyIdToKeySessionPromise[i]=this.getKeySystemForKeyPromise(r).then((function(i){var a=i.keySystem,s=i.mediaKeys;return e.throwIfDestroyed(),e.log("Handle encrypted media sn: "+t.frag.sn+" "+t.frag.type+": "+t.frag.level+" using key "+n),e.attemptSetMediaKeys(a,s).then((function(){e.throwIfDestroyed();var t=e.createMediaKeySessionContext({keySystem:a,mediaKeys:s,decryptdata:r});return e.generateRequestWithPreferredKeySession(t,"cenc",r.pssh,"playlist-key")}))}))).catch((function(t){return e.handleError(t)})),a},e.throwIfDestroyed=function(t){if(!this.hls)throw new Error("invalid state")},e.handleError=function(t){this.hls&&(this.error(t.message),t instanceof es?this.hls.trigger(S.ERROR,t.data):this.hls.trigger(S.ERROR,{type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_NO_KEYS,error:t,fatal:!0}))},e.getKeySystemForKeyPromise=function(t){var e=this.getKeyIdString(t),r=this.keyIdToKeySessionPromise[e];if(!r){var i=$(t.keyFormat),n=i?[i]:et(this.config);return this.attemptKeySystemAccess(n)}return r},e.getKeySystemSelectionPromise=function(t){if(t.length||(t=et(this.config)),0===t.length)throw new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_NO_CONFIGURED_LICENSE,fatal:!0},"Missing key-system license configuration options "+JSON.stringify({drmSystems:this.config.drmSystems}));return this.attemptKeySystemAccess(t)},e._onMediaEncrypted=function(t){var e=this,r=t.initDataType,i=t.initData;if(this.debug('"'+t.type+'" event: init data type: "'+r+'"'),null!==i){var n,a;if("sinf"===r&&this.config.drmSystems[q.FAIRPLAY]){var s=bt(new Uint8Array(i));try{var o=V(JSON.parse(s).sinf),l=Ut(new Uint8Array(o));if(!l)return;n=l.subarray(8,24),a=q.FAIRPLAY}catch(t){return void this.warn('Failed to parse sinf "encrypted" event message initData')}}else{var u=function(t){if(!(t instanceof ArrayBuffer)||t.byteLength<32)return null;var e={version:0,systemId:"",kids:null,data:null},r=new DataView(t),i=r.getUint32(0);if(t.byteLength!==i&&i>44)return null;if(1886614376!==r.getUint32(4))return null;if(e.version=r.getUint32(8)>>>24,e.version>1)return null;e.systemId=Lt(new Uint8Array(t,12,16));var n=r.getUint32(28);if(0===e.version){if(i-32<n)return null;e.data=new Uint8Array(t,32,n)}else if(1===e.version){e.kids=[];for(var a=0;a<n;a++)e.kids.push(new Uint8Array(t,32+16*a,16))}return e}(i);if(null===u)return;0===u.version&&u.systemId===Z&&u.data&&(n=u.data.subarray(8,24)),a=function(t){if(t===Z)return q.WIDEVINE}(u.systemId)}if(a&&n){for(var h,d=Lt(n),c=this.keyIdToKeySessionPromise,f=this.mediaKeySessions,g=c[d],v=function(){var t=f[m],a=t.decryptdata;if(a.pssh||!a.keyId)return 0;var s=Lt(a.keyId);return d===s||-1!==a.uri.replace(/-/g,"").indexOf(d)?(g=c[s],delete c[s],a.pssh=new Uint8Array(i),a.keyId=n,g=c[d]=g.then((function(){return e.generateRequestWithPreferredKeySession(t,r,i,"encrypted-event-key-match")})),1):void 0},m=0;m<f.length&&(0===(h=v())||1!==h);m++);g||(g=c[d]=this.getKeySystemSelectionPromise([a]).then((function(t){var a,s=t.keySystem,o=t.mediaKeys;e.throwIfDestroyed();var l=new qt("ISO-23001-7",d,null!=(a=tt(s))?a:"");return l.pssh=new Uint8Array(i),l.keyId=n,e.attemptSetMediaKeys(s,o).then((function(){e.throwIfDestroyed();var t=e.createMediaKeySessionContext({decryptdata:l,keySystem:s,mediaKeys:o});return e.generateRequestWithPreferredKeySession(t,r,i,"encrypted-event-no-match")}))}))),g.catch((function(t){return e.handleError(t)}))}}},e._onWaitingForKey=function(t){this.log('"'+t.type+'" event')},e.attemptSetMediaKeys=function(t,e){var r=this,i=this.setMediaKeysQueue.slice();this.log('Setting media-keys for "'+t+'"');var n=Promise.all(i).then((function(){if(!r.media)throw new Error("Attempted to set mediaKeys without media element attached");return r.media.setMediaKeys(e)}));return this.setMediaKeysQueue.push(n),n.then((function(){r.log('Media-keys set for "'+t+'"'),i.push(n),r.setMediaKeysQueue=r.setMediaKeysQueue.filter((function(t){return-1===i.indexOf(t)}))}))},e.generateRequestWithPreferredKeySession=function(t,e,r,i){var n,a,s=this,o=null==(n=this.config.drmSystems)||null==(a=n[t.keySystem])?void 0:a.generateRequest;if(o)try{var l=o.call(this.hls,e,r,t);if(!l)throw new Error("Invalid response from configured generateRequest filter");e=l.initDataType,r=t.decryptdata.pssh=l.initData?new Uint8Array(l.initData):null}catch(t){var u;if(this.warn(t.message),null!=(u=this.hls)&&u.config.debug)throw t}if(null===r)return this.log('Skipping key-session request for "'+i+'" (no initData)'),Promise.resolve(t);var h=this.getKeyIdString(t.decryptdata);this.log('Generating key-session request for "'+i+'": '+h+" (init data type: "+e+" length: "+(r?r.byteLength:null)+")");var d=new Mn,c=t._onmessage=function(e){var r=t.mediaKeysSession;if(r){var i=e.messageType,n=e.message;s.log('"'+i+'" message event for session "'+r.sessionId+'" message size: '+n.byteLength),"license-request"===i||"license-renewal"===i?s.renewLicense(t,n).catch((function(t){s.handleError(t),d.emit("error",t)})):"license-release"===i?t.keySystem===q.FAIRPLAY&&(s.updateKeySession(t,W("acknowledged")),s.removeSession(t)):s.warn('unhandled media key message type "'+i+'"')}else d.emit("error",new Error("invalid state"))},f=t._onkeystatuseschange=function(e){if(t.mediaKeysSession){s.onKeyStatusChange(t);var r=t.keyStatus;d.emit("keyStatus",r),"expired"===r&&(s.warn(t.keySystem+" expired for key "+h),s.renewKeySession(t))}else d.emit("error",new Error("invalid state"))};t.mediaKeysSession.addEventListener("message",c),t.mediaKeysSession.addEventListener("keystatuseschange",f);var g=new Promise((function(t,e){d.on("error",e),d.on("keyStatus",(function(r){r.startsWith("usable")?t():"output-restricted"===r?e(new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED,fatal:!1},"HDCP level output restricted")):"internal-error"===r?e(new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_STATUS_INTERNAL_ERROR,fatal:!0},'key status changed to "'+r+'"')):"expired"===r?e(new Error("key expired while generating request")):s.warn('unhandled key status change "'+r+'"')}))}));return t.mediaKeysSession.generateRequest(e,r).then((function(){var e;s.log('Request generated for key-session "'+(null==(e=t.mediaKeysSession)?void 0:e.sessionId)+'" keyId: '+h)})).catch((function(t){throw new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_NO_SESSION,error:t,fatal:!1},"Error generating key-session request: "+t)})).then((function(){return g})).catch((function(e){throw d.removeAllListeners(),s.removeSession(t),e})).then((function(){return d.removeAllListeners(),t}))},e.onKeyStatusChange=function(t){var e=this;t.mediaKeysSession.keyStatuses.forEach((function(r,i){e.log('key status change "'+r+'" for keyStatuses keyId: '+Lt("buffer"in i?new Uint8Array(i.buffer,i.byteOffset,i.byteLength):new Uint8Array(i))+" session keyId: "+Lt(new Uint8Array(t.decryptdata.keyId||[]))+" uri: "+t.decryptdata.uri),t.keyStatus=r}))},e.fetchServerCertificate=function(t){var e=this.config,r=new(0,e.loader)(e),n=this.getServerCertificateUrl(t);return n?(this.log('Fetching server certificate for "'+t+'"'),new Promise((function(a,s){var o={responseType:"arraybuffer",url:n},l=e.certLoadPolicy.default,u={loadPolicy:l,timeout:l.maxLoadTimeMs,maxRetry:0,retryDelay:0,maxRetryDelay:0},h={onSuccess:function(t,e,r,i){a(t.data)},onError:function(e,r,a,l){s(new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,fatal:!0,networkDetails:a,response:i({url:o.url,data:void 0},e)},'"'+t+'" certificate request failed ('+n+"). Status: "+e.code+" ("+e.text+")"))},onTimeout:function(e,r,i){s(new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,fatal:!0,networkDetails:i,response:{url:o.url,data:void 0}},'"'+t+'" certificate request timed out ('+n+")"))},onAbort:function(t,e,r){s(new Error("aborted"))}};r.load(o,u,h)}))):Promise.resolve()},e.setMediaKeysServerCertificate=function(t,e,r){var i=this;return new Promise((function(n,a){t.setServerCertificate(r).then((function(a){i.log("setServerCertificate "+(a?"success":"not supported by CDM")+" ("+(null==r?void 0:r.byteLength)+') on "'+e+'"'),n(t)})).catch((function(t){a(new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED,error:t,fatal:!0},t.message))}))}))},e.renewLicense=function(t,e){var r=this;return this.requestLicense(t,new Uint8Array(e)).then((function(e){return r.updateKeySession(t,new Uint8Array(e)).catch((function(t){throw new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_SESSION_UPDATE_FAILED,error:t,fatal:!0},t.message)}))}))},e.unpackPlayReadyKeyMessage=function(t,e){var r=String.fromCharCode.apply(null,new Uint16Array(e.buffer));if(!r.includes("PlayReadyKeyMessage"))return t.setRequestHeader("Content-Type","text/xml; charset=utf-8"),e;var i=(new DOMParser).parseFromString(r,"application/xml"),n=i.querySelectorAll("HttpHeader");if(n.length>0)for(var a,s=0,o=n.length;s<o;s++){var l,u,h=null==(l=(a=n[s]).querySelector("name"))?void 0:l.textContent,d=null==(u=a.querySelector("value"))?void 0:u.textContent;h&&d&&t.setRequestHeader(h,d)}var c=i.querySelector("Challenge"),f=null==c?void 0:c.textContent;if(!f)throw new Error("Cannot find <Challenge> in key message");return W(atob(f))},e.setupLicenseXHR=function(t,e,r,i){var n=this,a=this.config.licenseXhrSetup;return a?Promise.resolve().then((function(){if(!r.decryptdata)throw new Error("Key removed");return a.call(n.hls,t,e,r,i)})).catch((function(s){if(!r.decryptdata)throw s;return t.open("POST",e,!0),a.call(n.hls,t,e,r,i)})).then((function(r){return t.readyState||t.open("POST",e,!0),{xhr:t,licenseChallenge:r||i}})):(t.open("POST",e,!0),Promise.resolve({xhr:t,licenseChallenge:i}))},e.requestLicense=function(t,e){var r=this,i=this.config.keyLoadPolicy.default;return new Promise((function(n,a){var s=r.getLicenseServerUrl(t.keySystem);r.log("Sending license request to URL: "+s);var o=new XMLHttpRequest;o.responseType="arraybuffer",o.onreadystatechange=function(){if(!r.hls||!t.mediaKeysSession)return a(new Error("invalid state"));if(4===o.readyState)if(200===o.status){r._requestLicenseFailureCount=0;var l=o.response;r.log("License received "+(l instanceof ArrayBuffer?l.byteLength:l));var u=r.config.licenseResponseCallback;if(u)try{l=u.call(r.hls,o,s,t)}catch(t){r.error(t)}n(l)}else{var h=i.errorRetry,d=h?h.maxNumRetry:0;if(r._requestLicenseFailureCount++,r._requestLicenseFailureCount>d||o.status>=400&&o.status<500)a(new es({type:L.KEY_SYSTEM_ERROR,details:A.KEY_SYSTEM_LICENSE_REQUEST_FAILED,fatal:!0,networkDetails:o,response:{url:s,data:void 0,code:o.status,text:o.statusText}},"License Request XHR failed ("+s+"). Status: "+o.status+" ("+o.statusText+")"));else{var c=d-r._requestLicenseFailureCount+1;r.warn("Retrying license request, "+c+" attempts left"),r.requestLicense(t,e).then(n,a)}}},t.licenseXhr&&t.licenseXhr.readyState!==XMLHttpRequest.DONE&&t.licenseXhr.abort(),t.licenseXhr=o,r.setupLicenseXHR(o,s,t,e).then((function(e){var i=e.xhr,n=e.licenseChallenge;t.keySystem==q.PLAYREADY&&(n=r.unpackPlayReadyKeyMessage(i,n)),i.send(n)}))}))},e.onMediaAttached=function(t,e){if(this.config.emeEnabled){var r=e.media;this.media=r,r.addEventListener("encrypted",this.onMediaEncrypted),r.addEventListener("waitingforkey",this.onWaitingForKey)}},e.onMediaDetached=function(){var e=this,r=this.media,i=this.mediaKeySessions;r&&(r.removeEventListener("encrypted",this.onMediaEncrypted),r.removeEventListener("waitingforkey",this.onWaitingForKey),this.media=null),this._requestLicenseFailureCount=0,this.setMediaKeysQueue=[],this.mediaKeySessions=[],this.keyIdToKeySessionPromise={},qt.clearKeyUriToKeyIdMap();var n=i.length;t.CDMCleanupPromise=Promise.all(i.map((function(t){return e.removeSession(t)})).concat(null==r?void 0:r.setMediaKeys(null).catch((function(t){e.log("Could not clear media keys: "+t)})))).then((function(){n&&(e.log("finished closing key sessions and clearing media keys"),i.length=0)})).catch((function(t){e.log("Could not close sessions and clear media keys: "+t)}))},e.onManifestLoading=function(){this.keyFormatPromise=null},e.onManifestLoaded=function(t,e){var r=e.sessionKeys;if(r&&this.config.emeEnabled&&!this.keyFormatPromise){var i=r.reduce((function(t,e){return-1===t.indexOf(e.keyFormat)&&t.push(e.keyFormat),t}),[]);this.log("Selecting key-system from session-keys "+i.join(", ")),this.keyFormatPromise=this.getKeyFormatPromise(i)}},e.removeSession=function(t){var e=this,r=t.mediaKeysSession,i=t.licenseXhr;if(r){this.log("Remove licenses and keys and close session "+r.sessionId),t._onmessage&&(r.removeEventListener("message",t._onmessage),t._onmessage=void 0),t._onkeystatuseschange&&(r.removeEventListener("keystatuseschange",t._onkeystatuseschange),t._onkeystatuseschange=void 0),i&&i.readyState!==XMLHttpRequest.DONE&&i.abort(),t.mediaKeysSession=t.decryptdata=t.licenseXhr=void 0;var n=this.mediaKeySessions.indexOf(t);return n>-1&&this.mediaKeySessions.splice(n,1),r.remove().catch((function(t){e.log("Could not remove session: "+t)})).then((function(){return r.close()})).catch((function(t){e.log("Could not close session: "+t)}))}},t}();Qa.CDMCleanupPromise=void 0;var Ja,$a,Za,ts,es=function(t){function e(e,r){var i;return(i=t.call(this,r)||this).data=void 0,e.error||(e.error=new Error(r)),i.data=e,e.err=e.error,i}return l(e,t),e}(c(Error));!function(t){t.MANIFEST="m",t.AUDIO="a",t.VIDEO="v",t.MUXED="av",t.INIT="i",t.CAPTION="c",t.TIMED_TEXT="tt",t.KEY="k",t.OTHER="o"}(Ja||(Ja={})),function(t){t.DASH="d",t.HLS="h",t.SMOOTH="s",t.OTHER="o"}($a||($a={})),function(t){t.OBJECT="CMCD-Object",t.REQUEST="CMCD-Request",t.SESSION="CMCD-Session",t.STATUS="CMCD-Status"}(Za||(Za={}));var rs=((ts={})[Za.OBJECT]=["br","d","ot","tb"],ts[Za.REQUEST]=["bl","dl","mtp","nor","nrr","su"],ts[Za.SESSION]=["cid","pr","sf","sid","st","v"],ts[Za.STATUS]=["bs","rtp"],ts),is=function t(e,r){this.value=void 0,this.params=void 0,Array.isArray(e)&&(e=e.map((function(e){return e instanceof t?e:new t(e)}))),this.value=e,this.params=r},ns=function(t){this.description=void 0,this.description=t},as="Dict";function ss(t,e,r,i){return new Error("failed to "+t+' "'+(n=e,(Array.isArray(n)?JSON.stringify(n):n instanceof Map?"Map{}":n instanceof Set?"Set{}":"object"==typeof n?JSON.stringify(n):String(n))+'" as ')+r,{cause:i});var n}var os="Bare Item",ls="Boolean",us="Byte Sequence",hs="Decimal",ds="Integer",cs=/[\x00-\x1f\x7f]+/,fs="Token",gs="Key";function vs(t,e,r){return ss("serialize",t,e,r)}function ms(t){if(!1===ArrayBuffer.isView(t))throw vs(t,us);return":"+(e=t,btoa(String.fromCharCode.apply(String,e))+":");var e}function ps(t){if(function(t){return t<-999999999999999||999999999999999<t}(t))throw vs(t,ds);return t.toString()}function ys(t,e){if(t<0)return-ys(-t,e);var r=Math.pow(10,e);if(Math.abs(t*r%1-.5)<Number.EPSILON){var i=Math.floor(t*r);return(i%2==0?i:i+1)/r}return Math.round(t*r)/r}function Es(t){var e=ys(t,3);if(Math.floor(Math.abs(e)).toString().length>12)throw vs(t,hs);var r=e.toString();return r.includes(".")?r:r+".0"}var Ts="String";function Ss(t){var e,r=(e=t).description||e.toString().slice(7,-1);if(!1===/^([a-zA-Z*])([!#$%&'*+\-.^_`|~\w:/]*)$/.test(r))throw vs(r,fs);return r}function Ls(t){switch(typeof t){case"number":if(!y(t))throw vs(t,os);return Number.isInteger(t)?ps(t):Es(t);case"string":return function(t){if(cs.test(t))throw vs(t,Ts);return'"'+t.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'}(t);case"symbol":return Ss(t);case"boolean":return function(t){if("boolean"!=typeof t)throw vs(t,ls);return t?"?1":"?0"}(t);case"object":if(t instanceof Date)return function(t){return"@"+ps(t.getTime()/1e3)}(t);if(t instanceof Uint8Array)return ms(t);if(t instanceof ns)return Ss(t);default:throw vs(t,os)}}function As(t){if(!1===/^[a-z*][a-z0-9\-_.*]*$/.test(t))throw vs(t,gs);return t}function Rs(t){return null==t?"":Object.entries(t).map((function(t){var e=t[0],r=t[1];return!0===r?";"+As(e):";"+As(e)+"="+Ls(r)})).join("")}function ks(t){return t instanceof is?""+Ls(t.value)+Rs(t.params):Ls(t)}function bs(t,e){var r;if(void 0===e&&(e={whitespace:!0}),"object"!=typeof t)throw vs(t,as);var i=t instanceof Map?t.entries():Object.entries(t),n=null!=(r=e)&&r.whitespace?" ":"";return Array.from(i).map((function(t){var e=t[0],r=t[1];r instanceof is==0&&(r=new is(r));var i,n=As(e);return!0===r.value?n+=Rs(r.params):(n+="=",Array.isArray(r.value)?n+="("+(i=r).value.map(ks).join(" ")+")"+Rs(i.params):n+=ks(r)),n})).join(","+n)}var Ds=function(t){return"ot"===t||"sf"===t||"st"===t},Is=function(t){return"number"==typeof t?y(t):null!=t&&""!==t&&!1!==t},ws=function(t){return Math.round(t)},Cs=function(t){return 100*ws(t/100)},_s={br:ws,d:ws,bl:Cs,dl:Cs,mtp:Cs,nor:function(t,e){return null!=e&&e.baseUrl&&(t=function(t,e){var r=new URL(t),i=new URL(e);if(r.origin!==i.origin)return t;for(var n=r.pathname.split("/").slice(1),a=i.pathname.split("/").slice(1,-1);n[0]===a[0];)n.shift(),a.shift();for(;a.length;)a.shift(),n.unshift("..");return n.join("/")}(t,e.baseUrl)),encodeURIComponent(t)},rtp:Cs,tb:ws};function xs(t,e){return void 0===e&&(e={}),t?function(t,e){return bs(t,e)}(function(t,e){var r={};if(null==t||"object"!=typeof t)return r;var i=Object.keys(t).sort(),n=o({},_s,null==e?void 0:e.formatters),a=null==e?void 0:e.filter;return i.forEach((function(i){if(null==a||!a(i)){var s=t[i],o=n[i];o&&(s=o(s,e)),"v"===i&&1===s||"pr"==i&&1===s||Is(s)&&(Ds(i)&&"string"==typeof s&&(s=new ns(s)),r[i]=s)}})),r}(t,e),o({whitespace:!1},e)):""}function Ps(t,e,r){return o(t,function(t,e){var r;if(void 0===e&&(e={}),!t)return{};var i=Object.entries(t),n=Object.entries(rs).concat(Object.entries((null==(r=e)?void 0:r.customHeaderMap)||{})),a=i.reduce((function(t,e){var r,i=e[0],a=e[1],s=(null==(r=n.find((function(t){return t[1].includes(i)})))?void 0:r[0])||Za.REQUEST;return null!=t[s]||(t[s]={}),t[s][i]=a,t}),{});return Object.entries(a).reduce((function(t,r){var i=r[0],n=r[1];return t[i]=xs(n,e),t}),{})}(e,r))}var Fs="CMCD",Ms=/CMCD=[^&#]+/;function Os(t,e,r){var i=function(t,e){if(void 0===e&&(e={}),!t)return"";var r=xs(t,e);return Fs+"="+encodeURIComponent(r)}(e,r);if(!i)return t;if(Ms.test(t))return t.replace(Ms,i);var n=t.includes("?")?"&":"?";return""+t+n+i}var Ns=function(){function t(t){var e=this;this.hls=void 0,this.config=void 0,this.media=void 0,this.sid=void 0,this.cid=void 0,this.useHeaders=!1,this.includeKeys=void 0,this.initialized=!1,this.starved=!1,this.buffering=!0,this.audioBuffer=void 0,this.videoBuffer=void 0,this.onWaiting=function(){e.initialized&&(e.starved=!0),e.buffering=!0},this.onPlaying=function(){e.initialized||(e.initialized=!0),e.buffering=!1},this.applyPlaylistData=function(t){try{e.apply(t,{ot:Ja.MANIFEST,su:!e.initialized})}catch(t){w.warn("Could not generate manifest CMCD data.",t)}},this.applyFragmentData=function(t){try{var r=t.frag,i=e.hls.levels[r.level],n=e.getObjectType(r),a={d:1e3*r.duration,ot:n};n!==Ja.VIDEO&&n!==Ja.AUDIO&&n!=Ja.MUXED||(a.br=i.bitrate/1e3,a.tb=e.getTopBandwidth(n)/1e3,a.bl=e.getBufferLength(n)),e.apply(t,a)}catch(t){w.warn("Could not generate segment CMCD data.",t)}},this.hls=t;var r=this.config=t.config,i=r.cmcd;null!=i&&(r.pLoader=this.createPlaylistLoader(),r.fLoader=this.createFragmentLoader(),this.sid=i.sessionId||function(){try{return crypto.randomUUID()}catch(i){try{var t=URL.createObjectURL(new Blob),e=t.toString();return URL.revokeObjectURL(t),e.slice(e.lastIndexOf("/")+1)}catch(t){var r=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var e=(r+16*Math.random())%16|0;return r=Math.floor(r/16),("x"==t?e:3&e|8).toString(16)}))}}}(),this.cid=i.contentId,this.useHeaders=!0===i.useHeaders,this.includeKeys=i.includeKeys,this.registerListeners())}var e=t.prototype;return e.registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.on(S.MEDIA_DETACHED,this.onMediaDetached,this),t.on(S.BUFFER_CREATED,this.onBufferCreated,this)},e.unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.off(S.MEDIA_DETACHED,this.onMediaDetached,this),t.off(S.BUFFER_CREATED,this.onBufferCreated,this)},e.destroy=function(){this.unregisterListeners(),this.onMediaDetached(),this.hls=this.config=this.audioBuffer=this.videoBuffer=null,this.onWaiting=this.onPlaying=null},e.onMediaAttached=function(t,e){this.media=e.media,this.media.addEventListener("waiting",this.onWaiting),this.media.addEventListener("playing",this.onPlaying)},e.onMediaDetached=function(){this.media&&(this.media.removeEventListener("waiting",this.onWaiting),this.media.removeEventListener("playing",this.onPlaying),this.media=null)},e.onBufferCreated=function(t,e){var r,i;this.audioBuffer=null==(r=e.tracks.audio)?void 0:r.buffer,this.videoBuffer=null==(i=e.tracks.video)?void 0:i.buffer},e.createData=function(){var t;return{v:1,sf:$a.HLS,sid:this.sid,cid:this.cid,pr:null==(t=this.media)?void 0:t.playbackRate,mtp:this.hls.bandwidthEstimate/1e3}},e.apply=function(t,e){void 0===e&&(e={}),o(e,this.createData());var r=e.ot===Ja.INIT||e.ot===Ja.VIDEO||e.ot===Ja.MUXED;this.starved&&r&&(e.bs=!0,e.su=!0,this.starved=!1),null==e.su&&(e.su=this.buffering);var i=this.includeKeys;i&&(e=Object.keys(e).reduce((function(t,r){return i.includes(r)&&(t[r]=e[r]),t}),{})),this.useHeaders?(t.headers||(t.headers={}),Ps(t.headers,e)):t.url=Os(t.url,e)},e.getObjectType=function(t){var e=t.type;return"subtitle"===e?Ja.TIMED_TEXT:"initSegment"===t.sn?Ja.INIT:"audio"===e?Ja.AUDIO:"main"===e?this.hls.audioTracks.length?Ja.VIDEO:Ja.MUXED:void 0},e.getTopBandwidth=function(t){var e,r=0,i=this.hls;if(t===Ja.AUDIO)e=i.audioTracks;else{var n=i.maxAutoLevel,a=n>-1?n+1:i.levels.length;e=i.levels.slice(0,a)}for(var s,o=g(e);!(s=o()).done;){var l=s.value;l.bitrate>r&&(r=l.bitrate)}return r>0?r:NaN},e.getBufferLength=function(t){var e=this.hls.media,r=t===Ja.AUDIO?this.audioBuffer:this.videoBuffer;return r&&e?1e3*zr.bufferInfo(r,e.currentTime,this.config.maxBufferHole).len:NaN},e.createPlaylistLoader=function(){var t=this.config.pLoader,e=this.applyPlaylistData,r=t||this.config.loader;return function(){function t(t){this.loader=void 0,this.loader=new r(t)}var i=t.prototype;return i.destroy=function(){this.loader.destroy()},i.abort=function(){this.loader.abort()},i.load=function(t,r,i){e(t),this.loader.load(t,r,i)},s(t,[{key:"stats",get:function(){return this.loader.stats}},{key:"context",get:function(){return this.loader.context}}]),t}()},e.createFragmentLoader=function(){var t=this.config.fLoader,e=this.applyFragmentData,r=t||this.config.loader;return function(){function t(t){this.loader=void 0,this.loader=new r(t)}var i=t.prototype;return i.destroy=function(){this.loader.destroy()},i.abort=function(){this.loader.abort()},i.load=function(t,r,i){e(t),this.loader.load(t,r,i)},s(t,[{key:"stats",get:function(){return this.loader.stats}},{key:"context",get:function(){return this.loader.context}}]),t}()},t}(),Us=function(){function t(t){this.hls=void 0,this.log=void 0,this.loader=null,this.uri=null,this.pathwayId=".",this.pathwayPriority=null,this.timeToLoad=300,this.reloadTimer=-1,this.updated=0,this.started=!1,this.enabled=!0,this.levels=null,this.audioTracks=null,this.subtitleTracks=null,this.penalizedPathways={},this.hls=t,this.log=w.log.bind(w,"[content-steering]:"),this.registerListeners()}var e=t.prototype;return e.registerListeners=function(){var t=this.hls;t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_LOADED,this.onManifestLoaded,this),t.on(S.MANIFEST_PARSED,this.onManifestParsed,this),t.on(S.ERROR,this.onError,this)},e.unregisterListeners=function(){var t=this.hls;t&&(t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_LOADED,this.onManifestLoaded,this),t.off(S.MANIFEST_PARSED,this.onManifestParsed,this),t.off(S.ERROR,this.onError,this))},e.startLoad=function(){if(this.started=!0,this.clearTimeout(),this.enabled&&this.uri){if(this.updated){var t=1e3*this.timeToLoad-(performance.now()-this.updated);if(t>0)return void this.scheduleRefresh(this.uri,t)}this.loadSteeringManifest(this.uri)}},e.stopLoad=function(){this.started=!1,this.loader&&(this.loader.destroy(),this.loader=null),this.clearTimeout()},e.clearTimeout=function(){-1!==this.reloadTimer&&(self.clearTimeout(this.reloadTimer),this.reloadTimer=-1)},e.destroy=function(){this.unregisterListeners(),this.stopLoad(),this.hls=null,this.levels=this.audioTracks=this.subtitleTracks=null},e.removeLevel=function(t){var e=this.levels;e&&(this.levels=e.filter((function(e){return e!==t})))},e.onManifestLoading=function(){this.stopLoad(),this.enabled=!0,this.timeToLoad=300,this.updated=0,this.uri=null,this.pathwayId=".",this.levels=this.audioTracks=this.subtitleTracks=null},e.onManifestLoaded=function(t,e){var r=e.contentSteering;null!==r&&(this.pathwayId=r.pathwayId,this.uri=r.uri,this.started&&this.startLoad())},e.onManifestParsed=function(t,e){this.audioTracks=e.audioTracks,this.subtitleTracks=e.subtitleTracks},e.onError=function(t,e){var r=e.errorAction;if((null==r?void 0:r.action)===Tr&&r.flags===Rr){var i=this.levels,n=this.pathwayPriority,a=this.pathwayId;if(e.context){var s=e.context,o=s.groupId,l=s.pathwayId,u=s.type;o&&i?a=this.getPathwayForGroupId(o,u,a):l&&(a=l)}a in this.penalizedPathways||(this.penalizedPathways[a]=performance.now()),!n&&i&&(n=i.reduce((function(t,e){return-1===t.indexOf(e.pathwayId)&&t.push(e.pathwayId),t}),[])),n&&n.length>1&&(this.updatePathwayPriority(n),r.resolved=this.pathwayId!==a),r.resolved||w.warn("Could not resolve "+e.details+' ("'+e.error.message+'") with content-steering for Pathway: '+a+" levels: "+(i?i.length:i)+" priorities: "+JSON.stringify(n)+" penalized: "+JSON.stringify(this.penalizedPathways))}},e.filterParsedLevels=function(t){this.levels=t;var e=this.getLevelsForPathway(this.pathwayId);if(0===e.length){var r=t[0].pathwayId;this.log("No levels found in Pathway "+this.pathwayId+'. Setting initial Pathway to "'+r+'"'),e=this.getLevelsForPathway(r),this.pathwayId=r}return e.length!==t.length?(this.log("Found "+e.length+"/"+t.length+' levels in Pathway "'+this.pathwayId+'"'),e):t},e.getLevelsForPathway=function(t){return null===this.levels?[]:this.levels.filter((function(e){return t===e.pathwayId}))},e.updatePathwayPriority=function(t){var e;this.pathwayPriority=t;var r=this.penalizedPathways,i=performance.now();Object.keys(r).forEach((function(t){i-r[t]>3e5&&delete r[t]}));for(var n=0;n<t.length;n++){var a=t[n];if(!(a in r)){if(a===this.pathwayId)return;var s=this.hls.nextLoadLevel,o=this.hls.levels[s];if((e=this.getLevelsForPathway(a)).length>0){this.log('Setting Pathway to "'+a+'"'),this.pathwayId=a,ur(e),this.hls.trigger(S.LEVELS_UPDATED,{levels:e});var l=this.hls.levels[s];o&&l&&this.levels&&(l.attrs["STABLE-VARIANT-ID"]!==o.attrs["STABLE-VARIANT-ID"]&&l.bitrate!==o.bitrate&&this.log("Unstable Pathways change from bitrate "+o.bitrate+" to "+l.bitrate),this.hls.nextLoadLevel=s);break}}}},e.getPathwayForGroupId=function(t,e,r){for(var i=this.getLevelsForPathway(r).concat(this.levels||[]),n=0;n<i.length;n++)if(e===be&&i[n].hasAudioGroup(t)||e===De&&i[n].hasSubtitleGroup(t))return i[n].pathwayId;return r},e.clonePathways=function(t){var e=this,r=this.levels;if(r){var i={},n={};t.forEach((function(t){var a=t.ID,s=t["BASE-ID"],o=t["URI-REPLACEMENT"];if(!r.some((function(t){return t.pathwayId===a}))){var l=e.getLevelsForPathway(s).map((function(t){var e=new x(t.attrs);e["PATHWAY-ID"]=a;var r=e.AUDIO&&e.AUDIO+"_clone_"+a,s=e.SUBTITLES&&e.SUBTITLES+"_clone_"+a;r&&(i[e.AUDIO]=r,e.AUDIO=r),s&&(n[e.SUBTITLES]=s,e.SUBTITLES=s);var l=Gs(t.uri,e["STABLE-VARIANT-ID"],"PER-VARIANT-URIS",o),u=new tr({attrs:e,audioCodec:t.audioCodec,bitrate:t.bitrate,height:t.height,name:t.name,url:l,videoCodec:t.videoCodec,width:t.width});if(t.audioGroups)for(var h=1;h<t.audioGroups.length;h++)u.addGroupId("audio",t.audioGroups[h]+"_clone_"+a);if(t.subtitleGroups)for(var d=1;d<t.subtitleGroups.length;d++)u.addGroupId("text",t.subtitleGroups[d]+"_clone_"+a);return u}));r.push.apply(r,l),Bs(e.audioTracks,i,o,a),Bs(e.subtitleTracks,n,o,a)}}))}},e.loadSteeringManifest=function(t){var e,r=this,i=this.hls.config,n=i.loader;this.loader&&this.loader.destroy(),this.loader=new n(i);try{e=new self.URL(t)}catch(e){return this.enabled=!1,void this.log("Failed to parse Steering Manifest URI: "+t)}if("data:"!==e.protocol){var a=0|(this.hls.bandwidthEstimate||i.abrEwmaDefaultEstimate);e.searchParams.set("_HLS_pathway",this.pathwayId),e.searchParams.set("_HLS_throughput",""+a)}var s={responseType:"json",url:e.href},o=i.steeringManifestLoadPolicy.default,l=o.errorRetry||o.timeoutRetry||{},u={loadPolicy:o,timeout:o.maxLoadTimeMs,maxRetry:l.maxNumRetry||0,retryDelay:l.retryDelayMs||0,maxRetryDelay:l.maxRetryDelayMs||0},h={onSuccess:function(t,i,n,a){r.log('Loaded steering manifest: "'+e+'"');var s=t.data;if(1===s.VERSION){r.updated=performance.now(),r.timeToLoad=s.TTL;var o=s["RELOAD-URI"],l=s["PATHWAY-CLONES"],u=s["PATHWAY-PRIORITY"];if(o)try{r.uri=new self.URL(o,e).href}catch(t){return r.enabled=!1,void r.log("Failed to parse Steering Manifest RELOAD-URI: "+o)}r.scheduleRefresh(r.uri||n.url),l&&r.clonePathways(l);var h={steeringManifest:s,url:e.toString()};r.hls.trigger(S.STEERING_MANIFEST_LOADED,h),u&&r.updatePathwayPriority(u)}else r.log("Steering VERSION "+s.VERSION+" not supported!")},onError:function(t,e,i,n){if(r.log("Error loading steering manifest: "+t.code+" "+t.text+" ("+e.url+")"),r.stopLoad(),410===t.code)return r.enabled=!1,void r.log("Steering manifest "+e.url+" no longer available");var a=1e3*r.timeToLoad;if(429!==t.code)r.scheduleRefresh(r.uri||e.url,a);else{var s=r.loader;if("function"==typeof(null==s?void 0:s.getResponseHeader)){var o=s.getResponseHeader("Retry-After");o&&(a=1e3*parseFloat(o))}r.log("Steering manifest "+e.url+" rate limited")}},onTimeout:function(t,e,i){r.log("Timeout loading steering manifest ("+e.url+")"),r.scheduleRefresh(r.uri||e.url)}};this.log("Requesting steering manifest: "+e),this.loader.load(s,u,h)},e.scheduleRefresh=function(t,e){var r=this;void 0===e&&(e=1e3*this.timeToLoad),this.clearTimeout(),this.reloadTimer=self.setTimeout((function(){var e,i=null==(e=r.hls)?void 0:e.media;!i||i.ended?r.scheduleRefresh(t,1e3*r.timeToLoad):r.loadSteeringManifest(t)}),e)},t}();function Bs(t,e,r,i){t&&Object.keys(e).forEach((function(n){var a=t.filter((function(t){return t.groupId===n})).map((function(t){var a=o({},t);return a.details=void 0,a.attrs=new x(a.attrs),a.url=a.attrs.URI=Gs(t.url,t.attrs["STABLE-RENDITION-ID"],"PER-RENDITION-URIS",r),a.groupId=a.attrs["GROUP-ID"]=e[n],a.attrs["PATHWAY-ID"]=i,a}));t.push.apply(t,a)}))}function Gs(t,e,r,i){var n,a=i.HOST,s=i.PARAMS,o=i[r];e&&(n=null==o?void 0:o[e])&&(t=n);var l=new self.URL(t);return a&&!n&&(l.host=a),s&&Object.keys(s).sort().forEach((function(t){t&&l.searchParams.set(t,s[t])})),l.href}var Ks=/^age:\s*[\d.]+\s*$/im,Hs=function(){function t(t){this.xhrSetup=void 0,this.requestTimeout=void 0,this.retryTimeout=void 0,this.retryDelay=void 0,this.config=null,this.callbacks=null,this.context=null,this.loader=null,this.stats=void 0,this.xhrSetup=t&&t.xhrSetup||null,this.stats=new M,this.retryDelay=0}var e=t.prototype;return e.destroy=function(){this.callbacks=null,this.abortInternal(),this.loader=null,this.config=null,this.context=null,this.xhrSetup=null,this.stats=null},e.abortInternal=function(){var t=this.loader;self.clearTimeout(this.requestTimeout),self.clearTimeout(this.retryTimeout),t&&(t.onreadystatechange=null,t.onprogress=null,4!==t.readyState&&(this.stats.aborted=!0,t.abort()))},e.abort=function(){var t;this.abortInternal(),null!=(t=this.callbacks)&&t.onAbort&&this.callbacks.onAbort(this.stats,this.context,this.loader)},e.load=function(t,e,r){if(this.stats.loading.start)throw new Error("Loader can only be used once.");this.stats.loading.start=self.performance.now(),this.context=t,this.config=e,this.callbacks=r,this.loadInternal()},e.loadInternal=function(){var t=this,e=this.config,r=this.context;if(e&&r){var i=this.loader=new self.XMLHttpRequest,n=this.stats;n.loading.first=0,n.loaded=0,n.aborted=!1;var a=this.xhrSetup;a?Promise.resolve().then((function(){if(!t.stats.aborted)return a(i,r.url)})).catch((function(t){return i.open("GET",r.url,!0),a(i,r.url)})).then((function(){t.stats.aborted||t.openAndSendXhr(i,r,e)})).catch((function(e){t.callbacks.onError({code:i.status,text:e.message},r,i,n)})):this.openAndSendXhr(i,r,e)}},e.openAndSendXhr=function(t,e,r){t.readyState||t.open("GET",e.url,!0);var i=e.headers,n=r.loadPolicy,a=n.maxTimeToFirstByteMs,s=n.maxLoadTimeMs;if(i)for(var o in i)t.setRequestHeader(o,i[o]);e.rangeEnd&&t.setRequestHeader("Range","bytes="+e.rangeStart+"-"+(e.rangeEnd-1)),t.onreadystatechange=this.readystatechange.bind(this),t.onprogress=this.loadprogress.bind(this),t.responseType=e.responseType,self.clearTimeout(this.requestTimeout),r.timeout=a&&y(a)?a:s,this.requestTimeout=self.setTimeout(this.loadtimeout.bind(this),r.timeout),t.send()},e.readystatechange=function(){var t=this.context,e=this.loader,r=this.stats;if(t&&e){var i=e.readyState,n=this.config;if(!r.aborted&&i>=2&&(0===r.loading.first&&(r.loading.first=Math.max(self.performance.now(),r.loading.start),n.timeout!==n.loadPolicy.maxLoadTimeMs&&(self.clearTimeout(this.requestTimeout),n.timeout=n.loadPolicy.maxLoadTimeMs,this.requestTimeout=self.setTimeout(this.loadtimeout.bind(this),n.loadPolicy.maxLoadTimeMs-(r.loading.first-r.loading.start)))),4===i)){self.clearTimeout(this.requestTimeout),e.onreadystatechange=null,e.onprogress=null;var a=e.status,s="text"!==e.responseType;if(a>=200&&a<300&&(s&&e.response||null!==e.responseText)){r.loading.end=Math.max(self.performance.now(),r.loading.first);var o=s?e.response:e.responseText,l="arraybuffer"===e.responseType?o.byteLength:o.length;if(r.loaded=r.total=l,r.bwEstimate=8e3*r.total/(r.loading.end-r.loading.first),!this.callbacks)return;var u=this.callbacks.onProgress;if(u&&u(r,t,o,e),!this.callbacks)return;var h={url:e.responseURL,data:o,code:a};this.callbacks.onSuccess(h,r,t,e)}else{var d=n.loadPolicy.errorRetry;gr(d,r.retry,!1,{url:t.url,data:void 0,code:a})?this.retry(d):(w.error(a+" while loading "+t.url),this.callbacks.onError({code:a,text:e.statusText},t,e,r))}}}},e.loadtimeout=function(){var t,e=null==(t=this.config)?void 0:t.loadPolicy.timeoutRetry;if(gr(e,this.stats.retry,!0))this.retry(e);else{var r;w.warn("timeout while loading "+(null==(r=this.context)?void 0:r.url));var i=this.callbacks;i&&(this.abortInternal(),i.onTimeout(this.stats,this.context,this.loader))}},e.retry=function(t){var e=this.context,r=this.stats;this.retryDelay=cr(t,r.retry),r.retry++,w.warn((status?"HTTP Status "+status:"Timeout")+" while loading "+(null==e?void 0:e.url)+", retrying "+r.retry+"/"+t.maxNumRetry+" in "+this.retryDelay+"ms"),this.abortInternal(),this.loader=null,self.clearTimeout(this.retryTimeout),this.retryTimeout=self.setTimeout(this.loadInternal.bind(this),this.retryDelay)},e.loadprogress=function(t){var e=this.stats;e.loaded=t.loaded,t.lengthComputable&&(e.total=t.total)},e.getCacheAge=function(){var t=null;if(this.loader&&Ks.test(this.loader.getAllResponseHeaders())){var e=this.loader.getResponseHeader("age");t=e?parseFloat(e):null}return t},e.getResponseHeader=function(t){return this.loader&&new RegExp("^"+t+":\\s*[\\d.]+\\s*$","im").test(this.loader.getAllResponseHeaders())?this.loader.getResponseHeader(t):null},t}(),Vs=/(\d+)-(\d+)\/(\d+)/,Ys=function(){function t(t){this.fetchSetup=void 0,this.requestTimeout=void 0,this.request=null,this.response=null,this.controller=void 0,this.context=null,this.config=null,this.callbacks=null,this.stats=void 0,this.loader=null,this.fetchSetup=t.fetchSetup||Ws,this.controller=new self.AbortController,this.stats=new M}var e=t.prototype;return e.destroy=function(){this.loader=this.callbacks=this.context=this.config=this.request=null,this.abortInternal(),this.response=null,this.fetchSetup=this.controller=this.stats=null},e.abortInternal=function(){this.controller&&!this.stats.loading.end&&(this.stats.aborted=!0,this.controller.abort())},e.abort=function(){var t;this.abortInternal(),null!=(t=this.callbacks)&&t.onAbort&&this.callbacks.onAbort(this.stats,this.context,this.response)},e.load=function(t,e,r){var i=this,n=this.stats;if(n.loading.start)throw new Error("Loader can only be used once.");n.loading.start=self.performance.now();var a=function(t,e){var r={method:"GET",mode:"cors",credentials:"same-origin",signal:e,headers:new self.Headers(o({},t.headers))};return t.rangeEnd&&r.headers.set("Range","bytes="+t.rangeStart+"-"+String(t.rangeEnd-1)),r}(t,this.controller.signal),s=r.onProgress,l="arraybuffer"===t.responseType,u=l?"byteLength":"length",h=e.loadPolicy,d=h.maxTimeToFirstByteMs,c=h.maxLoadTimeMs;this.context=t,this.config=e,this.callbacks=r,this.request=this.fetchSetup(t,a),self.clearTimeout(this.requestTimeout),e.timeout=d&&y(d)?d:c,this.requestTimeout=self.setTimeout((function(){i.abortInternal(),r.onTimeout(n,t,i.response)}),e.timeout),self.fetch(this.request).then((function(a){i.response=i.loader=a;var o=Math.max(self.performance.now(),n.loading.start);if(self.clearTimeout(i.requestTimeout),e.timeout=c,i.requestTimeout=self.setTimeout((function(){i.abortInternal(),r.onTimeout(n,t,i.response)}),c-(o-n.loading.start)),!a.ok){var u=a.status,h=a.statusText;throw new qs(h||"fetch, bad network response",u,a)}return n.loading.first=o,n.total=function(t){var e=t.get("Content-Range");if(e){var r=function(t){var e=Vs.exec(t);if(e)return parseInt(e[2])-parseInt(e[1])+1}(e);if(y(r))return r}var i=t.get("Content-Length");if(i)return parseInt(i)}(a.headers)||n.total,s&&y(e.highWaterMark)?i.loadProgressively(a,n,t,e.highWaterMark,s):l?a.arrayBuffer():"json"===t.responseType?a.json():a.text()})).then((function(a){var o=i.response;if(!o)throw new Error("loader destroyed");self.clearTimeout(i.requestTimeout),n.loading.end=Math.max(self.performance.now(),n.loading.first);var l=a[u];l&&(n.loaded=n.total=l);var h={url:o.url,data:a,code:o.status};s&&!y(e.highWaterMark)&&s(n,t,a,o),r.onSuccess(h,n,t,o)})).catch((function(e){if(self.clearTimeout(i.requestTimeout),!n.aborted){var a=e&&e.code||0,s=e?e.message:null;r.onError({code:a,text:s},t,e?e.details:null,n)}}))},e.getCacheAge=function(){var t=null;if(this.response){var e=this.response.headers.get("age");t=e?parseFloat(e):null}return t},e.getResponseHeader=function(t){return this.response?this.response.headers.get(t):null},e.loadProgressively=function(t,e,r,i,n){void 0===i&&(i=0);var a=new ki,s=t.body.getReader();return function o(){return s.read().then((function(s){if(s.done)return a.dataLength&&n(e,r,a.flush(),t),Promise.resolve(new ArrayBuffer(0));var l=s.value,u=l.length;return e.loaded+=u,u<i||a.dataLength?(a.push(l),a.dataLength>=i&&n(e,r,a.flush(),t)):n(e,r,l,t),o()})).catch((function(){return Promise.reject()}))}()},t}();function Ws(t,e){return new self.Request(t.url,e)}var js,qs=function(t){function e(e,r,i){var n;return(n=t.call(this,e)||this).code=void 0,n.details=void 0,n.code=r,n.details=i,n}return l(e,t),e}(c(Error)),Xs=/\s/,zs=i(i({autoStartLoad:!0,startPosition:-1,defaultAudioCodec:void 0,debug:!1,capLevelOnFPSDrop:!1,capLevelToPlayerSize:!1,ignoreDevicePixelRatio:!1,preferManagedMediaSource:!0,initialLiveManifestSize:1,maxBufferLength:30,backBufferLength:1/0,frontBufferFlushThreshold:1/0,maxBufferSize:6e7,maxBufferHole:.1,highBufferWatchdogPeriod:2,nudgeOffset:.1,nudgeMaxRetry:3,maxFragLookUpTolerance:.25,liveSyncDurationCount:3,liveMaxLatencyDurationCount:1/0,liveSyncDuration:void 0,liveMaxLatencyDuration:void 0,maxLiveSyncPlaybackRate:1,liveDurationInfinity:!1,liveBackBufferLength:null,maxMaxBufferLength:600,enableWorker:!0,workerPath:null,enableSoftwareAES:!0,startLevel:void 0,startFragPrefetch:!1,fpsDroppedMonitoringPeriod:5e3,fpsDroppedMonitoringThreshold:.2,appendErrorMaxRetry:3,loader:Hs,fLoader:void 0,pLoader:void 0,xhrSetup:void 0,licenseXhrSetup:void 0,licenseResponseCallback:void 0,abrController:Br,bufferController:Qn,capLevelController:qa,errorController:br,fpsController:Xa,stretchShortVideoTrack:!1,maxAudioFramesDrift:1,forceKeyFrameOnDiscontinuity:!0,abrEwmaFastLive:3,abrEwmaSlowLive:9,abrEwmaFastVoD:3,abrEwmaSlowVoD:9,abrEwmaDefaultEstimate:5e5,abrEwmaDefaultEstimateMax:5e6,abrBandWidthFactor:.95,abrBandWidthUpFactor:.7,abrMaxWithRealBitrate:!1,maxStarvationDelay:4,maxLoadingDelay:4,minAutoBitrate:0,emeEnabled:!1,widevineLicenseUrl:void 0,drmSystems:{},drmSystemOptions:{},requestMediaKeySystemAccessFunc:it,testBandwidth:!0,progressive:!1,lowLatencyMode:!0,cmcd:void 0,enableDateRangeMetadataCues:!0,enableEmsgMetadataCues:!0,enableID3MetadataCues:!0,useMediaCapabilities:!0,certLoadPolicy:{default:{maxTimeToFirstByteMs:8e3,maxLoadTimeMs:2e4,timeoutRetry:null,errorRetry:null}},keyLoadPolicy:{default:{maxTimeToFirstByteMs:8e3,maxLoadTimeMs:2e4,timeoutRetry:{maxNumRetry:1,retryDelayMs:1e3,maxRetryDelayMs:2e4,backoff:"linear"},errorRetry:{maxNumRetry:8,retryDelayMs:1e3,maxRetryDelayMs:2e4,backoff:"linear"}}},manifestLoadPolicy:{default:{maxTimeToFirstByteMs:1/0,maxLoadTimeMs:2e4,timeoutRetry:{maxNumRetry:2,retryDelayMs:0,maxRetryDelayMs:0},errorRetry:{maxNumRetry:1,retryDelayMs:1e3,maxRetryDelayMs:8e3}}},playlistLoadPolicy:{default:{maxTimeToFirstByteMs:1e4,maxLoadTimeMs:2e4,timeoutRetry:{maxNumRetry:2,retryDelayMs:0,maxRetryDelayMs:0},errorRetry:{maxNumRetry:2,retryDelayMs:1e3,maxRetryDelayMs:8e3}}},fragLoadPolicy:{default:{maxTimeToFirstByteMs:1e4,maxLoadTimeMs:12e4,timeoutRetry:{maxNumRetry:4,retryDelayMs:0,maxRetryDelayMs:0},errorRetry:{maxNumRetry:6,retryDelayMs:1e3,maxRetryDelayMs:8e3}}},steeringManifestLoadPolicy:{default:{maxTimeToFirstByteMs:1e4,maxLoadTimeMs:2e4,timeoutRetry:{maxNumRetry:2,retryDelayMs:0,maxRetryDelayMs:0},errorRetry:{maxNumRetry:1,retryDelayMs:1e3,maxRetryDelayMs:8e3}}},manifestLoadingTimeOut:1e4,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:1e3,manifestLoadingMaxRetryTimeout:64e3,levelLoadingTimeOut:1e4,levelLoadingMaxRetry:4,levelLoadingRetryDelay:1e3,levelLoadingMaxRetryTimeout:64e3,fragLoadingTimeOut:2e4,fragLoadingMaxRetry:6,fragLoadingRetryDelay:1e3,fragLoadingMaxRetryTimeout:64e3},{cueHandler:{newCue:function(t,e,r,i){for(var n,a,s,o,l,u=[],h=self.VTTCue||self.TextTrackCue,d=0;d<i.rows.length;d++)if(s=!0,o=0,l="",!(n=i.rows[d]).isEmpty()){for(var c,f=0;f<n.chars.length;f++)Xs.test(n.chars[f].uchar)&&s?o++:(l+=n.chars[f].uchar,s=!1);n.cueStartTime=e,e===r&&(r+=1e-4),o>=16?o--:o++;var g=ba(l.trim()),v=_a(e,r,g);null!=t&&null!=(c=t.cues)&&c.getCueById(v)||((a=new h(e,r,g)).id=v,a.line=d+1,a.align="left",a.position=10+Math.min(80,10*Math.floor(8*o/32)),u.push(a))}return t&&u.length&&(u.sort((function(t,e){return"auto"===t.line||"auto"===e.line?0:t.line>8&&e.line>8?e.line-t.line:t.line-e.line})),u.forEach((function(e){return Me(t,e)}))),u}},enableWebVTT:!0,enableIMSC1:!0,enableCEA708Captions:!0,captionsTextTrack1Label:"English",captionsTextTrack1LanguageCode:"en",captionsTextTrack2Label:"Spanish",captionsTextTrack2LanguageCode:"es",captionsTextTrack3Label:"Unknown CC",captionsTextTrack3LanguageCode:"",captionsTextTrack4Label:"Unknown CC",captionsTextTrack4LanguageCode:"",renderTextTracksNatively:!0}),{},{subtitleStreamController:Wn,subtitleTrackController:qn,timelineController:Ya,audioStreamController:Vn,audioTrackController:Yn,emeController:Qa,cmcdController:Ns,contentSteeringController:Us});function Qs(t){return t&&"object"==typeof t?Array.isArray(t)?t.map(Qs):Object.keys(t).reduce((function(e,r){return e[r]=Qs(t[r]),e}),{}):t}function Js(t){var e=t.loader;e!==Ys&&e!==Hs?(w.log("[config]: Custom loader detected, cannot enable progressive streaming"),t.progressive=!1):function(){if(self.fetch&&self.AbortController&&self.ReadableStream&&self.Request)try{return new self.ReadableStream({}),!0}catch(t){}return!1}()&&(t.loader=Ys,t.progressive=!0,t.enableSoftwareAES=!0,w.log("[config]: Progressive streaming enabled, using FetchLoader"))}var $s=function(t){function e(e,r){var i;return(i=t.call(this,e,"[level-controller]")||this)._levels=[],i._firstLevel=-1,i._maxAutoLevel=-1,i._startLevel=void 0,i.currentLevel=null,i.currentLevelIndex=-1,i.manualLevelIndex=-1,i.steering=void 0,i.onParsedComplete=void 0,i.steering=r,i._registerListeners(),i}l(e,t);var r=e.prototype;return r._registerListeners=function(){var t=this.hls;t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_LOADED,this.onManifestLoaded,this),t.on(S.LEVEL_LOADED,this.onLevelLoaded,this),t.on(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.on(S.FRAG_BUFFERED,this.onFragBuffered,this),t.on(S.ERROR,this.onError,this)},r._unregisterListeners=function(){var t=this.hls;t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_LOADED,this.onManifestLoaded,this),t.off(S.LEVEL_LOADED,this.onLevelLoaded,this),t.off(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.off(S.FRAG_BUFFERED,this.onFragBuffered,this),t.off(S.ERROR,this.onError,this)},r.destroy=function(){this._unregisterListeners(),this.steering=null,this.resetLevels(),t.prototype.destroy.call(this)},r.stopLoad=function(){this._levels.forEach((function(t){t.loadError=0,t.fragmentError=0})),t.prototype.stopLoad.call(this)},r.resetLevels=function(){this._startLevel=void 0,this.manualLevelIndex=-1,this.currentLevelIndex=-1,this.currentLevel=null,this._levels=[],this._maxAutoLevel=-1},r.onManifestLoading=function(t,e){this.resetLevels()},r.onManifestLoaded=function(t,e){var r=this.hls.config.preferManagedMediaSource,i=[],n={},a={},s=!1,o=!1,l=!1;e.levels.forEach((function(t){var e,u,h=t.attrs,d=t.audioCodec,c=t.videoCodec;-1!==(null==(e=d)?void 0:e.indexOf("mp4a.40.34"))&&(js||(js=/chrome|firefox/i.test(navigator.userAgent)),js&&(t.audioCodec=d=void 0)),d&&(t.audioCodec=d=ue(d,r)),0===(null==(u=c)?void 0:u.indexOf("avc1"))&&(c=t.videoCodec=function(t){var e=t.split(".");if(e.length>2){var r=e.shift()+".";return(r+=parseInt(e.shift()).toString(16))+("000"+parseInt(e.shift()).toString(16)).slice(-4)}return t}(c));var f=t.width,g=t.height,v=t.unknownCodecs;if(s||(s=!(!f||!g)),o||(o=!!c),l||(l=!!d),!(null!=v&&v.length||d&&!re(d,"audio",r)||c&&!re(c,"video",r))){var m=h.CODECS,p=h["FRAME-RATE"],y=h["HDCP-LEVEL"],E=h["PATHWAY-ID"],T=h.RESOLUTION,S=h["VIDEO-RANGE"],L=(E||".")+"-"+t.bitrate+"-"+T+"-"+p+"-"+m+"-"+S+"-"+y;if(n[L])if(n[L].uri===t.url||t.attrs["PATHWAY-ID"])n[L].addGroupId("audio",h.AUDIO),n[L].addGroupId("text",h.SUBTITLES);else{var A=a[L]+=1;t.attrs["PATHWAY-ID"]=new Array(A+1).join(".");var R=new tr(t);n[L]=R,i.push(R)}else{var k=new tr(t);n[L]=k,a[L]=1,i.push(k)}}})),this.filterAndSortMediaOptions(i,e,s,o,l)},r.filterAndSortMediaOptions=function(t,e,r,i,n){var a=this,s=[],o=[],l=t;if((r||i)&&n&&(l=l.filter((function(t){var e,r=t.videoCodec,i=t.videoRange,n=t.width,a=t.height;return(!!r||!(!n||!a))&&!!(e=i)&&ze.indexOf(e)>-1}))),0!==l.length){if(e.audioTracks){var u=this.hls.config.preferManagedMediaSource;Zs(s=e.audioTracks.filter((function(t){return!t.audioCodec||re(t.audioCodec,"audio",u)})))}e.subtitles&&Zs(o=e.subtitles);var h=l.slice(0);l.sort((function(t,e){if(t.attrs["HDCP-LEVEL"]!==e.attrs["HDCP-LEVEL"])return(t.attrs["HDCP-LEVEL"]||"")>(e.attrs["HDCP-LEVEL"]||"")?1:-1;if(r&&t.height!==e.height)return t.height-e.height;if(t.frameRate!==e.frameRate)return t.frameRate-e.frameRate;if(t.videoRange!==e.videoRange)return ze.indexOf(t.videoRange)-ze.indexOf(e.videoRange);if(t.videoCodec!==e.videoCodec){var i=ae(t.videoCodec),n=ae(e.videoCodec);if(i!==n)return n-i}if(t.uri===e.uri&&t.codecSet!==e.codecSet){var a=se(t.codecSet),s=se(e.codecSet);if(a!==s)return s-a}return t.bitrate!==e.bitrate?t.bitrate-e.bitrate:0}));var d=h[0];if(this.steering&&(l=this.steering.filterParsedLevels(l)).length!==h.length)for(var c=0;c<h.length;c++)if(h[c].pathwayId===l[0].pathwayId){d=h[c];break}this._levels=l;for(var f=0;f<l.length;f++)if(l[f]===d){var g;this._firstLevel=f;var v=d.bitrate,m=this.hls.bandwidthEstimate;if(this.log("manifest loaded, "+l.length+" level(s) found, first bitrate: "+v),void 0===(null==(g=this.hls.userConfig)?void 0:g.abrEwmaDefaultEstimate)){var p=Math.min(v,this.hls.config.abrEwmaDefaultEstimateMax);p>m&&m===zs.abrEwmaDefaultEstimate&&(this.hls.bandwidthEstimate=p)}break}var y=n&&!i,E={levels:l,audioTracks:s,subtitleTracks:o,sessionData:e.sessionData,sessionKeys:e.sessionKeys,firstLevel:this._firstLevel,stats:e.stats,audio:n,video:i,altAudio:!y&&s.some((function(t){return!!t.url}))};this.hls.trigger(S.MANIFEST_PARSED,E),(this.hls.config.autoStartLoad||this.hls.forceStartLoad)&&this.hls.startLoad(this.hls.config.startPosition)}else Promise.resolve().then((function(){if(a.hls){e.levels.length&&a.warn("One or more CODECS in variant not supported: "+JSON.stringify(e.levels[0].attrs));var t=new Error("no level with compatible codecs found in manifest");a.hls.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.MANIFEST_INCOMPATIBLE_CODECS_ERROR,fatal:!0,url:e.url,error:t,reason:t.message})}}))},r.onError=function(t,e){!e.fatal&&e.context&&e.context.type===ke&&e.context.level===this.level&&this.checkRetry(e)},r.onFragBuffered=function(t,e){var r=e.frag;if(void 0!==r&&r.type===Ie){var i=r.elementaryStreams;if(!Object.keys(i).some((function(t){return!!i[t]})))return;var n=this._levels[r.level];null!=n&&n.loadError&&(this.log("Resetting level error count of "+n.loadError+" on frag buffered"),n.loadError=0)}},r.onLevelLoaded=function(t,e){var r,i,n=e.level,a=e.details,s=this._levels[n];if(!s)return this.warn("Invalid level index "+n),void(null!=(i=e.deliveryDirectives)&&i.skip&&(a.deltaUpdateFailed=!0));n===this.currentLevelIndex?(0===s.fragmentError&&(s.loadError=0),this.playlistLoaded(n,e,s.details)):null!=(r=e.deliveryDirectives)&&r.skip&&(a.deltaUpdateFailed=!0)},r.loadPlaylist=function(e){t.prototype.loadPlaylist.call(this);var r=this.currentLevelIndex,i=this.currentLevel;if(i&&this.shouldLoadPlaylist(i)){var n=i.uri;if(e)try{n=e.addDirectives(n)}catch(t){this.warn("Could not construct new URL with HLS Delivery Directives: "+t)}var a=i.attrs["PATHWAY-ID"];this.log("Loading level index "+r+(void 0!==(null==e?void 0:e.msn)?" at sn "+e.msn+" part "+e.part:"")+" with"+(a?" Pathway "+a:"")+" "+n),this.clearTimer(),this.hls.trigger(S.LEVEL_LOADING,{url:n,level:r,pathwayId:i.attrs["PATHWAY-ID"],id:0,deliveryDirectives:e||null})}},r.removeLevel=function(t){var e,r=this,i=this._levels.filter((function(e,i){return i!==t||(r.steering&&r.steering.removeLevel(e),e===r.currentLevel&&(r.currentLevel=null,r.currentLevelIndex=-1,e.details&&e.details.fragments.forEach((function(t){return t.level=-1}))),!1)}));ur(i),this._levels=i,this.currentLevelIndex>-1&&null!=(e=this.currentLevel)&&e.details&&(this.currentLevelIndex=this.currentLevel.details.fragments[0].level),this.hls.trigger(S.LEVELS_UPDATED,{levels:i})},r.onLevelsUpdated=function(t,e){var r=e.levels;this._levels=r},r.checkMaxAutoUpdated=function(){var t=this.hls,e=t.autoLevelCapping,r=t.maxAutoLevel,i=t.maxHdcpLevel;this._maxAutoLevel!==r&&(this._maxAutoLevel=r,this.hls.trigger(S.MAX_AUTO_LEVEL_UPDATED,{autoLevelCapping:e,levels:this.levels,maxAutoLevel:r,minAutoLevel:this.hls.minAutoLevel,maxHdcpLevel:i}))},s(e,[{key:"levels",get:function(){return 0===this._levels.length?null:this._levels}},{key:"level",get:function(){return this.currentLevelIndex},set:function(t){var e=this._levels;if(0!==e.length){if(t<0||t>=e.length){var r=new Error("invalid level idx"),i=t<0;if(this.hls.trigger(S.ERROR,{type:L.OTHER_ERROR,details:A.LEVEL_SWITCH_ERROR,level:t,fatal:i,error:r,reason:r.message}),i)return;t=Math.min(t,e.length-1)}var n=this.currentLevelIndex,a=this.currentLevel,s=a?a.attrs["PATHWAY-ID"]:void 0,o=e[t],l=o.attrs["PATHWAY-ID"];if(this.currentLevelIndex=t,this.currentLevel=o,n!==t||!o.details||!a||s!==l){this.log("Switching to level "+t+" ("+(o.height?o.height+"p ":"")+(o.videoRange?o.videoRange+" ":"")+(o.codecSet?o.codecSet+" ":"")+"@"+o.bitrate+")"+(l?" with Pathway "+l:"")+" from level "+n+(s?" with Pathway "+s:""));var u={level:t,attrs:o.attrs,details:o.details,bitrate:o.bitrate,averageBitrate:o.averageBitrate,maxBitrate:o.maxBitrate,realBitrate:o.realBitrate,width:o.width,height:o.height,codecSet:o.codecSet,audioCodec:o.audioCodec,videoCodec:o.videoCodec,audioGroups:o.audioGroups,subtitleGroups:o.subtitleGroups,loaded:o.loaded,loadError:o.loadError,fragmentError:o.fragmentError,name:o.name,id:o.id,uri:o.uri,url:o.url,urlId:0,audioGroupIds:o.audioGroupIds,textGroupIds:o.textGroupIds};this.hls.trigger(S.LEVEL_SWITCHING,u);var h=o.details;if(!h||h.live){var d=this.switchParams(o.uri,null==a?void 0:a.details);this.loadPlaylist(d)}}}}},{key:"manualLevel",get:function(){return this.manualLevelIndex},set:function(t){this.manualLevelIndex=t,void 0===this._startLevel&&(this._startLevel=t),-1!==t&&(this.level=t)}},{key:"firstLevel",get:function(){return this._firstLevel},set:function(t){this._firstLevel=t}},{key:"startLevel",get:function(){if(void 0===this._startLevel){var t=this.hls.config.startLevel;return void 0!==t?t:this.hls.firstAutoLevel}return this._startLevel},set:function(t){this._startLevel=t}},{key:"nextLoadLevel",get:function(){return-1!==this.manualLevelIndex?this.manualLevelIndex:this.hls.nextAutoLevel},set:function(t){this.level=t,-1===this.manualLevelIndex&&(this.hls.nextAutoLevel=t)}}]),e}(Dr);function Zs(t){var e={};t.forEach((function(t){var r=t.groupId||"";t.id=e[r]=e[r]||0,e[r]++}))}var to=function(){function t(t){this.config=void 0,this.keyUriToKeyInfo={},this.emeController=null,this.config=t}var e=t.prototype;return e.abort=function(t){for(var e in this.keyUriToKeyInfo){var r=this.keyUriToKeyInfo[e].loader;if(r){var i;if(t&&t!==(null==(i=r.context)?void 0:i.frag.type))return;r.abort()}}},e.detach=function(){for(var t in this.keyUriToKeyInfo){var e=this.keyUriToKeyInfo[t];(e.mediaKeySessionContext||e.decryptdata.isCommonEncryption)&&delete this.keyUriToKeyInfo[t]}},e.destroy=function(){for(var t in this.detach(),this.keyUriToKeyInfo){var e=this.keyUriToKeyInfo[t].loader;e&&e.destroy()}this.keyUriToKeyInfo={}},e.createKeyLoadError=function(t,e,r,i,n){return void 0===e&&(e=A.KEY_LOAD_ERROR),new si({type:L.NETWORK_ERROR,details:e,fatal:!1,frag:t,response:n,error:r,networkDetails:i})},e.loadClear=function(t,e){var r=this;if(this.emeController&&this.config.emeEnabled)for(var i=t.sn,n=t.cc,a=function(){var t=e[s];if(n<=t.cc&&("initSegment"===i||"initSegment"===t.sn||i<t.sn))return r.emeController.selectKeySystemFormat(t).then((function(e){t.setKeyFormat(e)})),1},s=0;s<e.length&&!a();s++);},e.load=function(t){var e=this;return!t.decryptdata&&t.encrypted&&this.emeController?this.emeController.selectKeySystemFormat(t).then((function(r){return e.loadInternal(t,r)})):this.loadInternal(t)},e.loadInternal=function(t,e){var r,i;e&&t.setKeyFormat(e);var n=t.decryptdata;if(!n){var a=new Error(e?"Expected frag.decryptdata to be defined after setting format "+e:"Missing decryption data on fragment in onKeyLoading");return Promise.reject(this.createKeyLoadError(t,A.KEY_LOAD_ERROR,a))}var s=n.uri;if(!s)return Promise.reject(this.createKeyLoadError(t,A.KEY_LOAD_ERROR,new Error('Invalid key URI: "'+s+'"')));var o,l=this.keyUriToKeyInfo[s];if(null!=(r=l)&&r.decryptdata.key)return n.key=l.decryptdata.key,Promise.resolve({frag:t,keyInfo:l});if(null!=(i=l)&&i.keyLoadPromise)switch(null==(o=l.mediaKeySessionContext)?void 0:o.keyStatus){case void 0:case"status-pending":case"usable":case"usable-in-future":return l.keyLoadPromise.then((function(e){return n.key=e.keyInfo.decryptdata.key,{frag:t,keyInfo:l}}))}switch(l=this.keyUriToKeyInfo[s]={decryptdata:n,keyLoadPromise:null,loader:null,mediaKeySessionContext:null},n.method){case"ISO-23001-7":case"SAMPLE-AES":case"SAMPLE-AES-CENC":case"SAMPLE-AES-CTR":return"identity"===n.keyFormat?this.loadKeyHTTP(l,t):this.loadKeyEME(l,t);case"AES-128":return this.loadKeyHTTP(l,t);default:return Promise.reject(this.createKeyLoadError(t,A.KEY_LOAD_ERROR,new Error('Key supplied with unsupported METHOD: "'+n.method+'"')))}},e.loadKeyEME=function(t,e){var r={frag:e,keyInfo:t};if(this.emeController&&this.config.emeEnabled){var i=this.emeController.loadKey(r);if(i)return(t.keyLoadPromise=i.then((function(e){return t.mediaKeySessionContext=e,r}))).catch((function(e){throw t.keyLoadPromise=null,e}))}return Promise.resolve(r)},e.loadKeyHTTP=function(t,e){var r=this,n=this.config,a=new(0,n.loader)(n);return e.keyLoader=t.loader=a,t.keyLoadPromise=new Promise((function(s,o){var l={keyInfo:t,frag:e,responseType:"arraybuffer",url:t.decryptdata.uri},u=n.keyLoadPolicy.default,h={loadPolicy:u,timeout:u.maxLoadTimeMs,maxRetry:0,retryDelay:0,maxRetryDelay:0},d={onSuccess:function(t,e,i,n){var a=i.frag,l=i.keyInfo,u=i.url;if(!a.decryptdata||l!==r.keyUriToKeyInfo[u])return o(r.createKeyLoadError(a,A.KEY_LOAD_ERROR,new Error("after key load, decryptdata unset or changed"),n));l.decryptdata.key=a.decryptdata.key=new Uint8Array(t.data),a.keyLoader=null,l.loader=null,s({frag:a,keyInfo:l})},onError:function(t,n,a,s){r.resetLoader(n),o(r.createKeyLoadError(e,A.KEY_LOAD_ERROR,new Error("HTTP Error "+t.code+" loading key "+t.text),a,i({url:l.url,data:void 0},t)))},onTimeout:function(t,i,n){r.resetLoader(i),o(r.createKeyLoadError(e,A.KEY_LOAD_TIMEOUT,new Error("key loading timed out"),n))},onAbort:function(t,i,n){r.resetLoader(i),o(r.createKeyLoadError(e,A.INTERNAL_ABORTED,new Error("key loading aborted"),n))}};a.load(l,h,d)}))},e.resetLoader=function(t){var e=t.frag,r=t.keyInfo,i=t.url,n=r.loader;e.keyLoader===n&&(e.keyLoader=null,r.loader=null),delete this.keyUriToKeyInfo[i],n&&n.destroy()},t}();function eo(){return self.SourceBuffer||self.WebKitSourceBuffer}function ro(){if(!te())return!1;var t=eo();return!t||t.prototype&&"function"==typeof t.prototype.appendBuffer&&"function"==typeof t.prototype.remove}var io=function(){function t(t,e,r,i){this.config=void 0,this.media=null,this.fragmentTracker=void 0,this.hls=void 0,this.nudgeRetry=0,this.stallReported=!1,this.stalled=null,this.moved=!1,this.seeking=!1,this.config=t,this.media=e,this.fragmentTracker=r,this.hls=i}var e=t.prototype;return e.destroy=function(){this.media=null,this.hls=this.fragmentTracker=null},e.poll=function(t,e){var r=this.config,i=this.media,n=this.stalled;if(null!==i){var a=i.currentTime,s=i.seeking,o=this.seeking&&!s,l=!this.seeking&&s;if(this.seeking=s,a===t)if(l||o)this.stalled=null;else if(i.paused&&!s||i.ended||0===i.playbackRate||!zr.getBuffered(i).length)this.nudgeRetry=0;else{var u=zr.bufferInfo(i,a,0),h=u.nextStart||0;if(s){var d=u.len>2,c=!h||e&&e.start<=a||h-a>2&&!this.fragmentTracker.getPartialFragment(a);if(d||c)return;this.moved=!1}if(!this.moved&&null!==this.stalled){var f;if(!(u.len>0||h))return;var g=Math.max(h,u.start||0)-a,v=this.hls.levels?this.hls.levels[this.hls.currentLevel]:null,m=(null==v||null==(f=v.details)?void 0:f.live)?2*v.details.targetduration:2,p=this.fragmentTracker.getPartialFragment(a);if(g>0&&(g<=m||p))return void(i.paused||this._trySkipBufferHole(p))}var y=self.performance.now();if(null!==n){var E=y-n;if(s||!(E>=250)||(this._reportStall(u),this.media)){var T=zr.bufferInfo(i,a,r.maxBufferHole);this._tryFixBufferStall(T,E)}}else this.stalled=y}else if(this.moved=!0,s||(this.nudgeRetry=0),null!==n){if(this.stallReported){var S=self.performance.now()-n;w.warn("playback not stuck anymore @"+a+", after "+Math.round(S)+"ms"),this.stallReported=!1}this.stalled=null}}},e._tryFixBufferStall=function(t,e){var r=this.config,i=this.fragmentTracker,n=this.media;if(null!==n){var a=n.currentTime,s=i.getPartialFragment(a);if(s&&(this._trySkipBufferHole(s)||!this.media))return;(t.len>r.maxBufferHole||t.nextStart&&t.nextStart-a<r.maxBufferHole)&&e>1e3*r.highBufferWatchdogPeriod&&(w.warn("Trying to nudge playhead over buffer-hole"),this.stalled=null,this._tryNudgeBuffer())}},e._reportStall=function(t){var e=this.hls,r=this.media;if(!this.stallReported&&r){this.stallReported=!0;var i=new Error("Playback stalling at @"+r.currentTime+" due to low buffer ("+JSON.stringify(t)+")");w.warn(i.message),e.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_STALLED_ERROR,fatal:!1,error:i,buffer:t.len})}},e._trySkipBufferHole=function(t){var e=this.config,r=this.hls,i=this.media;if(null===i)return 0;var n=i.currentTime,a=zr.bufferInfo(i,n,0),s=n<a.start?a.start:a.nextStart;if(s){var o=a.len<=e.maxBufferHole,l=a.len>0&&a.len<1&&i.readyState<3,u=s-n;if(u>0&&(o||l)){if(u>e.maxBufferHole){var h=this.fragmentTracker,d=!1;if(0===n){var c=h.getAppendedFrag(0,Ie);c&&s<c.end&&(d=!0)}if(!d){var f=t||h.getAppendedFrag(n,Ie);if(f){for(var g=!1,v=f.end;v<s;){var m=h.getPartialFragment(v);if(!m){g=!0;break}v+=m.duration}if(g)return 0}}}var p=Math.max(s+.05,n+.1);if(w.warn("skipping hole, adjusting currentTime from "+n+" to "+p),this.moved=!0,this.stalled=null,i.currentTime=p,t&&!t.gap){var y=new Error("fragment loaded with buffer holes, seeking from "+n+" to "+p);r.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_SEEK_OVER_HOLE,fatal:!1,error:y,reason:y.message,frag:t})}return p}}return 0},e._tryNudgeBuffer=function(){var t=this.config,e=this.hls,r=this.media,i=this.nudgeRetry;if(null!==r){var n=r.currentTime;if(this.nudgeRetry++,i<t.nudgeMaxRetry){var a=n+(i+1)*t.nudgeOffset,s=new Error("Nudging 'currentTime' from "+n+" to "+a);w.warn(s.message),r.currentTime=a,e.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_NUDGE_ON_STALL,error:s,fatal:!1})}else{var o=new Error("Playhead still not moving while enough data buffered @"+n+" after "+t.nudgeMaxRetry+" nudges");w.error(o.message),e.trigger(S.ERROR,{type:L.MEDIA_ERROR,details:A.BUFFER_STALLED_ERROR,error:o,fatal:!0})}}},t}(),no=function(t){function e(e,r,i){var n;return(n=t.call(this,e,r,i,"[stream-controller]",Ie)||this).audioCodecSwap=!1,n.gapController=null,n.level=-1,n._forceStartLoad=!1,n.altAudio=!1,n.audioOnly=!1,n.fragPlaying=null,n.onvplaying=null,n.onvseeked=null,n.fragLastKbps=0,n.couldBacktrack=!1,n.backtrackFragment=null,n.audioCodecSwitch=!1,n.videoBuffer=null,n._registerListeners(),n}l(e,t);var r=e.prototype;return r._registerListeners=function(){var t=this.hls;t.on(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.on(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.on(S.MANIFEST_LOADING,this.onManifestLoading,this),t.on(S.MANIFEST_PARSED,this.onManifestParsed,this),t.on(S.LEVEL_LOADING,this.onLevelLoading,this),t.on(S.LEVEL_LOADED,this.onLevelLoaded,this),t.on(S.FRAG_LOAD_EMERGENCY_ABORTED,this.onFragLoadEmergencyAborted,this),t.on(S.ERROR,this.onError,this),t.on(S.AUDIO_TRACK_SWITCHING,this.onAudioTrackSwitching,this),t.on(S.AUDIO_TRACK_SWITCHED,this.onAudioTrackSwitched,this),t.on(S.BUFFER_CREATED,this.onBufferCreated,this),t.on(S.BUFFER_FLUSHED,this.onBufferFlushed,this),t.on(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.on(S.FRAG_BUFFERED,this.onFragBuffered,this)},r._unregisterListeners=function(){var t=this.hls;t.off(S.MEDIA_ATTACHED,this.onMediaAttached,this),t.off(S.MEDIA_DETACHING,this.onMediaDetaching,this),t.off(S.MANIFEST_LOADING,this.onManifestLoading,this),t.off(S.MANIFEST_PARSED,this.onManifestParsed,this),t.off(S.LEVEL_LOADED,this.onLevelLoaded,this),t.off(S.FRAG_LOAD_EMERGENCY_ABORTED,this.onFragLoadEmergencyAborted,this),t.off(S.ERROR,this.onError,this),t.off(S.AUDIO_TRACK_SWITCHING,this.onAudioTrackSwitching,this),t.off(S.AUDIO_TRACK_SWITCHED,this.onAudioTrackSwitched,this),t.off(S.BUFFER_CREATED,this.onBufferCreated,this),t.off(S.BUFFER_FLUSHED,this.onBufferFlushed,this),t.off(S.LEVELS_UPDATED,this.onLevelsUpdated,this),t.off(S.FRAG_BUFFERED,this.onFragBuffered,this)},r.onHandlerDestroying=function(){this._unregisterListeners(),t.prototype.onHandlerDestroying.call(this)},r.startLoad=function(t){if(this.levels){var e=this.lastCurrentTime,r=this.hls;if(this.stopLoad(),this.setInterval(100),this.level=-1,!this.startFragRequested){var i=r.startLevel;-1===i&&(r.config.testBandwidth&&this.levels.length>1?(i=0,this.bitrateTest=!0):i=r.firstAutoLevel),this.level=r.nextLoadLevel=i,this.loadedmetadata=!1}e>0&&-1===t&&(this.log("Override startPosition with lastCurrentTime @"+e.toFixed(3)),t=e),this.state=fi,this.nextLoadPosition=this.startPosition=this.lastCurrentTime=t,this.tick()}else this._forceStartLoad=!0,this.state=ci},r.stopLoad=function(){this._forceStartLoad=!1,t.prototype.stopLoad.call(this)},r.doTick=function(){switch(this.state){case Ai:var t=this.levels,e=this.level,r=null==t?void 0:t[e],i=null==r?void 0:r.details;if(i&&(!i.live||this.levelLastLoaded===r)){if(this.waitForCdnTuneIn(i))break;this.state=fi;break}if(this.hls.nextLoadLevel!==this.level){this.state=fi;break}break;case mi:var n,a=self.performance.now(),s=this.retryDate;if(!s||a>=s||null!=(n=this.media)&&n.seeking){var o=this.levels,l=this.level,u=null==o?void 0:o[l];this.resetStartWhenNotLoaded(u||null),this.state=fi}}this.state===fi&&this.doTickIdle(),this.onTickEnd()},r.onTickEnd=function(){t.prototype.onTickEnd.call(this),this.checkBuffer(),this.checkFragmentChanged()},r.doTickIdle=function(){var t=this.hls,e=this.levelLastLoaded,r=this.levels,i=this.media,n=t.config,a=t.nextLoadLevel;if(null!==e&&(i||!this.startFragRequested&&n.startFragPrefetch)&&(!this.altAudio||!this.audioOnly)&&null!=r&&r[a]){var s=r[a],o=this.getMainFwdBufferInfo();if(null!==o){var l=this.getLevelDetails();if(l&&this._streamEnded(o,l)){var u={};return this.altAudio&&(u.type="video"),this.hls.trigger(S.BUFFER_EOS,u),void(this.state=Ti)}t.loadLevel!==a&&-1===t.manualLevel&&this.log("Adapting to level "+a+" from level "+this.level),this.level=t.nextLoadLevel=a;var h=s.details;if(!h||this.state===Ai||h.live&&this.levelLastLoaded!==s)return this.level=a,void(this.state=Ai);var d=o.len,c=this.getMaxBufferLength(s.maxBitrate);if(!(d>=c)){this.backtrackFragment&&this.backtrackFragment.start>o.end&&(this.backtrackFragment=null);var f=this.backtrackFragment?this.backtrackFragment.start:o.end,g=this.getNextFragment(f,h);if(this.couldBacktrack&&!this.fragPrevious&&g&&"initSegment"!==g.sn&&this.fragmentTracker.getState(g)!==Yr){var v,m=(null!=(v=this.backtrackFragment)?v:g).sn-h.startSN,p=h.fragments[m-1];p&&g.cc===p.cc&&(g=p,this.fragmentTracker.removeFragment(p))}else this.backtrackFragment&&o.len&&(this.backtrackFragment=null);if(g&&this.isLoopLoading(g,f)){if(!g.gap){var y=this.audioOnly&&!this.altAudio?O:N,E=(y===N?this.videoBuffer:this.mediaBuffer)||this.media;E&&this.afterBufferFlushed(E,y,Ie)}g=this.getNextFragmentLoopLoading(g,h,o,Ie,c)}g&&(!g.initSegment||g.initSegment.data||this.bitrateTest||(g=g.initSegment),this.loadFragment(g,s,f))}}}},r.loadFragment=function(e,r,i){var n=this.fragmentTracker.getState(e);this.fragCurrent=e,n===Kr||n===Vr?"initSegment"===e.sn?this._loadInitSegment(e,r):this.bitrateTest?(this.log("Fragment "+e.sn+" of level "+e.level+" is being downloaded to test bitrate and will not be buffered"),this._loadBitrateTestFrag(e,r)):(this.startFragRequested=!0,t.prototype.loadFragment.call(this,e,r,i)):this.clearTrackerIfNeeded(e)},r.getBufferedFrag=function(t){return this.fragmentTracker.getBufferedFrag(t,Ie)},r.followingBufferedFrag=function(t){return t?this.getBufferedFrag(t.end+.5):null},r.immediateLevelSwitch=function(){this.abortCurrentFrag(),this.flushMainBuffer(0,Number.POSITIVE_INFINITY)},r.nextLevelSwitch=function(){var t=this.levels,e=this.media;if(null!=e&&e.readyState){var r,i=this.getAppendedFrag(e.currentTime);i&&i.start>1&&this.flushMainBuffer(0,i.start-1);var n=this.getLevelDetails();if(null!=n&&n.live){var a=this.getMainFwdBufferInfo();if(!a||a.len<2*n.targetduration)return}if(!e.paused&&t){var s=t[this.hls.nextLoadLevel],o=this.fragLastKbps;r=o&&this.fragCurrent?this.fragCurrent.duration*s.maxBitrate/(1e3*o)+1:0}else r=0;var l=this.getBufferedFrag(e.currentTime+r);if(l){var u=this.followingBufferedFrag(l);if(u){this.abortCurrentFrag();var h=u.maxStartPTS?u.maxStartPTS:u.start,d=u.duration,c=Math.max(l.end,h+Math.min(Math.max(d-this.config.maxFragLookUpTolerance,d*(this.couldBacktrack?.5:.125)),d*(this.couldBacktrack?.75:.25)));this.flushMainBuffer(c,Number.POSITIVE_INFINITY)}}}},r.abortCurrentFrag=function(){var t=this.fragCurrent;switch(this.fragCurrent=null,this.backtrackFragment=null,t&&(t.abortRequests(),this.fragmentTracker.removeFragment(t)),this.state){case gi:case vi:case mi:case yi:case Ei:this.state=fi}this.nextLoadPosition=this.getLoadPosition()},r.flushMainBuffer=function(e,r){t.prototype.flushMainBuffer.call(this,e,r,this.altAudio?"video":null)},r.onMediaAttached=function(e,r){t.prototype.onMediaAttached.call(this,e,r);var i=r.media;this.onvplaying=this.onMediaPlaying.bind(this),this.onvseeked=this.onMediaSeeked.bind(this),i.addEventListener("playing",this.onvplaying),i.addEventListener("seeked",this.onvseeked),this.gapController=new io(this.config,i,this.fragmentTracker,this.hls)},r.onMediaDetaching=function(){var e=this.media;e&&this.onvplaying&&this.onvseeked&&(e.removeEventListener("playing",this.onvplaying),e.removeEventListener("seeked",this.onvseeked),this.onvplaying=this.onvseeked=null,this.videoBuffer=null),this.fragPlaying=null,this.gapController&&(this.gapController.destroy(),this.gapController=null),t.prototype.onMediaDetaching.call(this)},r.onMediaPlaying=function(){this.tick()},r.onMediaSeeked=function(){var t=this.media,e=t?t.currentTime:null;y(e)&&this.log("Media seeked to "+e.toFixed(3));var r=this.getMainFwdBufferInfo();null!==r&&0!==r.len?this.tick():this.warn('Main forward buffer length on "seeked" event '+(r?r.len:"empty")+")")},r.onManifestLoading=function(){this.log("Trigger BUFFER_RESET"),this.hls.trigger(S.BUFFER_RESET,void 0),this.fragmentTracker.removeAllFragments(),this.couldBacktrack=!1,this.startPosition=this.lastCurrentTime=this.fragLastKbps=0,this.levels=this.fragPlaying=this.backtrackFragment=this.levelLastLoaded=null,this.altAudio=this.audioOnly=this.startFragRequested=!1},r.onManifestParsed=function(t,e){var r,i,n=!1,a=!1;e.levels.forEach((function(t){var e=t.audioCodec;e&&(n=n||-1!==e.indexOf("mp4a.40.2"),a=a||-1!==e.indexOf("mp4a.40.5"))})),this.audioCodecSwitch=n&&a&&!("function"==typeof(null==(i=eo())||null==(r=i.prototype)?void 0:r.changeType)),this.audioCodecSwitch&&this.log("Both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"),this.levels=e.levels,this.startFragRequested=!1},r.onLevelLoading=function(t,e){var r=this.levels;if(r&&this.state===fi){var i=r[e.level];(!i.details||i.details.live&&this.levelLastLoaded!==i||this.waitForCdnTuneIn(i.details))&&(this.state=Ai)}},r.onLevelLoaded=function(t,e){var r,i=this.levels,n=e.level,a=e.details,s=a.totalduration;if(i){this.log("Level "+n+" loaded ["+a.startSN+","+a.endSN+"]"+(a.lastPartSn?"[part-"+a.lastPartSn+"-"+a.lastPartIndex+"]":"")+", cc ["+a.startCC+", "+a.endCC+"] duration:"+s);var o=i[n],l=this.fragCurrent;!l||this.state!==vi&&this.state!==mi||l.level!==e.level&&l.loader&&this.abortCurrentFrag();var u=0;if(a.live||null!=(r=o.details)&&r.live){var h;if(this.checkLiveUpdate(a),a.deltaUpdateFailed)return;u=this.alignPlaylists(a,o.details,null==(h=this.levelLastLoaded)?void 0:h.details)}if(o.details=a,this.levelLastLoaded=o,this.hls.trigger(S.LEVEL_UPDATED,{details:a,level:n}),this.state===Ai){if(this.waitForCdnTuneIn(a))return;this.state=fi}this.startFragRequested?a.live&&this.synchronizeToLiveEdge(a):this.setStartPosition(a,u),this.tick()}else this.warn("Levels were reset while loading level "+n)},r._handleFragmentLoadProgress=function(t){var e,r=t.frag,i=t.part,n=t.payload,a=this.levels;if(a){var s=a[r.level],o=s.details;if(!o)return this.warn("Dropping fragment "+r.sn+" of level "+r.level+" after level details were reset"),void this.fragmentTracker.removeFragment(r);var l=s.videoCodec,u=o.PTSKnown||!o.live,h=null==(e=r.initSegment)?void 0:e.data,d=this._getAudioCodec(s),c=this.transmuxer=this.transmuxer||new Bn(this.hls,Ie,this._handleTransmuxComplete.bind(this),this._handleTransmuxerFlush.bind(this)),f=i?i.index:-1,g=-1!==f,v=new Qr(r.level,r.sn,r.stats.chunkCount,n.byteLength,f,g),m=this.initPTS[r.cc];c.push(n,h,d,l,r,i,o.totalduration,u,v,m)}else this.warn("Levels were reset while fragment load was in progress. Fragment "+r.sn+" of level "+r.level+" will not be buffered")},r.onAudioTrackSwitching=function(t,e){var r=this.altAudio;if(!e.url){if(this.mediaBuffer!==this.media){this.log("Switching on main audio, use media.buffered to schedule main fragment loading"),this.mediaBuffer=this.media;var i=this.fragCurrent;i&&(this.log("Switching to main audio track, cancel main fragment load"),i.abortRequests(),this.fragmentTracker.removeFragment(i)),this.resetTransmuxer(),this.resetLoadingState()}else this.audioOnly&&this.resetTransmuxer();var n=this.hls;r&&(n.trigger(S.BUFFER_FLUSHING,{startOffset:0,endOffset:Number.POSITIVE_INFINITY,type:null}),this.fragmentTracker.removeAllFragments()),n.trigger(S.AUDIO_TRACK_SWITCHED,e)}},r.onAudioTrackSwitched=function(t,e){var r=e.id,i=!!this.hls.audioTracks[r].url;if(i){var n=this.videoBuffer;n&&this.mediaBuffer!==n&&(this.log("Switching on alternate audio, use video.buffered to schedule main fragment loading"),this.mediaBuffer=n)}this.altAudio=i,this.tick()},r.onBufferCreated=function(t,e){var r,i,n=e.tracks,a=!1;for(var s in n){var o=n[s];if("main"===o.id){if(i=s,r=o,"video"===s){var l=n[s];l&&(this.videoBuffer=l.buffer)}}else a=!0}a&&r?(this.log("Alternate track found, use "+i+".buffered to schedule main fragment loading"),this.mediaBuffer=r.buffer):this.mediaBuffer=this.media},r.onFragBuffered=function(t,e){var r=e.frag,i=e.part;if(!r||r.type===Ie){if(this.fragContextChanged(r))return this.warn("Fragment "+r.sn+(i?" p: "+i.index:"")+" of level "+r.level+" finished buffering, but was aborted. state: "+this.state),void(this.state===Ei&&(this.state=fi));var n=i?i.stats:r.stats;this.fragLastKbps=Math.round(8*n.total/(n.buffering.end-n.loading.first)),"initSegment"!==r.sn&&(this.fragPrevious=r),this.fragBufferedComplete(r,i)}},r.onError=function(t,e){var r;if(e.fatal)this.state=Si;else switch(e.details){case A.FRAG_GAP:case A.FRAG_PARSING_ERROR:case A.FRAG_DECRYPT_ERROR:case A.FRAG_LOAD_ERROR:case A.FRAG_LOAD_TIMEOUT:case A.KEY_LOAD_ERROR:case A.KEY_LOAD_TIMEOUT:this.onFragmentOrKeyLoadError(Ie,e);break;case A.LEVEL_LOAD_ERROR:case A.LEVEL_LOAD_TIMEOUT:case A.LEVEL_PARSING_ERROR:e.levelRetry||this.state!==Ai||(null==(r=e.context)?void 0:r.type)!==ke||(this.state=fi);break;case A.BUFFER_APPEND_ERROR:case A.BUFFER_FULL_ERROR:if(!e.parent||"main"!==e.parent)return;if(e.details===A.BUFFER_APPEND_ERROR)return void this.resetLoadingState();this.reduceLengthAndFlushBuffer(e)&&this.flushMainBuffer(0,Number.POSITIVE_INFINITY);break;case A.INTERNAL_EXCEPTION:this.recoverWorkerError(e)}},r.checkBuffer=function(){var t=this.media,e=this.gapController;if(t&&e&&t.readyState){if(this.loadedmetadata||!zr.getBuffered(t).length){var r=this.state!==fi?this.fragCurrent:null;e.poll(this.lastCurrentTime,r)}this.lastCurrentTime=t.currentTime}},r.onFragLoadEmergencyAborted=function(){this.state=fi,this.loadedmetadata||(this.startFragRequested=!1,this.nextLoadPosition=this.startPosition),this.tickImmediate()},r.onBufferFlushed=function(t,e){var r=e.type;if(r!==O||this.audioOnly&&!this.altAudio){var i=(r===N?this.videoBuffer:this.mediaBuffer)||this.media;this.afterBufferFlushed(i,r,Ie),this.tick()}},r.onLevelsUpdated=function(t,e){this.level>-1&&this.fragCurrent&&(this.level=this.fragCurrent.level),this.levels=e.levels},r.swapAudioCodec=function(){this.audioCodecSwap=!this.audioCodecSwap},r.seekToStartPos=function(){var t=this.media;if(t){var e=t.currentTime,r=this.startPosition;if(r>=0&&e<r){if(t.seeking)return void this.log("could not seek to "+r+", already seeking at "+e);var i=zr.getBuffered(t),n=(i.length?i.start(0):0)-r;n>0&&(n<this.config.maxBufferHole||n<this.config.maxFragLookUpTolerance)&&(this.log("adjusting start position by "+n+" to match buffer start"),r+=n,this.startPosition=r),this.log("seek to target start position "+r+" from current time "+e),t.currentTime=r}}},r._getAudioCodec=function(t){var e=this.config.defaultAudioCodec||t.audioCodec;return this.audioCodecSwap&&e&&(this.log("Swapping audio codec"),e=-1!==e.indexOf("mp4a.40.5")?"mp4a.40.2":"mp4a.40.5"),e},r._loadBitrateTestFrag=function(t,e){var r=this;t.bitrateTest=!0,this._doFragLoad(t,e).then((function(i){var n=r.hls;if(i&&!r.fragContextChanged(t)){e.fragmentError=0,r.state=fi,r.startFragRequested=!1,r.bitrateTest=!1;var a=t.stats;a.parsing.start=a.parsing.end=a.buffering.start=a.buffering.end=self.performance.now(),n.trigger(S.FRAG_LOADED,i),t.bitrateTest=!1}}))},r._handleTransmuxComplete=function(t){var e,r="main",i=this.hls,n=t.remuxResult,a=t.chunkMeta,s=this.getCurrentContext(a);if(s){var o=s.frag,l=s.part,u=s.level,h=n.video,d=n.text,c=n.id3,f=n.initSegment,g=u.details,v=this.altAudio?void 0:n.audio;if(this.fragContextChanged(o))this.fragmentTracker.removeFragment(o);else{if(this.state=yi,f){if(null!=f&&f.tracks){var m=o.initSegment||o;this._bufferInitSegment(u,f.tracks,m,a),i.trigger(S.FRAG_PARSING_INIT_SEGMENT,{frag:m,id:r,tracks:f.tracks})}var p=f.initPTS,E=f.timescale;y(p)&&(this.initPTS[o.cc]={baseTime:p,timescale:E},i.trigger(S.INIT_PTS_FOUND,{frag:o,id:r,initPTS:p,timescale:E}))}if(h&&g&&"initSegment"!==o.sn){var T=g.fragments[o.sn-1-g.startSN],L=o.sn===g.startSN,A=!T||o.cc>T.cc;if(!1!==n.independent){var R=h.startPTS,k=h.endPTS,b=h.startDTS,D=h.endDTS;if(l)l.elementaryStreams[h.type]={startPTS:R,endPTS:k,startDTS:b,endDTS:D};else if(h.firstKeyFrame&&h.independent&&1===a.id&&!A&&(this.couldBacktrack=!0),h.dropped&&h.independent){var I=this.getMainFwdBufferInfo(),w=(I?I.end:this.getLoadPosition())+this.config.maxBufferHole,C=h.firstKeyFramePTS?h.firstKeyFramePTS:R;if(!L&&w<C-this.config.maxBufferHole&&!A)return void this.backtrack(o);A&&(o.gap=!0),o.setElementaryStreamInfo(h.type,o.start,k,o.start,D,!0)}else L&&R>2&&(o.gap=!0);o.setElementaryStreamInfo(h.type,R,k,b,D),this.backtrackFragment&&(this.backtrackFragment=o),this.bufferFragmentData(h,o,l,a,L||A)}else{if(!L&&!A)return void this.backtrack(o);o.gap=!0}}if(v){var _=v.startPTS,x=v.endPTS,P=v.startDTS,F=v.endDTS;l&&(l.elementaryStreams[O]={startPTS:_,endPTS:x,startDTS:P,endDTS:F}),o.setElementaryStreamInfo(O,_,x,P,F),this.bufferFragmentData(v,o,l,a)}if(g&&null!=c&&null!=(e=c.samples)&&e.length){var M={id:r,frag:o,details:g,samples:c.samples};i.trigger(S.FRAG_PARSING_METADATA,M)}if(g&&d){var N={id:r,frag:o,details:g,samples:d.samples};i.trigger(S.FRAG_PARSING_USERDATA,N)}}}else this.resetWhenMissingContext(a)},r._bufferInitSegment=function(t,e,r,i){var n=this;if(this.state===yi){this.audioOnly=!!e.audio&&!e.video,this.altAudio&&!this.audioOnly&&delete e.audio;var a=e.audio,s=e.video,o=e.audiovideo;if(a){var l=t.audioCodec,u=navigator.userAgent.toLowerCase();this.audioCodecSwitch&&(l&&(l=-1!==l.indexOf("mp4a.40.5")?"mp4a.40.2":"mp4a.40.5"),1!==a.metadata.channelCount&&-1===u.indexOf("firefox")&&(l="mp4a.40.5")),l&&-1!==l.indexOf("mp4a.40.5")&&-1!==u.indexOf("android")&&"audio/mpeg"!==a.container&&(l="mp4a.40.2",this.log("Android: force audio codec to "+l)),t.audioCodec&&t.audioCodec!==l&&this.log('Swapping manifest audio codec "'+t.audioCodec+'" for "'+l+'"'),a.levelCodec=l,a.id="main",this.log("Init audio buffer, container:"+a.container+", codecs[selected/level/parsed]=["+(l||"")+"/"+(t.audioCodec||"")+"/"+a.codec+"]")}s&&(s.levelCodec=t.videoCodec,s.id="main",this.log("Init video buffer, container:"+s.container+", codecs[level/parsed]=["+(t.videoCodec||"")+"/"+s.codec+"]")),o&&this.log("Init audiovideo buffer, container:"+o.container+", codecs[level/parsed]=["+t.codecs+"/"+o.codec+"]"),this.hls.trigger(S.BUFFER_CODECS,e),Object.keys(e).forEach((function(t){var a=e[t].initSegment;null!=a&&a.byteLength&&n.hls.trigger(S.BUFFER_APPENDING,{type:t,data:a,frag:r,part:null,chunkMeta:i,parent:r.type})})),this.tickImmediate()}},r.getMainFwdBufferInfo=function(){return this.getFwdBufferInfo(this.mediaBuffer?this.mediaBuffer:this.media,Ie)},r.backtrack=function(t){this.couldBacktrack=!0,this.backtrackFragment=t,this.resetTransmuxer(),this.flushBufferGap(t),this.fragmentTracker.removeFragment(t),this.fragPrevious=null,this.nextLoadPosition=t.start,this.state=fi},r.checkFragmentChanged=function(){var t=this.media,e=null;if(t&&t.readyState>1&&!1===t.seeking){var r=t.currentTime;if(zr.isBuffered(t,r)?e=this.getAppendedFrag(r):zr.isBuffered(t,r+.1)&&(e=this.getAppendedFrag(r+.1)),e){this.backtrackFragment=null;var i=this.fragPlaying,n=e.level;i&&e.sn===i.sn&&i.level===n||(this.fragPlaying=e,this.hls.trigger(S.FRAG_CHANGED,{frag:e}),i&&i.level===n||this.hls.trigger(S.LEVEL_SWITCHED,{level:n}))}}},s(e,[{key:"nextLevel",get:function(){var t=this.nextBufferedFrag;return t?t.level:-1}},{key:"currentFrag",get:function(){var t=this.media;return t?this.fragPlaying||this.getAppendedFrag(t.currentTime):null}},{key:"currentProgramDateTime",get:function(){var t=this.media;if(t){var e=t.currentTime,r=this.currentFrag;if(r&&y(e)&&y(r.programDateTime)){var i=r.programDateTime+1e3*(e-r.start);return new Date(i)}}return null}},{key:"currentLevel",get:function(){var t=this.currentFrag;return t?t.level:-1}},{key:"nextBufferedFrag",get:function(){var t=this.currentFrag;return t?this.followingBufferedFrag(t):null}},{key:"forceStartLoad",get:function(){return this._forceStartLoad}}]),e}(Ri),ao=function(){function t(e){void 0===e&&(e={}),this.config=void 0,this.userConfig=void 0,this.coreComponents=void 0,this.networkControllers=void 0,this.started=!1,this._emitter=new Mn,this._autoLevelCapping=-1,this._maxHdcpLevel=null,this.abrController=void 0,this.bufferController=void 0,this.capLevelController=void 0,this.latencyController=void 0,this.levelController=void 0,this.streamController=void 0,this.audioTrackController=void 0,this.subtitleTrackController=void 0,this.emeController=void 0,this.cmcdController=void 0,this._media=null,this.url=null,this.triggeringException=void 0,I(e.debug||!1,"Hls instance");var r=this.config=function(t,e){if((e.liveSyncDurationCount||e.liveMaxLatencyDurationCount)&&(e.liveSyncDuration||e.liveMaxLatencyDuration))throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");if(void 0!==e.liveMaxLatencyDurationCount&&(void 0===e.liveSyncDurationCount||e.liveMaxLatencyDurationCount<=e.liveSyncDurationCount))throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be greater than "liveSyncDurationCount"');if(void 0!==e.liveMaxLatencyDuration&&(void 0===e.liveSyncDuration||e.liveMaxLatencyDuration<=e.liveSyncDuration))throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be greater than "liveSyncDuration"');var r=Qs(t),n=["TimeOut","MaxRetry","RetryDelay","MaxRetryTimeout"];return["manifest","level","frag"].forEach((function(t){var i=("level"===t?"playlist":t)+"LoadPolicy",a=void 0===e[i],s=[];n.forEach((function(n){var o=t+"Loading"+n,l=e[o];if(void 0!==l&&a){s.push(o);var u=r[i].default;switch(e[i]={default:u},n){case"TimeOut":u.maxLoadTimeMs=l,u.maxTimeToFirstByteMs=l;break;case"MaxRetry":u.errorRetry.maxNumRetry=l,u.timeoutRetry.maxNumRetry=l;break;case"RetryDelay":u.errorRetry.retryDelayMs=l,u.timeoutRetry.retryDelayMs=l;break;case"MaxRetryTimeout":u.errorRetry.maxRetryDelayMs=l,u.timeoutRetry.maxRetryDelayMs=l}}})),s.length&&w.warn('hls.js config: "'+s.join('", "')+'" setting(s) are deprecated, use "'+i+'": '+JSON.stringify(e[i]))})),i(i({},r),e)}(t.DefaultConfig,e);this.userConfig=e,r.progressive&&Js(r);var n=r.abrController,a=r.bufferController,s=r.capLevelController,o=r.errorController,l=r.fpsController,u=new o(this),h=this.abrController=new n(this),d=this.bufferController=new a(this),c=this.capLevelController=new s(this),f=new l(this),g=new Pe(this),v=new je(this),m=r.contentSteeringController,p=m?new m(this):null,y=this.levelController=new $s(this,p),E=new Wr(this),T=new to(this.config),L=this.streamController=new no(this,E,T);c.setStreamController(L),f.setStreamController(L);var A=[g,y,L];p&&A.splice(1,0,p),this.networkControllers=A;var R=[h,d,c,f,v,E];this.audioTrackController=this.createController(r.audioTrackController,A);var k=r.audioStreamController;k&&A.push(new k(this,E,T)),this.subtitleTrackController=this.createController(r.subtitleTrackController,A);var b=r.subtitleStreamController;b&&A.push(new b(this,E,T)),this.createController(r.timelineController,R),T.emeController=this.emeController=this.createController(r.emeController,R),this.cmcdController=this.createController(r.cmcdController,R),this.latencyController=this.createController(qe,R),this.coreComponents=R,A.push(u);var D=u.onErrorOut;"function"==typeof D&&this.on(S.ERROR,D,u)}t.isMSESupported=function(){return ro()},t.isSupported=function(){return function(){if(!ro())return!1;var t=te();return"function"==typeof(null==t?void 0:t.isTypeSupported)&&(["avc1.42E01E,mp4a.40.2","av01.0.01M.08","vp09.00.50.08"].some((function(e){return t.isTypeSupported(ne(e,"video"))}))||["mp4a.40.2","fLaC"].some((function(e){return t.isTypeSupported(ne(e,"audio"))})))}()},t.getMediaSource=function(){return te()};var e=t.prototype;return e.createController=function(t,e){if(t){var r=new t(this);return e&&e.push(r),r}return null},e.on=function(t,e,r){void 0===r&&(r=this),this._emitter.on(t,e,r)},e.once=function(t,e,r){void 0===r&&(r=this),this._emitter.once(t,e,r)},e.removeAllListeners=function(t){this._emitter.removeAllListeners(t)},e.off=function(t,e,r,i){void 0===r&&(r=this),this._emitter.off(t,e,r,i)},e.listeners=function(t){return this._emitter.listeners(t)},e.emit=function(t,e,r){return this._emitter.emit(t,e,r)},e.trigger=function(t,e){if(this.config.debug)return this.emit(t,t,e);try{return this.emit(t,t,e)}catch(e){if(w.error("An internal error happened while handling event "+t+'. Error message: "'+e.message+'". Here is a stacktrace:',e),!this.triggeringException){this.triggeringException=!0;var r=t===S.ERROR;this.trigger(S.ERROR,{type:L.OTHER_ERROR,details:A.INTERNAL_EXCEPTION,fatal:r,event:t,error:e}),this.triggeringException=!1}}return!1},e.listenerCount=function(t){return this._emitter.listenerCount(t)},e.destroy=function(){w.log("destroy"),this.trigger(S.DESTROYING,void 0),this.detachMedia(),this.removeAllListeners(),this._autoLevelCapping=-1,this.url=null,this.networkControllers.forEach((function(t){return t.destroy()})),this.networkControllers.length=0,this.coreComponents.forEach((function(t){return t.destroy()})),this.coreComponents.length=0;var t=this.config;t.xhrSetup=t.fetchSetup=void 0,this.userConfig=null},e.attachMedia=function(t){w.log("attachMedia"),this._media=t,this.trigger(S.MEDIA_ATTACHING,{media:t})},e.detachMedia=function(){w.log("detachMedia"),this.trigger(S.MEDIA_DETACHING,void 0),this._media=null},e.loadSource=function(t){this.stopLoad();var e=this.media,r=this.url,i=this.url=p.buildAbsoluteURL(self.location.href,t,{alwaysNormalize:!0});this._autoLevelCapping=-1,this._maxHdcpLevel=null,w.log("loadSource:"+i),e&&r&&(r!==i||this.bufferController.hasSourceTypes())&&(this.detachMedia(),this.attachMedia(e)),this.trigger(S.MANIFEST_LOADING,{url:t})},e.startLoad=function(t){void 0===t&&(t=-1),w.log("startLoad("+t+")"),this.started=!0,this.networkControllers.forEach((function(e){e.startLoad(t)}))},e.stopLoad=function(){w.log("stopLoad"),this.started=!1,this.networkControllers.forEach((function(t){t.stopLoad()}))},e.resumeBuffering=function(){this.started&&this.networkControllers.forEach((function(t){"fragmentLoader"in t&&t.startLoad(-1)}))},e.pauseBuffering=function(){this.networkControllers.forEach((function(t){"fragmentLoader"in t&&t.stopLoad()}))},e.swapAudioCodec=function(){w.log("swapAudioCodec"),this.streamController.swapAudioCodec()},e.recoverMediaError=function(){w.log("recoverMediaError");var t=this._media;this.detachMedia(),t&&this.attachMedia(t)},e.removeLevel=function(t){this.levelController.removeLevel(t)},e.setAudioOption=function(t){var e;return null==(e=this.audioTrackController)?void 0:e.setAudioOption(t)},e.setSubtitleOption=function(t){var e;return null==(e=this.subtitleTrackController)||e.setSubtitleOption(t),null},s(t,[{key:"levels",get:function(){var t=this.levelController.levels;return t||[]}},{key:"currentLevel",get:function(){return this.streamController.currentLevel},set:function(t){w.log("set currentLevel:"+t),this.levelController.manualLevel=t,this.streamController.immediateLevelSwitch()}},{key:"nextLevel",get:function(){return this.streamController.nextLevel},set:function(t){w.log("set nextLevel:"+t),this.levelController.manualLevel=t,this.streamController.nextLevelSwitch()}},{key:"loadLevel",get:function(){return this.levelController.level},set:function(t){w.log("set loadLevel:"+t),this.levelController.manualLevel=t}},{key:"nextLoadLevel",get:function(){return this.levelController.nextLoadLevel},set:function(t){this.levelController.nextLoadLevel=t}},{key:"firstLevel",get:function(){return Math.max(this.levelController.firstLevel,this.minAutoLevel)},set:function(t){w.log("set firstLevel:"+t),this.levelController.firstLevel=t}},{key:"startLevel",get:function(){var t=this.levelController.startLevel;return-1===t&&this.abrController.forcedAutoLevel>-1?this.abrController.forcedAutoLevel:t},set:function(t){w.log("set startLevel:"+t),-1!==t&&(t=Math.max(t,this.minAutoLevel)),this.levelController.startLevel=t}},{key:"capLevelToPlayerSize",get:function(){return this.config.capLevelToPlayerSize},set:function(t){var e=!!t;e!==this.config.capLevelToPlayerSize&&(e?this.capLevelController.startCapping():(this.capLevelController.stopCapping(),this.autoLevelCapping=-1,this.streamController.nextLevelSwitch()),this.config.capLevelToPlayerSize=e)}},{key:"autoLevelCapping",get:function(){return this._autoLevelCapping},set:function(t){this._autoLevelCapping!==t&&(w.log("set autoLevelCapping:"+t),this._autoLevelCapping=t,this.levelController.checkMaxAutoUpdated())}},{key:"bandwidthEstimate",get:function(){var t=this.abrController.bwEstimator;return t?t.getEstimate():NaN},set:function(t){this.abrController.resetEstimator(t)}},{key:"ttfbEstimate",get:function(){var t=this.abrController.bwEstimator;return t?t.getEstimateTTFB():NaN}},{key:"maxHdcpLevel",get:function(){return this._maxHdcpLevel},set:function(t){(function(t){return Xe.indexOf(t)>-1})(t)&&this._maxHdcpLevel!==t&&(this._maxHdcpLevel=t,this.levelController.checkMaxAutoUpdated())}},{key:"autoLevelEnabled",get:function(){return-1===this.levelController.manualLevel}},{key:"manualLevel",get:function(){return this.levelController.manualLevel}},{key:"minAutoLevel",get:function(){var t=this.levels,e=this.config.minAutoBitrate;if(!t)return 0;for(var r=t.length,i=0;i<r;i++)if(t[i].maxBitrate>=e)return i;return 0}},{key:"maxAutoLevel",get:function(){var t,e=this.levels,r=this.autoLevelCapping,i=this.maxHdcpLevel;if(t=-1===r&&null!=e&&e.length?e.length-1:r,i)for(var n=t;n--;){var a=e[n].attrs["HDCP-LEVEL"];if(a&&a<=i)return n}return t}},{key:"firstAutoLevel",get:function(){return this.abrController.firstAutoLevel}},{key:"nextAutoLevel",get:function(){return this.abrController.nextAutoLevel},set:function(t){this.abrController.nextAutoLevel=t}},{key:"playingDate",get:function(){return this.streamController.currentProgramDateTime}},{key:"mainForwardBufferInfo",get:function(){return this.streamController.getMainFwdBufferInfo()}},{key:"allAudioTracks",get:function(){var t=this.audioTrackController;return t?t.allAudioTracks:[]}},{key:"audioTracks",get:function(){var t=this.audioTrackController;return t?t.audioTracks:[]}},{key:"audioTrack",get:function(){var t=this.audioTrackController;return t?t.audioTrack:-1},set:function(t){var e=this.audioTrackController;e&&(e.audioTrack=t)}},{key:"allSubtitleTracks",get:function(){var t=this.subtitleTrackController;return t?t.allSubtitleTracks:[]}},{key:"subtitleTracks",get:function(){var t=this.subtitleTrackController;return t?t.subtitleTracks:[]}},{key:"subtitleTrack",get:function(){var t=this.subtitleTrackController;return t?t.subtitleTrack:-1},set:function(t){var e=this.subtitleTrackController;e&&(e.subtitleTrack=t)}},{key:"media",get:function(){return this._media}},{key:"subtitleDisplay",get:function(){var t=this.subtitleTrackController;return!!t&&t.subtitleDisplay},set:function(t){var e=this.subtitleTrackController;e&&(e.subtitleDisplay=t)}},{key:"lowLatencyMode",get:function(){return this.config.lowLatencyMode},set:function(t){this.config.lowLatencyMode=t}},{key:"liveSyncPosition",get:function(){return this.latencyController.liveSyncPosition}},{key:"latency",get:function(){return this.latencyController.latency}},{key:"maxLatency",get:function(){return this.latencyController.maxLatency}},{key:"targetLatency",get:function(){return this.latencyController.targetLatency}},{key:"drift",get:function(){return this.latencyController.drift}},{key:"forceStartLoad",get:function(){return this.streamController.forceStartLoad}}],[{key:"version",get:function(){return"1.5.1"}},{key:"Events",get:function(){return S}},{key:"ErrorTypes",get:function(){return L}},{key:"ErrorDetails",get:function(){return A}},{key:"DefaultConfig",get:function(){return t.defaultConfig?t.defaultConfig:zs},set:function(e){t.defaultConfig=e}}]),t}();return ao.defaultConfig=void 0,ao}, true?module.exports=i():0}(!1);
//# sourceMappingURL=hls.min.js.map


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

EngineBase.version = "2.8.10";

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
            version: "2.8.10",                       // SDK版本号
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
        const vcode = genV(this.timestamp, "2.8.10", this.announce, this.channelId, info.type, this.key);

        // electron
        this.native = !!info.bundle;

        this.announceInfo = {
            ...info,
            channel: this.channelId,
            ts: this.timestamp,
            version: "2.8.10",
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

        if (this.exptMsg) stats.exptMsg = "2.8.10" + ' ' + this.exptMsg;

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
            let signalUrl = `${src}?id=${this.peerId}&p=web&v=${"2.8.10"}`;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************!*\
  !*** ./src/hls-next/index.hls.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.engine */ "./src/hls-next/index.engine.js");
/* harmony import */ var hls_js_dist_hls_min_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hls.js/dist/hls.min.js */ "./node_modules/_hls.js@1.5.1@hls.js/dist/hls.min.js");
/* harmony import */ var hls_js_dist_hls_min_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hls_js_dist_hls_min_js__WEBPACK_IMPORTED_MODULE_1__);

// import Hlsjs from 'hls.js/dist/hls.light'



const liveHlsjsConfig = {
    // maxBufferLength: 8,

    maxBufferLength: 12,

    // test
    // maxBufferSize: 0,
    // maxBufferLength: 30,
    // liveSyncDuration: 30,
    // liveMaxLatencyDuration: Infinity,
};

const VODHlsjsConfig = {
    // maxBufferSize: 20*1000*1000, // pre-buffer for smooth play
    maxBufferLength: 40,
};

class SWHlsjs extends (hls_js_dist_hls_min_js__WEBPACK_IMPORTED_MODULE_1___default()) {

    static get P2PEvents() {
        return _index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].Events
    }

    static get P2pEngine() {
        return _index_engine__WEBPACK_IMPORTED_MODULE_0__["default"]
    }

    constructor(config = {}) {

        let p2pConfig = config.p2pConfig || {};

        const recommendedHlsjsConfig = p2pConfig.live === false ? VODHlsjsConfig : liveHlsjsConfig;
        // const recommendedHlsjsConfig = p2pConfig.live === true ?liveHlsjsConfig : VODHlsjsConfig;
        let mergedHlsjsConfig = JSON.parse(JSON.stringify(recommendedHlsjsConfig)); // 防止引用
        mergedHlsjsConfig.liveSyncDurationCount = 10;
        // mergedHlsjsConfig.manifestLoadingMaxRetry = 3;
        // mergedHlsjsConfig.manifestLoadingRetryDelay = 700;
        // mergedHlsjsConfig.levelLoadingRetryDelay = 700;
        mergedHlsjsConfig.maxBufferSize = 0;
        mergedHlsjsConfig.enableWorker = false;
        // console.warn(mergedHlsjsConfig);

        for (let prop in config) {
            if (prop === 'p2pConfig') continue;
            mergedHlsjsConfig[prop] = config[prop];
        }

        super(mergedHlsjsConfig);

        // this.p2pConfig = p2pConfig;
        this._restartEvent = () => {
            // console.warn('hlsjs restartP2P');
            this.restartP2P();
        };

        if (_index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported()) {
            // console.warn("P2PEngine.isSupported " + p2pConfig.wsSignalerAddr);
            this._p2pEngine = new _index_engine__WEBPACK_IMPORTED_MODULE_0__["default"]({
                ...p2pConfig,
                hlsjsInstance: this,
            });

            this._p2pEngine.on(_index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].Events.RESTART_P2P, this._restartEvent)
        }

        this.on((hls_js_dist_hls_min_js__WEBPACK_IMPORTED_MODULE_1___default().Events.DESTROYING), () => {
            // console.warn('destroying hlsjs');
            if (this._p2pEngine) {
                this._p2pEngine.removeListener(_index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].Events.RESTART_P2P, this._restartEvent)
                // this._p2pEngine.destroy();
                this._p2pEngine.hlsjs = null;
                this._p2pEngine = null;
            }
        });
    }

    get p2pEngine() {
        return this._p2pEngine;
    }

    enableP2P() {
        if (this._p2pEngine) this._p2pEngine = this._p2pEngine.enableP2P();
    }

    disableP2P() {
        if (this._p2pEngine) this._p2pEngine.disableP2P();
    }

    restartP2P() {
        if (this._p2pEngine) {
            this._p2pEngine.disableP2P();
            setTimeout(() => {
                this.enableP2P();
            }, 2000);
            this._p2pEngine.removeListener(_index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].Events.RESTART_P2P, this._restartEvent)
        }
    }
}

SWHlsjs.engineVersion = _index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].version;           //the current version of p2p engine

SWHlsjs.protocolVersion = _index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].protocolVersion;

SWHlsjs.WEBRTC_SUPPORT = _index_engine__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported();   //check if webrtc is supported in this browser

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SWHlsjs);

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=hls.js.map
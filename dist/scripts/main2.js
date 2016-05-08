/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Miku = __webpack_require__(1);

	var _Miku2 = _interopRequireDefault(_Miku);

	var _gesture = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*********************************************************
	Author : 戴戴戴(2540546236@qq.com)
	Latest : 16-05-08
	cnblogs: www.cnblogs.com/daidaidai/
	*********************************************************/

	var MxEvent = _Miku2.default.MxEvent;
	var Vec = _Miku2.default.Vec;
	var extend = _Miku2.default.extend;


	void function (g) {
	  var N = 'GestureAlbum' || 'Miku~~';
	  var d = document;
	  var $ = function $(o) {
	    return typeof o == 'string' && d.querySelector(o) || o;
	  };

	  var getFileImage = function getFileImage(el, fn) {
	    el.addEventListener('change', function () {
	      var frd = new FileReader();
	      frd.addEventListener('load', function () {
	        var pic = d.createElement('img');
	        pic.addEventListener('load', function () {
	          fn(pic);
	        });
	        pic.src = frd.result;
	      });
	      frd.readAsDataURL(el.files[0]);
	    });
	  };

	  var installTouchs = function installTouchs(o) {
	    var ar = [];
	    for (var i = 0, len = o.length; i < len; ++i) {
	      ar[i] = {
	        x: o[i].pageX,
	        y: o[i].pageY
	      };
	    }
	    return ar;
	  };

	  var Stg = {
	    initial: function initial(prop) {

	      this.prop = prop;

	      this.cv = d.createElement('canvas');
	      this.ctx = this.cv.getContext('2d');
	      this.cv.width = place.offsetWidth;
	      this.cv.height = place.offsetHeight;

	      this.itv = this.run = 0;

	      prop.place.innerHTML = '';

	      prop.place.appendChild(this.cv);

	      this.gestruneRun();
	    },
	    gestruneRun: function gestruneRun() {

	      var ges = (0, _gesture.gesture)('scale,rotate,drag', {
	        min_scale: this.prop.min_scale,
	        max_scale: this.prop.max_scale
	      });

	      ges.custom('scale', function (point1, point2, s) {});

	      this.cv.addEventListener('touchstart', function (e) {
	        e.preventDefault();
	      });

	      this.cv.addEventListener('touchmove', function (e) {
	        var touchs = installTouchs(e.targetTouches);

	        if (!touchs.some(function (o) {
	          return Stg.ctx.isPointInPath(o.x, o.y);
	        })) return;

	        var p1 = touchs[0];

	        if (touchs.length == 2) {

	          var p2 = touchs[1];

	          var minx = min(p1.x, p2.x);
	          var miny = min(p1.y, p2.y);

	          var cx = minx + (max(p1.x, p2.x) - minx) * .5;
	          var cy = miny + (max(p1.y, p2.y) - miny) * .5;

	          ges.execute({
	            point1: { x: p1.x, y: p1.y },
	            point2: { x: p2.x, y: p2.y }
	          });
	        }
	        if (touchs.length == 1) ges.drag.execute({ point1: { x: p1.x, y: p1.y } });
	      });
	      this.cv.addEventListener('touchend', function (e) {
	        ges.resolve();
	        ges.drag.resolve();
	      });
	      this.cv.addEventListener('touchcancel', function (e) {
	        ges.resolve();
	        ges.drag.resolve();
	      });

	      ges.on('scale', function (o) {
	        //console.log(o.scale);
	        Mat.fin_sss = o.scale;
	      });
	      ges.on('rotate', function (o) {
	        Mat.sin = sin(o.rotation);
	        Mat.cos = cos(o.rotation);
	      });
	      ges.on('drag', function (o) {
	        Mat.xx += o.dx;
	        Mat.yy += o.dy;
	        // console.log(o);
	      });
	    },
	    ctx: null, cv: null,
	    render: function render(fn) {
	      var me = this;

	      (function callee() {

	        me.itv = requestAnimationFrame(callee);
	        if (!me.ctx) return;

	        me.ctx.clearRect(0, 0, me.cv.width, me.cv.height);

	        fn(+new Date());
	      })();
	    }
	  };

	  var Mat = {
	    tx: 0, ty: 0,
	    xx: 0, yy: 0,
	    sin: sin(0), cos: cos(0),
	    sss: 1,
	    fin_sss: 1,
	    stop: 0,
	    initial: function initial() {
	      this.stop = this.tx = this.ty = this.xx = this.yy = 0;
	      this.sss = this.fin_sss = 1;
	      this.sin = sin(0), this.cos = cos(0);
	    },
	    anm: function anm(t) {
	      if (this.stop) return;
	      this.sss += (this.fin_sss - this.sss) * .2;
	    }
	  };

	  var Draw = function () {
	    var pw = .8;
	    var Draw = {
	      initial: function initial(prop) {
	        this.map = prop.map;

	        var map = this.map;

	        map.sss = map.height / map.width;
	        map.width = prop.place.offsetWidth * pw;
	        map.height = map.width * map.sss;
	        map.tx = map.width * .5;
	        map.ty = map.height * .5;
	      },
	      createPath: function createPath() {
	        var ctx = Stg.ctx;

	        ctx.beginPath();

	        ctx.setTransform(Mat.sss, 0, 0, Mat.sss, Mat.xx + Mat.tx, Mat.yy + Mat.tx);

	        ctx.transform(Mat.cos, Mat.sin, -Mat.sin, Mat.cos, 0, 0);

	        ctx.transform(1, 0, 0, 1, -this.map.tx, -this.map.ty);

	        ctx.rect(0, 0, this.map.width, this.map.height);

	        ctx.closePath();
	      },
	      photo: function photo() {
	        var ctx = Stg.ctx;

	        ctx.save();
	        this.createPath();

	        ctx.drawImage(this.map, 0, 0, this.map.width, this.map.height);

	        ctx.restore();
	      }
	    };
	    return Draw;
	  }();

	  var GestureAlbum = function GestureAlbum(prop) {

	    prop.place = $(prop.place);
	    prop.file = $(prop.file);

	    getFileImage(prop.file, function (map) {

	      prop.map = map;

	      Draw.initial(prop);
	      Stg.initial(prop);
	      //console.log(Draw);
	      Mat.initial();

	      Mat.xx = Draw.map.tx;
	      Mat.yy = Draw.map.ty;
	    });
	    Stg.render(function (t) {
	      Draw.photo();
	      Mat.anm(t);
	    });

	    var GestureAlbum = Object.create({
	      ex: function ex() {}
	    });
	    return GestureAlbum;
	  };
	  g[N] = GestureAlbum;
	}(Function('return this')());

	var gam = GestureAlbum({
	  place: '#place',
	  file: '#file1',
	  max_scale: 2,
	  min_scale: .8,
	  visible_circle: 1
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(!Object.getOwnPropertyNames && 'cos,sin,tan,atan,atan2,acos,asin,ceil,floor,round,sqrt,log,random,max,min,abs,pow,PI,E'.split(',') || Object.getOwnPropertyNames(Math)).forEach(function (s) {
	  s = s.trim();
	  window[s] = Math[s];
	});
	(function (ar) {

	  var f = function f(s, fn) {

	    window[s.replace(/./, function (a) {
	      return a.toLowerCase();
	    })] = function (ar) {
	      var ss = ar[0] + s;

	      return window[ss] || !ar.length && fn || (ar.shift(), arguments.callee(ar));
	    }(ar.concat());
	  };

	  var ts = 1000 / 60;

	  var timeout;

	  f('RequestAnimationFrame', function (fn) {
	    var t, aft_t;

	    return setTimeout(function () {
	      fn && fn(t = +new Date());
	      aft_t = +new Date();
	      timeout = max(0, ts - (aft_t - t));
	    }, ts);
	  });
	  f('CancelAnimationFrame', function (tid) {
	    return clearTimeout(tid);
	  });
	})(['webkit', 'moz']);

	var extend = function () {
	  var _ = function _(o, child) {
	    child = child || {};

	    if (!o || (typeof o === 'undefined' ? 'undefined' : _typeof(o)) == 'object' && o.nodeType) return child = o;

	    Object.keys(o).forEach(function (s) {

	      if (_typeof(o[s]) == 'object') {
	        if (o[s].nodeType) {
	          child[s] = o[s];
	        } else {
	          _(o[s], child[s] = o[s] instanceof Array ? [] : {});
	        };
	      } else {
	        child[s] = o[s];
	      };
	    });

	    return child;
	  };

	  return function (o1, o2) {
	    if (!o2) return console.warn('...');
	    [].slice.call(arguments, 1).forEach(function (o2) {
	      var oo = _(o2);
	      Object.keys(oo).forEach(function (s) {
	        o1[s] = oo[s];
	      });
	    });
	    return o1;
	  };
	}();

	var MxEvent = {
	  evs: {},
	  on: function on(s, fn, once) {
	    s = s.trim();
	    if (once && once.trim() == 'once') {
	      this.evs[s] = [fn];

	      return this;
	    };

	    if (!this.evs[s]) {
	      this.evs[s] = [fn];
	      return this;
	    };
	    this.evs[s].push(fn);
	    return this;
	  },
	  trigger: function trigger(s) {
	    var that = this,
	        args = arguments,
	        ar = this.evs[s = s.trim()];

	    //tirgger('aaa' , a,b,c)
	    ar && ar.forEach(function (fn) {
	      fn.apply(that, [].slice.call(args, 1));
	    });

	    return this;
	  },
	  off: function off(s) {
	    delete this.evs[s.trim()];
	    return this;
	  }
	};
	var Vec = function Vec() {
	  this.init.apply(this, arguments);
	};
	Vec.prototype = Object.create({
	  init: function init(x, y, z) {
	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;
	  },
	  length: function length() {
	    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	  },
	  normal: function normal() {
	    var len = this.length();
	    return len ? new Vec(this.x / len, this.y / len) : new Vec(0, 0);
	  },
	  scale: function scale(_scale) {
	    return new Vec(this.x * _scale, this.y * _scale);
	  },
	  add: function add(vec) {
	    return new Vec(this.x + vec.x, this.y + vec.y);
	  },
	  sub: function sub(vec) {
	    return new Vec(this.x - vec.x, this.y - vec.y);
	  },
	  vertical: function vertical() {
	    return new Vec(this.y, -this.x);
	  },
	  dot: function dot(vec) {
	    return this.x * vec.x + this.y * vec.y;
	  },
	  cross: function cross(vec) {
	    return this.x * vec.y - this.y * vec.x;
	  },
	  clone: function clone() {
	    return new Vec(this.x, this.y, this.z);
	  },
	  rotate: function rotate(radian) {
	    var cosine = Math.cos(radian),
	        sine = Math.sin(radian),
	        x = cosine * this.x - sine * this.y,
	        y = cosine * this.y + sine * this.x;
	    return new _Vec(x, y);
	  },
	  radian: function radian() {
	    return Math.atan2(this.y, this.x);
	  }
	});
	var matrix3 = function matrix3() {
	  var ar = Array.from(arguments);

	  var matrix = {
	    mpy: function mpy(B) {
	      var a = this.ar.concat();

	      var args = Array.from(arguments);

	      for (var i = 0, len = args.length; i < len; ++i) {
	        var b = args[i].ar;

	        var c = [[a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0], a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]], [a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1], a[1][0] * b[0][0] + a[1][1] * b[1][2] + a[1][2] * b[2][2]], [a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0], a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1], a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]]];

	        a = c.concat();
	      };
	      return a;
	    },
	    ar: ar
	  };
	  return matrix;
	};

	exports.default = {
	  MxEvent: MxEvent,
	  extend: extend,
	  Vec: Vec
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.gesture = gesture;

	var _Miku = __webpack_require__(1);

	var _Miku2 = _interopRequireDefault(_Miku);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MxEvent = _Miku2.default.MxEvent;
	var Vec = _Miku2.default.Vec;
	var extend = _Miku2.default.extend;
	function gesture(s, prop) {
	  var methods = s.split(/,/).map(function (s) {
	    return s.trim();
	  });
	  var _ = {
	    scale: {
	      execute: function execute(pos) {
	        var point1 = pos.point1;
	        var point2 = pos.point2;

	        var len = new Vec(point1.x - point2.x, point1.y - point2.y).length();

	        if (!this.blen) this.blen = len;

	        var s = len / this.blen * this.bs;
	        this.sss = s;

	        this.custom && this.custom(point1, point2, s);

	        gesture.trigger('scale', { scale: s });
	      },
	      resolve: function resolve() {
	        this.bs = this.sss;
	        this.blen = 0;

	        this.bs = max(prop.min_scale, min(this.bs, prop.max_scale));

	        gesture.trigger('scale', { scale: this.bs });
	      },
	      bs: 1, sss: 1,
	      blen: 0
	    },
	    drag: {
	      execute: function execute(pos) {
	        var point1 = pos.point1;

	        if (!this.bv) this.bv = new Vec(point1.x, point1.y);
	        var dx = point1.x - this.bv.x;
	        var dy = point1.y - this.bv.y;
	        this.bv.x = point1.x, this.bv.y = point1.y;
	        gesture.trigger('drag', { dx: dx, dy: dy });
	      },
	      bv: 0,
	      resolve: function resolve() {
	        this.bv = 0;
	      }
	    },
	    rotate: {
	      execute: function execute(pos) {
	        var point1 = pos.point1;
	        var point2 = pos.point2;

	        var v = new Vec(point1.x - point2.x, point1.y - point2.y).normal();

	        if (!this.bvec) this.bvec = v;

	        var rd = asin(v.cross(this.bvec) * -1);

	        this.rotation = this.br + rd;

	        this.custom && this.custom(point1, point2, this.rotation);

	        gesture.trigger('rotate', {
	          rotation: this.rotation
	        });
	      },
	      resolve: function resolve() {
	        this.bvec = 0;
	        this.br = this.rotation;
	      },
	      bvec: 0,
	      br: 0,
	      rotation: 0

	    }
	  };
	  var gesture = {
	    execute: function execute(pos) {

	      methods.forEach(function (s) {
	        _[s].execute(pos);
	      });
	    },
	    custom: function custom(s, fn) {
	      _[s.trim()].custom = fn;
	    },
	    resolve: function resolve() {
	      methods.forEach(function (s) {
	        _[s].resolve();
	      });
	    }
	  };

	  extend(gesture, MxEvent, _);

	  return gesture;
	}

/***/ }
/******/ ]);
/*********************************************************
Author: 戴戴戴(2540546236@qq.com)
Latest: 16-03-21
*********************************************************/

!function(n,g){
  var F,Class
    ,doc = document,b = doc.body
    ,toString = {}.toString, Ap = Array.prototype
    ,nnn = 'Miku' , nnnn = '_$'
    ,fscp = '';

  try{
    fscp = doc.currentScript.src;
  }catch(e){}

 

  (function(ar){

    var f = function(s,fn){
      
      g[s.replace(/./,function(a){
        return a.toLowerCase();
      })] = function(ar){
        var ss = ar[0]+s;
        
        return g[ss]  || !ar.length &&  fn ||
         (ar.shift(),arguments.callee(ar));
      }(ar.concat());

    };
    
    var ts = 1000/60;

    var timeout;

    f('RequestAnimationFrame' , function(fn){
      var t,aft_t;
        
      return setTimeout(function(){
        fn && fn(t = +new Date);
        aft_t = +new Date;
        timeout = max(0 , ts - (aft_t-t));
        
      } , ts );

    });
    f('CancelAnimationFrame',function(tid){
      return clearTimeout(tid);
    });

  })(['webkit','moz']);

  Ap.forEach = Ap.forEach || function(fn,s){
    var i = 0;
    for (i = 0, len = this.length; i < len; ++i) {
      if (fn.call(s || g, this[i], i) == false) break;
    };
  };

  String.prototype.trim = ''.trim || function(){
    return this.replace(/^[\s]*|[\s]*$/g , '');
  };

  Object.keys = Object.keys || function(o){
    var ar = [],k;
    for(k in o)
      o.hasOwnProperty(k) && ar.push(k);
    return ar;
  };

  Object.create = Object.create || function(prop){
    var F = function(){};
    F.prototype = prop;
    return new F;
  };

  Array.from = Array.from || function(){
    return function(ar){
   
      var len = ar.length
       
        ,mapFn = arguments[1]
        ,that = arguments[2];

      var k = 0;
      var v ;

      var items = ar;

      var a = new Array(len);

      while(k < len){
        v = items[k];
        a[k] = mapFn ? mapFn.call(that || this ,v ,k) : v;      
        ++k;
      };
      return a.length = len,a;
    };

  }();

 (!Object.getOwnPropertyNames && 
  'cos,sin,tan,atan,atan2,acos,asin,ceil,floor,round,sqrt,log,random,max,min,abs,pow,PI,E'.split(',') ||
  Object.getOwnPropertyNames(Math))
  .forEach(function(s){
    s = s.trim();
    window[s] = Math[s];
  });

  var extend = function(){
    var _ = function(o , child){
      child = child || {};

      if(!o || typeof o=='object' && o.nodeType)
        return child = o; 
      
      Object.keys(o).forEach(function(s){
      
        if(typeof o[s] =='object'){
          if(o[s].nodeType){
            child[s] = o[s];
          }else{
            _(o[s] , 
              child[s] = F.isArray(o[s])?[]:{}
            );
          };
          
        }else{
          child[s] = o[s];
        };
      });

      return child;

    };

    return function(o1,o2){
      if(!o2) return console.warn('需要扩展の对象并不存在啊...');

      [].slice.call(arguments , 1).forEach(function(o2){
        var oo = _(o2);
        Object.keys(oo).forEach(function(s){
          o1[s] = oo[s];
        });
      }); 

      return o1;

    };

  }();

  extend(Ap ,function(){
    var o = {
      remove : function(e){
        var o, i;
        for (i = this.length; i--;) {
          o = this[i];
          if (o == e) {
            this.splice(i, 1);
            return;
          };
        };
      },
      some : function(fn,s){
        var ar = [],i=0;
        for (i = 0, len = this.length; i < len; i++) {
          if(fn.call(s || window, this[i], i))
            return true;
        };
        return false;
      },
      filter : function(fn,s){
        var ar = [],res,i=0;
        for (i = 0, len = this.length; i < len; i++) {
          res = fn.call(s || window, this[i], i);
          res && ar.push(this[i]);
        };
        return ar;
      },
      map : function(fn,s){
        var ar = [],i=0;
        for (i = 0, len = this.length; i < len; i++)
          ar.push(fn.call(s || window, this[i], i));
        return ar;
      },
      reduce : function(cb , initial_v){
        var sum , a;
        if(initial_v != void 0){
          sum = initial_v;
          a = 1;
        }else{
          sum = this[0];
        };
        Array.from({length:this.length},function(v,k){
           if(!this.hasOwnProperty(k)) return;
           a ? (sum = cb(sum , this[k] , k , this)):(a = 1);
        }.bind(this));
        return sum;
      },
      recursiveAr : function(ar){
        var ar = ar || [];
        return this.forEach(function(a){
          a instanceof Array ? a.recursiveAr(ar) : ar.push(a);
        }),ar;
      }

    };
    return Object.keys(o).forEach(function(s){
      o[s] = Ap[s] || o[s];
    }),o;
  
  }());

  extend(Function.prototype , {
    after : function(fn){
      var that = this;
      return function(){
        var fnn = that.apply(that , arguments) ;
         if( fnn != void 0)
            return fn.apply(this , arguments);
         return fnn;
      }
    }
    ,inherit : function(sup){
      this.prototype = Object.create(sup.prototype);
      this.prototype.constructor = this;
      this.prototype._super = sup.prototype;
      return this;
    }
  });
      
  Class = function(){
    var Class = {},create;
      
    Class.extend = function(prop,st_prop){
      
      var F = function(){       
        var that = this,
          args = arguments,
          depinits = [];

        (function callee(o){
           var _super = o._super;


           if(_super){
            depinits.unshift(_super);
            callee(_super);
           };
        })(this);
        
        depinits.forEach(function(_super){
          //_super的静态属性方法      
          Object.keys(_super.constructor).filter(function(s){
            return s!='extend';
          }).forEach(function(s){
            that.constructor[s] = _super.constructor[s];
          });
          
          //init中的实例属性
          _super.init.apply(that,args);   
        });
  
        this.init.apply(this,arguments);
      };
      
      prop = prop || {};
      if(! ('init' in prop))
        prop.init = function(){};
      
      //
      st_prop && Object.keys(st_prop).forEach(function(s){
        F[s] = st_prop[s];  
      });
      
      F.extend = arguments.callee;
        
      //不是Class extend 要从上个F继承了
      if(this != Class){
        F.prototype = Object.create(this.prototype);
        F.prototype.constructor = F;
        F.prototype._super = this.prototype;
        
        Object.keys(prop).forEach(function(s){
          //需要扩展的和继承过后的存在重复！
          if(F.prototype[s] && s!='init' 
          //此处舔过坑！！
          && typeof F.prototype[s]=='function'){
                  
            F.prototype[s] = function(){
              var args = arguments,
                that = this;
              //日了狗。。。
              //FF.aa=~~(Math.random()*50);           
              this._base_ = function(){
                return that._super[s].apply(this,args);
              };
              return prop[s].apply(this,arguments);
            };
  
          }else{
            F.prototype[s] = prop[s];
          };
          
        });
    
        return F;
      };
  
      Object.keys(prop).forEach(function(s){
        F.prototype[s] =prop[s];
      });
      F.prototype.constructor = F;
  
      return F;
      
    };
    return Class;
  }();

  F = function(sel, parent) { 

    return new F.p.init(sel, parent);
  };
  
  F.prototype = F.p  = {
    constructor : F,
    init : function(sel,parent){

      var that = this;
      if (!sel || F.isString(sel) && sel.trim() === '') {
        this.length = 0;
        return 0;
      };
      
      
      
      if(F.isFunction(sel)){

        this.ready(sel);
        
      }else if(F.isString(sel)){
        
        if(/<[a-z]+.*?>/.test(sel)){
          
        }else{
          this.__( (parent||doc).querySelectorAll(sel));
        };
    
      }else if(F.isObject(sel)){
        if (sel.nodeType) {
          this[0] = sel;
          this.length = 1;
        }else{
          this.__(sel);
        };
      };
      



      
      return this;
    },
    ready : function(fn){
      var domFn,depFn, sysFn,apiFn,
        rgInclude,
        command;
      //console.dir(_$.config);
      domFn = function(){
        return new _$.Promise(function(resolve){
          if(/complete|interactive/.test(doc.readyState)) return resolve();
          onload = function(){
            resolve();
          };
        });
        
      };
      depFn = function(){
        var fetch_u = 'http://www.daidaidai-web.com/baseRes/projs/projs.php';

        fetch_u = 'http://localhost/gametest2/projs.php';


        var expFn = function(expstr , expo){
          var match,expo;
          expstr = expstr.trim();   
          if(match = /^([^(),]+)/.exec(expstr)){
            expo = {type : 'xxxx' , name : match[0] };
            expstr = expstr.slice(match[0].length);

          };

          if(!/^\(/.test(expstr))
            return {expstr : expstr ,  expo :expo};
          

          expo = { args : [] , name:match&&match[0]||void undefined};
          expstr = expstr.slice(1);
          while(expstr[0]!=')'){
            var oo = expFn(expstr);
            
            expstr = oo.expstr;
            expo.args.push(oo);
            if(expstr[0]==','){
               expstr = expstr.slice(1)
            }else if(expstr[0] != ")"){
              throw new Error("...)");
            };
          }; 
          return expFn(expstr.slice(1) , expo);       
        };

        var Deps = _$.Event.extend({
          i : 0
          ,dep_ar : []
          ,loadScp : function(fn){
            ++this.i;
            setTimeout(function(){
              fn();

              if(--this.i==0){
               
                this.trigger('complete');
              }
            }.bind(this))
          }
        });

        var resolveDep = function(o , appo){    
          if(o.args){;
            if(o.name){
              _deps.loadScp(function(){
               // console.log(o.name);
                _deps.dep_ar.push(o.name);
                //console.log(++i);
                o.args.forEach(function(oo){
                  resolveDep(oo.expo , o);
                });
              });

            }else{
              o.args.forEach(function(oo){
                resolveDep(oo.expo , o);
              });
            };

          }else{
            //console.log(o);
            if(appo){
              _deps.loadScp(function(){
                var an = appo.name&&appo.name||'';
               // console.log(['来自'+an,o.name].join('---'));
                if(an.length){
                  _deps.dep_ar.push([an,o.name].join('/'));
                }else{
                  _deps.dep_ar.push(o.name);
                };
                
              });
            }else{
              _deps.loadScp(function(){
               // console.warn([o.name].join('---'));
                _deps.dep_ar.push(a.name);
              });

            };
          };
        };

        var _deps = new Deps();
        
        return new _$.Promise(function(resolve){
          var depo,ds;

         
          if(!(ds = _$.getUrlParam('deps',fscp ))) return resolve();

          depo = expFn(ds)
          //console.log(depo);
          resolveDep(depo.expo);

          _deps.on('complete',function(){
            _$.deps = this.dep_ar;
           
            _$.get(fetch_u,{dep_ar:JSON.stringify(this.dep_ar)},function(res){
              //globalEval|1
              //parse|1
              //console.log(res);
              var loader = _$.config.depLoader.shift().trim();
              
              _$.assert(loader in _$.fetchLoader , '......不存在此loader呦');
              
              loader = _$.fetchLoader[loader];

              loader.apply(loader ,[function(){
                resolve();
              },res].concat(_$.config.depLoader) );

            });
          });


        });
      };
      sysFn = function(){
        var ua = navigator.userAgent;
       
        return new _$.Promise(function(resolve){
          
          _$.is_android = /Android/i.test(ua);
          _$.is_ios = /iPhone|iPad|iPod|iOS/i.test(ua);
          _$.is_pc = !(_$.is_android||_$.is_ios);
          _$.is_wx = /MicroMessenger/i.test(ua);
          
          resolve();

        });
      };
       apiFn = function(){
        var ars = [];
       
        //alert(_$.is_wx );
       // alert(_$.config.wxapi);

        if(_$.is_wx && _$.config.wxapi){
          ars.push({
            src:'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'
            ,fnn : function(fn){
             
              _$.jsonp('http://mu.xy.com/wxtest/parseWx.php',{url:location.href},function(wx_str,url){
                try{
                  eval('('+wx_str+')');

                  fn();
                }catch(e){
                  alert(e)
                };
                
              });

            }
          });
        };
        return new _$.Promise(function(resolve){
          new _$.Promise.all(
            ars.map(function(o){
              
              return new _$.Promise(function(resolve2){
               // alert(o.src);
                _$.getScript([o.src]).then(function(){
                  o.fnn(function(s){
                    //alert(377777777);
                    resolve2(s);
                  });
                });
              });
            })
          )
          .then(function(){
            //alert(444);
            //console.log(arguments);
            resolve();
          });
         
        });
        
      };
     
      rgInclude = function(fn){
        (''+fn).replace(/include\(\s*(\[.+?\])\s*\)/g,function(a,b){
          b && F.include(eval('('+b+')'));
        });
      };
      
      command = F.Command();  
      
      command.add({execute:fn});
      
      rgInclude(fn);

      //  _$.Promise.all(domFn() , depFn() , sysFn()).then(function(){  

      //   command.execute();
      // });
      _$.Promise.all(domFn() , depFn() , sysFn(),apiFn()).then(function(){  

        command.execute();
      });
      

      this.constructor.prototype.ready = function(fn){
        command.add({execute:fn});  
        rgInclude(fn);
        
        return F.say('喵！',3);
      };
      
      return F.say('喵',2);
      
      
    },
    __ : function(a){
      F.toArray(a).forEach(function(o,i){
        this[i] = a[i];
      },this);
      this.length = a.length;
      return this;
    },
    __array : function(){
      var ar = [];

      return this.each(function(a){
      
        ar.push(a);

      }),ar;

    },
    each: function(fn, s) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (fn.call(s || g, this[i], i) == false) {
          break;
        };
      };
      return this;
    }

  };

  
  F.p.init.prototype = F.p;
  
  g[n] = g[nnn] = g[nnnn] = F;

  F.package = function(fn){
    _$.extend(F , fn && fn.call(F, F) || {});
  };
  
  F.extend = extend;

  F.extend(_$.p , {

    text : function(v){
      if(!v){
        return this[0].textContent;
      }else{
        return this.each(function(node){
          node.textContent = v;
        });
      };
    },
    html : function(v){
      if(!v){
        return this[0].innerHTML;
      }else{
        return this.each(function(node){
          node.innerHTML = v;
        });
      };
    },
    append : function(o){
      if(typeof o == 'object'&&o.nodeType){
        return this.each(function(node){
          node.appendChild(o);
          
        });
      };
      if(F.isString(o)){
        return this.each(function(node){
          node.innerHTML += o;
        });
      };
        
    },
    index: function() {
      var p = this[0].paretNode,
        o = this[0],
        i = 0;
      this.each(function(node) {
        if (node == o) {
          i = 0;
          return false
        };
      });
      return i;
    },
    parent: function() {
      return this[0].parentNode;
    },
    remove : function(){
      var p = this.parent();
      return this.each(function(a){
        p.removeChild(a);
      });
      
    },
    find : function(s){
      var ar = [];
      this.each(function(a){
        ar = ar.concat(
          _$.toArray(a.querySelectorAll(s))
        );
      });
      return this.constructor(ar);
    },
    eq : function(i){
      return this.constructor(this[i]);
      
    },
    css : function(k,v){
      
      if (!v){
        if(_$.isObject(k)){
          return this.each(function(o) {
            _$.css(o, k);
          });
        }else{
          return _$.css(this[0],k);
        };
      }else{
        return this.each(function(o) {
          
          _$.css(o, k, v);
        });
      };
    },
    show : function(){
      return this.each(function(o) {
        _$.css(o,'display','block');
      });
    },
    hide :  function(){
      return this.each(function(o) {
        _$.css(o,'display','none');
      });
    },
    on : function(type,fn){
      return this.each(function(o) {
        _$.on(o , type , fn);
      });
      
    }
  });



   //常用的工具方法
  F.package(function(F){
    ['Function', 'String', 'Number', 'Date', 'RegExp', 'Error','Array'].forEach(function(s){
      F['is' +s] = function(o){
          return toString.call(o) === '[object '+s+']';
        };
    });
   
    F.AuthorSay = function(){
      return function(){
        console.log(
          [
            _$.dottedLine()
            ,'by   戴戴戴(2540546236@qq.com) '
            ,'date '+ _$.toArray(arguments).join('-')
            ,_$.dottedLine()
          ].reverse().join('\r\n')
        )
      }
    }();
    F.dottedLine = function(n){
       return new Array(n||50).join('-');
    };
    F.toArray = function(a){
      return !a?[]:[].slice.call(a);
    };

    F.rdAr  = function(a){
      return a.sort(function(){return .5-random();});
    };

    F.isObject = function(o){
      var type = typeof o;
      
        return type === 'function' || type === 'object' &&  !!o;
    };

    F.say = function(s,k){
      return new Array(k||6).join(s) ;
    };
    F.err = function(s,k){
      throw new Error(s+' '+new Array(k||6).join('喵~'));
    };
    F.timeStr = function(s){
      return (s || 'Dai') + (+new Date);
    };

    F.assert = function(test , message){
      if(!test) throw new F.assert.prototype.init(message);
    }; 
    F.assert.prototype =F.assert.p = Object.create(Error.prototype);
    F.assert.p.init = function(message){
      this.message = message;
      return this;
    };
    F.assert.p.init.prototype = F.assert.p;

  });

  //一些模式方法
  F.package(function(F){
    F.MxEvent = {
      evs : {}
      ,on : function(s,fn,once){
        s = s.trim();
        if(once && once.trim() == 'once'){
          this.evs[s] = [fn];
          
          return this;
        };
        
        if(!this.evs[s]){
          this.evs[s] = [fn];
          return this;
        };
        this.evs[s].push(fn);
        return this;
      },
      trigger : function(s){
        var that = this,
          args = arguments,
          ar = this.evs[s = s.trim()];
        
        //tirgger('aaa' , a,b,c)
        ar && ar.forEach(function(fn){
          fn.apply(that , [].slice.call(args,1));
        });
        
        return this;
      },
      off : function(s){
        delete this.evs[s.trim()];
        return this;
      }
    };
    F.Event = Class.extend({
      init : function(){
        this.evs = {};
      },
      on : function(s,fn,once){
        s = s.trim();
        if(once && once.trim() == 'once'){
          this.evs[s] = [fn];
          
          return this;
        };
        
        if(!this.evs[s]){
          this.evs[s] = [fn];
          return this;
        };
        this.evs[s].push(fn);
        return this;
      },
      trigger : function(s){
        var that = this,
          args = arguments,
          ar = this.evs[s = s.trim()];
        
        //tirgger('aaa' , a,b,c)
        ar && ar.forEach(function(fn){
          fn.apply(that , [].slice.call(args,1));
        });
        
        return this;
      },
      off : function(s){
        delete this.evs[s.trim()];
        return this;
      }
    });
    F.exEvent = {
      ex_map : Object.create(null)
      ,ex : function(ss,v){
        var s = ss.trim().split(/,/);

        s.forEach(function(s){        
          var o ;
          s = s.trim();

          if(!(o = this.ex_map[s])){
            o = { attr : 0,cb:0 };
            this.ex_map[s] = o;
          };
          
          if(_$.isFunction(v)){
            return o.cb = v;
          };
          o.attr = v;

        },this);
      }
      ,exLoop : function(t){
        Object.keys(this.ex_map).forEach(function(s){
          var o =this.ex_map[s];
          if(o.cb && o.attr) o.cb.call(this);
        } , this);
      }
    };

    F.once = function(){
      var map = Object.create(null);

      var f = function(s , fn){
        if((s in map) || !fn) return;
        map[s] = fn;
        fn();
      };
      f.delete = function(s){delete map[s];}
      return f;
    }();



    F.bk = function(s , fn){
      var ev = new _$.Event();

      F.bk = function(s,fn){
        ev.on(s , fn);
      };
      F.bk.resolve = function(s , args){
        ev.trigger(s,args);
      };

      ev.on(s , fn);
    };
    F.Accept = _$.Event.extend({
      init : function(a){
        this.o = a;
        this.ss;

        setTimeout(function(){
          this.next();
        }.bind(this));

        return this;
      },
      next : function(){  
        if(!this.o.length){
         
          this.trigger('done');
          return;
        };
        this.toLoad();
        return this;
      },
      toLoad : function(){
        this.ss = this.o[0];
        this.o.shift();
        this.trigger('accept' , this.ss);

      }
    });
    F.Command = function(){
      return{
        ar : [],
        ID : 'cmd'+random(),
        clear : function(){
          this.ar = [];
        },
        add : function(){
          this.ar.push.apply(this.ar , arguments);
          return this;
        },
        execute : function(){
          this.ar.forEach(function(a){
            a.execute && a.execute();
          });
        }
      };
    };

    F.SomeFn = _$.Event.extend({
      init : function(){
        this.ar = [];
        this.data_ar = [];
        this.state = 0;
      },
      add : function(fn,s){
        this.ar.push( [fn,s||''] );
      },
      test : function(){
        var i, fn,s,
          res,
          len = this.ar.length;
        this.data_ar.length = 0;
        this.state = 0;
        
        
        for(i = 0;i < len;i++){
          
          fn = this.ar[i][0];
          s = this.ar[i][1];
          
          if(!(res = fn())){
            
            return this.trigger('fail' , s);
          };
          
          this.data_ar.push(res);
          
          
        };
        this.state = 1;
        
        this.trigger('success' , this.data_ar);
      }
    });
    F.Promise = function(){
      var Promise = Class.extend({
        init : function(fn){
          var that = this;
          this.pme;
          this.data;
          
          fn && fn.call(this , function(){
            var args = arguments;
            //神奇 setTimeout君。。。
            setTimeout(function(){
              that.resolve.apply(that  ,args);
            });
          });
        },
        resolve : function(){
          var pme,
            args = arguments,
            that = this;
        
          
          if(!this.pme || (this.pme && !this.pme.fn))
            return;
          //fn执行
          pme = this.pme.fn.apply(this.pme , args);
          
          
          //promise执行
          if(pme instanceof Promise){
            pme.then(function(){
              that.pme.resolve.apply(that.pme , arguments);
            });
          }else{
            this.pme.resolve.apply(this.pme , args);
          };  
        },
        then : function(fn){
          var pme = new Promise();
          pme.fn = fn;
          return this.pme = pme;
        }
      },{
        all : function(){
          var args =  _$.toArray(arguments).recursiveAr(),
            inner_ar = [],
            len = args.length;
          
          return new Promise(function(done){
            var ar = [],i = 0;
            if(!args.length) return done();
            //console.log(args);

            if(!args.some(function(o){return o instanceof _$.Promise;})  )
              return console.warn('有几个并不是promise对象呦~');
                        
            args.forEach(function(a){
              
              a.then(function(){
                ar = ar.concat(_$.toArray(arguments));
                
                if(++i==len) done.apply(window , ar);
              });
            });

            
          });
        }
      });
      return Promise;
    }();
    
    //自从有了promsie女神 我就抛弃when君了~ 

  });

  F.package(function(F){
    var gesture = Object.create(null);

    gesture.tip = function(){

    };
    gesture.touchdown = function(){
      var ars = [];

      var f = function(e , fn){
        ars.push( o = {
          el : e,cb:fn,st : 0
        });
        _$(e).on('touchstart',function(){
          o.st = +new Date;
        }).on('touchend',function(){
          o.st = void undefined;
        });

        _$.once('touchdown' , function(){
          _$.Timer.execute();
          _$.Timer.loop(function(){
            ars.forEach(function(o){
              if(!o.st) return;
              o.cb && o.cb();
            });
          });


        });
      };

      return f;
    }();

    F.on = function(e,s,fn){

      if(_$.is_pc){

        var o = {
          'touchstart':'mousedown',
          'touchmove':'mousemove',
          'touchend':'mouseup'
        };
        F.on = function(e,s,fn){
          s = s.trim();     
          if(s in gesture) return gesture[s](e , fn);

          console.log(s);
          e.addEventListener( (s in o)?o[s]:s  , function(ev){
            fn.call(e , {
              ev : ev,
              mouse_x : ev.pageX,
              mouse_y : ev.pageY
            });       
          });
        };

      }else{
        // console.log('44444444');

        F.on = function(e,s,fn){
          //console.log('bbbbbbbbb');
          if(s in gesture) return gesture[s](e , fn);

          e.addEventListener(s.trim(),function(ev){   
            fn.call(e , {
              ev : ev,
              mouse_x : ev.changedTouches[0].pageX,
              mouse_y : ev.changedTouches[0].pageY
            });
          });
        };
      };
      return F.on(e,s,fn);

    };
    F.css = function(o,k,v){
      if(!v) {
        if (F.isObject(k)) {
          Object.keys(k).forEach(function(s){
            F.css(o, s , k[s]);
          });
        } else {
          return getComputedStyle(o)[k];
        };
      } else {
        o.style[k] = v;
      };
    };

  });

 _$.package(function(F){

  _$.Audio = function(prop){
    var auto = Boolean(prop.auto);
    var au = new Audio();
    var src = prop.src || '';
    au.src =  _$.config.base + src + (!_$.is_ios ? '.mp3' : '.aac');
    au.loop = Boolean(prop.loop); 

    if(auto) au.play();

    return au;
  };

 });
 
  
  //
  _$.package(function(F){
    var deps = [];

    var config = function(prop){    
     
      _$.extend(config , prop || {}); 

      
      if(config.depLoader && _$.isString(config.depLoader))
        config.depLoader = config.depLoader.split(/\|/);



    };

    config({
       base:'' 
      ,time_stamp : 0 
      ,depLoader : 'globalEval|1'
      ,wxapi:1
    });

    return{
      deps:deps 
      // ,include:include
       , config:config
    }
  });

  //获取 img script 类
  F.package(function(F){
    F.getImage = function(ar,fn){
      return new _$.Promise(function(promise){
        var aa = [],i=0;
        new _$.Accept(ar).on('accept',function(o){
          var pic = doc.createElement('img')
            ,that = this;
          pic.onload = function(){
            that.next();
            fn && fn(pic , i++);
            aa.push(this);
            this.onload = null;
          };
          Object.keys(o).forEach(function(s){
            pic.setAttribute(s , s=='src'?_$.config.base+o[s]:o[s]);        
          });

        })
        .on('done',function(){
          promise(aa);
        })
        
      });
    };
    F.getScript = function(ars , fn){

      return new _$.Promise(function(resolve){
        var alls = [];
        new _$.Accept(ars).on('accept',function(s){
          
          var scp = document.createElement('script');
          scp.src = _$.config.base + s;
          scp.onload = function(){
            fn && fn.call(scp,scp);

            document.body.removeChild(scp);
            alls.push(scp);
            this.next();
          }.bind(this);
          document.body.appendChild(scp);

        }).on('done',function(){
          resolve.apply(window , alls)
        });


      });

    };
  });

  
  //ajax iframe http 通信
  _$.package(function(F){

    var qyStr = function(o){
      var a = [];
      o = o || {};
      return a = Object.keys(o).map(function(s){
        return s + '=' + encodeURIComponent(o[s]); 
      }) ,a && a.join('&');
    };
    var gfn = function(ss,fn){
      var fns;
      ss = ss || 'cb';
      fns = F.timeStr();
      g[fns] = function(res){   
        fn && fn(res);
        g[fns] = null;
      };
      return ss  + '=' + fns;
    };
    F.urlParemJson = function(s){
      s = decodeURIComponent( 
        s || location.href
      );
      var rg2 = /([^=?&]+)?=([^=&]+)/g;
      var o = Object.create(null);
      var ar;
      while(ar = rg2.exec(s))
         o[ar[1]] = ar[2];
      return o;
    };

    F.getUrlParam = function(name , hf){
      hf = decodeURIComponent(
        hf || location.href
      );
      var rg = new RegExp(name+"=([^&=]+)");
      var ar = hf.match(rg);
      return ar?ar[1]:void 0;
    };

    F.fetchLoader = {
      parse : function(fn,res){
        try{
          eval(res);
        }catch(e){console.log(e);}
        fn && fn();
      }
      //fn res  s
      ,globalEval : function(fn,res,s) {
        var scp = doc.createElement('script');
        scp.appendChild(doc.createTextNode(res));
        doc.body.appendChild(scp);
      
        s*1&&doc.body.removeChild(scp);

        fn && fn();
      }
    };

    
    F.jsonp = function(url,par,fn){
      var scp ;
      if(!url)
        return;
      scp = doc.createElement('script');
      scp.onload = function(){
        scp.onload = null;
        b.removeChild(this);
      };
      b.appendChild(scp);
      scp.src = url + '?'+gfn('cb' , fn) + '&' + qyStr(par);
    };
    F.get = function(url,par,fn){

      var xhr;
      if(!url){
        fn&&fn();
        return;
      };
      par = par || '';
      
      url = url.split(/,/);
    
      //跨不跨？！！！
      if(url[1] && url[1].trim()=='domin'){
        iframe({url:url[0],method:'get',data:par,success:fn});
        return;
      };
     
      xhr = new XMLHttpRequest;
      
      xhr.onreadystatechange = function(){
        if(xhr.readyState!=4 || xhr.status!=200)
          return;
        fn && fn.call(xhr,xhr.responseText);
      };    
      

      xhr.open('GET' , url[0] +'?'+ qyStr(par));
      xhr.send(null);
      
      return xhr;
    };
    F.post = function(url,par,fn){
      var xhr;
      if(!url){
        fn&&fn();
        return;
      };
      par = par || '';
   
      url = url.split(/,/);
  
      if(url[1] && url[1].trim()=='domin'){
        iframe({url:url[0],method:'post',data:par,success:fn});
        return;
      };



      xhr = new XMLHttpRequest;
      
      xhr.onreadystatechange = function(){
        if(xhr.readyState!=4||xhr.status!=200)
          return;
        fn&&fn.call(xhr,xhr.responseText);
      };
      xhr.open('POST',url[0]);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      xhr.send(qyStr(par));
  
      
      return xhr;
    };
    
    F.iframe = function(){
      var iptNode = function(name,value){
        var d = doc.createElement('input');
        d.name = name;
        d.value = value;
        return d;
      };
      
      return function(prop){
        var type,xhr,
        
          form,ife,
          gs;
        
        prop = prop || {};
        if(!prop.url)
          return;
        gs = gfn('cb' , prop.success);
        
        type = prop.type && prop.type.trim() || 'get';
        
        ife = doc.createElement('iframe');
        if(type == 'get'){

          ife.onload = function(){
            this.onload = null;
            
            b.removeChild(this);
            
          };
          
          ife.style.display = 'none';
          ife.src = prop.url + '?'+gs + '&' + qyStr(prop.data);
          
          b.appendChild(ife);
          
          
          return xhr;
        };
        
        if(type == 'post'){
          
          form = doc.createElement('form');
          
          gs = gs.split(/=/);
            
          prop.data[gs[0]] = gs[1];
          
          Object.keys(prop.data).forEach(function(s){
            form.appendChild(iptNode(s,prop.data[s] ));
          });
          
          
          ife.onload = function(){

          };
          
          ife.name = F.timeStr();
          ife.style.display = form.style.display = 'none';
          form.target = ife.name;
          form.method = 'post';
          form.action = prop.url;
          
          b.appendChild(ife);
          b.appendChild(form);
          
          form.submit();
          
          
          setTimeout(function(){
            b.removeChild(form);
            b.removeChild(ife);
          },2000);
          
          return xhr;
        };
        
        
      };
    }();
  });

  //摇动 二分 排序 非图形的算法
  _$.package(function(F){
    F.binarySearch = function(ar,target){
    
      var left = 0
        ,right = ar.length
        ,k = Object.keys(target)[0];

      if(_$.binarySearch.info) console.time('二分耗时');

      return new _$.Promise(function(resolve){

        var binarySearch = function(left,right){
          if(left > right) return console.warn('没有搜索到呦~');

          var mid = (left+right)*.5>>0
            ,mid_ = ar[mid];
          if(mid_[k] == void 0) return console.warn('不存在的键值呦~');

          if(_$.binarySearch.info) console.log(left,mid,right);

          if(target[k] < mid_[k])
            return binarySearch(left , --mid);
          if(target[k] > mid_[k])
            return binarySearch(++mid , right);

          if(_$.binarySearch.info) console.timeEnd('二分耗时');

          return resolve(ar[mid]);

        };

        binarySearch(left,right);
      });
    };

    F.insertSort = function(){

    };

    F.Shake = function(){
      var ar = [];
      return function(prop,fn){ 
        var o = Object.create({
          x:0,y:0,z:0
          ,bx:0,by:0,bz:0
          ,dx:0,dy:0,dz:0
          ,fn:function(e){

            var al = e.accelerationIncludingGravity;;

            var x = al.x,y = al.y,z = al.z;


            if(!o.bx)o.bx = x;
            if(!o.by)o.by = y;
            if(!o.bz)o.bz = z;

            var dx = x - o.bx
               ,dy = y - o.by
              ,dz = z - o.dz;


            var len = (new _$.Vec(dx,dy,dz)).length();
            
           
            if(len >= prop.vlen || 0){
              
              fn&&fn({
                dx : dx,dy:dy, dz:dz
              });
            };

            o.bx = x,o.by = y,o.bz = z;

          }
        });

        addEventListener('devicemotion',o.fn);

      }
    }();

    _$.file = function(prop,fn){
      var el = typeof prop.el =='string'?_$(prop.el)[0]:prop.el;
      el.addEventListener('change', function(){
        //console.log(el.files[0]);
        var reader = new FileReader();
        reader.onload = function(){
          var pic = document.createElement('img');
          pic.onload = function(){
            fn(this);
          };
          pic.src = this.result;
          
        };
        reader.readAsDataURL(el.files[0]);
      });

    };

    _$.gesture = function(prop) {

      var fn_ar = prop.type && prop.type.split(/,/) || [];
      var _ = {
        scale: {
          execute: function(o1, o2) {
            if (!o1 || !o2) return;

            var len = (new _$.Vec(o1.x - o2.x, o1.y - o2.y)).length();

            if (!this.blen) {
              this.blen = len;
              //console.log(this.blen);
            }

            this.scale = (len / this.blen) * this.bs;

            gesture.trigger('scale', {
              scale: this.scale
            });
          },
          resolve: function() {
            this.blen = 0;
            this.bs = this.scale;
          },
          scale: 1,
          blen: 0,
          bs: 1
        },
        rotate: {
          execute: function(o1, o2) {
            if (!o1 || !o2) return;

            var v = new _$.Vec(o2.x - o1.x, o2.y - o1.y).normal();
            if (!this.bvec) {
              this.bvec = v;
              //console.log(this.bvec);
            };

            var rd = acos(v.dot(this.bvec));
            var cross = v.cross(this.bvec);

            cross > 0 && (rd *= -1);

            this.rotation = this.br + rd;
            gesture.trigger('rotate', {
              rotate: this.rotation
            });

          },
          resolve: function() {
            this.bvec = 0;
            this.br = this.rotation;
          },
          rotation: 0,
          br: 0
        }

      };
      var gesture = {
        execute: function(o1, o2) {
          fn_ar.forEach(function(s) {
            _[s.trim()].execute(o1, o2);
          });
        },
        resolve: function() {
          fn_ar.forEach(function(s) {
            _[s.trim()].resolve();
          });

        }
      };
      _$.extend(gesture, _$.MxEvent);

      return gesture;
    };
  });
  
  //动画相关 tween Timer
  _$.package(function(){
    var Timer = function(){
      var run = false
        ,is_do = false
        ,itv;

      var evt = new _$.Event();

      var Delay = Class.extend({
        init : function(prop){
          _$.extend(this , prop || {});
          //console.log(this.dur);
          this.bdur = this.dur;
          this.update(this.dur || 1000);
          return this;
        }
        ,update : function(t){
          //console.log(t);
          this.dur = t || 1000; 
          this.st = 0;
        }
        ,repeatUpdate : function(){
          this.dur = this.bdur;
          this.st = 0;
        }
        ,execute : function(t){

          return new _$.Promise(function(resolve){
            if(!this.dur) return;
            if(!this.st) this.st = t;
            // 100  100
            if(t - this.st > this.dur){
              
              this.dur = 0;
              resolve(t);
              
            };
          }.bind(this));
        }
      });
      var Clock = _$.Event.extend({
        init : function(prop){
          _$.extend(this , prop||{});
          this.delay_s = new _$.Timer.Delay();

          this.s = this.ms/1000;
        }
        ,execute : function(t){

          return this;
        }
        ,eFn : function(fn){
          this.on('eFn' , fn);
        }
        ,sFn : function(t,fn){

          
          this.delay_s.execute(t).then(function(){
            
            if(--this.s == 0){

              fn(this.s);
              this.trigger('eFn' , this.s);
              return;
            };

            fn(this.s);
            this.delay_s.update(1000);

          }.bind(this));

        }
      });
     

      return Object.defineProperties({
        execute : function(){
          this.run_();
          if(is_do) return;
          is_do = true;
          
          (function callee(t){
            itv = requestAnimationFrame(callee);
            if(!t || !run)
              return;
            evt.trigger('Timer/loop',t);
          })();
          return this;
        }
        ,run_ : function(){
          run = true;
        }
        ,stop_ : function(){
          run = false;
        }
        ,loop : function(fn){
          evt.on('Timer/loop' , fn );
        }
        ,cancel : function(){
          this.stop_();
          is_do = false;
          cancelAnimationFrame(itv);
        }
        ,Delay : Delay
        ,Clock : Clock
      },{
        is_execute : {
          get : function(){
            return is_do;
          }
        }
      });
    
    }();

    var Tween = {
      linear : function(n){ return n; }
      ,easeOut : function(n){ return sin(n*PI*.5);}
      ,easeIn : function(n){
        //1-
        return 1-cos(n*PI*.5);
      }
      ,easeInOut : function(n){
        return n- sin(n*2*PI)/(2*PI);
      }
      ,elastic : function(n ,z){
        return 1 - cos((z||2)*PI*n)*(1-n);
      }
    };
    
    var Anm = _$.Event.extend({
      init : function(par){
        par = par || {};
        _$.extend(this , par);

        this.par = par;

        this.bef = par.bef;
        this.aft = par.aft;
        this.anmss = par.anmss || 'ease';
        this.anmss = this.anmss.trim();



        this.ok = false;


        this.move_ok = false;

        this.ID;
        this.dt = par.dt || 1/10;
        
        
        this.constructor.addAnm(this);
        
    
        return this;
        
      }
      ,set : function(prop){
        _$.extend(this , prop || {});
        this.constructor.run = true;
        this.move_ok = false;
        
      }
    }
    ,{
      cache_o : {len:0}
      ,run : false
      ,remove : function(anm){
        delete this.cache_o[anm.ID];
      }
      ,addAnm : function(anm){
        
        anm.ID = 'anm_'+this.cache_o.len++;
        this.cache_o[anm.ID] = anm;

        if(anm.anmss=='ease');


        if(anm.anmss=='elastic'){
          anm.vv_ar = anm.bef.map(function(){
            return 0;
          });
          anm.friction = anm.par.friction || 0.8;
        };
      }
      ,cancel : function(){
        
        that.run = false;
      }
      ,reqAnm : function(){
        var that = this;
        this.run = true;
        if(!_$.Timer.is_excuted)
          _$.Timer.execute();

        return new _$.Promise(function(resolve){
          setTimeout(function(){
            that.anmRun(function(){
              resolve('结束这轮！！');
            });
          });
          
        });
        
      }
      ,easeFn : function(anm,fn){       
        anm.bef = anm.bef.map(function(a, i){

          if(abs(a-anm.aft[i])<0.01){
            a = anm.aft[i];
      
          }else{
            a += (anm.aft[i]-a)*anm.dt;
            fn();
          };
          return a;
        });
  
      }
      ,elasticFn : function(anm,fn){
        
        anm.bef = anm.bef.map(function(a, i){
         
          if(abs(a-anm.aft[i])<0.01){
            a = anm.aft[i];
            
          }else{
            anm.vv_ar[i] += (anm.aft[i] - a)*anm.dt;
              a += anm.vv_ar[i]*=anm.friction;
              
              fn();

          };
          return a;
        });

      }
      ,anmRun : function(fn){
        var that = this;
        _$.Timer.loop(function(t){
          if(!that.run) return;
      
          var k = true;
              
          Object.keys(that.cache_o).forEach(function(s){
            var anm;
            if(s=='len') return;

            anm = that.cache_o[s];

            if(!anm.bef || !anm.aft || anm.move_ok)
              return;

            if(anm.bef.length != anm.aft.length)
              return console.warn('值の个数不一呦~');

            anm.ok = true;

            that[anm.anmss+'Fn'](anm,function(){
              k = false;

              anm.ok = false;

            });

            if(anm.ok){
  
              anm.move_ok = true;
              
              anm.trigger('anmEnd');
            };
            
            anm.trigger(anm.anmss , anm.bef);

          });
          

          if(k){
      
            that.run = false;
            fn && fn();
          };
        });
      }
    });    
    return{
      Timer : Timer
      ,Anm :Anm
      ,Tween:Tween
    };                   
  });


  F.package(function(F){
    //浏览器端cmd
    var module_map = Object.create(null);

    var ev = new _$.Event();

    var resolve = function(){
      Deps.subtract();
      if(Deps.isComplete) ev.trigger('resolve');  
    };
    var joinUrl = function(s){
      return [this.base,s ,'.js', this.time_stamp?('?'+random()):''].join('');
    };
    var Deps = Object.create({
      __dep : 0
      ,add : function(){++this.__dep;}
      ,subtract : function(){--this.__dep;}
      ,get isComplete(){ return this.__dep==0;}
      ,load : function(c){
        if( (c = c.trim()) in module_map) return resolve();

        _$.getScript([joinUrl.call(config,c)],function(){
          resolve();
        });
      }
    });
    

    var require = function(module_id){
      var md;
      module_id = module_id.trim();

      _$.assert(md = module_map[module_id] , ['不存在此模块('+module_id+')id','or','手动给依赖项匹配吗？','or','concat对?','呦~'].join('\r\n'));

      md = module_map[module_id];
     // console.log(module_id,md);
      var module = Object.create({exports:{}});
      var exports = Object.create(null);

      var v = md.fn(require , exports , module);
      
      if(typeof v !='undefined') return v;

      return Object.keys(module.exports).length&&module.exports ||
         Object.keys(exports).length&&exports||void undefined;
    };
   
    var define = function(module_id,fn){
      //define的时候定义的。。。
      var args = _$.toArray(arguments);
      var deps;

      if(args.length>2)
        fn = args[2],deps = args[1];

      module_map[module_id = module_id.trim()] = {
        scp : document.currentScript
        ,module_id:module_id
        ,fn : fn
        ,fns : fn+''
        ,is_define : 1
      };
      if(config.concat) return;
    
      var is_rg = 0;

      if(deps){
        deps.forEach(function(c){
          Deps.add(),is_rg=1;
          Deps.load(c);
          
        });
        
      }else{
       
        module_map[module_id].fns
        .replace(/\/{2,}([\s\S]*?)\r\n/g,'')
        .replace(/require\s*\(\s*([\'|\"])(.+?)\1\s*\)/g,function(a,b,c){
          
          Deps.add() , is_rg = 1;
          //走到这里说明存在require依赖但是require是填了模块名的
          if(!c) return resolve(); 

          Deps.load(c);

        });
      };

      //说明此模块没有依赖 而且满足resolve
      if(!is_rg &&Deps.isComplete) ev.trigger('resolve');
     
    };

    var config = Object.create({
      concat : 0
      ,base : ''
      ,time_stamp : 0
    });

    var CMDJs = Object.create({
      config : function(prop){

        _$.extend(config , prop);
        define.cmd = true,
        g.define = define,
        g.require = require;
        return this;

      }
      ,get __depsAll(){
        return module_map;
      }
      ,enter : function(s,fn){
        s = s.trim();
        if(config.concat){
          return setTimeout(function(){
            if(Deps.isComplete){
              var rq = require(s);
              fn&&fn(  rq );
            };
          }),this;
        };

        ev.on('resolve' , function(){
          var rq = require(s);
          fn && fn(  rq);
        });
     
        s in module_map ? require(s):_$.getScript([joinUrl.call(config,s)]);

        return this;
      }

    });

    F.CMDJs = CMDJs;

  });

  Object.defineProperties(F , {
    cmdOk : {
      get : function(){
        return typeof define != 'undefined' && !!define.cmd;
      }
    }
    ,amdOk :{
      get : function(){
        return typeof define != 'undefined' && !!define.amd;
      }
    }
  });

  g['Class'] = Class;

  F.cmdOk && define('Dai', [] , function(){return F;});

  typeof module!= 'undefined'&& (module.exports = F);


}('Dai',window);
!function(w,n){
    var Dai = window.Dai || {};

    w[n] = w['_$'] = Dai;

    Dai.Vec = Class.extend({
      init : function(x,y,z){
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
      },
      length : function(){
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);  
      },
      normal : function(){
        var len = this.length();
        return len ? new _$.Vec(this.x/len , this.y/len): new _$.Vec(0,0);
      },
      scale : function(scale){
        return new _$.Vec(this.x*scale , this.y*scale);
      },
      add : function(vec){
        return new _$.Vec(this.x+vec.x , this.y+vec.y);
      },
      sub : function(vec){
        return new _$.Vec(this.x-vec.x , this.y-vec.y);
      },
      vertical : function(){
        return new _$.Vec(this.y , -this.x);
      },
      dot : function(vec){
        //vec是单位向量  那返回的就是投影了
        // 如果都是单位向量 返回的就是 cos的值   acos可以求出弧度了
        return this.x*vec.x + this.y*vec.y;
      },
      cross : function(vec){
        //角动量啊！
        return this.x*vec.y - this.y*vec.x;
      },
      clone : function(){
        return new _$.Vec(this.x,this.y,this.z);
      },
      rotate : function(radian){
        var cosine = Math.cos(radian),
          sine = Math.sin(radian),
          x = cosine * this.x - sine * this.y,
          y = cosine * this.y + sine * this.x;
        return new _$.Vec(x,y);
      },
      radian : function(){
        return Math.atan2(this.y , this.x); 
      }
    });
    Dai.Det3 = function(){
      var det = function(a){
        return a[0][0]*a[1][1]*a[2][2]
          +a[0][1]*a[1][2]*a[2][0]
          +a[0][2]*a[1][0]*a[2][1]

          -a[0][2]*a[1][1]*a[2][0]
          -a[0][1]*a[1][0]*a[2][2]
          -a[0][0]*a[1][2]*a[2][1];
      };
        //x x x   //Y
        //x x x   //Y
        //x x x   //Y
      return function(ar,nar){
        var a,b,c;
        var D = det(ar);

        if(D==0) return console.warn('矩阵不可逆呦~');

        var ar1 = JSON.parse(JSON.stringify(ar));
        var ar2 = JSON.parse(JSON.stringify(ar));
        var ar3 = JSON.parse(JSON.stringify(ar));

        ar1[0][0] = nar[0];
        ar1[1][0] = nar[1];
        ar1[2][0] = nar[2];
   
        ar2[0][1] = nar[0];
        ar2[1][1] = nar[1];
        ar2[2][1] = nar[2];

        ar3[0][2] = nar[0];
        ar3[1][2] = nar[1];
        ar3[2][2] = nar[2];

        var D1 = det(ar1);

        var D2 = det(ar2);

        var D3 = det(ar3);

        return [D1/D,D2/D,D3/D];
      }
    }();


    Dai.Animate = function(){
      return{
        animate : function(prop,fn){
          
          this.animate_o = prop || {};
          this.animate_o.anmss = this.animate_o.anmss || 'easeOut';
          this.animate_o.dt = this.animate_o.dt || 1/10;
          this.animate_o.delay = this.animate_o.delay || 0;
          this.animate_o.start_t = +new Date + this.animate_o.delay;
          this.animate_o.dift = this.animate_o.dift || 0.01;
          
          this.animate_o.fn = fn;
          
          if((this.anmss = this.animate_o.anmss) == 'elastic' &&
            typeof this.vvx !='number'
          ){

              this.vvx = this.vvy=
              this.vvz = 
              this.vvrotation = 
              this.vvscale_x = this.vvscale_y =
              this.vvrotation_z = 
              this.vopacity = this.vbrightness = 0;
          };
        },
        easeOut : function(t){
          var ao,fin,k = true;
          
          
          if(!this.animate_o || t < this.animate_o.start_t)
            return;
          
          
          ao = this.animate_o;
          fin = ao.fin;
          
          
          Object.keys(fin).forEach(function(s){
            this[s] += (fin[s]-this[s])*ao.dt;

            if(abs(this[s]-fin[s]) > ao.dift){
              k = false;
              return;
            };
            
            this[s] = fin[s];
          },this);
          
          if(k){
            this.animate_o = null;
            ao.fn&&ao.fn.call(this , this);
            
          };
        },
        elastic : function(t){
          var ao,fin,k = true;
        
          if(!this.animate_o || t < this.animate_o.start_t)
            return;
          
          ao = this.animate_o;

          
          fin = ao.fin;
          //如果fin是一个空的对象也会错！！！
          Object.keys(fin).forEach(function(s){

            this['vv'+s] += (fin[s]-this[s])*ao.dt;
            // if(s=='y'){
            //  console.log(fin);
              
            // };

            this[s] += (this['vv'+s]*=ao.friction);   
            
            

            if(abs(this[s]-fin[s]) > ao.dift){
              k = false;
              return;
            };
            
            this[s] = fin[s];
          },this);
          
          if(k){
            this.animate_o = null;
            ao.fn&&ao.fn.call(this , this);

            
          };
        },
        runAnimate : function(){
          return this.animate_o;
        }
      };
    }();

    
    Dai.LineCirHit = function(){
      
      return function(line,cir){
        var min_x = min(line.x, line.x2()),
          max_x = max(line.x , line.x2()),
          min_y = min(line.y, line.y2()),
          max_y = max(line.y ,line.y2()),
          
          dx = cir.x - line.x,
          dy = cir.y - line.y,
          radian = line.radian,
          vy = cir.vy,
          
          dx1 = cos(-radian)*dx - sin(-radian)*dy,
          dy1 = cos(-radian)*dy + sin(-radian)*dx,
          vx = cos(-radian)*cir.vx - sin(-radian)*cir.vy,
          vy = cos(-radian)*cir.vy + sin(-radian)*cir.vx;
    
        if(cir.x > min_x && 
          cir.x < max_x &&
          cir.y > min_y &&
          cir.y < max_y 
          
        ){
          
          if(abs(dy1)<cir.radius){
            dy1 = dy1>0?cir.radius:cir.radius*-1; 
            vy*=-1;

            return {
              update : function(){
                var o = {
                  x : line.x+cos(radian)*dx1-sin(radian)*dy1,
                  y : line.y+cos(radian)*dy1+sin(radian)*dx1,
                  vx :cos(radian)*vx-sin(radian)*vy,
                  vy :cos(radian)*vy+sin(radian)*vx
                };
                cir.x = o.x,cir.y = o.y;
                cir.vx = o.vx, cir.vy = o.vy;
                
              }
            };
            
            
            
          };
    
        };
      };
    }();
    
    
    Dai.CirHit = function(){
      var Fv = function(o,radian){
        var vx = o.vx*cos(-radian) - o.vy*sin(-radian),
          vy = o.vy*cos(-radian) + o.vx*sin(-radian);
        vx*=-1;
        return{
          vx : vx*cos(radian)-vy*sin(radian),
          vy : vy*cos(radian)+vx*sin(radian)
        };
      };
      return function(o1,o2){
        var v = new Dai.Vec(o2.x-o1.x,o2.y-o1.y),
          len = v.length(),radian = v.radian(),   
          dist = o1.radius+o2.radius;
        if(len < dist){
          return {
            update : function(){
              o2.x = o1.x + cos(radian)*dist;
              o2.y = o1.y + sin(radian)*dist;   
              [].slice.call(arguments).forEach(function(o){
                var fv = Fv(o,radian);
                o.vx = fv.vx,o.vy = fv.vy;
              });
    
            }
          };
        };
      };
    }();

 
    Dai.ImageUtil = Dai.Event.extend({
      init : function(prop){
        var a = [],i =0,len=0,
          that = this;
        prop = prop ||{};
        a = Object.keys(prop);
        len = a.length;
        this.j = that.len = 0;
        
        Object.keys(prop).forEach(function(s){
          var ar = prop[s];
          ar.forEach(function(){
            that.len++;
          });
        });
      //console.log(that.len);
        this.source_o = {};
        
        this.cidx = 0;
        
        a.forEach(function(s){
          this.source_o[s] = [];
          
          this.toLoad(s , prop[s],function(){ 
            if(++i==len){
              
              that.trigger('ImageUtil'+that.cidx , that.source_o);
            };
          });
          
        },this);
        
        
      },
      toLoad : function(s,ar,fn){
        
        var pic,that=this;
        if(!ar.length){
          fn && fn(s);
          return;
        };
        
        if(ar[0] in that.constructor.cache_o){
          //console.log('缓过');
          that.trigger('ImageUtil/progress'+that.cidx,++that.j/that.len);
          
          that.source_o[s].push(that.constructor.cache_o[ar[0]]);
          ar.shift();
          that.toLoad(s,ar,fn);
          return;
        };
        //console.log('没缓存过');
        pic = document.createElement('img');
        pic.onload = function(){
          pic.onload = null;
          //++that.j/
          that.trigger('ImageUtil/progress'+that.cidx,++that.j/that.len);
          
          
          that.source_o[s].push(this);
          that.constructor.cache_o[ar[0]] = this;
          
          ar.shift();
          
          
          that.toLoad(s,ar,fn);
        };
        pic.onerror = function(){
          Dai.err('这个资源有问题啊~');
        };

        pic.src =  _$.config.base+ar[0];
        //pic.src =  ar[0];
      },
      done : function(fn){
        if(!this.cidx){
          this.cidx = ++this.constructor.idx;
        };
        //this.on('ImageUtil'+this.cidx,fn.call(this,this.source_o));
        
        this.on('ImageUtil'+this.cidx,fn);
        return this;
      },
      progress : function(fn){
        if(!this.cidx){
          this.cidx = ++this.constructor.idx;
        };
        this.on('ImageUtil/progress'+this.cidx,fn);
        
        return this;
      }
    },{
      cache_o:{},
      idx:0
    });

    Dai.isKey = function(s){
      var o = Object.create({
        left : 37, right:39 ,top : 38 , bottom:40
        ,a : 65 ,w :87 , d :68 ,s :83
        ,space : 32 , enter : 13 ,tab : 9
      });
      return function(s , e){
        s = s.trim();
        var ar = s.split(/,/);
        var code = e.keyCode;

        return ar.some(function(s){
          return o[s.trim()] == code; 
        });

      };

    }();
    Dai.color = function(){
      var rgb = function(){
        return [
          random()*256>>0
          ,random()*256>>0
          ,random()*256>>0
        ];
      };
      var _ = {
        'rgb' : function(prop){
          var ar = rgb();
          if(prop.to_number) return ar;
          return 'rgb('+ar.join(',')+')';
        }
        ,'rgba' : function(prop){
          var a = typeof prop.alpha!='undefined'?prop.alpha:1;
          var ar = rgb().concat(a);
          if(prop.to_number) return ar;
          return 'rgba('+ar.join(',')+')';
        }
      }
      return function(k , prop){
        return _[k.trim()](prop);
      };
    }();

    //呵呵呵！！！
    Dai.love = function(md_s){
      var K_S = '逗逼啊你！！';
      md_s = md_s.trim(); 
      
      if(['Css3','Canvas2d','webgl'].indexOf(md_s)==-1)
        Dai.err(K_S); 

      return _$.extend(_$.extend({},Dai) , Dai[md_s]);
      
    };

    
    //by 戴戴戴
    //2015-09-20
  }(this,'Dai');

  _$.Canvas2d = function(){
  var Stage,
    Plane,Circle,
    Line,Bez2,
    Polygon,Spriter;
  
  Stage = _$.Event.extend({
    init : function(prop){
      prop = prop || {};

      this.cv = document.createElement('canvas');
      this.cv.style.position = 'relative';
      this.cv.width = prop.width ||300;
      this.cv.height = prop.height||150;
      if(prop['iphone4s']){
        this.cv.width = 640,this.cv.height = 960;
      };
      
      this.bw = this.cv.width;
      
      this.scale = 1;
      
      
      this.cv.id = 'dwq_2dcanvas_'+this.constructor.idx++ ;
      this.ctx = this.cv.getContext('2d');
      this.el  = this.cv;
      

      this.ar = [];
      this.tv = null;
      this.run = true;
      
      var b = document.body;
      
      this.full_width = b.offsetWidth,
      this.full_height = b.offsetHeight;
      

      Object.defineProperties(this, {
        pixel : {
          get : function(){

            var imageData = this.ctx.getImageData(0,0,this.width(),this.height());

            var ar = [];
            for(var i=0;i<imageData.data.length;i+=4){
                // imageData.data[i]=255-imageData.data[i];
                // imageData.data[i+1]=255-imageData.data[i+1];
                // imageData.data[i+2]=255-imageData.data[i+2];
                // imageData.data[i+3]=255;

                // console.log([
                //   'r'+imageData.data[i],'g'+imageData.data[i+1],'b'+imageData.data[i+2]
                //   ,'a'+imageData.data[i+3]
                // ].join('--'));

                ar.push(Array.from({length:4},function(v,j){
                  return imageData.data[i+j];
                }));
            };
           return ar;
          }
        }
        ,base_png : {
          get : function(){
            return this.cv.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
          }
        }
        ,width :{
          get : function(){
            return this.cv.width*this.scale;
          }
        }
        ,height : {
          get : function(){
            return this.cv.height*this.scale;
          }
        }
      });

      this.selectFn();
      
    },
    toScreen : function(pos){
      return pos/this.scale;
    }
    ,absolute:function(){
      this.cv.style.position = 'absolute';
      return this;
    }

    ,selectFn : function(){
      var that = this,
        sel_o;
      _$.on(this.cv , 'touchstart',function(e){
        var bdg = this.getBoundingClientRect(),
          x = that.toScreen(e.mouse_x - bdg.left),
          y = that.toScreen(e.mouse_y - bdg.top),
          i,a;
        
        that.trigger('touchstart',{
          mouse_x : x,mouse_y:y
          ,ev : e.ev
        });

        //要做鼠标处理的话 需要降序排序数组
        //可是绘制的时候 是升序的！
        //这里需要拷贝一份数组  防止闪屏！ 
        var ar = that.ar.concat().sort(function(a,b){
          return b.z-a.z;
        });
      //  console.log(e);
        for(i = 0;a = ar[i++];){
          //因为整个canvas在缩放，要做鼠标坐标处理的话，你要用缩放系数。。。
          //console.log(a.z);
          if(a.inPath && a.inPath(x,y)){
            //console.log(a);
            //console.log(a.z);
            
            sel_o = a;
            sel_o.trigger('touchstart',{
              mouse_x : x,mouse_y:y,
              x : sel_o.x , y : sel_o.y
               ,ev : e.ev
            });

            if(sel_o.drags){

              sel_o.drag_bx = x;
              sel_o.drag_by = y;
              //console.log(sel_o);
            };
           

            break;
          };  
        };
      });
      _$.on(this.cv , 'touchmove',function(e){
        var bdg = this.getBoundingClientRect(),
          x = that.toScreen(e.mouse_x - bdg.left),
          y = that.toScreen(e.mouse_y - bdg.top),
          i,a;
      
        that.trigger('touchmove',{
          mouse_x : x,mouse_y:y
           ,ev : e.ev
        });

        
        if(sel_o&&sel_o.drags){
          sel_o.x += (x-sel_o.drag_bx);
          sel_o.y += (y-sel_o.drag_by);

          sel_o.trigger('drag' , {
            x : sel_o.x , y : sel_o.y
            ,ev : e.ev
          });


          sel_o.drag_bx = x;
          sel_o.drag_by = y;
          //console.log(sel_o);
        };


        
        // for(i = 0;a = that.ar[i++];){
        //   //因为整个canvas在缩放，要做鼠标坐标处理的话，你要用缩放系数。。。

        //   if(!a.drags&&a.inPath&&a.inPath(x,y)){
            
        //     sel_o = a;
        //     sel_o.trigger('touchmove',{
        //       mouse_x : x,mouse_y:y,
        //       x : sel_o.x , y : sel_o.y
        //       ,ev : e.ev
        //     });
        //     break;
        //   };  
        // };
      });

      _$.on(this.cv , 'touchend',function(e){

        that.trigger('touchend');

        if(!sel_o) return;
        sel_o.trigger('touchend');
        sel_o.bx = sel_o.by = 0;
        sel_o = null;
      });

      
    },
    initial : function(s){
      s = s.trim().split(/,/);
      s && s.forEach(function(ss){
        ss = 'to'+ss.trim();
        this[ss] && this[ss]();
      },this);
    },
    tofix : function(){
      var parent = this.el.parentNode;
      this.el.style.top = (parent.offsetHeight-this.height())*0.5+'px';
      this.on('tofix/'+this.cv.id,function(){
        this.el.style.top = (parent.offsetHeight-this.height())*0.5+'px';
      });
    },
    toresize : function(fn){
      var that = this,
        b = document.body,s,
        f = function(){
          s = b.offsetWidth/that.bw;
          //s > 1 && (s=1);
          that.scale = s;
          that.cv.style.webkitTransformOrigin = 'left top';
          that.cv.style.webkitTransform = 'scale('+s+')';
          
          
          that.trigger('tofix/'+that.cv.id);
          
          fn &&fn.call(that);
          
        };
      f();
      addEventListener('resize',function(){
        f();
      });
    },
    setWh : function(prop){
      _$.extend(this.cv , 
        typeof prop =='string'&& prop.trim()=='full' && {width:this.full_width,height:this.full_height}||
        prop
      );
      this.bw = this.cv.width;
      this.initial('fix');
  
    },
    draw: function(t) {
      this.ar.forEach(function(o) {
        o.draw(t);
      });
    },
    add: function(o) {
      var args = _$.toArray(arguments).recursiveAr();

      Array.from(args).forEach(function(a){

        a.ctx = this.ctx;
        a.stage = this;
        this.ar.push(a);

      },this);

      this.ar = this.ar.sort(function(a,b){
        return b.z-a.z;
      });
    },
    
    remove: function(e) {
      this.ar.remove(e);
    },
    
    clear: function() {
      this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    },
    render : function(fn){
      var that = this;
  
      (function callee(t) {
  
        that.tv = requestAnimationFrame(callee);
  
        if (!that.run || !t)
          return;
  
        that.clear();


        //这里就外面和里面的绘制顺序。。。
        fn && fn.call(that,t ,that.ctx);
        
        that.draw(t);


        

        //升序 z 
        that.ar = that.ar.sort(function(a, b) {
          return a.z - b.z;
        });
       // console.log(that.ar[0].z);
        //console.log(that.ar.length)
  
        

      })();
      
      
    }

  },{
    idx:0
  });
  
  Plane = _$.Event.extend({
    init : function(prop){
      prop = prop || {};
      this.color = prop.color || 'black';
      this.wireframe = prop.wireframe || false;
      this.opacity = prop.opacity || 1;
      this.x = prop.x || 0;
      this.y = prop.y || 0;
      this.z = prop.z || 0;
      this.vx = this.vy = 0;
      this.map = prop.map || false;
      this.rotation = prop.rotation || 0;
      this.scale_x = 1;
      this.scale_y = 1;
      this.cidx = 'dwq_plane_'+Stage.idx++;
      
      
      if(this.map){
        this.s = this.map.width/this.map.height;
        this.width = prop.width||this.map.width;
        this.height = this.width/this.s;
        
        
      }else{
        
        this.width = prop.width || 100;
        this.height = prop.height || 100;
        
        this.s = this.width/this.height;
      };
      
      this.tx = this.width*0.5;
      this.ty = this.height*0.5;
      
      
      this.ctx = null;
    },
    inPath : function(x,y){
      this.createPath();
      return this.ctx.isPointInPath(x,y);
    },
    bound : function(s){
      return {
        left : function(){return this.x-this.tx},
        right : function(){return this.x+this.tx},
        top : function(){return this.y-this.ty},
        bottom : function(){return this.y+this.ty}
      }[s.trim()].call(this);
    },
  
    createPath : function(){
      var ctx = this.ctx;
      ctx.save();
      
      ctx.translate(this.x,this.y);
      ctx.scale(this.scale_x,this.scale_y);

      ctx.rotate(this.rotation);
      
      ctx.beginPath();
      ctx.rect(-this.tx,-this.ty,this.width,this.height);
      
      ctx.closePath();
      ctx.restore();
    },
    
    draw : function(){
      var ctx = this.ctx;
      ctx.save();
      
    
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.scale(this.scale_x,this.scale_y);
        ctx.rotate(this.rotation);
    
        if(this.map){
          ctx.drawImage(this.map,-this.tx,-this.ty,this.width,this.height);
        };
        ctx.restore();
        
      
        this.createPath();
        if(!this.map){
          ctx[this.wireframe ? 'stroke':'fill']();
        }else{
          this.wireframe && ctx.stroke();
        };
      
      ctx.restore();
    }
    
  });
  
  Circle = _$.Event.extend({
    init : function(prop){
      prop = prop || {};  

      _$.extend(this , prop);

      this.color = prop.color || 'black';
      this.wireframe = prop.wireframe || false;
      this.opacity = prop.opacity || 1;
      
      
      this.cidx = 'dwq_circle_'+Stage.idx++;
      this.map = prop.map || false;
      
      this.x = prop.x||0;
      this.y = prop.y||0;
      this.z = prop.z || 0;
      
      this.vx = this.vy = 0;
      this.radius = prop.radius || 50;
      this.rotation = prop.rotation || 0;

      this.drags = 0;
    
      if(!this.map){
        this.s = 1;
        this.width = prop.radius*2;
        this.height = this.width/this.s;
        this.tx = this.width*0.5;
        this.ty = this.height*0.5;
        
        
        return;
      };
      this.s = this.map.width/this.map.height;
      this.width = this.radius*2;
      this.height = this.width/this.s;
      this.tx = this.width*0.5;
      this.ty = this.height*0.5;
      
    },
    inPath : function(x,y){
      this.createPath();
      return this.ctx.isPointInPath(x,y);
    },
    createPath : function(){
      var ctx = this.ctx;
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.arc(0,0,this.radius,0,Math.PI*2);
      ctx.closePath();
      
      ctx.restore();
    },
    bound : function(s){
      return {
        left : function(){return this.x-this.tx},
        right : function(){return this.x+this.tx},
        top : function(){return this.y-this.ty},
        bottom : function(){return this.y+this.ty}
      }[s.trim()].call(this);
    },
    draw : function(){
      var ctx = this.ctx;
      ctx.save();
  
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        
        
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation);
        if(this.map){
          ctx.drawImage(this.map,-this.tx,-this.ty,this.width,this.height);
        };
        ctx.restore();
        
        
        
        this.createPath();
        if(!this.map){
          ctx[this.wireframe ? 'stroke':'fill']();
        }else{
          this.wireframe && ctx.stroke();
        };
      
      ctx.restore();
    }
    ,drag(s){
      if(s=='run'){
        return this.drags = 1;
      };
      this.drags = 0;
    }
    
  });
  
  Line = Class.extend({
    init : function(prop){
      prop = prop || {};
      this.len = prop.len || 50;
      this.radian = prop.radian || 0;
      this.line_width = prop.line_width || 1;
      this.x = prop.x || 0;
      this.y = prop.y || 0;
      this.color = prop.color || 'black';
      this.opacity = prop.opacity || 1;
      
      this.cidx = 'dwq_line_'+Stage.idx++;
      
      
    },
    draw : function(){
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.lineWidth = this.line_width;
      ctx.lineJoin ='round';
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(this.x2(),this.y2());
      
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    },
    x2 : function(){
      return this.x + cos(this.radian)*this.len;
    },
    y2 : function(){
      return this.y + sin(this.radian)*this.len;
    },
    dx : function(){
      return cos(this.radian)*this.len;
    },
    dy : function(){
      return sin(this.radian)*this.len;
    },
    nv : function(){
      return new _$.Vec(this.x2()-this.x,this.y2()-this.y).vertical().normal();
    }
    
  });
  Bez2 = Class.extend({
    init : function(prop){
      prop = prop || {};
      this.x = prop.x || 0;
      this.y = prop.y || 0;
      this.cpx = prop.cpx || 0;
      this.cpy = prop.cpy || 0;
      this.finx = prop.finx || 0;
      this.finy = prop.finy || 0;
      
      this.color = 'black';
      this.line_width = 1;
      this.opacity = 1;
      this.cidx = 'dwq_bez2_'+Stage.idx++;
    },
    draw : function(){
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.lineWidth = this.line_width;
      ctx.lineJoin ='round';
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.quadraticCurveTo(this.cpx , this.cpy , this.finx,this.finy);
      
      ctx.stroke();
      
      ctx.restore();
    }
  });

  var Bez2Cross = function(prop){
    _$.extend(this , prop || {});
    this.color = 'black';
    this.line_width = 1;
    this.opacity = 1;
    this.cidx = 'dwq_bez2_'+Stage.idx++;

    this.cs_cpx;
    this.cs_cpy;

    Object.defineProperties(this,{
      cs_cpx : {
        get : function(){
          return this.cpx*2 - (this.x+this.finx)*.5;
        }
      }
      ,cs_cpy : {
        get : function(){
          return this.cpy*2 - (this.y+this.finy)*.5;
        }
      }
    });
  };
  Bez2Cross.prototype = Object.create({
    draw : function(){
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.lineWidth = this.line_width;
      ctx.lineJoin ='round';
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.quadraticCurveTo(this.cs_cpx , this.cs_cpy , this.finx,this.finy);
      
      ctx.stroke();
      
      ctx.restore();
    }
  });
  
  Sprite = _$.Event.extend({
    init : function(prop){
      prop = prop || {};
      if(!prop.map)
        return;
      //console.log(prop.map);
      this.steps = prop.steps||1;
      this.i = 0;
      this.ts = prop.ts || 66;
      
      this.steps_w = 0;
      
      this.bef_t = null;
      
      this.pos_ar = [];
      this.wireframe = prop.wireframe || 0;
      this.map = prop.map;
      
      this.cidx = 'dwq_sprite_'+Stage.idx++;
           
      //原始图片比
      this.s = this.map.width/this.map.height;
      
      this.width = prop.width || this.map.width;
      this.height = this.map.height;
      
      this.radius = 0;
      
      
      //宽度的比
      this.sss = this.width/this.map.width;
      
      
      //console.log(this.width,this.height);
      
      this.x = prop.x || 0;
      this.y =prop.y || 0;
      this.z = prop.z || 0;
      this.vx = this.vy = 0;
      
      this.rotation = 0;
      this.scale_x = this.scale_y = 1;
      this.opacity = 1;
    
      
      
      this.ctx = null;
      this.ts_run = true;
    
      
      this.createPos();
      
      
      
    },
    
    inPath : function(x,y){
      this.createPath();
      return this.ctx.isPointInPath(x,y);
    },
    createPos : function(){
      var ii = 1/this.steps,i;
      this.steps_w = this.map.width*ii;
      
      this.tx = this.steps_w*this.sss*0.5;
      this.ty = this.map.height*this.sss*0.5;
      //this.tx = this.width*0.5;   
      this.radius = min(this.tx,this.ty);
      
      for(i = 0;i<this.steps;i++)
        this.pos_ar.push(i*ii*this.map.width);
      
    },
    
    createPath : function(){
      var ctx = this.ctx;
      ctx.save();
      
      ctx.translate(this.x,this.y);
      
      ctx.rotate(this.rotation);
      
      ctx.beginPath();
      ctx.rect(-this.tx,-this.ty,this.tx*2,this.height*this.sss);
      
      ctx.closePath();
      ctx.restore();
    },
    loop : function(){
      this.ts_run=true;
    },
    stop : function(s){
      this.ts_run=false;
      if(s && s.trim()=='reset'){
        this.i = 0;
      };
    },
    draw : function(t){
    
      var ctx = this.ctx;
      ctx.save();
    
        ctx.globalAlpha = this.opacity;
        
        
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.scale(this.scale_x,this.scale_y);
        ctx.rotate(this.rotation);
        
        
        if(this.ts_run){
          
          if(!this.bef_t || t -this.bef_t>this.ts){
            this.bef_t =  t;
            this.i = ++this.i%this.steps;
          };
        };
        
        
      
        ctx.drawImage(this.map,
          this.pos_ar[this.i],0,this.steps_w,this.height,
          
          -this.tx,-this.ty,this.steps_w*this.sss,this.height*this.sss
        );
        

        ctx.restore();
      
      if(this.wireframe){
        this.createPath();
        ctx.stroke();
      };
      
      ctx.restore();
    }
  });
  
  Polygon = Class.extend({});
  


  //by 戴戴戴
  //2015-09-20
  return{
    Stage : Stage,
    Plane : Plane,Circle:Circle,
    Line:Line,Bez2:Bez2,
    Bez2Cross : Bez2Cross,
    Sprite : Sprite , Polygon:Polygon
    
  };
}();


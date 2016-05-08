(!Object.getOwnPropertyNames && 
'cos,sin,tan,atan,atan2,acos,asin,ceil,floor,round,sqrt,log,random,max,min,abs,pow,PI,E'.split(',') ||
Object.getOwnPropertyNames(Math))
.forEach(function(s){
  s = s.trim();
  window[s] = Math[s];
});
(function(ar){

  var f = function(s,fn){
    
    window[s.replace(/./,function(a){
      return a.toLowerCase();
    })] = function(ar){
      var ss = ar[0]+s;
      
      return window[ss]  || !ar.length &&  fn ||
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

const extend = function(){
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
            child[s] =  o[s] instanceof Array?[]:{}
          );
        };
        
      }else{
        child[s] = o[s];
      };
    });

    return child;

  };

  return function(o1,o2){
    if(!o2) return console.warn('...');
    [].slice.call(arguments , 1).forEach(function(o2){
      var oo = _(o2);
      Object.keys(oo).forEach(function(s){
        o1[s] = oo[s];
      });
    }); 
    return o1;
  }
}();

const MxEvent = {
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
const Vec = function(){
  this.init.apply(this,arguments);
};
Vec.prototype = Object.create({
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
    return this.x*vec.x + this.y*vec.y;
  },
  cross : function(vec){
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

export default {
  MxEvent : MxEvent
  ,extend : extend
  ,Vec : Vec
}
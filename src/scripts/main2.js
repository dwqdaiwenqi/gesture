/*********************************************************
Author: 戴戴戴(2540546236@qq.com)
Latest: 16-05-08
*********************************************************/


import Miku from './Miku';

import {gesture} from './gesture';

const {MxEvent,Vec,extend} = Miku;


void function(g){
  const N = 'GestureAlbum' || 'Miku~~';
  const d = document;
  const $ = o=>{ return typeof o=='string'&&d.querySelector(o)||o; }

  const getFileImage = (el,fn)=>{ 
    el.addEventListener('change',()=>{
      const frd = new FileReader();
      frd.addEventListener('load',()=>{
        const pic = d.createElement('img');
        pic.addEventListener('load',()=>{
          fn(pic);
        });
        pic.src = frd.result;
      });
      frd.readAsDataURL(el.files[0]);
    });
  };

  const installTouchs = o=>{
    var ar = [];
    for(let i = 0,len=o.length;i<len;++i){
      ar[i] = {
        x : o[i].pageX
        ,y : o[i].pageY
      }
    }
    return ar;
  }

 
  const Stg = {
    initial(prop){

      this.prop = prop;

      this.cv = d.createElement('canvas');
      this.ctx = this.cv.getContext('2d');
      this.cv.width = place.offsetWidth;
      this.cv.height = place.offsetHeight;

      this.itv = this.run =0;

      prop.place.innerHTML = '';


      prop.place.appendChild(this.cv);

      this.gestruneRun();

    }
    ,gestruneRun(){


      const ges = gesture('scale,rotate,drag',{
        min_scale:this.prop.min_scale
        ,max_scale:this.prop.max_scale
      });

      ges.custom('scale' , (point1,point2,s)=>{
       
      });
     
      this.cv.addEventListener('touchstart',e=>{
        e.preventDefault();
      });

      this.cv.addEventListener('touchmove',e=>{
        const touchs = installTouchs(e.targetTouches);
        
        if(!touchs.some((o)=>{
          return Stg.ctx.isPointInPath(o.x,o.y);
        }) ) return ;
        
        let p1 = touchs[0];

        if(touchs.length==2){
          
          let p2 = touchs[1];

          let minx = min(p1.x,p2.x);
          let miny = min(p1.y,p2.y);

          let cx = minx+(max(p1.x,p2.x)-minx)*.5;
          let cy = miny+(max(p1.y,p2.y)-miny)*.5;

          ges.execute({ 
            point1:{x:p1.x  ,y:p1.y } 
            ,point2:{x:p2.x ,y:p2.y}
          });

        }
        if(touchs.length==1) ges.drag.execute({point1:{x:p1.x  ,y:p1.y } });
   
      });
      this.cv.addEventListener('touchend',e=>{
        ges.resolve();
        ges.drag.resolve();

      });
      this.cv.addEventListener('touchcancel',e=>{
        ges.resolve();
        ges.drag.resolve();
        
      });

      ges.on('scale',o=>{
        //console.log(o.scale);
        Mat.fin_sss =  o.scale;
      });
      ges.on('rotate',o=>{
        Mat.sin = sin(o.rotation);
        Mat.cos = cos(o.rotation);
      });
      ges.on('drag',o=>{
        Mat.xx+=o.dx;
        Mat.yy+=o.dy;
       // console.log(o);
      });
    }
    ,ctx:null,cv:null
    ,render(fn){
      var me = this;

      (function callee(){
       
        me.itv = requestAnimationFrame(callee);
        if(!me.ctx) return;

        me.ctx.clearRect(0,0,me.cv.width,me.cv.height);

        fn(+new Date);

      })();
      

    }

  }

  const Mat ={
    tx:0,ty:0
    ,xx:0,yy:0
    ,sin:sin(0),cos:cos(0)
    ,sss:1
    ,fin_sss:1
    ,stop : 0
    ,initial(){
      this.stop = this.tx=this.ty
      =this.xx=this.yy=0;
      this.sss = this.fin_sss=1;
      this.sin = sin(0),this.cos=cos(0);
    }
    ,anm(t){
      if(this.stop) return;
      this.sss += (this.fin_sss-this.sss)*.2;
    }
  };

  const Draw = function(){
    const pw = .8;
    const Draw = {
      initial(prop){
        this.map = prop.map;

        const map = this.map;
        
        map.sss = map.height/map.width;
        map.width = prop.place.offsetWidth*pw;
        map.height = map.width*map.sss;
        map.tx = map.width*.5;
        map.ty = map.height*.5;
    
      }
      ,createPath(){
        const ctx = Stg.ctx;

        ctx.beginPath();

        ctx.setTransform(Mat.sss,0,0, Mat.sss,Mat.xx+Mat.tx,Mat.yy+Mat.tx);

        ctx.transform(Mat.cos,Mat.sin,-Mat.sin,Mat.cos,0,0);
 
        ctx.transform(1,0,0, 1,-this.map.tx,-this.map.ty);

        ctx.rect(0,0,this.map.width,this.map.height);

        ctx.closePath();
      }
      ,photo(){
        const ctx = Stg.ctx;

        ctx.save();
        this.createPath();

        ctx.drawImage(this.map,0,0,this.map.width,this.map.height);

        ctx.restore();
      }
    };
    return Draw;
  }();

  const GestureAlbum = (prop)=>{
     
    prop.place = $(prop.place)
    prop.file = $(prop.file);

    getFileImage(prop.file,map=>{

      prop.map = map;

      Draw.initial(prop);
      Stg.initial(prop);
      //console.log(Draw);
      Mat.initial();

      Mat.xx = Draw.map.tx;
      Mat.yy = Draw.map.ty;

     



     
    });
    Stg.render(t=>{
       Draw.photo();
       Mat.anm(t);
    });


    const GestureAlbum = Object.create({
      ex(){

      }
    });
    return GestureAlbum;
  };
  g[N] = GestureAlbum;
}(Function('return this')());


const gam = GestureAlbum({
  place:'#place'
  ,file : '#file1'
  ,max_scale:2
  ,min_scale:.8
  ,visible_circle:1
});


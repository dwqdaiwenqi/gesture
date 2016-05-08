import Miku from './Miku';

const {MxEvent,Vec,extend} = Miku;

export function gesture(s,prop){
  const methods = s.split(/,/).map(s=> s.trim());
  const _ = {
    scale : {
      execute(pos){
        //console.log(pos);
        const {point1,point2} = pos;
        const len = (new Vec(
          point1.x - point2.x
          ,point1.y - point2.y
        )).length();

        if(!this.blen) this.blen = len;

        const s = (len/this.blen)*this.bs;
        this.sss = s;


        this.custom && this.custom(point1,point2,s);
       
        gesture.trigger('scale' , {scale:s});
      }
      ,resolve(){
        this.bs = this.sss;
        this.blen = 0;

        this.bs = max(prop.min_scale , min(this.bs ,prop.max_scale));

        gesture.trigger('scale' , {scale:this.bs});

      }
      ,bs : 1 ,sss : 1
      ,blen : 0
    }
    ,drag : {
      execute(pos){       
        const {point1} = pos;
        if(!this.bv) this.bv = new Vec(point1.x,point1.y);
        const dx = point1.x - this.bv.x;
        const dy = point1.y - this.bv.y;
        this.bv.x = point1.x,this.bv.y=point1.y;
        gesture.trigger('drag',{dx,dy});
      }
      ,bv : 0
      ,resolve(){
        this.bv = 0;
      }
    }
    ,rotate : {
      execute(pos){
        const {point1,point2} = pos;
        var v = (new Vec(
           point1.x - point2.x
          ,point1.y - point2.y
        )).normal();

        if(!this.bvec) this.bvec = v;

        const rd = asin(v.cross(this.bvec)*-1);

        this.rotation = this.br + rd;

        this.custom && this.custom(point1,point2,this.rotation);

        gesture.trigger('rotate', {
          rotation: this.rotation
        });
      }
      ,resolve(){
        this.bvec = 0;
        this.br = this.rotation;
      }
      ,bvec : 0
      ,br: 0
      ,rotation: 0
      
    }
  };
  var gesture = {
    execute(pos){

      methods.forEach((s)=>{
        _[s].execute(pos);
      }); 

    }
    ,custom(s,fn){
      _[s.trim()].custom = fn;
    }
    ,resolve(){
      methods.forEach((s)=>{
        _[s].resolve();
      }); 
    }
  };

  extend(gesture , MxEvent , _);
  
  return gesture;
}

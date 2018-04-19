var Structures = {
    alpha: { name: "100°- alpha helix",  angle : 100 , round:18},
    h310: { name: "111°- 3.10 helix", angle: 111 , round:14} , 
    polip: { name: "120°- polipro helix", angle: 120, round:3} , 
    twist : { name: "160°- twisted beta strand", angle: 160, round:9} , 
    beta : { name: "180°- extended", angle: 180, round:2 },

   getList: function(){
        var keys = Object.keys(this); 
        for (var i = keys.length; i>=0 ; i--){
            if (typeof this[keys[i]] === 'function'){
               keys.splice(i,1);
            }
        }
        return keys;
   }, 
  
};
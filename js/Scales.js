var Scales={
   loadAAindexFileContent: function(content){
     console.log('N/A');  
   },
   getList: function(){
        var keys = Object.keys(this); 
        for (var i = keys.length; i>=0 ; i--){
            if (typeof this[keys[i]] === 'function'){
               keys.splice(i,1);
            }
        }
        return keys;
   }, 
 
    average : function(a) {
      var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
      for(var m, s = 0, l = t; l--; s += a[l]);
      for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
      return r.deviation = Math.sqrt(r.variance = s / t), r;
    },
    
   getDeviationalNormalization: function(scaleName){
       var self = this;
       if (self[scaleName]===undefined) return null;
       var scale =JSON.parse(JSON.stringify(self[scaleName]));
       var keys = Object.keys(scale); 
       var arr = [];
       for (var i = keys.length; i>=0 ; i--){
           if (scale[keys[i]] != undefined) arr.push(scale[keys[i]]);
       }
       
       var std = this.average( arr).deviation;
       if (std == null) return null;
       for (var i = keys.length; i>=0 ; i--){
           var val = scale[keys[i]]/std;
           scale[keys[i]] = val;
       }
       delete scale['undefined'];
       return scale;
   },
   getAllScalesNormalized: function(byDeviation){
        var self = this;
        var scaleNames = this.getList();
        var allScales = JSON.parse(JSON.stringify(self));
        for (var i = 0 ; i < scaleNames.length ; i++){
            allScales[scaleNames[i]] = (byDeviation)
                ? this.getDeviationalNormalization(scaleNames[i])
                : this.getNormalizedScale(scaleNames[i]);
        }
        return allScales;
   },
   addExtraScale:function(scaleName, values){
       
   },
   getNormalizedScale:function(scaleName){
       var self = this;
       if (self[scaleName]===undefined) return null;
       var scale =JSON.parse(JSON.stringify(self[scaleName]));
       var minVal=null;
       var maxVal = null;
       var keys = Object.keys(scale); 
       for (var i = keys.length; i>=0 ; i--){
           if (minVal == null){
               minVal = scale[keys[i]];
               maxVal = scale[keys[i]];
               continue;
           }
           if (scale[keys[i]]<minVal) minVal = scale[keys[i]];
           if (scale[keys[i]]>maxVal) maxVal = scale[keys[i]];
       }
       
       for (var i = keys.length; i>=0 ; i--){
           var val = scale[keys[i]];
           val = (val - minVal)/(maxVal - minVal);
           scale[keys[i]] = 2*(val-0.5);
       }
       delete scale['undefined'];
       return scale;
   },
   dec2color:function(r,g,b){
        if (r == null) return null;
        var color = [];
        color.push('#');
        
        var tmp='0'+parseInt(r, 16);
        color.push(tmp.slice(-2));
        
        tmp='0'+parseInt(g, 16);
        color.push(tmp.slice(-2));
        
        tmp='0'+parseInt(b, 16);
        color.push(tmp.slice(-2));
        
        return color.join("");
    },
   getColors:function(scaleName){
        var scale = this.getNormalizedScale(scaleName);
        if (scale === null) return null;
        var keys = Object.keys(scale); 
        for (var i = keys.length; i>=0 ; i--){
            var val = scale[keys[i]];
            val = this.dec2color(Math.round((val<0)?255*(1-val):255*val),0,Math.round((val>0)?255*(1-val):Math.abs(255*val)));
            scale[keys[i]] = val;
        }
         delete scale['undefined'];
        return scale;
   },
  CCS:{
		Ile : 8.7,
		Leu : 9.7,
		Trp : 9.7,
		Phe : 10,
		Val : 4.1,
		Met : 4.6,
		Tyr : 2.5,
		Ala : -1.1,	
		Pro : -0.2,
		Thr : -3.8,
		Ser : -4.3,	
		Cys : -2.3,
		Gly : -2.4,
		Asn : -7.1,
		Asp : -8.3,
		Gln : -6.0,
		Glu : -8.3,
		His : -3.8,
		Lys : -9.9,
		Arg : -10,
		
		Aib : 1.1,
		Abu : 1.7,
		Nle : 9.1,
		Orn : -9.0,
		Dpg : 13, 
		Deg : 6.0, 
		Nva : 5.3, 
		Hse : -3.5, 
		Dap : -9.5, 
		Dab : -9.3, 
  },   
  GCS:{
		Ile : 10.00,
		Leu : 8.94,
		Trp : 6.76,
		Phe : 9.30,
		Val : 6.16,
		Met : 7.04,
		Tyr : 2.14,
		Ala : -0.28,	
		Pro : -2.71,
		Thr : -4.29,
		Ser : -5.87,	
		Cys : 3.21,
		Gly : -2.69,
		Asn : -7.17,
		Asp : -10.00,
		Gln : -7.43,
		Glu : -9.18,
		His : -2.88,
		Lys : -9.88,
		Arg : -9.84,
		
		Aib : 0.50,
		Abu : 1.10,
		Nle : 9.80,
		Orn : -8.10,
		Dpg : 12.8,
		Deg : 7.40,
		Nva : 5.50,
		Hse : -8.50,
		Dap : -5.00,
		Dab : -8.00,
  },
  XCS: {
        Ile : 7.79,
		Leu : 9.09,
		Trp : 10.00,
		Phe : 9.37,
		Val : 3.57,
		Met : 4.06,
		Tyr : 4.38,
		Ala : -1.40,	
		Pro : -0.45,
		Thr : -3.58,
		Ser : -4.53,	
		Cys : -2.56,
		Gly : -4.18,
		Asn : -6.97,
		Asp : -8.24,
		Gln : -6.03,
		Glu : -8.26,
		His : -4.04,
		Lys : -8.23,
		Arg : -10.00,
		 
		Aib : 0.30,
		Abu : 1.00,
		Nle : 9.30,
		Orn : -8.00,
  },
  KyDo:{
        Ile : 4.50,	
		Leu : 3.80,	
		Trp : -0.90,	
		Phe : 2.80,	
		Val : 0.54,	
		Met : 1.90,	
		Tyr : -1.30,	
		Ala : 1.80,	
		Pro : -3.20,	
		Thr : -0.70,	
		Ser : -0.80,	
		Cys : 2.50,	
		Gly : -0.40,	
		Asn : -3.50,	
		Asp : -3.50,	
		Gln : -3.50,	
		Glu : -3.50,	
		His : -3.20,	
		Lys : -3.90,	
		Arg : -4.50,
  },
  Eisenberg:{
      	Ile : 0.73,	
		Leu : 0.53,	
		Trp : 0.37,	
		Phe : 0.61,	
		Val : 0.54,	
		Met : 0.26,	
		Tyr : 0.02,	
		Ala : 0.25,	
		Pro : -0.07,	
		Thr : -0.18,	
		Ser : -0.26,	
		Cys : 0.04,	
		Gly : 0.16,	
		Asn : -0.64,	
		Asp : -0.72,	
		Gln : -0.69,	
		Glu : -0.62,	
		His : -0.40,	
		Lys : -1.10,	
		Arg : -1.80,
  }
    
};
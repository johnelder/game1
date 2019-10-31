exports.roll = function(count,size){
    size = size || 2;
    count = count || 1;

    var ans = (parseInt(Math.random()*(size*count)+count)-count)+1;
    // console.log("Roll: "+count+" "+size+" sided dice = "+ans);
    return ans;
}
exports.objFind = function(v,k,o){
	var result = undefined;
  Object.keys(o).forEach(function(key) {
      if(o[key].hasOwnProperty(k)){
        if(o[key][k] == v) {
          result = o[key];
        }
      }
  });
  return result;
}



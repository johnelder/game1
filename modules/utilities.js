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

exports.createId = function(obj,key,num,max){
    var loopCount = 0
    max = max || 1000;
    num = num || Math.floor(Math.random() * max);
    key = key || "x";
    checkKey:while(loopCount < max){
        var tmpId = key + num;
        if (obj[tmpId]){
            loopCount++;
            continue checkKey;
        } else {
            id = tmpId;
            break checkKey;
        }
    }
    return tmpId;
}

exports.toNum = function(num,target,chng = 0.5){
    var newNum = target;
    if(num > target){
        newNum = num - chng;
    } else if(num < target){
        newNum = num + chng;
    }
    return newNum;
}

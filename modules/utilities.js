exports.roll = function(count,size){
    size = size || 2;
    count = count || 1;

    var ans = (parseInt(Math.random()*(size*count)+count)-count)+1;
    // console.log("Roll: "+count+" "+size+" sided dice = "+ans);
    return ans;
}

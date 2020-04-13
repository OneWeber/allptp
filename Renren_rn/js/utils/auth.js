export function objRemoveDuplicated(arr) {
    var tmepArr = [];
    // 将数组对象转成数组字符串
    var newStr = changeArrStr(arr);
    newStr.sort();
    // 数组去重
    for(var i=0;i<newStr.length;i++){
        if(newStr[i] !== tmepArr[tmepArr.length-1]){
            tmepArr.push(newStr[i]);
        }
    }
    var newArr = [];
    // 新数组字符串转成数组对象
    for(var i=0;i<tmepArr.length;i++){
        newArr.push(JSON.parse(tmepArr[i]));
    }
    return newArr
}
function changeArrStr(arr){
    var newArr = [];
    if(arr.length !== 0){
        for(var i=0;i<arr.length;i++){
            var thisObj = sortObjectFun(arr[i]);
            var thisStr = JSON.stringify(thisObj);
            thisStr = thisStr.replace(/(\s|[\\t])/g,''); // 去除空格及\t空白字符
            newArr.push(thisStr);
        }
    }
    return newArr;
}
function sortObjectFun(obj){
    var keyArr = [];// 对象的key
    for(var item in obj){
        keyArr.push(item);
    };
    keyArr.sort(); // 降序
    var newObj = {};
    for(var i=0;i<keyArr.length;i++){
        newObj[keyArr[i]] = obj[keyArr[i]]
    }
    return newObj;
}

export function getDaysOfMonth(year, month) {
    var day = new Date(year, month, 0)
    var dayCount = day.getDate()
    return dayCount
}
export function getFirstDay(year, month) {
    var day = new Date(year, month - 1)
    var dayCount = day.getDay()
    if (dayCount == 0) {
        dayCount = 7
    }
    return dayCount
}
export function removeDuplicatedItem(arr) {//数组去重
    for(var i = 0; i < arr.length-1; i++){
        for(var j = i+1; j < arr.length; j++){
            if(arr[i]==arr[j]){
                arr.splice(j,1);//console.log(arr[j]);
                j--;
            }
        }
    }
    return arr;
}
Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
};
export function getAll(begin, end) {
    var arr = [];
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (var k = unixDb; k <= unixDe;) {
        //console.log((new Date(parseInt(k))).format());
        k = k + 24 * 60 * 60 * 1000;
        arr.push((new Date(parseInt(k))).format());
    }
    return arr;
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
   //return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//将秒数转换为时分秒格式
function timeToFormat(times) {
  var result = '00:00:00';
  var hour, minute, second
  if (times > 0) {
    hour = Math.floor(times / 3600);
    if (hour < 10) {
      hour = "0" + hour;
    }
    minute = Math.floor((times - 3600 * hour) / 60);
    if (minute < 10) {
      minute = "0" + minute;
    }

    second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
    if (second < 10) {
      second = "0" + second;
    }
     //result = hour + ':' + minute + ':' + second;
    result = minute + ':' + second;
  }
  return result;
}
function formatTime1(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}
/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
 function getToday(d) {
  //获取年
  var year = d.getFullYear();
  // 获取月份(注意月份是从0开始，需要修正)
  var month = d.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  // 获取日期
  var day = d.getDate();
  day = day < 10 ? '0' + day : day;
  return year + '-' + month + '-' + day;

}
var filters = {
  toFix: function (value, count) {
    var num = Number(value)
    return num.toFixed(count)
  }
}
function trim(str, is_global) {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (is_global.toLowerCase() == "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}

module.exports = {
  formatTime: formatTime,
  formatTime1: formatTime1,
  timeHandle: commentTimeHandle,
  toFix: filters.toFix,
  timeToFormat: timeToFormat,
  getToday: getToday,
  formatDate2: formatDate2,
  formatDate3: formatDate3,
  getCurrentPageUrl: getCurrentPageUrl,
  trim: trim
 // getDateDiff: getDateDiff
}

function formatDate2(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}
function formatDate3(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  return y + '.' + m + '.' + d + ' ' + h + ':' + minute;
}
//将string格式日期转换为“/”连接只包含月日的日期
const formatDateToSimple = data => {
  var date = new Date(Date.parse(data));
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [month, day].join('/')
}
//获取当前日期，以“-”连接
const formatDateByH = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
//获取当前日期，以“/”连接
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}

// 编码，配合encodeURIComponent使用
function base64_encode(str) { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0, len = str.length, strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}
// 解码，配合decodeURIComponent使用
function base64_decode(input) { // 解码，配合decodeURIComponent使用
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}
// function getDateDiff(dateTimeStamp) {
//   var result;
//   var minute = 1000 * 60;
//   var hour = minute * 60;
//   var day = hour * 24;
//   var halfamonth = day * 15;
//   var month = day * 30;
//   var now = getDate();//有些特殊 不能使用 new Date()
//   var diffValue = now - dateTimeStamp;
//   if (diffValue < 0) { return; }
//   var monthC = diffValue / month;
//   var weekC = diffValue / (7 * day);
//   var dayC = diffValue / day;
//   var hourC = diffValue / hour;
//   var minC = diffValue / minute;
//   if (monthC >= 1) {
//     result = "" + parseInt(monthC) + "月前";
//   }
//   else if (weekC >= 1) {
//     result = "" + parseInt(weekC) + "周前";
//   }
//   else if (dayC >= 1) {
//     result = "" + parseInt(dayC) + "天前";
//   }
//   else if (hourC >= 1) {
//     result = "" + parseInt(hourC) + "小时前";
//   }
//   else if (minC >= 1) {
//     result = "" + parseInt(minC) + "分钟前";
//   } else
//     result = "刚刚";
//   return result;
// }//时间戳转化为几天前，几小时前，几分钟前

function commentTimeHandle(dateStr) {
  // dateStr = 2018-09-06 18:47:00" 测试时间
  var publishTime = dateStr / 1000,  //获取dataStr的秒数  打印结果--1536230820000
    date = new Date(publishTime * 1000), //获取dateStr的标准格式 console.log(date) 打印结果  Thu Sep 06 2018 18:47:00 GMT+0800 (中国标准时间)
    // 获取date 中的 年 月 日 时 分 秒
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  // 对 月 日 时 分 秒 小于10时, 加0显示 例如: 09-09 09:01
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  // if (H < 10) {
  //   H = '0' + H;
  // }
  // if (m < 10) {
  //   m = '0' + m;
  // }
  // if (s < 10) {
  //   s = '0' + s;
  // }
  // console.log("年", Y); // 年 2018
  // console.log("月", M); // 月 09
  // console.log("日", D); // 日 06
  // console.log("时", H); // 时 18
  // console.log("分", m); // 分 47
  // console.log("秒", s); // 秒 00
  var nowTime = new Date().getTime() / 1000, //获取此时此刻日期的秒数
    diffValue = nowTime - publishTime,  // 获取此时 秒数 与 要处理的日期秒数 之间的差值
    diff_days = parseInt(diffValue / 86400),    // 一天86400秒 获取相差的天数 取整
    diff_hours = parseInt(diffValue / 3600),    // 一时3600秒
    diff_minutes = parseInt(diffValue / 60),
    diff_secodes = parseInt(diffValue);

  if (diff_days > 0 && diff_days < 3) {  //相差天数 0 < diff_days < 3 时, 直接返出
    return diff_days + "天前";
  } else if (diff_days <= 0 && diff_hours > 0) {
    return diff_hours + "小时前";
  } else if (diff_hours <= 0 && diff_minutes > 0) {
    return diff_minutes + "分钟前";
  } else if (diff_secodes < 60) {
    if (diff_secodes <= 0) {
      return "刚刚";
    } else {
      return diff_secodes + "秒前";
    }
  } else if (diff_days >= 3 && diff_days < 30) {
    return M + '-' + D;
  } else if (diff_days >= 30) {
    return Y + '-' + M + '-' + D ;
  }
}
// module.exports = {
//   timeHandle: commentTimeHandle
// }

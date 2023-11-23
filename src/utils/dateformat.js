// const year = now.getFullYear();
// const month = ('0' + (now.getMonth() + 1)).slice(-2);
// const day = ('0' + now.getDate()).slice(-2);
// const hours = ('0' + now.getHours()).slice(-2);
// const minutes = ('0' + now.getMinutes()).slice(-2);
// const seconds = ('0' + now.getSeconds()).slice(-2);
//const formattedTime = year + month + day + hours + minutes + seconds;

// console.log(date.toJSON().replace(/[-T:Z.]/g, ''))
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
  }

export function formatDate(date, fmt) {
  console.log(date)
  console.log(fmt)
    if(!date){
      return '';
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  };
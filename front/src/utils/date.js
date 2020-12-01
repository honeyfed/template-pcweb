
const moment = require('moment');

/**
 * 解析YYYY-MM-DD格式日期，返回Date类型
 * @param {string} dateYmd
 * @return {Date}
 */
export function parseDateYmd(dateYmd) {
  let date = moment();
  try {
    date = moment(dateYmd, 'YYYY-MM-DD');
  } catch (e) {
    console.log(e);
  }
  return date.isValid() ? date.toDate() : new Date();
}

/**
 * 获得今天日期字符串，如2018-07-05
 * @return {string}
 */
export function getTodayYmd() {
  return moment().format('YYYY-MM-DD');
}

/**
 * 把时间戳转成日期字符串，如2018-07-05
 * @param {number} d 时间戳，单位是毫秒
 */
export function convertTimestampToYmd(d, str = 'YYYY-MM-DD') {
  return moment(d).format(str);
}

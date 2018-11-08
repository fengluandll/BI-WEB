import moment from 'moment';

const fixedZero = (val) => {
  return val * 1 < 10 ? `0${val}` : val;
};
/* 日期工具 */
export default {
  fixedZero,
  format: (date, fmt) => {
    let dateFmt = fmt;
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(dateFmt)) {
      dateFmt = dateFmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(dateFmt)) {
        dateFmt = dateFmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
      }
    }
    return dateFmt;
  },
  getMonth: (date) => {
    return date ? date.getMonth() + 1 : new Date().getMonth() + 1;
  },
  getFullYear: (date) => {
    return date ? date.getFullYear() : new Date().getFullYear();
  },
  getMonthStr: (date) => {
    const month = this.getMonth(date);
    return month < 10 ? `0${month}` : month;
  },
  /**
   * 取之前的月份
   * @param date  指定日期，不传则默认为当前月
   * @param num   指定前num个月，不传则默认为1
   * @returns {Date}
   */
  getPrevMonth: (date, num) => {
    const d = date || new Date();
    const n = isNaN(num) ? 1 : num;
    const month = this.getMonth(d) - 1;
    const year = this.getFullYear(d);
    return month - n <= 0 ? new Date(year - 1, (12 + month) - n) : new Date(year, month - n);
  },
  /**
   * 取之前的年份
   * @param date  指定日期，不传则默认为当前年
   * @param num   指定前num个年，不传则默认为1
   * @returns {Date}
   */
  getPrevYear: (date, num) => {
    const d = date || new Date();
    const n = isNaN(num) ? 1 : num;
    const year = this.getFullYear(d);
    return new Date(year - n, 1);
  },
  getTimeDistance: (type) => {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    if (type === 'today') {
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }
    if (type === 'week') {
      let day = now.getDay();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      if (day === 0) {
        day = 6;
      } else {
        day -= 1;
      }
      const beginTime = now.getTime() - (day * oneDay);
      return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
    }
    if (type === 'month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      const nextDate = moment(now).add(1, 'months');
      const nextYear = nextDate.year();
      const nextMonth = nextDate.month();
      return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
    }
    if (type === 'year') {
      const year = now.getFullYear();
      return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
    }
  },
};

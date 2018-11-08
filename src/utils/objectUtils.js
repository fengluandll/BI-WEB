/* 对象操作工具 */
const getClass = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1);
};
const deepClone = (o) => {
  let result;
  const oClass = getClass(o);
  // 确定result的类型
  if (oClass === 'Object') {
    result = {};
  } else if (oClass === 'Array') {
    result = [];
  } else {
    return o;
  }
  for (const key of Object.keys(o)) {
    const copy = o[key];
    if (getClass(copy) === 'Object') {
      result[key] = deepClone(copy);
    } else if (getClass(copy) === 'Array') {
      result[key] = deepClone(copy);
    } else {
      result[key] = o[key];
    }
  }
  return result;
};
export default{
  /**
   * 深度克隆对象
   * @param o
   * @returns {*}
   */
  deepClone: (o) => {
    return deepClone(o);
  },
  quickDeepClone: (o) => {
    return JSON.parse(JSON.stringify(o));
  },
  /**
   * 清除对象所有属性值
   * @param o
   */
  clearAllVal: (o) => {
    const oClass = getClass(o);
    // 确定result的类型
    if (oClass === 'Object') {
      const keys = Object.keys(o);
      for (const key of keys) {
        Object.defineProperty(o, key, {
          value: null,
        });
      }
    }
  },
  /**
   * 清除对象属性
   * @param o 指定对象
   * @param name 指定要清空的属性，未指定则清空所有属性
   */
  clearAttr: (o, name) => {
    const oClass = getClass(o);
    // 确定result的类型
    if (oClass === 'Object') {
      if (!name) {
        const keys = Object.keys(o);
        for (const key of keys) {
          delete o[key];
        }
      } else {
        delete o[name];
      }
    }
  },
  /**
   * 生成唯一键
   */
  generateUUID: () => {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + (Math.random() * 16)) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
    return uuid;
  },
  /**
   * 判断是否数字，不包含空字符
   * @param n
   * @returns {boolean}
   */
  isNumber: (n) => {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    return !isNaN(n) && reg.test(n) && n !== '';
  },
};
